import test from 'node:test';
import assert from 'node:assert/strict';
import { parseWatchHistory, serializeWatchHistory } from '../src/lib/watch-history';
const valid = new Set(['iron-man', 'thor']);
test('watch history tolerates missing, malformed and unsupported stored data', () => {
  for (const raw of [
    null,
    '',
    '{',
    'null',
    '[]',
    '{"version":2,"watchedIds":["thor"]}',
    '{"version":1,"watchedIds":"thor"}',
  ])
    assert.deepEqual(parseWatchHistory(raw, valid), []);
});
test('watch history restores only known unique film IDs without trusting arbitrary values', () => {
  assert.deepEqual(
    parseWatchHistory(
      '{"version":1,"watchedIds":["thor",42,"bogus","thor","iron-man",null]}',
      valid,
    ),
    ['iron-man', 'thor'],
  );
});
test('watch history round-trips completed and cleared selections', () => {
  assert.deepEqual(parseWatchHistory(serializeWatchHistory(['thor', 'iron-man', 'thor']), valid), [
    'iron-man',
    'thor',
  ]);
  assert.deepEqual(parseWatchHistory(serializeWatchHistory([]), valid), []);
});
