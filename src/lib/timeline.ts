import type { Movie, Universe } from '../data/types';
import type { TimelineEvent } from '../data/events';

/** Shared geometry keeps rendered film cards aligned with collision checks. */
export const TIMELINE_METRICS = {
  axisPadding: 72,
  cardWidth: 152,
  cardHeight: 52,
  cardGap: 8,
  eventWidth: 176,
  eventHeight: 32,
  eventGap: 8,
  eventTrackSpacing: 36,
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
  eventWidth: EVENT_WIDTH,
  eventHeight: EVENT_HEIGHT,
  eventGap: EVENT_GAP,
  eventTrackSpacing: EVENT_TRACK_SPACING,
  cardAnchorX: CARD_ANCHOR_X,
  trackSpacing: TRACK_SPACING,
  laneLabelHeight: LANE_LABEL_HEIGHT,
  lanePadding: LANE_PADDING,
  minLaneHeight: MIN_LANE_HEIGHT,
  canvasVerticalPadding: CANVAS_VERTICAL_PADDING,
} = TIMELINE_METRICS;

type TimelineNode = { x: number; y: number; movie: Movie };
type TimelineEventNode = { id: string; x: number; y: number; event: TimelineEvent; movie: Movie };
type TimelineLane = { id: string; y: number; height: number };

export type TimelineLayout = {
  width: number;
  height: number;
  yearStart: number;
  /** Exclusive boundary: January 1 after the latest release year. */
  yearEnd: number;
  nodes: Map<string, TimelineNode>;
  eventNodes: Map<string, TimelineEventNode>;
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
  events: TimelineEvent[] = [],
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
  const rightPadding = Math.max(
    AXIS_PADDING,
    CARD_WIDTH - CARD_ANCHOR_X + CARD_GAP,
    events.length > 0 ? EVENT_WIDTH - CARD_ANCHOR_X + EVENT_GAP : 0,
  );
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
  const moviePlacements = new Map<string, { movie: Movie; x: number }>();
  for (const { movie, time } of releases) {
    const year = new Date(time).getUTCFullYear();
    const yearBeginning = Date.UTC(year, 0, 1);
    const nextYearBeginning = Date.UTC(year + 1, 0, 1);
    const fractionalYear =
      year - yearStart + (time - yearBeginning) / (nextYearBeginning - yearBeginning);
    const x = AXIS_PADDING + fractionalYear * pixelsPerYear;
    moviePlacements.set(movie.id, { movie, x });
    const ends = trackEnds.get(movie.primaryUniverseId) ?? [];
    let track = ends.findIndex((lastX) => x - lastX >= CARD_WIDTH + CARD_GAP);
    if (track === -1) track = ends.length;
    ends[track] = x;
    trackEnds.set(movie.primaryUniverseId, ends);

    const inLane = placements.get(movie.primaryUniverseId) ?? [];
    inLane.push({ movie, x, track });
    placements.set(movie.primaryUniverseId, inLane);
  }

  const eventPlacements = new Map<
    string,
    Array<{ event: TimelineEvent; movie: Movie; x: number; track: number }>
  >();
  const eventTrackEnds = new Map<string, number[]>();
  const orderedEvents = events
    .map((event) => {
      const placement = moviePlacements.get(event.movieId);
      if (!placement)
        throw new Error(
          'Timeline event "' + event.id + '" references unknown movie "' + event.movieId + '"',
        );
      return { event, ...placement };
    })
    .sort(
      (left, right) =>
        left.x - right.x ||
        (left.event.id < right.event.id ? -1 : left.event.id > right.event.id ? 1 : 0),
    );

  for (const { event, movie, x } of orderedEvents) {
    const ends = eventTrackEnds.get(movie.primaryUniverseId) ?? [];
    let track = ends.findIndex((lastX) => x - lastX >= EVENT_WIDTH + EVENT_GAP);
    if (track === -1) track = ends.length;
    ends[track] = x;
    eventTrackEnds.set(movie.primaryUniverseId, ends);
    const inLane = eventPlacements.get(movie.primaryUniverseId) ?? [];
    inLane.push({ event, movie, x, track });
    eventPlacements.set(movie.primaryUniverseId, inLane);
  }

  const nodes = new Map<string, TimelineNode>();
  const eventNodes = new Map<string, TimelineEventNode>();
  const lanes: TimelineLane[] = [];
  let height = CANVAS_VERTICAL_PADDING;
  for (const id of laneIds) {
    const trackCount = Math.max(1, trackEnds.get(id)?.length ?? 0);
    const eventTrackCount = eventTrackEnds.get(id)?.length ?? 0;
    const eventRowsHeight =
      eventTrackCount > 0
        ? (eventTrackCount - 1) * EVENT_TRACK_SPACING + EVENT_HEIGHT + EVENT_GAP
        : 0;
    const laneHeight = Math.max(
      MIN_LANE_HEIGHT,
      (trackCount - 1) * TRACK_SPACING +
        CARD_HEIGHT +
        LANE_LABEL_HEIGHT +
        LANE_PADDING +
        eventRowsHeight,
    );
    const center = height + laneHeight / 2;
    lanes.push({ id, y: center, height: laneHeight });

    for (const { event, movie, x, track } of eventPlacements.get(id) ?? []) {
      const y = height + LANE_LABEL_HEIGHT + EVENT_HEIGHT / 2 + track * EVENT_TRACK_SPACING;
      eventNodes.set(event.id, { id: event.id, x, y, event, movie });
    }

    for (const { movie, x, track } of placements.get(id) ?? []) {
      // Reserve lane labels and any event rows above the existing film tracks.
      const cardAreaCenter = center + (LANE_LABEL_HEIGHT + eventRowsHeight - LANE_PADDING) / 2;
      const y = cardAreaCenter + (track - (trackCount - 1) / 2) * TRACK_SPACING;
      nodes.set(movie.id, { x, y, movie });
    }
    height += laneHeight;
  }
  height += CANVAS_VERTICAL_PADDING;

  return { width, height, yearStart, yearEnd, nodes, eventNodes, lanes };
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
