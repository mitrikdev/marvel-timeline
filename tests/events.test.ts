import assert from 'node:assert/strict';
import test from 'node:test';
import { movieById } from '../src/data';
import { timelineEvents } from '../src/data/events';

test('event records have unique ids, a related film, and usable source links', () => {
  const ids = new Set<string>();
  for (const event of timelineEvents) {
    assert.ok(!ids.has(event.id), `Duplicate event: ${event.id}`);
    ids.add(event.id);
    assert.match(event.id, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    assert.ok(event.title.trim());
    assert.ok(event.description.trim());
    assert.ok(movieById.has(event.movieId), `Unknown film for ${event.id}`);
    assert.ok(event.kind === 'story' || event.kind === 'milestone');
    assert.ok(event.sourceUrls.length > 0, `Missing sources for ${event.id}`);
    for (const source of event.sourceUrls) assert.equal(new URL(source).protocol, 'https:');
  }
});

test('requested events distinguish the Snap, the return, and a series finale', () => {
  const events = new Map(timelineEvents.map((event) => [event.id, event]));
  assert.equal(events.get('thanos-snap')?.movieId, 'avengers-infinity-war');
  assert.equal(events.get('the-blip-return')?.movieId, 'avengers-endgame');
  assert.equal(events.get('battle-of-sokovia')?.movieId, 'avengers-age-of-ultron');
  assert.equal(events.get('raimi-trilogy-finale')?.movieId, 'spider-man-3');
  assert.equal(events.get('raimi-trilogy-finale')?.kind, 'milestone');
});
