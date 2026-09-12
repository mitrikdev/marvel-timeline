import test from 'node:test';
import assert from 'node:assert/strict';
import { movies } from '../src/data';
import { getJourneyMovies, getCharacterVariants } from '../src/lib/journeys';
test('a journey visits each matching film once in release order regardless of input order', () => {
  const route = getJourneyMovies([...movies].reverse(), { kind: 'characters', id: 'peter-parker' });
  assert.equal(route.length, 15);
  assert.equal(new Set(route.map((m) => m.id)).size, route.length);
  assert.deepEqual(
    route.map((m) => m.releaseDate),
    route.map((m) => m.releaseDate).toSorted(),
  );
  assert.ok(route.every((m) => m.appearances.some((a) => a.characterId === 'peter-parker')));
});
test('actor journeys retain distinct characters and reject unknown actors', () => {
  const route = getJourneyMovies(movies, { kind: 'actors', id: 'chris-evans' });
  assert.ok(route.some((m) => m.id === 'fantastic-four-2005'));
  assert.ok(route.some((m) => m.id === 'captain-america-the-first-avenger'));
  assert.deepEqual(getJourneyMovies(movies, { kind: 'actors', id: 'missing' }), []);
});
test('three live-action Peter Parker variant paths converge at No Way Home', () => {
  const variants = getCharacterVariants(movies, 'peter-parker');
  for (const actorId of ['tobey-maguire', 'andrew-garfield', 'tom-holland']) {
    const actorVariants = variants.filter((v) => v.actorId === actorId);
    assert.ok(
      actorVariants.some((v) => v.movieIds.includes('spider-man-no-way-home')),
      actorId,
    );
  }
  assert.ok(variants.every((v) => new Set(v.movieIds).size === v.movieIds.length));
  assert.ok(variants.every((v) => v.characterId === 'peter-parker'));
});
test('variant paths honor qualifying appearance roles', () => {
  const variants = getCharacterVariants(movies, 'peter-parker', ['post-credit']);
  assert.ok(
    variants.every((v) =>
      v.movieIds.every((id) =>
        movies
          .find((m) => m.id === id)!
          .appearances.some(
            (a) =>
              a.characterId === v.characterId &&
              a.actorId === v.actorId &&
              a.universeId === v.universeId &&
              a.role === 'post-credit',
          ),
      ),
    ),
  );
});
