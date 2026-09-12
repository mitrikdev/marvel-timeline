import assert from 'node:assert/strict';
import test from 'node:test';
import { characterById, characters } from '../src/data';
import { mcuCharacterIdentities, mcuVillainIds } from '../src/data/identities-mcu';
import { legacyCharacterIdentities, legacyVillainIds } from '../src/data/identities-legacy';

test('shared mantles show distinct alter egos in canonical character labels', () => {
  const examples: Record<string, string> = {
    'peter-parker': 'Spider-Man / Peter Parker',
    'miles-morales': 'Spider-Man / Miles Morales',
    'aaron-davis': 'Prowler / Aaron Davis',
    'norman-osborn': 'Green Goblin / Norman Osborn',
    'tony-stark': 'Iron Man / Tony Stark',
  };
  for (const [id, label] of Object.entries(examples)) {
    assert.equal(characterById.get(id)?.name, label);
  }
  assert.notEqual(characterById.get('peter-parker')?.id, characterById.get('miles-morales')?.id);
});

test('both halves of paired names stay searchable without duplicating standalone identities', () => {
  for (const id of ['peter-parker', 'miles-morales', 'aaron-davis', 'norman-osborn']) {
    const character = characterById.get(id)!;
    const [identity, alterEgo] = character.name.split(' / ');
    assert.ok(character.aliases?.includes(identity), id + ' must retain the codename');
    assert.ok(character.aliases?.includes(alterEgo), id + ' must retain the alter ego');
  }
  for (const id of ['thanos', 'ultron', 'nick-fury']) {
    assert.equal(characterById.get(id)?.name.includes(' / '), false);
  }
  assert.equal(new Set(characters.map((character) => character.id)).size, characters.length);
});

test('every curated identity and villain assignment resolves to an existing film character', () => {
  for (const entries of [mcuCharacterIdentities, legacyCharacterIdentities]) {
    for (const [id, identity] of Object.entries(entries)) {
      assert.ok(characterById.has(id), 'Unknown identity: ' + id);
      assert.ok(identity.name.trim());
      if (identity.realName !== undefined) assert.ok(identity.realName.trim());
      for (const alias of identity.aliases ?? []) assert.ok(alias.trim());
    }
  }
  for (const id of [...mcuVillainIds, ...legacyVillainIds]) {
    assert.ok(characterById.has(id), 'Unknown villain: ' + id);
  }
});
