const test = require('node:test');
const assert = require('node:assert/strict');
const { existsSync, readFileSync } = require('node:fs');
const path = require('node:path');
const source = path.join(__dirname, '..', 'room-layout.js');
const layout = existsSync(source) ? require(source) : {};

test('every portfolio station and upstairs ladder has reachable floor access', () => {
  assert.equal(typeof layout.route, 'function', 'shared apartment layout not implemented');
  for (const station of [...layout.stations, layout.ladder]) {
    assert.ok(layout.walkable(...station.access), `${station.id} access is blocked`);
    const route = layout.route([6, 7], station.access);
    assert.ok(route, `${station.id} is unreachable`);
    assert.deepEqual(route.at(-1), station.access);
    let previous = [6, 7];
    for (const tile of route) {
      assert.ok(layout.canStep(...previous, ...tile), `invalid step to ${tile}`);
      previous = tile;
    }
  }
});

test('cutaway walls block movement while leaving two-tile entrances open', () => {
  assert.equal(typeof layout.walkable, 'function', 'partition collisions not implemented');
  for (const tile of [[5, 4], [6, 4], [8, 4], [3, 6], [3, 7], [3, 10], [3, 11], [11, 5]]) {
    assert.equal(layout.walkable(...tile), false, `wall ${tile} is passable`);
  }
  for (const tile of [[3, 8], [3, 9], [4, 6], [4, 7], [9, 4], [10, 4], [10, 7]]) {
    assert.equal(layout.walkable(...tile), true, `entrance ${tile} is blocked`);
  }
});

test('all walkable tiles belong to one connected apartment', () => {
  assert.equal(typeof layout.route, 'function', 'shared pathfinding not implemented');
  for (let i = 0; i < 12; i++) for (let j = 0; j < 12; j++) {
    if (layout.walkable(i, j)) assert.ok(layout.route([6, 7], [i, j]), `isolated tile ${i},${j}`);
  }
});

test('resume stairs can only be climbed from the low end in 20-pixel steps', () => {
  assert.equal(typeof layout.floorHeight, 'function', 'stair geometry not implemented');
  assert.deepEqual([0, 1, 2, 3, 4].map(i => layout.floorHeight(i, 4)), [60, 60, 40, 20, 0]);
  assert.equal(layout.canStep(4, 4, 3, 4), true);
  assert.equal(layout.canStep(2, 3, 2, 4), false);
  assert.equal(layout.canStep(1, 3, 1, 4), false);
});

test('window corners stay flush within the left wall, below its top trim', () => {
  assert.equal(typeof layout.windowCorners, 'function', 'wall-anchored window not implemented');
  for (const [x, y] of layout.windowCorners()) {
    const j = (500 - x) / 30;
    const wallBase = 155 + j * 15;
    assert.ok(j > 0 && j < 12);
    assert.ok(y > wallBase - 126 && y < wallBase, `window escapes wall at ${x},${y}`);
  }
});

test('bookshelf faces inward from the left wall and arcade access is in front', () => {
  assert.equal(typeof layout.faceTransform, 'function', 'wall-facing furniture not implemented');
  assert.deepEqual(layout.faceTransform('left'), [1, -0.5, 0, 1]);
  assert.deepEqual(layout.faceTransform('back'), [1, 0.5, 0, 1]);
  const books = layout.stations.find(s => s.id === 'hobbies');
  const arcade = layout.stations.find(s => s.id === 'games');
  assert.equal(books.i, 0);
  assert.ok(books.access[0] > books.i);
  assert.ok(arcade.access[1] > arcade.j);
});

test('shared layout loads before the renderer and retains all portfolio destinations', () => {
  const html = readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
  assert.ok(html.includes('src="room-layout.js'), 'shared layout script is not loaded');
  assert.ok(html.indexOf('src="room-layout.js') < html.indexOf('src="room.js'));
  assert.deepEqual(layout.stations.map(s => s.id).sort(), ['about', 'contact', 'games', 'github', 'hobbies', 'linkedin', 'projects', 'resume']);
});
