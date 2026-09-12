# Marvel Movies Interactive Timeline — v0.1 Build Spec

## Goal

Build a polished, interactive Marvel movie timeline that lets users visually explore how characters, franchises, studios, and cinematic universes connect across decades of Marvel film history.

The app should feel less like a database table and more like a cinematic transit map:

> Movies are stations.  
> Universes and franchises form lanes.  
> Characters and franchises create colored threads that weave through the timeline.

The key interaction is filtering the map and watching unrelated paths disappear while the selected character or franchise remains as a glowing thread through every relevant movie across every continuity.

This should be fun to explore even when the user has no specific question in mind.

---

# Core Product Concept

The main experience is a chronological, horizontally oriented visualization of Marvel movies.

The timeline is organized by release date and divided into parallel continuity / universe lanes.

Examples of lanes include:

- Marvel Cinematic Universe
- Raimi Spider-Man
- Amazing Spider-Man
- Sony Spider-Man Universe
- Spider-Verse
- Fox X-Men
- Deadpool
- pre-MCU Fantastic Four
- Blade
- Ghost Rider
- Punisher
- other standalone / legacy Marvel continuities

Movies appear as interactive nodes/cards positioned on the timeline.

Colored paths connect the movies in which a selected character, franchise, or team appears.

The result should resemble a dark, premium, cinematic data visualization with glowing threads running through movie history.

---

# Scope

Include all movies from the agreed master list.

## MCU / Marvel Studios

- Iron Man
- The Incredible Hulk
- Iron Man 2
- Thor
- Captain America: The First Avenger
- The Avengers
- Iron Man 3
- Thor: The Dark World
- Captain America: The Winter Soldier
- Guardians of the Galaxy
- Avengers: Age of Ultron
- Ant-Man
- Captain America: Civil War
- Doctor Strange
- Guardians of the Galaxy Vol. 2
- Spider-Man: Homecoming
- Thor: Ragnarok
- Black Panther
- Avengers: Infinity War
- Ant-Man and the Wasp
- Captain Marvel
- Avengers: Endgame
- Spider-Man: Far From Home
- Black Widow
- Shang-Chi and the Legend of the Ten Rings
- Eternals
- Spider-Man: No Way Home
- Doctor Strange in the Multiverse of Madness
- Thor: Love and Thunder
- Black Panther: Wakanda Forever
- Ant-Man and the Wasp: Quantumania
- Guardians of the Galaxy Vol. 3
- The Marvels
- Deadpool & Wolverine
- Captain America: Brave New World
- Thunderbolts*
- The Fantastic Four: First Steps
- Spider-Man: Brand New Day

## Sony Spider-Man Films

- Spider-Man
- Spider-Man 2
- Spider-Man 3
- The Amazing Spider-Man
- The Amazing Spider-Man 2
- Venom
- Venom: Let There Be Carnage
- Morbius
- Madame Web
- Venom: The Last Dance
- Kraven the Hunter

## Spider-Verse Animation

- Spider-Man: Into the Spider-Verse
- Spider-Man: Across the Spider-Verse

## Fox X-Men / Deadpool

- X-Men
- X2
- X-Men: The Last Stand
- X-Men Origins: Wolverine
- X-Men: First Class
- The Wolverine
- X-Men: Days of Future Past
- Deadpool
- X-Men: Apocalypse
- Logan
- Deadpool 2
- Dark Phoenix
- The New Mutants

## Fantastic Four — Pre-MCU

- Fantastic Four
- Fantastic Four: Rise of the Silver Surfer
- Fantastic Four (2015)

## Older / Other Marvel

- Blade
- Blade II
- Blade: Trinity
- Daredevil
- Elektra
- Hulk (2003)
- The Punisher
- Punisher: War Zone
- Ghost Rider
- Ghost Rider: Spirit of Vengeance

---

# Timeline Rules

## Primary Chronology

Use theatrical release date as the default chronology.

Do not use in-universe chronological order in v0.1.

Release order is the canonical axis because:

