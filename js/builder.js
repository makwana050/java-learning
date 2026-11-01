// Faculty test builder: create / edit tests in the browser, add questions from the course question bank
import { esc, el, toast, highlightJava, textCanvas, htmlToText, fillTemplateHTML } from "./ui.js";
import { saveTest, listTests } from "./store.js";
import { runJava } from "./runner.js";
import { phaseText as phaseTextSafe } from "./topic.js";
import { COURSE } from "../content/course.js";
import { splitTest } from "./faculty.js";

const TYPES = {
  mcq: { label: "Multiple choice", icon: "🔘" },
  output: { label: "Guess the output", icon: "🖨" },
  fill: { label: "Fill / correct the syntax", icon: "✏️" },
  code: { label: "Write code", icon: "💻" },
};
const newId = taken => { let id; do { id = "q" + Math.random().toString(36).slice(2, 7); } while (taken.has(id)); return id; };
const slug = s => String(s || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || "test";

// pub + key (as stored) → one editable object
export function toEditable(pub, key) {
  return {
    id: pub.id, title: pub.title, instructions: pub.instructions || "", durationMin: pub.durationMin || 0, pick: pub.pick || 0,
    shuffle: pub.shuffle !== false, perQuestionSec: pub.perQuestionSec || 0, penaltyPerLeave: pub.penaltyPerLeave || 0,
    autoSubmitAfter: pub.autoSubmitAfter || 0, requireFullscreen: !!pub.requireFullscreen,
    questions: (pub.questions || []).map(q => {
      const k = key?.questions?.[q.id] || {};
      const o = JSON.parse(JSON.stringify(q));
      o.explain = k.explain || "";
      if (q.type === "mcq") o.answer = k.answer ?? 0;
      if (q.type === "output") o.answer = k.answer || [""];
      if (q.type === "fill") o.answer = k.answer || [];
      if (q.type === "code") { o.expected = k.expected ?? q.expected ?? ""; o.mustUse = k.mustUse || q.mustUse || []; o.showExpected = q.expected != null; o.solution = k.solution || ""; }
      return o;
    }),
  };
}

// editable object → the JSON format used by the uploader (also used for "Download JSON")
export function toJSON(t) {
  const out = {
    id: t.id, title: t.title, instructions: t.instructions, durationMin: +t.durationMin || 0,
    perQuestionSec: +t.perQuestionSec || 0, penaltyPerLeave: +t.penaltyPerLeave || 0, autoSubmitAfter: +t.autoSubmitAfter || 0,
    requireFullscreen: !!t.requireFullscreen, shuffle: t.shuffle !== false,
    questions: t.questions.map(q => {
      const o = { id: q.id, type: q.type, marks: +q.marks || 1, q: q.q };
      if (q.code) o.code = q.code;
      if (+q.timeSec) o.timeSec = +q.timeSec;
      if (q.explain) o.explain = q.explain;
      if (q.type === "mcq") { o.options = q.options; o.answer = +q.answer; }
      if (q.type === "output") o.answer = (q.answer || []).filter((a, i) => i === 0 || a.trim());
      if (q.type === "fill") { o.template = q.template; o.answer = q.answer; }
      if (q.type === "code") {
        o.expected = q.expected; if (q.starter) o.starter = q.starter;
        if (q.mustUse?.length) o.mustUse = q.mustUse; if (q.showExpected === false) o.showExpected = false;
        if (q.solution) o.solution = q.solution;
      }
      return o;
    }),
  };
  if (+t.pick) out.pick = +t.pick;
  return out;
}

function blankQuestion(type, taken) {
  const q = { id: newId(taken), type, marks: 1, q: "", code: "", explain: "" };
  if (type === "mcq") { q.q = ""; q.options = ["", "", "", ""]; q.answer = 0; }
  if (type === "output") { q.q = "Guess the output."; q.code = "public class Main {\n    public static void main(String[] args) {\n        \n    }\n}"; q.answer = [""]; }
  if (type === "fill") { q.q = "Correct the syntax: fill in the missing parts."; q.template = ""; q.answer = []; }
  if (type === "code") { q.q = ""; q.expected = ""; q.starter = ""; q.mustUse = []; q.showExpected = true; q.solution = "public class Main {\n    public static void main(String[] args) {\n        \n    }\n}"; }
  return q;
}

/**
 * Open the builder.
 * opts: { test (editable or null), existing (pub doc or null), onDone() }
 */
export function renderBuilder(host, opts) {
  const isNew = !opts.test || !!opts.asNew;
  const t = opts.test || { id: "", title: "", instructions: "", durationMin: 30, pick: 0, shuffle: true, perQuestionSec: 0, penaltyPerLeave: 0, autoSubmitAfter: 0, requireFullscreen: false, questions: [] };
  const existing = opts.existing || null;
  let idTouched = !isNew;
  const open = new Set(t.questions.length ? [] : []);   // which question editors are expanded

  function render() {
    const taken = new Set(t.questions.map(q => q.id));
    const totalMarks = t.questions.reduce((a, q) => a + (+q.marks || 1), 0);
    const counts = Object.keys(TYPES).map(k => [k, t.questions.filter(q => q.type === k).length]).filter(([, n]) => n);
    host.innerHTML = `<div class="builder">
      <div class="btn-row" style="justify-content:space-between;margin-bottom:1rem">
        <h2 style="margin:0;border:0;padding:0">${isNew ? "Create a new test" : "Edit test"}${t.title ? ": " + esc(t.title) : ""}</h2>
        <div class="btn-row" style="margin:0"><button id="b-cancel" class="btn-ghost">← Back to tests</button></div>
      </div>
      ${existing?.open ? `<div class="warn">This test is <b>live right now</b>. Stop it before saving changes.</div>` : ""}
      ${!isNew ? `<div class="note small">Editing keeps the same test id. Students who already submitted are re-graded with your new answer key the next time you open Submissions. Question ids stay the same so their answers still match.</div>` : ""}

      <div class="card"><h3>1. Test settings</h3>
        <div class="form-grid">
          <label>Title<input id="f-title" value="${esc(t.title)}" placeholder="e.g. Unit 2 Quiz — Strings"></label>
          <label>Test id <span class="muted small">(letters, numbers, - _)</span><input id="f-id" value="${esc(t.id)}" ${isNew ? "" : "disabled"} placeholder="unit2-strings"></label>
          <label class="span2">Instructions shown before the test<textarea id="f-instr" rows="2">${esc(t.instructions)}</textarea></label>
          <label>Total time (minutes, 0 = no limit)<input type="number" min="0" id="f-dur" value="${+t.durationMin || 0}"></label>
          <label>Questions per student <span class="muted small">(0 = all ${t.questions.length})</span><input type="number" min="0" max="${t.questions.length}" id="f-pick" value="${+t.pick || 0}"></label>
          <label>Seconds per question <span class="muted small">(0 = all on one page)</span><input type="number" min="0" id="f-pq" value="${+t.perQuestionSec || 0}"></label>
          <label>Marks deducted per leave<input type="number" min="0" step="0.25" id="f-pen" value="${+t.penaltyPerLeave || 0}"></label>
          <label>Auto-submit after leaves <span class="muted small">(0 = never)</span><input type="number" min="0" id="f-auto" value="${+t.autoSubmitAfter || 0}"></label>
          <label class="check"><input type="checkbox" id="f-shuffle" ${t.shuffle !== false ? "checked" : ""}> Shuffle question and option order for each student</label>
          <label class="check"><input type="checkbox" id="f-fs" ${t.requireFullscreen ? "checked" : ""}> Require full screen</label>
        </div>
        <p class="small muted" style="margin-bottom:0">These are defaults — you can still change time, per-question seconds and penalties on the Tests page right before pressing ▶ Start.</p>
      </div>

      <div class="card"><div style="display:flex;justify-content:space-between;align-items:baseline;gap:1rem;flex-wrap:wrap">
        <h3 style="margin:0">2. Questions <span class="pill">${t.questions.length}</span> <span class="pill blue">${totalMarks} marks</span></h3>
        <span class="small muted">${counts.map(([k, n]) => `${TYPES[k].icon} ${n} ${TYPES[k].label.toLowerCase()}`).join(" · ")}</span></div>
        ${t.pick && t.questions.length && new Set(t.questions.map(q => +q.marks || 1)).size > 1 ? `<div class="warn small">Questions have different marks, so random sets of ${t.pick} won't all be out of the same total. Use equal marks when picking a random subset.</div>` : ""}
        <div id="qlist"></div>
        <div class="btn-row add-row">
          <b class="small">Add:</b>
          ${Object.entries(TYPES).map(([k, v]) => `<button data-add="${k}">${v.icon} ${v.label}</button>`).join("")}
          <button class="btn-primary" id="b-bank">📚 From question bank</button>
        </div>
      </div>
      <div id="bank-host"></div>

      <div class="card save-bar">
        <div class="btn-row" style="margin:0">
          <button class="btn-primary" id="b-save" ${existing?.open ? "disabled" : ""}>💾 Save test</button>
          <button id="b-json">⬇ Download as JSON (backup)</button>
          <span class="status" id="b-msg"></span>
        </div>
      </div>
    </div>`;

    // settings bindings
    const bind = (id, key, fn = v => v) => host.querySelector(id).addEventListener("input", e => { t[key] = fn(e.target.type === "checkbox" ? e.target.checked : e.target.value); });
    host.querySelector("#f-title").addEventListener("input", e => {
      t.title = e.target.value;
      if (isNew && !idTouched) { t.id = slug(t.title); host.querySelector("#f-id").value = t.id; }
    });
    host.querySelector("#f-id").addEventListener("input", e => { idTouched = true; t.id = e.target.value.trim(); });
    bind("#f-instr", "instructions");
    bind("#f-dur", "durationMin", v => +v || 0);
    bind("#f-pick", "pick", v => +v || 0);
    bind("#f-pq", "perQuestionSec", v => +v || 0);
    bind("#f-pen", "penaltyPerLeave", v => +v || 0);
    bind("#f-auto", "autoSubmitAfter", v => +v || 0);
    host.querySelector("#f-shuffle").onchange = e => t.shuffle = e.target.checked;
    host.querySelector("#f-fs").onchange = e => t.requireFullscreen = e.target.checked;

    const list = host.querySelector("#qlist");
    if (!t.questions.length) list.innerHTML = `<p class="muted">No questions yet. Add your own below, or pick ready-made ones from the question bank (${"456"} questions from the course).</p>`;
    t.questions.forEach((q, i) => list.appendChild(questionEditor(q, i)));

    host.querySelectorAll("[data-add]").forEach(b => b.onclick = () => {
      const q = blankQuestion(b.dataset.add, taken);
      t.questions.push(q); open.add(q.id); render();
      host.querySelector(`[data-qe="${q.id}"]`)?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
    host.querySelector("#b-bank").onclick = () => openBank(host.querySelector("#bank-host"), picked => {
      const ids = new Set(t.questions.map(q => q.id));
      picked.forEach(q => { q.id = newId(ids); ids.add(q.id); t.questions.push(q); });
      toast(`Added ${picked.length} question(s)`);
      render();
    });
    host.querySelector("#b-cancel").onclick = () => { if (confirm("Leave the builder? Unsaved changes will be lost.")) opts.onDone(); };
    host.querySelector("#b-json").onclick = () => {
      const blob = new Blob([JSON.stringify(toJSON(t), null, 2)], { type: "application/json" });
      const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = (t.id || "test") + ".json"; a.click();
    };
    host.querySelector("#b-save").onclick = save;
  }

  // ---------- one question editor ----------
  function questionEditor(q, i) {
    const expanded = open.has(q.id);
    const summary = htmlToText(q.q).trim() || "(no question text yet)";
    const box = el(`<div class="qe ${expanded ? "open" : ""}" data-qe="${esc(q.id)}">
      <div class="qe-head">
        <span class="qe-num">${i + 1}</span>
        <span class="pill">${TYPES[q.type].icon} ${TYPES[q.type].label}</span>
        <span class="qe-sum">${esc(summary.slice(0, 90))}${summary.length > 90 ? "…" : ""}</span>
        <span class="pill blue">${+q.marks || 1} m</span>
        <span class="qe-tools">
          <button class="small" data-act="up" title="Move up" ${i === 0 ? "disabled" : ""}>↑</button>
          <button class="small" data-act="down" title="Move down" ${i === t.questions.length - 1 ? "disabled" : ""}>↓</button>
          <button class="small" data-act="dup" title="Duplicate">⧉</button>
          <button class="small" data-act="del" title="Delete">🗑</button>
          <button class="small" data-act="toggle">${expanded ? "Close" : "Edit"}</button>
        </span>
      </div>
      <div class="qe-body" ${expanded ? "" : "hidden"}></div>
    </div>`);
    box.querySelectorAll("[data-act]").forEach(b => b.onclick = e => {
      e.stopPropagation();
      const act = b.dataset.act, idx = t.questions.indexOf(q);
      if (act === "toggle") { expanded ? open.delete(q.id) : open.add(q.id); return render(); }
      if (act === "up" && idx > 0) [t.questions[idx - 1], t.questions[idx]] = [t.questions[idx], t.questions[idx - 1]];
      if (act === "down" && idx < t.questions.length - 1) [t.questions[idx + 1], t.questions[idx]] = [t.questions[idx], t.questions[idx + 1]];
      if (act === "dup") { const c = JSON.parse(JSON.stringify(q)); c.id = newId(new Set(t.questions.map(x => x.id))); t.questions.splice(idx + 1, 0, c); open.add(c.id); }
      if (act === "del") { if (!confirm(`Delete question ${idx + 1}?`)) return; t.questions.splice(idx, 1); }
      render();
    });
    box.querySelector(".qe-head").addEventListener("dblclick", () => { expanded ? open.delete(q.id) : open.add(q.id); render(); });
    if (!expanded) return box;

    const body = box.querySelector(".qe-body");
    body.innerHTML = `
      <label>Question text <span class="muted small">(simple HTML like &lt;code&gt;…&lt;/code&gt; and &lt;b&gt;…&lt;/b&gt; is allowed)</span>
        <textarea class="e-q" rows="2">${esc(q.q)}</textarea></label>
      <label>${q.type === "output" ? "Java program (students predict its output)" : q.type === "fill" ? "Wrong / incomplete code shown to students (optional)" : "Code shown with the question (optional)"}
        <textarea class="e-code mono" rows="${Math.min(14, Math.max(3, (q.code || "").split("\n").length + 1))}" spellcheck="false">${esc(q.code || "")}</textarea></label>
      <div class="e-type"></div>
      <div class="form-grid">
        <label>Marks<input type="number" min="0.5" step="0.5" class="e-marks" value="${+q.marks || 1}"></label>
        <label>Seconds for this question <span class="muted small">(0 = test default)</span><input type="number" min="0" class="e-time" value="${+q.timeSec || 0}"></label>
      </div>
      <label>Explanation shown with the correct answer after results are published (optional)
        <textarea class="e-explain" rows="2">${esc(q.explain || "")}</textarea></label>
      <div class="btn-row"><button class="small e-preview">👁 Preview as a student sees it</button></div>
      <div class="e-prev"></div>`;
    const tab = e => { if (e.key === "Tab") { e.preventDefault(); const s = e.target.selectionStart; e.target.setRangeText("    ", s, e.target.selectionEnd, "end"); e.target.dispatchEvent(new Event("input")); } };
    body.querySelector(".e-q").oninput = e => { q.q = e.target.value; box.querySelector(".qe-sum").textContent = htmlToText(q.q).slice(0, 90); };
    const codeTa = body.querySelector(".e-code");
    codeTa.oninput = e => { q.code = e.target.value; };
    codeTa.onkeydown = tab;
    body.querySelector(".e-marks").oninput = e => { q.marks = +e.target.value || 1; };
    body.querySelector(".e-time").oninput = e => { q.timeSec = +e.target.value || 0; };
    body.querySelector(".e-explain").oninput = e => { q.explain = e.target.value; };
    body.querySelector(".e-preview").onclick = () => preview(body.querySelector(".e-prev"), q);

    const tbox = body.querySelector(".e-type");
    if (q.type === "mcq") {
      const draw = () => {
        tbox.innerHTML = `<div class="label">Options — select the correct one</div>
          ${q.options.map((o, j) => `<div class="opt-row"><input type="radio" name="ans-${esc(q.id)}" value="${j}" ${+q.answer === j ? "checked" : ""} title="Correct answer">
            <input class="opt-in" data-j="${j}" value="${esc(o)}" placeholder="Option ${j + 1}"><button class="small" data-rm="${j}" ${q.options.length <= 2 ? "disabled" : ""}>✕</button></div>`).join("")}
          <button class="small" id="addopt-${esc(q.id)}" ${q.options.length >= 6 ? "disabled" : ""}>+ Add option</button>`;
        tbox.querySelectorAll(".opt-in").forEach(inp => inp.oninput = () => { q.options[+inp.dataset.j] = inp.value; });
        tbox.querySelectorAll("input[type=radio]").forEach(r => r.onchange = () => { q.answer = +r.value; });
        tbox.querySelectorAll("[data-rm]").forEach(b => b.onclick = () => {
          const j = +b.dataset.rm; q.options.splice(j, 1);
          if (+q.answer === j) q.answer = 0; else if (+q.answer > j) q.answer--;
          draw();
        });
        tbox.querySelector(`#addopt-${CSS.escape(q.id)}`).onclick = () => { q.options.push(""); draw(); };
      };
      draw();
    } else if (q.type === "output") {
      q.answer = q.answer?.length ? q.answer : [""];
      tbox.innerHTML = `<div class="label">Correct output</div>
        <textarea class="e-ans mono" rows="${Math.max(2, String(q.answer[0]).split("\n").length + 1)}" spellcheck="false">${esc(q.answer[0])}</textarea>
        <div class="btn-row"><button class="btn-run small e-run">▶ Run the program to fill the correct output</button><span class="status run e-st"></span></div>
        <label class="small">Also accept these answers (optional, separate alternatives with a line containing only <code>---</code>)
          <textarea class="e-alt mono" rows="2" spellcheck="false">${esc(q.answer.slice(1).join("\n---\n"))}</textarea></label>`;
      tbox.querySelector(".e-ans").oninput = e => { q.answer[0] = e.target.value; };
      tbox.querySelector(".e-alt").oninput = e => { q.answer = [q.answer[0], ...e.target.value.split(/\n---\n/).filter(x => x.trim())]; };
      tbox.querySelector(".e-run").onclick = async ev => {
        const st = tbox.querySelector(".e-st"); ev.target.disabled = true;
        const r = await runJava(q.code, ph => st.textContent = phaseTextSafe(ph));
        ev.target.disabled = false;
        if (r.status !== "ok") { st.className = "status bad e-st"; st.textContent = "Doesn't run: " + r.status; tbox.querySelector(".e-ans").value = r.output; return; }
        st.className = "status ok e-st"; st.textContent = "✓ Filled from the real output";
        q.answer[0] = r.output.replace(/\s+$/, "");
        tbox.querySelector(".e-ans").value = q.answer[0];
      };
    } else if (q.type === "fill") {
      const draw = () => {
        const n = (q.template || "").split("___").length - 1;
        q.answer = Array.from({ length: n }, (_, j) => q.answer?.[j] || [""]);
        tbox.innerHTML = `<div class="label">Answer template — type <code>___</code> (three underscores) where the student must fill in</div>
          <textarea class="e-tpl mono" rows="${Math.max(2, (q.template || "").split("\n").length + 1)}" spellcheck="false" placeholder='public ___ void main(___[] args)'>${esc(q.template || "")}</textarea>
          ${n ? `<div class="label">Correct answer for each blank <span class="muted small">(several accepted answers? separate with | — spaces are ignored when marking)</span></div>
            ${q.answer.map((a, j) => `<div class="opt-row"><span class="pill">Blank ${j + 1}</span><input class="blank-in mono" data-j="${j}" value="${esc(a.join(" | "))}"></div>`).join("")}`
          : `<p class="small muted">Add at least one <code>___</code> to the template.</p>`}`;
        const tpl = tbox.querySelector(".e-tpl");
        tpl.oninput = e => { q.template = e.target.value; };
        tpl.onchange = () => { draw(); };
        tpl.onkeydown = tab;
        tbox.querySelectorAll(".blank-in").forEach(inp => inp.oninput = () => { q.answer[+inp.dataset.j] = inp.value.split("|").map(s => s.trim()).filter(Boolean); });
      };
      draw();
    } else if (q.type === "code") {
      tbox.innerHTML = `
        <label>Your reference solution <span class="muted small">(kept private; used to generate the expected output)</span>
          <textarea class="e-sol mono" rows="8" spellcheck="false">${esc(q.solution || "")}</textarea></label>
        <div class="btn-row"><button class="btn-run small e-run">▶ Run solution to fill the expected output</button><span class="status run e-st"></span></div>
        <label>Expected output (graded against the student's last run)<textarea class="e-exp mono" rows="4" spellcheck="false">${esc(q.expected || "")}</textarea></label>
        <label class="check"><input type="checkbox" class="e-show" ${q.showExpected !== false ? "checked" : ""}> Show the expected output to students</label>
        <label>Code students start with (optional)<textarea class="e-start mono" rows="4" spellcheck="false">${esc(q.starter || "")}</textarea></label>
        <label>Code must contain <span class="muted small">(comma-separated, e.g. <code>printf, %.2f</code>)</span><input class="e-must mono" value="${esc((q.mustUse || []).join(", "))}"></label>`;
      const sol = tbox.querySelector(".e-sol"); sol.oninput = e => { q.solution = e.target.value; }; sol.onkeydown = tab;
      tbox.querySelector(".e-exp").oninput = e => { q.expected = e.target.value; };
      tbox.querySelector(".e-show").onchange = e => { q.showExpected = e.target.checked; };
      const st0 = tbox.querySelector(".e-start"); st0.oninput = e => { q.starter = e.target.value; }; st0.onkeydown = tab;
      tbox.querySelector(".e-must").oninput = e => { q.mustUse = e.target.value.split(",").map(s => s.trim()).filter(Boolean); };
      tbox.querySelector(".e-run").onclick = async ev => {
        const st = tbox.querySelector(".e-st"); ev.target.disabled = true;
        const r = await runJava(q.solution || "", ph => st.textContent = phaseTextSafe(ph));
        ev.target.disabled = false;
        if (r.status !== "ok") { st.className = "status bad e-st"; st.textContent = "Solution doesn't run: " + r.status; return; }
        st.className = "status ok e-st"; st.textContent = "✓ Expected output filled";
        q.expected = r.output.replace(/\s+$/, "");
        tbox.querySelector(".e-exp").value = q.expected;
      };
    }
    return box;
  }

  function preview(host, q) {
    host.innerHTML = "";
    const card = el(`<div class="card preview-card"><div class="kicker">Student view</div></div>`);
    const w = Math.max(280, Math.min(760, host.clientWidth - 40));
    card.appendChild(textCanvas(htmlToText(q.q), { width: w, size: 17, mark: "ROLL · student@rru.ac.in" }));
    if (q.code) { const c = textCanvas(q.code, { mono: true, width: w, size: 14, color: "#e6e1d6", bg: "#1f2430", pad: 14 }); c.style.margin = ".6rem 0"; card.appendChild(c); }
    if (q.type === "mcq") q.options.forEach((o, j) => card.insertAdjacentHTML("beforeend", `<label class="opt" style="display:flex;gap:.5rem;padding:.25rem 0"><input type="radio" disabled ${+q.answer === j ? "checked" : ""}> <span>${esc(o)}${+q.answer === j ? ' <span class="pill ok">correct</span>' : ""}</span></label>`));
    if (q.type === "output") card.insertAdjacentHTML("beforeend", `<div class="label">Student types the output here</div><textarea rows="3" disabled style="width:100%"></textarea><div class="small muted">Correct: <code>${esc(q.answer?.[0] || "")}</code></div>`);
    if (q.type === "fill") card.insertAdjacentHTML("beforeend", `<div class="fill-code">${fillTemplateHTML(q.template || "", q.answer, "pv")}</div>`);
    if (q.type === "code") card.insertAdjacentHTML("beforeend", `${q.showExpected !== false ? `<div class="label">Expected output</div><pre class="outbox">${esc(q.expected || "")}</pre>` : ""}<div class="label">Code editor + Run button appear here</div>`);
    host.appendChild(card);
  }

  async function save() {
    const msg = host.querySelector("#b-msg");
    try {
      if (!t.title.trim()) throw new Error("Give the test a title.");
      if (!t.id) t.id = slug(t.title);
      if (!t.questions.length) throw new Error("Add at least one question.");
      t.questions.forEach((q, i) => {
        const w = `Question ${i + 1}: `;
        if (!htmlToText(q.q).trim()) throw new Error(w + "the question text is empty.");
        if (q.type === "mcq" && q.options.some(o => !o.trim())) throw new Error(w + "fill in every option or remove the empty ones.");
        if (q.type === "output" && !q.code.trim()) throw new Error(w + "add the Java program.");
        if (q.type === "output" && !String(q.answer?.[0] || "").trim()) throw new Error(w + "add the correct output (or press ▶ Run to fill it).");
        if (q.type === "fill" && q.answer.some(a => !a.length)) throw new Error(w + "every blank needs a correct answer.");
        if (q.type === "code" && !String(q.expected || "").trim()) throw new Error(w + "add the expected output (or run your solution to fill it).");
      });
      const json = toJSON(t);
      const { pub, key } = splitTest(json);
      key.questions = key.questions || {};
      t.questions.forEach(q => { if (q.type === "code" && q.solution) key.questions[q.id].solution = q.solution; });
      if (isNew) {
        const all = await listTests();
        if (all.some(x => x.id === t.id) && !confirm(`A test with id "${t.id}" already exists. Replace it?`)) return;
      }
      if (existing) {                                 // keep run history so earlier submissions still match
        ["startedAt", "endsAt", "released", "createdAt"].forEach(f => { if (existing[f] !== undefined) pub[f] = existing[f]; });
      }
      await saveTest(t.id, pub, key);
      msg.className = "status ok"; msg.textContent = "✓ Saved";
      toast(`Saved "${t.title}" (${t.questions.length} questions)`);
      opts.onDone(t.id);
    } catch (e) {
      msg.className = "status bad"; msg.textContent = "✗ " + e.message;
    }
  }

  render();
}

