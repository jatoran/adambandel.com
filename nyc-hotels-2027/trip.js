/* Shared helpers for the booked-trip tabs (Plan, Flights + car, NYC hotels).
   Loaded by each tab page; every tab runs in its own iframe, so nothing here is global
   across tabs except the activity log, which is kept in localStorage under one key. */
(function () {
  "use strict";
  /* Not the research tab's key ("snowy-cabin-getaway-2027.activity"): that page rewrites its
     whole key from memory on every event, which would erase these tabs' entries. */
  const LOG_KEY = "snowy-cabin-getaway-2027.trip-activity";
  const LOG_KEEP = 300;
  const page = (document.body && document.body.dataset.page) || "page";

  function readLog() {
    try { return JSON.parse(localStorage.getItem(LOG_KEY) || "[]"); } catch (e) { return []; }
  }
  /* Bounded activity log: newest LOG_KEEP events, shared by the tabs. Storage can be
     unavailable (file:// in some browsers, private mode); the page still works. */
  function log(op, details, severity) {
    const rec = Object.assign({ ts: new Date().toISOString(), severity: severity || "info", page: page, op: op }, details || {});
    try {
      const all = readLog();
      all.push(rec);
      localStorage.setItem(LOG_KEY, JSON.stringify(all.slice(-LOG_KEEP)));
    } catch (e) { /* storage unavailable */ }
    return rec;
  }
  window.addEventListener("error", function (e) { log("runtime.error", { message: e.message, at: (e.filename || "") + ":" + (e.lineno || 0) }, "error"); });
  window.addEventListener("unhandledrejection", function (e) { log("runtime.rejection", { message: String(e.reason) }, "error"); });

  const esc = function (s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  };
  const usd = function (n, cents) {
    if (n == null || isNaN(n)) return "-";
    return "$" + Number(n).toLocaleString("en-US", { minimumFractionDigits: cents ? 2 : 0, maximumFractionDigits: cents ? 2 : 0 });
  };
  const range = function (lo, hi) { return lo == null ? "-" : (hi == null || hi === lo) ? usd(lo) : usd(lo) + " - " + usd(hi); };
  const num = function (n) { return Number(n || 0).toLocaleString("en-US"); };
  /* Only http(s) and relative links are rendered as links. */
  const safeUrl = function (u) { return /^(https?:\/\/|[a-z0-9_./#?=&%-]+$)/i.test(String(u || "")) ? String(u) : ""; };
  const link = function (url, label, cls) {
    const u = safeUrl(url);
    if (!u) return esc(label);
    const ext = /^https?:/i.test(u);
    return '<a href="' + esc(u) + '"' + (cls ? ' class="' + cls + '"' : "") + (ext ? ' target="_blank" rel="noopener"' : "") + ">" + esc(label) + (ext ? " ↗" : "") + "</a>";
  };
  const links = function (list) { return (list || []).map(function (l) { return link(l.url, l.label); }).join(""); };
  const tag = function (text, cls) { return text ? '<span class="tag ' + (cls || "") + '">' + esc(text) + "</span>" : ""; };

  /* Click any image marked data-zoom to see it full size. */
  function lightbox() {
    let lb = document.getElementById("lb");
    if (!lb) {
      lb = document.createElement("div");
      lb.id = "lb";
      lb.innerHTML = '<img alt="">';
      document.body.appendChild(lb);
    }
    const img = lb.querySelector("img");
    document.addEventListener("click", function (e) {
      const t = e.target;
      if (t && t.matches && t.matches("img[data-zoom]")) { img.src = t.src; lb.classList.add("on"); log("photo.open", { src: t.getAttribute("src") }); }
      else if (lb.classList.contains("on")) lb.classList.remove("on");
    });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") lb.classList.remove("on"); });
  }

  /* Weather strip for one place of TRIP.weather.places. */
  function weatherBox(p, title) {
    if (!p || !p.ok) return '<div class="wxbox"><div class="h"><b>' + esc(title) + "</b><small>weather not available (re-run scripts/fetch_weather.py)</small></div></div>";
    const cells = p.days.map(function (d) {
      const fc = d.kind === "forecast";
      const cover = d.cover_pct != null && !fc
        ? '<div class="bar"><i style="width:' + d.cover_pct + '%"></i></div><div class="g">snow on ground ' + d.cover_pct + "%</div>"
        : (fc && d.precip_pct != null ? '<div class="g">precip ' + d.precip_pct + "%</div>" : "");
      return '<div class="c' + (fc ? " fc" : "") + '" title="' + esc(fc ? "live forecast" : "2015-2025 average; snow on " + d.snow_pct + "% of days, rain " + d.rain_pct + "%") + '">' +
        '<div class="l">' + esc(d.dow) + " " + d.day + '</div><div class="i">' + esc(d.icon) + "</div>" +
        '<div class="t">' + d.high + "° <small>/ " + d.low + "°</small></div>" +
        '<div class="s">' + esc(d.short) + "</div>" + cover + "</div>";
    }).join("");
    const s = p.span || {};
    return '<div class="wxbox"><div class="h"><b>' + esc(title) + "</b><small>" + esc(p.label) +
      (p.elevation_ft ? " · " + num(p.elevation_ft) + " ft" : "") + "</small></div>" +
      '<div class="wx">' + cells + "</div>" +
      '<p class="sum">Typical for the stay: <b>' + s.avg_high_f + "° / " + s.avg_low_f + "°F</b>, snow falls on <b>" + s.snow_days_pct +
      "%</b> of days, snow on the ground <b>" + s.snow_cover_pct + "%</b> of the time, " + s.below_freezing_days_pct +
      "% of days never get above freezing. A cold snap bottoms out near <b>" + s.cold_snap_low_f + "°F</b>; a warm spell reaches " + s.warm_spell_high_f + "°F.</p></div>";
  }

  window.TripUI = {
    log: log, diagnostics: readLog, esc: esc, usd: usd, range: range, num: num, link: link, links: links,
    tag: tag, lightbox: lightbox, weatherBox: weatherBox, safeUrl: safeUrl,
    $: function (s) { return document.querySelector(s); },
  };
})();
