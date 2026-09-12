import assert from 'node:assert/strict';
import test from 'node:test';
import type { Movie, Universe } from '../src/data/types';
import { buildLayout, threadPath } from '../src/lib/timeline';

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
  assert.equal(layout.width, 72 + 22 * 180 + 72);
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
  assert.equal(first.nodes.get('a')!.y + 52, first.nodes.get('b')!.y);
  assert.equal(first.nodes.get('b')!.y + 52, first.nodes.get('c')!.y);
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
    assert.ok(lane.height >= 94);
    const top = lane.y - lane.height / 2;
    const bottom = lane.y + lane.height / 2;
    const nodes = [...layout.nodes.values()].filter(
      (node) => node.movie.primaryUniverseId === lane.id,
    );
    for (const node of nodes) {
      assert.ok(node.x - 63 >= 0, `${node.movie.id} exceeds left bounds`);
      assert.ok(node.x + 63 <= layout.width, `${node.movie.id} exceeds right bounds`);
      assert.ok(node.y - 20 >= top + 24, `${node.movie.id} exceeds top padding`);
      assert.ok(node.y + 20 <= bottom - 24, `${node.movie.id} exceeds bottom padding`);
    }
    for (let left = 0; left < nodes.length; left += 1) {
      for (let right = left + 1; right < nodes.length; right += 1) {
        const horizontalDistance = Math.abs(nodes[left].x - nodes[right].x);
        const verticalDistance = Math.abs(nodes[left].y - nodes[right].y);
        assert.ok(
          horizontalDistance >= 126 || verticalDistance >= 40,
          'card rectangles must not overlap',
        );
        if (verticalDistance === 0)
          assert.ok(horizontalDistance >= 144, 'cards sharing a track need an 18px gap');
      }
    }
  }
  assert.equal(layout.lanes[0].y - layout.lanes[0].height / 2, 32);
  const lastLane = layout.lanes[layout.lanes.length - 1];
  assert.equal(layout.height - (lastLane.y + lastLane.height / 2), 32);
  assert.equal(layout.height, layout.lanes.reduce((sum, lane) => sum + lane.height, 0) + 64);
});

test('subtracks are centered in the lane and separated by 52 pixels', () => {
  const layout = buildLayout(
    [movie('first', '2020-01-01'), movie('second', '2020-01-01')],
    universes,
    160,
  );
  const first = layout.nodes.get('first')!;
  const second = layout.nodes.get('second')!;
  assert.equal(second.y - first.y, 52);
  assert.equal((first.y + second.y) / 2, layout.lanes[0].y);
  assert.equal(layout.lanes[0].height, 140);
  assert.equal(layout.lanes[1].height, 94);
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
  assert.equal(empty.width, 304);
  assert.equal(empty.height, 252);
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
