/* Decorative pixel skies; shares the room's ambience clock, not gameplay state. */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.PixelSky = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  function modeForHour(hour) {
    if (hour >= 5 && hour < 10) return "dawn";
    if (hour >= 10 && hour < 17) return "day";
    if (hour >= 17 && hour < 20) return "sunset";
    return "night";
  }

  function placement(w, h, sourceWidth, sourceHeight, mode) {
    const scale = Math.max((w + 14) / sourceWidth, h / sourceHeight);
    const width = sourceWidth * scale, height = sourceHeight * scale;
    const warm = mode === "dawn" || mode === "sunset";
    const focal = warm ? 0.08 : mode === "day" ? 0.92 : 0.91;
    return {
      x: Math.max(w - width, Math.min(0, w * (warm ? 0.15 : 0.85) - width * focal)),
      y: (h - height) / 2, width, height,
    };
  }

  function create(canvas, options = {}) {
    const ctx = canvas.getContext("2d");
    const image = options.image || new Image();
    if (!options.image) image.src = options.imageUrl || "assets/sky/sky-concepts.png";
    let previous = "";
    const stars = Array.from({ length: 85 }, (_, i) => ({
      x: ((i * 137.508) % 100) / 100,
      y: ((i * 43.193) % 77) / 100,
      phase: i * 1.31,
      size: i % 9 === 0 ? 2 : 1,
    }));
    const clouds = [
      { x: 0.03, y: 0.26, scale: 1.1, speed: 1.1 },
      { x: 0.58, y: 0.41, scale: 0.65, speed: 1.7 },
      { x: 0.82, y: 0.63, scale: 1.4, speed: 0.9 },
    ];

    function cloud(x, y, scale, mode) {
      ctx.save();
      ctx.translate(Math.round(x), Math.round(y));
      ctx.scale(scale, scale);
      const colors = mode === "day"
        ? ["#9bbde4", "#d6e6ee", "#fff6d9"]
        : ["#aa739a", "#dfa0a2", "#ffd294"];
      const blocks = [[0, 13, 78, 9], [8, 7, 53, 8], [17, 0, 23, 9], [39, 3, 18, 9], [62, 10, 9, 7]];
      ctx.globalAlpha = 0.65;
      ctx.fillStyle = colors[0];
      for (const block of blocks) ctx.fillRect(...block);
      ctx.fillStyle = colors[1];
      for (const [a, b, c, d] of blocks) ctx.fillRect(a, b - 3, c, d - 2);
      ctx.fillStyle = colors[2];
      ctx.fillRect(18, -3, 19, 4); ctx.fillRect(8, 4, 10, 3); ctx.fillRect(43, 0, 11, 3);
      ctx.restore();
    }

    function aurora(w, time) {
      for (let ribbon = 0; ribbon < 2; ribbon++) {
        const center = ribbon === 0 ? w * 0.19 : w * 0.83;
        for (let x = 0; x < w; x += 2) {
          const spread = Math.exp(-Math.pow((x - center) / (w * 0.23), 2));
          const top = 20 + Math.sin(x * 0.021 + time * 0.12 + ribbon * 3) * 21;
          const length = (50 + Math.sin(x * 0.037 - time * 0.19) * 22) * spread;
          for (let y = 0; y < length; y += 3) {
            const alpha = 0.15 * spread * Math.pow(1 - y / Math.max(1, length), 1.5)
              * (1 + 0.3 * Math.sin(time * 0.4 + x * 0.023));
            ctx.fillStyle = `rgba(${ribbon === 0 ? "63,229,187" : "134,120,234"},${alpha})`;
            ctx.fillRect(x, Math.round(top + y), 2, 3);
          }
        }
      }
    }

    function draw(time, hour = new Date().getHours()) {
      const h = 300;
      const w = Math.max(1, Math.min(960, Math.round(h * canvas.clientWidth / Math.max(1, canvas.clientHeight))));
      const mode = modeForHour(hour);
      const ready = image.complete && image.naturalWidth > 0;
      const key = `${w}:${h}:${mode}:${ready}:${Math.floor(time * 30)}`;
      // Freeze when paused and paint at most 30fps while the room stays responsive.
      if (key === previous) return;
      previous = key;
      if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
      canvas.dataset.mode = mode;
      ctx.imageSmoothingEnabled = false;
      ctx.globalAlpha = 1;
      ctx.clearRect(0, 0, w, h);
      const fallback = ctx.createLinearGradient(0, 0, 0, h);
      fallback.addColorStop(0, mode === "night" ? "#10172e" : mode === "day" ? "#568ede" : "#7970b5");
      fallback.addColorStop(1, mode === "night" ? "#202b47" : mode === "day" ? "#c1e3ef" : "#ffc287");
      ctx.fillStyle = fallback; ctx.fillRect(0, 0, w, h);
      if (ready) {
        // Panel coordinates exclude the separators in the approved concept sheet.
        const source = mode === "night" ? [631, 310] : mode === "day" ? [315, 305] : [0, 307];
        const p = placement(w, h, image.naturalWidth, source[1], mode);
        ctx.drawImage(image, 0, source[0], image.naturalWidth, source[1],
          p.x + Math.sin(time * 0.025) * 6, p.y, p.width, p.height);
      }
      if (mode === "sunset" || mode === "dawn") {
        ctx.fillStyle = mode === "sunset" ? "rgba(130,30,65,.13)" : "rgba(255,218,144,.05)";
        ctx.fillRect(0, 0, w, h);
      }
      if (mode === "night") {
        aurora(w, time);
        for (const star of stars) {
          const x = Math.round(star.x * w), y = Math.round(star.y * h);
          const alpha = 0.25 + 0.65 * Math.pow((Math.sin(time * 0.8 + star.phase) + 1) / 2, 3);
          ctx.fillStyle = `rgba(255,242,213,${alpha})`;
          ctx.fillRect(x, y, star.size, star.size);
          if (star.size === 2) {
            ctx.globalAlpha = alpha * 0.45;
            ctx.fillRect(x - 2, y, 6, 1); ctx.fillRect(x, y - 2, 1, 6);
            ctx.globalAlpha = 1;
          }
        }
        const cycle = time % 32;
        if (cycle > 24 && cycle < 25.2) {
          const travel = (cycle - 24) / 1.2;
          ctx.globalAlpha = Math.sin(travel * Math.PI) * 0.6; ctx.fillStyle = "#e4eaff";
          for (let i = 0; i < 10; i++) ctx.fillRect(Math.round(w * 0.55 + travel * w * 0.18 - i * 2), Math.round(35 + travel * 35 - i), 2, 1);
          ctx.globalAlpha = 1;
        }
      } else {
        for (const c of clouds) cloud(((c.x * w + time * c.speed) % (w + 120)) - 60, c.y * h, c.scale, mode);
        ctx.globalAlpha = 0.02 + 0.015 * Math.sin(time * 0.6);
        ctx.fillStyle = "#fff0c7"; ctx.fillRect(0, 0, w, h); ctx.globalAlpha = 1;
      }
    }
    return { draw };
  }
  return { modeForHour, placement, create };
});
