'use client';

import Link from 'next/link';
import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent,
} from 'react';
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  Compass,
  Crosshair,
  Diamond,
  Expand,
  GitBranch,
  Info,
  Move,
  Plus,
  RotateCcw,
  Search,
  SlidersHorizontal,
  X,
  Minus,
} from 'lucide-react';
import {
  actorById,
  catalog,
  characterById,
  firstYear,
  lastYear,
  movieById,
  movies,
  universes,
  universeById,
} from '@/data';
import type { Entity, FilterGroup, Filters, MatchMode, Movie, Role } from '@/data/types';
import { emptyFilters, getMatchingMovies, hasActiveFilters } from '@/lib/filter';
import { buildLayout, threadPath, TIMELINE_METRICS } from '@/lib/timeline';
import { Dialog } from './Dialog';
import { EventDetails } from './EventDetails';
import { MoviePoster } from './MoviePoster';
import { posters } from '@/data/posters';
import { Sidebar } from './Sidebar';
import { timelineEvents } from '@/data/events';

const groups: { key: FilterGroup; label: string }[] = [
  { key: 'characters', label: 'Characters' },
  { key: 'actors', label: 'Actors' },
  { key: 'franchises', label: 'Franchises / teams' },
  { key: 'universes', label: 'Universes' },
  { key: 'studios', label: 'Studios' },
];
const initials = (value: string) =>
  value
    .split(/[\s-]+/)
    .map((word) => word[0])
    .slice(0, 2)
    .join('');
const colorStyle = (color?: string): CSSProperties =>
  ({ '--thread-color': color ?? '#a7aebb' }) as CSSProperties;
