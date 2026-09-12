'use client';
import { useState } from 'react';
import { Check, Circle, ArrowUpRight, Search } from 'lucide-react';
import { movies, universes } from '@/data';
import { Dialog } from './Dialog';
import { MoviePoster } from './MoviePoster';
import './WatchProgress.css';

export function WatchProgress({
  watchedIds,
  onToggleWatched,
  onMovie,
  onClose,
  storageAvailable,
}: {
  watchedIds: string[];
  onToggleWatched: (id: string) => void;
  onMovie: (id: string) => void;
  onClose: () => void;
  storageAvailable: boolean;
}) {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<'all' | 'unwatched' | 'watched'>('unwatched');
  const [universe, setUniverse] = useState('');
  const watched = new Set(watchedIds);
  const visible = movies.filter(
    (movie) =>
      (!universe || movie.primaryUniverseId === universe) &&
      movie.title.toLowerCase().includes(query.toLowerCase()) &&
      (status === 'all' || watched.has(movie.id) === (status === 'watched')),
  );
  return (
    <Dialog title="Your watch history" onClose={onClose} className="watch-dialog">
      <div className="watch-content">
        <div className="watch-total">
          <strong>
            {watched.size}
            <small> / {movies.length} films watched</small>
          </strong>
          <span>{Math.round((watched.size / movies.length) * 100)}%</span>
        </div>
        <progress value={watched.size} max={movies.length} aria-label="Overall watch progress" />
        <p className="watch-storage">
          {storageAvailable
            ? 'Saved in this browser. No account needed.'
            : 'Browser storage is unavailable. Progress lasts for this visit.'}
        </p>
        <div className="watch-universes" aria-label="Watch progress by universe">
          <button className={!universe ? 'chosen' : ''} onClick={() => setUniverse('')}>
            All universes{' '}
            <span>
              {watched.size}/{movies.length}
            </span>
          </button>
          {universes.map((item) => {
            const films = movies.filter((movie) => movie.primaryUniverseId === item.id);
            const count = films.filter((movie) => watched.has(movie.id)).length;
            return (
              <button
                key={item.id}
                className={universe === item.id ? 'chosen' : ''}
                onClick={() => setUniverse(universe === item.id ? '' : item.id)}
                aria-pressed={universe === item.id}
              >
                <span className="watch-universe-dot" style={{ background: item.color }} />
                {item.shortName}
                <span>
                  {count}/{films.length}
                </span>
                <progress
                  value={count}
                  max={films.length}
                  aria-label={item.name + ' watch progress'}
                />
              </button>
            );
          })}
        </div>
        <div className="watch-search">
          <Search size={16} />
          <input
            type="search"
            aria-label="Search watch history"
            placeholder="Find a film…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <select
            aria-label="Watch status"
            value={status}
            onChange={(event) => setStatus(event.target.value as typeof status)}
          >
            <option value="unwatched">Unwatched</option>
            <option value="watched">Watched</option>
            <option value="all">All films</option>
          </select>
        </div>
        <div className="watch-films" aria-label="Films by watch status">
          {visible.map((movie) => (
            <div key={movie.id} className="watch-film">
              <button className="watch-film-open" onClick={() => onMovie(movie.id)}>
                <MoviePoster movieId={movie.id} title={movie.title} variant="search" />
                <span>
                  {movie.title}
                  <small>{movie.releaseDate.slice(0, 4)}</small>
                </span>
                <ArrowUpRight size={15} />
              </button>
              <button
                className={'watch-toggle ' + (watched.has(movie.id) ? 'watched' : '')}
                aria-label={
                  (watched.has(movie.id) ? 'Mark unwatched: ' : 'Mark watched: ') + movie.title
                }
                aria-pressed={watched.has(movie.id)}
                onClick={() => onToggleWatched(movie.id)}
              >
                {watched.has(movie.id) ? <Check size={19} /> : <Circle size={19} />}
              </button>
            </div>
          ))}
          {!visible.length && (
            <p className="watch-empty">
              {status === 'unwatched' && !query
                ? 'All caught up in this view.'
                : 'No films match this view.'}
            </p>
          )}
        </div>
      </div>
    </Dialog>
  );
}
