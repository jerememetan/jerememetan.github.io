(function (root) {
  "use strict";
  const stations = [
    { id: "about", name: "About me", i: 3, j: 1, access: [3, 2], kind: "desk", number: "01" },
    { id: "projects", name: "Projects", i: 7, j: 1, access: [7, 2], kind: "work", number: "02" },
    { id: "games", name: "Games", i: 10, j: 6, access: [10, 7], kind: "arcade", number: "03" },
    { id: "hobbies", name: "Hobbies", i: 0, j: 8, access: [2, 8], kind: "books", number: "04" },
    { id: "contact", name: "Mailbox", i: 10, j: 11, access: [9, 11], kind: "mail", number: "05" },
    { id: "linkedin", name: "LinkedIn", i: 9, j: 0, access: [9, 1], kind: "social", number: "06" },
    { id: "github", name: "GitHub", i: 5, j: 0, access: [5, 1], kind: "social", number: "07" },
    { id: "resume", name: "Resume", i: 0, j: 4, access: [1, 4], kind: "treasure", number: "08" },
  ];
  const ladder = { id: "upstairs", name: "Upstairs", i: 11, j: 2, access: [10, 2], kind: "ladder", number: "↑", floor: 0 };
  const staircase = { i: 0, j: 4, width: 1.4, heights: [60, 60, 40, 20], maxRise: 20 };
  // Footprints use whole floor tiles; thin walls occupy the same cells on the minimap.
  const partitions = [
    { i: 5, j: 4, w: 4, d: 0.22, height: 34 },
    { i: 3, j: 6, w: 0.22, d: 2, height: 40 },
    { i: 3, j: 10, w: 0.22, d: 2, height: 40 },
    { i: 9, j: 5.3, w: 3, d: 0.22, height: 40 },
  ];
  const blocked = new Set([
    "2,0", "3,0", "4,0", "2,1", "3,1", "4,1", "4,2",
    "6,0", "7,0", "8,0", "6,1", "7,1", "8,1",
    "0,7", "1,7", "0,8", "1,8", "0,9", "1,9",
    "9,6", "10,6", "5,9", "6,9", "5,10", "6,10", "5,8", "6,8",
    "10,11", "0,10", "11,0", "11,9", "11,2",
    "0,4", "0,5", "1,5", "2,5", "3,5",
  ]);
  for (const wall of partitions) {
    for (let i = Math.floor(wall.i); i < Math.ceil(wall.i + wall.w); i++) {
      for (let j = Math.floor(wall.j); j < Math.ceil(wall.j + wall.d); j++) blocked.add(`${i},${j}`);
    }
  }
  function walkable(i, j) {
    return Number.isInteger(i) && Number.isInteger(j) && i >= 0 && j >= 0 && i < 12 && j < 12 && !blocked.has(`${i},${j}`);
  }
  function floorHeight(i, j) {
    return j === staircase.j ? staircase.heights[i - staircase.i] || 0 : 0;
  }
  function canStep(i, j, ni, nj) {
    const from = floorHeight(i, j), to = floorHeight(ni, nj);
    return Math.abs(i - ni) + Math.abs(j - nj) === 1 && walkable(ni, nj) && Math.abs(to - from) <= staircase.maxRise && (from === to || j === nj);
  }
  function route(start, end) {
    if (!walkable(...start) || !walkable(...end)) return null;
    const key = (tile) => tile.join(",");
    const queue = [start], previous = new Map([[key(start), null]]);
    for (let n = 0; n < queue.length; n++) {
      const tile = queue[n];
      if (key(tile) === key(end)) {
        const result = [];
        for (let at = tile; previous.get(key(at)); at = previous.get(key(at))) result.push(at);
        return result.reverse();
      }
      for (const [di, dj] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const next = [tile[0] + di, tile[1] + dj];
        if (!previous.has(key(next)) && canStep(...tile, ...next)) {
          previous.set(key(next), tile);
          queue.push(next);
        }
      }
    }
    return null;
  }
  const windowFrame = { i: 0, j: 6.1, height: 120, width: 90, depth: 57 };
  function faceTransform(wall) {
    return [1, wall === "left" ? -0.5 : 0.5, 0, 1];
  }
  function windowCorners() {
    const { i, j, height, width, depth } = windowFrame;
    const x = 500 + (i - j) * 30, y = 155 + (i + j) * 15 - height;
    return [[x, y], [x + width, y - width / 2], [x + width, y - width / 2 + depth], [x, y + depth]];
  }
  const layout = { stations, ladder, staircase, partitions, blocked, walkable, floorHeight, canStep, route, windowFrame, windowCorners, faceTransform };
  if (typeof module !== "undefined" && module.exports) module.exports = layout;
  else root.RoomLayout = layout;
})(globalThis);