- it is objective
- it works across unrelated continuities
- it avoids timeline paradoxes and multiverse ambiguity
- it reflects how audiences actually encountered the films

A future release-order / in-universe toggle can be added later.

---

# Visual Structure

## Timeline Orientation

The primary visualization should be horizontally chronological.

Conceptually:

```text
2000          2005          2010          2015          2020          2025
│             │             │             │             │             │

Raimi Spider-Man
    Spider-Man ─ Spider-Man 2 ─ Spider-Man 3 ───────────────────────╮
                                                                    │
Amazing Spider-Man                                                  │
                              Amazing Spider-Man ─ ASM2 ─────────────┤
                                                                    │
MCU                                                                 ▼
                              Iron Man ─ Avengers ─ Civil War ─ No Way Home
                                                                    ▲
Fox X-Men                                                           │
    X-Men ─ X2 ─ X3 ─ First Class ─ DOFP ─ Logan ──────────────── D&W
```

The exact composition is flexible, but the underlying idea is not:

- time flows left to right
- cinematic continuities are vertically separated
- movies appear as nodes/cards
- crossovers visually bridge lanes

---

# Continuity Lanes

Every movie should belong to one primary continuity lane.

Examples:

- MCU
- Raimi Spider-Man
- Amazing Spider-Man
- Sony Spider-Man Universe
- Spider-Verse
- Fox X-Men
- Deadpool / Fox-adjacent
- Fantastic Four 2000s
- Fantastic Four 2015
- Blade
- Ghost Rider
- Punisher
- standalone / legacy

A movie can also reference other universes through crossover metadata.

For example:

Spider-Man: No Way Home

Primary lane:

- MCU

Crossover connections:

- Raimi Spider-Man
- Amazing Spider-Man

Deadpool & Wolverine

Primary lane:

- MCU or a clearly defined crossover lane

Connected continuities:

- Fox X-Men
- Deadpool / Fox
- MCU

The visualization should use those relationships to draw meaningful bridges between lanes.

---

# Colored Thread System

This is a primary feature, not decoration.

## Core Rule

When a character, franchise, or team is selected, a colored path should thread through every relevant movie in chronological order.

Examples:

- Spider-Man → red thread
- Doctor Strange → purple thread
- Hulk → green thread
- Captain America → blue thread
- Wolverine → yellow thread
- Iron Man → red/gold-family thread
- Deadpool → crimson / pink-family thread

Exact colors may be tuned for accessibility and contrast.

Colors should feel character-associated where practical without sacrificing readability.

---

## Thread Behavior

### Unfiltered State

Do not render every character thread simultaneously.

That would create visual clutter.

The default state should show:

- all movie nodes/cards
- subtle continuity structure
- optional subdued franchise-level connectors
- no dense character spaghetti

### Character Selected

If the user selects `Spider-Man`:

- unrelated character lines disappear
- irrelevant movies fade substantially
- Spider-Man movies stay bright
- a strong red thread connects all Spider-Man appearances across all universes
- crossover movies naturally bridge continuity lanes

The user should feel like they are physically pulling the Spider-Man thread out of the larger Marvel history.

### Multi-Select

Selecting:

- Spider-Man
- Doctor Strange

should show both relevant threads simultaneously.

The two colors should remain distinct.

Where the characters share a film, both paths should converge on the same movie node.

---

# Filter Logic

Support multi-select filtering.

Primary filter groups:

- Character
- Actor
- Franchise / Team
- Universe / Continuity
- Studio
- Year range

Optional role filter:

- Lead
- Supporting
- Cameo
- Post-credit

---

## ANY / ALL Mode

When multiple filters are active, provide:

- Match ANY
- Match ALL

Year range is always a constraint in both modes. ANY / ALL applies to the other active filters and cannot make a movie outside the selected year range match.

Year boundaries are inclusive. With only a year range selected, all movies released within that range match. With no year range selected, all release years are eligible.

Example:

Spider-Man + 2020–2026

