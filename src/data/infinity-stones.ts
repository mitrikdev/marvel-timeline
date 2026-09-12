export type InfinityStone = {
  id: string;
  name: string;
  color: string;
  aliases: string[];
  description: string;
  sourceUrls: string[];
};

export type StoneAppearance = {
  movieId: string;
  stoneId: string;
  role: 'supporting' | 'cameo' | 'post-credit';
  summary: string;
};

/** Screen artifacts, independent of characters and actor credits. */
export const infinityStones: InfinityStone[] = [
  {
    id: 'space-stone',
    name: 'Space Stone',
    color: '#6cafff',
    aliases: ['Tesseract', 'Cosmic Cube'],
    description:
      'The blue stone inside the Tesseract opens pathways across space. Its cube links HYDRA, S.H.I.E.L.D., Asgard, and Thanos.',
    sourceUrls: [
      'https://www.qagoma.qld.gov.au/stories/marvel-infinity-stones/',
      'https://d23.com/road-avengers-infinity-war-told-end-credits/',
      'https://d23.com/lokis-mcu-origins-explained/',
      'https://d23.com/the-universe-of-powered-up-animal-pals-in-the-mcu/',
    ],
  },
  {
    id: 'mind-stone',
    name: 'Mind Stone',
    color: '#f4d35e',
    aliases: ["Loki's scepter", 'Loki’s scepter', 'Sceptre', "Vision's stone"],
    description:
      "The yellow stone concealed in Loki's scepter influences minds and later becomes part of Vision, making him a target for Thanos.",
    sourceUrls: [
      'https://www.qagoma.qld.gov.au/stories/marvel-infinity-stones/',
      'https://d23.com/wanda-maximoff-and-visions-mcu-origins-explained/',
      'https://d23.com/road-avengers-infinity-war-told-end-credits/',
    ],
  },
  {
    id: 'reality-stone',
    name: 'Reality Stone',
    color: '#ef6673',
    aliases: ['Aether', 'Ether'],
    description:
      'The red stone can reshape reality. It first appears as the fluid Aether, which infects Jane Foster and attracts the Dark Elves.',
    sourceUrls: [
      'https://www.qagoma.qld.gov.au/stories/marvel-infinity-stones/',
      'https://d23.com/road-avengers-infinity-war-told-end-credits/',
      'https://d23.com/celebrate-thors-10-year-mcu-anniversary-with-his-top-10-moments/',
    ],
  },
  {
    id: 'power-stone',
    name: 'Power Stone',
    color: '#aa85f4',
    aliases: ['Orb', 'The Orb'],
    description:
      'The purple stone releases devastating energy. Hidden inside the Orb, it draws the Guardians into a struggle with Ronan and Thanos.',
    sourceUrls: [
      'https://www.qagoma.qld.gov.au/stories/marvel-infinity-stones/',
      'https://d23.com/what-you-need-to-know-before-you-see-guardians-of-the-galaxy-vol-2/',
      'https://www.marvel.com/characters/war-machine-james-rhodes/on-screen/',
    ],
  },
  {
    id: 'time-stone',
    name: 'Time Stone',
    color: '#65d69f',
    aliases: ['Eye of Agamotto', 'Agamotto'],
    description:
      "The green stone housed in the Eye of Agamotto allows time to be reversed or looped, becoming Doctor Strange's powerful responsibility.",
    sourceUrls: [
      'https://www.qagoma.qld.gov.au/stories/marvel-infinity-stones/',
      'https://d23.com/doctor-stranges-maddening-journey-through-the-mcu/',
    ],
  },
  {
    id: 'soul-stone',
    name: 'Soul Stone',
    color: '#f2aa59',
    aliases: ['Vormir', 'Soul Gem'],
    description:
      'The orange stone is hidden on Vormir, where the Red Skull guards a terrible condition: obtaining it requires sacrificing someone the seeker loves.',
    sourceUrls: [
      'https://d23.com/what-to-know-before-you-watch-hawkeye/',
      'https://en.wikipedia.org/wiki/Infinity_Stones',
    ],
  },
];

/**
 * One stop per film and stone, ordered by film release.
 * Cameos include explicitly labeled presentations/visions and contained stones.
 * Endgame stops follow borrowed past versions; the original set was already destroyed.
 */
