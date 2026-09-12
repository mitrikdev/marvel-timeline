'use client';

import Image from 'next/image';
import { Film } from 'lucide-react';
import { useState } from 'react';
import { posters } from '@/data/posters';
import './MoviePoster.css';

/** One local poster source for the map, search, and film details. */
export function MoviePoster({
  movieId,
  title,
  variant = 'thumbnail',
}: {
  movieId: string;
  title: string;
  variant?: 'thumbnail' | 'search' | 'detail' | 'event' | 'map-detail';
}) {
  const poster = posters[movieId];
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const isDetail = variant === 'detail';

  return (
    <span className={'movie-poster movie-poster--' + variant}>
      {poster && failedSrc !== poster.src ? (
        <Image
          src={poster.src}
          alt={isDetail ? title + ' poster' : ''}
          fill
          sizes={
            isDetail
              ? '(max-width: 600px) 96px, (max-height: 600px) 96px, 144px'
              : variant === 'map-detail'
                ? '44px'
                : variant === 'event'
                  ? '40px'
                  : '24px'
          }
          loading={isDetail ? 'eager' : 'lazy'}
          draggable={false}
          onError={() => setFailedSrc(poster.src)}
        />
      ) : (
        <span className="poster-fallback" aria-hidden="true">
          <Film size={isDetail ? 32 : 14} />
          {isDetail && <span>Artwork unavailable</span>}
        </span>
      )}
    </span>
  );
}
