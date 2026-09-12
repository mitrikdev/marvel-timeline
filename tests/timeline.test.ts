import assert from 'node:assert/strict';
import test from 'node:test';
import type { Movie, Universe } from '../src/data/types';
import { timelineEvents, type TimelineEvent } from '../src/data/events';
import { movies as collection, universes as collectionUniverses } from '../src/data';
import { buildLayout, threadPath, TIMELINE_METRICS } from '../src/lib/timeline';

const {
  axisPadding,
  densityDefault,
  densityMin,
  densityMax,
  densityStep,
  cardWidth,
  cardHeight,
  cardGap,
  cardAnchorX,
  eventHeight,
  eventGap,
  eventTrackSpacing,
  laneLabelHeight,
  lanePadding,
  minLaneHeight,
  canvasVerticalPadding,
} = TIMELINE_METRICS;

const zoomScales = Array.from(
  { length: (densityMax - densityMin) / densityStep + 1 },
  (_, index) => densityMin + index * densityStep,
);

const universes: Universe[] = [
  { id: 'mcu', name: 'MCU', shortName: 'MCU' },
  { id: 'raimi', name: 'Raimi Spider-Man', shortName: 'Raimi' },
];

function movie(id: string, releaseDate: string, primaryUniverseId = 'mcu'): Movie {
  return {
    id,
    title: id,
    releaseDate,
    primaryUniverseId,
    studioIds: [],
    franchiseIds: [],
    crossoverUniverseIds: [],
    appearances: [],
    sourceUrls: [],
  };
}

test('release chronology controls x while input universe order controls lane order', () => {
  const movies = [
    movie('last', '2021-12-31'),
    movie('first', '2000-01-01', 'raimi'),
    movie('middle', '2010-06-10'),
  ];
  const layout = buildLayout(movies, universes, 180);
  assert.equal(layout.yearStart, 2000);
  assert.equal(layout.yearEnd, 2022);
  assert.equal(layout.nodes.get('first')!.x, 72);
  assert.ok(layout.nodes.get('first')!.x < layout.nodes.get('middle')!.x);
  assert.ok(layout.nodes.get('middle')!.x < layout.nodes.get('last')!.x);
  assert.deepEqual(
    layout.lanes.map((lane) => lane.id),
    ['mcu', 'raimi'],
  );
  assert.ok(layout.lanes[0].y < layout.lanes[1].y);
  assert.equal(layout.width, 72 + 22 * 180 + cardWidth - cardAnchorX + cardGap);
});

test('same UTC release date has identical x in every universe, including leap years', () => {
  const layout = buildLayout(
    [
      movie('jan', '2020-01-01'),
      movie('july-mcu', '2020-07-02'),
      movie('july-raimi', '2020-07-02', 'raimi'),
      movie('next-year', '2021-01-01'),
    ],
    universes,
    200,
  );
  assert.equal(layout.nodes.get('july-mcu')!.x, 172);
  assert.equal(layout.nodes.get('july-mcu')!.x, layout.nodes.get('july-raimi')!.x);
  assert.equal(layout.nodes.get('next-year')!.x, 272);
});

test('layout is deterministic when input movies are reordered, including identical dates', () => {
  const movies = [
    movie('c', '2020-01-01'),
    movie('a', '2020-01-01'),
    movie('b', '2020-01-01'),
    movie('d', '2021-12-20'),
  ];
  const first = buildLayout(movies, universes, 220);
  const second = buildLayout([...movies].reverse(), universes, 220);
  assert.deepEqual(first, second);
  const { trackSpacing } = first.metrics;
  assert.equal(first.nodes.get('a')!.y + trackSpacing, first.nodes.get('b')!.y);
  assert.equal(first.nodes.get('b')!.y + trackSpacing, first.nodes.get('c')!.y);
  assert.equal(first.nodes.get('a')!.y, first.nodes.get('d')!.y);
  assert.deepEqual(
    movies.map((entry) => entry.id),
    ['c', 'a', 'b', 'd'],
  );
});

