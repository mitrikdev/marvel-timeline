import type { Actor, Character, Movie, MovieInput } from './types';

export function slug(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function defineCollection(inputs: MovieInput[]) {
  const characters = new Map<string, Character>();
  const actors = new Map<string, Actor>();
  const movies: Movie[] = inputs.map((input) => ({
    ...input,
    crossoverUniverseIds: input.crossoverUniverseIds ?? [],
    appearances: input.appearances.map(([characterName, actorName, universeId, role]) => {
      const characterId = slug(characterName);
      const actorId = slug(actorName);
      characters.set(characterId, { id: characterId, name: characterName });
      actors.set(actorId, { id: actorId, name: actorName });
      return {
        characterId,
        actorId,
        universeId: universeId ?? input.primaryUniverseId,
        role: role ?? 'supporting',
      };
    }),
  }));
  return { movies, characters: [...characters.values()], actors: [...actors.values()] };
}