In either mode, only Spider-Man appearances in movies released from 2020 through 2026 match. Other movies in that period do not match merely because of their release year.

### ANY

A movie matches if it is within the selected year range (if any) and satisfies at least one other active filter. If no other filters are active, the year range alone determines matches.

Example:

Spider-Man + Doctor Strange

ANY shows all movies containing either one.

### ALL

A movie matches only if it is within the selected year range (if any) and satisfies all other active filters. If no other filters are active, the year range alone determines matches.

Example:

Spider-Man + Doctor Strange

ALL emphasizes only films containing both.

It is acceptable to preserve faint contextual paths around the matching movies, but the actual matching nodes must be visually unmistakable.

---

# Filter Chips

Active filters should always remain visible.

Example:

```text
Spider-Man ×   Doctor Strange ×   MCU ×

Match: ANY ▾
Clear All
```

The user should never wonder why the visualization is currently filtered.

---

# Character vs Actor Model

Characters and actors must be separate entities.

Example:

```js
{
  characterId: 'peter-parker',
  actorId: 'tobey-maguire',
  universeId: 'raimi'
}
```

and separately:

```js
{
  characterId: 'peter-parker',
  actorId: 'andrew-garfield',
  universeId: 'amazing-spider-man'
}
```

This allows:

Character filter:

- Spider-Man

to show all Peter Parker / Spider-Man variants across continuities.

Actor filter:

- Tobey Maguire

to show only Tobey Maguire appearances.

The same separation matters for:

- variants
- recasts
- legacy cameos
- multiverse characters
- actors who play multiple Marvel characters

---

# Data Model

Use structured canonical records.

## Movie

Example:

```js
{
  id: 'spider-man-no-way-home',
  title: 'Spider-Man: No Way Home',
  releaseDate: '2021-12-17',

  studioIds: [
    'marvel-studios',
    'sony-pictures'
  ],

  primaryUniverseId: 'mcu',

  franchiseIds: [
    'spider-man',
    'mcu'
  ],

  crossoverUniverseIds: [
    'raimi',
    'amazing-spider-man'
  ],

  appearances: [
    {
      characterId: 'peter-parker',
      actorId: 'tom-holland',
      universeId: 'mcu',
      role: 'lead'
    },
    {
      characterId: 'peter-parker',
      actorId: 'tobey-maguire',
      universeId: 'raimi',
      role: 'supporting'
    },
    {
      characterId: 'peter-parker',
      actorId: 'andrew-garfield',
      universeId: 'amazing-spider-man',
      role: 'supporting'
    }
  ],

  notes: []
}
```

---

## Character

```js
{
  id: 'peter-parker',
  name: 'Peter Parker',
  aliases: ['Spider-Man']
}
```

---

## Actor

```js
{
  id: 'tobey-maguire',
  name: 'Tobey Maguire'
}
```

---

## Universe

```js
{
  id: 'raimi',
  name: 'Raimi Spider-Man',
  laneLabel: 'Raimi Spider-Man'
}
```

---

## Franchise

```js
{
  id: 'spider-man',
  name: 'Spider-Man'
}
```

---

## Studio

```js
{
  id: 'sony-pictures',
  name: 'Sony Pictures'
}
```

---

# Appearance Roles

Use a simple role classification.

Allowed values:

```text
lead
supporting
cameo
post-credit
```

Do not try to model exact screen time.

The purpose is primarily filtering and visual distinction.

Future example:

> Show Wolverine appearances, excluding cameos and post-credit scenes.

---

# Character Coverage

Do not attempt to catalog every named character in every film.

For v0.1, include:

- major heroes
- major villains
- important team members
- recognizable supporting characters
- characters relevant to crossover exploration

The initial dataset should optimize for useful exploration rather than encyclopedic completeness.

The schema should allow easy expansion later.

---

# Movie Nodes

Every movie should be represented by an interactive node/card.

At minimum show:

- title
- release year

Optionally:

- small poster thumbnail
- studio/universe icon or tag
- franchise indicator

