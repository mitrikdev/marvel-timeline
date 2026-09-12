import assert from 'node:assert/strict';
import test from 'node:test';
import { characters } from '../src/data';
import { characterGroups } from '../src/data/character-groups';

function group(id: string) {
  const result = characterGroups.find((item) => item.id === id);
  assert.ok(result, 'Missing character group: ' + id);
  return result;
}

test('every canonical character appears in exactly one sidebar group', () => {
  const canonicalIds = new Set(characters.map((character) => character.id));
  const assignments = new Map<string, string>();
  for (const item of characterGroups) {
    for (const id of item.characterIds) {
      assert.ok(canonicalIds.has(id), item.id + ' references unknown character ' + id);
      assert.equal(
        assignments.has(id),
        false,
        id + ' is repeated in ' + item.id + ' and ' + assignments.get(id),
      );
      assignments.set(id, item.id);
    }
  }
  assert.deepEqual([...assignments.keys()].sort(), [...canonicalIds].sort());
});

test('sidebar groups have unique stable ids, readable names and useful contents', () => {
  const ids = characterGroups.map((item) => item.id);
  assert.equal(new Set(ids).size, ids.length, 'duplicate group ids');
  for (const item of characterGroups) {
    assert.match(item.id, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    assert.ok(item.name.trim().length > 0, item.id + ' needs a visible name');
    assert.ok(item.characterIds.length > 0, item.id + ' should not render an empty section');
  }
});

test('recognizable teams retain representative members in their primary navigation groups', () => {
  const examples: Record<string, string[]> = {
    avengers: ['tony-stark', 'steve-rogers', 'natasha-romanoff', 'bruce-banner'],
    'x-men': ['logan', 'ororo-munroe'],
    'fantastic-four': ['reed-richards', 'sue-storm', 'johnny-storm', 'ben-grimm'],
    'spider-verse': ['peter-parker', 'miles-morales'],
  };
  for (const [groupId, memberIds] of Object.entries(examples)) {
    const item = group(groupId);
    for (const id of memberIds)
      assert.ok(item.characterIds.includes(id), id + ' belongs in ' + groupId);
  }
});

test('major Avengers adversaries are not presented as Avengers members', () => {
  const members = group('avengers').characterIds;
  for (const id of ['thanos', 'ultron']) {
    assert.ok(
      characters.some((character) => character.id === id),
      'fixture character should exist: ' + id,
    );
    assert.equal(members.includes(id), false, id + ' should not be listed as an Avenger');
  }
});

test('the final Other characters section preserves access to the rest of the catalog', () => {
  const other = group('other-characters');
  assert.equal(characterGroups.at(-1), other);
  assert.equal(other.name, 'Other characters');
  assert.ok(
    other.characterIds.includes('thanos'),
    'an ungrouped major character must remain discoverable',
  );
});
