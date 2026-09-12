import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { actors, characters, franchises, movies, studios, universes } from '../src/data';
import { emptyFilters, getMatchingMovies, matchesMovie } from '../src/lib/filter';

const normalizeTitle = (title: string) =>
  title
    .normalize('NFKD')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
const byId = new Map(movies.map((movie) => [movie.id, movie]));

test('the collection contains the exact 77 film titles agreed in the build spec', () => {
  const spec = readFileSync(
    new URL('../marvel-movies-interactive-timeline-v0.1.md', import.meta.url),
    'utf8',
  );
  const scope = spec.split('# Scope')[1]?.split('# Timeline Rules')[0];
  assert.ok(scope, 'the source specification must contain its movie scope');
  const expectedTitles = [...scope.matchAll(/^- (.+)$/gm)].map((match) => normalizeTitle(match[1]));
  assert.equal(expectedTitles.length, 77);
  assert.equal(movies.length, 77);
  assert.deepEqual(
    movies.map((movie) => normalizeTitle(movie.title)).sort(),
    expectedTitles.sort(),
  );

  // The agreed titles use these particular releases, not similarly named films.
  assert.equal(byId.get('the-punisher-2004')?.releaseDate.slice(0, 4), '2004');
  assert.equal(byId.get('fantastic-four-2005')?.releaseDate.slice(0, 4), '2005');
  assert.equal(byId.get('fantastic-four-2015')?.releaseDate.slice(0, 4), '2015');
  assert.equal(byId.get('hulk-2003')?.releaseDate.slice(0, 4), '2003');
});

test('movie and entity ids are unique and canonical records have readable names', () => {
  assert.equal(new Set(movies.map((movie) => movie.id)).size, movies.length, 'duplicate movie ids');
  for (const [kind, entities] of Object.entries({
    actors,
    characters,
    franchises,
    studios,
    universes,
  })) {
    assert.equal(
      new Set(entities.map((entity) => entity.id)).size,
      entities.length,
      `duplicate ${kind} ids`,
    );
    for (const entity of entities) {
      assert.match(entity.id, /^[a-z0-9]+(?:-[a-z0-9]+)*$/, `${kind}: ${entity.id}`);
      assert.ok(entity.name.trim().length > 0, `${kind}: empty name for ${entity.id}`);
    }
  }
});

test('release dates are valid calendar dates and the combined collection is chronological', () => {
  let previousDate = '';
  for (const movie of movies) {
    assert.match(movie.releaseDate, /^\d{4}-\d{2}-\d{2}$/, `${movie.id}: ISO date required`);
    const date = new Date(`${movie.releaseDate}T00:00:00.000Z`);
    assert.ok(Number.isFinite(date.getTime()), `${movie.id}: invalid date`);
    assert.equal(
      date.toISOString().slice(0, 10),
      movie.releaseDate,
      `${movie.id}: nonexistent calendar date`,
    );
    assert.ok(
      movie.releaseDate >= previousDate,
      `${movie.id}: movies must be chronologically sorted`,
    );
    previousDate = movie.releaseDate;
  }
});

test('all movie and appearance references resolve and each movie supplies HTTPS sources', () => {
  const universeIds = new Set(universes.map((entity) => entity.id));
  const studioIds = new Set(studios.map((entity) => entity.id));
  const franchiseIds = new Set(franchises.map((entity) => entity.id));
  const characterIds = new Set(characters.map((entity) => entity.id));
  const actorIds = new Set(actors.map((entity) => entity.id));
  const roles = new Set(['lead', 'supporting', 'cameo', 'post-credit']);
  for (const movie of movies) {
    assert.ok(
      universeIds.has(movie.primaryUniverseId),
      `${movie.id}: missing primary universe ${movie.primaryUniverseId}`,
    );
    for (const id of movie.crossoverUniverseIds)
      assert.ok(universeIds.has(id), `${movie.id}: missing crossover universe ${id}`);
    assert.ok(movie.studioIds.length > 0, `${movie.id}: studio required`);
    assert.ok(movie.franchiseIds.length > 0, `${movie.id}: franchise required`);
    for (const id of movie.studioIds)
      assert.ok(studioIds.has(id), `${movie.id}: missing studio ${id}`);
    for (const id of movie.franchiseIds)
      assert.ok(franchiseIds.has(id), `${movie.id}: missing franchise ${id}`);
    assert.ok(movie.appearances.length > 0, `${movie.id}: major cast required`);
    for (const appearance of movie.appearances) {
      assert.ok(
        characterIds.has(appearance.characterId),
        `${movie.id}: missing character ${appearance.characterId}`,
      );
      assert.ok(
        actorIds.has(appearance.actorId),
        `${movie.id}: missing actor ${appearance.actorId}`,
      );
      assert.ok(
        universeIds.has(appearance.universeId),
        `${movie.id}: missing appearance universe ${appearance.universeId}`,
      );
      assert.ok(roles.has(appearance.role), `${movie.id}: invalid role ${appearance.role}`);
    }
    const tuples = movie.appearances.map((appearance) =>
      JSON.stringify([
        appearance.characterId,
        appearance.actorId,
        appearance.universeId,
        appearance.role,
      ]),
    );
    assert.equal(new Set(tuples).size, tuples.length, `${movie.id}: duplicate appearance tuple`);
    assert.ok(movie.sourceUrls.length > 0, `${movie.id}: source required`);
    for (const source of movie.sourceUrls) {
      const url = new URL(source);
      assert.equal(url.protocol, 'https:', `${movie.id}: HTTPS source required`);
      assert.ok(url.hostname.includes('.'), `${movie.id}: source hostname required`);
    }
  }
});

