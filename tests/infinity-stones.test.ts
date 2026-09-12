import assert from 'node:assert/strict';
import test from 'node:test';
import { actors, characters, movies, movieById } from '../src/data';
import { infinityStones, stoneAppearances } from '../src/data/infinity-stones';
import { characterGroups } from '../src/data/character-groups';
import { emptyFilters, getMatchingMovies, matchesMovie } from '../src/lib/filter';
import { getJourneyMovies, getCharacterVariants } from '../src/lib/journeys';
import { buildConnectionGraph } from '../src/lib/connections';

const stoneIds = [
  'space-stone',
  'mind-stone',
  'reality-stone',
  'power-stone',
  'time-stone',
  'soul-stone',
];

test('all six Stones have distinct colors, artifact aliases, and a dedicated navigation group', () => {
  assert.deepEqual(infinityStones.map((stone) => stone.id).sort(), [...stoneIds].sort());
  assert.equal(new Set(infinityStones.map((stone) => stone.color)).size, 6);
  assert.deepEqual(
    characterGroups.find((group) => group.id === 'infinity-stones')?.characterIds.toSorted(),
    [...stoneIds].sort(),
  );
  for (const stone of infinityStones) {
    assert.ok(stone.aliases.length);
    assert.ok(stone.description);
    assert.ok(stone.sourceUrls.length);
    for (const source of stone.sourceUrls) assert.equal(new URL(source).protocol, 'https:');
    assert.equal(characters.find((entity) => entity.id === stone.id)?.kind, 'infinity-stone');
  }
  assert.ok(
    infinityStones.find((stone) => stone.id === 'space-stone')?.aliases.includes('Tesseract'),
  );
  assert.ok(
    infinityStones.find((stone) => stone.id === 'reality-stone')?.aliases.includes('Aether'),
  );
});

test('Stone journey records reference known films exactly once and explain every stop', () => {
  const seen = new Set<string>();
  for (const appearance of stoneAppearances) {
    assert.ok(movieById.has(appearance.movieId));
    assert.ok(stoneIds.includes(appearance.stoneId));
    assert.ok(['supporting', 'cameo', 'post-credit'].includes(appearance.role));
    assert.ok(appearance.summary.trim().length > 30);
    const key = appearance.movieId + ':' + appearance.stoneId;
    assert.equal(seen.has(key), false, 'Duplicate Stone stop: ' + key);
    seen.add(key);
  }
  for (const id of stoneIds) {
    const route = getJourneyMovies([...movies].reverse(), { kind: 'characters', id });
    assert.ok(route.length >= 2, id + ' needs a journey');
    assert.deepEqual(
      route.map((movie) => movie.id),
      getMatchingMovies(movies, { ...emptyFilters(), characters: [id] }, 'any').map(
        (movie) => movie.id,
      ),
    );
  }
});

test('Stones combine with characters, actors, dates and roles without borrowing their cast roles', () => {
  const thor = movieById.get('thor')!;
  assert.equal(
    matchesMovie(
      thor,
      { ...emptyFilters(), characters: ['space-stone'], roles: ['post-credit'] },
      'all',
    ),
    true,
  );
  assert.equal(
    matchesMovie(thor, { ...emptyFilters(), characters: ['space-stone'], roles: ['lead'] }, 'any'),
    false,
  );
  const avengers = movieById.get('the-avengers')!;
  assert.equal(
    matchesMovie(
      avengers,
      {
        ...emptyFilters(),
        characters: ['space-stone', 'mind-stone', 'loki'],
        actors: ['tom-hiddleston'],
      },
      'all',
    ),
    true,
  );
  assert.equal(
    matchesMovie(
      avengers,
      { ...emptyFilters(), characters: ['space-stone'], yearRange: [2013, 2026] },
      'any',
    ),
    false,
  );
  assert.equal(
    matchesMovie(
      movieById.get('avengers-endgame')!,
      { ...emptyFilters(), characters: stoneIds },
      'all',
    ),
    true,
  );
});

test('Stones never invent actors, actor variants, or shared cast connections', () => {
  const graph = buildConnectionGraph(movies);
  for (const id of stoneIds) {
    assert.equal(
      actors.some((actor) => actor.id === id),
      false,
    );
    assert.deepEqual(getJourneyMovies(movies, { kind: 'actors', id }), []);
    assert.deepEqual(getCharacterVariants(movies, id), []);
    assert.equal(
      movies.some((movie) => movie.appearances.some((appearance) => appearance.characterId === id)),
      false,
    );
    assert.equal(
      [...graph.values()].some((edges) =>
        edges.some((edge) => edge.connections.some((connection) => connection.entityId === id)),
      ),
      false,
    );
  }
});

test('depictions and time-heist versions are distinguished from physical custody', () => {
  const collector = stoneAppearances.find(
    (appearance) =>
      appearance.movieId === 'guardians-of-the-galaxy' && appearance.stoneId === 'soul-stone',
  );
  assert.equal(collector?.role, 'cameo');
  assert.match(collector!.summary, /depict|illustrat|presentation/i);
  assert.equal(
    stoneAppearances.some((appearance) => appearance.movieId === 'guardians-of-the-galaxy-vol-2'),
    false,
  );
  assert.equal(
    stoneAppearances.some(
      (appearance) => appearance.movieId === 'thor' && appearance.stoneId !== 'space-stone',
    ),
    false,
  );
  assert.equal(movieById.get('avengers-endgame')?.stoneAppearances?.length, 6);
});
