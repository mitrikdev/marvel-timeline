import type { Filters, MatchMode, Movie } from '../data/types';

/** A fresh filter object keeps separate callers from sharing mutable arrays. */
export function emptyFilters(): Filters {
  return {
    characters: [],
    actors: [],
    franchises: [],
    universes: [],
    studios: [],
    yearRange: null,
    roles: [],
  };
}

export function hasActiveFilters(filters: Filters): boolean {
  return (
    filters.yearRange !== null ||
    [
      filters.characters,
      filters.actors,
      filters.franchises,
      filters.universes,
      filters.studios,
      filters.roles,
    ].some((values) => values.length > 0)
  );
}

/**
 * ANY/ALL combines every selected entity id, including ids in the same group.
 * Years and roles always constrain that result. Roles qualify each appearance
 * before matching its character or actor; another cast member's role cannot
 * make an appearance qualify. Character and actor selections are movie-level
 * co-occurrence checks, so ALL does not require them to form a casting pair.
 */
export function matchesMovie(movie: Movie, filters: Filters, mode: MatchMode): boolean {
  if (filters.yearRange !== null) {
    const year = Number(movie.releaseDate.slice(0, 4));
    const [from, through] = filters.yearRange;
    if (!Number.isFinite(year) || year < from || year > through) return false;
  }

  const appearances =
    filters.roles.length > 0
      ? movie.appearances.filter((appearance) => filters.roles.includes(appearance.role))
      : movie.appearances;

  // Role-only filters and roles combined with studio/franchise/universe filters
  // still require an actual appearance in one of the selected roles.
  if (filters.roles.length > 0 && appearances.length === 0) return false;

  const entityMatches: boolean[] = [
    ...filters.characters.map((id) =>
      appearances.some((appearance) => appearance.characterId === id),
    ),
    ...filters.actors.map((id) => appearances.some((appearance) => appearance.actorId === id)),
    ...filters.franchises.map((id) => movie.franchiseIds.includes(id)),
    ...filters.universes.map(
      (id) => movie.primaryUniverseId === id || movie.crossoverUniverseIds.includes(id),
    ),
    ...filters.studios.map((id) => movie.studioIds.includes(id)),
  ];

  if (entityMatches.length === 0) return true;
  return mode === 'all' ? entityMatches.every(Boolean) : entityMatches.some(Boolean);
}

/** Preserve canonical ordering and movie identities; filtering never relays out the map. */
export function getMatchingMovies(movies: Movie[], filters: Filters, mode: MatchMode): Movie[] {
  return movies.filter((movie) => matchesMovie(movie, filters, mode));
}