test('dense release clusters allocate subtracks without card overlap or leaving lane bounds', () => {
  const movies = [
    ...Array.from({ length: 12 }, (_, index) =>
      movie(`dense-${index}`, `2020-01-${String(index + 1).padStart(2, '0')}`),
    ),
    movie('late', '2022-12-31'),
    movie('other-lane', '2020-01-01', 'raimi'),
  ];
  const layout = buildLayout(movies, universes, 140);

  for (const lane of layout.lanes) {
    assert.ok(lane.height >= minLaneHeight);
    const top = lane.y - lane.height / 2;
    const bottom = lane.y + lane.height / 2;
    const nodes = [...layout.nodes.values()].filter(
      (node) => node.movie.primaryUniverseId === lane.id,
    );
    for (const node of nodes) {
      assert.ok(node.x - cardAnchorX >= 0, `${node.movie.id} exceeds left bounds`);
      assert.ok(
        node.x - cardAnchorX + cardWidth <= layout.width,
        `${node.movie.id} exceeds right bounds`,
      );
      assert.ok(
        node.y - cardHeight / 2 >= top + laneLabelHeight,
        `${node.movie.id} overlaps its lane label`,
      );
      assert.ok(
        node.y + cardHeight / 2 <= bottom - lanePadding,
        `${node.movie.id} exceeds bottom padding`,
      );
    }
    for (let left = 0; left < nodes.length; left += 1) {
      for (let right = left + 1; right < nodes.length; right += 1) {
        const horizontalDistance = Math.abs(nodes[left].x - nodes[right].x);
        const verticalDistance = Math.abs(nodes[left].y - nodes[right].y);
        assert.ok(
          horizontalDistance >= cardWidth || verticalDistance >= cardHeight,
          'card rectangles must not overlap',
        );
        if (verticalDistance === 0)
          assert.ok(
            horizontalDistance >= cardWidth + cardGap,
            'cards sharing a track need a 4px gap',
          );
      }
    }
  }
  assert.equal(layout.lanes[0].y - layout.lanes[0].height / 2, canvasVerticalPadding);
  const lastLane = layout.lanes[layout.lanes.length - 1];
  assert.equal(layout.height - (lastLane.y + lastLane.height / 2), canvasVerticalPadding);
  assert.equal(
    layout.height,
    layout.lanes.reduce((sum, lane) => sum + lane.height, 0) + canvasVerticalPadding * 2,
  );
});

test('subtracks reserve lane label space and use compact 42px spacing', () => {
  const layout = buildLayout(
    [movie('first', '2020-01-01'), movie('second', '2020-01-01')],
    universes,
    160,
  );
  const first = layout.nodes.get('first')!;
  const second = layout.nodes.get('second')!;
  assert.equal(second.y - first.y, 42);
  assert.equal((first.y + second.y) / 2, layout.lanes[0].y + (laneLabelHeight - lanePadding) / 2);
  assert.equal(layout.lanes[0].height, 106);
  assert.equal(layout.lanes[1].height, 64);
});

test('unknown universes retain their movies in deterministic appended lanes', () => {
  const layout = buildLayout(
    [movie('z', '2000-01-01', 'z'), movie('a', '2000-01-01', 'a')],
    universes,
    160,
  );
  assert.deepEqual(
    layout.lanes.map((lane) => lane.id),
    ['mcu', 'raimi', 'a', 'z'],
  );
  assert.equal(layout.nodes.size, 2);
});

test('empty data yields finite deterministic dimensions and invalid scales are rejected', () => {
  const empty = buildLayout([], universes, 160);
  assert.equal(empty.nodes.size, 0);
  assert.equal(empty.yearEnd - empty.yearStart, 1);
  assert.equal(empty.width, 420);
  assert.equal(empty.height, 136);
  assert.deepEqual(empty, buildLayout([], universes, 160));
  for (const scale of [0, -1, Number.NaN, Number.POSITIVE_INFINITY]) {
    assert.throws(() => buildLayout([], universes, scale), RangeError);
  }
});

