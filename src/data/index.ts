import { mcu } from './mcu';
import { legacy } from './legacy';
import { mcuCharacterIdentities } from './identities-mcu';
import { legacyCharacterIdentities } from './identities-legacy';
import type { Character, Entity, Movie, Universe } from './types';
import { infinityStones, stoneAppearances } from './infinity-stones';

export const universes: Universe[] = [
  { id: 'mcu', name: 'Marvel Cinematic Universe', shortName: 'MCU', color: '#e84455' },
  { id: 'raimi', name: 'Raimi Spider-Man', shortName: 'RAIMI', color: '#f57050' },
  { id: 'amazing', name: 'The Amazing Spider-Man', shortName: 'AMAZING', color: '#dcad63' },
  {
    id: 'spider-verse',
    name: 'Animated Spider-Verse',
    shortName: 'SPIDER-VERSE',
    color: '#b195e8',
  },
  { id: 'sony', name: 'Sony Spider-Man Universe', shortName: 'SONY', color: '#90a6c0' },
  { id: 'fox', name: 'Fox X-Men', shortName: 'X-MEN', color: '#e6bc57' },
  { id: 'deadpool', name: 'Deadpool / Fox', shortName: 'DEADPOOL', color: '#df718b' },
  {
    id: 'fantastic-first-steps',
    name: 'Fantastic Four: First Steps',
    shortName: 'FIRST STEPS',
    color: '#60c4d8',
  },
  {
    id: 'fantastic-2000s',
    name: 'Fantastic Four · 2000s',
    shortName: 'FANTASTIC FOUR',
    color: '#6ea7d9',
  },
  {
    id: 'fantastic-2015',
    name: 'Fantastic Four · 2015',
    shortName: 'FANTASTIC FOUR ’15',
    color: '#8a9bc3',
  },
  { id: 'blade', name: 'Blade', shortName: 'BLADE', color: '#cc6380' },
  { id: 'daredevil', name: 'Daredevil & Elektra', shortName: 'DAREDEVIL', color: '#bd7971' },
  { id: 'hulk-2003', name: 'Hulk · 2003', shortName: 'HULK ’03', color: '#8bb47e' },
  { id: 'ghost-rider', name: 'Ghost Rider', shortName: 'GHOST RIDER', color: '#d79657' },
  { id: 'punisher-2004', name: 'The Punisher · 2004', shortName: 'PUNISHER ’04', color: '#b5bac5' },
  { id: 'punisher-war-zone', name: 'Punisher: War Zone', shortName: 'WAR ZONE', color: '#8e9ba9' },
];

const franchiseNames: Record<string, string> = {
  mcu: 'Marvel Cinematic Universe',
  'iron-man': 'Iron Man',
  hulk: 'Hulk',
  thor: 'Thor',
  'captain-america': 'Captain America',
  avengers: 'Avengers',
  guardians: 'Guardians of the Galaxy',
  'ant-man': 'Ant-Man & the Wasp',
  'doctor-strange': 'Doctor Strange',
  'spider-man': 'Spider-Man',
  'black-panther': 'Black Panther',
  'captain-marvel': 'Captain Marvel',
  'shang-chi': 'Shang-Chi',
  eternals: 'Eternals',
  'x-men': 'X-Men',
  wolverine: 'Wolverine',
  deadpool: 'Deadpool',
  'fantastic-four': 'Fantastic Four',
  blade: 'Blade',
  daredevil: 'Daredevil',
  elektra: 'Elektra',
  'ghost-rider': 'Ghost Rider',
  punisher: 'Punisher',
  venom: 'Venom',
  thunderbolts: 'Thunderbolts',
  'black-widow': 'Black Widow',
  morbius: 'Morbius',
  'madame-web': 'Madame Web',
  kraven: 'Kraven',
};
const studioNames: Record<string, string> = {
  'marvel-studios': 'Marvel Studios',
  'marvel-entertainment': 'Marvel Entertainment',
  'sony-pictures': 'Sony Pictures',
  'columbia-pictures': 'Columbia Pictures',
  'twentieth-century-fox': '20th Century Fox',
  'new-line-cinema': 'New Line Cinema',
  'universal-pictures': 'Universal Pictures',
  lionsgate: 'Lionsgate',
};

export const movies: Movie[] = [...mcu.movies, ...legacy.movies]
  .map((movie) => {
    const stones = stoneAppearances
      .filter((appearance) => appearance.movieId === movie.id)
      .map(({ stoneId, role, summary }) => ({ stoneId, role, summary }));
    return stones.length ? { ...movie, stoneAppearances: stones } : movie;
  })
  .sort((a, b) => a.releaseDate.localeCompare(b.releaseDate));
