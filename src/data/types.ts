export type Role = 'lead' | 'supporting' | 'cameo' | 'post-credit';
export type Entity = { id: string; name: string; color?: string; aliases?: string[] };
export type Character = Entity & { realName?: string; kind?: 'person' | 'infinity-stone' };
export type Actor = Entity;
export type Universe = Entity & { shortName: string };
export type Appearance = { characterId: string; actorId: string; universeId: string; role: Role };
export type StoneAppearance = {
  stoneId: string;
  role: Role;
  summary: string;
};
export type Movie = {
  id: string;
  title: string;
  releaseDate: string;
  primaryUniverseId: string;
  studioIds: string[];
  franchiseIds: string[];
  crossoverUniverseIds: string[];
  appearances: Appearance[];
  stoneAppearances?: StoneAppearance[];
  sourceUrls: string[];
  notes?: string[];
};
export type AppearanceInput = [
  characterName: string,
  actorName: string,
  universeId?: string,
  role?: Role,
];
export type MovieInput = Omit<Movie, 'appearances' | 'crossoverUniverseIds'> & {
  appearances: AppearanceInput[];
  crossoverUniverseIds?: string[];
};
export type FilterGroup = 'characters' | 'actors' | 'franchises' | 'universes' | 'studios';
export type Filters = Record<FilterGroup, string[]> & {
  yearRange: [number, number] | null;
  roles: Role[];
};
export type MatchMode = 'any' | 'all';