// ---------- question bank (built from the course content) ----------
let bankCache = null;
async function loadBank(chapterId) {
  bankCache = bankCache || {};
  if (bankCache[chapterId]) return bankCache[chapterId];
  const ch = COURSE.find(c => c.id === chapterId);
  const items = [];
  for (const tp of ch.topics.filter(x => !x.soon)) {
    const data = (await import("../content/" + tp.file)).default;
    (data.quiz || []).forEach((q, i) => items.push({ key: `${tp.id}-qz${i}`, topic: tp.title, type: q.type === "output" ? "output" : "mcq", src: q }));
    (data.fill || []).forEach(f => items.push({ key: f.id, topic: tp.title, type: "fill", src: f }));
  }
  return (bankCache[chapterId] = items);
}
function bankToQuestion(it) {
  const s = it.src;
  if (it.type === "mcq") return { type: "mcq", marks: 1, q: s.q, code: s.code || "", options: s.options.slice(), answer: s.answer, explain: s.explain || "" };
  if (it.type === "output") return { type: "output", marks: 1, q: s.q || "Guess the output.", code: s.code, answer: [].concat(s.answer), explain: s.explain || "" };
  return { type: "fill", marks: 1, q: s.prompt, code: "", template: s.template, answer: s.answers.map(a => a.slice()), explain: s.explain || "" };
}

