/* Inclusive Studio — zero-dependency client. */
(function () {
  "use strict";

  var REPO = "3esign/inclusive-studio";
  var REPO_URL = "https://github.com/" + REPO;

  /* ---------- language toggle ---------- */
  var toggle = document.getElementById("langToggle");
  function setLang(lang) {
    document.body.classList.toggle("lang-en", lang === "en");
    document.documentElement.lang = lang;
    toggle.textContent = lang === "en" ? "SR" : "EN";
    toggle.setAttribute("aria-label", lang === "en" ? "Prebaci na srpski" : "Switch to English");
    try { localStorage.setItem("lang", lang); } catch (e) {}
  }
  toggle.addEventListener("click", function () {
    setLang(document.body.classList.contains("lang-en") ? "sr" : "en");
  });
  try { if (localStorage.getItem("lang") === "en") setLang("en"); } catch (e) {}

  /* ---------- links to the platform ---------- */
  var ideaUrl = REPO_URL + "/issues/new?template=ideja.yml";
  ["newIdeaBtn", "newIdeaBtn2"].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.href = ideaUrl;
  });
  ["repoLink", "repoLink2"].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.href = REPO_URL;
  });
  Array.prototype.forEach.call(document.querySelectorAll(".submit-week"), function (a) {
    var w = a.getAttribute("data-week");
    a.href = REPO_URL + "/issues/new?template=predaja.yml&title=" +
      encodeURIComponent("[Nedelja " + w + "] ");
  });

  /* ---------- idea board (live from GitHub Issues) ---------- */
  var board = document.getElementById("ideasBoard");
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function firstImage(md) {
    var m = /!\[[^\]]*\]\((https:\/\/[^)\s]+)\)/.exec(md || "") ||
            /(https:\/\/(?:user-images\.githubusercontent\.com|github\.com\/user-attachments)\/[^\s)"'<>]+)/.exec(md || "");
    return m ? m[1] : null;
  }
  function plain(md) {
    return (md || "")
      .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
      .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
      .replace(/[#>*_`]/g, "")
      .replace(/\n{2,}/g, "\n")
      .trim();
  }
  fetch("https://api.github.com/repos/" + REPO + "/issues?labels=idea&state=open&per_page=24")
    .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(function (issues) {
      if (!issues.length) {
        board.innerHTML =
          '<p class="muted"><span class="sr">Još nema ideja — budi prva/prvi: </span>' +
          '<span class="en">No ideas yet — be the first: </span>' +
          '<a href="' + ideaUrl + '">+ </a></p>';
        return;
      }
      board.innerHTML = issues.map(function (it) {
        var img = firstImage(it.body);
        var body = plain(it.body);
        if (body.length > 220) body = body.slice(0, 220) + "…";
        return '<article class="idea">' +
          '<h3><a href="' + esc(it.html_url) + '">' + esc(it.title) + "</a></h3>" +
          (img ? '<img src="' + esc(img) + '" alt="" loading="lazy" style="max-width:100%;border-radius:4px">' : "") +
          (body ? '<p class="body">' + esc(body) + "</p>" : "") +
          '<p class="meta">' + esc(it.user.login) + " · 💬 " + it.comments + "</p>" +
          "</article>";
      }).join("");
    })
    .catch(function () {
      board.innerHTML =
        '<p class="muted"><span class="sr">Tabla trenutno nije dostupna — <a href="' + REPO_URL +
        '/issues">otvori je direktno</a>.</span><span class="en">The board is unavailable right now — <a href="' +
        REPO_URL + '/issues">open it directly</a>.</span></p>';
    });

  /* ---------- sketchpad ---------- */
  var canvas = document.getElementById("padCanvas");
  var ctx = canvas.getContext("2d");
  var strokes = [];        // each: {color,size,points:[{x,y}]}
  var current = null;
  var color = "#1b1b1f";
  var size = 3;
  var sizes = [3, 6, 12];
  var eraser = false;

  function redraw() {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.lineCap = ctx.lineJoin = "round";
    strokes.forEach(function (s) {
      ctx.strokeStyle = s.color;
      ctx.lineWidth = s.size;
      ctx.beginPath();
      s.points.forEach(function (p, i) { i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y); });
      if (s.points.length === 1) ctx.lineTo(s.points[0].x + 0.1, s.points[0].y + 0.1);
      ctx.stroke();
    });
  }
  redraw();

  function pos(e) {
    var r = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - r.left) * (canvas.width / r.width),
      y: (e.clientY - r.top) * (canvas.height / r.height)
    };
  }
  canvas.addEventListener("pointerdown", function (e) {
    e.preventDefault();
    canvas.setPointerCapture(e.pointerId);
    current = { color: eraser ? "#ffffff" : color, size: eraser ? size * 4 : size, points: [pos(e)] };
    strokes.push(current);
    redraw();
  });
  canvas.addEventListener("pointermove", function (e) {
    if (!current) return;
    current.points.push(pos(e));
    redraw();
  });
  function up() { current = null; }
  canvas.addEventListener("pointerup", up);
  canvas.addEventListener("pointercancel", up);

  Array.prototype.forEach.call(document.querySelectorAll(".tool"), function (b) {
    b.addEventListener("click", function () {
      color = b.getAttribute("data-color");
      eraser = false;
      document.getElementById("eraserBtn").setAttribute("aria-pressed", "false");
      Array.prototype.forEach.call(document.querySelectorAll(".tool"), function (x) {
        x.setAttribute("aria-pressed", x === b ? "true" : "false");
      });
    });
  });
  document.getElementById("eraserBtn").addEventListener("click", function () {
    eraser = !eraser;
    this.setAttribute("aria-pressed", String(eraser));
  });
  document.getElementById("sizeBtn").addEventListener("click", function () {
    size = sizes[(sizes.indexOf(size) + 1) % sizes.length];
    document.getElementById("sizeVal").textContent = size;
  });
  document.getElementById("undoBtn").addEventListener("click", function () {
    strokes.pop(); redraw();
  });
  document.getElementById("clearBtn").addEventListener("click", function () {
    strokes = []; redraw();
  });
  document.getElementById("saveBtn").addEventListener("click", function () {
    var a = document.createElement("a");
    a.download = "skica.png";
    a.href = canvas.toDataURL("image/png");
    a.click();
  });
})();
