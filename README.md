# Marvel Atlas

A React + TypeScript / Next.js application that maps 77 Marvel films across 16 cinematic continuity lanes. Movies are stations; selected characters and franchises become threads through their appearances.

## Run locally

Requires Node.js 22 or later and npm.

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:3000. The data and fonts are local; no API keys, database, or external data service is needed.

## Explore

- Drag or scroll the map in either direction; keyboard users can focus it and use arrow keys.
- Filter sidebar universes by name, or browse every character in compact, collapsible team groups. Character search also matches real names, aliases, and team names.
- Choose a character, actor, franchise/team, universe, studio, year range, or appearance role.
- ANY matches at least one selected entity. ALL requires every selected entity. Year range (inclusive) and role constraints apply in both modes.
- Movie positions stay fixed when filters change. + / − changes spacing while preserving the center date.
- Click a film for cast, continuity, crossover details, curation notes, and source links.
- Diamond markers show major story events and series milestones. Search for events or click their markers to open details and the related film. The Events toggle reclaims their space when hidden.
- Events are anchored to their related film’s US release date, not an in-universe year. Film filters also dim events whose related films do not match.
- On phones, portrait displays a “Rotate your phone” screen. Landscape restores the map and current state, including open panels.
- Peter Parker and Miles Morales are separate character records; the Spider-Man franchise includes their wider film family.

## Validate

```sh
npm run lint
npm run typecheck
npm test
npm run build
```

The tests cover dataset integrity, exact film scope, date ordering, variant references, ANY/ALL logic, year boundaries, role matching, deterministic layout, and path geometry.

## Data

- `src/data/mcu.ts`: 38 Marvel Studios / MCU collection films.
- `src/data/legacy.ts`: 39 Sony, Fox, animated, and legacy films.
- `src/data/helpers.ts`: normalizes curated appearances into separate movie, character, and actor records.
- `src/data/index.ts`: continuity registry and searchable display names.
- `src/data/character-groups.ts`: primary team/squad navigation groups and an Other characters section for the rest of the catalog.
- `src/data/events.ts`: major story events and film-series milestones, with related movie ids and sources.
- `docs/sources-mcu.md` and `docs/sources-legacy.md`: source and curation notes.

Use US theatrical dates. Role labels are editorial categories, not screen-time measurements. The collection is curated rather than an exhaustive credit catalog. Newer releases include only verified character identities. The latest _Fantastic Four_ setting has its own lane; crossover metadata keeps primary continuity separate from visiting characters.

## Deployment

Production: [marvel-timeline-sepia.vercel.app](https://marvel-timeline-sepia.vercel.app).

The private [mitrikdev/marvel-timeline](https://github.com/mitrikdev/marvel-timeline) repository is connected to the `marvel-timeline` Next.js project in the user's Vercel account. Vercel's Git integration handles production deployments from `main` and preview deployments for branches. GitHub Actions runs the validation commands above. It does not need a Vercel token.

To reproduce the integration, import the GitHub repository in Vercel, select the Next.js framework preset and repository root, and deploy. No environment variables are required.

## Project structure

```text
src/app/          Next.js route, layout, global styles
src/components/   Atlas UI and accessible dialogs
src/data/         Canonical curated data and registries
src/lib/          Pure filtering and deterministic layout
tests/            Data, filter, and geometry tests
docs/             Source notes
```

The product scope lives in `marvel-movies-interactive-timeline-v0.1.md`.

An independent fan project, unaffiliated with Marvel, Disney, Sony, or their partners. Character and film names belong to their respective owners.