export const stoneAppearances: StoneAppearance[] = [
  {
    movieId: 'thor',
    stoneId: 'space-stone',
    role: 'post-credit',
    summary:
      'In the post-credits scene, Nick Fury reveals the Tesseract to Erik Selvig, while Loki watches unseen.',
  },
  {
    movieId: 'captain-america-the-first-avenger',
    stoneId: 'space-stone',
    role: 'supporting',
    summary:
      'Red Skull powers HYDRA weapons with the Tesseract; after it transports him away, Howard Stark recovers the cube from the ocean.',
  },
  {
    movieId: 'the-avengers',
    stoneId: 'space-stone',
    role: 'supporting',
    summary:
      'Loki steals the Tesseract and opens a portal for the Chitauri invasion; Thor eventually takes the cube back to Asgard.',
  },
  {
    movieId: 'the-avengers',
    stoneId: 'mind-stone',
    role: 'supporting',
    summary:
      "Loki's scepter conceals the Mind Stone, controlling Hawkeye and Selvig before the Avengers stop the invasion of New York.",
  },
  {
    movieId: 'thor-the-dark-world',
    stoneId: 'reality-stone',
    role: 'supporting',
    summary:
      "The Aether infects Jane Foster before Malekith claims it; after his defeat, Asgard's emissaries entrust it to the Collector.",
  },
  {
    movieId: 'captain-america-the-winter-soldier',
    stoneId: 'mind-stone',
    role: 'post-credit',
    summary:
      "The credits reveal Loki's scepter in HYDRA's possession, alongside the imprisoned Maximoff twins who survived experiments with its power.",
  },
  {
    movieId: 'guardians-of-the-galaxy',
    stoneId: 'space-stone',
    role: 'cameo',
    summary:
      "The Collector's presentation depicts the Space Stone among six cosmic stones; this is an illustration, not physical possession.",
  },
  {
    movieId: 'guardians-of-the-galaxy',
    stoneId: 'mind-stone',
    role: 'cameo',
    summary:
      "The Collector's presentation depicts the Mind Stone among six cosmic stones; this is an illustration, not physical possession.",
  },
  {
    movieId: 'guardians-of-the-galaxy',
    stoneId: 'reality-stone',
    role: 'cameo',
    summary:
      "The Collector's presentation depicts the Reality Stone among six cosmic stones; this is an illustration, not physical possession.",
  },
  {
    movieId: 'guardians-of-the-galaxy',
    stoneId: 'time-stone',
    role: 'cameo',
    summary:
      "The Collector's presentation depicts the Time Stone among six cosmic stones; this is an illustration, not physical possession.",
  },
  {
    movieId: 'guardians-of-the-galaxy',
    stoneId: 'soul-stone',
    role: 'cameo',
    summary:
      "The Collector's presentation depicts the Soul Stone among six cosmic stones; this is an illustration, not physical possession.",
  },
  {
    movieId: 'guardians-of-the-galaxy',
    stoneId: 'power-stone',
    role: 'supporting',
    summary:
      "Peter Quill retrieves the Orb; the Guardians share its stone's power to defeat Ronan, then entrust it to the Nova Corps.",
  },
  {
    movieId: 'avengers-age-of-ultron',
    stoneId: 'space-stone',
    role: 'cameo',
    summary:
      "Thor's vision depicts the Space Stone emerging from the Tesseract; the actual artifact is not present with the Avengers.",
  },
  {
    movieId: 'avengers-age-of-ultron',
    stoneId: 'reality-stone',
    role: 'cameo',
    summary:
      "Thor's vision depicts the Reality Stone forming from the Aether; the actual artifact is not present with the Avengers.",
  },
  {
    movieId: 'avengers-age-of-ultron',
    stoneId: 'power-stone',
    role: 'cameo',
    summary:
      "Thor's vision depicts the Power Stone emerging from the Orb; the actual artifact is not present with the Avengers.",
  },
  {
    movieId: 'avengers-age-of-ultron',
    stoneId: 'mind-stone',
    role: 'supporting',
    summary:
      "Ultron removes the stone from Loki's scepter for a synthetic body, which the Avengers instead bring to life as Vision.",
  },
  {
    movieId: 'captain-america-civil-war',
    stoneId: 'mind-stone',
    role: 'supporting',
    summary:
      "The stone remains in Vision's forehead as he supports the Sokovia Accords and fights alongside Tony Stark's divided Avengers.",
  },
  {
    movieId: 'doctor-strange',
    stoneId: 'time-stone',
    role: 'supporting',
    summary:
      "Stephen Strange discovers the Eye of Agamotto's power and traps Dormammu in a time loop, forcing him to leave Earth.",
  },
  {
    movieId: 'thor-ragnarok',
    stoneId: 'space-stone',
    role: 'cameo',
    summary:
      "Loki notices the Tesseract in Odin's vault and secretly takes it before Asgard's destruction, setting up Thanos's next attack.",
  },
  {
    movieId: 'thor-ragnarok',
    stoneId: 'time-stone',
    role: 'cameo',
    summary:
      'Doctor Strange wears the Eye of Agamotto, still containing the Time Stone, during his brief meeting with Thor in New York.',
  },
  {
    movieId: 'avengers-infinity-war',
    stoneId: 'space-stone',
    role: 'supporting',
    summary:
      'Loki surrenders the Tesseract to save Thor; Thanos crushes its casing and adds the blue stone to his gauntlet.',
  },
  {
    movieId: 'avengers-infinity-war',
    stoneId: 'mind-stone',
    role: 'supporting',
    summary:
      'Wanda destroys the stone to stop Thanos, but he reverses time and tears it from Vision to complete his gauntlet.',
  },
  {
    movieId: 'avengers-infinity-war',
    stoneId: 'reality-stone',
    role: 'supporting',
    summary:
      "Having seized the stone from the Collector, Thanos uses it to disguise Knowhere's destruction and manipulate the Guardians' surroundings.",
  },
  {
    movieId: 'avengers-infinity-war',
    stoneId: 'power-stone',
    role: 'supporting',
    summary:
      'Thanos already holds the stone after attacking Xandar, using its destructive force throughout his campaign to collect the remaining five.',
  },
  {
    movieId: 'avengers-infinity-war',
    stoneId: 'time-stone',
    role: 'supporting',
    summary:
      "Doctor Strange surrenders the stone to spare Tony Stark; Thanos later uses it to reverse the destruction of Vision's stone.",
  },
  {
    movieId: 'avengers-infinity-war',
    stoneId: 'soul-stone',
    role: 'supporting',
    summary:
      'On Vormir, Thanos sacrifices Gamora to obtain the Soul Stone, bringing him closer to completing the Infinity Gauntlet.',
  },
  {
    movieId: 'captain-marvel',
    stoneId: 'space-stone',
    role: 'supporting',
    summary:
      "In 1995, Carol finds the Tesseract aboard Mar-Vell's laboratory; Goose swallows it for safekeeping and later returns it to Fury.",
  },
  {
    movieId: 'avengers-endgame',
    stoneId: 'space-stone',
    role: 'supporting',
    summary:
      "After Loki escapes with the 2012 Tesseract, Tony retrieves its 1970 counterpart, supplying the borrowed Space Stone for the Avengers' gauntlet.",
  },
  {
    movieId: 'avengers-endgame',
    stoneId: 'mind-stone',
    role: 'supporting',
    summary:
      "Steve takes Loki's scepter from HYDRA agents in 2012; its borrowed stone joins the six used to undo Thanos's snap.",
  },
  {
    movieId: 'avengers-endgame',
    stoneId: 'reality-stone',
    role: 'supporting',
    summary:
      "Rocket extracts the Aether from Jane Foster in 2013 Asgard, bringing its borrowed stone forward for the Avengers' restoration plan.",
  },
  {
    movieId: 'avengers-endgame',
    stoneId: 'power-stone',
    role: 'supporting',
    summary:
      'Rhodey and Nebula retrieve the Orb on Morag in 2014, taking its borrowed Power Stone before Peter Quill can claim it.',
  },
  {
    movieId: 'avengers-endgame',
    stoneId: 'time-stone',
    role: 'supporting',
    summary:
      'The Ancient One lends her 2012 Time Stone to Bruce Banner after learning that Doctor Strange willingly surrendered it to Thanos.',
  },
  {
    movieId: 'avengers-endgame',
    stoneId: 'soul-stone',
    role: 'supporting',
    summary:
      'Natasha sacrifices herself on Vormir in 2014 so Clint can return with the Soul Stone and help restore those lost.',
  },
];