test('thread paths handle empty/single nodes and pass through exact chronological anchors', () => {
  assert.equal(threadPath([]), '');
  assert.equal(threadPath([{ x: 1.5, y: 8 }]), 'M 1.5 8');
  assert.equal(
    threadPath([
      { x: 0, y: 20 },
      { x: 100, y: 80 },
      { x: 200, y: 20 },
    ]),
    'M 0 20 C 50 20, 50 80, 100 80 C 150 80, 150 20, 200 20',
  );
  assert.equal(
    threadPath([
      { x: 10, y: 20 },
      { x: 10, y: 80 },
    ]),
    'M 10 20 C 10 20, 10 80, 10 80',
  );
});

test('the complete collection stays collision-free and date-proportional at every zoom level', () => {
  const baseline = buildLayout(collection, collectionUniverses, densityDefault);
  for (const scale of zoomScales) {
    const layout = buildLayout(collection, collectionUniverses, scale);
    const { cardWidth, cardHeight, cardGap } = layout.metrics;
    assert.equal(layout.nodes.size, collection.length);
    for (const lane of layout.lanes) {
      const nodes = [...layout.nodes.values()].filter(
        (node) => node.movie.primaryUniverseId === lane.id,
      );
      for (const node of nodes) {
        const expectedX =
          axisPadding +
          ((baseline.nodes.get(node.movie.id)!.x - axisPadding) * scale) / densityDefault;
        assert.ok(
          Math.abs(node.x - expectedX) < 1e-8,
          node.movie.id + ': zoom must preserve its release date',
        );
        assert.ok(node.x - cardAnchorX >= 0, node.movie.id + ': left edge is clipped');
        assert.ok(
          node.x - cardAnchorX + cardWidth + cardGap <= layout.width,
          node.movie.id + ': right edge is clipped',
        );
        assert.ok(
          node.y - cardHeight / 2 >= lane.y - lane.height / 2 + laneLabelHeight,
          node.movie.id + ': overlaps lane label',
        );
        assert.ok(
          node.y + cardHeight / 2 <= lane.y + lane.height / 2 - lanePadding,
          node.movie.id + ': outside lane',
        );
      }
      for (let left = 0; left < nodes.length; left += 1) {
        for (let right = left + 1; right < nodes.length; right += 1) {
          const dx = Math.abs(nodes[left].x - nodes[right].x);
          const dy = Math.abs(nodes[left].y - nodes[right].y);
          assert.ok(
            dx >= cardWidth || dy >= cardHeight,
            scale + 'px/year: ' + nodes[left].movie.id + ' overlaps ' + nodes[right].movie.id,
          );
          if (dy === 0) assert.ok(dx >= cardWidth + cardGap);
        }
      }
    }
  }
});

function timelineEvent(
  id: string,
  movieId: string,
  kind: TimelineEvent['kind'] = 'story',
): TimelineEvent {
  return {
    id,
    title: id,
    movieId,
    kind,
    description: 'An event in its associated film.',
    sourceUrls: ['https://www.marvel.com/movies'],
  };
}