function openBank(host, onAdd) {
  const chosen = new Map();
  host.innerHTML = `<div class="card bank"><div style="display:flex;justify-content:space-between;align-items:center;gap:1rem;flex-wrap:wrap">
      <h3 style="margin:0">📚 Question bank</h3>
      <div class="btn-row" style="margin:0"><button class="btn-primary" id="bk-add" disabled>Add selected</button><button id="bk-close">Close</button></div></div>
    <p class="small muted">All quiz and fill-in-the-syntax questions from the course, with answers already checked. Pick a chapter, tick questions, then press Add.</p>
    <div class="btn-row">
      <select id="bk-ch">${COURSE.filter(c => c.topics.some(x => !x.soon)).map(c => `<option value="${c.id}">${esc(c.title)}</option>`).join("")}</select>
      <select id="bk-type"><option value="">All types</option><option value="mcq">Multiple choice</option><option value="output">Guess the output</option><option value="fill">Fill / correct the syntax</option></select>
      <button class="small" id="bk-all">Tick all shown</button><span class="small muted" id="bk-count"></span>
    </div>
    <div id="bk-list" class="bank-list"></div></div>`;
  host.scrollIntoView({ behavior: "smooth" });
  const upd = () => { const b = host.querySelector("#bk-add"); b.disabled = !chosen.size; b.textContent = `Add selected (${chosen.size})`; };
  const draw = async () => {
    const list = host.querySelector("#bk-list");
    list.innerHTML = `<p class="muted">Loading…</p>`;
    const items = (await loadBank(host.querySelector("#bk-ch").value)).filter(it => !host.querySelector("#bk-type").value || it.type === host.querySelector("#bk-type").value);
    host.querySelector("#bk-count").textContent = `${items.length} questions`;
    let topic = "";
    list.innerHTML = "";
    items.forEach(it => {
      if (it.topic !== topic) { topic = it.topic; list.insertAdjacentHTML("beforeend", `<div class="label">${esc(topic)}</div>`); }
      const q = bankToQuestion(it);
      const row = el(`<label class="bank-item"><input type="checkbox" ${chosen.has(it.key) ? "checked" : ""}>
        <div><span class="pill">${TYPES[q.type].icon} ${TYPES[q.type].label}</span> ${esc(htmlToText(q.q))}
        ${q.code ? `<pre class="codebox small" style="margin:.3rem 0;max-height:9rem;overflow:auto">${highlightJava(q.code)}</pre>` : ""}
        ${q.type === "fill" ? `<pre class="small mono" style="margin:.3rem 0">${esc(q.template)}</pre>` : ""}
        <span class="small muted">Answer: ${esc(q.type === "mcq" ? q.options[q.answer] : q.type === "output" ? q.answer[0] : q.answer.map(a => a[0]).join(" | "))}</span></div></label>`);
      row.querySelector("input").onchange = e => { e.target.checked ? chosen.set(it.key, q) : chosen.delete(it.key); upd(); };
      list.appendChild(row);
    });
  };
  host.querySelector("#bk-ch").onchange = draw;
  host.querySelector("#bk-type").onchange = draw;
  host.querySelector("#bk-all").onclick = () => host.querySelectorAll("#bk-list input").forEach(i => { if (!i.checked) { i.checked = true; i.dispatchEvent(new Event("change")); } });
  host.querySelector("#bk-close").onclick = () => { host.innerHTML = ""; };
  host.querySelector("#bk-add").onclick = () => {
    onAdd([...chosen.values()].map(q => JSON.parse(JSON.stringify(q))));
    host.innerHTML = "";
  };
  draw();
}
