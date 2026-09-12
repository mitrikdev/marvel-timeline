'use client';
import { useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, X, ArrowUpRight, Search } from 'lucide-react';
import { catalog, movies, actorById, characterById } from '@/data';
import { getJourneyMovies, type JourneySelection } from '@/lib/journeys';
import type { Movie } from '@/data/types';
import { threadPath } from '@/lib/timeline';
import { Dialog } from './Dialog';
import { MoviePoster } from './MoviePoster';

export function JourneyPicker({
  onClose,
  onStart,
}: {
  onClose: () => void;
  onStart: (selection: JourneySelection) => void;
}) {
  const [kind, setKind] = useState<JourneySelection['kind']>('characters');
  const [query, setQuery] = useState('');
  const options = catalog[kind]
    .filter((entity) =>
      [entity.name, ...('realName' in entity ? [entity.realName] : []), ...(entity.aliases ?? [])]
        .join(' ')
        .toLowerCase()
        .includes(query.toLowerCase()),
    )
    .map((entity) => ({ entity, count: getJourneyMovies(movies, { kind, id: entity.id }).length }))
    .filter(({ count }) => count > 0)
    .sort((a, b) => b.count - a.count || a.entity.name.localeCompare(b.entity.name));
  return (
    <Dialog title="Follow a journey" onClose={onClose} className="journey-dialog">
      <div className="journey-picker">
        <p>
          Step through a filmography in release order. Play the route or explore one stop at a time.
        </p>
        <div className="journey-kind">
          <button aria-pressed={kind === 'characters'} onClick={() => setKind('characters')}>
            Characters
          </button>
          <button aria-pressed={kind === 'actors'} onClick={() => setKind('actors')}>
            Actors
          </button>
        </div>
        <label className="feature-search">
          <Search size={17} />
          <input
            type="search"
            aria-label="Find a journey"
            placeholder={'Find a ' + (kind === 'characters' ? 'character' : 'actor') + '…'}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <div className="journey-options">
          {options.map(({ entity, count }) => (
            <button key={entity.id} onClick={() => onStart({ kind, id: entity.id })}>
              <span className="journey-avatar" style={{ color: entity.color }}>
                {entity.name
                  .split(' / ')[0]
                  .split(' ')
                  .map((w) => w[0])
                  .slice(0, 2)
                  .join('')}
              </span>
              <span>
                {entity.name}
                <small>{count} films</small>
              </span>
              <Play size={16} />
            </button>
          ))}
          {!options.length && <p>No journeys match that search.</p>}
        </div>
      </div>
    </Dialog>
  );
}

export function JourneyPlayer({
  selection,
  movie,
  index,
  total,
  playing,
  onPrevious,
  onNext,
  onPlay,
  onClose,
  onMovie,
}: {
  selection: JourneySelection;
  movie: Movie;
  index: number;
  total: number;
  playing: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onPlay: () => void;
  onClose: () => void;
  onMovie: () => void;
}) {
  const entity = (selection.kind === 'characters' ? characterById : actorById).get(selection.id);
  const roles = [
    ...new Set(
      movie.appearances
        .filter(
          (a) => (selection.kind === 'characters' ? a.characterId : a.actorId) === selection.id,
        )
        .map((a) => a.role),
    ),
  ];
  return (
    <section className="journey-player" aria-label="Journey player">
      <div className="journey-player-heading">
        <strong title={entity?.name}>
          {entity?.name}{' '}
          <span>
            · {index + 1}/{total}
          </span>
        </strong>
        <button aria-label="End journey" onClick={onClose}>
          <X size={16} />
        </button>
      </div>
      <div className="journey-stop" aria-live="polite" aria-atomic="true">
        <MoviePoster movieId={movie.id} title={movie.title} variant="search" />
        <span>
          <strong>{movie.title}</strong>
          <small>
            {movie.releaseDate.slice(0, 4)} · {roles.join(', ')}
          </small>
        </span>
        <button aria-label="Open journey film details" onClick={onMovie}>
          <ArrowUpRight size={17} />
        </button>
      </div>
      <div className="journey-playback">
        <button aria-label="Previous journey film" disabled={index === 0} onClick={onPrevious}>
          <SkipBack size={17} />
        </button>
        <button
          className="journey-play"
          aria-label={
            playing ? 'Pause journey' : index === total - 1 ? 'Replay journey' : 'Play journey'
          }
          onClick={onPlay}
        >
          {playing ? <Pause size={18} /> : <Play size={18} />}
          <span>{playing ? 'Pause' : index === total - 1 ? 'Replay' : 'Play'}</span>
        </button>
        <button aria-label="Next journey film" disabled={index === total - 1} onClick={onNext}>
          <SkipForward size={17} />
        </button>
        <span>Release order</span>
      </div>
    </section>
  );
}

export function JourneyTrace({
  nodes,
  index,
  reducedMotion,
}: {
  nodes: Array<{ x: number; y: number }>;
  index: number;
  reducedMotion: boolean;
}) {
  const current = nodes[index];
  if (!current) return null;
  const segment = index > 0 ? threadPath(nodes.slice(index - 1, index + 1)) : '';
  return (
    <g className="journey-trace">
      <path d={threadPath(nodes)} fill="none" stroke="#d6efff" strokeWidth="2" opacity=".25" />
      <path
        d={threadPath(nodes.slice(0, index + 1))}
        fill="none"
        stroke="#c7f3ff"
        strokeWidth="4"
        strokeLinecap="round"
      />
      {index > 0 && !reducedMotion ? (
        <circle key={index} r="7" fill="#eaffff" className="journey-traveler">
          <animateMotion dur="1s" path={segment} fill="freeze" />
        </circle>
      ) : (
        <circle cx={current.x} cy={current.y} r="7" fill="#eaffff" />
      )}
      <circle
        cx={current.x}
        cy={current.y}
        r="12"
        fill="none"
        stroke="#bfefff"
        strokeWidth="2"
        className="journey-pulse"
      />
    </g>
  );
}
