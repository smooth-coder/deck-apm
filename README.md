# Agent Dependency Hell

A 20-minute talk delivered as a React SPA (Vite + React + TypeScript + Tailwind v4).

## Run

```sh
pnpm install
pnpm dev        # http://localhost:5173
pnpm test       # Vitest + jsdom
pnpm typecheck
pnpm build      # outputs dist/
pnpm preview
```

## Controls

| Key | Action |
| --- | --- |
| Right / Down / Space / PageDown | Next scene |
| Left / Up / PageUp | Previous scene |
| 1-6 | Jump to scene |
| P | Jump to the playground (scene 5) |
| F | Toggle fullscreen (if the browser allows it) |

The current scene lives in the URL hash (`#/scene/3`), so reloads and deep links work.

## APM version

APM (`microsoft/apm`) is pre-1.0, so flags and output change between releases. The playground (scene 5) replays output recorded from a real `apm-cli` 0.33.0 run (release date 2026-10-02); evidence is in `docs/apm-research.md`. Playground logic lives in `src/playground/`. Re-record before the talk if you upgrade APM: see `scripts/README.md` (`pnpm record`, then `scripts/gen_recorded.py`).

## Deploy to Vercel

Vercel auto-detects Vite: build command `pnpm build`, output directory `dist`.
No `vercel.json` is needed because routing uses the hash, not the path.

## TODO

- `public/qr-code.svg` is a placeholder. Once the deploy URL exists, generate a real QR code, replace the file and show it again on scene 6 (it is no longer rendered; see `src/scenes/06-SoftwareDelivery.tsx`).
