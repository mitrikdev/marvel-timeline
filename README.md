# Marvel Atlas

A React + TypeScript / Next.js application that maps 77 Marvel films across 16 cinematic continuity lanes. Movies are stations; selected characters and franchises become threads through their appearances.

## Run locally

Requires Node.js 22 or later and npm.

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:3000. The data, fonts, and poster artwork are local; no API keys, database, or external data service is needed.

## Explore

- Drag or scroll the map in either direction; keyboard users can focus it and use arrow keys.
- Filter sidebar universes by name, or browse every character in compact, collapsible team groups. Character search also matches real names, aliases, and team names.
- Choose a character, actor, franchise/team, universe, studio, year range, or appearance role.
- ANY matches at least one selected entity. ALL requires every selected entity. Year range (inclusive) and role constraints apply in both modes.
- Movie positions stay fixed when filters change. + / − moves between compact overview, standard cards, and detailed cards with larger posters and full titles, while preserving the center date.
- Posters appear beside timeline titles, in search, and in related-film links. Click a film for a larger poster, a short spoiler-light synopsis, cast, continuity, crossover details, curation notes, and source links.
- Diamond markers show major story events and series milestones. Search for events or click their markers to open details and the related film. The Events toggle reclaims their space when hidden.
- Events are anchored to their related film’s US release date, not an in-universe year. Film filters also dim events whose related films do not match.
- Phones support portrait and landscape. Swipe to explore the map; search, filters, and film details adapt to narrow screens, and rotating preserves the current state.
- Peter Parker and Miles Morales are separate character records; the Spider-Man franchise includes their wider film family.

### Explore tools

Open **Explore** above the map for four tools:

- **Follow a journey:** play through a character or actor’s appearances in release order. The map follows each stop; pause, step through films, or open the current film’s details.
- **Separate character variants:** trace each actor and originating universe separately, including the points where variants meet in crossover films.
- **Connect these films:** choose two films and reveal a shortest chain of shared characters or actors. Each link explains the connection.
- **My watch history:** mark films watched, filter the remaining list, and see progress overall and by universe. History stays in this browser and syncs across its tabs; no account is needed.

## Validate

```sh
npm run lint
npm run typecheck
npm test
npm run build
```

The tests cover dataset integrity, exact film scope, date ordering, variant references, ANY/ALL logic, year boundaries, role matching, deterministic layout at each zoom level, path geometry, journey and variant routes, shortest film connections, watch-history storage, and synopsis coverage.

## Data

- `src/data/mcu.ts`: 38 Marvel Studios / MCU collection films.
- `src/data/legacy.ts`: 39 Sony, Fox, animated, and legacy films.
- `src/data/helpers.ts`: normalizes curated appearances into separate movie, character, and actor records.
- `src/data/index.ts`: continuity registry and searchable display names.
- `src/data/character-groups.ts`: primary team/squad navigation groups and an Other characters section for the rest of the catalog.
- `src/data/posters.ts` and `public/posters/`: local, optimized promotional cover artwork with source attribution in `docs/sources-posters.md`.
- `src/data/synopses.ts`: original short film synopses, with source attribution in `docs/sources-synopses.md`.
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
