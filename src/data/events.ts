export type TimelineEvent = {
  id: string;
  title: string;
  movieId: string;
  kind: 'story' | 'milestone';
  description: string;
  sourceUrls: string[];
};

// Each marker inherits its film's US theatrical release date, not a fictional year.
// Milestones describe released film runs or franchise crossovers, not destroyed universes.
export const timelineEvents: TimelineEvent[] = [
  {
    id: 'raimi-trilogy-finale',
    title: 'Original Raimi trilogy ends',
    movieId: 'spider-man-3',
    kind: 'milestone',
    description:
      "Spider-Man 3 closes Sam Raimi's original trilogy starring Tobey Maguire. This marks the end of that film run; Maguire's Peter Parker later returns in Spider-Man: No Way Home.",
    sourceUrls: [
      'https://www.fathomentertainment.com/news/11037-2/',
      'https://www.marvel.com/articles/culture-lifestyle/tom-holland-reveals-behind-the-scenes-details-of-spider-man-no-way-home?linkId=202491071',
    ],
  },
  {
    id: 'battle-of-new-york',
    title: 'Battle of New York',
    movieId: 'the-avengers',
    kind: 'story',
    description:
      "Iron Man, Captain America, Thor, Hulk, Black Widow, and Hawkeye unite against Loki's alien invasion. The Avengers save Earth, while the battle leaves New York with lasting damage.",
    sourceUrls: [
      'https://d23.com/captain-america-civil-war-what-you-need-to-know-before-you-see-it/',
    ],
  },
  {
    id: 'fall-of-shield',
    title: 'Fall of S.H.I.E.L.D.',
    movieId: 'captain-america-the-winter-soldier',
    kind: 'story',
    description:
      "Steve Rogers and his allies expose HYDRA's infiltration and stop Project Insight. The revelation and destruction of the Helicarriers bring down S.H.I.E.L.D.'s existing organization.",
    sourceUrls: [
      'https://d23.com/the-falcon-and-the-winter-soldiers-mcu-origins-explained/',
      'https://d23.com/captain-america-civil-war-what-you-need-to-know-before-you-see-it/',
    ],
  },
  {
    id: 'amazing-spider-man-series-finale',
    title: 'Original Amazing series ends',
    movieId: 'the-amazing-spider-man-2',
    kind: 'milestone',
    description:
      "The Amazing Spider-Man 2 is the final film in Andrew Garfield's original solo series before Sony and Marvel introduce a new Spider-Man. Garfield's Peter Parker later returns in No Way Home.",
    sourceUrls: [
      'https://www.sonypictures.com/movies/theamazingspiderman2',
      'https://www.sonypictures.com/corp/press_releases/2015/02_15/020915_spiderman.html',
      'https://www.marvel.com/articles/culture-lifestyle/tom-holland-reveals-behind-the-scenes-details-of-spider-man-no-way-home?linkId=202491071',
    ],
  },
  {
    id: 'x-men-timeline-reset',
    title: 'X-Men timeline reset',
    movieId: 'x-men-days-of-future-past',
    kind: 'story',
    description:
      "Wolverine travels into the past to avert the Sentinels' devastating future. The mission links the original X-Men with their younger counterparts and changes the course of their history.",
    sourceUrls: [
      'https://www.20thcenturystudios.com/movies/x-men-days-of-future-past',
      'https://d23.com/5-things-to-watch-this-week-july-6-2020/',
    ],
  },
  {
    id: 'battle-of-sokovia',
    title: 'Battle of Sokovia',
    movieId: 'avengers-age-of-ultron',
    kind: 'story',
    description:
      'The Avengers battle Ultron and evacuate civilians from the Sokovian city he lifts into the sky. The destruction and civilian deaths fuel the later demand for oversight of the team.',
    sourceUrls: [
      'https://d23.com/what-to-know-before-you-watch-hawkeye/',
      'https://d23.com/captain-america-civil-war-what-you-need-to-know-before-you-see-it/',
    ],
  },
  {
    id: 'sokovia-accords',
    title: 'Sokovia Accords',
    movieId: 'captain-america-civil-war',
    kind: 'story',
    description:
      'The Sokovia Accords place the Avengers under United Nations oversight. Tony Stark supports the restrictions while Steve Rogers opposes them, dividing the team as the conflict over Bucky Barnes escalates.',
    sourceUrls: ['https://d23.com/what-to-know-before-you-watch-hawkeye/'],
  },
  {
    id: 'ragnarok',
    title: 'Ragnarok destroys Asgard',
    movieId: 'thor-ragnarok',
    kind: 'story',
    description:
      'Thor and his allies evacuate the surviving Asgardians as Surtur destroys Asgard and defeats Hela. The refugees leave their home behind and set a course for Earth.',
    sourceUrls: [
      'https://www.marvel.com/amp/articles/movies/the-essential-marvel-cinematic-universe-guide-phase-three',
    ],
  },
  {
    id: 'thanos-snap',
    title: "Thanos' Snap",
    movieId: 'avengers-infinity-war',
    kind: 'story',
    description:
      'Thanos gathers all six Infinity Stones and erases half of all life in the universe with a snap. This begins the five-year absence that ends when the vanished return in Avengers: Endgame.',
    sourceUrls: [
      'https://www.marvel.com/amp/articles/tv-shows/wandavision-primer-where-we-last-left-off-with-wanda-maximoff?linkId=108994957',
      'https://d23.com/the-falcon-and-the-winter-soldiers-mcu-origins-explained/',
    ],
  },
  {
    id: 'the-blip-return',
    title: 'The Blip: the return',
    movieId: 'avengers-endgame',
    kind: 'story',
    description:
      "The Avengers restore those erased by Thanos after a five-year absence. This marks their return; 'the Blip' also describes the wider disruption spanning the disappearance and return.",
    sourceUrls: [
      'https://www.marvel.com/amp/articles/tv-shows/wandavision-primer-where-we-last-left-off-with-wanda-maximoff?linkId=108994957',
      'https://d23.com/the-falcon-and-the-winter-soldiers-mcu-origins-explained/',
    ],
  },
  {
    id: 'spider-men-crossover',
    title: 'Three Spider-Men unite',
    movieId: 'spider-man-no-way-home',
    kind: 'story',
    description:
      "Tom Holland's Peter Parker meets the versions played by Tobey Maguire and Andrew Garfield. The three Spider-Men face villains from across the multiverse, connecting the MCU, Raimi, and Amazing film worlds.",
    sourceUrls: [
      'https://www.marvel.com/articles/culture-lifestyle/tom-holland-reveals-behind-the-scenes-details-of-spider-man-no-way-home?linkId=202491071',
    ],
  },
  {
    id: 'deadpool-wolverine-mcu-crossover',
    title: 'Deadpool & Wolverine join the MCU',
    movieId: 'deadpool-and-wolverine',
    kind: 'milestone',
    description:
      'Deadpool and Wolverine headline their first Marvel Studios film. Their multiverse adventure connects the Fox film legacy with the MCU.',
    sourceUrls: [
      'https://thewaltdisneycompany.com/news/deadpool-and-wolverine-kevin-feige/',
      'https://thewaltdisneycompany.com/news/deadpool-and-wolverine-marvel-shawn-levy-interview/',
    ],
  },
];
