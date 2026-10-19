# A coherent pixel apartment

## Approved design

Keep the existing isometric palette, retro typography, content, sky, and upstairs bedroom. Anchor the window inside the left wall. Put both desks against the back wall, turn the bookshelf toward the interior from the left wall, and place the arcade against a low return wall with its access point in front. Use low cutaway partitions to distinguish the office, reading nook, and lounge, with two-tile openings and a clear route to the ladder and resume stairs. Move the mailbox to the front entrance area.

## Implementation plan

**Goal:** Make the studio read as an apartment without changing its portfolio content.

**Architecture:** A dependency-free `room-layout.js` owns downstairs station positions, partition footprints, window geometry, and navigation. The existing canvas renderer consumes it; the bedroom remains unchanged. Node's built-in tests exercise the same navigation used in the browser.

**Tech stack:** Plain JavaScript, Canvas 2D, Node test runner, GitHub Pages.

- [ ] Add failing tests in `tests/room-layout.test.cjs` for connected doorways, every station's reachable access tile, stair heights, the window's wall bounds, and the left-facing bookshelf transform.
- [ ] Add `room-layout.js`; connect its downstairs layout/navigation to `room.js` and load it before the renderer in `index.html`.
- [ ] Update the bookshelf, window, arcade access, furniture placement and depth-sorted cutaway partitions. Keep all topic IDs and external links.
- [ ] Run `node --test tests/*.test.cjs`, syntax checks and a browser smoke test. Inspect desktop/mobile screenshots and verify station navigation plus upstairs/downstairs travel.
- [ ] Review the exact diff, commit only these changes to main, push, and verify the Pages build and served assets.

Deployment directly to main was explicitly approved for this update. Execute inline; no subagents. Do not alter unrelated content or personal information.
