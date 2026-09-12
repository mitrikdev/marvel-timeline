import type { Movie, Role } from '../data/types';
export type JourneySelection = { kind: 'characters' | 'actors'; id: string };
export function getJourneyMovies(movies: readonly Movie[], selection: JourneySelection): Movie[] {
  return movies
    .filter((movie) =>
      movie.appearances.some(
        (appearance) =>
          (selection.kind === 'characters' ? appearance.characterId : appearance.actorId) ===
          selection.id,
      ),
    )
    .toSorted((a, b) => a.releaseDate.localeCompare(b.releaseDate) || a.id.localeCompare(b.id));
}
export type CharacterVariant = {
  id: string;
  characterId: string;
  actorId: string;
  universeId: string;
  movieIds: string[];
};
export function getCharacterVariants(
  movies: readonly Movie[],
  characterId: string,
  roles: readonly Role[] = [],
): CharacterVariant[] {
  const variants = new Map<string, CharacterVariant>();
  for (const movie of movies.toSorted(
    (a, b) => a.releaseDate.localeCompare(b.releaseDate) || a.id.localeCompare(b.id),
  )) {
    for (const appearance of movie.appearances) {
      if (
        appearance.characterId !== characterId ||
        (roles.length && !roles.includes(appearance.role))
      )
        continue;
      const id = [characterId, appearance.actorId, appearance.universeId].join(':');
      const variant = variants.get(id) ?? {
        id,
        characterId,
        actorId: appearance.actorId,
        universeId: appearance.universeId,
        movieIds: [],
      };
      if (!variant.movieIds.includes(movie.id)) variant.movieIds.push(movie.id);
      variants.set(id, variant);
    }
  }
  return [...variants.values()];
}
