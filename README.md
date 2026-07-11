# Flag Blitz — Reddit Devvit Flag Guessing Game

A fast-paced flag identification game built as a **Devvit Web** custom post (React + Vite + Hono).

## Stack

- **Client:** React 19, Tailwind CSS 4, Vite — rendered inline in Reddit (`game.html`)
- **Server:** Hono on `@devvit/web/server` — scores, leaderboards, flag proxy
- **Data:** 230 countries in `src/shared/countries.ts`; flags bundled under `public/flags/`
- **Leaderboards:** Redis sorted sets (`leaderboard:25`, `leaderboard:50`, …)

Score formula: `(correctAnswers × 1,000,000) − timeInSeconds`

## Screens

| Screen | Route in app |
|--------|----------------|
| Landing | `landing` |
| Mode select | `menu` |
| Gameplay | `playing` |
| Match complete | `results` |
| Leaderboard | `leaderboard` |
| Settings / prefs | `settings` |

Shared chrome (`LandingChrome`): motion-blur flag background + top bar (logo, leaderboard, settings, avatar).

## Game Modes

- **Quick** — 25 flags
- **Standard** — 50 flags
- **Pro** — 100 flags
- **Marathon** — 230 flags
- **Sudden Death** — one wrong answer ends the run

## Development

```bash
npm install
npm run download-flags   # caches FlagCDN PNGs into assets/ + public/
npm run build
npm run upload           # build + upload to Devvit
npm run dev              # build then playtest
```

Playtest subreddit: `r/flag_blitz_dev`  
Moderators: subreddit menu → **Create Flag Blitz Post** (always create a **new** post after uploads — old posts pin old bundles).

## Stitch Design Assets

Project: **Reddit Flag Racer** (`9644214360471486894`)

Reference HTML/screenshots live under `stitch-assets/`. Key screens used in the app:

| Screen | Notes |
|--------|--------|
| Landing + Shader | Hero / energy field inspiration |
| Main Menu | Mode cards |
| Active Gameplay | HUD + options |
| Match Complete (Standardized) | Results |
| Leaderboard (Standardized) | Ranks table |

Design system notes: `stitch-assets/design-system.md` (if present).

## Project layout

```
src/client/     React UI (screens, chrome, icons, assets)
src/server/     Hono API + menu post creation
src/shared/     Game logic, countries, leaderboard helpers
public/flags/   Bundled country flag PNGs
```
