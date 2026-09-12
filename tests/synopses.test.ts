import assert from 'node:assert/strict';
import test from 'node:test';
import { movies } from '../src/data';
import { filmSynopses } from '../src/data/synopses';

test('every catalog film has exactly one synopsis and no unknown film is included', () => {
  assert.deepEqual(Object.keys(filmSynopses).sort(), movies.map((movie) => movie.id).sort());
});

test('synopses remain concise, complete paragraphs suitable for the film modal', () => {
  for (const [id, synopsis] of Object.entries(filmSynopses)) {
    assert.equal(synopsis.text, synopsis.text.trim(), id);
    const words = synopsis.text.split(/\s+/).length;
    assert.ok(words >= 25 && words <= 45, `${id}: ${words} words`);
    assert.doesNotMatch(synopsis.text, /[\r\n<>]/, id);
    assert.doesNotMatch(synopsis.text, /\b(?:TODO|TBD|placeholder|lorem ipsum)\b/i, id);
    assert.match(synopsis.text, /[.!?]$/, id);
    const sentences = Array.from(
      new Intl.Segmenter('en', { granularity: 'sentence' }).segment(synopsis.text),
    );
    assert.ok(
      sentences.length >= 1 && sentences.length <= 2,
      `${id}: ${sentences.length} sentences`,
    );
  }
});

test('each synopsis provides a valid direct HTTPS source link', () => {
  for (const [id, { sourceUrl }] of Object.entries(filmSynopses)) {
    const url = new URL(sourceUrl);
    assert.equal(url.protocol, 'https:', id);
    assert.equal(url.username, '', id);
    assert.equal(url.password, '', id);
    assert.ok(url.pathname.length > 1, id);
    assert.ok(url.hostname.includes('.'), id);
    assert.doesNotMatch(url.hostname, /^(?:localhost|example\.)/i, id);
  }
});

test('different films do not share a placeholder synopsis', () => {
  const texts = Object.values(filmSynopses).map(({ text }) => text);
  assert.equal(new Set(texts).size, texts.length);
});
