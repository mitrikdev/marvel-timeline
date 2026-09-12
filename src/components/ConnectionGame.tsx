'use client';

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import {
  ArrowLeftRight,
  ArrowRight,
  ChevronDown,
  Eye,
  EyeOff,
  Link2,
  Search,
  Shuffle,
} from 'lucide-react';
import { actorById, characterById, movieById, movies, universeById } from '@/data';
import type { Movie } from '@/data/types';
import {
  buildConnectionGraph,
  findShortestConnection,
  type SharedConnection,
} from '@/lib/connections';
import { Dialog } from './Dialog';
import { MoviePoster } from './MoviePoster';
import './ConnectionGame.css';

const graph = buildConnectionGraph(movies);
const sortedMovies = [...movies].sort(
  (a, b) => a.title.localeCompare(b.title) || a.releaseDate.localeCompare(b.releaseDate),
);
const normalize = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
const filmLabel = (movie: Movie) => `${movie.title} (${movie.releaseDate.slice(0, 4)})`;

function FilmPicker({
  label,
  movieId,
  onSelect,
}: {
  label: string;
  movieId: string;
  onSelect: (id: string) => void;
}) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const input = useRef<HTMLInputElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const selected = movieById.get(movieId);
  const terms = normalize(query).split(' ').filter(Boolean);
  const options = sortedMovies.filter((movie) => {
    const text = normalize(filmLabel(movie));
    return terms.every((term) => text.includes(term));
  });

  useEffect(() => {
    if (open) input.current?.focus();
  }, [open]);

  return (
    <div className="connection-picker">
      <span className="connection-picker-label" id={`${id}-label`}>
        {label}
      </span>
      <button
        ref={trigger}
        className="connection-picker-trigger"
        aria-label={`Change ${label.toLowerCase()}${selected ? `, ${filmLabel(selected)}` : ''}`}
        aria-expanded={open}
        aria-controls={open ? `${id}-options` : undefined}
        onClick={() => setOpen((current) => !current)}
      >
        {selected && <MoviePoster movieId={selected.id} title={selected.title} variant="search" />}
        <span>
          {selected?.title ?? 'Choose a film'}
          <small>{selected?.releaseDate.slice(0, 4)}</small>
        </span>
        <ChevronDown size={16} aria-hidden="true" />
      </button>
      {open && (
        <div
          className="connection-picker-options"
          id={`${id}-options`}
          onKeyDown={(event) => {
            if (event.key === 'Escape') {
              event.preventDefault();
              event.stopPropagation();
              setOpen(false);
              trigger.current?.focus();
            }
          }}
        >
          <label className="connection-search">
            <Search size={16} aria-hidden="true" />
            <input
              ref={input}
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search title or year…"
              aria-label={`Search ${label.toLowerCase()} by title or year`}
              autoComplete="off"
            />
          </label>
          <div className="connection-picker-results" role="group" aria-labelledby={`${id}-label`}>
            {options.map((movie) => (
              <button
                key={movie.id}
                aria-pressed={movie.id === movieId}
                onClick={() => {
                  onSelect(movie.id);
                  setOpen(false);
                  setQuery('');
                  trigger.current?.focus();
                }}
              >
                <MoviePoster movieId={movie.id} title={movie.title} variant="search" />
                <span>
                  {movie.title}
                  <small>{movie.releaseDate.slice(0, 4)}</small>
                </span>
              </button>
            ))}
            {!options.length && <p>No films match. Try a title or release year.</p>}
          </div>
        </div>
      )}
    </div>
  );
}

function ConnectionLabel({ connection }: { connection: SharedConnection }) {
  const entity =
    connection.kind === 'character'
      ? characterById.get(connection.entityId)
      : actorById.get(connection.entityId);
  return (
    <span className={`connection-link-label connection-link-label--${connection.kind}`}>
      <span>Shared {connection.kind}</span>
      <strong>{entity?.name ?? connection.entityId}</strong>
    </span>
  );
}

