# Legacy-film data notes

The 39 films in `src/data/legacy.ts` follow the agreed master list. Dates are original US wide theatrical release dates, including Wednesday releases such as _Spider-Man 2_ and _Blade: Trinity_. Premiere dates, international openings, reissues, and home-video dates are excluded.

## Sources checked

Every film has `sourceUrls` linking to the actual film or release references used during this pass. Most are studio pages from Sony, 20th Century Studios, Warner Bros., Universal, New Regency, Lionsgate, and Disney+. Sony press releases and its annual financial supplements supply exact domestic dates missing from the modern Sony movie pages. The financial supplements have been linked to their relevant PDF pages:

- FY2018, page 13: _Venom_ and _Into the Spider-Verse_.
- FY2021, page 15: _Venom: Let There Be Carnage_.
- FY2023, page 16: _Morbius_, _Across the Spider-Verse_, and _Madame Web_.
- FY2024, page 21: _Venom: The Last Dance_ and _Kraven the Hunter_.

For older films, AFI Catalog entries supply Los Angeles/New York opening dates and cast mappings. Those entries are supplemental records outside AFI's core 1893–1993 catalog. _Punisher: War Zone_ also uses Box Office Mojo's domestic calendar. _Ghost Rider: Spirit of Vengeance_ uses the Sony film page and a secondary film reference for the February 17, 2012 wide release.

Warner Bros. and Lionsgate movie pages returned little readable text, so they are supplemented where possible. A source link is a film-level reference, not a claim that its landing page documents every individual cameo. The appearance list is a manually curated selection of major characters, supporting characters, and recognizable crossover appearances, not a complete billing transcription. Roles are editorial classifications designed for filtering.

## Continuity conventions

- Fox original and revised timelines share one lane; _Days of Future Past_ contains both young and older portrayals without inventing separate movie records.
- Deadpool gets a separate lane within the wider Fox-era family. The X-Men cast in _Deadpool 2_ creates a Fox crossover, and Logan's archival credits appearance is included.
- Peter Parker groups Peter B. Parker, the blond animated Peter, Spider-Man Noir, and live-action variants. Miles Morales remains a separate character. All animated alternate worlds share the Spider-Verse lane.
- The Tobey Maguire and Andrew Garfield appearances in _Across the Spider-Verse_ are archival footage. Donald Glover's live-action Prowler is included without claiming that his exact world is the MCU.
- Sony is a navigation grouping. _Madame Web_ is standalone, and the lane alone does not assert a shared story world with every other Sony film.
- _Venom: Let There Be Carnage_, _Morbius_, and _Venom: The Last Dance_ have explicit MCU crossover context. Promotional movie excerpts after _Venom_ and _The Amazing Spider-Man 2_ are not treated as story crossovers.
- _Daredevil_ and _Elektra_ share a lane; the deleted Daredevil scene in _Elektra_ is excluded.
- The 2004 and 2008 Punisher films use separate continuities.
- Fox's Peter Maximoff is grouped under canonical Pietro Maximoff for cross-franchise exploration. Mephistopheles/Roarke are grouped as the devil across the Ghost Rider films.
- Studio tags are a curated set of major production/releasing brands, including the Sony parent brand and Columbia label; they are not an exhaustive list of financing entities or territorial distributors.

## Verification

The collection was evaluated directly as data to check the 39-film total, unique movie IDs, valid ISO release dates, nonempty source lists, and valid appearance tuples/roles. No film runtime, poster, box-office, rating, or streaming availability data is copied into the application.
