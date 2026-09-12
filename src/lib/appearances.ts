import type { Appearance, Movie } from '../data/types';

type CharacterAppearance = Pick<Appearance, 'characterId' | 'role' | 'universeId'>;

/** Selectable story entities, without inventing cast or actor credits for artifacts. */
export function getCharacterAppearances(movie: Movie): CharacterAppearance[] {
  if (!movie.stoneAppearances?.length) return movie.appearances;
  return [
    ...movie.appearances,
    ...movie.stoneAppearances.map((appearance) => ({
      characterId: appearance.stoneId,
      role: appearance.role,
      universeId: movie.primaryUniverseId,
    })),
  ];
}
