'use client';

import { ArrowRight, ArrowUpRight, Diamond } from 'lucide-react';
import type { TimelineEvent } from '@/data/events';
import type { Movie } from '@/data/types';
import { universeById } from '@/data';
import { Dialog } from './Dialog';
import { MoviePoster } from './MoviePoster';

export function EventDetails({
  event,
  movie,
  onClose,
  onMovie,
}: {
  event: TimelineEvent;
  movie: Movie;
  onClose: () => void;
  onMovie: () => void;
}) {
  const release = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${movie.releaseDate}T00:00:00Z`));
  return (
    <Dialog title="Event details" className="event-dialog" onClose={onClose}>
      <div className="event-detail-content">
        <div className="event-kind">
          <Diamond size={18} /> {event.kind === 'story' ? 'STORY EVENT' : 'SERIES MILESTONE'}
        </div>
        <h3>{event.title}</h3>
        <p className="event-description">{event.description}</p>
        <div className="event-film-context">
          <span className="eyebrow">{universeById.get(movie.primaryUniverseId)?.name}</span>
          <button className="event-film-link" onClick={onMovie}>
            <MoviePoster movieId={movie.id} title={movie.title} variant="event" />
            <span>
              {movie.title}
              <small>US release · {release}</small>
            </span>
            <ArrowRight size={20} />
          </button>
          <p>
            {event.kind === 'story'
              ? 'Placed at the release of the film that depicts this event. The story may take place in a different year.'
              : 'A milestone in the film series, placed at this movie’s release.'}
          </p>
        </div>
        <div className="source-links">
          <h4>Sources</h4>
          {event.sourceUrls.map((url, index) => (
            <a href={url} key={url} target="_blank" rel="noopener noreferrer">
              {new URL(url).hostname.replace(/^www\./, '')}
              {event.sourceUrls.length > 1 ? ` · ${index + 1}` : ''}
              <ArrowUpRight size={13} />
            </a>
          ))}
        </div>
      </div>
    </Dialog>
  );
}