function assertEventLayoutBounds(layout: ReturnType<typeof buildLayout>) {
  const { cardWidth, cardHeight, eventWidth, eventHeight, eventGap } = layout.metrics;
  for (const lane of layout.lanes) {
    const laneTop = lane.y - lane.height / 2;
    const laneBottom = lane.y + lane.height / 2;
    const filmNodes = [...layout.nodes.values()].filter(
      (node) => node.movie.primaryUniverseId === lane.id,
    );
    const eventNodes = [...layout.eventNodes.values()].filter(
      (node) => node.movie.primaryUniverseId === lane.id,
    );
    const rectangles = [
      ...filmNodes.map((node) => ({
        id: node.movie.id,
        x: node.x,
        y: node.y,
        width: cardWidth,
        height: cardHeight,
      })),
      ...eventNodes.map((node) => ({
        id: node.id,
        x: node.x,
        y: node.y,
        width: eventWidth,
        height: eventHeight,
      })),
    ];
    for (const rectangle of rectangles) {
      assert.ok(rectangle.x - cardAnchorX >= 0, rectangle.id + ': outside left canvas edge');
      assert.ok(
        rectangle.x - cardAnchorX + rectangle.width <= layout.width,
        rectangle.id + ': outside right canvas edge',
      );
      assert.ok(
        rectangle.y - rectangle.height / 2 >= laneTop + laneLabelHeight,
        rectangle.id + ': overlaps lane label',
      );
      assert.ok(
        rectangle.y + rectangle.height / 2 <= laneBottom - lanePadding,
        rectangle.id + ': outside lane bottom',
      );
    }
    for (let left = 0; left < rectangles.length; left += 1) {
      for (let right = left + 1; right < rectangles.length; right += 1) {
        const a = rectangles[left];
        const b = rectangles[right];
        const separateX = a.x + a.width <= b.x || b.x + b.width <= a.x;
        const separateY =
          a.y + a.height / 2 <= b.y - b.height / 2 || b.y + b.height / 2 <= a.y - a.height / 2;
        assert.ok(separateX || separateY, a.id + ' overlaps ' + b.id);
      }
    }
    for (let left = 0; left < eventNodes.length; left += 1) {
      for (let right = left + 1; right < eventNodes.length; right += 1) {
        if (eventNodes[left].y === eventNodes[right].y) {
          assert.ok(
            Math.abs(eventNodes[left].x - eventNodes[right].x) >= eventWidth + eventGap,
            'event row needs horizontal gap',
          );
        }
      }
    }
    if (eventNodes.length && filmNodes.length) {
      const eventBottom = Math.max(...eventNodes.map((node) => node.y + eventHeight / 2));
      const filmTop = Math.min(...filmNodes.map((node) => node.y - cardHeight / 2));
      assert.ok(filmTop - eventBottom >= eventGap, 'events must have a gap before film tracks');
    }
  }
}

test('omitting or hiding events preserves the existing film layout with no reserved event rows', () => {
  const movies = [movie('early', '2000-01-01'), movie('late', '2002-12-31', 'raimi')];
  const omitted = buildLayout(movies, universes, 160);
  const hidden = buildLayout(movies, universes, 160, []);
  assert.deepEqual(omitted, hidden);
  assert.equal(omitted.eventNodes.size, 0);
  assert.equal(omitted.height, 136);
  assert.equal(omitted.lanes[0].height, 64);
  assert.equal(
    omitted.nodes.get('early')!.y,
    canvasVerticalPadding + laneLabelHeight + cardHeight / 2,
  );
});

test('events use their exact film x, date and primary lane while only occupied lanes reserve space', () => {
  const movies = [
    movie('first', '2000-01-01'),
    movie('last', '2004-12-31'),
    movie('other', '2001-01-01', 'raimi'),
  ];
  const events = [timelineEvent('start', 'first', 'milestone'), timelineEvent('ending', 'last')];
  const withoutEvents = buildLayout(movies, universes, 160);
  const layout = buildLayout(movies, universes, 160, events);
  assert.equal(layout.eventNodes.size, 2);
  assert.equal(layout.lanes[0].height - withoutEvents.lanes[0].height, eventHeight + eventGap);
  assert.equal(layout.lanes[1].height, withoutEvents.lanes[1].height);
  assert.equal(layout.height - withoutEvents.height, eventHeight + eventGap);
  assert.equal(
    layout.eventNodes.get('start')!.y,
    layout.eventNodes.get('ending')!.y,
    'distant events reuse a row',
  );
  for (const event of events) {
    const node = layout.eventNodes.get(event.id)!;
    assert.equal(node.id, event.id);
    assert.equal(node.event, event);
    assert.equal(
      node.movie,
      movies.find((movie) => movie.id === event.movieId),
    );
    assert.equal(node.x, layout.nodes.get(event.movieId)!.x);
    assert.equal(node.x, withoutEvents.nodes.get(event.movieId)!.x);
  }
  assertEventLayoutBounds(layout);
});

