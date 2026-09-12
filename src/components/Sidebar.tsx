'use client';

import { useState, type CSSProperties } from 'react';
import {
  Check,
  ChevronDown,
  ChevronRight,
  ChevronsDown,
  ChevronsUp,
  Search,
  X,
} from 'lucide-react';
import { characterById, characters, movies, universes } from '@/data';
import { characterGroups } from '@/data/character-groups';

const characterFilmCounts = new Map<string, number>();
const universeFilmCounts = new Map<string, number>();
for (const movie of movies) {
  universeFilmCounts.set(
    movie.primaryUniverseId,
    (universeFilmCounts.get(movie.primaryUniverseId) ?? 0) + 1,
  );
  for (const id of new Set(movie.appearances.map((appearance) => appearance.characterId))) {
    characterFilmCounts.set(id, (characterFilmCounts.get(id) ?? 0) + 1);
  }
}
const teams = characterGroups.map((group) => ({
  ...group,
  members: group.characterIds.flatMap((id) => {
    const character = characterById.get(id);
    return character ? [character] : [];
  }),
}));
const normalize = (value: string) =>
  value
    .normalize('NFKD')
    .toLowerCase()
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '');

export function Sidebar({
  selectedCharacterIds,
  onCharacter,
  onUniverse,
}: {
  selectedCharacterIds: string[];
  onCharacter: (id: string) => void;
  onUniverse: (id: string) => void;
}) {
  const [universeQuery, setUniverseQuery] = useState('');
  const [characterQuery, setCharacterQuery] = useState('');
  const [expanded, setExpanded] = useState<string[]>([]);
  const universeSearch = normalize(universeQuery);
  const characterSearch = normalize(characterQuery);
  const visibleUniverses = universes.filter((universe) =>
    normalize([universe.name, universe.shortName, ...(universe.aliases ?? [])].join(' ')).includes(
      universeSearch,
    ),
  );
  const visibleTeams = teams
    .map((group) => ({
      ...group,
      members: normalize(group.name).includes(characterSearch)
        ? group.members
        : group.members.filter((character) =>
            normalize(
              [character.name, character.realName, ...(character.aliases ?? [])].join(' '),
            ).includes(characterSearch),
          ),
    }))
    .filter((group) => group.members.length > 0);
  const visibleCharacterCount = visibleTeams.reduce(
    (count, group) => count + group.members.length,
    0,
  );
  const allExpanded = expanded.length === teams.length;
  const toggleTeam = (id: string) =>
    setExpanded((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  return (
    <aside className="sidebar" aria-label="Explore the atlas">
      <section
        className="sidebar-section sidebar-universes"
        aria-labelledby="sidebar-universes-heading"
      >
        <div className="sidebar-section-heading">
          <h2 id="sidebar-universes-heading">Universes</h2>
          <span>
            {universeSearch ? `${visibleUniverses.length} / ` : ''}
            {universes.length}
          </span>
        </div>
        <div className="sidebar-search">
          <Search size={14} aria-hidden="true" />
          <input
            type="search"
            value={universeQuery}
            onChange={(event) => setUniverseQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Escape') {
                event.stopPropagation();
                setUniverseQuery('');
              }
            }}
            placeholder="Filter universes…"
            aria-label="Filter universes"
            aria-controls="sidebar-universe-list"
          />
          {universeQuery && (
            <button aria-label="Clear universe search" onClick={() => setUniverseQuery('')}>
              <X size={13} />
            </button>
          )}
        </div>
        <nav
          className="sidebar-list universe-nav"
          id="sidebar-universe-list"
          aria-label="Universe timeline lanes"
        >
          {visibleUniverses.map((universe) => (
            <button
              className="sidebar-row"
              key={universe.id}
              data-universe-id={universe.id}
              title={universe.name}
              aria-label={`Jump to ${universe.name}`}
              onClick={() => onUniverse(universe.id)}
            >
              <span className="sidebar-dot" style={{ background: universe.color }} />
              <span className="sidebar-row-name">{universe.name}</span>
              <span
                className="sidebar-row-count"
                aria-label={`${universeFilmCounts.get(universe.id) ?? 0} films`}
              >
                {universeFilmCounts.get(universe.id) ?? 0}
              </span>
            </button>
          ))}
          {!visibleUniverses.length && <p className="sidebar-empty">No universes match.</p>}
        </nav>
      </section>
      <section
        className="sidebar-section sidebar-characters"
        aria-labelledby="sidebar-characters-heading"
      >
        <div className="sidebar-section-heading">
          <h2 id="sidebar-characters-heading">Characters</h2>
          <span>
            {characterSearch ? `${visibleCharacterCount} / ` : ''}
            {characters.length}
          </span>
          {!characterSearch && (
            <button
              className="sidebar-expand"
              aria-label={allExpanded ? 'Collapse all teams' : 'Expand all teams'}
              title={allExpanded ? 'Collapse all teams' : 'Expand all teams'}
              onClick={() => setExpanded(allExpanded ? [] : teams.map((group) => group.id))}
            >
              {allExpanded ? <ChevronsUp size={15} /> : <ChevronsDown size={15} />}
            </button>
          )}
        </div>
        <div className="sidebar-search">
          <Search size={14} aria-hidden="true" />
          <input
            type="search"
            value={characterQuery}
            onChange={(event) => setCharacterQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Escape') {
                event.stopPropagation();
                setCharacterQuery('');
              }
            }}
            placeholder="Find a character or team…"
            aria-label="Filter characters or teams"
            aria-controls="sidebar-character-list"
          />
          {characterQuery && (
            <button aria-label="Clear character search" onClick={() => setCharacterQuery('')}>
              <X size={13} />
            </button>
          )}
        </div>
        <div className="sidebar-list character-nav" id="sidebar-character-list">
          {visibleTeams.map((group) => {
            const isOpen = !!characterSearch || expanded.includes(group.id);
            const selectedCount = group.characterIds.filter((id) =>
              selectedCharacterIds.includes(id),
            ).length;
            const heading = (
              <>
                <span className="team-name">{group.name}</span>
                <span className="team-count">{group.members.length}</span>
                {selectedCount > 0 && (
                  <span className="team-selected" aria-label={`${selectedCount} selected`}>
                    {selectedCount}
                  </span>
                )}
              </>
            );
            return (
              <section className="character-team" key={group.id} data-team-id={group.id}>
                <h3>
                  {characterSearch ? (
                    <span className="team-heading">{heading}</span>
                  ) : (
                    <button
                      className="team-heading"
                      aria-expanded={isOpen}
                      aria-controls={`team-${group.id}`}
                      onClick={() => toggleTeam(group.id)}
                    >
                      {isOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                      {heading}
                    </button>
                  )}
                </h3>
                <div id={`team-${group.id}`} hidden={!isOpen}>
                  {group.members.map((character) => {
                    const selected = selectedCharacterIds.includes(character.id);
                    const count = characterFilmCounts.get(character.id) ?? 0;
                    return (
                      <button
                        className={`sidebar-row character-row ${selected ? 'chosen' : ''}`}
                        key={character.id}
                        data-character-id={character.id}
                        style={{ '--thread-color': character.color } as CSSProperties}
                        aria-label={`${character.name}, ${count} films`}
                        aria-pressed={selected}
                        title={
                          character.realName && character.realName !== character.name
                            ? `${character.name} · ${character.realName}`
                            : character.name
                        }
                        onClick={() => onCharacter(character.id)}
                      >
                        <span className="sidebar-dot" style={{ background: character.color }} />
                        <span className="sidebar-row-name">{character.name}</span>
                        <span className="sidebar-row-count">{count}</span>
                        {selected && <Check className="sidebar-row-check" size={12} />}
                      </button>
                    );
                  })}
                </div>
              </section>
            );
          })}
          {!visibleTeams.length && <p className="sidebar-empty">No characters or teams match.</p>}
        </div>
      </section>
      <span className="sr-only" role="status">
        {visibleUniverses.length} universes and {visibleCharacterCount} characters match sidebar
        searches.
      </span>
    </aside>
  );
}