Do not overload the timeline with metadata.

The node should remain compact enough for dense chronological visualization.

---

# Movie Detail Panel

Tapping/clicking a movie opens a compact detail panel.

The panel should show:

- title
- release date
- primary universe
- studio(s)
- franchise(s)
- major character appearances
- actor names
- role classification
- crossover universes

Do not navigate to another page in v0.1.

Use a side panel, bottom sheet, or floating detail panel depending on viewport.

---

# Visual Style

## Overall Direction

Dark, cinematic, premium, subtle sci-fi.

The UI should feel like:

> a Marvel transit map displayed in a dark futuristic gallery

Avoid:

- bright dashboard aesthetics
- flat white cards
- generic admin UI
- excessive neon
- arcade-style visual noise

---

# Background

Use a near-black / deep charcoal background.

A subtle gradient is welcome.

The background should not feel perfectly flat.

Possible treatment:

- very subtle atmospheric gradient
- faint texture
- minimal depth cues

Do not use distracting imagery behind the timeline.

---

# Glow

Active visual elements should have restrained luminous treatment.

Use subtle glow on:

- active character threads
- selected movie nodes
- active filter chips
- crossover intersections

The glow should feel controlled and cinematic.

Avoid oversized blur halos.

---

# Reflective Floor Effect

The timeline visualization should appear to sit slightly above a rough, dark, semi-reflective surface.

This is intentionally subtle.

The effect should suggest:

- a dim showroom floor
- rough polished concrete
- faint diffuse reflection
- atmospheric depth beneath the data

Not:

- a mirror
- glossy Apple Store glass
- obvious duplication of the whole UI

Possible implementation ideas:

- low-opacity vertically flipped thread reflection
- strong blur
- short fade-out
- rough/noisy mask
- minimal reflected movie-node glow

The reflection should be strongest directly beneath active thread paths and selected nodes.

It should fade quickly.

---

# Thread Rendering

Use SVG or another vector-based rendering system.

Requirements:

- smooth curves
- stable positioning during filtering
- clear lane transitions
- visually distinct colors
- responsive layout
- animated transitions optional but subtle

A light draw/fade animation when filters change is acceptable.

Do not create distracting continuous motion.

---

# Crossover Visualization

Crossovers should be visually meaningful.

When a movie connects separate cinematic continuities, the path should visibly bridge those lanes.

Examples:

- No Way Home linking MCU, Raimi, and Amazing Spider-Man
- Deadpool & Wolverine linking Fox-era material into the MCU-era map

Crossovers should feel like major interchange stations in a transit map.

Potential treatment:

- larger node
- stronger glow
- multi-thread convergence
- subtle pulse on selection

Keep effects tasteful.

---

# Franchise / Team Threads

Character threads are primary.

Franchise or team filters may also create path overlays.

Examples:

- X-Men
- Avengers
- Guardians of the Galaxy
- Fantastic Four
- Spider-Man
- Deadpool

Franchise paths may be visually differentiated from character paths.

Suggested distinction:

- character thread → thicker and more vivid
- franchise path → slightly thinner or less saturated
- continuity lane → subtle structural guide

---

# Navigation / Exploration

Desktop:

- drag/pan horizontally
- mouse wheel / trackpad-friendly behavior
- optional zoom later

Mobile:

- touch pan
- horizontal timeline exploration
- vertical movement between continuity lanes
- tap movie nodes
- tap filter chips

The app should feel like exploring a map.

Do not require tiny precision interactions.

---

# Mobile Behavior

Mobile exploration is landscape-only. In portrait orientation on phones, show a centered "Rotate your phone" indicator and explanation in place of the interactive app. Rotating to landscape reveals the timeline and preserves the current filters, selection, and viewport. Do not require fullscreen or an orientation-lock API.

Mobile landscape should remain usable even though the visualization is large.

Recommended approach:

- visualization occupies most of the viewport
- filter UI collapses into a compact top control
- active filters remain visible
- movie details open as a bottom sheet
- timeline can pan both horizontally and vertically

