// Small shared helpers
export const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

export function el(html) {
  const t = document.createElement("template");
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
}

const KW = new Set("abstract assert boolean break byte case catch char class const continue default do double else enum extends final finally float for goto if implements import instanceof int interface long native new package private protected public return short static strictfp super switch synchronized this throw throws transient try void volatile while var record true false null".split(" "));

// Minimal Java syntax highlighter for read-only code blocks
export function highlightJava(code) {
  const re = /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')|\b(\d[\w.]*)\b|\b([A-Za-z_]\w*)\b/g;
  let out = "", last = 0, m;
  while ((m = re.exec(code))) {
    out += esc(code.slice(last, m.index));
    if (m[1]) out += `<span class="tok-c">${esc(m[1])}</span>`;
    else if (m[2]) out += `<span class="tok-s">${esc(m[2])}</span>`;
    else if (m[3]) out += `<span class="tok-n">${esc(m[3])}</span>`;
    else out += KW.has(m[4]) ? `<span class="tok-k">${m[4]}</span>` : esc(m[4]);
    last = re.lastIndex;
  }
  return out + esc(code.slice(last));
}

// Blocks right-click copy on elements marked .no-copy (a nudge to type code yourself)
export function guardCopy(root) {
  root.querySelectorAll(".no-copy").forEach(n => {
    n.addEventListener("copy", e => { e.preventDefault(); toast("Type it yourself — that's how it sticks ✍️"); });
    n.addEventListener("contextmenu", e => e.preventDefault());
  });
}

let toastTimer;
export function toast(msg) {
  document.querySelector(".toast")?.remove();
  const t = el(`<div class="toast">${esc(msg)}</div>`);
  document.body.appendChild(t);
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.remove(), 2600);
}

export function fmtTime(sec) {
  sec = Math.round(sec || 0);
  if (sec < 60) return sec + "s";
  const m = Math.floor(sec / 60);
  return m < 60 ? m + " min" : Math.floor(m / 60) + "h " + (m % 60) + "m";
}

export function downloadCSV(filename, rows) {
  const csv = rows.map(r => r.map(v => `"${String(v ?? "").replace(/"/g, '""')}"`).join(",")).join("\n");
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob(["\ufeff" + csv], { type: "text/csv" }));
  a.download = filename; a.click();
}

// Normalises a fill-in-the-blank answer: whitespace does not matter
export const normBlank = s => String(s ?? "").replace(/\s+/g, "");

// Renders a template like "public ___ void main(___[] args)" with input boxes.
export function fillTemplateHTML(template, answers, prefix) {
  const parts = template.split("___");
  return parts.map((p, i) => {
    let s = esc(p);
    if (i < parts.length - 1) {
      const w = Math.max(4, ...((answers?.[i]) || ["xxxxxx"]).map(a => a.length)) + 2;
      s += `<input data-blank="${i}" id="${prefix}-${i}" autocomplete="off" spellcheck="false" style="width:${w}ch">`;
    }
    return s;
  }).join("");
}

// ---------- seeded random (same student + test → same questions after a reload) ----------
export function seededRandom(seedText) {
  let h = 1779033703 ^ seedText.length;
  for (let i = 0; i < seedText.length; i++) { h = Math.imul(h ^ seedText.charCodeAt(i), 3432918353); h = (h << 13) | (h >>> 19); }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507); h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}
export function shuffle(arr, rnd) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}


// The questions (and option order) a given student gets — same result every time for the same student and test run.
export function pickQuestions(t, uid) {
  // a student whose response was deleted (to re-appear) gets a fresh question set each time
  const retake = (t.retakes && t.retakes[uid]) || 0;
  const rnd = seededRandom(uid + "|" + t.id + "|" + (t.startedAt || "") + (retake ? "|retake" + retake : ""));
  let ids = t.questions.map(q => q.id);
  if (t.shuffle !== false || t.pick) ids = shuffle(ids, rnd);
  if (t.pick) ids = ids.slice(0, t.pick);
  const optionOrder = {};
  t.questions.forEach(q => {
    if (q.type === "mcq") optionOrder[q.id] = t.shuffle !== false ? shuffle(q.options.map((_, i) => i), rnd) : q.options.map((_, i) => i);
  });
  return { ids, optionOrder };
}

// ---------- exam helpers: draw text into a canvas (not selectable, not readable by page-reading tools) ----------
export function htmlToText(html) {
  const d = document.createElement("div");
  d.innerHTML = String(html || "").replace(/<br\s*\/?>/gi, "\n");
  return d.textContent;
}

export function textCanvas(text, { mono = false, width = 820, size = 16, color = "#1d2433", bg = null, pad = 0, mark = "" } = {}) {
  const dpr = window.devicePixelRatio || 1;
  const c = document.createElement("canvas");
  const ctx = c.getContext("2d");
  const font = `${size}px ${mono ? '"JetBrains Mono", Consolas, monospace' : '"Source Sans 3", system-ui, sans-serif'}`;
  ctx.font = font;
  const maxW = width - pad * 2;
  const lines = [];
  for (const para of String(text).replace(/\t/g, "    ").split("\n")) {
    if (mono) {                       // code: keep lines, break only if too long
      let rest = para;
      while (ctx.measureText(rest).width > maxW && rest.length > 1) {
        let n = rest.length;
        while (n > 1 && ctx.measureText(rest.slice(0, n)).width > maxW) n--;
        lines.push(rest.slice(0, n)); rest = "  " + rest.slice(n);
      }
      lines.push(rest);
      continue;
    }
    let line = "";
    for (const w of para.split(" ")) {
      const test = line ? line + " " + w : w;
      if (ctx.measureText(test).width > maxW && line) { lines.push(line); line = w; } else line = test;
    }
    lines.push(line);
  }
  const lh = Math.round(size * 1.5);
  const h = Math.max(lh, lines.length * lh) + pad * 2;
  c.width = Math.round(width * dpr); c.height = Math.round(h * dpr);
  c.style.width = width + "px"; c.style.maxWidth = "100%"; c.style.height = "auto"; c.style.display = "block";
  ctx.scale(dpr, dpr);
  if (bg) { ctx.fillStyle = bg; ctx.beginPath(); ctx.roundRect ? ctx.roundRect(0, 0, width, h, 8) : ctx.rect(0, 0, width, h); ctx.fill(); }
  ctx.font = font; ctx.textBaseline = "middle"; ctx.fillStyle = color;
  lines.forEach((l, i) => ctx.fillText(l, pad, pad + i * lh + lh / 2));
  if (mark) {                         // faint watermark (roll number) to discourage sharing photos
    ctx.save(); ctx.globalAlpha = 0.13; ctx.fillStyle = bg ? "#ffffff" : "#000000"; ctx.font = `600 ${Math.max(12, size - 2)}px system-ui, sans-serif`;
    ctx.textAlign = "right"; ctx.textBaseline = "bottom"; ctx.fillText(mark, width - 6, h - 4); ctx.restore();
  }
  c.setAttribute("role", "img");
  c.setAttribute("aria-label", "Exam question");
  c.addEventListener("contextmenu", e => e.preventDefault());
  return c;
}