export const infinityStoneById = new Map(infinityStones.map((stone) => [stone.id, stone]));
const distinct = <T extends Entity>(items: T[]) => [
  ...new Map(items.map((item) => [item.id, item])).values(),
];
const palette = [
  '#e96370',
  '#b89ae9',
  '#7acda5',
  '#77aae8',
  '#e4bb60',
  '#e99869',
  '#79c8d4',
  '#cd8dc0',
];
const characterOverrides: Record<string, { name: string; color: string; aliases?: string[] }> = {
  'peter-parker': { name: 'Spider-Man', color: '#fa5669', aliases: ['Peter Parker', 'Spiderman'] },
  'miles-morales': { name: 'Miles Morales', color: '#e679bb', aliases: ['Spider-Man'] },
  'stephen-strange': { name: 'Doctor Strange', color: '#b396ff', aliases: ['Stephen Strange'] },
  'bruce-banner': { name: 'Hulk', color: '#8dcd78', aliases: ['Bruce Banner'] },
  'steve-rogers': { name: 'Captain America', color: '#73a5ff', aliases: ['Steve Rogers'] },
  'tony-stark': { name: 'Iron Man', color: '#eeab62', aliases: ['Tony Stark'] },
  logan: { name: 'Wolverine', color: '#e9c755', aliases: ['Logan', 'James Howlett'] },
  'wade-wilson': { name: 'Deadpool', color: '#e95c86', aliases: ['Wade Wilson'] },
  'natasha-romanoff': { name: 'Black Widow', color: '#dc8c7b' },
  'wanda-maximoff': { name: 'Scarlet Witch', color: '#d98da2' },
  't-challa': { name: 'Black Panther', color: '#b498dc' },
  'sam-wilson': { name: 'Sam Wilson', color: '#81b9e0', aliases: ['Falcon', 'Captain America'] },
  'carol-danvers': { name: 'Captain Marvel', color: '#dfbe6e' },
  'eric-brooks': { name: 'Blade', color: '#dc7d99' },
  'johnny-blaze': { name: 'Ghost Rider', color: '#e6a359' },
  'frank-castle': { name: 'Punisher', color: '#b8c6d9' },
  'matt-murdock': { name: 'Daredevil', color: '#e77d77' },
};
const characterIdentities = { ...legacyCharacterIdentities, ...mcuCharacterIdentities };
export const characters: Character[] = distinct([...mcu.characters, ...legacy.characters])
  .map<Character>((character, index) => {
    const override = characterOverrides[character.id];
    const identity = characterIdentities[character.id];
    const identityName = identity?.name ?? override?.name ?? character.name;
    const realName = identity?.realName ?? character.name;
    return {
      ...character,
      name: identityName === realName ? identityName : identityName + ' / ' + realName,
      realName,
      color: override?.color ?? palette[index % palette.length],
      aliases: [
        ...new Set([
          character.name,
          identityName,
          realName,
          ...(override?.aliases ?? []),
          ...(identity?.aliases ?? []),
        ]),
      ],
    };
  })
  .concat(infinityStones.map((stone) => ({ ...stone, kind: 'infinity-stone' as const })))
  .sort((a, b) => a.name.localeCompare(b.name) || a.id.localeCompare(b.id));
export const actors = distinct([...mcu.actors, ...legacy.actors]).sort((a, b) =>
  a.name.localeCompare(b.name),
);
export const franchises: Entity[] = [...new Set(movies.flatMap((movie) => movie.franchiseIds))]
  .map((id, index) => ({
    id,
    name: franchiseNames[id] ?? id,
    color: palette[index % palette.length],
  }))
  .sort((a, b) => a.name.localeCompare(b.name));
export const studios: Entity[] = [...new Set(movies.flatMap((movie) => movie.studioIds))]
  .map((id) => ({ id, name: studioNames[id] ?? id }))
  .sort((a, b) => a.name.localeCompare(b.name));
export const catalog = { characters, actors, franchises, universes, studios };
export const movieById = new Map(movies.map((movie) => [movie.id, movie]));
export const characterById = new Map(characters.map((character) => [character.id, character]));
export const actorById = new Map(actors.map((actor) => [actor.id, actor]));
export const universeById = new Map(universes.map((universe) => [universe.id, universe]));
export const firstYear = Number(movies[0]?.releaseDate.slice(0, 4) ?? 1998);
export const lastYear = Number(movies.at(-1)?.releaseDate.slice(0, 4) ?? 2026);