Do not try to shrink the entire timeline onto one mobile screen.

---

# Zoom

Pinch / semantic zoom can be deferred.

For v0.1, pan is required.

If zoom is implemented, it should be bounded and preserve usability.

Possible future semantic zoom:

far:

- year labels
- franchise lanes
- major crossover nodes

near:

- full movie cards
- actors
- character detail

---

# Search

Optional but valuable for v0.1 if simple.

Search should be able to find:

- movie
- character
- actor
- franchise
- universe

Selecting a search result should:

- apply the relevant filter
- focus/center the visualization where practical

Do not build a complicated global command system.

---

# Suggested Component Structure

Exact implementation is flexible.

A useful model:

```text
App
├── TopBar
│   ├── Search
│   ├── FilterButton
│   ├── MatchModeSelector
│   └── ClearFilters
│
├── ActiveFilterChips
│
├── TimelineViewport
│   ├── YearAxis
│   ├── ContinuityLanes
│   ├── MovieNodes
│   ├── ThreadLayer
│   ├── CrossoverLayer
│   └── ReflectionLayer
│
├── FilterPanel
│   ├── Characters
│   ├── Actors
│   ├── Franchises
│   ├── Universes
│   ├── Studios
│   └── YearRange
│
└── MovieDetailPanel
```

Do not over-engineer if a simpler implementation is clearer.

---

# State

Minimum application state may resemble:

```js
{
  filters: {
    characters: [],
    actors: [],
    franchises: [],
    universes: [],
    studios: [],
    yearRange: null,
    roles: []
  },

  matchMode: 'any',

  selectedMovieId: null,

  viewport: {
    x: 0,
    y: 0
  }
}
```

Derived state:

- matching movies
- visible movie nodes
- active threads
- thread paths
- crossover connections
- faded nodes

Avoid storing values that can be derived.

---

# Filtering Behavior

Filtering should primarily change visual emphasis, not rebuild the entire interface.

When filters change:

1. determine matching movies
2. fade or hide unrelated movie nodes
3. remove unrelated thread paths
4. render active character/franchise paths
5. retain structural continuity context where useful
6. animate the transition subtly

The timeline should remain spatially stable.

Do not cause movies to jump into new positions when filters are applied.

This is important.

Filtering should reveal relationships within the same map, not create a different map.

---

# Technical Direction

Confirmed implementation stack:

- React
- Next.js
- TypeScript
- SVG for timeline/thread rendering
- CSS or Tailwind for surrounding UI
- static local data for v0.1
- no backend required

Possible visualization helpers are acceptable if they materially simplify:

- curve generation
- scales
- panning
- layout

But avoid bringing in a large charting framework if direct SVG + lightweight helpers are sufficient.

The timeline is bespoke enough that a generic chart library may become restrictive.

---

# Source Control and Hosting

Use the user's GitHub account for source control and Vercel account for hosting.

Connect the GitHub repository to the Vercel project so deployments follow repository changes.

The app should be a React + TypeScript application using Next.js, with curated local data and no backend required for v0.1.

---

# Data Storage

Start with curated local data.

Example structure:

```text
/data
  movies.ts
  characters.ts
  actors.ts
  franchises.ts
  universes.ts
  studios.ts
```

No database is required for v0.1.

The data should be easy to expand manually.

---

# Performance

The dataset is small enough that the app should remain fully client-side.

Still:

- memoize expensive path generation if needed
- avoid unnecessary DOM-heavy rendering
- prefer SVG groups/layers
- keep filters responsive
- do not rerender the entire visualization on every pointer move

---

# Accessibility

At minimum:

- filter controls keyboard accessible
- movie nodes focusable
- selected state not communicated by color alone
- sufficient contrast
- thread colors chosen for distinguishability
- movie detail panel accessible by keyboard
- active filter state communicated textually
- reduced-motion preference respected

Because color is important to the experience, supplement thread identity with labels, legends, or selected chips.

