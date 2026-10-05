(() => {
  "use strict";
  const github = "https://github.com/jerememetan/";
  const tech = {
    python: ["Python", "python"],
    react: ["React", "react"],
    typescript: ["TypeScript", "typescript"],
    vue: ["Vue", "vuejs"],
    java: ["Java / Swing", "java"],
    spring: ["Spring Boot", "spring"],
    rust: ["Rust", "rust"],
    c: ["C", "c"],
    lua: ["Lua", "lua"],
    vite: ["Vite", "vitejs"],
    supabase: ["Supabase", "supabase"],
    bootstrap: ["Bootstrap", "bootstrap"],
    next: ["Next.js", "nextjs"],
    opencv: ["OpenCV", "opencv"],
    postgres: ["PostgreSQL", "postgresql"],
    flask: ["Flask", "flask"],
    fastapi: ["FastAPI", "fastapi"],
    expo: ["Expo", "expo"],
    sqlite: ["SQLite", "sqlite"],
    docker: ["Docker", "docker"],
    langgraph: ["LangGraph", "langgraph"],
    alibaba: ["Alibaba Cloud", "alibabacloud"],
    ollama: ["Ollama", "ollama"],
    lovable: ["Lovable", "lovable"],
    reactnative: ["React Native", "react"],
    javacore: ["Java", "java"],
    tailwind: ["Tailwind CSS", "tailwindcss"],
    tanstack: ["TanStack Start", "tanstack"],
  };
  const catalog = [
    {
      id: "emerald-expansion",
      name: "Pokémon Emerald expansion",
      year: 2024,
      period: "ongoing",
      tags: ["games"],
      badge: "Ongoing",
      summary:
        "Emerald Gauntlet: my ongoing Pokémon Emerald ROM hack, built for challenging Nuzlocke runs.",
      detail:
        "Started in 2024 and still evolving whenever I have free time. Emerald Gauntlet adds one-way battle gauntlets, tougher trainer encounters, and modern Pokémon mechanics using RH Hideout’s pokeemerald-expansion base. This is my custom game work, not a claim to have authored the upstream engine. It runs in a GBA emulator; the EmeraldLLM integration is a separate August 2026 experiment below.",
      cover: {
        src: "assets/projects/emerald-gauntlet/HomeScreen.png",
        width: 955,
        height: 636,
        alt: "Emerald Gauntlet title screen",
        caption: "Emerald Gauntlet",
        pixel: true,
      },
      media: [
        {
          src: "assets/projects/emerald-gauntlet/MegaEvo.gif",
          width: 400,
          height: 263,
          alt: "Mega Evolution battle animation in Emerald Gauntlet",
          caption: "Mega Evolution",
          pixel: true,
          animated: true,
        },
      ],
      stack: ["c"],
      repo: github + "pokeemerald-expansion",
      project: github + "Emerald-Gauntlet",
    },
    {
      id: "sussornot",
      name: "SussOrNot",
      year: 2024,
      period: "late",
      tags: ["apps", "ai"],
      badge: "Hackathon winner",
      summary:
        "An AI-powered browser-extension project for spotting potential e-commerce scams.",
      detail:
        "Built with a team for the 2024 SMU LIT hackathon, which we won. The repository brings together a React frontend, Internet Computer components, and counterfeit/phishing detection model experiments.",
      cover: {
        src: "assets/projects/sussornot/team-photo.jpg",
        width: 958,
        height: 1280,
        alt: "SussOrNot team holding trophies at the hackathon",
        caption: "SussOrNot · hackathon team",
        pixel: false,
      },
      stack: ["react", "typescript", "python", "rust"],
      repo: github + "SMULIT_HACKATHON_2024_nicetoemeetyou_SussOrNot",
    },
    {
      id: "peddit",
      name: "Peddit",
      year: 2025,
      period: "late",
      tags: ["apps"],
      badge: "A+ · WAD II",
      summary:
        "A pet social network with health, nutrition, and community features.",
      detail:
        "Our Web Application Development II project earned an A+. I worked on UI design and the social features, including the community experience. The broader team also built pet-health, recipe, maps, and chatbot features.",
      cover: {
        src: "assets/projects/peddit/logo.png",
        width: 500,
        height: 500,
        alt: "Peddit blue paw logo",
        caption: "Peddit · the paw behind the project",
        pixel: false,
      },
      media: [
        {
          src: "assets/projects/peddit/create-pet.png",
          width: 1280,
          height: 608,
          alt: "Peddit pet creation screen with dog and cat choices",
          caption: "Create your pet",
          pixel: false,
        },
        {
          src: "assets/projects/peddit/shared-meal-plans.png",
          width: 1834,
          height: 912,
          alt: "Peddit popular and community-shared meal plans",
          caption: "Popular & community-shared meal plans",
          pixel: false,
        },
        {
          src: "assets/projects/peddit/grocery-checklist.png",
          width: 1920,
          height: 910,
          alt: "Peddit grocery checklist for meal ingredients",
          caption: "My grocery checklist",
          pixel: false,
        },
      ],
      stack: ["vue", "vite", "supabase", "bootstrap"],
      repo: github + "Peddit",
      demo: "https://peddit-coral.vercel.app/",
    },
    {
      id: "face-recognition",
      name: "FaceRecognition",
      year: 2025,
      period: "late",
      tags: ["apps", "ai"],
      badge: "A+ · Course project",
      summary: "Automating attendance marking with face-recognition models.",
      detail:
        "A Java desktop project that earned an A+. It combines live camera recognition with student, session, roster, and reporting workflows. The current repository uses Swing for its interface and OpenCV with ArcFace model tooling.",
      cover: {
        src: "assets/projects/face-recognition/face-capture-demo.jpg",
        width: 976,
        height: 659,
        alt: "Java face-capture demo detecting Jereme with adjustable detection settings",
        caption: "Face capture & detection tuning",
        pixel: false,
      },
      stack: ["java", "opencv"],
      repo: github + "FaceRecognitionCS102",
    },
    {
      id: "letmesignuppls",
      name: "LetMeSignUpPls",
      year: 2025,
      period: "late",
      tags: ["apps", "games"],
      badge: "Just for fun",
      summary:
        "A playful puzzle game built around trying to sign up and log in.",
      detail:
        "A small personal project that turns an everyday interface into something deliberately playful. Built with Vue, Vite, and Supabase.",
      cover: {
        src: "assets/projects/letmesignuppls/login.png",
        width: 1280,
        height: 641,
        alt: "LetMeSignUpPls login screen with a cat using a laptop",
        caption: "Let me log in!",
        pixel: false,
      },
      media: [
        {
          src: "assets/projects/letmesignuppls/delete-account-puzzle.png",
          width: 1280,
          height: 598,
          alt: "LetMeSignUpPls account deletion puzzle with decoy delete buttons",
          caption: "Find the real delete button",
          pixel: false,
        },
        {
          src: "assets/projects/letmesignuppls/premium-popups.png",
          width: 800,
          height: 662,
          alt: "LetMeSignUpPls overlapping joke premium subscription pop-ups",
          caption: "Premium pop-up chaos",
          pixel: false,
        },
      ],
      stack: ["vue", "vite", "supabase"],
      repo: github + "LetMeSignUpPls",
      demo: "https://jerememetan.github.io/LetMeSignUpPls/login",
    },
    {
      id: "gameshub",
      name: "GamesHub",
      year: 2025,
      period: "late",
      tags: ["games"],
      badge: "AI-assisted build",
      summary: "A game hub with Flappy Bird and a roguelike take on Snake.",
      detail:
        "An experiment in shipping a full application with AI-assisted development. The games include progression, power-ups, cosmetics, and high-score tracking.",
      cover: {
        src: "assets/projects/gameshub/snake-game.png",
        width: 1690,
        height: 1007,
        alt: "GamesHub Snake game showing a level-two game-over screen",
        caption: "Snake · levels & high scores",
        pixel: false,
      },
      stack: ["react", "next", "typescript"],
      repo: github + "GamesHub",
      demo: "https://jeremevibecode.vercel.app",
    },
    {
      id: "safepassage",
      name: "SafePassage",
      year: 2026,
      period: "early",
      tags: ["apps", "ai"],
      badge: "Web + mobile",
      summary:
        "An AI travel-safety companion that assesses risks from itinerary plans.",
      detail:
        "A web and mobile project exploring AI-powered itinerary analysis and traveler safety. The repository also documents offline-first storage, connectivity monitoring, and emergency-response workflows.",
      stack: [
        "reactnative",
        "expo",
        "typescript",
        "python",
        "flask",
        "supabase",
      ],
      repo: github + "safe-passage",
    },
    {
      id: "alphaca",
      name: "Alphaca",
      year: 2026,
      period: "early",
      tags: ["apps", "ai"],
      badge: "UBS Award",
      award: true,
      summary: "Duolingo-inspired learning for Gen Alpha language and culture.",
      contribution:
        "My proudest contribution was building the games feature and making our Gen Alpha translator work with the terms and definitions in our glossary. Bringing those features into the same learning experience was the part of Alphaca I was most proud of.",
      detail:
        "Our team received the UBS-SMU-X Collaborative Software Development Outstanding Project Award. Alphaca combines lessons, a glossary, community content, quiz battles, and AI-assisted language conversion and moderation.",
      cover: {
        src: "assets/projects/alphaca/logo.png",
        width: 315,
        height: 421,
        alt: "Alphaca geometric alpaca logo",
        caption: "Alphaca · our project logo",
        pixel: false,
      },
      media: [
        {
          src: "assets/projects/alphaca/glossary.png",
          width: 800,
          height: 406,
          alt: "Alphaca glossary entry for Gen Alpha slang with definition and AI confidence",
          caption: "The Gen Alpha glossary",
          pixel: false,
        },
        {
          src: "assets/projects/alphaca/team-dinner.png",
          width: 964,
          height: 1280,
          alt: "Alphaca team enjoying dinner together",
          caption: "Team dinner",
          pixel: false,
        },
        {
          src: "assets/projects/alphaca/ubs-team.png",
          width: 480,
          height: 427,
          alt: "Alphaca team at the UBS project showcase booth",
          caption: "Our team at the UBS showcase",
          pixel: false,
        },
      ],
      stack: ["vue", "javacore", "spring", "postgres", "supabase"],
      repo: github + "Alphaca",
    },
    {
      id: "skribbl-clone",
      name: "Skribbl clone",
      year: 2026,
      period: "early",
      tags: ["games", "ai"],
      badge: "Built with Lovable",
      summary:
        "A multiplayer drawing-and-guessing game with an AI practice mode.",
      detail:
        "Built with Lovable, React, TypeScript, Vite, Tailwind CSS, and Supabase. Players draw, guess, and chat in multiplayer rooms, with realtime game state and drawing updates. In solo practice, an AI tries to guess your drawings against the clock. Source code is private.",
      cover: {
        src: "assets/projects/skribbl-clone/lobby.png",
        width: 978,
        height: 602,
        alt: "SkribblTwo lobby with nickname, room and AI practice options",
        caption: "SkribblTwo · pick a nickname & jump in",
        pixel: false,
      },
      media: [
        {
          src: "assets/projects/skribbl-clone/drawing-round.png",
          width: 952,
          height: 597,
          alt: "SkribblTwo multiplayer drawing round with leaderboard and guesses",
          caption: "Draw, guess & climb the leaderboard",
          pixel: false,
        },
        {
          src: "assets/projects/skribbl-clone/flag-round.png",
          width: 927,
          height: 597,
          alt: "SkribblTwo flag drawing round with colour palette and chat",
          caption: "A flag, a palette & some questionable guesses",
          pixel: false,
        },
      ],
      stack: ["lovable", "react", "typescript", "vite", "tailwind", "supabase"],
    },
    {
      id: "qwenchana",
      name: "QwenChaNa Medias",
      year: 2026,
      period: "mid",
      tags: ["apps", "ai"],
      badge: "Alibaba Cloud hackathon",
      summary:
        "A multi-agent workflow that turns a prompt into a short-form video.",
      detail:
        "Built for an Alibaba Cloud hackathon. Director, research, script, storyboard, video, voice, and editing agents collaborate through a LangGraph workflow. A React workspace fronts the Python/FastAPI backend and Alibaba model integrations.",
      stack: [
        "python",
        "react",
        "typescript",
        "fastapi",
        "langgraph",
        "alibaba",
      ],
      repo: github + "QwenChaNa-Medias",
    },
    {
      id: "draftleaguebot",
      name: "DraftLeagueBot",
      year: 2026,
      period: "mid",
      tags: ["games"],
      badge: "Battle bot",
      summary: "A Pokémon Showdown opponent you can challenge and battle.",
      video: { id: "4U4MvIfw7oI", title: "DraftLeagueBot demo" },
      detail:
        "I built DraftLeagueBot after playing in a Pokémon draft league hosted by the SMU Pokémon community. It started as a passion project: a bot I could battle to practise my matchups, and something other players could practise too. Built with Python and poke-env, it supports team selection and multiple battle formats. More recently, I got it running on the live Pokémon Showdown server and put it to the test as the Electric Gym Leader. The result? 7 losses and 1 win—not exactly an unbeatable gym, but a fun way to bring the project into the community.",
      stack: ["python"],
      repo: github + "DraftLeagueBot",
    },
    {
      id: "pokedraft-train",
      name: "Pokédraft Train",
      year: 2026,
      period: "mid",
      tags: ["games", "ai"],
      badge: "Built with Lovable",
      summary: "An AI coach for preparing Pokémon draft-league matchups.",
      detail:
        "Enter your roster and your opponent’s to generate a team of six, movesets, threat analysis, and a game plan for Pokémon Showdown. Built with Lovable, React, TypeScript, TanStack Start, Vite, and Tailwind CSS. The AI workflow uses Pokémon-data and team-validation tools, and supports refining the team with your feedback. Source code is private.",
      stack: ["lovable", "react", "typescript", "tanstack", "vite", "tailwind"],
    },
    {
      id: "emeraldllm",
      name: "EmeraldLLM",
      year: 2026,
      period: "mid",
      month: "August 2026",
      tags: ["games", "ai"],
      badge: "Local LLM + tools",
      summary:
        "An LLM-powered trainer that uses tools to battle you inside Pokémon Emerald.",
      video: { id: "Ypt83Bot3fk", title: "EmeraldLLM demo" },
      detail:
        "Started in August 2026 as a separate branch of my Emerald game work. A Python service connects a local Ollama model to a Lua/mGBA bridge and the C game code. The model inspects battle state and chooses legal moves or switches, with ordinary trainer AI as a fallback.",
      stack: ["c", "python", "lua", "ollama"],
      repo: github + "pokeemerald-expansion/tree/LLM-Integration-trainer",
    },
  ];
  const periods = {
    ongoing: ["Started in 2024", "Ongoing work"],
    early: ["Early year", "January – April"],
    mid: ["Mid-year", "May – August"],
    late: ["Late year", "September – December"],
  };
  const escape = (value) =>
    String(value).replace(
      /[&<>"']/g,
      (char) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[char],
    );
  function technologyList(stack) {
    if (!stack.length)
      return '<span class="stack-unconfirmed">Tech stack to confirm</span>';
    return `<ul class="tech-stack" aria-label="Technology stack">${stack
      .map((key) => {
        const [label, icon] = tech[key];
        return `<li><img src="assets/tech/${icon}.svg" width="20" height="20" alt="" aria-hidden="true"><span>${escape(label)}</span></li>`;
      })
      .join("")}</ul>`;
  }
  function mediaFigure(media, id) {
    const classes = `project-media${media.pixel ? " pixel-art" : ""}`;
    if (media.animated) {
      return `<figure class="${classes}"><div class="animation-stage" style="aspect-ratio:${media.width}/${media.height}">
        <img id="${id}" data-animated-src="${escape(media.src)}" width="${media.width}" height="${media.height}" alt="${escape(media.alt)}" hidden>
        <button type="button" class="animation-play" data-play-animation data-animation-label="${escape(media.caption)}" aria-controls="${id}" aria-pressed="false">▶ Play ${escape(media.caption)} GIF</button>
      </div><figcaption>${escape(media.caption)} · animated GIF <a href="${escape(media.src)}" target="_blank" rel="noopener noreferrer">Full size ↗<span class="sr-only"> — ${escape(media.caption)}</span></a></figcaption></figure>`;
    }
    return `<figure class="${classes}"><a class="media-open" href="${escape(media.src)}" target="_blank" rel="noopener noreferrer" aria-label="Open ${escape(media.alt)} in full size"><img src="${escape(media.src)}" width="${media.width}" height="${media.height}" loading="lazy" decoding="async" alt="${escape(media.alt)}"></a><figcaption>${escape(media.caption)} <span>Click to view full size ↗</span></figcaption></figure>`;
  }
  function projectLinks(project) {
    const link = (url, label, primary = false) =>
      `<a${primary ? ' class="project-action"' : ""} href="${escape(url)}" target="_blank" rel="noopener noreferrer">${label} ↗<span class="sr-only"> — ${escape(project.name)}</span></a>`;
    const links = [
      project.demo ? link(project.demo, "Open app", true) : "",
      project.video
        ? link(`https://youtu.be/${project.video.id}`, "Open on YouTube", true)
        : "",
      project.project ? link(project.project, "View project", true) : "",
      project.repo
        ? link(project.repo, project.project ? "Source code" : "GitHub")
        : "",
    ].join("");
    return links ? `<div class="project-links">${links}</div>` : "";
  }
  function videoFigure(video, id) {
    const src = `https://www.youtube-nocookie.com/embed/${video.id}?autoplay=0&controls=1&playsinline=1&rel=0`;
    return `<figure class="project-media project-video"><div class="project-video-stage">
      <button type="button" class="video-load" data-load-video aria-controls="${id}" aria-label="Load ${escape(video.title)} from YouTube"><img src="https://i.ytimg.com/vi/${escape(video.id)}/hqdefault.jpg" width="480" height="360" loading="lazy" alt=""><span>▶ Load video</span></button>
      <iframe id="${id}" data-video-src="${escape(src)}" title="${escape(video.title)}" allow="encrypted-media; picture-in-picture; fullscreen" allowfullscreen referrerpolicy="strict-origin-when-cross-origin" hidden></iframe>
    </div><figcaption>${escape(video.title)} <span>Loads YouTube when clicked · no autoplay</span></figcaption></figure>`;
  }
  function resetVideos(root) {
    root.querySelectorAll("[data-video-src]").forEach((frame) => {
      frame.removeAttribute("src");
      frame.hidden = true;
      frame.parentElement.querySelector("[data-load-video]").hidden = false;
    });
  }
  function entry(project) {
    const date =
      project.month ||
      (project.period === "ongoing"
        ? `${project.year} · ongoing`
        : `${periods[project.period][0]} ${project.year}`);
    const media = project.media || [];
    const badge = project.award
      ? `<span class="achievement achievement-reward"><svg class="reward-trophy" aria-hidden="true" focusable="false" viewBox="0 0 24 24" width="28" height="28" shape-rendering="crispEdges"><path d="M6 5H2v5l4 3m12-8h4v5l-4 3" fill="none" stroke="currentColor" stroke-width="2"/><path d="M6 2h12v10l-3 4h-1v3h4v3H6v-3h4v-3H9l-3-4z" fill="currentColor"/><path d="M8 4h8v7l-2 3h-4l-2-3z" fill="#fff3bd"/><path d="M11 6h2v2h2v2h-2v2h-2v-2H9V8h2z" fill="currentColor"/></svg><span class="reward-copy"><span class="reward-title">${escape(project.badge)}</span><span class="reward-subtitle">Outstanding Project</span></span></span>`
      : `<span class="achievement">${escape(project.badge)}</span>`;
    return `<article class="timeline-entry" data-project-id="${project.id}" data-period="${project.period}" data-categories="${project.tags.join(" ")}" aria-labelledby="title-${project.id}">
      <div class="entry-meta"><span class="entry-date">${date}</span>${badge}</div>
      <div class="entry-heading"><h5 id="title-${project.id}">${escape(project.name)}</h5></div>
      ${project.cover ? mediaFigure(project.cover, `${project.id}-cover`) : ""}
      ${project.video ? videoFigure(project.video, `${project.id}-video`) : ""}
      <p>${escape(project.summary)}</p>${technologyList(project.stack)}${projectLinks(project)}
      <details class="project-disclosure"><summary>${media.length ? "More pictures &amp; story" : "Read the story"}<span class="sr-only"> — ${escape(project.name)}</span><span class="entry-toggle" aria-hidden="true">+</span></summary>
        <div class="entry-story">${project.contribution ? `<p class="project-contribution">${escape(project.contribution)}</p>` : ""}${media.length ? `<div class="project-gallery">${media.map((item, index) => mediaFigure(item, `${project.id}-media-${index}`)).join("")}</div>` : ""}<p>${escape(project.detail)}</p></div>
      </details>
    </article>`;
  }
  function render() {
    return `<div class="project-journal"><p class="journal-intro">Apps, AI experiments, and games—one chapter at a time.</p>
      <div class="journal-controls"><nav class="year-jumps" aria-label="Jump to project year"><span>CHAPTER</span>${[2024, 2025, 2026].map((year) => `<button type="button" data-jump-year="${year}">${year}</button>`).join("")}</nav>
        <div class="project-filters" role="group" aria-label="Filter projects">${[
          ["all", "All"],
          ["apps", "Apps"],
          ["ai", "AI"],
          ["games", "Games"],
        ]
          .map(
            ([id, label]) =>
              `<button type="button" data-project-filter="${id}" aria-pressed="${id === "all"}">${label}</button>`,
          )
          .join(
            "",
          )}<span class="journal-count" role="status">${catalog.length} projects</span></div>
      </div><div class="journal-years">${[2024, 2025, 2026]
        .map(
          (year) =>
            `<section class="journal-year" data-year="${year}" id="project-year-${year}" aria-labelledby="heading-year-${year}"><h3 id="heading-year-${year}">${year}<span>${year === 2024 ? "The first chapters" : year === 2025 ? "Building and experimenting" : "AI, automation & play"}</span></h3>${Object.entries(
              periods,
            )
              .map(([period, [label, range]]) => {
                const entries = catalog.filter(
                  (p) => p.year === year && p.period === period,
                );
                return entries.length
                  ? `<section class="journal-period" data-journal-period="${period}" aria-label="${label} ${year}"><h4>${label}<span>${range}</span></h4>${entries.map(entry).join("")}</section>`
                  : "";
              })
              .join("")}</section>`,
        )
        .join(
          "",
        )}</div><a class="journal-github" href="${github.slice(0, -1)}" target="_blank" rel="noopener noreferrer">More on my GitHub ↗</a></div>`;
  }
  function mount(root) {
    const dialog = root.closest("dialog");
    if (dialog.projectVideoCloseHandler)
      dialog.removeEventListener("close", dialog.projectVideoCloseHandler);
    dialog.projectVideoCloseHandler = () => resetVideos(root);
    dialog.addEventListener("close", dialog.projectVideoCloseHandler);
    if (root.projectMediaClickHandler)
      root.removeEventListener("click", root.projectMediaClickHandler);
    root.projectMediaClickHandler = (event) => {
      const videoButton = event.target.closest("[data-load-video]");
      if (videoButton && root.contains(videoButton)) {
        const frame = root.querySelector(
          `#${videoButton.getAttribute("aria-controls")}`,
        );
        frame.src = frame.dataset.videoSrc;
        frame.hidden = false;
        videoButton.hidden = true;
        frame.focus();
        return;
      }
      const button = event.target.closest("[data-play-animation]");
      if (!button || !root.contains(button)) return;
      const img = root.querySelector(
        `#${button.getAttribute("aria-controls")}`,
      );
      const playing = button.getAttribute("aria-pressed") === "true";
      if (playing) {
        img.removeAttribute("src");
        img.hidden = true;
      } else {
        img.src = img.dataset.animatedSrc;
        img.hidden = false;
      }
      button.setAttribute("aria-pressed", String(!playing));
      button.textContent = playing
        ? `▶ Play ${button.dataset.animationLabel} GIF`
        : "■ Stop animation";
    };
    root.addEventListener("click", root.projectMediaClickHandler);
    const controls = root.querySelector(".journal-controls");
    controls.addEventListener("click", (event) => {
      const button = event.target.closest("button");
      if (!button || !controls.contains(button)) return;
      if (button.dataset.projectFilter) {
        const filter = button.dataset.projectFilter;
        root
          .querySelectorAll("[data-project-filter]")
          .forEach((b) => b.setAttribute("aria-pressed", String(b === button)));
        let count = 0;
        root.querySelectorAll("[data-project-id]").forEach((item) => {
          item.hidden =
            filter !== "all" &&
            !item.dataset.categories.split(" ").includes(filter);
          if (!item.hidden) count++;
          else resetVideos(item);
        });
        root.querySelectorAll(".journal-period").forEach((group) => {
          group.hidden = ![...group.querySelectorAll("[data-project-id]")].some(
            (item) => !item.hidden,
          );
        });
        root.querySelectorAll("[data-year]").forEach((year) => {
          year.hidden = ![...year.querySelectorAll(".journal-period")].some(
            (group) => !group.hidden,
          );
          root.querySelector(
            `[data-jump-year="${year.dataset.year}"]`,
          ).disabled = year.hidden;
        });
        root.querySelector(".journal-count").textContent =
          `${count} ${count === 1 ? "project" : "projects"}`;
      } else if (button.dataset.jumpYear) {
        const year = root.querySelector(
          `#project-year-${button.dataset.jumpYear}`,
        );
        const header = root.closest("dialog").querySelector(".dialog-top");
        year.style.scrollMarginTop = `${header.offsetHeight + controls.offsetHeight + 20}px`;
        year.scrollIntoView({
          block: "start",
          behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
            ? "auto"
            : "smooth",
        });
      }
    });
  }
  window.ProjectJournal = { render, mount };
})();
