/* ============================================================
   LLD notes - shared behaviour
   Everything degrades: no mermaid.min.js, no localStorage, no JS
   at all, and the page still reads.
   ============================================================ */
(function () {
  "use strict";

  /* ---------- storage that never throws ---------- */
  // file:// pages get an opaque origin in some browsers, so every
  // access can throw or silently return null. Treat it as a cache,
  // never as the source of truth (PROGRESS.md is that).
  var store = {
    get: function (k) {
      try { return window.localStorage.getItem(k); } catch (e) { return null; }
    },
    set: function (k, v) {
      try { window.localStorage.setItem(k, v); } catch (e) { /* ignore */ }
    }
  };

  var PAGE = (function () {
    var p = location.pathname.split("/").filter(Boolean);
    return p.slice(-2).join("/") || "index";
  })();

  /* ============================================================
     1. Theme
     ============================================================ */

  var THEME_KEY = "lld:theme";

  function systemPrefersDark() {
    return !!(window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches);
  }

  function storedTheme() {
    var t = store.get(THEME_KEY);
    return t === "dark" || t === "light" ? t : null;
  }

  function effectiveTheme() {
    return storedTheme() || (systemPrefersDark() ? "dark" : "light");
  }

  function applyTheme(theme) {
    if (theme) {
      document.documentElement.setAttribute("data-theme", theme);
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
    var btn = document.querySelector("[data-theme-toggle]");
    if (btn) {
      var dark = effectiveTheme() === "dark";
      btn.textContent = dark ? "● Light" : "○ Dark";
      btn.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
    }
  }

  function initTheme() {
    applyTheme(storedTheme());
    var btn = document.querySelector("[data-theme-toggle]");
    if (!btn) return;
    btn.addEventListener("click", function () {
      var next = effectiveTheme() === "dark" ? "light" : "dark";
      store.set(THEME_KEY, next);
      applyTheme(next);
      renderDiagrams();
    });
  }

  /* ============================================================
     2. Mermaid diagrams
     ============================================================ */

  // Original source per node, captured before mermaid overwrites it
  // with SVG, so a theme switch can re-render from scratch.
  var diagramSource = new WeakMap();

  function collectDiagrams() {
    var nodes = [].slice.call(document.querySelectorAll(".mermaid"));
    nodes.forEach(function (el) {
      if (!diagramSource.has(el)) {
        diagramSource.set(el, el.textContent.trim());
      }
    });
    return nodes;
  }

  // Mirror each diagram's source into a collapsible <details> so the
  // page is authored once: write the Mermaid, get the source view free.
  function addSourceToggles(nodes) {
    nodes.forEach(function (el) {
      var fig = el.closest(".diagram");
      if (!fig || fig.querySelector(".mermaid-src")) return;
      var src = diagramSource.get(el);
      if (!src) return;

      var details = document.createElement("details");
      details.className = "mermaid-src";
      var summary = document.createElement("summary");
      summary.textContent = "Mermaid source";
      var pre = document.createElement("pre");
      pre.textContent = src;
      details.appendChild(summary);
      details.appendChild(pre);

      var cap = fig.querySelector("figcaption");
      if (cap) { fig.insertBefore(details, cap); } else { fig.appendChild(details); }
    });
  }

  function mermaidThemeVars() {
    var dark = effectiveTheme() === "dark";
    var mono = '"Cascadia Code", Consolas, "SF Mono", Menlo, monospace';
    return dark ? {
      background:         "#1a1d23",
      primaryColor:       "#21252c",
      primaryTextColor:   "#e9e7e4",
      primaryBorderColor: "#414957",
      secondaryColor:     "#1e2740",
      tertiaryColor:      "#1a1d23",
      lineColor:          "#8c95a3",
      textColor:          "#e9e7e4",
      mainBkg:            "#21252c",
      nodeBorder:         "#414957",
      classText:          "#e9e7e4",
      labelBoxBkgColor:   "#21252c",
      labelTextColor:     "#e9e7e4",
      fontFamily:         mono,
      fontSize:           "14px"
    } : {
      background:         "#ffffff",
      primaryColor:       "#f4f0ea",
      primaryTextColor:   "#1f1b16",
      primaryBorderColor: "#cdc3b5",
      secondaryColor:     "#e8edfc",
      tertiaryColor:      "#ffffff",
      lineColor:          "#7d7467",
      textColor:          "#1f1b16",
      mainBkg:            "#f4f0ea",
      nodeBorder:         "#cdc3b5",
      classText:          "#1f1b16",
      labelBoxBkgColor:   "#f4f0ea",
      labelTextColor:     "#1f1b16",
      fontFamily:         mono,
      fontSize:           "14px"
    };
  }

  // A diagram wider than its column pans sideways. Say so, rather than
  // leaving a phone reader to discover half a diagram by accident.
  function markPannable(nodes) {
    nodes.forEach(function (el) {
      var pannable = el.scrollWidth > el.clientWidth + 2;
      var fig = el.closest(".diagram");
      if (!fig) return;
      fig.setAttribute("data-pannable", pannable ? "true" : "false");

      var head = fig.querySelector(".code-head");
      if (!head) return;
      var hint = head.querySelector(".pan-hint");
      if (pannable && !hint) {
        hint = document.createElement("span");
        hint.className = "pan-hint";
        hint.textContent = "↔ drag sideways";
        head.appendChild(hint);
      } else if (!pannable && hint) {
        hint.remove();
      }
    });
  }

  function renderDiagrams() {
    var nodes = collectDiagrams();
    if (!nodes.length) return;

    if (typeof window.mermaid === "undefined") {
      // Vendored bundle missing or blocked: show the source, say why.
      nodes.forEach(function (el) {
        if (el.getAttribute("data-state") === "failed") return;
        el.setAttribute("data-state", "failed");
        var pre = document.createElement("pre");
        pre.style.textAlign = "left";
        pre.style.margin = "0";
        pre.textContent = diagramSource.get(el) || "";
        el.textContent = "";
        el.appendChild(pre);
      });
      return;
    }

    // Reset each node to its source so mermaid re-processes it.
    nodes.forEach(function (el) {
      el.removeAttribute("data-processed");
      el.textContent = diagramSource.get(el) || "";
      el.setAttribute("data-state", "pending");
    });

    try {
      window.mermaid.initialize({
        startOnLoad: false,
        securityLevel: "loose",
        theme: "base",
        themeVariables: mermaidThemeVars(),
        class: { useMaxWidth: false },
        flowchart: { useMaxWidth: false, curve: "basis" },
        sequence: { useMaxWidth: false }
      });
      var out = window.mermaid.run({ nodes: nodes, suppressErrors: true });
      var done = function () {
        nodes.forEach(function (el) { el.setAttribute("data-state", "ready"); });
        markPannable(nodes);
      };
      if (out && typeof out.then === "function") { out.then(done, done); } else { done(); }
    } catch (e) {
      nodes.forEach(function (el) { el.setAttribute("data-state", "failed"); });
    }
  }

  /* ============================================================
     3. Java syntax highlighting
     ============================================================ */

  var KEYWORDS = ("abstract assert boolean break byte case catch char class const continue default " +
    "do double else enum extends final finally float for goto if implements import instanceof int " +
    "interface long native new package private protected public return short static strictfp super " +
    "switch synchronized this throw throws transient try void volatile while var record sealed " +
    "permits yield true false null").split(" ");

  var TOKEN_RE = new RegExp(
    "(/\\*[\\s\\S]*?\\*/|//[^\\n]*)" +        // 1 comment
    "|(\"(?:\\\\.|[^\"\\\\])*\"|'(?:\\\\.|[^'\\\\])*')" + // 2 string / char
    "|(@[A-Za-z_]\\w*)" +                      // 3 annotation
    "|(\\b(?:" + KEYWORDS.join("|") + ")\\b)" +// 4 keyword
    "|(\\b\\d[\\d_]*(?:\\.\\d+)?[dDfFlL]?\\b)" +// 5 number
    "|(\\b[A-Z][A-Za-z0-9_]*\\b)",             // 6 type-ish
    "g"
  );

  var CLASS_FOR = { 1: "tok-com", 2: "tok-str", 3: "tok-ann", 4: "tok-key", 5: "tok-num", 6: "tok-typ" };

  function esc(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function highlightJava(src) {
    var out = "";
    var last = 0;
    var m;
    TOKEN_RE.lastIndex = 0;
    while ((m = TOKEN_RE.exec(src)) !== null) {
      out += esc(src.slice(last, m.index));
      var cls = null;
      for (var g = 1; g <= 6; g++) { if (m[g] !== undefined) { cls = CLASS_FOR[g]; break; } }
      out += cls ? '<span class="' + cls + '">' + esc(m[0]) + "</span>" : esc(m[0]);
      last = m.index + m[0].length;
    }
    out += esc(src.slice(last));
    return out;
  }

  function initHighlight() {
    [].forEach.call(document.querySelectorAll("code.language-java"), function (code) {
      if (code.getAttribute("data-hl") === "1") return;
      code.innerHTML = highlightJava(code.textContent);
      code.setAttribute("data-hl", "1");
    });
  }

  /* ============================================================
     4. Copy buttons
     ============================================================ */

  function initCopy() {
    [].forEach.call(document.querySelectorAll(".code-block, .term"), function (block) {
      var head = block.querySelector(".code-head");
      var pre = block.querySelector("pre");
      if (!head || !pre || head.querySelector(".copy-btn")) return;

      var btn = document.createElement("button");
      btn.className = "copy-btn";
      btn.type = "button";
      btn.textContent = "copy";
      btn.addEventListener("click", function () {
        var text = pre.textContent;
        var ok = function () {
          btn.textContent = "copied";
          setTimeout(function () { btn.textContent = "copy"; }, 1200);
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(ok, function () { btn.textContent = "failed"; });
        } else {
          // file:// without clipboard API: select it so Ctrl+C works.
          var r = document.createRange();
          r.selectNodeContents(pre);
          var sel = window.getSelection();
          sel.removeAllRanges();
          sel.addRange(r);
          btn.textContent = "selected";
          setTimeout(function () { btn.textContent = "copy"; }, 1500);
        }
      });
      if (!head.querySelector(".spacer")) {
        var sp = document.createElement("span");
        sp.className = "spacer";
        head.appendChild(sp);
      }
      head.appendChild(btn);
    });
  }

  /* ============================================================
     5. On-page table of contents
     ============================================================ */

  function slug(s) {
    return s.toLowerCase().replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "-").slice(0, 50);
  }

  function initToc() {
    var toc = document.querySelector("[data-toc]");
    if (!toc) return;
    var heads = [].slice.call(document.querySelectorAll(".content h2"));
    if (!heads.length) { toc.style.display = "none"; return; }

    var ol = document.createElement("ol");
    var links = [];
    heads.forEach(function (h) {
      if (!h.id) h.id = slug(h.textContent) || "s" + links.length;
      var li = document.createElement("li");
      var a = document.createElement("a");
      a.href = "#" + h.id;
      // Drop the leading section number, the rail is short
      a.textContent = h.textContent.replace(/^\s*\d+[.)]?\s*/, "").trim();
      li.appendChild(a);
      ol.appendChild(li);
      links.push({ a: a, h: h });
    });

    var title = document.createElement("div");
    title.className = "toc-title";
    title.textContent = "On this page";
    toc.appendChild(title);
    toc.appendChild(ol);

    if (!("IntersectionObserver" in window)) return;
    var seen = new Map();
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { seen.set(e.target, e); });
      var best = null;
      links.forEach(function (l) {
        var e = seen.get(l.h);
        if (e && e.isIntersecting && (!best || e.target.offsetTop < best.h.offsetTop)) best = l;
      });
      if (!best) {
        // nothing on screen: mark the last heading scrolled past
        for (var i = links.length - 1; i >= 0; i--) {
          if (links[i].h.getBoundingClientRect().top < 120) { best = links[i]; break; }
        }
      }
      links.forEach(function (l) { l.a.classList.toggle("active", l === best); });
    }, { rootMargin: "-80px 0px -60% 0px", threshold: [0, 1] });
    links.forEach(function (l) { obs.observe(l.h); });
  }

  /* ============================================================
     6. Mastery-gate checkboxes
     ============================================================ */

  function initCheckboxes() {
    [].forEach.call(document.querySelectorAll(".gate input[type=checkbox]"), function (cb, i) {
      var key = "lld:gate:" + PAGE + ":" + (cb.id || i);
      if (store.get(key) === "1") cb.checked = true;
      var sync = function () {
        var li = cb.closest("li");
        if (li) li.classList.toggle("done", cb.checked);
        var gate = cb.closest(".gate");
        if (gate) {
          var all = gate.querySelectorAll("input[type=checkbox]");
          var hit = gate.querySelectorAll("input[type=checkbox]:checked");
          var state = gate.querySelector(".gate-state");
          if (state) {
            state.textContent = hit.length === all.length && all.length
              ? "All " + all.length + " cleared — topic mastered, next topic unlocked."
              : hit.length + " of " + all.length + " cleared.";
          }
        }
      };
      cb.addEventListener("change", function () {
        store.set(key, cb.checked ? "1" : "0");
        sync();
      });
      sync();
    });
  }

  /* ============================================================
     7. Drill helpers: tally + reveal all
     ============================================================ */

  function initDrills() {
    var drills = [].slice.call(document.querySelectorAll(".drill"));

    var tally = document.querySelector("[data-drill-tally]");
    if (tally && drills.length) {
      var ok = 0, miss = 0;
      drills.forEach(function (d) {
        var r = d.getAttribute("data-result");
        if (r === "ok") ok++;
        else if (r === "miss") miss++;
      });
      tally.textContent = "";
      var bits = [
        drills.length + " drill" + (drills.length === 1 ? "" : "s") + " archived",
        "✅ " + ok + " first try",
        "❌ " + miss + " missed"
      ];
      bits.forEach(function (t) {
        var s = document.createElement("span");
        s.textContent = t;
        tally.appendChild(s);
      });
    }

    [].forEach.call(document.querySelectorAll("[data-reveal-all]"), function (btn) {
      btn.addEventListener("click", function () {
        var open = btn.getAttribute("data-open") === "1";
        [].forEach.call(document.querySelectorAll(".drill details"), function (d) {
          d.open = !open;
        });
        btn.setAttribute("data-open", open ? "0" : "1");
        btn.textContent = open ? "Reveal all answers" : "Hide all answers";
      });
    });
  }

  /* ============================================================
     8. Index page search
     ============================================================ */

  function initSearch() {
    var input = document.getElementById("topicSearch");
    if (!input) return;
    var empty = document.querySelector(".search-empty");
    var modules = [].slice.call(document.querySelectorAll(".module"));

    function run() {
      var q = input.value.trim().toLowerCase();
      var shown = 0;
      modules.forEach(function (mod) {
        var rows = [].slice.call(mod.querySelectorAll(".topics > li"));
        var hit = 0;
        var modText = (mod.querySelector("header") || mod).textContent.toLowerCase();
        rows.forEach(function (li) {
          var match = !q || li.textContent.toLowerCase().indexOf(q) !== -1 || modText.indexOf(q) !== -1;
          li.hidden = !match;
          if (match) hit++;
        });
        mod.hidden = hit === 0;
        shown += hit;
      });
      if (empty) empty.style.display = shown ? "none" : "block";
    }

    input.addEventListener("input", run);
    document.addEventListener("keydown", function (e) {
      if (e.key === "/" && document.activeElement !== input) {
        e.preventDefault();
        input.focus();
        input.select();
      } else if (e.key === "Escape" && document.activeElement === input) {
        input.value = "";
        run();
        input.blur();
      }
    });
    run();
  }

  /* ============================================================
     boot
     ============================================================ */

  function boot() {
    initTheme();
    initHighlight();
    initCopy();
    initToc();
    initCheckboxes();
    initDrills();
    initSearch();
    var nodes = collectDiagrams();
    addSourceToggles(nodes);
    renderDiagrams();

    // Rotating a phone changes whether a diagram still overflows.
    var resizeTimer;
    window.addEventListener("resize", function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () { markPannable(collectDiagrams()); }, 200);
    });

    // Follow the OS if the user has not pinned a theme.
    if (window.matchMedia) {
      var mq = window.matchMedia("(prefers-color-scheme: dark)");
      var onChange = function () { if (!storedTheme()) { applyTheme(null); renderDiagrams(); } };
      if (mq.addEventListener) mq.addEventListener("change", onChange);
      else if (mq.addListener) mq.addListener(onChange);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