test('No Way Home connects three distinct Peter Parker actor and universe variants', () => {
  const movie = byId.get('spider-man-no-way-home');
  assert.ok(movie);
  assert.equal(movie.primaryUniverseId, 'mcu');
  assert.ok(movie.crossoverUniverseIds.includes('raimi'));
  assert.ok(movie.crossoverUniverseIds.includes('amazing'));
  const peters = movie.appearances.filter(
    (appearance) => appearance.characterId === 'peter-parker',
  );
  assert.deepEqual(peters.map((appearance) => [appearance.actorId, appearance.universeId]).sort(), [
    ['andrew-garfield', 'amazing'],
    ['tobey-maguire', 'raimi'],
    ['tom-holland', 'mcu'],
  ]);
  assert.equal(
    matchesMovie(
      movie,
      { ...emptyFilters(), actors: ['tom-holland', 'tobey-maguire', 'andrew-garfield'] },
      'all',
    ),
    true,
  );
});

test('Spider-Man and Doctor Strange ALL filtering retrieves their shared films', () => {
  const selected = { ...emptyFilters(), characters: ['peter-parker', 'stephen-strange'] };
  const matched = new Set(getMatchingMovies(movies, selected, 'all').map((movie) => movie.id));
  for (const id of ['avengers-infinity-war', 'avengers-endgame', 'spider-man-no-way-home']) {
    assert.ok(matched.has(id), `${id} should contain both Peter Parker and Stephen Strange`);
  }
  assert.equal(matched.has('spider-man-homecoming'), false);
  assert.equal(matched.has('spider-man-far-from-home'), false);
  assert.equal(matched.has('doctor-strange'), false);
});

test('Peter Parker and Miles Morales stay separate while sharing the Spider-Man franchise', () => {
  assert.ok(characters.some((character) => character.id === 'peter-parker'));
  assert.ok(characters.some((character) => character.id === 'miles-morales'));
  const milesFilms = getMatchingMovies(
    movies,
    { ...emptyFilters(), characters: ['miles-morales'] },
    'any',
  );
  assert.deepEqual(
    milesFilms.map((movie) => movie.id),
    ['spider-man-into-the-spider-verse', 'spider-man-across-the-spider-verse'],
  );
  for (const movie of milesFilms) {
    assert.ok(movie.franchiseIds.includes('spider-man'));
    assert.ok(movie.appearances.some((appearance) => appearance.characterId === 'peter-parker'));
  }
  assert.equal(
    matchesMovie(
      byId.get('spider-man')!,
      { ...emptyFilters(), characters: ['miles-morales'] },
      'any',
    ),
    false,
  );
  assert.equal(
    matchesMovie(
      byId.get('spider-man')!,
      { ...emptyFilters(), characters: ['peter-parker'] },
      'any',
    ),
    true,
  );
});

test('Deadpool & Wolverine forms an MCU interchange with Fox and Deadpool continuities', () => {
  const movie = byId.get('deadpool-and-wolverine');
  assert.ok(movie);
  assert.equal(movie.primaryUniverseId, 'mcu');
  assert.ok(movie.crossoverUniverseIds.includes('fox'));
  assert.ok(movie.crossoverUniverseIds.includes('deadpool'));
  assert.equal(
    matchesMovie(movie, { ...emptyFilters(), universes: ['mcu', 'fox', 'deadpool'] }, 'all'),
    true,
  );
  assert.equal(
    matchesMovie(movie, { ...emptyFilters(), characters: ['logan', 'wade-wilson'] }, 'all'),
    true,
  );
});
