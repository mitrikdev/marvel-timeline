import type { Movie, Universe } from '../data/types';

/** Shared geometry keeps rendered film cards aligned with collision checks. */
export const TIMELINE_METRICS = {
  axisPadding: 72,
  cardWidth: 152,
  cardHeight: 52,
  cardGap: 8,
  /** Distance from the button's left edge to its station dot. */
  cardAnchorX: 8,
  trackSpacing: 56,
  laneLabelHeight: 24,
  lanePadding: 8,
  minLaneHeight: 70,
  canvasVerticalPadding: 8,
} as const;

const {
  axisPadding: AXIS_PADDING,
  cardWidth: CARD_WIDTH,
  cardHeight: CARD_HEIGHT,
  cardGap: CARD_GAP,
  cardAnchorX: CARD_ANCHOR_X,
  trackSpacing: TRACK_SPACING,
  laneLabelHeight: LANE_LABEL_HEIGHT,
  lanePadding: LANE_PADDING,
  minLaneHeight: MIN_LANE_HEIGHT,
  canvasVerticalPadding: CANVAS_VERTICAL_PADDING,
} = TIMELINE_METRICS;

type TimelineNode = { x: number; y: number; movie: Movie };
type TimelineLane = { id: string; y: number; height: number };

export type TimelineLayout = {
  width: number;
  height: number;
  yearStart: number;
  /** Exclusive boundary: January 1 after the latest release year. */
  yearEnd: number;
  nodes: Map<string, TimelineNode>;
  /** y is the lane center; its top edge is y - height / 2. */
  lanes: TimelineLane[];
};

function releaseTime(movie: Movie): number {
  const timestamp = Date.parse(`${movie.releaseDate}T00:00:00.000Z`);
  if (!Number.isFinite(timestamp)) {
    throw new Error(`Invalid release date for ${movie.id}: ${movie.releaseDate}`);
  }
  return timestamp;
}

/**
 * Position the complete dataset once, independently of filters. Releases are
 * proportional within their UTC calendar year, including leap years.
 */
export function buildLayout(
  movies: Movie[],
  universes: Universe[],
  pixelsPerYear: number,
): TimelineLayout {
  if (!Number.isFinite(pixelsPerYear) || pixelsPerYear <= 0) {
    throw new RangeError('pixelsPerYear must be a positive finite number');
  }

  const releases = movies.map((movie) => ({ movie, time: releaseTime(movie) }));
  releases.sort(
    (left, right) =>
      left.time - right.time ||
      (left.movie.id < right.movie.id ? -1 : left.movie.id > right.movie.id ? 1 : 0),
  );

  // A fixed empty-data axis makes an empty layout deterministic across dates.
  const yearStart = releases.length ? new Date(releases[0].time).getUTCFullYear() : 2000;
  const yearEnd = releases.length
    ? new Date(releases[releases.length - 1].time).getUTCFullYear() + 1
    : yearStart + 1;
  const rightPadding = Math.max(AXIS_PADDING, CARD_WIDTH - CARD_ANCHOR_X + CARD_GAP);
  const width = AXIS_PADDING + (yearEnd - yearStart) * pixelsPerYear + rightPadding;

  const laneIds = [...new Set(universes.map((universe) => universe.id))];
  const knownLaneIds = new Set(laneIds);
  // Keep movies visible even while their new universe's registry entry is added.
  const extraLaneIds = [...new Set(movies.map((movie) => movie.primaryUniverseId))]
    .filter((id) => !knownLaneIds.has(id))
    .sort();
  laneIds.push(...extraLaneIds);

  const placements = new Map<string, Array<{ movie: Movie; x: number; track: number }>>();
  const trackEnds = new Map<string, number[]>();
  for (const { movie, time } of releases) {
    const year = new Date(time).getUTCFullYear();
    const yearBeginning = Date.UTC(year, 0, 1);
    const nextYearBeginning = Date.UTC(year + 1, 0, 1);
    const fractionalYear =
      year - yearStart + (time - yearBeginning) / (nextYearBeginning - yearBeginning);
    const x = AXIS_PADDING + fractionalYear * pixelsPerYear;
    const ends = trackEnds.get(movie.primaryUniverseId) ?? [];
    let track = ends.findIndex((lastX) => x - lastX >= CARD_WIDTH + CARD_GAP);
    if (track === -1) track = ends.length;
    ends[track] = x;
    trackEnds.set(movie.primaryUniverseId, ends);

    const inLane = placements.get(movie.primaryUniverseId) ?? [];
    inLane.push({ movie, x, track });
    placements.set(movie.primaryUniverseId, inLane);
  }

  const nodes = new Map<string, TimelineNode>();
  const lanes: TimelineLane[] = [];
  let height = CANVAS_VERTICAL_PADDING;
  for (const id of laneIds) {
    const trackCount = Math.max(1, trackEnds.get(id)?.length ?? 0);
    const laneHeight = Math.max(
      MIN_LANE_HEIGHT,
      (trackCount - 1) * TRACK_SPACING + CARD_HEIGHT + LANE_LABEL_HEIGHT + LANE_PADDING,
    );
    const center = height + laneHeight / 2;
    lanes.push({ id, y: center, height: laneHeight });

    for (const { movie, x, track } of placements.get(id) ?? []) {
      // Reserve the lane label above the cards and center tracks in the space
      // that remains, with compact padding below the bottom card.
      const cardAreaCenter = center + (LANE_LABEL_HEIGHT - LANE_PADDING) / 2;
      const y = cardAreaCenter + (track - (trackCount - 1) / 2) * TRACK_SPACING;
      nodes.set(movie.id, { x, y, movie });
    }
    height += laneHeight;
  }
  height += CANVAS_VERTICAL_PADDING;

  return { width, height, yearStart, yearEnd, nodes, lanes };
}

/** Horizontal cubic tangents join chronological nodes at their exact anchors. */
export function threadPath(nodes: Array<{ x: number; y: number }>): string {
  if (nodes.length === 0) return '';
  let path = `M ${nodes[0].x} ${nodes[0].y}`;
  for (let index = 1; index < nodes.length; index += 1) {
    const previous = nodes[index - 1];
    const current = nodes[index];
    const middleX = previous.x + (current.x - previous.x) / 2;
    path += ` C ${middleX} ${previous.y}, ${middleX} ${current.y}, ${current.x} ${current.y}`;
  }
  return path;
}
