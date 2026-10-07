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

function steamApi<T>(path: string, query: Record<string, string | number>) {
  const { steamApiKey, steamId } = useRuntimeConfig();
  if (!steamApiKey) throw createError({ statusCode: 503, statusMessage: "NUXT_STEAM_API_KEY is not set" });
  return $fetch<T>(path, {
    baseURL: "https://api.steampowered.com",
    query: { key: steamApiKey, steamid: steamId, format: "json", ...query },
  });
}

// Status and playtime are cached separately so "currently playing" stays fresh without refetching the whole library every minute
const getStatus = defineCachedFunction(
  async () => {
    const { steamId } = useRuntimeConfig();
    const { response } = await steamApi<{ response: { players: SteamPlayer[] } }>("/ISteamUser/GetPlayerSummaries/v2/", { steamids: steamId });
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
  { name: "steam-status", maxAge: 60 },
);

const getLibrary = defineCachedFunction(
  async () => {
    const { response } = await steamApi<{ response: { game_count?: number; games?: SteamGame[] } }>("/IPlayerService/GetOwnedGames/v1/", {
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
  { name: "steam-library", maxAge: 60 * 60, swr: true },
);

export default defineEventHandler(async () => {
  const [status, library] = await Promise.all([getStatus(), getLibrary()]);
  return { ...status, ...library };
});