test('same-film events and nearby-year events get deterministic separate rows without input mutation', () => {
  const movies = [
    movie('first', '2000-01-01'),
    movie('next', '2001-01-01'),
    movie('later', '2005-01-01'),
  ];
  const events = [
    timelineEvent('z-first', 'first'),
    timelineEvent('a-first', 'first', 'milestone'),
    timelineEvent('next', 'next'),
    timelineEvent('later', 'later'),
  ];
  const layout = buildLayout(movies, universes, 160, events);
  const reversed = buildLayout([...movies].reverse(), universes, 160, [...events].reverse());
  assert.deepEqual(layout, reversed);
  assert.equal(
    layout.eventNodes.get('z-first')!.y - layout.eventNodes.get('a-first')!.y,
    eventTrackSpacing,
  );
  assert.equal(
    layout.eventNodes.get('next')!.y - layout.eventNodes.get('z-first')!.y,
    eventTrackSpacing,
  );
  assert.equal(layout.eventNodes.get('later')!.y, layout.eventNodes.get('a-first')!.y);
  assert.deepEqual(
    events.map((event) => event.id),
    ['z-first', 'a-first', 'next', 'later'],
  );
  assertEventLayoutBounds(layout);
});

test('event layout rejects unknown movie references with event and movie identifiers', () => {
  assert.throws(
    () =>
      buildLayout([movie('existing', '2000-01-01')], universes, 160, [
        timelineEvent('bad-event', 'missing-film'),
      ]),
    /Timeline event "bad-event" references unknown movie "missing-film"/,
  );
});

test('dense event badges and film cards never overlap or clip at any supported zoom', () => {
  const movies = [
    movie('first', '2000-01-01'),
    movie('same-date', '2000-01-01'),
    movie('nearby', '2000-02-01'),
    movie('next-year', '2001-01-01'),
    movie('latest', '2004-12-31'),
    movie('other-universe', '2000-01-01', 'raimi'),
  ];
  const events = [
    timelineEvent('a', 'first'),
    timelineEvent('b', 'first', 'milestone'),
    timelineEvent('c', 'same-date'),
    timelineEvent('d', 'nearby'),
    timelineEvent('e', 'next-year'),
    timelineEvent('f', 'latest'),
    timelineEvent('g', 'other-universe'),
  ];
  for (const scale of zoomScales) {
    const layout = buildLayout(movies, universes, scale, events);
    assert.equal(layout.eventNodes.size, events.length);
    for (const node of layout.eventNodes.values())
      assert.equal(node.x, layout.nodes.get(node.movie.id)!.x);
    assertEventLayoutBounds(layout);
  }
});

test('canonical story events fit every zoom and leave unoccupied lane heights unchanged', () => {
  assert.ok(timelineEvents.length > 0);
  const occupiedLanes = new Set(
    timelineEvents.map(
      (event) => collection.find((movie) => movie.id === event.movieId)!.primaryUniverseId,
    ),
  );
  for (const scale of zoomScales) {
    const baseline = buildLayout(collection, collectionUniverses, scale);
    const layout = buildLayout(collection, collectionUniverses, scale, timelineEvents);
    assert.equal(layout.eventNodes.size, timelineEvents.length);
    assertEventLayoutBounds(layout);
    for (const node of layout.eventNodes.values()) {
      assert.equal(node.x, layout.nodes.get(node.movie.id)!.x);
      assert.equal(node.x, baseline.nodes.get(node.movie.id)!.x);
    }
    for (const lane of layout.lanes) {
      const originalLane = baseline.lanes.find((item) => item.id === lane.id)!;
      if (!occupiedLanes.has(lane.id)) assert.equal(lane.height, originalLane.height);
      const films = [...layout.nodes.values()].filter(
        (node) => node.movie.primaryUniverseId === lane.id,
      );
      const relativeShifts = films.map(
        (node) => node.y - lane.y - (baseline.nodes.get(node.movie.id)!.y - originalLane.y),
      );
      assert.equal(
        new Set(relativeShifts).size,
        Math.min(1, films.length),
        'events must not reorder existing film tracks',
      );
    }
  }
});

