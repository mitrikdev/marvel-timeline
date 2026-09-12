import type { Movie } from '../data/types';

export type SharedConnection = { kind: 'character' | 'actor'; entityId: string };
export type ConnectionEdge = { movieId: string; connections: SharedConnection[] };
export type ConnectionGraph = ReadonlyMap<string, readonly ConnectionEdge[]>;
export type ConnectionLink = {
  fromMovieId: string;
  toMovieId: string;
  connections: SharedConnection[];
};
export type ConnectionPath = { movieIds: string[]; links: ConnectionLink[] };

const compareIds = (a: string, b: string) => (a < b ? -1 : a > b ? 1 : 0);

/** Character identity spans variants; an actor link does not imply the same character. */
export function buildConnectionGraph(movies: readonly Movie[]): ConnectionGraph {
  const movieIds = [...new Set(movies.map((movie) => movie.id))].sort(compareIds);
  const entities = new Map<string, { connection: SharedConnection; movieIds: Set<string> }>();
  for (const movie of movies) {
    for (const appearance of movie.appearances) {
      for (const kind of ['character', 'actor'] as const) {
        const entityId = kind === 'character' ? appearance.characterId : appearance.actorId;
        if (!entityId) continue;
        const key = kind + ':' + entityId;
        let entity = entities.get(key);
        if (!entity) {
          entity = { connection: { kind, entityId }, movieIds: new Set() };
          entities.set(key, entity);
        }
        entity.movieIds.add(movie.id);
      }
    }
  }

  const neighbors = new Map(movieIds.map((id) => [id, new Map<string, SharedConnection[]>()]));
  for (const { connection, movieIds: members } of entities.values()) {
    const ids = [...members].sort(compareIds);
    for (let first = 0; first < ids.length; first++) {
      for (let second = first + 1; second < ids.length; second++) {
        for (const [from, to] of [
          [ids[first], ids[second]],
          [ids[second], ids[first]],
        ]) {
          const adjacent = neighbors.get(from)!;
          const connections = adjacent.get(to) ?? [];
          connections.push(connection);
          adjacent.set(to, connections);
        }
      }
    }
  }

  return new Map(
    movieIds.map((id) => [
      id,
      [...neighbors.get(id)!]
        .sort(([a], [b]) => compareIds(a, b))
        .map(([movieId, connections]) => ({
          movieId,
          connections: connections.sort((a, b) =>
            a.kind === b.kind
              ? compareIds(a.entityId, b.entityId)
              : a.kind === 'character'
                ? -1
                : 1,
          ),
        })),
    ]),
  );
}

/** Fewest film-to-film links; equal-length paths are resolved by stable movie IDs. */
export function findShortestConnection(
  graph: ConnectionGraph,
  fromMovieId: string,
  toMovieId: string,
): ConnectionPath | null {
  if (!graph.has(fromMovieId) || !graph.has(toMovieId)) return null;
  if (fromMovieId === toMovieId) return { movieIds: [fromMovieId], links: [] };

  const queue = [fromMovieId];
  const visited = new Set(queue);
  const previous = new Map<string, { movieId: string; connections: SharedConnection[] }>();
  for (let index = 0; index < queue.length; index++) {
    const current = queue[index];
    for (const edge of graph.get(current) ?? []) {
      if (visited.has(edge.movieId)) continue;
      visited.add(edge.movieId);
      previous.set(edge.movieId, { movieId: current, connections: edge.connections });
      if (edge.movieId === toMovieId) {
        const movieIds = [toMovieId];
        const links: ConnectionLink[] = [];
        let cursor = toMovieId;
        while (cursor !== fromMovieId) {
          const step = previous.get(cursor)!;
          links.push({
            fromMovieId: step.movieId,
            toMovieId: cursor,
            connections: step.connections,
          });
          cursor = step.movieId;
          movieIds.push(cursor);
        }
        return { movieIds: movieIds.reverse(), links: links.reverse() };
      }
      queue.push(edge.movieId);
    }
  }
  return null;
}
