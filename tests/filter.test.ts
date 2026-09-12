import assert from 'node:assert/strict';
import test from 'node:test';
import type { Appearance, Filters, Movie } from '../src/data/types';
import { emptyFilters, getMatchingMovies, hasActiveFilters, matchesMovie } from '../src/lib/filter';

const appearance = (
  characterId: string,
  actorId: string,
  role: Appearance['role'] = 'lead',
  universeId = 'mcu',
): Appearance => ({ characterId, actorId, role, universeId });

const movie = (id: string, values: Partial<Movie> = {}): Movie => ({
  id,
  title: id,
  releaseDate: '2021-12-17',
  primaryUniverseId: 'mcu',
  studioIds: ['marvel'],
  franchiseIds: ['avengers'],
  crossoverUniverseIds: [],
  appearances: [],
  sourceUrls: [],
  ...values,
});

const filters = (values: Partial<Filters> = {}): Filters => ({ ...emptyFilters(), ...values });

test('empty filters match every movie in either mode, including movies without appearances', () => {
  for (const mode of ['any', 'all'] as const) {
    assert.equal(matchesMovie(movie('empty-cast'), emptyFilters(), mode), true);
  }
  assert.equal(hasActiveFilters(emptyFilters()), false);
  assert.equal(hasActiveFilters(filters({ roles: ['cameo'] })), true);
  assert.equal(hasActiveFilters(filters({ yearRange: [2000, 2026] })), true);
  assert.equal(hasActiveFilters(filters({ actors: ['actor'] })), true);
  const first = emptyFilters();
  first.characters.push('peter-parker');
  assert.deepEqual(emptyFilters().characters, []);
});

test('ANY and ALL combine selected entity ids across categories', () => {
  const peterInSony = movie('peter-sony', {
    studioIds: ['sony'],
    appearances: [appearance('peter-parker', 'tobey-maguire')],
  });
  const peterInMarvel = movie('peter-marvel', {
    appearances: [appearance('peter-parker', 'tom-holland')],
  });
  const strangeInMarvel = movie('strange-marvel', {
    appearances: [appearance('doctor-strange', 'benedict-cumberbatch')],
  });
  const selected = filters({ characters: ['peter-parker'], studios: ['marvel'] });
  assert.equal(matchesMovie(peterInSony, selected, 'any'), true);
  assert.equal(matchesMovie(strangeInMarvel, selected, 'any'), true);
  assert.equal(matchesMovie(peterInSony, selected, 'all'), false);
  assert.equal(matchesMovie(strangeInMarvel, selected, 'all'), false);
  assert.equal(matchesMovie(peterInMarvel, selected, 'all'), true);
});

test('ALL requires every selected id within the same category', () => {
  const peter = appearance('peter-parker', 'tom-holland');
  const strange = appearance('doctor-strange', 'benedict-cumberbatch');
  const selected = filters({ characters: ['peter-parker', 'doctor-strange'] });
  assert.equal(matchesMovie(movie('one', { appearances: [peter] }), selected, 'any'), true);
  assert.equal(matchesMovie(movie('one', { appearances: [peter] }), selected, 'all'), false);
  assert.equal(
    matchesMovie(movie('both', { appearances: [peter, strange] }), selected, 'all'),
    true,
  );
});

test('year range is inclusive and always AND, including under ANY', () => {
  const selected = filters({ characters: ['peter-parker'], yearRange: [2000, 2021] });
  for (const mode of ['any', 'all'] as const) {
    for (const year of [2000, 2021]) {
      assert.equal(
        matchesMovie(
          movie(String(year), {
            releaseDate: `${year}-01-01`,
            appearances: [appearance('peter-parker', 'actor')],
          }),
          selected,
          mode,
        ),
        true,
      );
    }
    for (const year of [1999, 2022]) {
      assert.equal(
        matchesMovie(
          movie(String(year), {
            releaseDate: `${year}-12-31`,
            appearances: [appearance('peter-parker', 'actor')],
          }),
          selected,
          mode,
        ),
        false,
      );
    }
    assert.equal(matchesMovie(movie('in-range-no-character'), selected, mode), false);
    assert.equal(
      matchesMovie(movie('year-only'), filters({ yearRange: [2021, 2021] }), mode),
      true,
    );
  }
});