test('default geometry meets the compactness budget without sacrificing the larger text boxes', () => {
  const layout = buildLayout(collection, collectionUniverses, densityDefault, timelineEvents);
  // The previous 77-film default was 2,004px high, with a 440px MCU lane.
  assert.ok(layout.height <= 2004 * 0.8, 'the default canvas should be at least 20% shorter');
  assert.ok(
    layout.lanes.find((lane) => lane.id === 'mcu')!.height <= 440 * 0.9,
    'the MCU lane should remain at least 10% shorter with poster thumbnails',
  );
  assert.ok(
    cardHeight >= 16 * 1.1 * 2 + 2,
    'film cards must hold two 16px title lines plus borders',
  );
  assert.ok(
    eventHeight >= 14 * 1.1 * 2 + 2,
    'event badges must hold two 14px title lines plus borders',
  );
  assert.ok(zoomScales.includes(densityDefault));
  assert.equal(zoomScales.at(-1), densityMax);
  assert.equal((densityMax - densityMin) % densityStep, 0, 'zoom limits must align with the step');
  assertEventLayoutBounds(layout);
});

test('semantic zoom exposes exact effective card dimensions at both boundaries', () => {
  const films = [movie('first', '2020-01-01'), movie('second', '2020-01-01')];
  for (const [scale, detailLevel, width, height, spacing] of [
    [90, 'overview', 156, 40, 42],
    [110, 'overview', 156, 40, 42],
    [110.01, 'standard', 192, 40, 42],
    [130, 'standard', 192, 40, 42],
    [189.99, 'standard', 192, 40, 42],
    [190, 'detail', 296, 96, 100],
    [250, 'detail', 296, 96, 100],
  ] as const) {
    const layout = buildLayout(films, universes, scale);
    assert.equal(layout.detailLevel, detailLevel);
    assert.equal(layout.metrics.cardWidth, width);
    assert.equal(layout.metrics.cardHeight, height);
    assert.equal(layout.metrics.trackSpacing, spacing);
    assert.equal(layout.nodes.get('second')!.y - layout.nodes.get('first')!.y, spacing);
    assert.equal(layout.nodes.get('first')!.x, axisPadding);
    for (const key of [
      'eventWidth',
      'eventHeight',
      'eventGap',
      'eventTrackSpacing',
      'cardAnchorX',
      'densityDefault',
      'densityMin',
      'densityMax',
      'densityStep',
    ] as const) {
      assert.equal(layout.metrics[key], TIMELINE_METRICS[key]);
    }
    assertEventLayoutBounds(layout);
  }
});

test('default geometry stays exact while semantic levels change the card footprint', () => {
  const standard = buildLayout(collection, collectionUniverses, densityDefault, timelineEvents);
  assert.equal(standard.detailLevel, 'standard');
  assert.deepEqual(standard.metrics, TIMELINE_METRICS);
  assert.equal(standard.width, 4030);
  assert.equal(standard.height, 1598);
  assert.equal(standard.lanes.find((lane) => lane.id === 'mcu')!.height, 390);
  const overview = buildLayout(collection, collectionUniverses, densityMin, timelineEvents);
  const detail = buildLayout(collection, collectionUniverses, 190, timelineEvents);
  assert.ok(overview.metrics.cardWidth < standard.metrics.cardWidth);
  assert.ok(detail.metrics.cardHeight >= 66 + 2, 'detailed cards must hold a 66px poster');
  assert.ok(
    detail.metrics.cardHeight >= 18 * 1.1 * 3 + 14 * 1.2 + 2,
    'detailed cards must hold three title lines plus a release year',
  );
  for (const layout of [overview, standard, detail]) {
    assertEventLayoutBounds(layout);
  }
});
