# Legacy character identities

Checked September 12, 2026. `src/data/identities-legacy.ts` adds display identities and search aliases to existing character IDs. It does not add appearances or change continuity. Civilian names already present in the film data are preserved; a character without a separate established identity needs no override.

## Primary references checked

- [Sony's Into the Spider-Verse screenplay](https://origin-flash.sonypictures.com/ist/awards_screenplays/SV_screenplay.pdf?file=DOCUMENT): Peter Parker and Miles Morales are both Spider-Man. Printed pages 67–68 identify Olivia Octavius as Doctor Octopus/Doc Ock; page 74 identifies Gwen as Spider-Woman; page 83 names Peter Porker/Spider-Ham and Peni with SP//dr; page 90 reveals Prowler as Aaron. Spider-Gwen and Spider-Man Noir are also screenplay labels.
- [Across the Spider-Verse screenplay by Phil Lord, Christopher Miller and Dave Callaham](https://assets.scriptslug.com/live/pdf/scripts/spider-man-across-the-spider-verse-2023.pdf): the primary screenplay, hosted by Script Slug, supplies the Spider-Society identities, including Jessica, Miguel, Hobie and Pavitr, and the Spot. The film data's existing civilian names remain the ID basis.
- [Sony: Spider-Man 3](https://www.sonypictures.com/movies/spiderman3): identifies Sandman, Venom and New Goblin as the film's antagonists.
- [Sony: Venom: Let There Be Carnage](https://www.sonypictures.com/movies/venomlettherebecarnage): explicitly links Cletus Kasady and Carnage.
- [Sony: Kraven the Hunter](https://www.sonypictures.com/movies/kraventhehunter): the Kraven identity and Nikolai's role in the origin story.
- [20th Century: X-Men: First Class](https://www.20thcenturystudios.com/movies/x-men-first-class): Professor X, Magneto, Mystique, Beast, Banshee, Angel, Havok, Darwin, Riptide and the film's antagonist roster.
- [20th Century: X-Men Origins: Wolverine](https://www.20thcenturystudios.com/movies/x-men-origins-wolverine): explicit Logan/Wolverine and Victor Creed/Sabretooth mappings, plus Deadpool and Gambit.
- [20th Century: Dark Phoenix](https://www.20thcenturystudios.com/movies/dark-phoenix): Jean Grey/Phoenix, Kurt Wagner/Nightcrawler, Scott Summers/Cyclops and Ororo Munroe/Storm are identified in studio photo captions.
- [20th Century: Deadpool 2](https://www.20thcenturystudios.com/movies/deadpool-2): studio captions identify Domino, Cable, Zeitgeist and Bedlam.
- [Disney D23: The New Mutants](https://d23.com/5-fantastic-things-to-watch-this-weekend-presented-by-state-farm-101322/): names the film's Mirage, Wolfsbane, Cannonball, Sunspot and Magik, distinguishing movie identities from unrelated comics aliases.
- [20th Century: Rise of the Silver Surfer](https://family.20thcenturystudios.com/movies/fantastic-four-rise-of-the-silver-surfer): Sue Storm/Invisible Woman, Reed Richards/Mister Fantastic and Doctor Doom.
- [Sony: Ghost Rider](https://www.sonypictures.com/movies/ghostrider): explicitly connects Johnny Blaze with Ghost Rider and identifies Blackheart's antagonistic role.
- [Johnny Whitworth's first-person interview about Blackout](https://www.comingsoon.net/horror/news/721518-johnny-whitworth-on-playing-blackout-in-ghost-rider-2): the actor confirms that his human character transforms into Blackout in the sequel. This is an interview with the participant, rather than a comics-to-film inference.

The remaining familiar screen identities use the existing curated film records and film references documented in [the legacy data notes](sources-legacy.md). These sources are evidence for the mappings described above, not a claim that every linked landing page transcribes every film credit.

## Scope and continuity decisions

- Names apply to the existing cross-film character entry. Gwen is Spider-Woman in the animated films but a civilian in the live-action films; Harry is New Goblin in Raimi's film and Green Goblin in the Amazing films. The global entry carries both searchable identities. Otto and Olivia remain distinct characters with the same Doctor Octopus identity.
- Fox's Peter Maximoff stays under the existing `pietro-maximoff` ID, with Peter Maximoff as an alias. Peni's SP//dr is a search alias for her robot partnership, not a new civilian name.
- The Villains & rivals list is an editorial navigation category, not an assertion of permanent alignment. It includes Magneto, Prowler, Doctor Octopus, Sandman and Eddie Brock/Venom because of their antagonistic film roles despite later ally or antihero appearances. Existing core-team membership takes precedence in the catalog, including Mystique.
- This pass excludes comic-only or insufficiently confirmed film identities: Vanessa/Copycat, John Wraith/Kestrel, David Banner/Absorbing Man, Patrick Mulligan/Toxin, and Milo/Hunger. It also leaves Madame Web's three future heroines and the newer symbiote aliases unmapped pending stronger film-specific evidence. Kenuichio Harada is not renamed Silver Samurai; that film identity belongs to Ichiro Yashida.
- Characters such as Bullseye, Viper, Leech and Negasonic Teenage Warhead retain their existing names without invented civilian identities. No new surname is supplied for Rogue; the film uses Marie.

## Validation

The identity module was evaluated with the installed TypeScript runner. All 91 identity keys and all 71 villain IDs resolve to existing legacy characters, with no duplicate villain IDs. Root catalog validation covers the combined MCU and legacy output.
