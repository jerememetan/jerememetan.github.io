(() => {
  "use strict";
  const stations = [
    {
      id: "experience",
      name: "Experience",
      i: 3,
      j: 1,
      access: [3, 2],
      kind: "career",
      number: "09",
      floor: 1,
    },
    {
      id: "skills",
      name: "Skills",
      i: 8,
      j: 2,
      access: [8, 3],
      kind: "skills",
      number: "10",
      floor: 1,
    },
  ];
  const blocked = new Set([
    "0,3",
    "1,3",
    "0,4",
    "1,4",
    "2,1",
    "3,1",
    "4,1",
    "7,1",
    "8,1",
    "7,2",
    "8,2",
    "1,6",
    "2,6",
    "3,6",
    "1,7",
    "2,7",
    "3,7",
    "1,8",
    "2,8",
    "3,8",
    "1,9",
    "2,9",
    "3,9",
    "4,8",
    "0,10",
    "10,10",
  ]);
  const careers = [
    {
      role: "Teaching Assistant",
      company: "Singapore Management University",
      date: "Aug 2026 – Present",
      detail: "Web Application Development II",
      points: [
        "Code reviews and technical feedback for 50+ students, helping improve the structure of their web applications.",
        "Explaining technical concepts across different experience levels and supporting class technical operations.",
      ],
    },
    {
      role: "AI Engineer Intern",
      company: "Alphatok Technologies",
      date: "May 2026 – Aug 2026",
      points: [
        "Built multi-agent workflows and state-management loops with LangGraph and TypeScript, integrating AI into production applications.",
        "Worked on LLM knowledge-base infrastructure for context retrieval, prompt orchestration and agent-state handling across services.",
        "Wrote 10+ technical and architecture guides to support documentation and team onboarding.",
      ],
    },
    {
      role: "Coding Mentor",
      company: "Coder’s Assembly",
      date: "Aug 2025 – Nov 2025",
      points: [
        "Mentored university students in Python. More than 60% of my mentees achieved an A− or above.",
      ],
    },
    {
      role: "Coding Instructor",
      company: "Kodecoon Academy",
      date: "Jan 2025 – May 2026",
      points: [
        "Taught coding and STEM to learners aged 5–12, including robotics, Python, Scratch and web/mobile development.",
      ],
    },
  ];
  const groups = [
    {
      name: "Languages",
      items: [
        ["TypeScript", "typescript"],
        ["JavaScript", "javascript"],
        ["Python", "python"],
        ["Java", "java"],
        ["C", "c"],
        ["SQL", "sql"],
      ],
    },
    {
      name: "Frameworks &amp; tools",
      items: [
        ["LangGraph", "langgraph"],
        ["React", "react"],
        ["Vue", "vuejs"],
        ["JavaFX", "java"],
        ["Supabase", "supabase"],
        ["Git", "git"],
        ["GitHub", "github"],
      ],
    },
  ];
  const contents = {
    experience: {
      category: "09 / THE EXPERIENCE WALL",
      title: "The journey so far.",
      body: `<p class="lead">Building software. Sharing what I learn.</p><ol class="career-timeline">${careers.map((job) => `<li><span class="career-date">${job.date} · Singapore</span><h3>${job.role}</h3><p class="career-company">${job.company}${job.detail ? `<span>${job.detail}</span>` : ""}</p><ul>${job.points.map((point) => `<li>${point}</li>`).join("")}</ul></li>`).join("")}</ol>`,
    },
    skills: {
      category: "10 / THE SKILLS WORKBENCH",
      title: "My building toolkit.",
      body: `<p class="lead">The tools I use to turn ideas into useful applications.</p>${groups.map((group) => `<section class="skill-group"><h3>${group.name}</h3><ul class="tech-stack">${group.items.map(([name, icon]) => `<li><img src="assets/tech/${icon}.svg" width="24" height="24" alt="">${name}</li>`).join("")}</ul></section>`).join("")}<section class="skill-group"><h3>AI applications</h3><ul class="ai-skills"><li>LLM applications</li><li>Multi-agent workflows</li><li>Prompt orchestration</li><li>Context retrieval</li></ul><p>My favourite part is connecting these pieces to automate repetitive work and make everyday life easier.</p></section>`,
    },
  };
  function shelf(a, i, j) {
    const { box, surface, rect, P } = a;
    box(i, j, 1.8, 0.8, 78, P.woodLight, P.wood, P.woodDark);
    surface(i, j + 0.8, 78, false, () => {
      rect(3, 3, 48, 70, P.woodDark);
      const colors = [P.teal, P.paper, P.pink, P.yellow, "#6d8898", P.mint];
      for (let row = 0; row < 3; row++) {
        const bottom = 24 + row * 23;
        for (let k = 0; k < 6; k++) {
          const height = 17 - (k % 3) * 3;
          rect(5 + k * 7, bottom - height, 5, height, colors[(k + row) % 6]);
          rect(6 + k * 7, bottom - height + 3, 3, 1, P.paper);
        }
        rect(0, bottom, 54, 4, P.woodLight);
      }
      rect(0, 0, 3, 78, P.woodLight);
      rect(51, 0, 3, 78, P.woodLight);
    });
  }
  function bed(a) {
    const { box, surface, rect, P } = a;
    box(1.1, 6.5, 2.4, 3.2, 20, P.woodLight, P.wood, P.woodDark);
    box(1.15, 6.5, 2.3, 0.18, 49, P.woodLight, P.wood, P.woodDark);
    box(1.25, 6.8, 2.1, 2.7, 27, P.paper, "#c8c6ae", "#aaae9b");
    box(1.35, 7.65, 1.9, 1.85, 32, P.teal, "#4b7871", "#365d5d");
    surface(1.35, 7.65, 32, true, () => {
      rect(2, 2, 53, 5, P.mint);
      for (let k = 0; k < 6; k++) rect(5 + k * 9, 48, 3, 5, "#88b2a0");
    });
    // Pillows are shallow cushions resting on the mattress, not floor-height boxes.
    a.ctx.save();
    a.ctx.translate(0, -27);
    box(1.4, 6.95, 0.7, 0.48, 6, P.paper, "#dbd8be", "#b8bead");
    box(2.4, 6.95, 0.7, 0.48, 6, P.paper, "#dbd8be", "#b8bead");
    a.ctx.restore();
    box(3.85, 7.75, 0.85, 0.85, 30, P.woodLight, P.wood, P.woodDark);
    surface(3.85, 8.6, 30, false, () => {
      rect(4, 6, 17, 2, "#8e684b");
      rect(11, 10, 5, 2, P.yellow);
    });
    surface(4.25, 8.15, 30, true, () => rect(-7, -5, 14, 10, "#94764e"));
    surface(4.25, 8.15, 30, false, () => {
      rect(-2, -23, 4, 23, P.woodDark);
      rect(-10, -35, 20, 14, P.yellow);
      rect(-7, -32, 14, 4, "#ffe8b0");
    });
  }
  function decorations(a) {
    return [
      { depth: 4, fn: () => shelf(a, 0.3, 3) },
      { depth: 10, fn: () => bed(a) },
      { depth: 10, fn: () => a.plant(0, 10) },
      { depth: 20, fn: () => a.plant(10, 10) },
      {
        depth: 5,
        fn: () => {
          const { box, surface, rect, P } = a;
          box(0.3, 5.1, 1, 1, 24, P.woodLight, P.wood, P.woodDark);
          surface(0.8, 5.6, 24, true, () => {
            rect(-10, -8, 20, 16, P.pink);
            rect(-8, -6, 16, 12, P.paper);
            rect(-6, -4, 8, 2, P.teal);
          });
        },
      },
    ];
  }
  function wallDecor(a) {
    const { poly, rect, text, P } = a;
    poly(
      [
        [305, 83],
        [411, 30],
        [411, 110],
        [305, 163],
      ],
      P.woodDark,
    );
    poly(
      [
        [311, 86],
        [405, 39],
        [405, 106],
        [311, 153],
      ],
      "#486476",
    );
    poly(
      [
        [317, 105],
        [399, 64],
        [399, 96],
        [317, 137],
      ],
      "#688590",
    );
    poly(
      [
        [387, 53],
        [397, 48],
        [397, 59],
        [387, 64],
      ],
      P.paper,
    );
    poly(
      [
        [353, 65],
        [359, 62],
        [359, 135],
        [353, 138],
      ],
      P.paper,
    );
    poly(
      [
        [310, 123],
        [405, 75],
        [405, 81],
        [310, 129],
      ],
      P.paper,
    );
    // Small curtains hang on the same wall plane as the window.
    poly(
      [
        [299, 78],
        [317, 69],
        [317, 148],
        [307, 145],
        [299, 158],
      ],
      P.pink,
    );
    poly(
      [
        [399, 28],
        [417, 19],
        [417, 100],
        [409, 115],
        [399, 108],
      ],
      P.pink,
    );
    rect(488, 58, 28, 23, P.woodDark);
    rect(491, 61, 22, 17, P.paper);
    text("Z z", 502, 74, P.teal, 10, "center");
    // Floating shelf and books above the desk, aligned to the wall.
    a.surface(7.4, 0.1, 100, false, () => {
      rect(-5, 0, 74, 5, P.woodLight);
      for (let k = 0; k < 5; k++) {
        rect(
          k * 9,
          -21 + (k % 2) * 3,
          7,
          21 - (k % 2) * 3,
          [P.teal, P.pink, P.paper, P.yellow, P.mint][k],
        );
        rect(k * 9 + 2, -16 + (k % 2) * 3, 3, 1, P.paper);
      }
      rect(53, -12, 12, 12, P.wood);
      rect(58, -28, 3, 16, "#61855a");
      rect(49, -30, 11, 8, "#8faa71");
      rect(59, -34, 10, 8, "#77945f");
    });
  }
  function rug(a) {
    const p = [a.point(5, 5), a.point(9, 5), a.point(9, 9), a.point(5, 9)];
    a.poly(
      p.map((v) => [v.x, v.y + 5]),
      "#a67f78",
    );
    const q = [
      a.point(5.25, 5.25),
      a.point(8.75, 5.25),
      a.point(8.75, 8.75),
      a.point(5.25, 8.75),
    ];
    a.poly(
      q.map((v) => [v.x, v.y + 5]),
      "#d6a995",
      "#efd0af",
    );
    a.surface(6.4, 6.4, -5, true, () => {
      a.rect(0, 0, 35, 35, "#c39584");
      a.rect(8, 8, 19, 19, "#efd0af");
      a.rect(14, 14, 7, 7, "#9f8276");
    });
  }
  function drawStation(s, time, a) {
    const { point, box, surface, rect, text, P, stationLabel } = a,
      p = point(s.i + 0.5, s.j + 0.5);
    if (s.kind === "career") {
      box(
        s.i - 0.9,
        s.j + 0.15,
        2.4,
        0.18,
        100,
        P.woodLight,
        P.wood,
        P.woodDark,
      );
      surface(s.i - 0.9, s.j + 0.33, 100, false, () => {
        rect(4, 4, 64, 86, "#e7d3a7");
        text("MY JOURNEY", 36, 19, P.ink, 7, "center");
        rect(13, 29, 2, 48, P.teal);
        for (let k = 0; k < 3; k++) {
          rect(10, 30 + k * 21, 8, 8, P.yellow);
          rect(25, 29 + k * 21, 32, 12, P.paper);
          rect(28, 32 + k * 21, 24, 2, P.teal);
          rect(28, 36 + k * 21, 18, 1, "#9caa91");
        }
      });
      stationLabel(s, p.x, p.y - 145, time, p);
    } else {
      box(s.i - 1, s.j - 0.5, 2.5, 1.1, 40, P.woodLight, P.wood, P.woodDark);
      a.monitor(s.i - 0.15, s.j - 0.3, 40, 43, P.deep, "< / >");
      a.keyboard(s.i - 0.05, s.j + 0.25, 40, 30);
      surface(s.i + 0.8, s.j + 0.1, 40, true, () => {
        rect(-6, -5, 12, 10, P.paper);
        rect(-4, -3, 8, 2, P.teal);
        rect(-4, 1, 5, 1, P.teal);
      });
      box(s.i + 0.15, s.j + 1.1, 0.75, 0.75, 20, P.teal, "#4b7871", "#365d5d");
      stationLabel(s, p.x, p.y - 125, time, p);
    }
  }
  window.Bedroom = {
    stations,
    blocked,
    contents,
    decorations,
    wallDecor,
    rug,
    drawStation,
  };
})();