export function ConnectionGame({
  onClose,
  onMovie,
  initialMovieId,
}: {
  onClose: () => void;
  onMovie: (id: string) => void;
  initialMovieId?: string;
}) {
  const [pair, setPair] = useState<[string, string]>(() => {
    const first = initialMovieId && movieById.has(initialMovieId) ? initialMovieId : 'blade';
    return [first, first === 'iron-man' ? 'blade' : 'iron-man'];
  });
  const [revealed, setRevealed] = useState(false);
  const path = useMemo(() => findShortestConnection(graph, pair[0], pair[1]), [pair]);
  const sameFilm = pair[0] === pair[1];
  const first = movieById.get(pair[0]);
  const last = movieById.get(pair[1]);

  function changeFilm(index: 0 | 1, movieId: string) {
    setPair((current) => (index === 0 ? [movieId, current[1]] : [current[0], movieId]));
    setRevealed(false);
  }

  function randomPair() {
    const start = movies[Math.floor(Math.random() * movies.length)];
    const neighbors = new Set(graph.get(start.id)?.map((edge) => edge.movieId));
    const candidates = movies.filter(
      (movie) =>
        movie.id !== start.id &&
        !neighbors.has(movie.id) &&
        findShortestConnection(graph, start.id, movie.id),
    );
    const alternatives = candidates.length
      ? candidates
      : movies.filter((movie) => movie.id !== start.id);
    const end = alternatives[Math.floor(Math.random() * alternatives.length)];
    if (end) setPair([start.id, end.id]);
    setRevealed(false);
  }

  return (
    <Dialog title="Connect these films" onClose={onClose} className="connection-game">
      <div className="connection-game-body">
        <p className="connection-intro">
          Two films. One chain. Can you connect them through their characters or actors?
        </p>
        <div className="connection-pair">
          <FilmPicker
            label="Starting film"
            movieId={pair[0]}
            onSelect={(id) => changeFilm(0, id)}
          />
          <ArrowLeftRight className="connection-pair-icon" size={20} aria-hidden="true" />
          <FilmPicker
            label="Destination film"
            movieId={pair[1]}
            onSelect={(id) => changeFilm(1, id)}
          />
        </div>
        <div className="connection-actions">
          <button
            className="connection-secondary"
            onClick={() => {
              setPair(([start, end]) => [end, start]);
              setRevealed(false);
            }}
          >
            <ArrowLeftRight size={15} aria-hidden="true" />
            Swap
          </button>
          <button className="connection-secondary" onClick={randomPair}>
            <Shuffle size={15} aria-hidden="true" />
            Surprise me
          </button>
          <button
            className="connection-reveal"
            aria-expanded={revealed}
            aria-controls="connection-answer"
            disabled={!first || !last}
            onClick={() => setRevealed((current) => !current)}
          >
            {revealed ? (
              <EyeOff size={16} aria-hidden="true" />
            ) : (
              <Eye size={16} aria-hidden="true" />
            )}
            {revealed ? 'Hide answer' : 'Reveal chain'}
          </button>
        </div>
        <section
          id="connection-answer"
          className="connection-answer"
          aria-label="Connection answer"
        >
          <p className="connection-status" role="status" aria-live="polite">
            {!revealed
              ? 'Answer hidden. Make your guess, then reveal the shortest chain.'
              : !path
                ? 'No connection found in this film catalog.'
                : sameFilm
                  ? 'Same film — no links needed. Choose a different destination for a challenge.'
                  : `${path.links.length} ${path.links.length === 1 ? 'link' : 'links'} · A shortest chain through the catalog`}
          </p>
          {revealed && path ? (
            <ol className="connection-chain">
              {path.movieIds.map((movieId, index) => {
                const movie = movieById.get(movieId)!;
                const link = path.links[index];
                return (
                  <li key={movieId}>
                    <button
                      className="connection-film"
                      aria-label={`View ${filmLabel(movie)}`}
                      onClick={() => {
                        onClose();
                        onMovie(movie.id);
                      }}
                    >
                      <span className="connection-step" aria-hidden="true">
                        {index + 1}
                      </span>
                      <MoviePoster movieId={movie.id} title={movie.title} variant="search" />
                      <span>
                        {movie.title}
                        <small>
                          {movie.releaseDate.slice(0, 4)} ·{' '}
                          {universeById.get(movie.primaryUniverseId)?.shortName}
                        </small>
                      </span>
                      <ArrowRight size={16} aria-hidden="true" />
                    </button>
                    {link && (
                      <div className="connection-link">
                        <Link2 size={15} aria-hidden="true" />
                        <div>
                          <ConnectionLabel connection={link.connections[0]} />
                          {link.connections.length > 1 && (
                            <details className="connection-alternatives">
                              <summary>
                                {link.connections.length - 1} more shared{' '}
                                {link.connections.length === 2 ? 'connection' : 'connections'}
                              </summary>
                              {link.connections.slice(1).map((connection) => (
                                <ConnectionLabel
                                  key={`${connection.kind}-${connection.entityId}`}
                                  connection={connection}
                                />
                              ))}
                            </details>
                          )}
                        </div>
                      </div>
                    )}
                  </li>
                );
              })}
            </ol>
          ) : !revealed ? (
            <div className="connection-mystery" aria-hidden="true">
              <span>●</span>
              <i />
              <b>?</b>
              <i />
              <span>●</span>
            </div>
          ) : null}
        </section>
        <p className="connection-note">
          All cataloged appearances count, including cameos. Shared characters can span different
          versions and universes; shared actors may play different roles. These links do not
          establish story continuity.
        </p>
      </div>
    </Dialog>
  );
}