const formatDate = (value: string) =>
  new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${value}T00:00:00Z`));

export function Atlas() {
  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const [matchMode, setMatchMode] = useState<MatchMode>('any');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [showEvents, setShowEvents] = useState(true);
  const [panel, setPanel] = useState<'filters' | 'about' | null>(null);
  const [filterGroup, setFilterGroup] = useState<FilterGroup>('characters');
  const [query, setQuery] = useState('');
  const [density, setDensity] = useState<number>(TIMELINE_METRICS.densityDefault);
  const viewport = useRef<HTMLDivElement>(null);
  const minimapWindow = useRef<HTMLSpanElement>(null);
  const searchInput = useRef<HTMLInputElement>(null);
  const drag = useRef<{
    x: number;
    y: number;
    left: number;
    top: number;
    moved: boolean;
    pointer: number;
  } | null>(null);
  const suppressClick = useRef(false);
  const zoomAnchor = useRef<{ yearOffset: number; universeId: string; laneOffset: number } | null>(
    null,
  );
  const layout = useMemo(
    () => buildLayout(movies, universes, density, showEvents ? timelineEvents : []),
    [density, showEvents],
  );
  const matching = useMemo(
    () => getMatchingMovies(movies, filters, matchMode),
    [filters, matchMode],
  );
  const matchingIds = useMemo(() => new Set(matching.map((movie) => movie.id)), [matching]);
  const active = hasActiveFilters(filters);
  const selectedMovie = selectedId ? movieById.get(selectedId) : undefined;
  const selectedEvent = timelineEvents.find((event) => event.id === selectedEventId);
  const selectedEventMovie = selectedEvent ? movieById.get(selectedEvent.movieId) : undefined;
  const selectedCount =
    groups.reduce((total, group) => total + filters[group.key].length, 0) +
    filters.roles.length +
    (filters.yearRange ? 1 : 0);

  function toggleFilter(group: FilterGroup, id: string) {
    setFilters((current) => ({
      ...current,
      [group]: current[group].includes(id)
        ? current[group].filter((item) => item !== id)
        : [...current[group], id],
    }));
  }
  function addFilter(group: FilterGroup, id: string) {
    setFilters((current) =>
      current[group].includes(id) ? current : { ...current, [group]: [...current[group], id] },
    );
  }
  function scrollToMovie(id: string) {
    scrollToNode(layout.nodes.get(id));
  }
  function scrollToEvent(id: string) {
    const node = layout.eventNodes.get(id);
    if (node) scrollToNode(node);
    else {
      const event = timelineEvents.find((item) => item.id === id);
      if (event) scrollToMovie(event.movieId);
    }
  }
  function scrollToNode(node?: { x: number; y: number }) {
    if (node && viewport.current)
      viewport.current.scrollTo({
        left: node.x - viewport.current.clientWidth / 2,
        top: node.y - viewport.current.clientHeight / 2 + 36,
        behavior: prefersReducedMotion() ? 'instant' : 'smooth',
      });
  }
  function scrollToUniverse(id: string) {
    const lane = layout.lanes.find((item) => item.id === id);
    const firstMovie = movies.find((movie) => movie.primaryUniverseId === id);
    if (lane && viewport.current)
      viewport.current.scrollTo({
        top: lane.y - lane.height / 2,
        left: Math.max(0, (firstMovie ? (layout.nodes.get(firstMovie.id)?.x ?? 72) : 72) - 100),
        behavior: prefersReducedMotion() ? 'instant' : 'smooth',
      });
  }
  function scrollToYear(year: number) {
    viewport.current?.scrollTo({
      left: 72 + (year - layout.yearStart) * density - 40,
      behavior: prefersReducedMotion() ? 'instant' : 'smooth',
    });
  }
  function rememberViewport() {
    const view = viewport.current;
    if (view) {
      const middleY = view.scrollTop + view.clientHeight / 2 - 36;
      const lane =
        layout.lanes.find(
          (item) => middleY >= item.y - item.height / 2 && middleY <= item.y + item.height / 2,
        ) ?? layout.lanes[0];
      zoomAnchor.current = {
        yearOffset: (view.scrollLeft + view.clientWidth / 2 - 72) / density,
        universeId: lane.id,
        laneOffset: (middleY - lane.y) / lane.height,
      };
    }
  }
  function zoom(nextDensity: number) {
    rememberViewport();
    setDensity(nextDensity);
  }
  useLayoutEffect(() => {
    const anchor = zoomAnchor.current;
    const view = viewport.current;
    if (!anchor || !view) return;
    const lane = layout.lanes.find((item) => item.id === anchor.universeId);
    view.scrollLeft = 72 + anchor.yearOffset * density - view.clientWidth / 2;
    if (lane)
      view.scrollTop = lane.y + anchor.laneOffset * lane.height - view.clientHeight / 2 + 36;
    zoomAnchor.current = null;
  }, [density, layout]);
  function updateMinimap() {
    const view = viewport.current;
    if (view && minimapWindow.current) {
      minimapWindow.current.style.left = `${(view.scrollLeft / layout.width) * 100}%`;
      minimapWindow.current.style.width = `${Math.min(100, (view.clientWidth / layout.width) * 100)}%`;
    }
  }
  useEffect(() => {
    const view = viewport.current;
    if (!view) return;
    view.scrollLeft = 72 + (2015 - firstYear) * TIMELINE_METRICS.densityDefault;
  }, []);
  useEffect(() => {
    const view = viewport.current;
    const indicator = minimapWindow.current;
    if (!view || !indicator) return;
    const sync = () => {
      indicator.style.left = `${(view.scrollLeft / layout.width) * 100}%`;
      indicator.style.width = `${Math.min(100, (view.clientWidth / layout.width) * 100)}%`;
    };
    const observer = new ResizeObserver(sync);
    observer.observe(view);
    sync();
    return () => observer.disconnect();
  }, [layout.width]);
  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        searchInput.current?.focus();
      }
      if (event.key === 'Escape') setQuery('');
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, []);

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const found: {
      id: string;
      name: string;
      type: FilterGroup | 'movie' | 'event';
      detail: string;
      color?: string;
    }[] = [];
    for (const group of groups) {
      for (const entity of catalog[group.key]) {
        if (
          [
            entity.name,
            ...(entity.aliases ?? []),
            'realName' in entity ? String(entity.realName) : '',
          ]
            .join(' ')
            .toLowerCase()
            .includes(q)
        ) {
          found.push({ ...entity, type: group.key, detail: group.label });
        }
      }
    }
    const filmResults = movies
      .filter((movie) => movie.title.toLowerCase().includes(q))
      .map((movie) => ({
        id: movie.id,
        name: movie.title,
        type: 'movie' as const,
        detail: `Film · ${movie.releaseDate.slice(0, 4)}`,
        color: undefined,
      }));
    const eventResults = timelineEvents
      .filter((event) => event.title.toLowerCase().includes(q))
      .map((event) => ({
        id: event.id,
        name: event.title,
        type: 'event' as const,
        detail: `${event.kind === 'story' ? 'Story event' : 'Series milestone'} · ${movieById.get(event.movieId)?.releaseDate.slice(0, 4)} release`,
        color: '#edc27c',
      }));
    return [...eventResults.slice(0, 5), ...found.slice(0, 5), ...filmResults.slice(0, 5)];
  }, [query]);

  const threads = useMemo(() => {
    const selectedThreads = [
      ...filters.characters.map((id) => ({
        entity: characterById.get(id),
        kind: 'characters' as const,
      })),
      ...filters.franchises.map((id) => ({
        entity: catalog.franchises.find((item) => item.id === id),
        kind: 'franchises' as const,
      })),
    ];
    return selectedThreads.flatMap(({ entity, kind }) => {
      if (!entity) return [];
      const relevant = matching.filter((movie) =>
        kind === 'characters'
          ? movie.appearances.some(
              (appearance) =>
                appearance.characterId === entity.id &&
                (!filters.roles.length || filters.roles.includes(appearance.role)),
            )
          : movie.franchiseIds.includes(entity.id),
      );
      const nodes = relevant.flatMap((movie) => {
        const node = layout.nodes.get(movie.id);
        return node ? [node] : [];
      });
      return [
        {
          id: `${kind}-${entity.id}`,
          name: entity.name,
          color: entity.color,
          path: threadPath(nodes),
          count: nodes.length,
          franchise: kind === 'franchises',
        },
      ];
    });
  }, [filters, matching, layout]);

  const lanePaths = useMemo(
    () =>
      universes.map((universe) => ({
        ...universe,
        path: threadPath(
          movies
            .filter((movie) => movie.primaryUniverseId === universe.id)
            .flatMap((movie) => {
              const node = layout.nodes.get(movie.id);
              return node ? [node] : [];
            }),
        ),
      })),
    [layout],
  );

  function pointerDown(event: PointerEvent<HTMLDivElement>) {
    suppressClick.current = false;
    if (event.pointerType === 'touch' || event.button !== 0) return;
    const view = viewport.current;
    if (!view) return;
    drag.current = {
      x: event.clientX,
      y: event.clientY,
      left: view.scrollLeft,
      top: view.scrollTop,
      moved: false,
      pointer: event.pointerId,
    };
  }
  function pointerMove(event: PointerEvent<HTMLDivElement>) {
    const current = drag.current;
    const view = viewport.current;
    if (!current || !view) return;
    const dx = event.clientX - current.x;
    const dy = event.clientY - current.y;
    if (Math.abs(dx) + Math.abs(dy) > 5) {
      if (!current.moved) view.setPointerCapture(event.pointerId);
      current.moved = true;
      suppressClick.current = true;
      view.scrollLeft = current.left - dx;
      view.scrollTop = current.top - dy;
      view.classList.add('is-dragging');
    }
  }
  function pointerUp() {
    const view = viewport.current;
    if (view && drag.current && view.hasPointerCapture(drag.current.pointer))
      view.releasePointerCapture(drag.current.pointer);
    view?.classList.remove('is-dragging');
    drag.current = null;
  }

  return (
    <>
      <div className="app-shell">
        <header className="masthead">
          <Link className="brand" href="/" aria-label="Marvel Atlas home">
            <span className="marvel-mark">MARVEL</span>
            <span className="atlas-word">
              ATLAS<span className="brand-dot">.</span>
            </span>
          </Link>
          <span className="masthead-divider" />
          <span className="brand-caption">THE MARVEL MOVIE TIMELINE</span>
          <div className="masthead-right">
            <span className="edition">
              <span className="status-dot" /> {firstYear}–{lastYear}
            </span>
            <button
              className="icon-button"
              aria-label="About Marvel Atlas"
              onClick={() => setPanel('about')}
            >
              <Info size={18} />
            </button>
          </div>
        </header>

        <div className="workspace">
          <Sidebar
            selectedCharacterIds={filters.characters}
            onCharacter={(id) => toggleFilter('characters', id)}
            onClearCharacters={() => setFilters((current) => ({ ...current, characters: [] }))}
            onUniverse={scrollToUniverse}
          />

          <main className="main-panel">
            <h1 className="sr-only">Marvel movie timeline</h1>
            <div className="toolbar">
              <div className="search-wrap">
                <Search size={17} />
                <input
                  ref={searchInput}
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Find a film, event, character…"
                  aria-label="Search movies, events, characters, actors, franchises and universes"
                  aria-controls="search-results"
                  autoComplete="off"
                />
                <kbd>⌘ K</kbd>
                {!!query.trim() && (
                  <SearchResults
                    results={searchResults}
                    onClose={() => setQuery('')}
                    onSelect={(id, type) => {
                      if (type === 'movie') {
                        setSelectedId(id);
                        scrollToMovie(id);
                      } else if (type === 'event') {
                        setSelectedId(null);
                        setSelectedEventId(id);
                        scrollToEvent(id);
                      } else addFilter(type, id);
                      setQuery('');
                    }}
                  />
                )}
              </div>
              <button
                className={`filter-button ${selectedCount ? 'has-filters' : ''}`}
                onClick={() => setPanel('filters')}
              >
                <SlidersHorizontal size={16} />
                Filters{selectedCount > 0 && <span className="filter-count">{selectedCount}</span>}
              </button>
              <span className="toolbar-divider" />
              <div className="match-control">
                <label htmlFor="match-mode">Match</label>
                <select
                  id="match-mode"
                  value={matchMode}
                  onChange={(event) => setMatchMode(event.target.value as MatchMode)}
                >
                  <option value="any">ANY</option>
                  <option value="all">ALL</option>
                </select>
                <ChevronDown size={12} />
              </div>
              <button
                className="reset-button"
                onClick={() => {
                  setFilters(emptyFilters());
                  setQuery('');
                }}
                disabled={!active}
              >
                <RotateCcw size={14} />
                <span>Reset</span>
              </button>
            </div>

            <div className="filter-summary">
              <div className="chips">
                {groups.flatMap((group) =>
                  filters[group.key].map((id) => {
                    const entity = catalog[group.key].find((item) => item.id === id);
                    return (
                      <button
                        className="filter-chip"
                        key={`${group.key}-${id}`}
                        style={colorStyle(entity?.color)}
                        aria-label={`Remove ${entity?.name ?? id} filter`}
                        onClick={() => toggleFilter(group.key, id)}
                      >
                        <span className="chip-dot" />
                        {entity?.name ?? id}
                        <X size={12} />
                      </button>
                    );
                  }),
                )}
                {filters.yearRange && (
                  <button
                    className="filter-chip"
                    onClick={() => setFilters((current) => ({ ...current, yearRange: null }))}
                    aria-label="Remove year range filter"
                  >
                    {filters.yearRange[0]}—{filters.yearRange[1]}
                    <X size={12} />
                  </button>
                )}
                {filters.roles.map((role) => (
                  <button
                    className="filter-chip"
                    key={role}
                    onClick={() =>
                      setFilters((current) => ({
                        ...current,
                        roles: current.roles.filter((item) => item !== role),
                      }))
                    }
                    aria-label={`Remove ${role} role filter`}
                  >
                    {role}
                    <X size={12} />
                  </button>
                ))}
                {!active && (
                  <span className="unfiltered-hint">
                    <span className="small-orbit" /> Choose a character to trace their films.
                  </span>
                )}
              </div>
              <span className="result-count" role="status" aria-live="polite">
                <strong>{matching.length}</strong> / {movies.length} films
              </span>
            </div>

            <section className="map-section" aria-label="Interactive movie timeline">
              <div className="map-topline">
                <span>
                  <span className="status-dot" /> RELEASE ORDER
                </span>
                <div className="map-topline-actions">
                  <button
                    className="event-toggle"
                    aria-label="Show major events"
                    aria-pressed={showEvents}
                    onClick={() => {
                      rememberViewport();
                      setShowEvents((value) => !value);
                    }}
                  >
                    <Diamond size={12} /> Events {showEvents && <Check size={12} />}
                  </button>
                  <span className="map-pan-hint">
                    <Move size={12} /> DRAG TO EXPLORE
                  </span>
                </div>
              </div>
              <div
                className="timeline-scroll"
                ref={viewport}
                tabIndex={0}
                role="region"
                aria-label="Movie map. Use arrow keys or drag to pan. Movies are ordered by US theatrical release date."
                onScroll={updateMinimap}
                onPointerDown={pointerDown}
                onPointerMove={pointerMove}
                onPointerUp={pointerUp}
                onPointerCancel={() => {
                  pointerUp();
                  suppressClick.current = false;
                }}
                onClickCapture={(event) => {
                  if (suppressClick.current && event.detail !== 0) {
                    event.preventDefault();
                    event.stopPropagation();
                    suppressClick.current = false;
                  }
                }}
              >
                <div
                  className="timeline-board"
                  style={{ width: layout.width, height: layout.height + 36 }}
                >
                  <div className="year-axis">
                    {Array.from(
                      { length: layout.yearEnd - layout.yearStart },
                      (_, index) => layout.yearStart + index,
                    ).map((year) => (
                      <span
                        key={year}
                        className={year % 5 === 0 ? 'major-year' : ''}
                        style={{ left: 72 + (year - layout.yearStart) * density }}
                      >
                        {year}
                        <i />
                      </span>
                    ))}
                  </div>
                  <div
                    className="timeline-canvas"
                    style={
                      {
                        height: layout.height,
                        '--movie-card-width': `${TIMELINE_METRICS.cardWidth}px`,
                        '--movie-card-height': `${TIMELINE_METRICS.cardHeight}px`,
                        '--event-card-width': `${TIMELINE_METRICS.eventWidth}px`,
                        '--event-card-height': `${TIMELINE_METRICS.eventHeight}px`,
                      } as CSSProperties
                    }
                  >
                    {Array.from({ length: layout.yearEnd - layout.yearStart }, (_, index) => (
                      <div
                        key={index}
                        className="year-gridline"
                        style={{ left: 72 + index * density }}
                      />
                    ))}
                    {layout.lanes.map((lane, index) => (
                      <div
                        className={`lane-band ${index % 2 ? 'alternate' : ''}`}
                        key={lane.id}
                        style={{ top: lane.y - lane.height / 2, height: lane.height }}
                      >
                        <div
                          className="lane-name"
                          style={colorStyle(universeById.get(lane.id)?.color)}
                        >
                          <span />
                          <strong>{universeById.get(lane.id)?.shortName}</strong>
                          <i />
                        </div>
                      </div>
                    ))}
                    <svg
                      className="thread-layer"
                      width={layout.width}
                      height={layout.height}
                      aria-hidden="true"
                    >
                      <defs>
                        <filter id="thread-glow" x="-20%" y="-30%" width="140%" height="160%">
                          <feGaussianBlur stdDeviation="4" />
                        </filter>
                      </defs>
                      {lanePaths.map((lane) => (
                        <path
                          key={lane.id}
                          data-continuity={lane.id}
                          d={lane.path}
                          fill="none"
                          stroke={lane.color}
                          strokeWidth="1.8"
                          opacity={active ? 0.34 : 0.58}
                        />
                      ))}
                      {threads.map((thread, index) => (
                        <g key={thread.id} className="active-thread" data-thread={thread.id}>
                          <path
                            d={thread.path}
                            fill="none"
                            stroke={thread.color}
                            strokeWidth={thread.franchise ? 6 : 9}
                            opacity=".22"
                            filter="url(#thread-glow)"
                          />
                          <path
                            d={thread.path}
                            fill="none"
                            stroke={thread.color}
                            strokeWidth={thread.franchise ? 2.2 : 3}
                            strokeLinecap="round"
                            strokeDasharray={index > 0 ? '7 4' : undefined}
                          />
                        </g>
                      ))}
                      {movies
                        .filter((movie) => movie.crossoverUniverseIds.length)
                        .flatMap((movie) => {
                          const target = layout.nodes.get(movie.id);
                          if (!target) return [];
                          return movie.crossoverUniverseIds.flatMap((universeId) => {
                            const previous = movies
                              .filter(
                                (item) =>
                                  item.primaryUniverseId === universeId &&
                                  item.releaseDate <= movie.releaseDate,
                              )
                              .at(-1);
                            const source = previous ? layout.nodes.get(previous.id) : undefined;
                            if (!source) return [];
                            return (
                              <path
                                key={`${movie.id}-${universeId}`}
                                data-crossover={`${movie.id}-${universeId}`}
                                d={threadPath([source, target])}
                                fill="none"
                                stroke={universeById.get(universeId)?.color}
                                strokeWidth="1.7"
                                strokeDasharray="4 5"
                                opacity={active ? (matchingIds.has(movie.id) ? 0.76 : 0.38) : 0.56}
                              />
                            );
                          });
                        })}
                    </svg>
                    {[...layout.eventNodes.values()].map(({ event, movie, x, y }) => (
                      <button
                        key={event.id}
                        className={`event-node ${event.kind} ${matchingIds.has(movie.id) ? 'is-match' : 'is-faded'}`}
                        data-event-id={event.id}
                        data-movie-anchor={movie.id}
                        data-matching={matchingIds.has(movie.id)}
                        aria-label={`${event.title}, ${event.kind === 'story' ? 'story event' : 'series milestone'}, ${movie.releaseDate.slice(0, 4)} release${active ? (matchingIds.has(movie.id) ? ', matches filters' : ', outside filters') : ''}`}
                        aria-haspopup="dialog"
                        aria-pressed={selectedEventId === event.id}
                        title={`${event.title} · ${movie.title}`}
                        style={{
                          left: x - TIMELINE_METRICS.cardAnchorX,
                          top: y - TIMELINE_METRICS.eventHeight / 2,
                        }}
                        onClick={() => {
                          setSelectedId(null);
                          setSelectedEventId(event.id);
                        }}
                      >
                        <Diamond size={13} aria-hidden="true" />
                        <span>{event.title}</span>
                      </button>
                    ))}
                    {movies.map((movie) => {
                      const node = layout.nodes.get(movie.id);
                      if (!node) return null;
                      const matching = matchingIds.has(movie.id);
                      const characterColor = filters.characters
                        .map((id) => characterById.get(id))
                        .find((character) =>
                          movie.appearances.some(
                            (appearance) => appearance.characterId === character?.id,
                          ),
                        )?.color;
                      const color =
                        characterColor ?? universeById.get(movie.primaryUniverseId)?.color;
                      return (
                        <button
                          key={movie.id}
                          className={`movie-node ${matching ? 'is-match' : 'is-faded'} ${active && matching ? 'is-highlighted' : ''} ${movie.crossoverUniverseIds.length ? 'is-crossover' : ''} ${selectedId === movie.id ? 'is-selected' : ''}`}
                          data-movie-id={movie.id}
                          data-matching={matching}
                          aria-label={`${movie.title}, ${movie.releaseDate.slice(0, 4)}${movie.crossoverUniverseIds.length ? ', crossover' : ''}${active ? (matching ? ', matches filters' : ', outside filters') : ''}`}
                          aria-pressed={selectedId === movie.id}
                          title={`${movie.title} · ${formatDate(movie.releaseDate)}`}
                          style={{
                            left: node.x - TIMELINE_METRICS.cardAnchorX,
                            top: node.y - TIMELINE_METRICS.cardHeight / 2,
                            ...colorStyle(color),
                          }}
                          onClick={() => setSelectedId(movie.id)}
                        >
                          <span className="station-dot">
                            {movie.crossoverUniverseIds.length > 0 && <span />}
                          </span>
                          <MoviePoster movieId={movie.id} title={movie.title} />
                          <span className="movie-label">
                            <span>{movie.title}</span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
              {!matching.length && (
                <div className="no-matches">
                  <Search size={24} />
                  <h3>No shared story here.</h3>
                  <p>Try Match ANY, a wider year range, or fewer filters.</p>
                  <button onClick={() => setFilters(emptyFilters())}>
                    Clear filters <ArrowRight size={14} />
                  </button>
                </div>
              )}
              <div className="map-controls">
                <button
                  className="icon-button"
                  aria-label="Zoom out timeline"
                  disabled={density <= TIMELINE_METRICS.densityMin}
                  onClick={() =>
                    zoom(
                      Math.max(TIMELINE_METRICS.densityMin, density - TIMELINE_METRICS.densityStep),
                    )
                  }
                >
                  <Minus size={16} />
                </button>
                <span>{Math.round((density / TIMELINE_METRICS.densityDefault) * 100)}%</span>
                <button
                  className="icon-button"
                  aria-label="Zoom in timeline"
                  disabled={density >= TIMELINE_METRICS.densityMax}
                  onClick={() =>
                    zoom(
                      Math.min(TIMELINE_METRICS.densityMax, density + TIMELINE_METRICS.densityStep),
                    )
                  }
                >
                  <Plus size={16} />
                </button>
                <i />
                <button
                  className="icon-button"
                  aria-label="Focus matching movies"
                  disabled={!matching.length}
                  onClick={() =>
                    scrollToMovie(
                      matching.find((movie) => movie.crossoverUniverseIds.length)?.id ??
                        matching[0].id,
                    )
                  }
                >
                  <Crosshair size={17} />
                </button>
              </div>
              <div className="map-legend">
                <span>
                  <i className="legend-station" /> Film
                </span>
                <span>
                  <i className="legend-crossover" /> Crossover
                </span>
                {showEvents && (
                  <span className="legend-event">
                    <Diamond size={11} /> Major event
                  </span>
                )}
                {threads.length ? (
                  <span className="legend-active">
                    {threads.length} active {threads.length === 1 ? 'thread' : 'threads'}
                  </span>
                ) : (
                  <span className="legend-date">US theatrical releases</span>
                )}
              </div>
            </section>

            <div className="timeline-navigator">
              <div className="navigator-label">
                <Compass size={15} />
                <span>EXPLORE TIME</span>
              </div>
              <button
                className="icon-button"
                aria-label="Pan timeline left"
                onClick={() =>
                  viewport.current?.scrollBy({
                    left: -500,
                    behavior: prefersReducedMotion() ? 'instant' : 'smooth',
                  })
                }
              >
                <ArrowLeft size={15} />
              </button>
              <div className="minimap" aria-label="Jump to release year">
                {[firstYear, 2005, 2010, 2015, 2020, lastYear]
                  .filter((year, index, list) => list.indexOf(year) === index)
                  .map((year) => (
                    <button
                      key={year}
                      style={{ left: `${((year - firstYear) / (lastYear - firstYear)) * 100}%` }}
                      onClick={() => scrollToYear(year)}
                      aria-label={`Jump to ${year}`}
                    >
                      {year}
                      <i />
                    </button>
                  ))}
                <div className="minimap-track">
                  <span ref={minimapWindow} />
                </div>
              </div>
              <button
                className="icon-button"
                aria-label="Pan timeline right"
                onClick={() =>
                  viewport.current?.scrollBy({
                    left: 500,
                    behavior: prefersReducedMotion() ? 'instant' : 'smooth',
                  })
                }
              >
                <ArrowRight size={15} />
              </button>
            </div>
          </main>
        </div>
      </div>

      {panel === 'filters' && (
        <FilterDialog
          filters={filters}
          setFilters={setFilters}
          group={filterGroup}
          setGroup={setFilterGroup}
          toggleFilter={toggleFilter}
          count={matching.length}
          onClose={() => setPanel(null)}
        />
      )}
      {panel === 'about' && (
        <Dialog
          title="A universe of connections"
          onClose={() => setPanel(null)}
          className="about-dialog"
        >
          <div className="about-content">
            <span className="eyebrow">MARVEL ATLAS · VOLUME 01</span>
            <h3>
              Movies are stations.
              <br />
              Characters are the threads.
            </h3>
            <p>
              Explore the 77 films in this collection by their US theatrical release dates. Select a
              character to trace their appearances across cinematic universes, or combine filters to
              find the stories they share.
            </p>
            <div className="about-guide">
              <span>
                <Move size={19} />
                <strong>Move through time</strong>Drag, scroll, or use the arrow keys.
              </span>
              <span>
                <GitBranch size={19} />
                <strong>Follow a connection</strong>Solid threads track selected characters. Dotted
                bridges mark crossovers.
              </span>
              <span>
                <Expand size={19} />
                <strong>Find your view</strong>Use + / − to change spacing. Drag or swipe to explore
                the map in either direction.
              </span>
            </div>
            <p>
              Characters and actors are separate. “Spider-Man” follows Peter Parker; Miles Morales
              has his own character filter. The Spider-Man franchise brings the wider family
              together. Year range and appearance roles always constrain matches.
            </p>
            <p>
              The dataset covers major characters and selected cameos, rather than every credit.
              Each movie’s detail panel links to its sources and any curation notes.
            </p>
            <p>
              Diamond markers show major story events and series milestones. Events sit at the US
              release date of their related film, rather than their in-universe year. The Events
              control hides or shows these markers; filters dim events alongside their films.
            </p>
            <div className="about-note">
              An independent fan project. Marvel and film titles belong to their respective owners.
              This atlas is not affiliated with Marvel, Disney, Sony, or their partners.
            </div>
          </div>
        </Dialog>
      )}
      {selectedEvent && selectedEventMovie && (
        <EventDetails
          event={selectedEvent}
          movie={selectedEventMovie}
          onClose={() => setSelectedEventId(null)}
          onMovie={() => {
            setSelectedEventId(null);
            setSelectedId(selectedEventMovie.id);
          }}
        />
      )}
      {selectedMovie && (
        <MovieDetails
          movie={selectedMovie}
          onClose={() => setSelectedId(null)}
          onCharacter={(id) => {
            addFilter('characters', id);
            setSelectedId(null);
          }}
        />
      )}
    </>
  );
}

function SearchResults({
  results,
  onClose,
  onSelect,
}: {
  results: {
    id: string;
    name: string;
    type: FilterGroup | 'movie' | 'event';
    detail: string;
    color?: string;
  }[];
  onClose: () => void;
  onSelect: (id: string, type: FilterGroup | 'movie' | 'event') => void;
}) {
  return (
    <div id="search-results" className="search-results" role="region" aria-label="Search results">
      <div className="search-heading">
        EXPLORE THE COLLECTION{' '}
        <button className="icon-button" aria-label="Close search results" onClick={onClose}>
          <X size={15} />
        </button>
      </div>
      {results.length ? (
        results.map((result) => (
          <button
            key={`${result.type}-${result.id}`}
            onClick={() => onSelect(result.id, result.type)}
          >
            <span className="search-result-icon" style={colorStyle(result.color)}>
              {result.type === 'movie' ? (
                <MoviePoster movieId={result.id} title={result.name} variant="search" />
              ) : result.type === 'event' ? (
                <Diamond size={15} />
              ) : (
                <GitBranch size={15} />
              )}
            </span>
            <span>
              {result.name}
              <small>{result.detail}</small>
            </span>
            <ArrowUpRight size={14} />
          </button>
        ))
      ) : (
        <p className="empty-search">No results. Try a film, event, or actor’s name.</p>
      )}
    </div>
  );
}

function FilterDialog({
  filters,
  setFilters,
  group,
  setGroup,
  toggleFilter,
  count,
  onClose,
}: {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  group: FilterGroup;
  setGroup: (group: FilterGroup) => void;
  toggleFilter: (group: FilterGroup, id: string) => void;
  count: number;
  onClose: () => void;
}) {
  const [query, setQuery] = useState('');
  const filteredEntities = catalog[group].filter((entity: Entity) =>
    [entity.name, ...(entity.aliases ?? []), 'realName' in entity ? entity.realName : '']
      .join(' ')
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
  const range = filters.yearRange ?? [firstYear, lastYear];
  return (
    <Dialog title="Find your connections" onClose={onClose} className="filter-dialog">
      <div className="filter-tabs">
        {groups.map((item) => (
          <button
            key={item.key}
            className={group === item.key ? 'active' : ''}
            aria-pressed={group === item.key}
            onClick={() => {
              setGroup(item.key);
              setQuery('');
            }}
          >
            {item.label}
            {filters[item.key].length > 0 && <span>{filters[item.key].length}</span>}
          </button>
        ))}
      </div>
      <div className="filter-search">
        <Search size={16} />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={`Search ${groups.find((item) => item.key === group)?.label.toLowerCase()}…`}
          aria-label={`Search ${group} filters`}
        />
      </div>
      <div className="filter-options">
        {filteredEntities.map((entity) => (
          <button
            key={entity.id}
            className={filters[group].includes(entity.id) ? 'selected' : ''}
            aria-pressed={filters[group].includes(entity.id)}
            style={colorStyle(entity.color)}
            onClick={() => toggleFilter(group, entity.id)}
          >
            <span className="checkbox">
              {filters[group].includes(entity.id) && <Check size={13} />}
            </span>
            <span>
              {entity.name}
              {'realName' in entity && entity.realName !== entity.name && (
                <small>{String(entity.realName)}</small>
              )}
            </span>
          </button>
        ))}
        {!filteredEntities.length && <p className="empty-search">No matches in this category.</p>}
      </div>
      <div className="year-filter">
        <div>
          <h3>Release years</h3>
          <span>Always limits results, in ANY and ALL</span>
        </div>
        <div className="year-inputs">
          <label>
            From
            <select
              aria-label="Release year from"
              value={range[0]}
              onChange={(event) => {
                const year = Number(event.target.value);
                setFilters((current) => ({
                  ...current,
                  yearRange: [year, Math.max(year, range[1])],
                }));
              }}
            >
              {Array.from(
                { length: lastYear - firstYear + 1 },
                (_, index) => firstYear + index,
              ).map((year) => (
                <option key={year}>{year}</option>
              ))}
            </select>
          </label>
          <span>—</span>
          <label>
            Through
            <select
              aria-label="Release year through"
              value={range[1]}
              onChange={(event) => {
                const year = Number(event.target.value);
                setFilters((current) => ({
                  ...current,
                  yearRange: [Math.min(year, range[0]), year],
                }));
              }}
            >
              {Array.from(
                { length: lastYear - firstYear + 1 },
                (_, index) => firstYear + index,
              ).map((year) => (
                <option key={year}>{year}</option>
              ))}
            </select>
          </label>
          {filters.yearRange && (
            <button
              className="icon-button"
              aria-label="Clear year range"
              onClick={() => setFilters((current) => ({ ...current, yearRange: null }))}
            >
              <X size={15} />
            </button>
          )}
        </div>
      </div>
      <fieldset className="role-filter">
        <legend>
          Appearance role <span>All roles included by default</span>
        </legend>
        {(['lead', 'supporting', 'cameo', 'post-credit'] as Role[]).map((role) => (
          <button
            key={role}
            className={filters.roles.includes(role) ? 'selected' : ''}
            aria-pressed={filters.roles.includes(role)}
            onClick={() =>
              setFilters((current) => ({
                ...current,
                roles: current.roles.includes(role)
                  ? current.roles.filter((item) => item !== role)
                  : [...current.roles, role],
              }))
            }
          >
            {role}
          </button>
        ))}
      </fieldset>
      <div className="dialog-footer">
        <button className="text-button" onClick={() => setFilters(emptyFilters())}>
          Clear all
        </button>
        <button className="primary-button" onClick={onClose}>
          Explore {count} films <ArrowRight size={15} />
        </button>
      </div>
    </Dialog>
  );
}

function MovieDetails({
  movie,
  onClose,
  onCharacter,
}: {
  movie: Movie;
  onClose: () => void;
  onCharacter: (id: string) => void;
}) {
  const universe = universeById.get(movie.primaryUniverseId);
  const featured = movie.appearances.filter(
    (appearance, index, list) =>
      list.findIndex(
        (item) =>
          item.characterId === appearance.characterId && item.actorId === appearance.actorId,
      ) === index,
  );
  return (
    <Dialog title="Film details" onClose={onClose} className="movie-dialog">
      <div className="movie-details" style={colorStyle(universe?.color)}>
        <div className="film-cover film-cover--with-poster">
          <MoviePoster movieId={movie.id} title={movie.title} variant="detail" />
          <span className="film-cover-year">{movie.releaseDate.slice(0, 4)}</span>
          <div className="film-orbit orbit-one" />
          <div className="film-orbit orbit-two" />
          <div className="film-cover-top">
            <span>{universe?.shortName}</span>
            <span>
              {movie.crossoverUniverseIds.length ? 'CROSSOVER EVENT' : 'THE FILM COLLECTION'}
            </span>
          </div>
          <div className="film-cover-title">
            <span className="eyebrow">MARVEL ATLAS</span>
            <h3>{movie.title}</h3>
          </div>
          <span className="cover-station" />
        </div>
        <div className="detail-body">
          <div className="detail-date">
            <span>US THEATRICAL RELEASE</span>
            <strong>{formatDate(movie.releaseDate)}</strong>
          </div>
          <dl className="detail-meta">
            <div>
              <dt>Universe</dt>
              <dd>{universe?.name}</dd>
            </div>
            <div>
              <dt>Studios</dt>
              <dd>
                {movie.studioIds
                  .map((id) => catalog.studios.find((item) => item.id === id)?.name ?? id)
                  .join(', ')}
              </dd>
            </div>
            <div>
              <dt>Franchises / teams</dt>
              <dd>
                {movie.franchiseIds
                  .map((id) => catalog.franchises.find((item) => item.id === id)?.name ?? id)
                  .join(', ')}
              </dd>
            </div>
          </dl>
          {!!movie.crossoverUniverseIds.length && (
            <div className="crossover-detail">
              <div>
                <GitBranch size={16} />
                <strong>Worlds meet here</strong>
              </div>
              <p>
                {movie.crossoverUniverseIds
                  .map((id) => universeById.get(id)?.name ?? id)
                  .join(' · ')}
              </p>
            </div>
          )}
          <div className="cast-heading">
            <h4>Characters & cast</h4>
            <span>
              Select to follow a thread <ArrowDown size={11} />
            </span>
          </div>
          <div className="cast-list">
            {featured.map((appearance, index) => {
              const character = characterById.get(appearance.characterId);
              return (
                <button
                  key={`${appearance.characterId}-${appearance.actorId}-${index}`}
                  onClick={() => onCharacter(appearance.characterId)}
                  style={colorStyle(character?.color)}
                >
                  <span className="cast-monogram">{initials(character?.name ?? '?')}</span>
                  <span className="cast-name">
                    <strong>{character?.name}</strong>
                    <small>{actorById.get(appearance.actorId)?.name}</small>
                    {appearance.universeId !== movie.primaryUniverseId && (
                      <em>
                        {universeById.get(appearance.universeId)?.name ?? appearance.universeId}
                      </em>
                    )}
                  </span>
                  <span className="role-badge">{appearance.role}</span>
                  <Plus size={14} />
                </button>
              );
            })}
          </div>
          {!!movie.notes?.length && (
            <div className="curation-notes">
              <h4>Collection notes</h4>
              {movie.notes.map((note) => (
                <p key={note}>{note}</p>
              ))}
            </div>
          )}
          <div className="source-links">
            <h4>Sources</h4>
            {posters[movie.id] && (
              <a href={posters[movie.id].sourceUrl} target="_blank" rel="noopener noreferrer">
                Poster artwork <ArrowUpRight size={12} />
              </a>
            )}
            {movie.sourceUrls.map((url, index) => (
              <a key={url} href={url} target="_blank" rel="noopener noreferrer">
                {new URL(url).hostname.replace(/^www\./, '')}
                {movie.sourceUrls.length > 1 ? ` · ${index + 1}` : ''}
                <ArrowUpRight size={12} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </Dialog>
  );
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
