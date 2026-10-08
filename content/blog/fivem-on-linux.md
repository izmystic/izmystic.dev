---
title: "Running FiveM on Linux with Proton"
description: "Getting the FiveM client to start, pass the ownership check and join an FXServer under Proton, and what the server needs to let Linux players in."
authors:
  - name: izmystic
    avatar:
      src: https://github.com/izmystic.png
      target: _blank
    to: https://github.com/izmystic
date: 2026-10-07
badge:
  label: Guide
---

FiveM does not officially support Linux. The official client dies under Wine/Proton within a few seconds, and even after that it has to get past Rockstar's ownership check and a server that expects the anti-cheat. This post covers how I got the client running on Linux with Proton, how to set it up with either the **Steam** or the **Rockstar Games Launcher** copy of GTA V, and what a server needs so Linux players can join.

Everything here was tested on Fedora (KDE Plasma) with GTA V **Legacy**, Proton Experimental (Steam route), and both Proton Experimental and GE-Proton11-7 (Lutris route).

## What works and what doesn't

|                                                                 | Status                                                         |
| --------------------------------------------------------------- | -------------------------------------------------------------- |
| Client starts, main menu loads                                  | Works                                                          |
| Rockstar ownership check                                        | Works                                                          |
| Steam identifier (`steam:`) on the server                       | Works                                                          |
| Joining a server you run yourself, configured for Linux players | Works                                                          |
| Joining normal public servers                                   | **Does not work** (see below)                                  |
| `license:`, `discord:`, `fivem:` identifiers                    | **Not available**                                              |
| Menu UI                                                         | Works, see [known issues](#known-issues) if it's black or slow |

> **The big limitation:** under Wine, FiveM runs in _insecure mode_. It loads a stand-in (`sticky`) instead of the anti-cheat client, because the anti-cheat doesn't run under Wine. Current FXServer builds ship a server-side anti-cheat component (`svadhesive`) that serves resources through `ci://` URIs, which only the real anti-cheat client can load. The client then fails with _"Could not get resource mounter for resource …"_. There's no supported setting to turn that off, so **Linux players can't join normal FiveM servers.** That's Cfx's call, not something this guide gets around.

## Why the official client doesn't work

These are the problems I hit, in order, and how my fork of the client deals with them. You don't need to do anything about them yourself if you use the fork's build, but it helps to know what's going on when something breaks.

1. **The updater window crashes.** It's built with WinRT XAML Islands, which Wine doesn't implement. FiveM already has a plain Win32 fallback: setting `CitizenFX_NoTenUI=1` enables it, and the fork picks it automatically under Wine.
2. **Crash at `CoreRT.dll+1C471` about three seconds in.** A debugging hack in `DllGameComponent.Win32.cpp` writes to the 16 bytes before ntdll's `_fltused` export, to switch on loader logging. On Windows that's a writable variable. In Wine's ntdll, `_fltused` is a stub function in read-only code, so the write is an access violation. The fork skips that hack under Wine.
3. **Crash in `MSVCP140.dll` (`_Cnd_broadcast`)** when you compile the client yourself. The bundled C++ runtime (14.34) is older than the compiler used to build it (14.40+), whose `std::mutex`/`std::condition_variable` aren't compatible with older runtimes. The fork's CI bundles the runtime that matches the compiler.
4. **The menu UI is laggy and drawn in the wrong place.** Since 2019, FiveM has turned off GPU texture sharing for its browser-based menu under Wine, because Wine couldn't share D3D11 textures between processes back then. Every UI frame was copied through the CPU instead, which is slow. On top of that, this fallback never resized its texture when the game resolution changed, so the menu was drawn shifted and stretched while the clickable areas stayed in the right place. The fork fixes the resizing, and turns GPU texture sharing back on under Wine, since current Proton handles it.

The source is at [izmystic/fivem-linux](https://github.com/izmystic/fivem-linux). It builds on [RatPrez's](https://github.com/citizenfx/fivem/pull/4095) and [danfq's](https://github.com/danfq/fivem-linux) Wine work, and the shared-texture change comes from [Gogsi](https://github.com/Gogsi/fivem/commit/802559091ca1274b29bee15b07514b46388bd2da).

## Getting the client

Download `fivem-client.zip` from the [latest release](https://github.com/izmystic/fivem-linux/releases/latest). It contains a `FiveM` folder that's ready to use. Besides the client, it has an empty `FiveM.exe.formaldev` next to `FiveM.exe`. Leave that file there: without it, the launcher "updates" itself on start and replaces the Linux-fixed files with the official ones.

Keep **Steam running** whenever you play. That's what lets servers give you a `steam:` identifier. You don't need to add FiveM to your Steam library yourself; it gets added when you run it with Steam open.

## Route A: GTA V from Steam (recommended)

This is the easier route. Everything runs through Steam and stock Proton Experimental.

### 1. Install and launch GTA V once

Install **Grand Theft Auto V Legacy** in Steam and start it once. Steam installs the Rockstar Games Launcher into the game's Proton prefix. Sign in to your Rockstar account there, get to the game's main menu, then quit both the game and the launcher.

The prefix is at:

```
~/.local/share/Steam/steamapps/compatdata/271590/pfx
```

### 2. Put FiveM into the game's prefix

FiveM needs to run in the same prefix as the Rockstar launcher. Extract the release into the prefix's `drive_c`, which creates `drive_c/FiveM`:

```bash
PFX=~/.local/share/Steam/steamapps/compatdata/271590/pfx
unzip ~/Downloads/fivem-client.zip -d "$PFX/drive_c"
```

Then tell FiveM where the game is, by creating `$PFX/drive_c/FiveM/CitizenFX.ini`. Replace `you` with your username, and adjust the path if your Steam library is somewhere else:

```ini
[Game]
IVPath=Z:\home\you\.local\share\Steam\steamapps\common\Grand Theft Auto V
```

### 3. Add FiveM to Steam

1. _Games → Add a Non-Steam Game to My Library → Browse_, and pick `drive_c/FiveM/FiveM.exe` inside the prefix above. Press Ctrl+H in the file picker to see hidden folders.
2. Right-click the new entry → _Properties_:
   - **Compatibility:** force **Proton Experimental**.
   - **Launch options** (use your real home path):

```
STEAM_COMPAT_DATA_PATH=/home/you/.local/share/Steam/steamapps/compatdata/271590 CitizenFX_NoTenUI=1 %command%
```

`STEAM_COMPAT_DATA_PATH` makes the shortcut use GTA's prefix instead of creating a new, empty one.

### 4. Launch

Make sure Steam is running and the Rockstar launcher is **closed**, then start the FiveM entry from Steam. The first start builds FiveM's game cache, which takes a few minutes. When you get to the FiveM main menu, you're done.

## Route B: GTA V from the Rockstar Games Launcher (Lutris)

If you own GTA V through Rockstar instead of Steam, this route uses a Lutris Wine prefix. It works with Proton Experimental and with GE-Proton11-7 as the runner; GE-Proton needs one extra setting (below).

### 1. Install the launcher and GTA V

Install the Rockstar Games Launcher in a Lutris prefix, then install **GTA V Legacy** through it. Sign in to your Rockstar account, start the game once to its main menu, and quit both the game and the launcher.

### 2. Put FiveM into the prefix

Extract the release into the prefix's `drive_c` (`unzip fivem-client.zip -d ~/Games/your-prefix/drive_c`), which creates `drive_c/FiveM`. Then create `CitizenFX.ini` next to `FiveM.exe` with the game's path inside the prefix:

```ini
[Game]
IVPath=C:\Program Files\Rockstar Games\Grand Theft Auto V Legacy
```

### 3. Add FiveM to Lutris

Add a Lutris game for `FiveM.exe` in that prefix, with these environment variables:

| Variable            | Value | Why                                                                                                              |
| ------------------- | ----- | ---------------------------------------------------------------------------------------------------------------- |
| `CitizenFX_NoTenUI` | `1`   | Win32 updater window instead of the XAML one                                                                     |
| `UMU_USE_STEAM`     | `1`   | **Only with GE-Proton:** it turns off its Steam bridge under umu unless this is set. Proton Experimental doesn't |

### 4. Copy Steam's client files

For the Steam identifier, FiveM needs Steam's Windows client files in the prefix. When Steam launches a game, Proton puts them there itself, but not under umu, with GE-Proton and Proton Experimental alike:

```bash
PFX=~/Games/your-prefix
mkdir -p "$PFX/drive_c/Program Files (x86)/Steam"
cd ~/.local/share/Steam/legacycompat
cp -L steamclient.dll steamclient64.dll Steam.dll GameOverlayRenderer64.dll "$PFX/drive_c/Program Files (x86)/Steam/"
cp -L SteamService.exe "$PFX/drive_c/Program Files (x86)/Steam/steam.exe"
```

If these files are missing, connecting to a server that uses Steam identifiers fails with *"Failed to obtain Steam ticket, Steam-API is not initialized, please try again."*

### 5. Launch

Keep Steam running on Linux, and launch FiveM from Lutris **without** opening the Rockstar launcher first. If the launcher is already open, FiveM hangs at _"Checking if it has socialclub.dll"_.

## Display tips

- **Windowed mode:** FiveM keeps its own copy of the game settings in `drive_c/users/steamuser/AppData/Roaming/CitizenFX/gta5_settings.xml`. Set `<Windowed value="1" />` and the window size with `ScreenWidth`/`ScreenHeight`.
- **Gamescope:** on KDE Plasma (Wayland), gamescope's default Wayland backend crashed for me after a while, taking the game with it. `--backend sdl` avoids that.
- **ReShade (and graphics mods built on it, like NVE):** ReShade compiles its shaders with `d3dcompiler_47.dll`. Proton only ships Wine's built-in replacement, which can't compile everything yet. NVE's shaders fail with _"E5017: Aborting due to not yet implemented feature: Unhandled attribute 'fastopt'"_. Install Microsoft's compiler into the prefix (FiveM must be closed). For the Steam route:

```bash
protontricks 271590 -q d3dcompiler_47
```

My Lutris prefix already had Microsoft's compiler, from setting up the Rockstar launcher. If yours doesn't, `winetricks -q d3dcompiler_47` with `WINEPREFIX` set to the prefix should do the same.

## Letting Linux players join your server

These settings make an FXServer accept Linux players. They come with real trade-offs, so they're for **private servers with people you know**, not public ones. Also keep the anti-cheat limitation above in mind.

### Authentication: `sv_lan`

Without the anti-cheat client, FiveM doesn't send the Cfx authentication ticket, so the server rejects the connection with _"No authentication ticket was specified"_. LAN mode skips the ticket check:

```cfg
set sv_lan 1
```

LAN mode ignores **everyone's** ticket, Windows players included. Nobody gets `license:`, `fivem:` or `discord:` identifiers, and there's no player authentication at all. Anyone who can reach the port can join, so don't expose the server publicly in this mode.

### Steam identifiers

Steam is the one identifier that still works, because the server checks the Steam ticket with Valve itself, without Cfx. Get a key at [steamcommunity.com/dev/apikey](https://steamcommunity.com/dev/apikey) and set:

```cfg
set steam_webApiKey "YOUR_KEY"
set sv_enforceSteamAuth true
```

With `sv_enforceSteamAuth`, players without Steam get a clear error instead of joining with no identifiers. Every player then needs Steam running while they play.

Permissions work through the Steam identifier as usual:

```cfg
add_principal identifier.steam:11000010xxxxxxx group.admin
```

### txAdmin

txAdmin's ban and whitelist check refuses players with fewer than two identifiers. With Steam enforced, players have `steam:` and `ip:`, which is enough. Without Steam, turn off _Settings → Bans → Ban Checking_. txAdmin's in-game menu (`/tx`) links admins by Cfx.re or Discord identifiers, so it won't recognise anyone in LAN mode; use the web panel.

### Frameworks

Most frameworks and scripts identify players by `license:` (or another identifier that comes from the Cfx ticket). In LAN mode that identifier doesn't exist, so anything that stores or looks up players by it has to be changed to use `steam:` instead.

## Known issues

- **Black or broken menu UI.** The fork uses GPU texture sharing for the menu under Wine. If that doesn't work on your setup, open the F8 console, run `nui_useSharedResources false` and restart FiveM. The menu then goes through the slower CPU copy instead.
- **Signing in with Cfx.re from the menu needs a manual step.** The sign-in finishes in your browser with a `fivem://accept-auth?payload=…` link, and Linux doesn't know how to hand that to FiveM inside Wine. You don't need a Cfx.re account to play; it's only used for things like upvoting servers. If you want to sign in, copy the link and pass it to `FiveM.exe` in the same prefix **while FiveM is running**. The running instance picks it up. For the Steam route:

```bash
PROTON="$HOME/.local/share/Steam/steamapps/common/Proton - Experimental"
WINEPREFIX=~/.local/share/Steam/steamapps/compatdata/271590/pfx WINEFSYNC=1 \
  "$PROTON/files/bin/wine" 'C:\FiveM\FiveM.exe' 'fivem://accept-auth?payload=…'
```

Use the same Proton version the game is running with, so the link reaches the running FiveM instead of starting a second one. Each link only works once; if it fails, click _try again_ in FiveM for a new one.

If you try this and hit something new, open an issue on [the fork](https://github.com/izmystic/fivem-linux/issues).
