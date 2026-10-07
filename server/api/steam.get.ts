import type { H3Event } from "h3";

interface SteamPlayer {
  personaname: string;
  profileurl: string;
  personastate: number;
  lastlogoff?: number;
  timecreated?: number;
  gameid?: string;
  gameextrainfo?: string;
}

interface SteamGame {
  appid: number;
  name: string;
  playtime_forever: number;
  playtime_2weeks?: number;
}

const PERSONA_STATES = ["offline", "online", "busy", "away", "snooze", "looking to trade", "looking to play"];

// On Cloudflare, env vars are only bound per request, so the config must be read through the event
function steamApi<T>(event: H3Event, path: string, query: Record<string, string | number>) {
  const { steamApiKey, steamId } = useRuntimeConfig(event);
  if (!steamApiKey) throw createError({ statusCode: 503, statusMessage: "NUXT_STEAM_API_KEY is not set" });
  return $fetch<T>(path, {
    baseURL: "https://api.steampowered.com",
    query: { key: steamApiKey, steamid: steamId, format: "json", ...query },
  });
}

// Status and playtime are cached separately so "currently playing" stays fresh without refetching the whole library every minute
const getStatus = defineCachedFunction(
  async (event: H3Event) => {
    const { steamId } = useRuntimeConfig(event);
    const { response } = await steamApi<{ response: { players: SteamPlayer[] } }>(event, "/ISteamUser/GetPlayerSummaries/v2/", { steamids: steamId });
    const player = response.players[0];
    if (!player) throw createError({ statusCode: 404, statusMessage: "Steam profile not found" });

    return {
      name: player.personaname,
      url: player.profileurl,
      state: player.gameextrainfo ? "in-game" : (PERSONA_STATES[player.personastate] ?? "offline"),
      playing: player.gameextrainfo ? { name: player.gameextrainfo, appid: Number(player.gameid) } : null,
      lastOnline: player.lastlogoff ? new Date(player.lastlogoff * 1000).toISOString() : null,
      memberSince: player.timecreated ? new Date(player.timecreated * 1000).toISOString() : null,
    };
  },
  // The event is only passed for config access; a constant key stops it from being hashed into the cache key
  { name: "steam-status", maxAge: 60, getKey: () => "status" },
);

const getLibrary = defineCachedFunction(
  async (event: H3Event) => {
    const { response } = await steamApi<{ response: { game_count?: number; games?: SteamGame[] } }>(event, "/IPlayerService/GetOwnedGames/v1/", {
      include_appinfo: 1,
      include_played_free_games: 1,
    });
    const games = response.games ?? [];
    const toEntry = (game: SteamGame) => ({
      appid: game.appid,
      name: game.name,
      minutes: game.playtime_forever,
      recentMinutes: game.playtime_2weeks ?? 0,
    });

    return {
      gameCount: response.game_count ?? games.length,
      totalMinutes: games.reduce((sum, game) => sum + game.playtime_forever, 0),
      top: games.toSorted((a, b) => b.playtime_forever - a.playtime_forever).slice(0, 6).map(toEntry),
      recent: games
        .filter((game) => (game.playtime_2weeks ?? 0) > 0)
        .sort((a, b) => (b.playtime_2weeks ?? 0) - (a.playtime_2weeks ?? 0))
        .slice(0, 6)
        .map(toEntry),
    };
  },
  { name: "steam-library", maxAge: 60 * 60, swr: true, getKey: () => "library" },
);

export default defineEventHandler(async (event) => {
  const [status, library] = await Promise.all([getStatus(event), getLibrary(event)]);
  return { ...status, ...library };
});