test('a role must belong to the selected character or actor appearance', () => {
  const cast = movie('mixed-roles', {
    appearances: [
      appearance('peter-parker', 'tom-holland', 'cameo'),
      appearance('doctor-strange', 'benedict-cumberbatch', 'lead'),
    ],
  });
  for (const mode of ['any', 'all'] as const) {
    assert.equal(
      matchesMovie(cast, filters({ characters: ['peter-parker'], roles: ['lead'] }), mode),
      false,
    );
    assert.equal(
      matchesMovie(cast, filters({ actors: ['tom-holland'], roles: ['lead'] }), mode),
      false,
    );
    assert.equal(
      matchesMovie(cast, filters({ characters: ['peter-parker'], roles: ['cameo'] }), mode),
      true,
    );
  }
  assert.equal(
    matchesMovie(
      cast,
      filters({
        characters: ['peter-parker'],
        actors: ['benedict-cumberbatch'],
        roles: ['lead'],
      }),
      'all',
    ),
    false,
  );
  assert.equal(
    matchesMovie(
      cast,
      filters({
        characters: ['doctor-strange'],
        actors: ['tom-holland'],
        roles: ['lead'],
      }),
      'all',
    ),
    false,
  );
});

test('ALL actor and character filters express movie-level co-occurrence in qualifying roles', () => {
  const cast = movie('co-occurrence', {
    appearances: [
      appearance('peter-parker', 'tom-holland', 'lead'),
      appearance('doctor-strange', 'benedict-cumberbatch', 'supporting'),
    ],
  });
  assert.equal(
    matchesMovie(
      cast,
      filters({
        characters: ['doctor-strange'],
        actors: ['tom-holland'],
        roles: ['lead', 'supporting'],
      }),
      'all',
    ),
    true,
  );
});

test('roles alone match any selected role and constrain non-appearance categories', () => {
  const cameo = movie('cameo', { appearances: [appearance('hero', 'actor', 'cameo')] });
  const lead = movie('lead', { appearances: [appearance('hero', 'actor', 'lead')] });
  for (const mode of ['any', 'all'] as const) {
    assert.equal(matchesMovie(cameo, filters({ roles: ['cameo', 'post-credit'] }), mode), true);
    assert.equal(matchesMovie(lead, filters({ roles: ['cameo', 'post-credit'] }), mode), false);
    assert.equal(matchesMovie(movie('no-cast'), filters({ roles: ['cameo'] }), mode), false);
    assert.equal(
      matchesMovie(lead, filters({ roles: ['cameo'], studios: ['marvel'] }), mode),
      false,
    );
  }
});

test('universe filtering includes crossover metadata and can match several universes with ALL', () => {
  const crossover = movie('crossover', { crossoverUniverseIds: ['raimi', 'amazing'] });
  for (const universe of ['mcu', 'raimi', 'amazing']) {
    assert.equal(matchesMovie(crossover, filters({ universes: [universe] }), 'all'), true);
  }
  assert.equal(matchesMovie(crossover, filters({ universes: ['mcu', 'raimi'] }), 'all'), true);
  assert.equal(matchesMovie(crossover, filters({ universes: ['fox'] }), 'any'), false);
});

test('character filters include variants while actor filters remain distinct', () => {
  const raimi = movie('raimi', {
    primaryUniverseId: 'raimi',
    appearances: [appearance('peter-parker', 'tobey-maguire', 'lead', 'raimi')],
  });
  const mcu = movie('mcu', { appearances: [appearance('peter-parker', 'tom-holland')] });
  const crossover = movie('crossover', {
    appearances: [
      appearance('peter-parker', 'tom-holland'),
      appearance('peter-parker', 'tobey-maguire', 'supporting', 'raimi'),
    ],
  });
  const movies = [raimi, mcu, crossover];
  assert.deepEqual(
    getMatchingMovies(movies, filters({ characters: ['peter-parker'] }), 'any'),
    movies,
  );
  assert.deepEqual(getMatchingMovies(movies, filters({ actors: ['tobey-maguire'] }), 'any'), [
    raimi,
    crossover,
  ]);
  assert.deepEqual(
    getMatchingMovies(movies, filters({ actors: ['tobey-maguire', 'tom-holland'] }), 'all'),
    [crossover],
  );
});

test('franchise and studio membership matches any listed membership without mutating order', () => {
  const first = movie('first', {
    studioIds: ['marvel', 'sony'],
    franchiseIds: ['spider-man', 'avengers'],
  });
  const second = movie('second');
  const input = [second, first];
  const selected = filters({ franchises: ['spider-man'], studios: ['sony', 'marvel'] });
  const result = getMatchingMovies(input, selected, 'all');
  assert.deepEqual(result, [first]);
  assert.equal(result[0], first);
  assert.deepEqual(input, [second, first]);
});