---

# Out of Scope for v0.1

Do not build yet:

- Disney+ series
- Marvel television history
- comics continuity
- games
- animation outside selected Spider-Verse films
- in-universe chronological mode
- user accounts
- user-created lists
- ratings
- reviews
- social features
- comments
- watch tracking
- streaming-provider availability
- recommendation engine
- AI summaries
- trivia
- box office analytics
- every minor character
- exhaustive cameo cataloging
- live external API dependency
- admin CMS
- backend/database
- collaborative editing
- complex semantic zoom

---

# Future Features

## TV / Disney+ Expansion

Add shows as a separate media type while preserving the movie timeline.

Possible filter:

```text
Movies
Series
Both
```

---

## In-Universe Chronology

Offer:

```text
Release Order
Story Chronology
```

This must remain optional because many continuities do not align cleanly.

---

## Actor Threads

A future visual mode could draw actor paths instead of character paths.

Examples:

- Chris Evans across Human Torch and Captain America
- Josh Brolin across Cable and Thanos
- Oscar Isaac across Apocalypse and Moon Knight if TV is later added

---

## Variant Exploration

A character-focused mode could explicitly group variants:

```text
Peter Parker
├── Tobey Maguire
├── Andrew Garfield
└── Tom Holland
```

---

## Compare Mode

Allow two entities to be compared side by side.

Examples:

- Spider-Man vs Wolverine
- X-Men vs Avengers
- Fox vs MCU
- Raimi vs Amazing Spider-Man

---

# v0.1 Acceptance Criteria

The first version is complete when:

1. All agreed movies are represented in the dataset.
2. Movies are placed chronologically by release date.
3. Movies are grouped into meaningful continuity lanes.
4. The timeline can be panned horizontally.
5. Mobile supports touch exploration in landscape; portrait phones show a "Rotate your phone" indicator instead of the interactive app.
6. Movie nodes are interactive.
7. Tapping a movie opens a detail panel.
8. Users can filter by character.
9. Users can filter by actor.
10. Users can filter by franchise/team.
11. Users can filter by universe/continuity.
12. Users can filter by studio.
13. Users can filter by an inclusive year range that always constrains matching results, including in ANY mode.
14. Multiple filters can be active simultaneously.
15. ANY / ALL match modes work.
16. Active filters are visible as removable chips.
17. Selecting a character renders a colored thread through every relevant movie.
18. Thread paths can cross continuity lanes.
19. Unrelated thread paths disappear when filtering.
20. Irrelevant movies fade rather than moving to new positions.
21. Crossovers such as No Way Home visually bridge multiple continuities.
22. Active threads have a subtle glow.
23. The UI uses a dark cinematic background.
24. The timeline has a subtle rough-floor reflection effect.
25. Character and actor data are stored separately.
26. Movie appearance roles support lead/supporting/cameo/post-credit.
27. The interface remains spatially stable while filters change.
28. No backend is required.

---

# Build Priority

Implement in this order:

1. canonical dataset shape
2. movie / character / actor / universe / franchise data
3. release-date axis
4. continuity lane layout
5. movie node rendering
6. timeline panning
7. movie detail panel
8. basic filter engine
9. ANY / ALL logic
10. active filter chips
11. SVG thread generation
12. character thread filtering
13. franchise/team thread filtering
14. crossover lane connections
15. fade behavior for irrelevant movies
16. dark cinematic visual polish
17. subtle glow
18. reflection/floor layer
19. mobile touch behavior
20. accessibility and responsive cleanup

Prioritize spatial clarity, filtering behavior, and satisfying thread visualization over secondary features.

---

# Final Product Principle

The app should never feel like a spreadsheet with a timeline skin.

The user should feel like they are exploring a map of Marvel movie history and pulling individual threads through a large cinematic web.

The ideal interaction is:

> “Show me Spider-Man.”

And the app visually answers by stripping away the noise and revealing one glowing red path weaving through multiple decades, studios, universes, and crossover films.
