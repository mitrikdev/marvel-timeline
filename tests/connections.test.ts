import assert from 'node:assert/strict';
import test from 'node:test';
import type { Appearance, Movie } from '../src/data/types';
import { movies } from '../src/data';
import { buildConnectionGraph, findShortestConnection } from '../src/lib/connections';

const appearance = (
  characterId: string,
  actorId: string,
  values: Partial<Appearance> = {},
): Appearance => ({
  characterId,
  actorId,
  universeId: 'one',
  role: 'lead',
  ...values,
});
const film = (id: string, appearances: Appearance[] = []): Movie => ({
  id,
  title: id,
  releaseDate: '2020-01-01',
  primaryUniverseId: 'one',
  studioIds: [],
  franchiseIds: [],
  crossoverUniverseIds: [],
  sourceUrls: [],
  appearances,
});

test('unknown films and empty graphs have no route; a known film connects to itself with zero links', () => {
  assert.equal(findShortestConnection(buildConnectionGraph([]), 'missing', 'missing'), null);
  const graph = buildConnectionGraph([film('known')]);
  assert.deepEqual(findShortestConnection(graph, 'known', 'known'), {
    movieIds: ['known'],
    links: [],
  });
  assert.equal(findShortestConnection(graph, 'known', 'unknown'), null);
  assert.equal(findShortestConnection(graph, 'unknown', 'known'), null);
});

test('character links span recast variants and preserve their explicit character identity', () => {
  const graph = buildConnectionGraph([
    film('first', [appearance('hero', 'actor-a', { universeId: 'one' })]),
    film('reboot', [appearance('hero', 'actor-b', { universeId: 'two' })]),
  ]);
  assert.deepEqual(findShortestConnection(graph, 'first', 'reboot'), {
    movieIds: ['first', 'reboot'],
    links: [
      {
        fromMovieId: 'first',
        toMovieId: 'reboot',
        connections: [{ kind: 'character', entityId: 'hero' }],
      },
    ],
  });
});

test('an actor can link different characters, including cameo and post-credit appearances', () => {
  const graph = buildConnectionGraph([
    film('first', [appearance('hero', 'performer', { role: 'cameo' })]),
    film('second', [appearance('villain', 'performer', { role: 'post-credit' })]),
  ]);
  assert.deepEqual(findShortestConnection(graph, 'second', 'first')?.links[0].connections, [
    { kind: 'actor', entityId: 'performer' },
  ]);
});

test('actor and character IDs occupy separate namespaces; shared studios or franchises add no links', () => {
  const first = film('first', [appearance('shared-id', 'actor-a')]);
  const second = film('second', [appearance('hero-b', 'shared-id')]);
  first.studioIds = second.studioIds = ['studio'];
  first.franchiseIds = second.franchiseIds = ['series'];
  assert.equal(
    findShortestConnection(buildConnectionGraph([first, second]), 'first', 'second'),
    null,
  );
});

test('breadth-first search chooses the fewest links instead of the first longer path', () => {
  const films = [
    film('start', [appearance('a', 'actor-start'), appearance('b', 'actor-start')]),
    film('a-long', [appearance('a', 'actor-long'), appearance('c', 'actor-long')]),
    film('b-short', [appearance('b', 'actor-short'), appearance('end', 'actor-short')]),
    film('c-detour', [appearance('c', 'actor-detour'), appearance('end', 'actor-detour')]),
    film('destination', [appearance('end', 'actor-destination')]),
  ];
  const graph = buildConnectionGraph(films);
  assert.deepEqual(findShortestConnection(graph, 'start', 'destination')?.movieIds, [
    'start',
    'b-short',
    'destination',
  ]);
  films[0].appearances.push(appearance('end', 'actor-start'));
  assert.deepEqual(
    findShortestConnection(buildConnectionGraph(films), 'start', 'destination')?.movieIds,
    ['start', 'destination'],
  );
});

test('ties, connection labels and adjacency are deterministic across input order without mutating movies', () => {
  const films = [
    film('start', [appearance('red', 'actor-start'), appearance('blue', 'actor-start')]),
    film('a-bridge', [appearance('red', 'actor-bridge'), appearance('finish', 'actor-bridge')]),
    film('b-bridge', [appearance('blue', 'actor-other'), appearance('finish', 'actor-other')]),
    film('end', [appearance('finish', 'actor-end')]),
  ];
  const original = structuredClone(films);
  const reordered = [...films]
    .reverse()
    .map((movie) => ({ ...movie, appearances: [...movie.appearances].reverse() }));
  const graph = buildConnectionGraph(films);
  const otherGraph = buildConnectionGraph(reordered);
  assert.deepEqual([...graph], [...otherGraph]);
  assert.deepEqual(findShortestConnection(graph, 'start', 'end')?.movieIds, [
    'start',
    'a-bridge',
    'end',
  ]);
  assert.deepEqual(
    findShortestConnection(graph, 'start', 'end'),
    findShortestConnection(otherGraph, 'start', 'end'),
  );
  assert.deepEqual(films, original);
});

test('duplicate appearances produce one edge per neighbor and one label per shared entity', () => {
  const shared = appearance('hero', 'performer');
  const graph = buildConnectionGraph([
    film('a', [shared, shared, { ...shared, role: 'cameo' }]),
    film('b', [shared, shared]),
  ]);
  assert.deepEqual(graph.get('a'), [
    {
      movieId: 'b',
      connections: [
        { kind: 'character', entityId: 'hero' },
        { kind: 'actor', entityId: 'performer' },
      ],
    },
  ]);
  assert.equal(graph.get('b')?.length, 1);
});

test('cycles terminate and disconnected films have no path', () => {
  const graph = buildConnectionGraph([
    film('a', [appearance('ab', 'actor-a'), appearance('ca', 'actor-a')]),
    film('b', [appearance('ab', 'actor-b'), appearance('bc', 'actor-b')]),
    film('c', [appearance('bc', 'actor-c'), appearance('ca', 'actor-c')]),
    film('isolated'),
  ]);
  assert.equal(findShortestConnection(graph, 'a', 'isolated'), null);
  assert.deepEqual(findShortestConnection(graph, 'c', 'a')?.movieIds, ['c', 'a']);
});

test('canonical Chris Evans films connect as an actor; Spider-Man films connect across variants as a character', () => {
  const graph = buildConnectionGraph(movies);
  const evans = findShortestConnection(
    graph,
    'fantastic-four-2005',
    'captain-america-the-first-avenger',
  );
  assert.equal(evans?.links.length, 1);
  assert.ok(
    evans?.links[0].connections.some(
      (item) => item.kind === 'actor' && item.entityId === 'chris-evans',
    ),
  );
  const spider = findShortestConnection(graph, 'spider-man', 'spider-man-homecoming');
  assert.equal(spider?.links.length, 1);
  assert.ok(
    spider?.links[0].connections.some(
      (item) => item.kind === 'character' && item.entityId === 'peter-parker',
    ),
  );
});
