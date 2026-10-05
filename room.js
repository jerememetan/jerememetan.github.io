(() => {
  "use strict";
  const canvas = document.querySelector("#room"),
    ctx = canvas.getContext("2d");
  const mini = document.querySelector("#minimap"),
    mc = mini.getContext("2d");
  const status = document.querySelector("#room-status"),
    dialog = document.querySelector("#topic-dialog");
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const view = { width: 1000, height: 680, scale: 1, x: 0, y: 0, dpr: 1 };
  function resize() {
    const r = canvas.getBoundingClientRect();
    view.width = r.width;
    view.height = r.height;
    view.dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(r.width * view.dpr);
    canvas.height = Math.round(r.height * view.dpr);
    view.scale =
      r.width < 700
        ? Math.max(r.width / 820, (r.height - 145) / 560)
        : Math.min((r.width - 100) / 820, (r.height - 145) / 560);
    view.x = r.width / 2 - 500 * view.scale;
    view.y = (r.height - 545 * view.scale) / 2;
  }
  new ResizeObserver(resize).observe(canvas);
  resize();
  const player = {
    i: 6,
    j: 7,
    fromI: 6,
    fromJ: 7,
    toI: 6,
    toJ: 7,
    progress: 1,
    moving: false,
    direction: 1,
  };
  const stations = [
    {
      id: "about",
      name: "About me",
      i: 2,
      j: 2,
      access: [3, 3],
      kind: "desk",
      number: "01",
    },
    {
      id: "projects",
      name: "Projects",
      i: 7,
      j: 2,
      access: [7, 3],
      kind: "work",
      number: "02",
    },
    {
      id: "games",
      name: "Games",
      i: 9,
      j: 6,
      access: [8, 6],
      kind: "arcade",
      number: "03",
    },
    {
      id: "hobbies",
      name: "Hobbies",
      i: 2,
      j: 8,
      access: [3, 8],
      kind: "books",
      number: "04",
    },
    {
      id: "contact",
      name: "Mailbox",
      i: 8,
      j: 10,
      access: [7, 10],
      kind: "mail",
      number: "05",
    },
    {
      id: "linkedin",
      name: "LinkedIn",
      i: 10,
      j: 0,
      access: [9, 0],
      kind: "social",
      number: "06",
      frameX: 720,
      frameY: 138,
    },
    {
      id: "github",
      name: "GitHub",
      i: 7,
      j: 0,
      access: [6, 0],
      kind: "social",
      number: "07",
      frameX: 584,
      frameY: 70,
    },
    {
      id: "resume",
      name: "Resume",
      i: 0,
      j: 4,
      access: [1, 4],
      kind: "treasure",
      number: "08",
    },
  ];
  const Bedroom = window.Bedroom;
  const ladders = [
    {
      id: "upstairs",
      name: "Upstairs",
      i: 11,
      j: 2,
      access: [10, 2],
      kind: "ladder",
      number: "↑",
      floor: 0,
    },
    {
      id: "downstairs",
      name: "Downstairs",
      i: 11,
      j: 2,
      access: [10, 3],
      kind: "ladder",
      number: "↓",
      floor: 1,
    },
  ];
  let floor = 0,
    climb = null,
    afterClimb = null;
  const visited = new Set();
  let path = [],
    pending = null,
    hover = null,
    lastTime = 0,
    clock = 0,
    paused = reduced.matches;
  let targets = [];
  const contents = {
    about: {
      category: "01 / ABOUT ME",
      title: "Hey, I'm Jereme",
      body: `
      <div class="about-intro">
        <img class="about-portrait" src="assets/jereme-profile-square.png" width="400" height="400" alt="Illustrated portrait of Jereme with short dark hair and glasses against a blue geometric background">
        <p class="lead">I enjoy building applications that automate my life.</p>
      </div>
      <div class="about-story">
        <p>I'm a Year 3 Software Engineering student at Singapore Management University, specialising in AI.</p>
        <p>I previously studied Optometry at Singapore Polytechnic. During National Service, I discovered how much I enjoyed building games, which led me to pivot into software engineering.</p>
        <p>These days, I enjoy building AI applications, playing around with LLM models, and creating automated workflows. I use AI to make better use of my time—so I can spend less of it on repetitive tasks and more on the things I enjoy.</p>
      </div>`,
    },
    projects: {
      category: "02 / THE PROJECT JOURNAL",
      title: "Things I’ve built.",
      body: "",
    },
    games: {
      category: "03 / THE ARCADE",
      title: "It started with games.",
      body: '<p class="lead">Making games is what drew me into software engineering.</p><p>I enjoy the intersection of interactive worlds and useful technology. EmeraldLLM brings those interests together by experimenting with a local language model inside Pokémon Emerald.</p><article class="project-entry"><h3>EmeraldLLM</h3><p>A game-meets-AI experiment built with C, Python, and Lua.</p></article><p>This little room is another experiment: a portfolio you can walk around instead of simply scrolling through.</p>',
    },
    hobbies: {
      category: "04 / THE CURIOSITY CORNER",
      title: "Outside the syllabus.",
      body: '<p class="lead">I like making things that make life a little more interesting—or a little easier.</p><article class="project-entry"><h3>Making games</h3><p>Building playful experiences was my first step into software.</p></article><article class="project-entry"><h3>Automating everyday life</h3><p>Finding repetitive tasks, connecting tools, and building workflows that take care of them.</p></article><article class="project-entry"><h3>Learning interactive graphics</h3><p>I’m interested in learning Three.js, inspired by the 3D projects I saw at the Astra hackathon.</p></article>',
    },
    resume: {
      category: "08 / THE TREASURE CHEST",
      title: "You found my resume!",
      body: '<p class="lead">A little treasure from my software engineering journey.</p><p>My experience, projects and skills—all in one PDF.</p><a class="content-link" href="assets/Jereme-Tan-Resume.pdf?v=c2341bc9" target="_blank" rel="noopener noreferrer">View resume ↗</a><a class="content-link" href="assets/Jereme-Tan-Resume.pdf?v=c2341bc9" download="Jereme-Tan-Resume.pdf">Download PDF ↓</a>',
    },
  };
  const staircase = {
    i: 0,
    j: 4,
    width: 1.4,
    heights: [60, 60, 40, 20],
    maxRise: 20,
  };
  const blocked = new Set([
    "1,1",
    "2,1",
    "1,2",
    "2,2",
    "6,1",
    "7,1",
    "6,2",
    "7,2",
    "9,6",
    "9,5",
    "1,8",
    "2,8",
    "1,7",
    "2,7",
    "1,9",
    "8,10",
    "0,9",
    "10,0",
    "10,10",
    "4,9",
    "5,9",
    "4,10",
    "5,10",
    "4,8",
    "5,8",
    "0,4",
    "0,5",
    "1,5",
    "2,5",
    "3,5",
  ]);
  const key = (i, j) => `${i},${j}`;
  function activeStations() {
    return [...(floor === 0 ? stations : Bedroom.stations), ladders[floor]];
  }
  function findStation(id) {
    return [...stations, ...Bedroom.stations, ...ladders].find(
      (s) => s.id === id,
    );
  }
  function walkable(i, j) {
    return (
      i >= 0 &&
      j >= 0 &&
      i < 12 &&
      j < 12 &&
      !(i === 11 && j === 2) &&
      !(floor === 0 ? blocked : Bedroom.blocked).has(key(i, j))
    );
  }
  function floorHeight(i, j) {
    return floor === 0 && j === staircase.j
      ? staircase.heights[i - staircase.i] || 0
      : 0;
  }
  function canStep(i, j, ni, nj) {
    const from = floorHeight(i, j),
      to = floorHeight(ni, nj);
    return (
      Math.abs(i - ni) + Math.abs(j - nj) === 1 &&
      walkable(ni, nj) &&
      Math.abs(to - from) <= staircase.maxRise &&
      (from === to || j === nj)
    );
  }
  function playerHeight() {
    if (!player.moving) return floorHeight(player.i, player.j);
    const from = floorHeight(player.fromI, player.fromJ),
      to = floorHeight(player.toI, player.toJ);
    return from + (to - from) * player.progress;
  }
  function route(start, end) {
    const queue = [start],
      seen = new Set([key(...start)]),
      parents = new Map();
    for (let n = 0; n < queue.length; n++) {
      const [i, j] = queue[n];
      if (i === end[0] && j === end[1]) {
        let at = key(i, j),
          result = [];
        while (parents.has(at)) {
          result.unshift(at.split(",").map(Number));
          at = parents.get(at);
        }
        return result;
      }
      for (const [di, dj] of [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ]) {
        const ni = i + di,
          nj = j + dj,
          k = key(ni, nj);
        if (canStep(i, j, ni, nj) && !seen.has(k)) {
          seen.add(k);
          parents.set(k, key(i, j));
          queue.push([ni, nj]);
        }
      }
    }
    return null;
  }
  function navigate(i, j, topic = null) {
    if (climb) return;
    if (topic !== ladders[floor].id) afterClimb = null;
    const start = player.moving
        ? [player.toI, player.toJ]
        : [player.i, player.j],
      next = route(start, [i, j]);
    if (next === null) {
      status.textContent = "That spot is occupied. Try a clear floor tile.";
      return;
    }
    path = next;
    pending = topic;
    document.querySelector("#welcome").hidden = true;
    status.textContent = topic
      ? `Walking to ${findStation(topic).name.toLowerCase()}…`
      : "Taking a little stroll…";
    if (!player.moving && !path.length) arrived();
  }
  function arrived() {
    if (pending) {
      const topic = pending;
      pending = null;
      activateStation(topic);
    } else {
      const near = nearby();
      status.textContent = near
        ? `${near.name} · Press E to explore.`
        : "Pick an object to discover something about me.";
    }
  }
  function nearby() {
    if (player.moving || climb) return;
    return activeStations().find(
      (s) =>
        Math.abs(player.i - s.access[0]) + Math.abs(player.j - s.access[1]) <=
          1 && floorHeight(player.i, player.j) === floorHeight(...s.access),
    );
  }
  function travelToFloor(topic = null) {
    if (climb) return;
    afterClimb = topic;
    setDirectory(false);
    const ladder = ladders[floor];
    navigate(...ladder.access, ladder.id);
    canvas.focus({ preventScroll: true });
  }
  function beginClimb() {
    if (climb) return;
    path = [];
    pending = null;
    hover = null;
    Object.assign(player, {
      i: ladders[floor].access[0],
      j: ladders[floor].access[1],
      moving: false,
      progress: 1,
    });
    climb = { progress: 0, to: 1 - floor };
    document.querySelector("#change-floor").disabled = true;
    status.textContent =
      floor === 0
        ? "Climbing up to the bedroom…"
        : "Climbing back to the studio…";
    if (reduced.matches) finishClimb();
  }
  function finishClimb() {
    if (!climb) return;
    floor = climb.to;
    climb = null;
    path = [];
    pending = null;
    targets = [];
    hover = null;
    mouseTile = null;
    Object.assign(player, {
      i: 10,
      j: 3,
      fromI: 10,
      fromJ: 3,
      toI: 10,
      toJ: 3,
      progress: 1,
      moving: false,
    });
    canvas.dataset.floor = floor === 0 ? "studio" : "bedroom";
    canvas.dataset.position = "10,3";
    document.querySelector("#room-name").textContent =
      floor === 0 ? "JEREME’S STUDIO" : "JEREME’S BEDROOM";
    const control = document.querySelector("#change-floor");
    control.textContent = floor === 0 ? "Upstairs ↑" : "Downstairs ↓";
    control.disabled = false;
    resize();
    status.textContent =
      floor === 0
        ? "Back in the studio. Where to next?"
        : "Welcome upstairs. Explore my experience wall and skills desk.";
    const topic = afterClimb;
    afterClimb = null;
    if (topic) openTopic(topic);
  }
  function selectTopic(id) {
    if (climb) return;
    const station = findStation(id);
    if (!station) return;
    if ((station.floor || 0) !== floor) travelToFloor(id);
    else openTopic(id);
  }
  function recordVisit(id) {
    visited.add(id);
    const total = stations.length + Bedroom.stations.length;
    document.querySelector("#visited-count").textContent =
      `${visited.size} / ${total} spots explored`;
    document.querySelector("#dialog-progress").textContent =
      `${visited.size} OF ${total} SPOTS EXPLORED`;
    document.querySelectorAll("[data-topic], [data-link]").forEach((item) => {
      const itemId = item.dataset.topic || item.dataset.link;
      item.dataset.visited = String(visited.has(itemId));
      item.querySelector(".visit-mark").textContent = visited.has(itemId)
        ? "✓"
        : item.dataset.link
          ? "↗"
          : "+";
    });
  }
  function activateStation(id) {
    if (climb) return;
    if (ladders.some((s) => s.id === id)) {
      beginClimb();
      return;
    }
    const link = document.querySelector(`a[data-link="${id}"]`);
    if (link) {
      path = [];
      pending = null;
      link.click();
    } else openTopic(id);
  }
  function openTopic(id) {
    const content = contents[id] || Bedroom.contents[id];
    if (!content) return;
    dialog.dataset.activeTopic = id;
    recordVisit(id);
    path = [];
    pending = null;
    setDirectory(false);
    document.querySelector("#dialog-category").textContent = content.category;
    const topicBody =
      id === "projects" ? ProjectJournal.render() : content.body;
    const contentRoot = document.querySelector("#dialog-content");
    contentRoot.innerHTML = `<h2 id="dialog-title">${content.title}</h2>${topicBody}`;
    if (id === "projects") ProjectJournal.mount(contentRoot);
    dialog.scrollTop = 0;
    status.textContent = `Exploring: ${findStation(id).name}`;
    if (!dialog.open) dialog.showModal();
  }
  document
    .querySelectorAll("[data-topic]")
    .forEach((btn) =>
      btn.addEventListener("click", () => selectTopic(btn.dataset.topic)),
    );
  document.querySelectorAll("[data-link]").forEach((link) =>
    link.addEventListener("click", () => {
      path = [];
      pending = null;
      recordVisit(link.dataset.link);
      setDirectory(false);
      document.querySelector("#welcome").hidden = true;
      status.textContent =
        link.dataset.link === "contact"
          ? "Opening your email app…"
          : `Opening ${stations.find((s) => s.id === link.dataset.link).name} in a new tab…`;
    }),
  );
  const directory = document.querySelector("#explore-panel"),
    directoryToggle = document.querySelector("#toggle-directory");
  function setDirectory(open) {
    directory.hidden = !open;
    directoryToggle.setAttribute("aria-expanded", String(open));
  }
  directoryToggle.addEventListener("click", () =>
    setDirectory(directory.hidden),
  );
  document
    .querySelector("#change-floor")
    .addEventListener("click", () => travelToFloor());
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !directory.hidden) {
      setDirectory(false);
      directoryToggle.focus();
    }
  });
  document
    .querySelector("#close-dialog")
    .addEventListener("click", () => dialog.close());
  document
    .querySelector("#back-room")
    .addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    if (event.target !== dialog) return;
    const r = dialog.getBoundingClientRect();
    if (
      event.clientX < r.left ||
      event.clientX > r.right ||
      event.clientY < r.top ||
      event.clientY > r.bottom
    )
      dialog.close();
  });
  dialog.addEventListener("close", () => {
    status.textContent = "Back in the room. Where to next?";
    canvas.focus({ preventScroll: true });
  });
  document.querySelector("#dismiss-welcome").addEventListener("click", () => {
    document.querySelector("#welcome").hidden = true;
  });
  const motion = document.querySelector("#motion");
  function updateMotion() {
    motion.setAttribute("aria-pressed", String(paused));
    motion.textContent = paused ? "Resume ambience" : "Pause ambience";
  }
  updateMotion();
  motion.addEventListener("click", () => {
    paused = !paused;
    updateMotion();
  });
  const P = {
    floor: "#dbc9a6",
    floorAlt: "#d2bd98",
    edge: "#947553",
    wood: "#b78258",
    woodLight: "#dbac78",
    woodDark: "#775640",
    wall: "#ead9b9",
    wallSide: "#d1bea1",
    teal: "#618e85",
    deep: "#2b4850",
    mint: "#9dcbb3",
    yellow: "#f5c66d",
    paper: "#f6ebcd",
    ink: "#28333c",
    pink: "#d8978e",
  };
  function point(i, j) {
    return { x: 500 + (i - j) * 30, y: 155 + (i + j) * 15 };
  }
  function poly(points, color, stroke) {
    ctx.beginPath();
    ctx.moveTo(Math.round(points[0][0]), Math.round(points[0][1]));
    for (const p of points.slice(1))
      ctx.lineTo(Math.round(p[0]), Math.round(p[1]));
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
    if (stroke) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }
  function rect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
  }
  function text(str, x, y, color = "#f0ebd8", size = 12, align = "left") {
    ctx.fillStyle = color;
    ctx.font = `${Math.round(size * 1.4)}px "VT323", monospace`;
    ctx.textAlign = align;
    ctx.fillText(str, Math.round(x), Math.round(y));
  }
  function tile(i, j, color) {
    const p = point(i, j);
    poly(
      [
        [p.x, p.y],
        [p.x + 30, p.y + 15],
        [p.x, p.y + 30],
        [p.x - 30, p.y + 15],
      ],
      color,
      "#b9a583",
    );
  }
  function box(i, j, w, d, h, top, left, right) {
    const a = point(i, j),
      b = point(i + w, j),
      c = point(i + w, j + d),
      e = point(i, j + d);
    poly(
      [
        [e.x, e.y],
        [c.x, c.y],
        [c.x, c.y - h],
        [e.x, e.y - h],
      ],
      left,
    );
    poly(
      [
        [b.x, b.y],
        [c.x, c.y],
        [c.x, c.y - h],
        [b.x, b.y - h],
      ],
      right,
    );
    poly(
      [
        [a.x, a.y - h],
        [b.x, b.y - h],
        [c.x, c.y - h],
        [e.x, e.y - h],
      ],
      top,
    );
  }
  // Surface-local pixels: horizontal edges share the room's 2:1 projection.
  function surface(i, j, height, top, paint) {
    const p = point(i, j);
    ctx.save();
    ctx.transform(1, 0.5, top ? -1 : 0, top ? 0.5 : 1, p.x, p.y - height);
    paint();
    ctx.restore();
  }
  function monitor(i, j, height, width, screenColor, caption) {
    surface(i, j, height, true, () => {
      rect(-8, -4, 16, 8, "#515c57");
      rect(-6, -3, 12, 6, "#67756c");
    });
    surface(i, j, height, false, () => {
      rect(-3, -11, 6, 11, P.ink);
      rect(-width / 2 + 3, -42, width, 31, "#18272f");
      rect(-width / 2, -44, width, 31, P.ink);
      rect(-width / 2 + 3, -41, width - 6, 24, screenColor);
      rect(-width / 2 + 3, -15, width - 6, 1, "#819a94");
      if (caption)
        text(caption, 0, -26, P.paper, caption === "AI" ? 10 : 6, "center");
      else
        for (let k = 0; k < 4; k++)
          rect(
            -width / 2 + 7,
            -37 + k * 5,
            10 + (k % 2) * 9,
            2,
            k % 2 ? P.yellow : P.mint,
          );
    });
  }
  function keyboard(i, j, height, width) {
    surface(i, j, height, true, () => {
      rect(-width / 2, -4, width, 9, "#4e5b56");
      rect(-width / 2 + 2, -3, width - 4, 7, "#8faaa0");
      for (let row = 0; row < 2; row++)
        for (let col = 0; col < 6; col++)
          rect(
            -width / 2 + 3 + (col * (width - 6)) / 6,
            -2 + row * 3,
            2,
            2,
            "#d3dbbe",
          );
      rect(-5, 4, 10, 1, "#d3dbbe");
    });
  }
  function plant(i, j) {
    const p = point(i + 0.5, j + 0.5);
    box(i + 0.25, j + 0.25, 0.5, 0.5, 20, "#c69b77", "#9c6d4e", "#795641");
    rect(p.x - 3, p.y - 49, 6, 32, "#60764c");
    rect(p.x - 16, p.y - 52, 14, 12, "#799866");
    rect(p.x + 2, p.y - 61, 15, 12, "#8daa73");
    rect(p.x - 11, p.y - 68, 16, 13, "#6b8a5a");
    rect(p.x - 22, p.y - 42, 17, 9, "#8baa76");
    rect(p.x + 4, p.y - 39, 17, 10, "#658b64");
  }
  function stationLabel(s, x, y, time, objectPoint = null) {
    const lit = hover === s.id;
    const width = s.name.length * 7 + 32;
    const float = paused ? 0 : Math.round(Math.sin(time * 0.0015 + s.i) * 2);
    rect(x - width / 2 + 3, y - 18 + float, width, 23, "#172a32");
    rect(x - width / 2, y - 21 + float, width, 23, lit ? "#f3c56f" : "#f1e6cb");
    text(
      `${visited.has(s.id) ? "✓" : s.number} ${s.name}`,
      x,
      y - 5 + float,
      lit ? "#43382b" : "#33474b",
      11,
      "center",
    );
    targets.push({
      id: s.id,
      x: x - width / 2 - 12,
      y: y - 27 + float,
      w: width + 24,
      h: 32,
    });
    const object = objectPoint || { x, y: y + 110 };
    targets.push({
      id: s.id,
      x: object.x - 55,
      y: object.y - 102,
      w: 110,
      h: 125,
    });
  }
  function desk(s, time) {
    const p = point(s.i + 0.5, s.j + 0.5);
    box(s.i - 0.7, s.j - 0.5, 2.2, 1.1, 38, P.woodLight, P.wood, P.woodDark);
    monitor(s.i + 0.1, s.j - 0.35, 38, 39, P.teal, "HELLO :)");
    keyboard(s.i + 0.2, s.j + 0.18, 38, 24);
    surface(s.i + 0.9, s.j + 0.12, 38, true, () => {
      rect(-6, -4, 12, 8, P.paper);
      rect(-4, -2, 8, 1, "#a8b1a1");
      rect(-4, 0, 6, 1, "#a8b1a1");
    });
    surface(s.i - 0.45, s.j + 0.2, 38, true, () =>
      rect(-5, -4, 10, 8, "#b58d55"),
    );
    surface(s.i - 0.45, s.j + 0.2, 38, false, () => {
      rect(-2, -23, 4, 23, P.woodDark);
      rect(-7, -29, 14, 8, P.yellow);
      rect(-5, -27, 10, 2, "#f8dea1");
    });
    box(s.i + 1, s.j + 1, 0.7, 0.7, 18, "#91b4a0", "#466d67", "#345359");
    stationLabel(s, p.x, p.y - 119, time, p);
  }
  function work(s, time) {
    const p = point(s.i + 0.5, s.j + 0.5);
    box(s.i - 1, s.j - 0.5, 2.6, 1, 40, "#c7a676", "#aa8357", "#846441");
    monitor(s.i - 0.4, s.j - 0.3, 40, 34, "#6dada7", "AI");
    monitor(s.i + 0.75, s.j - 0.3, 40, 34, "#344d5b");
    keyboard(s.i + 0.1, s.j + 0.22, 40, 35);
    surface(s.i + 1.15, s.j + 0.15, 40, true, () => {
      rect(-3, -4, 6, 8, P.ink);
      rect(-2, -3, 4, 3, "#91b4a0");
    });
    stationLabel(s, p.x, p.y - 131, time, p);
  }
  function arcade(s, time) {
    const p = point(s.i + 0.5, s.j + 0.5),
      i = s.i - 0.6,
      j = s.j - 0.25;
    box(i, j, 1.4, 0.9, 85, "#ba807a", "#905d65", "#654e61");
    // The marquee and screen belong to the front face, not screen-space.
    surface(i, j + 0.9, 85, false, () => {
      rect(2, 3, 38, 13, "#efc981");
      text("PLAY", 21, 13, P.ink, 9, "center");
      rect(3, 21, 36, 33, P.ink);
      rect(5, 23, 32, 29, "#477482");
      rect(9, 36, 10, 10, P.mint);
      rect(27, 29, 6, 6, P.yellow);
      rect(18, 70, 8, 4, P.ink);
      rect(19, 71, 6, 1, "#b79599");
    });
    // A shallow projecting deck shares the floor's two diagonal axes.
    box(i, j + 0.75, 1.4, 0.35, 29, "#dea68d", "#b77f7d", "#835e6a");
    surface(i, j + 0.75, 29, true, () => {
      rect(10, 4, 9, 5, P.ink);
      rect(28, 4, 6, 4, "#d56069");
      rect(34, 7, 5, 4, P.yellow);
    });
    surface(i + 0.48, j + 0.92, 29, false, () => {
      rect(-1, -10, 3, 10, P.ink);
      rect(-4, -13, 9, 5, P.ink);
      rect(-3, -12, 6, 2, "#b79599");
    });
    stationLabel(s, p.x + 78, p.y - 49, time, p);
  }
  function books(s, time) {
    const p = point(s.i + 0.5, s.j + 0.5);
    box(s.i - 0.6, s.j - 0.6, 1.5, 1, 68, P.woodLight, P.wood, P.woodDark);
    surface(s.i - 0.6, s.j + 0.4, 68, false, () => {
      rect(3, 4, 39, 59, P.woodDark);
      rect(5, 6, 35, 24, "#a18461");
      rect(5, 35, 35, 24, "#a18461");
      const colors = [P.teal, P.paper, P.pink, P.yellow, "#6d8898"];
      for (let row = 0; row < 2; row++)
        for (let k = 0; k < 5; k++) {
          const x = 6 + k * 7,
            bottom = row ? 59 : 30,
            height = 20 - (k % 3) * 3;
          rect(x, bottom - height, 5, height, colors[row ? 4 - k : k]);
          rect(x, bottom - height, 1, height, "#00000020");
          rect(x + 1, bottom - height + 4, 3, 1, P.paper);
          rect(x + 1, bottom - 4, 3, 1, "#ffffff60");
        }
      rect(0, 30, 45, 5, P.woodLight);
      rect(0, 59, 45, 5, P.woodLight);
      rect(0, 0, 3, 68, P.woodLight);
      rect(42, 0, 3, 68, P.woodLight);
    });
    plant(s.i - 1, s.j + 1);
    stationLabel(s, p.x, p.y - 107, time);
  }
  function mail(s, time) {
    const p = point(s.i + 0.5, s.j + 0.5);
    rect(p.x - 5, p.y - 50, 11, 50, P.woodDark);
    rect(p.x - 10, p.y - 1, 21, 5, "#5e493a");
    box(s.i - 0.35, s.j - 0.25, 0.85, 0.7, 63, "#739c91", "#4c7b75", "#345c5e");
    rect(p.x - 17, p.y - 72, 30, 5, "#8eb0a0");
    rect(p.x - 21, p.y - 67, 38, 5, "#8eb0a0");
    rect(p.x - 15, p.y - 59, 27, 5, "#243e44");
    rect(p.x - 12, p.y - 48, 21, 14, P.paper);
    poly(
      [
        [p.x - 12, p.y - 48],
        [p.x - 2, p.y - 40],
        [p.x + 9, p.y - 48],
      ],
      "#d4cbb0",
    );
    rect(p.x + 19, p.y - 72, 4, 28, "#925253");
    rect(p.x + 23, p.y - 72, 15, 10, "#d07c70");
    stationLabel(s, p.x - 85, p.y - 24, time, p);
  }
  function socialFrame(s) {
    const x = s.frameX,
      y = s.frameY,
      lit = hover === s.id;
    ctx.save();
    ctx.transform(0.8, 0.4, 0, 0.8, x, y);
    rect(3, 3, 70, 78, "#8b7359");
    rect(0, 0, 70, 78, lit ? "#f5c66d" : "#bb9166");
    rect(4, 4, 62, 70, "#ead9b9");
    rect(9, 9, 52, 49, s.id === "linkedin" ? "#376f8c" : "#30464f");
    if (s.id === "linkedin") {
      rect(19, 19, 7, 6, P.paper);
      rect(19, 30, 7, 19, P.paper);
      rect(33, 30, 7, 19, P.paper);
      rect(40, 30, 11, 6, P.paper);
      rect(45, 36, 6, 13, P.paper);
    } else {
      rect(23, 20, 8, 11, P.paper);
      rect(40, 20, 8, 11, P.paper);
      rect(21, 27, 29, 18, P.paper);
      rect(26, 44, 20, 7, P.paper);
      rect(29, 49, 7, 5, P.paper);
      rect(42, 49, 6, 5, P.paper);
      rect(17, 41, 6, 9, P.paper);
      rect(15, 39, 5, 5, P.paper);
    }
    text(s.name, 35, 68, "#34484b", 10, "center");
    ctx.restore();
    targets.push({ id: s.id, x, y, w: 56, h: 90.4 });
  }
  function treasure(s, time) {
    const { i, j, width, heights } = staircase;
    // Landing and steps share the room's projection and movement heights.
    box(i, j, 2, width, heights[0], P.woodLight, P.wood, P.woodDark);
    for (let step = 2; step < heights.length; step++) {
      box(
        i + step,
        j,
        1,
        width,
        heights[step],
        P.woodLight,
        P.wood,
        P.woodDark,
      );
      surface(i + step, j, heights[step], true, () =>
        rect(2, 2, 3, width * 30 - 4, "#efc994"),
      );
    }
    surface(i, j, heights[0], true, () => {
      rect(2, 2, 56, 2, "#efc994");
      rect(2, width * 30 - 4, 56, 2, "#8e6845");
    });
    const ci = s.i + 0.1,
      cj = s.j + 0.18,
      base = heights[0],
      open = visited.has(s.id),
      p = point(s.i + 0.5, s.j + 0.5);
    ctx.save();
    ctx.translate(0, -base);
    box(ci, cj, 0.85, 0.8, 22, "#c99851", "#94633f", "#704c35");
    surface(ci, cj + 0.8, 22, false, () => {
      rect(1, 1, 24, 2, "#efc969");
      rect(1, 18, 24, 3, "#c9a14d");
      rect(4, 0, 3, 22, "#efc969");
      rect(19, 0, 3, 22, "#efc969");
      rect(10, 6, 7, 9, "#f5d77e");
      rect(12, 9, 3, 4, "#695033");
    });
    if (open) {
      surface(ci, cj, 22, false, () => {
        rect(0, -22, 26, 23, "#81563b");
        rect(2, -20, 22, 19, "#c6a05b");
        rect(4, -18, 3, 16, "#f5d77e");
        rect(19, -18, 3, 16, "#f5d77e");
      });
      surface(ci + 0.3, cj + 0.4, 29, false, () => {
        rect(0, -10, 15, 16, P.paper);
        rect(2, -7, 10, 2, "#c1b99c");
        rect(2, -2, 8, 2, "#c1b99c");
      });
    } else {
      ctx.save();
      ctx.translate(0, -22);
      box(ci, cj, 0.85, 0.8, 6, "#d5aa62", "#bd8b48", "#916a3f");
      ctx.restore();
      surface(ci, cj, 28, true, () => {
        rect(4, 0, 3, 24, "#f5d77e");
        rect(19, 0, 3, 24, "#f5d77e");
      });
    }
    ctx.restore();
    const glow = paused ? 0 : Math.round(Math.sin(time * 0.002) * 2);
    for (const [dx, dy] of [
      [-23, -37],
      [21, -49],
    ]) {
      rect(p.x + dx - 2, p.y - base + dy + glow, 5, 1, "#f7d67c");
      rect(p.x + dx, p.y - base + dy - 2 + glow, 1, 5, "#f7d67c");
    }
    stationLabel(s, p.x - 69, p.y - base - 42, time, { x: p.x, y: p.y - base });
    // A tight stair silhouette avoids stealing clicks from the nearby desk.
    targets.push({
      id: s.id,
      points: [
        [380, 155],
        [440, 185],
        [500, 255],
        [500, 275],
        [458, 296],
        [338, 176],
      ],
    });
  }
  function ladder(s, time) {
    const p = point(s.i + 0.5, s.j + 0.5);
    if (floor === 0) {
      const left = p.x - 34,
        bottom = p.y + 8;
      poly(
        [
          [left, bottom],
          [left + 6, bottom + 3],
          [left + 58, bottom - 135],
          [left + 52, bottom - 138],
        ],
        P.woodDark,
      );
      poly(
        [
          [left + 32, bottom + 16],
          [left + 38, bottom + 19],
          [left + 90, bottom - 119],
          [left + 84, bottom - 122],
        ],
        P.woodDark,
      );
      for (let k = 0; k < 8; k++) {
        const x = left + 5 + k * 7,
          y = bottom - 5 - k * 18;
        poly(
          [
            [x, y],
            [x + 32, y + 16],
            [x + 34, y + 12],
            [x + 2, y - 4],
          ],
          P.woodLight,
        );
      }
      stationLabel(s, p.x + 43, p.y - 143, time, p);
    } else {
      box(s.i - 0.5, s.j - 0.5, 1.3, 1.3, 4, P.woodDark, P.wood, P.woodDark);
      surface(s.i - 0.5, s.j - 0.5, 5, true, () => {
        rect(3, 3, 33, 33, "#203540");
        rect(7, 4, 3, 31, P.woodLight);
        rect(28, 4, 3, 31, P.woodLight);
        for (let k = 0; k < 4; k++) rect(9, 6 + k * 8, 21, 3, P.wood);
      });
      surface(s.i - 0.4, s.j - 0.4, 4, false, () => {
        rect(0, -25, 4, 25, P.woodLight);
        rect(32, -9, 4, 25, P.woodLight);
        poly(
          [
            [0, -25],
            [36, -7],
            [36, -3],
            [0, -21],
          ],
          P.wood,
        );
      });
      stationLabel(s, p.x + 57, p.y - 54, time, { x: p.x, y: p.y + 55 });
    }
  }
  function avatar(time) {
    const p = point(player.i + 0.5, player.j + 0.5),
      bob = player.moving ? Math.round(Math.sin(time * 0.021) * 2) : 0;
    p.y -= playerHeight();
    if (climb) {
      p.x += climb.progress * 45;
      p.y += climb.progress * (floor === 0 ? -120 : 35);
    }
    rect(p.x - 12, p.y - 1, 25, 7, "#a9916c");
    const y = p.y + bob;
    const leg = player.moving ? Math.round(Math.sin(time * 0.021) * 3) : 0;
    // Charcoal jacket, navy shirt, and dark trousers, inspired by the profile portrait.
    rect(p.x - 8, y - 12 + leg, 7, 15, "#293744");
    rect(p.x + 2, y - 12 - leg, 7, 15, "#23303b");
    rect(p.x - 10, y + leg, 10, 5, "#1c252c");
    rect(p.x + 1, y - leg, 11, 5, "#1c252c");
    rect(p.x - 12, y - 34, 25, 24, "#22282d");
    rect(p.x - 5, y - 32, 11, 22, "#30455e");
    rect(p.x - 2, y - 25, 5, 13, "#25384f");
    poly(
      [
        [p.x - 12, y - 33],
        [p.x - 6, y - 34],
        [p.x - 1, y - 24],
        [p.x - 5, y - 16],
        [p.x - 9, y - 25],
      ],
      "#3b4147",
    );
    poly(
      [
        [p.x + 12, y - 33],
        [p.x + 6, y - 34],
        [p.x + 1, y - 24],
        [p.x + 5, y - 16],
        [p.x + 9, y - 25],
      ],
      "#343b42",
    );
    rect(p.x - 17, y - 30 + leg, 6, 16, "#282e33");
    rect(p.x + 13, y - 30 - leg, 6, 16, "#20272c");
    rect(p.x - 17, y - 14 + leg, 6, 5, "#deb186");
    rect(p.x + 13, y - 14 - leg, 6, 5, "#d7a477");
    rect(p.x - 4, y - 38, 10, 8, "#d5a477");
    rect(p.x - 3, y - 33, 8, 3, "#e4b58b");

    // A slightly larger face keeps the clear round glasses readable at room scale.
    rect(p.x - 12, y - 59, 25, 24, "#e9bb8d");
    rect(p.x - 8, y - 36, 18, 4, "#ddb084");
    rect(p.x - 15, y - 48, 4, 8, "#dba97b");
    rect(p.x + 13, y - 48, 4, 8, "#dba97b");
    rect(p.x + 8, y - 53, 5, 15, "#dfad80");
    rect(p.x - 8, y - 54, 13, 12, "#f1c79c");
    rect(p.x - 9, y - 66, 17, 4, "#20272d");
    rect(p.x - 14, y - 63, 27, 8, "#252b30");
    rect(p.x - 16, y - 59, 31, 5, "#292e32");
    rect(p.x - 14, y - 55, 4, 10, "#2b3033");
    rect(p.x + 11, y - 55, 4, 9, "#23292e");
    rect(p.x - 9, y - 55, 4, 5, "#262b30");
    rect(p.x - 3, y - 56, 4, 4, "#262b30");
    rect(p.x + 4, y - 56, 3, 6, "#262b30");
    const lens = (x, top) => {
      rect(x + 2, top, 6, 1, "#56605f");
      rect(x, top + 2, 1, 5, "#56605f");
      rect(x + 9, top + 2, 1, 5, "#56605f");
      rect(x + 1, top + 1, 1, 1, "#56605f");
      rect(x + 8, top + 1, 1, 1, "#56605f");
      rect(x + 1, top + 7, 1, 1, "#56605f");
      rect(x + 8, top + 7, 1, 1, "#56605f");
      rect(x + 2, top + 8, 6, 1, "#56605f");
      rect(x + 2, top + 2, 3, 1, "#f6ddbc");
      rect(x + 4, top + 4, 2, 2, "#30373a");
    };
    lens(p.x - 11, y - 49);
    lens(p.x + 2, y - 49);
    rect(p.x - 1, y - 46, 3, 1, "#56605f");
    rect(p.x - 14, y - 46, 3, 1, "#56605f");
    rect(p.x + 12, y - 46, 3, 1, "#56605f");
    rect(p.x, y - 40, 3, 2, "#cc986f");
    rect(p.x - 4, y - 36, 10, 1, "#a96959");
    rect(p.x - 2, y - 35, 6, 1, "#ca8c72");
    rect(p.x - 24, y - 88, 48, 16, "#f3efdf");
    text("jereme", p.x, y - 76, "#40565a", 9, "center");
  }
  function wallDecor() {
    // Pixel windows on the two back walls, with late-afternoon light.
    poly(
      [
        [312, 80],
        [412, 30],
        [412, 104],
        [312, 154],
      ],
      "#807559",
    );
    poly(
      [
        [319, 83],
        [405, 40],
        [405, 100],
        [319, 143],
      ],
      "#a5c9bf",
    );
    poly(
      [
        [324, 98],
        [400, 60],
        [400, 89],
        [324, 127],
      ],
      "#c2dad0",
    );
    poly(
      [
        [359, 63],
        [365, 60],
        [365, 120],
        [359, 123],
      ],
      "#ede0c0",
    );
    poly(
      [
        [319, 114],
        [405, 71],
        [405, 77],
        [319, 120],
      ],
      "#ede0c0",
    );
    const p = point(1, 1);
    rect(p.x - 18, p.y - 125, 37, 26, P.woodDark);
    rect(p.x - 15, p.y - 122, 31, 20, P.paper);
    text("BUILD", p.x, p.y - 108, P.ink, 9, "center");
    // A quiet wall clock and a tiny plant on the shelf.
    rect(790, 134, 24, 25, P.woodDark);
    rect(793, 137, 18, 19, P.paper);
    rect(801, 141, 2, 8, P.ink);
    rect(802, 148, 5, 2, P.ink);
  }
  function draw(time) {
    ctx.setTransform(view.dpr, 0, 0, view.dpr, 0, 0);
    ctx.imageSmoothingEnabled = false;
    rect(0, 0, view.width, view.height, "#263a45");
    for (let k = 0; k < 60; k++) {
      const x = (k * 137 + 59) % view.width,
        y = (k * 71 + 28) % view.height;
      rect(x, y, 2, k % 4 === 0 ? 4 : 2, "#425862");
    }
    ctx.setTransform(
      view.dpr * view.scale,
      0,
      0,
      view.dpr * view.scale,
      view.dpr * view.x,
      view.dpr * view.y,
    );
    poly(
      [
        [500, 190],
        [888, 384],
        [500, 578],
        [112, 384],
      ],
      "#1c2e37",
    );
    const back = point(0, 0),
      left = point(0, 12),
      right = point(12, 0);
    poly(
      [
        [back.x, back.y - 132],
        [left.x, left.y - 132],
        [left.x, left.y],
        [back.x, back.y],
      ],
      P.wallSide,
    );
    poly(
      [
        [back.x, back.y - 132],
        [right.x, right.y - 132],
        [right.x, right.y],
        [back.x, back.y],
      ],
      P.wall,
    );
    poly(
      [
        [back.x, back.y - 132],
        [left.x, left.y - 132],
        [left.x, left.y - 126],
        [back.x, back.y - 126],
      ],
      "#ab9271",
    );
    poly(
      [
        [back.x, back.y - 132],
        [right.x, right.y - 132],
        [right.x, right.y - 126],
        [back.x, back.y - 126],
      ],
      "#c2aa83",
    );
    for (let k = 1; k < 12; k++) {
      const a = point(0, k),
        b = point(k, 0);
      poly(
        [
          [a.x, a.y - 132],
          [a.x + 1, a.y - 132],
          [a.x + 1, a.y],
          [a.x, a.y],
        ],
        "#c1ad8e",
      );
      poly(
        [
          [b.x, b.y - 132],
          [b.x + 1, b.y - 132],
          [b.x + 1, b.y],
          [b.x, b.y],
        ],
        "#d4c2a3",
      );
    }
    const drawing = {
      ctx,
      P,
      point,
      box,
      surface,
      poly,
      rect,
      text,
      plant,
      monitor,
      keyboard,
      stationLabel,
    };
    if (floor === 0) wallDecor();
    else Bedroom.wallDecor(drawing);
    for (let i = 0; i < 12; i++)
      for (let j = 0; j < 12; j++)
        tile(i, j, (i + j) % 2 ? P.floor : P.floorAlt);
    const l = point(0, 12),
      r = point(12, 0),
      front = point(12, 12);
    poly(
      [
        [l.x, l.y],
        [front.x, front.y],
        [front.x, front.y + 16],
        [l.x, l.y + 16],
      ],
      "#9f805b",
    );
    poly(
      [
        [r.x, r.y],
        [front.x, front.y],
        [front.x, front.y + 16],
        [r.x, r.y + 16],
      ],
      "#bc9c73",
    );
    if (floor === 0) {
      const rug = [point(4, 4), point(8.5, 4), point(8.5, 9), point(4, 9)];
      poly(
        rug.map((p) => [p.x, p.y + 9]),
        "#69918a",
        "#507a73",
      );
      const rugInner = [
        point(4.2, 4.2),
        point(8.3, 4.2),
        point(8.3, 8.8),
        point(4.2, 8.8),
      ];
      poly(
        rugInner.map((p) => [p.x, p.y + 9]),
        "#86aa9a",
        "#bac8ac",
      );
      if (path.length) {
        for (const [i, j] of path) {
          const p = point(i + 0.5, j + 0.5);
          rect(p.x - 2, p.y - 1 - floorHeight(i, j), 4, 4, "#8b7855");
        }
      }
      if (hover === "floor" && mouseTile && walkable(...mouseTile)) {
        tile(...mouseTile, "#ebdaaf");
      }
      // A small couch and coffee table give the room somewhere to simply hang out.
      box(4, 9.3, 2, 1, 24, "#d69878", "#b57761", "#8f5e55");
      box(4, 10, 2, 0.3, 45, "#e3b18d", "#ae7563", "#966053");
      box(4.2, 9.5, 0.75, 0.65, 27, "#e5b395", "#b97c64", "#a3695c");
      box(5.05, 9.5, 0.75, 0.65, 27, "#d6a487", "#b97c64", "#a3695c");
      box(4, 7.8, 1.5, 0.7, 18, "#dbb37a", "#ab8356", "#8e6a4a");
      const cp = point(4.7, 8.1);
      rect(cp.x - 4, cp.y - 25, 11, 9, P.paper);
      rect(cp.x + 6, cp.y - 23, 4, 4, P.paper);
    } else Bedroom.rug(drawing);
    const decorations =
      floor === 0
        ? [
            { i: 0, j: 9 },
            { i: 10, j: 0 },
            { i: 10, j: 10 },
          ].map((s) => ({ depth: s.i + s.j, fn: () => plant(s.i, s.j) }))
        : Bedroom.decorations(drawing);
    const objects = [
      ...activeStations()
        .filter((s) => s.kind !== "social")
        .map((s) => ({
          depth: s.i + s.j,
          fn: () =>
            s.kind === "ladder"
              ? ladder(s, time)
              : s.floor === 1
                ? Bedroom.drawStation(s, time, drawing)
                : { desk, work, arcade, books, mail, treasure }[s.kind](
                    s,
                    time,
                  ),
        })),
      { depth: player.i + player.j, fn: () => avatar(time) },
      ...decorations,
    ];
    targets = [];
    objects.sort((a, b) => a.depth - b.depth).forEach((obj) => obj.fn());
    if (floor === 0)
      stations.filter((s) => s.kind === "social").forEach(socialFrame);
    drawMini();
  }
  function drawMini() {
    mc.imageSmoothingEnabled = false;
    mc.fillStyle = "#dedac8";
    mc.fillRect(0, 0, 112, 112);
    for (let i = 0; i < 12; i++)
      for (let j = 0; j < 12; j++) {
        mc.fillStyle = walkable(i, j)
          ? (i + j) % 2
            ? "#c7c5ad"
            : "#ceccb7"
          : "#a8ad9a";
        mc.fillRect(8 + i * 8, 8 + j * 8, 7, 7);
      }
    for (const s of activeStations()) {
      mc.fillStyle =
        s.kind === "ladder"
          ? "#688da0"
          : visited.has(s.id)
            ? "#779b74"
            : "#c48b3d";
      mc.fillRect(8 + s.i * 8, 8 + s.j * 8, 7, 7);
    }
    mc.fillStyle = "#277964";
    mc.fillRect(
      8 + Math.round(player.i) * 8,
      8 + Math.round(player.j) * 8,
      7,
      7,
    );
  }
  let mouseTile = null;
  function canvasPoint(event) {
    const r = canvas.getBoundingClientRect();
    return {
      x: (event.clientX - r.left - view.x) / view.scale,
      y: (event.clientY - r.top - view.y) / view.scale,
    };
  }
  function gridAt(p) {
    const x = (p.x - 500) / 30,
      y = (p.y - 155) / 15;
    return [Math.floor((x + y) / 2), Math.floor((y - x) / 2)];
  }
  function hit(p) {
    return [...targets].reverse().find((t) => {
      if (!t.points)
        return p.x >= t.x && p.x <= t.x + t.w && p.y >= t.y && p.y <= t.y + t.h;
      let inside = false;
      for (let i = 0, j = t.points.length - 1; i < t.points.length; j = i++) {
        const [xi, yi] = t.points[i],
          [xj, yj] = t.points[j];
        if (
          yi > p.y !== yj > p.y &&
          p.x < ((xj - xi) * (p.y - yi)) / (yj - yi) + xi
        )
          inside = !inside;
      }
      return inside;
    });
  }
  let drag = null,
    suppressClick = false;
  canvas.addEventListener("pointerdown", (event) => {
    drag = {
      x: event.clientX,
      y: event.clientY,
      startX: view.x,
      startY: view.y,
      moved: false,
    };
    suppressClick = false;
    canvas.setPointerCapture(event.pointerId);
  });
  canvas.addEventListener("pointermove", (event) => {
    if (
      drag &&
      (drag.moved ||
        Math.hypot(event.clientX - drag.x, event.clientY - drag.y) > 7)
    ) {
      drag.moved = true;
      view.x = Math.max(
        60 - 860 * view.scale,
        Math.min(
          view.width - 60 - 140 * view.scale,
          drag.startX + event.clientX - drag.x,
        ),
      );
      view.y = Math.max(
        70 - 540 * view.scale,
        Math.min(
          view.height - 80 - 25 * view.scale,
          drag.startY + event.clientY - drag.y,
        ),
      );
      hover = null;
      mouseTile = null;
      canvas.style.cursor = "grabbing";
      return;
    }
    const p = canvasPoint(event),
      target = hit(p);
    mouseTile = gridAt(p);
    hover = target ? target.id : "floor";
    canvas.style.cursor = target ? "pointer" : "crosshair";
  });
  canvas.addEventListener("pointerup", () => {
    suppressClick = Boolean(drag?.moved);
    drag = null;
  });
  canvas.addEventListener("pointercancel", () => {
    suppressClick = true;
    drag = null;
  });
  canvas.addEventListener("pointerleave", () => {
    hover = null;
    mouseTile = null;
  });
  canvas.addEventListener("click", (event) => {
    if (climb) return;
    if (suppressClick) {
      suppressClick = false;
      return;
    }
    setDirectory(false);
    canvas.focus({ preventScroll: true });
    const p = canvasPoint(event),
      target = hit(p);
    if (target) {
      const s = findStation(target.id);
      afterClimb = null;
      if (document.querySelector(`a[data-link="${s.id}"]`))
        activateStation(s.id);
      else navigate(...s.access, s.id);
    } else {
      const [i, j] = gridAt(p);
      if (walkable(i, j)) navigate(i, j);
    }
  });
  canvas.addEventListener("keydown", (event) => {
    if (dialog.open || climb) return;
    if (["e", "E", "Enter", " "].includes(event.key)) {
      event.preventDefault();
      const s = nearby();
      if (s) activateStation(s.id);
      else
        status.textContent =
          "Walk closer to an object, or choose a topic in the directory.";
      return;
    }
    const moves = {
      ArrowUp: [-1, 0],
      w: [-1, 0],
      W: [-1, 0],
      ArrowDown: [1, 0],
      s: [1, 0],
      S: [1, 0],
      ArrowLeft: [0, 1],
      a: [0, 1],
      A: [0, 1],
      ArrowRight: [0, -1],
      d: [0, -1],
      D: [0, -1],
    };
    if (moves[event.key]) {
      event.preventDefault();
      if (player.moving) return;
      const [di, dj] = moves[event.key],
        i = player.i + di,
        j = player.j + dj;
      if (canStep(player.i, player.j, i, j)) navigate(i, j);
    }
  });
  function frame(time) {
    const dt = Math.min(50, time - lastTime || 16);
    lastTime = time;
    if (!paused) clock += dt;
    if (climb) {
      climb.progress = Math.min(1, climb.progress + dt / 650);
      if (climb.progress === 1) finishClimb();
    } else if (!dialog.open) {
      if (!player.moving && path.length) {
        const [i, j] = path.shift();
        player.fromI = player.i;
        player.fromJ = player.j;
        player.toI = i;
        player.toJ = j;
        player.progress = 0;
        player.moving = true;
      }
      if (player.moving) {
        player.progress = Math.min(1, player.progress + dt / 160);
        player.i = player.fromI + (player.toI - player.fromI) * player.progress;
        player.j = player.fromJ + (player.toJ - player.fromJ) * player.progress;
        if (player.progress === 1) {
          player.i = player.toI;
          player.j = player.toJ;
          player.moving = false;
          if (!path.length) arrived();
        }
      }
    }
    draw(clock);
    requestAnimationFrame(frame);
  }
  // Expose read-only position through the canvas for inspectable controls and QA.
  canvas.dataset.floor = "studio";
  setInterval(() => {
    canvas.dataset.position = `${Math.round(player.i)},${Math.round(player.j)}`;
  }, 200);
  requestAnimationFrame(frame);
})();
