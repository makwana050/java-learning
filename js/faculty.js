// Faculty (admin) dashboard: overview, tests (create/edit/run/grade), live monitor, gradebook, students, settings
import { esc, el, toast, fmtTime, downloadCSV, normBlank, highlightJava, pickQuestions } from "./ui.js";
import { store, listTests, getKey, saveTest, updateTest, listSubmissions, updateSubmission, listAllProgress, getAccess, saveAccess, isAllowed,
  deleteTest, deleteSubmission, submissionsOf, listAllSubmissions, progressOf, saveSettings, loadSettings, listLive, clearLive } from "./store.js";
import { ALLOWED_DOMAIN, FACULTY_EMAILS } from "./config.js";
import { outputsMatch, codeOnly, missingMust } from "./runner.js";
import { renderBuilder, toEditable, toJSON } from "./builder.js";
import { COURSE } from "../content/course.js";
const FACULTY_EMAILS_LIST = FACULTY_EMAILS.map(e => e.toLowerCase());
const FACULTY_EMAILS_TEXT = FACULTY_EMAILS.join(", ");

let tab = "overview";
let liveTimer = null;
const TABS = [["overview", "📊 Overview"], ["tests", "📝 Tests"], ["gradebook", "📒 Gradebook"], ["students", "👩‍🎓 Students"], ["settings", "⚙️ Settings & access"]];

export async function renderFaculty(app, sub) {
  clearInterval(liveTimer);
  if (sub && TABS.some(([k]) => k === sub)) tab = sub;
  app.innerHTML = `<div class="page admin" style="max-width:1250px">
    <h1>Faculty dashboard</h1>
    <div class="tabs">${TABS.map(([k, n]) => `<button data-t="${k}">${n}</button>`).join("")}</div>
    <div id="fbody"><p class="muted">Loading…</p></div></div>`;
  app.querySelectorAll(".tabs button").forEach(b => {
    b.classList.toggle("active", b.dataset.t === tab);
    b.onclick = () => { tab = b.dataset.t; renderFaculty(app); };
  });
  const body = app.querySelector("#fbody");
  try {
    if (tab === "overview") await overviewTab(body, app);
    else if (tab === "tests") await testsTab(body);
    else if (tab === "gradebook") await gradebookTab(body);
    else if (tab === "students") await studentsTab(body);
    else await settingsTab(body);
  } catch (e) {
    console.error(e);
    body.innerHTML = `<div class="warn"><b>Could not load this section.</b><br>${esc(e.message)}</div>`;
  }
}

// ================= Overview =================
async function loadAllResults() {
  const tests = await listTests();
  const out = [];
  for (const t of tests) {
    const [subs, key] = await Promise.all([listSubmissions(t.id), getKey(t.id)]);
    out.push({ t, key, subs: subs.map(s => ({ ...s, auto: gradeSubmission(t, key, s) })) });
  }
  return out.sort((a, b) => String(b.t.startedAt || b.t.createdAt).localeCompare(String(a.t.startedAt || a.t.createdAt)));
}

async function overviewTab(body, app) {
  const [progress, results] = await Promise.all([listAllProgress(), loadAllResults()]);
  const now = Date.now(), day = 86400000;
  const active7 = progress.filter(p => p.lastActive && now - new Date(p.lastActive).getTime() < 7 * day).length;
  const activeToday = progress.filter(p => p.lastActive && now - new Date(p.lastActive).getTime() < day).length;
  const runs = progress.reduce((a, p) => a + Object.values(p.items || {}).reduce((b, i) => b + (i.runs || 0), 0), 0);
  const solved = progress.reduce((a, p) => a + Object.values(p.items || {}).filter(i => i.solved).length, 0);
  const live = results.filter(r => r.t.open);
  const subsTotal = results.reduce((a, r) => a + r.subs.length, 0);
  body.innerHTML = `
    ${live.map(r => `<div class="note"><span class="live-dot"></span><b>${esc(r.t.title)}</b> is LIVE${r.t.endsAt ? ` until ${new Date(r.t.endsAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}` : ""} — ${r.subs.length} submitted so far.
      <button class="small" data-live="${esc(r.t.id)}">Open live monitor</button></div>`).join("")}
    <div class="kpi">
      <div class="stat"><b>${progress.length}</b><span>students signed in so far</span></div>
      <div class="stat"><b>${activeToday}</b><span>active in the last 24 h</span></div>
      <div class="stat"><b>${active7}</b><span>active in the last 7 days</span></div>
      <div class="stat"><b>${solved}</b><span>practice problems solved (all students)</span></div>
      <div class="stat"><b>${runs}</b><span>times Run was pressed</span></div>
      <div class="stat"><b>${results.length}</b><span>tests · ${subsTotal} submissions</span></div>
    </div>
    <div class="btn-row"><button class="btn-primary" id="ov-new">➕ Create a new test</button><button id="ov-gb">📒 Open gradebook</button><button id="ov-set">📢 Post an announcement</button></div>
    <h2>Tests</h2>
    ${results.length ? `<table class="tbl"><thead><tr><th>Test</th><th>Status</th><th class="num">Submitted</th><th class="num">Average</th><th class="num">Highest</th><th class="num">Lowest</th><th class="num">Left test (avg)</th></tr></thead><tbody>
      ${results.map(r => {
        const sc = r.subs.map(s => s.auto.total ? s.auto.score / s.auto.total * 100 : 0);
        const avg = sc.length ? sc.reduce((a, b) => a + b, 0) / sc.length : null;
        const leaves = r.subs.length ? r.subs.reduce((a, s) => a + (s.tabSwitches || 0), 0) / r.subs.length : 0;
        return `<tr><td><b>${esc(r.t.title)}</b><br><span class="small muted">${r.t.startedAt ? "last run " + new Date(r.t.startedAt).toLocaleString() : "never run"}</span></td>
          <td>${r.t.open ? '<span class="pill ok">LIVE</span>' : r.t.released ? '<span class="pill blue">Results published</span>' : '<span class="pill">Closed</span>'}</td>
          <td class="num">${r.subs.length}</td><td class="num">${avg == null ? "–" : avg.toFixed(0) + "%"}</td>
          <td class="num">${sc.length ? Math.max(...sc).toFixed(0) + "%" : "–"}</td><td class="num">${sc.length ? Math.min(...sc).toFixed(0) + "%" : "–"}</td>
          <td class="num">${leaves ? leaves.toFixed(1) : "0"}</td></tr>`;
      }).join("")}</tbody></table>` : `<p class="muted">No tests yet.</p>`}
    <h2>Students who may need help</h2>
    <p class="small muted">Signed in, but inactive for 7+ days or with no practice problem solved yet.</p>
    ${(() => {
      const weak = progress.filter(p => !p.lastActive || now - new Date(p.lastActive).getTime() > 7 * day || !Object.values(p.items || {}).some(i => i.solved));
      return weak.length ? `<table class="tbl"><thead><tr><th>Name</th><th>Email</th><th>Last active</th><th class="num">Solved</th></tr></thead><tbody>
        ${weak.slice(0, 50).map(p => `<tr><td>${esc(p.name)}</td><td class="small">${esc(p.email)}</td><td class="small">${p.lastActive ? new Date(p.lastActive).toLocaleDateString() : "–"}</td><td class="num">${Object.values(p.items || {}).filter(i => i.solved).length}</td></tr>`).join("")}</tbody></table>`
        : `<p>Everyone is active. 🎉</p>`;
    })()}`;
  body.querySelector("#ov-new").onclick = () => { tab = "tests"; renderFaculty(app).then(() => app.querySelector("#t-new")?.click()); };
  body.querySelector("#ov-gb").onclick = () => { tab = "gradebook"; renderFaculty(app); };
  body.querySelector("#ov-set").onclick = () => { tab = "settings"; renderFaculty(app); };
  body.querySelectorAll("[data-live]").forEach(b => b.onclick = async () => {
    tab = "tests"; await renderFaculty(app);
    const t = (await listTests()).find(x => x.id === b.dataset.live);
    liveMonitor(app.querySelector("#subs-host"), t);
  });
}

// ================= Gradebook =================
async function gradebookTab(body) {
  const results = (await loadAllResults()).filter(r => r.subs.length).reverse();
  const students = new Map();
  results.forEach(r => r.subs.forEach(s => {
    const key = s.uid;
    if (!students.has(key)) students.set(key, { name: s.name, email: s.email, roll: s.roll, marks: {} });
    const st = students.get(key);
    if (s.roll) st.roll = s.roll;
    st.marks[r.t.id] = s.auto;
  }));
  const rows = [...students.values()].sort((a, b) => String(a.roll).localeCompare(String(b.roll), undefined, { numeric: true }));
  const pct = (m) => m && m.total ? m.score / m.total * 100 : null;
  body.innerHTML = `<p class="muted">Final marks (after penalties and your adjustments) for every student in every test. Blank = did not submit.</p>
    <div class="btn-row"><button class="btn-primary" id="gb-csv">⬇ Download gradebook (CSV / Excel)</button></div>
    ${rows.length ? `<div style="overflow-x:auto"><table class="tbl"><thead><tr><th>Roll</th><th>Name</th>
      ${results.map(r => `<th class="num">${esc(r.t.title)}<br><span class="small muted">/${r.subs[0]?.auto.total ?? ""}</span></th>`).join("")}<th class="num">Average %</th></tr></thead><tbody>
      ${rows.map(s => {
        const ps = results.map(r => pct(s.marks[r.t.id])).filter(x => x != null);
        return `<tr><td>${esc(s.roll || "")}</td><td>${esc(s.name)}<br><span class="small muted">${esc(s.email)}</span></td>
          ${results.map(r => { const m = s.marks[r.t.id]; return `<td class="num">${m ? m.score : ""}</td>`; }).join("")}
          <td class="num"><b>${ps.length ? (ps.reduce((a, b) => a + b, 0) / ps.length).toFixed(1) : ""}</b></td></tr>`;
      }).join("")}</tbody></table></div>` : `<p class="muted">No submissions yet.</p>`}`;
  body.querySelector("#gb-csv").onclick = () => downloadCSV("gradebook.csv", [
    ["Roll", "Name", "Email", ...results.flatMap(r => [`${r.t.title} (marks)`, `${r.t.title} (out of)`]), "Average %"],
    ...rows.map(s => {
      const ps = results.map(r => pct(s.marks[r.t.id])).filter(x => x != null);
      return [s.roll, s.name, s.email, ...results.flatMap(r => { const m = s.marks[r.t.id]; return m ? [m.score, m.total] : ["", ""]; }),
        ps.length ? (ps.reduce((a, b) => a + b, 0) / ps.length).toFixed(1) : ""];
    }),
  ]);
}

// ================= Tests =================
const fmtClock = iso => iso ? new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "";

async function testsTab(body) {
  clearInterval(liveTimer);
  const tests = (await listTests()).sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
  const counts = Object.fromEntries(await Promise.all(tests.map(async t => [t.id, (await listSubmissions(t.id)).length])));
  body.innerHTML = `
    <div class="btn-row" style="margin-top:0">
      <button class="btn-primary" id="t-new">➕ Create a new test</button>
      <label class="btn" style="cursor:pointer">⬆ Upload a test file (.json)<input type="file" id="file" accept=".json,application/json" hidden></label>
      <span class="status" id="upmsg"></span>
    </div>
    <h2>Your tests</h2>
    ${tests.length ? `<table class="tbl"><thead><tr><th>Test</th><th class="num">Questions</th><th>Run the test</th><th>Results</th><th>Manage</th></tr></thead><tbody>
    ${tests.map(t => `<tr data-id="${esc(t.id)}"><td><b>${esc(t.title)}</b><br><code class="small">${esc(t.id)}</code>
        <br><span class="small muted">${counts[t.id]} submitted</span></td>
      <td class="num">${t.pick ? `${t.pick} of ${t.questions.length}<br><span class="small muted">random per student</span>` : t.questions.length}</td>
      <td>${t.open
        ? `<span class="pill ok"><span class="live-dot"></span>LIVE</span> <span class="small">started ${fmtClock(t.startedAt)}${t.endsAt ? `, ends <b>${fmtClock(t.endsAt)}</b>` : ""}</span><br>
           <button class="btn-primary small live" style="margin-top:.3rem">👁 Live monitor</button> <button class="small extend" style="margin-top:.3rem">+5 min</button> <button class="small toggle" style="margin-top:.3rem">■ Stop test</button>`
        : `<span class="pill">Not running</span>
           <div class="small settings" style="display:grid;grid-template-columns:auto auto;gap:.2rem .5rem;margin:.4rem 0;align-items:center">
             <span>Total time (min)</span><input type="number" class="dur" min="0" value="${t.durationMin || 30}" style="width:6ch">
             <span>Seconds per question <span class="muted">(0 = all on one page)</span></span><input type="number" class="pq" min="0" value="${t.perQuestionSec ?? 0}" style="width:6ch">
             <span>Marks deducted per leave</span><input type="number" class="pen" min="0" step="0.25" value="${t.penaltyPerLeave ?? 0}" style="width:6ch">
             <span>Auto-submit after leaves <span class="muted">(0 = never)</span></span><input type="number" class="auto" min="0" value="${t.autoSubmitAfter ?? 0}" style="width:6ch">
             <span>Require full screen</span><input type="checkbox" class="fs" ${t.requireFullscreen ? "checked" : ""}>
           </div>
           <button class="btn-run small start">▶ Start now</button>`}</td>
      <td>${t.released ? '<span class="pill blue">Published</span>' : '<span class="pill">Hidden</span>'}<br>
        <button class="btn-primary small subs" style="margin-top:.3rem">Submissions →</button></td>
      <td><div style="display:flex;flex-direction:column;gap:.3rem;align-items:flex-start">
        <button class="small edit" ${t.open ? "disabled title='Stop the test first'" : ""}>✏️ Edit</button>
        <button class="small dup">⧉ Duplicate</button>
        <button class="small dl">⬇ JSON</button>
        <button class="small del" ${t.open ? "disabled" : ""}>🗑 Delete</button></div></td></tr>`).join("")}
    </tbody></table>
    <p class="small muted">▶ Start opens the test for everyone with one shared end time (a student who starts late gets only the remaining time). Stop closes it immediately.<br>
    A <b>leave</b> is counted whenever a student switches tab or app, opens a sidebar or assistant (e.g. Copilot), shrinks or splits the window, exits full screen, presses Print Screen or opens the test in a second tab. Each leave costs the marks you set, and the question is hidden until they return.</p>` : `<p class="muted">No tests yet. Create one or upload a test file.</p>`}
    <div id="subs-host"></div>`;

  const openBuilder = (opts) => renderBuilder(body, { ...opts, onDone: () => testsTab(body) });
  body.querySelector("#t-new").onclick = () => openBuilder({ test: null });
  body.querySelector("#file").onchange = async e => {
    const msg = body.querySelector("#upmsg");
    try {
      const json = JSON.parse(await e.target.files[0].text());
      const { pub, key } = splitTest(json);
      (json.questions || []).forEach(q => { if (q.type === "code" && q.solution && key.questions[q.id]) key.questions[q.id].solution = q.solution; });
      if (tests.some(t => t.id === json.id) && !confirm(`A test with id "${json.id}" exists. Replace it?`)) return;
      await saveTest(json.id, pub, key);
      toast("Test uploaded. Press ▶ Start now when you are ready.");
      testsTab(body);
    } catch (err) { msg.className = "status bad"; msg.textContent = "✗ " + err.message; }
  };
  body.querySelectorAll("tr[data-id]").forEach(tr => {
    const t = tests.find(x => x.id === tr.dataset.id);
    tr.querySelector(".start")?.addEventListener("click", async () => {
      const num = (sel, f = parseFloat) => Math.max(0, f(tr.querySelector(sel).value) || 0);
      const d = num(".dur", v => parseInt(v, 10)), pq = num(".pq", v => parseInt(v, 10)), pen = num(".pen"), auto = num(".auto", v => parseInt(v, 10));
      const fs = tr.querySelector(".fs").checked;
      const n = t.pick || t.questions.length;
      if (pq && d && pq * n > d * 60 && !confirm(`${n} questions × ${pq}s = ${Math.ceil(pq * n / 60)} min, more than the total time of ${d} min. Start anyway?`)) return;
      if (counts[t.id] && !confirm(`${counts[t.id]} student(s) already submitted an earlier run of this test. Their submissions stay, and they will not be able to take it again unless you allow a re-attempt. Continue?`)) return;
      if (!confirm(`Start "${t.title}" now?\n\nTotal time: ${d ? d + " min" : "no limit"}\nPer question: ${pq ? pq + " s, one at a time" : "all on one page"}\nPenalty per leave: ${pen}\nAuto-submit after: ${auto || "never"}\nFull screen: ${fs ? "yes" : "no"}`)) return;
      const now = Date.now();
      await updateTest(t.id, { open: true, durationMin: d, perQuestionSec: pq, penaltyPerLeave: pen, autoSubmitAfter: auto, requireFullscreen: fs,
        startedAt: new Date(now).toISOString(), endsAt: d ? new Date(now + d * 60000).toISOString() : null });
      toast("Test is LIVE — tell students to open the Tests page");
      await testsTab(body);
      const tt = (await listTests()).find(x => x.id === t.id);
      liveMonitor(body.querySelector("#subs-host"), tt);
    });
    tr.querySelector(".extend")?.addEventListener("click", async () => {
      const base = t.endsAt ? new Date(t.endsAt).getTime() : Date.now();
      await updateTest(t.id, { endsAt: new Date(base + 5 * 60000).toISOString(), durationMin: (t.durationMin || 0) + 5 });
      toast("Extended by 5 minutes");
      testsTab(body);
    });
    tr.querySelector(".toggle")?.addEventListener("click", async () => {
      if (!confirm(`Stop "${t.title}"? Students who have not submitted will not be able to submit.`)) return;
      await updateTest(t.id, { open: false });
      testsTab(body);
    });
    tr.querySelector(".live")?.addEventListener("click", () => liveMonitor(body.querySelector("#subs-host"), t));
    tr.querySelector(".subs").onclick = () => submissionsView(body.querySelector("#subs-host"), t, body);
    tr.querySelector(".edit").onclick = async () => openBuilder({ test: toEditable(t, await getKey(t.id)), existing: t });
    tr.querySelector(".dup").onclick = async () => {
      const e = toEditable(t, await getKey(t.id));
      e.id = t.id + "-copy"; e.title = t.title + " (copy)";
      openBuilder({ test: e, asNew: true });
    };
    tr.querySelector(".dl").onclick = async () => {
      const blob = new Blob([JSON.stringify(toJSON(toEditable(t, await getKey(t.id))), null, 2)], { type: "application/json" });
      const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = t.id + ".json"; a.click();
    };
    tr.querySelector(".del").onclick = async () => {
      if (!confirm(`Delete the test "${t.title}"?${counts[t.id] ? `\n\n${counts[t.id]} submission(s) will stay in the gradebook, but you won't be able to re-grade them.` : ""}\n\nTip: download the JSON first as a backup.`)) return;
      await deleteTest(t.id);
      toast("Test deleted");
      testsTab(body);
    };
  });
}

// ---------- live monitor ----------
async function liveMonitor(host, t) {
  clearInterval(liveTimer);
  host.innerHTML = `<h2><span class="live-dot"></span>Live monitor — ${esc(t.title)}</h2><div id="lm"></div>`;
  const lm = host.querySelector("#lm");
  host.scrollIntoView({ behavior: "smooth" });
  const draw = async () => {
    if (!document.body.contains(lm)) return clearInterval(liveTimer);
    const [rows, subs] = await Promise.all([listLive(t.id), listSubmissions(t.id)]);
    const subUids = new Set(subs.map(s => s.uid));
    const all = rows.map(r => ({ ...r, done: subUids.has(r.uid) || r.status === "submitted" }));
    subs.forEach(s => { if (!all.some(r => r.uid === s.uid)) all.push({ uid: s.uid, name: s.name, email: s.email, roll: s.roll, done: true, leaves: s.tabSwitches || 0 }); });
    all.sort((a, b) => (b.leaves || 0) - (a.leaves || 0) || String(a.roll).localeCompare(String(b.roll), undefined, { numeric: true }));
    const writing = all.filter(r => !r.done), done = all.filter(r => r.done);
    const ago = iso => { if (!iso) return ""; const s = Math.round((Date.now() - new Date(iso).getTime()) / 1000); return s < 60 ? s + "s ago" : Math.floor(s / 60) + " min ago"; };
    const left = t.endsAt ? Math.max(0, Math.round((new Date(t.endsAt).getTime() - Date.now()) / 1000)) : null;
    lm.innerHTML = `<div class="kpi">
        <div class="stat"><b>${writing.length}</b><span>writing now</span></div>
        <div class="stat"><b>${done.length}</b><span>submitted</span></div>
        <div class="stat"><b style="color:var(--bad)">${all.filter(r => (r.leaves || 0) > 0).length}</b><span>students who left the test at least once</span></div>
        <div class="stat"><b>${left == null ? "–" : Math.floor(left / 60) + ":" + String(left % 60).padStart(2, "0")}</b><span>time left</span></div></div>
      <p class="small muted">Refreshes every 10 seconds · last update ${new Date().toLocaleTimeString()}</p>
      <table class="tbl"><thead><tr><th>Roll</th><th>Name</th><th>Status</th><th class="num">Question</th><th class="num">Left test</th><th>Last event</th><th>Last seen</th></tr></thead><tbody>
      ${all.map(r => `<tr style="${(r.leaves || 0) >= 2 ? "background:#fdecec" : ""}"><td>${esc(r.roll || "")}</td><td>${esc(r.name)}<br><span class="small muted">${esc(r.email || "")}</span></td>
        <td>${r.done ? '<span class="pill ok">Submitted</span>' : r.away ? '<span class="pill bad">AWAY from test</span>' : '<span class="pill blue">Writing</span>'}</td>
        <td class="num">${r.done ? "–" : r.cur != null ? `${r.cur + 1} / ${r.n}` : ""}</td>
        <td class="num" style="${r.leaves ? "color:var(--bad);font-weight:700" : ""}">${r.leaves || 0}</td>
        <td class="small">${esc(r.last || "")}</td><td class="small">${ago(r.updatedAt)}</td></tr>`).join("") || `<tr><td colspan="7" class="muted">Nobody has started yet.</td></tr>`}
      </tbody></table>`;
  };
  await draw();
  liveTimer = setInterval(draw, 10000);
}

export function splitTest(json) {
  if (!json.id || !/^[\w-]+$/.test(json.id)) throw new Error('"id" is required (letters, numbers, - and _ only)');
  if (!json.title) throw new Error('"title" is required');
  if (!Array.isArray(json.questions) || !json.questions.length) throw new Error('"questions" must be a non-empty list');
  if (json.pick != null && (!Number.isInteger(json.pick) || json.pick < 1 || json.pick > json.questions.length))
    throw new Error(`"pick" must be a whole number from 1 to ${json.questions.length}`);
  const ids = new Set(), pubQ = [], keyQ = {};
  json.questions.forEach((q, i) => {
    const where = `Question ${i + 1}`;
    if (!q.id) q.id = "q" + (i + 1);
    if (ids.has(q.id)) throw new Error(`${where}: duplicate id "${q.id}"`); ids.add(q.id);
    if (!q.q) throw new Error(`${where}: "q" (question text) is missing`);
    const p = { id: q.id, type: q.type, q: q.q, marks: q.marks || 1 };
    if (q.code) p.code = q.code;
    if (q.timeSec) p.timeSec = q.timeSec;
    if (q.type === "mcq") {
      if (!Array.isArray(q.options) || !Number.isInteger(q.answer) || q.answer < 0 || q.answer >= q.options.length) throw new Error(`${where}: mcq needs "options" and "answer" (0 = first option)`);
      p.options = q.options; keyQ[q.id] = { answer: q.answer };
    } else if (q.type === "output") {
      if (q.answer == null) throw new Error(`${where}: output question needs "answer"`);
      keyQ[q.id] = { answer: [].concat(q.answer) };
    } else if (q.type === "fill") {
      const n = (q.template || "").split("___").length - 1;
      if (!n || !Array.isArray(q.answer) || q.answer.length !== n) throw new Error(`${where}: fill needs a "template" with ___ blanks and one "answer" entry per blank (${n} found)`);
      p.template = q.template; keyQ[q.id] = { answer: q.answer.map(a => [].concat(a)) };
    } else if (q.type === "code") {
      if (q.expected == null) throw new Error(`${where}: code question needs "expected" output`);
      if (q.showExpected !== false) p.expected = q.expected;
      if (q.starter) p.starter = q.starter;
      if (q.mustUse) p.mustUse = q.mustUse;
      keyQ[q.id] = { expected: q.expected, mustUse: q.mustUse || [] };
    } else throw new Error(`${where}: "type" must be mcq, output, fill or code`);
    if (q.explain) keyQ[q.id].explain = q.explain;
    pubQ.push(p);
  });
  return {
    pub: { title: json.title, instructions: json.instructions || "", durationMin: json.durationMin || 0, pick: json.pick || null,
      shuffle: json.shuffle !== false, perQuestionSec: json.perQuestionSec || 0, penaltyPerLeave: json.penaltyPerLeave || 0,
      autoSubmitAfter: json.autoSubmitAfter || 0, requireFullscreen: !!json.requireFullscreen, questions: pubQ, open: false, released: false, createdAt: "__now__" },
    key: { questions: keyQ },
  };
}

function gradeQuestion(q, k, a) {
  const m = q.marks || 1;
  if (!k || a == null) return { marks: 0 };
  if (q.type === "mcq") return { marks: a === k.answer ? m : 0 };
  if (q.type === "output") return { marks: k.answer.some(x => outputsMatch(a, x)) ? m : 0 };
  if (q.type === "fill") {
    const good = k.answer.filter((acc, i) => acc.some(x => normBlank(x) === normBlank((a || [])[i]))).length;
    return { marks: Math.round(m * good / k.answer.length * 100) / 100 };
  }
  if (q.type === "code") {
    const code = codeOnly(a.code || "");
    const outOk = a.status === "ok" && outputsMatch(a.output, k.expected);
    const missing = missingMust(a.code || "", k.mustUse);
    const lines = k.expected.split("\n").map(s => s.trim()).filter(Boolean);
    const hardcoded = lines.length > 1 && lines.every(l => code.includes(l));
    return { marks: outOk && !missing.length ? m : 0, flag: [hardcoded && "possible hard-coded output", missing.length && "missing: " + missing.join(", "), a.editedAfterRun && "code edited after last run"].filter(Boolean).join("; ") };
  }
  return { marks: 0 };
}

// Text versions of an answer and the correct answer (for review screens)
function answerTexts(q, k, a) {
  k = k || {};
  if (q.type === "mcq") return [a == null ? "(no answer)" : q.options[a], q.options[k.answer]];
  if (q.type === "output") return [a == null || a === "" ? "(no answer)" : a, (k.answer || [])[0]];
  if (q.type === "fill") return [(a || []).join("  |  ") || "(no answer)", (k.answer || []).map(x => x[0]).join("  |  ")];
  return [a?.output ?? "(not run)", k.expected];
}

function gradeSubmission(t, key, s) {
  const ids = s.picked && s.picked.length ? s.picked : t.questions.map(q => q.id);
  const byId = Object.fromEntries(t.questions.map(q => [q.id, q]));
  const per = {}, flags = [], review = [];
  let score = 0, total = 0;
  ids.forEach((id, i) => {
    const q = byId[id]; if (!q) return;
    const k = key?.questions?.[id];
    const g = gradeQuestion(q, k, s.answers?.[id]);
    if (s.override && s.override[id] != null) g.marks = s.override[id];
    per[id] = g.marks; score += g.marks; total += q.marks || 1;
    if (g.flag) flags.push(`Q${i + 1}: ${g.flag}`);
    const [yours, correct] = answerTexts(q, k, s.answers?.[id]);
    review.push({ n: i + 1, id, q: q.q, code: q.code || "", type: q.type, yours: String(yours ?? ""), correct: String(correct ?? ""), marks: g.marks, max: q.marks || 1, explain: k?.explain || "", secs: s.timeSpent?.[id] ?? null });
  });
  if (t.pick && s.picked && pickQuestions(t, s.uid).ids.join() !== s.picked.join()) flags.push("question set doesn't match the one assigned");
  if (s.tabSwitches) flags.push(`left the page ${s.tabSwitches}×`);
  if (s.pasteBlocked) flags.push(`tried to paste ${s.pasteBlocked}×`);
  const raw = Math.round(score * 100) / 100;
  const penalty = s.waivePenalty ? 0 : Math.min(raw, Math.round((s.tabSwitches || 0) * (t.penaltyPerLeave || 0) * 100) / 100);
  if (s.autoReason) flags.push("auto-submitted: " + s.autoReason);
  const final = Math.max(0, Math.min(total, Math.round((raw - penalty + (+s.adjust || 0)) * 100) / 100));
  return { per, raw, penalty, score: final, total, flags, review };
}

async function submissionsView(host, t, body) {
  clearInterval(liveTimer);
  host.innerHTML = `<p class="muted">Loading submissions…</p>`;
  const [subs, key] = await Promise.all([listSubmissions(t.id), getKey(t.id)]);
  subs.sort((a, b) => String(a.roll).localeCompare(String(b.roll), undefined, { numeric: true }));
  const graded = subs.map(s => ({ ...s, auto: gradeSubmission(t, key, s) }));
  const codeQs = t.questions.filter(q => q.type === "code");
  const pcts = graded.map(s => s.auto.total ? s.auto.score / s.auto.total * 100 : 0);
  const avg = pcts.length ? pcts.reduce((a, b) => a + b, 0) / pcts.length : 0;

  host.innerHTML = `<h2>Submissions — ${esc(t.title)}</h2>
    <div class="btn-row">
      <button class="btn-primary" id="rel">${t.released ? "Hide results from students" : "📢 Publish results to students"}</button>
      <button id="save">Save scores only</button>
      <button id="csv">⬇ Download CSV</button>
      ${codeQs.length ? `<button id="zip">⬇ Code (.zip for MOSS)</button><button id="sim">Check code similarity</button>` : ""}
    </div>
    <div class="kpi">
      <div class="stat"><b>${graded.length}</b><span>submitted</span></div>
      <div class="stat"><b>${avg.toFixed(0)}%</b><span>class average</span></div>
      <div class="stat"><b>${pcts.length ? Math.max(...pcts).toFixed(0) + "%" : "–"}</b><span>highest</span></div>
      <div class="stat"><b>${pcts.filter(p => p < 40).length}</b><span>below 40%</span></div>
      <div class="stat"><b style="color:var(--bad)">${graded.filter(s => s.tabSwitches).length}</b><span>left the test at least once</span></div>
    </div>
    <div id="sim-out"></div>
    <div style="overflow-x:auto"><table class="tbl"><thead><tr><th>Roll</th><th>Name</th><th>Submitted</th>
      <th class="num">Answers</th><th class="num">Left test</th><th class="num">Penalty</th><th class="num">Adjust</th><th class="num">Final</th><th class="num">%</th><th>Flags</th><th></th></tr></thead><tbody>
      ${graded.map((s, i) => `<tr><td>${esc(s.roll)}</td><td>${esc(s.name)}<br><span class="small muted">${esc(s.email)}</span></td>
        <td class="small">${s.submittedAt ? new Date(s.submittedAt).toLocaleString() : ""}${s.autoSubmit ? "<br>(auto)" : ""}</td>
        <td class="num">${s.auto.raw}</td>
        <td class="num" style="${s.tabSwitches ? "color:var(--bad);font-weight:700" : ""}">${s.tabSwitches || 0}</td>
        <td class="num" style="${s.auto.penalty ? "color:var(--bad)" : ""}">${s.auto.penalty ? "−" + s.auto.penalty : s.waivePenalty ? "waived" : 0}</td>
        <td class="num">${s.adjust ? (s.adjust > 0 ? "+" : "") + s.adjust : ""}</td>
        <td class="num"><b>${s.auto.score}</b> / ${s.auto.total}</td>
        <td class="num">${s.auto.total ? Math.round(s.auto.score / s.auto.total * 100) : 0}</td>
        <td class="small" style="color:var(--bad)">${esc(s.auto.flags.filter(f => !/left the page|tried to paste/.test(f)).join(" | "))}</td>
        <td><button class="small view" data-i="${i}">View / adjust</button></td></tr>`).join("") || `<tr><td colspan="11" class="muted">No submissions yet.</td></tr>`}
    </tbody></table></div>
    <div id="detail"></div>
    ${graded.length ? analysisHTML(t, key, graded) : ""}`;

  const saveScores = async released => {
    await Promise.all(graded.map(s => updateSubmission(s.id, { score: s.auto.score, raw: s.auto.raw, penalty: s.auto.penalty, total: s.auto.total, per: s.auto.per, review: s.auto.review, released })));
  };
  host.querySelector("#save").onclick = async () => { await saveScores(!!t.released); toast("Scores saved"); };
  host.querySelector("#rel").onclick = async () => {
    const rel = !t.released;
    await saveScores(rel); await updateTest(t.id, { released: rel });
    toast(rel ? "Results published — students can now see their marks and answers" : "Results hidden");
    await testsTab(body);
    const tt = (await listTests()).find(x => x.id === t.id);
    submissionsView(body.querySelector("#subs-host"), tt, body);
  };
  host.querySelector("#csv").onclick = () => downloadCSV(`${t.id}-results.csv`, [
    ["Roll", "Name", "Email", "Submitted", "Answers score", "Penalty", "Adjustment", "Final", "Out of", "Percent", "Left test", "Paste tries", ...t.questions.map(q => q.id), "Flags", "Note"],
    ...graded.map(s => [s.roll, s.name, s.email, s.submittedAt, s.auto.raw, s.auto.penalty, s.adjust || 0, s.auto.score, s.auto.total, s.auto.total ? Math.round(s.auto.score / s.auto.total * 100) : 0,
      s.tabSwitches || 0, s.pasteBlocked || 0, ...t.questions.map(q => s.auto.per[q.id] ?? ""), s.auto.flags.join(" | "), s.adjustNote || ""]),
  ]);
  host.querySelectorAll(".view").forEach(b => b.onclick = () => showDetail(host.querySelector("#detail"), t, graded[+b.dataset.i], () => submissionsView(host, t, body)));
  if (codeQs.length) {
    host.querySelector("#zip").onclick = () => {
      const files = [];
      graded.forEach(s => codeQs.forEach(q => {
        const code = s.answers?.[q.id]?.code; if (!code) return;
        const who = String(s.roll || s.uid).replace(/[^\w-]/g, "_");
        files.push([`${t.id}/${q.id}/${who}.java`, code]);
      }));
      const blob = makeZip(files);
      const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `${t.id}-code.zip`; a.click();
    };
    host.querySelector("#sim").onclick = () => similarityReport(host.querySelector("#sim-out"), codeQs, graded);
  }
}

// question-wise analysis + score distribution
function analysisHTML(t, key, graded) {
  const stats = t.questions.map(q => {
    const got = graded.filter(s => s.auto.per[q.id] != null);
    const full = got.filter(s => s.auto.per[q.id] >= (q.marks || 1)).length;
    const times = got.map(s => s.timeSpent?.[q.id]).filter(x => x != null);
    return { q, n: got.length, pct: got.length ? full / got.length * 100 : null, avgT: times.length ? times.reduce((a, b) => a + b, 0) / times.length : null };
  }).filter(x => x.n).sort((a, b) => a.pct - b.pct);
  const buckets = [0, 0, 0, 0, 0];
  graded.forEach(s => { const p = s.auto.total ? s.auto.score / s.auto.total * 100 : 0; buckets[Math.min(4, Math.floor(p / 20))]++; });
  const maxB = Math.max(1, ...buckets);
  const label = ["0–19%", "20–39%", "40–59%", "60–79%", "80–100%"];
  return `<h2>Class analysis</h2>
    <div class="card"><h3>Score distribution</h3>
      ${buckets.map((b, i) => `<div style="display:flex;align-items:center;gap:.6rem;margin:.25rem 0"><span class="small" style="width:5.5rem">${label[i]}</span>
        <span class="bar ${i < 2 ? "bad" : i < 3 ? "mid" : "ok"}" style="width:${b / maxB * 60}%"></span><span class="small">${b}</span></div>`).join("")}</div>
    <div class="card"><h3>Question difficulty <span class="small muted">(hardest first — teach these again)</span></h3>
      <table class="tbl"><thead><tr><th>Question</th><th>Type</th><th class="num">Students who got it</th><th class="num">Fully correct</th><th class="num">Avg time</th></tr></thead><tbody>
      ${stats.map(x => `<tr><td class="small">${esc(String(x.q.q).replace(/<[^>]+>/g, "").slice(0, 110))}</td><td class="small">${x.q.type}</td><td class="num">${x.n}</td>
        <td class="num"><span class="bar ${x.pct < 40 ? "bad" : x.pct < 70 ? "mid" : "ok"}" style="width:${Math.max(2, x.pct * .6)}px"></span> ${x.pct.toFixed(0)}%</td>
        <td class="num">${x.avgT == null ? "–" : x.avgT.toFixed(0) + "s"}</td></tr>`).join("")}</tbody></table></div>`;
}

export function reviewHTML(review) {
  return review.map(r => `<div class="q"><b>Q${r.n}.</b> <span class="pill ${r.marks >= r.max ? "ok" : r.marks > 0 ? "blue" : "bad"}">${r.marks} / ${r.max}</span>${r.secs != null ? ` <span class="small muted">${r.secs}s</span>` : ""} ${r.q}
    ${r.code ? `<pre class="codebox" style="margin:.5rem 0">${highlightJava(r.code)}</pre>` : ""}
    <div class="split"><div><div class="label">Answer given</div><pre class="outbox ${r.marks >= r.max ? "ok" : "bad"}">${esc(r.yours)}</pre></div>
    <div><div class="label">Correct answer</div><pre class="outbox">${esc(r.correct)}</pre></div></div>
    ${r.explain ? `<div class="explain">${r.explain}</div>` : ""}</div>`).join("");
}

function showDetail(host, t, s, refresh) {
  const a = s.answers || {};
  const codeBlocks = t.questions.filter(q => q.type === "code" && a[q.id]).map(q => `<div class="label">Code for ${esc(q.id)} (${a[q.id].runs || 0} runs)</div><pre class="codebox">${highlightJava(a[q.id].code || "")}</pre>`).join("");
  host.innerHTML = `<div class="card"><div style="display:flex;justify-content:space-between;gap:1rem;flex-wrap:wrap"><h3 style="margin:0">${esc(s.name)} — roll ${esc(s.roll)} · ${s.auto.score} / ${s.auto.total}</h3>
      <button class="small" id="d-close">Close</button></div>
    <p class="small muted">Started ${s.startedAt ? new Date(s.startedAt).toLocaleString() : "?"} · Submitted ${s.submittedAt ? new Date(s.submittedAt).toLocaleString() : "?"} · left the test ${s.tabSwitches || 0}× · paste tries ${s.pasteBlocked || 0}</p>

    <div class="card" style="background:#faf9f6">
      <h3 style="margin-top:0">Adjust marks</h3>
      <p class="small"><b>Answers ${s.auto.raw}</b> − penalty ${s.auto.penalty} ${s.adjust ? `${s.adjust > 0 ? "+" : "−"} adjustment ${Math.abs(s.adjust)}` : ""} = <b>${s.auto.score} / ${s.auto.total}</b></p>
      <div class="btn-row" style="align-items:center">
        <label class="small">Add / subtract marks <input type="number" step="0.5" id="d-adj" value="${s.adjust || 0}" style="width:7ch"></label>
        <label class="small" style="display:flex;gap:.3rem;align-items:center"><input type="checkbox" id="d-waive" ${s.waivePenalty ? "checked" : ""}> Waive the leave penalty</label>
      </div>
      <label class="block">Note (reason, for your records)<input class="in" id="d-note" value="${esc(s.adjustNote || "")}" placeholder="e.g. power cut — penalty waived"></label>
      <p class="small muted">You can also change the marks of single questions below (useful for partial credit on code).</p>
      <div class="btn-row">
        <button class="btn-primary" id="d-save">Save adjustments</button>
        <button id="d-reattempt" style="color:var(--bad)">↺ Allow re-attempt (delete this submission)</button>
      </div>
    </div>

    ${s.events?.length ? `<h3>Activity log</h3><table class="tbl" style="margin-bottom:1rem"><thead><tr><th class="num">Time into test</th><th>Event</th></tr></thead><tbody>
      ${s.events.map(e => `<tr><td class="num">${Math.floor(e.at / 60)}:${String(e.at % 60).padStart(2, "0")}</td><td>${esc(e.type)}</td></tr>`).join("")}</tbody></table>` : `<p class="small muted">No activity events recorded.</p>`}
    <h3>Answers</h3>
    ${s.auto.review.map(r => `<div class="q-ov">${reviewHTML([r])}<div class="small" style="margin:-.4rem 0 .8rem">Marks for this question:
      <input type="number" step="0.25" min="0" max="${r.max}" class="ov" data-id="${esc(r.id)}" value="${r.marks}" style="width:6ch"> / ${r.max}
      ${s.override?.[r.id] != null ? '<span class="pill blue">changed by you</span>' : ""}</div></div>`).join("")}
    ${codeBlocks}</div>`;
  host.scrollIntoView({ behavior: "smooth" });
  host.querySelector("#d-close").onclick = () => { host.innerHTML = ""; };
  host.querySelector("#d-save").onclick = async () => {
    const override = { ...(s.override || {}) };
    host.querySelectorAll(".ov").forEach(inp => {
      const r = s.auto.review.find(x => x.id === inp.dataset.id);
      const v = parseFloat(inp.value);
      if (!isNaN(v) && Math.abs(v - r.marks) > 1e-9) override[r.id] = Math.max(0, Math.min(r.max, v));
    });
    await updateSubmission(s.id, { adjust: parseFloat(host.querySelector("#d-adj").value) || 0, waivePenalty: host.querySelector("#d-waive").checked,
      adjustNote: host.querySelector("#d-note").value, override });
    toast("Saved. Press “Publish results” (or “Save scores only”) to update what the student sees.");
    refresh();
  };
  host.querySelector("#d-reattempt").onclick = async () => {
    if (!confirm(`Delete ${s.name}'s submission so they can take "${t.title}" again?\nTheir current answers will be lost (download the CSV first if you need them).\nThe test must be live for them to retake it.`)) return;
    await deleteSubmission(s.id);
    await clearLive(t.id, s.uid);
    toast("Submission deleted — the student can start the test again while it is live.");
    refresh();
  };
}

// ---- quick similarity check (token 4-gram Jaccard; identifiers renamed so variable renaming does not hide copying)
function fingerprint(code) {
  const toks = codeOnly(code).replace(/"(?:\\.|[^"\\])*"/g, '"S"').match(/[A-Za-z_]\w*|\d+|\S/g) || [];
  const KW = /^(public|private|protected|static|void|int|long|double|float|char|boolean|byte|short|class|new|return|if|else|for|while|do|switch|case|break|continue|String|System|out|println|print|printf|Scanner|this|super|final|true|false|null)$/;
  const norm = toks.map(t => /^[A-Za-z_]/.test(t) && !KW.test(t) ? "V" : t);
  const set = new Set();
  for (let i = 0; i + 4 <= norm.length; i++) set.add(norm.slice(i, i + 4).join(" "));
  return set;
}
function similarityReport(host, codeQs, subs) {
  const rows = [];
  codeQs.forEach(q => {
    const fps = subs.map(s => ({ s, code: s.answers?.[q.id]?.code })).filter(x => x.code && x.code.length > 60).map(x => ({ ...x, fp: fingerprint(x.code) }));
    for (let i = 0; i < fps.length; i++) for (let j = i + 1; j < fps.length; j++) {
      const A = fps[i].fp, B = fps[j].fp; let inter = 0; A.forEach(x => B.has(x) && inter++);
      const sim = inter / (A.size + B.size - inter || 1);
      if (sim >= 0.8) rows.push([q.id, fps[i].s, fps[j].s, sim]);
    }
  });
  rows.sort((a, b) => b[3] - a[3]);
  host.innerHTML = `<div class="card"><h3>Code similarity (80% or more)</h3>
    <p class="small muted">A quick in-browser check that compares the structure of every pair of answers (variable names ignored). Short, simple programs naturally look alike, so treat this as a pointer for a closer look — for the full report, run MOSS on the downloaded zip (see README).</p>
    ${rows.length ? `<table class="tbl"><thead><tr><th>Question</th><th>Student A</th><th>Student B</th><th class="num">Similarity</th></tr></thead><tbody>
    ${rows.map(([q, a, b, s]) => `<tr><td>${esc(q)}</td><td>${esc(a.roll)} · ${esc(a.name)}</td><td>${esc(b.roll)} · ${esc(b.name)}</td><td class="num"><b>${Math.round(s * 100)}%</b></td></tr>`).join("")}</tbody></table>`
    : `<p>No pairs at 80% or above.</p>`}</div>`;
}

// ---- minimal ZIP writer (no compression)
function makeZip(files) {
  const enc = new TextEncoder(), parts = [], central = [];
  let offset = 0;
  const crcTable = Array.from({ length: 256 }, (_, n) => { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; return c >>> 0; });
  const crc32 = b => { let c = 0xffffffff; for (const x of b) c = crcTable[(c ^ x) & 0xff] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; };
  for (const [name, text] of files) {
    const nb = enc.encode(name), data = enc.encode(text), crc = crc32(data);
    const h = new DataView(new ArrayBuffer(30));
    h.setUint32(0, 0x04034b50, true); h.setUint16(4, 20, true); h.setUint16(8, 0, true);
    h.setUint32(14, crc, true); h.setUint32(18, data.length, true); h.setUint32(22, data.length, true); h.setUint16(26, nb.length, true);
    parts.push(h, nb, data);
    const c = new DataView(new ArrayBuffer(46));
    c.setUint32(0, 0x02014b50, true); c.setUint16(4, 20, true); c.setUint16(6, 20, true);
    c.setUint32(16, crc, true); c.setUint32(20, data.length, true); c.setUint32(24, data.length, true); c.setUint16(28, nb.length, true); c.setUint32(42, offset, true);
    central.push(c, nb);
    offset += 30 + nb.length + data.length;
  }
  const size = central.reduce((a, p) => a + p.byteLength, 0);
  const end = new DataView(new ArrayBuffer(22));
  end.setUint32(0, 0x06054b50, true); end.setUint16(8, files.length, true); end.setUint16(10, files.length, true);
  end.setUint32(12, size, true); end.setUint32(16, offset, true);
  return new Blob([...parts, ...central, end], { type: "application/zip" });
}

// ================= Students =================
async function studentsTab(body) {
  const [prog, allSubs] = await Promise.all([listAllProgress(), listAllSubmissions()]);
  const known = new Set(prog.map(p => p.id));
  allSubs.forEach(s => { if (!known.has(s.uid)) { known.add(s.uid); prog.push({ id: s.uid, name: s.name, email: s.email, lastActive: s.submittedAt, items: {}, time: {} }); } });
  const testsTaken = {}; allSubs.forEach(s => { testsTaken[s.uid] = (testsTaken[s.uid] || 0) + 1; });
  const rows = prog.map(p => {
    const items = Object.values(p.items || {});
    const sum = f => items.reduce((a, i) => a + (f(i) || 0), 0);
    return { uid: p.id, tests: testsTaken[p.id] || 0, name: p.name, email: p.email, last: p.lastActive, solved: sum(i => i.solved ? 1 : 0), runs: sum(i => i.runs), hints: sum(i => i.hints), sols: sum(i => i.solution ? 1 : 0), time: Object.values(p.time || {}).reduce((a, b) => a + b, 0) };
  }).sort((a, b) => String(b.last).localeCompare(String(a.last)));
  body.innerHTML = `<p class="muted">Every student who has signed in or taken a test. Click a name for their full profile (practice by chapter + every test result).</p>
    <div class="btn-row"><input class="in" id="st-q" placeholder="Search name or email…" style="max-width:320px"><button id="csv" class="small">⬇ Download CSV</button></div>
    <table class="tbl"><thead><tr><th>Name</th><th>Email</th><th>Last active</th><th class="num">Solved</th><th class="num">Runs</th><th class="num">Hints</th><th class="num">Solutions viewed</th><th class="num">Time</th><th class="num">Tests taken</th></tr></thead><tbody id="st-body"></tbody></table>
    <div id="profile"></div>`;
  const draw = () => {
    const q = body.querySelector("#st-q").value.toLowerCase();
    body.querySelector("#st-body").innerHTML = rows.filter(r => !q || (r.name + " " + r.email).toLowerCase().includes(q)).map(r => `<tr>
      <td><a href="javascript:void 0" data-uid="${esc(r.uid)}">${esc(r.name || "(no name)")}</a></td><td class="small">${esc(r.email)}</td><td class="small">${r.last ? new Date(r.last).toLocaleString() : ""}</td>
      <td class="num">${r.solved}</td><td class="num">${r.runs}</td><td class="num">${r.hints}</td><td class="num">${r.sols}</td><td class="num">${fmtTime(r.time)}</td><td class="num">${r.tests}</td></tr>`).join("") || `<tr><td colspan="9" class="muted">No students found.</td></tr>`;
    body.querySelectorAll("[data-uid]").forEach(a => a.onclick = () => studentProfile(body.querySelector("#profile"), rows.find(r => r.uid === a.dataset.uid)));
  };
  body.querySelector("#st-q").oninput = draw;
  draw();
  body.querySelector("#csv").onclick = () => downloadCSV("student-activity.csv", [["Name", "Email", "Last active", "Solved", "Runs", "Hints", "Solutions viewed", "Minutes"],
    ...rows.map(r => [r.name, r.email, r.last, r.solved, r.runs, r.hints, r.sols, Math.round(r.time / 60)])]);
}

async function studentProfile(host, r) {
  host.innerHTML = `<p class="muted">Loading ${esc(r.name)}…</p>`;
  host.scrollIntoView({ behavior: "smooth" });
  const [p, subs, tests] = await Promise.all([progressOf(r.uid), submissionsOf(r.uid), listTests()]);
  const items = p?.items || {};
  const chapters = await Promise.all(COURSE.filter(c => c.topics.some(x => !x.soon)).map(async c => {
    let total = 0, solved = 0, runs = 0, time = 0;
    for (const tp of c.topics.filter(x => !x.soon)) {
      const d = (await import("../content/" + tp.file)).default;
      (d.practice || []).forEach(pr => { total++; if (items[pr.id]?.solved) solved++; runs += items[pr.id]?.runs || 0; });
      time += p?.time?.[tp.id] || 0;
    }
    return { c, total, solved, runs, time };
  }));
  const results = [];
  for (const s of subs) {
    const t = tests.find(x => x.id === s.testId);
    const key = t ? await getKey(t.id) : null;
    results.push({ s, t, g: t ? gradeSubmission(t, key, s) : null });
  }
  host.innerHTML = `<div class="card"><div style="display:flex;justify-content:space-between;gap:1rem;flex-wrap:wrap">
      <h3 style="margin:0">👩‍🎓 ${esc(r.name)} <span class="small muted">${esc(r.email)}</span></h3><button class="small" id="p-close">Close</button></div>
    <div class="kpi"><div class="stat"><b>${r.solved}</b><span>practice problems solved</span></div><div class="stat"><b>${r.runs}</b><span>Run clicks</span></div>
      <div class="stat"><b>${r.sols}</b><span>solutions viewed</span></div><div class="stat"><b>${fmtTime(r.time)}</b><span>time learning</span></div></div>
    <h3>Practice by chapter</h3>
    <table class="tbl"><thead><tr><th>Chapter</th><th>Solved</th><th class="num">Runs</th><th class="num">Time</th></tr></thead><tbody>
      ${chapters.map(x => `<tr><td>${esc(x.c.title)}</td><td><span class="bar ${x.solved / x.total > .7 ? "ok" : x.solved ? "mid" : "bad"}" style="width:${Math.max(2, x.solved / x.total * 120)}px"></span> ${x.solved}/${x.total}</td>
        <td class="num">${x.runs}</td><td class="num">${fmtTime(x.time)}</td></tr>`).join("")}</tbody></table>
    <h3>Test results</h3>
    ${results.length ? `<table class="tbl"><thead><tr><th>Test</th><th>Submitted</th><th class="num">Final</th><th class="num">Left test</th></tr></thead><tbody>
      ${results.map(x => `<tr><td>${esc(x.s.testTitle || x.s.testId)}</td><td class="small">${x.s.submittedAt ? new Date(x.s.submittedAt).toLocaleString() : ""}</td>
        <td class="num">${x.g ? `<b>${x.g.score}</b> / ${x.g.total}` : (x.s.score ?? "–")}</td><td class="num">${x.s.tabSwitches || 0}</td></tr>`).join("")}</tbody></table>` : `<p class="muted">No tests taken yet.</p>`}
  </div>`;
  host.querySelector("#p-close").onclick = () => { host.innerHTML = ""; };
}

// ================= Settings & access =================
function parseEmails(text) {
  const all = text.toLowerCase().split(/[\s,;]+/).map(s => s.trim()).filter(Boolean);
  const valid = [...new Set(all.filter(e => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e)))].sort();
  return { valid, invalid: all.filter(e => !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e)) };
}

async function settingsTab(body) {
  const [acc, settings] = await Promise.all([getAccess(), loadSettings()]);
  const access = acc || { mode: "domain", emails: [] };
  const hidden = new Set(settings.hiddenChapters || []);
  body.innerHTML = `
  <div class="card"><h3>📢 Announcement on the students' home page</h3>
    <textarea class="in" id="an-text" rows="3" placeholder="e.g. Java Quiz on Monday 10:00 AM — revise Chapters 1–5. Bring your laptop charged.">${esc(settings.announcement || "")}</textarea>
    <div class="btn-row"><label class="small" style="display:flex;gap:.4rem;align-items:center"><input type="checkbox" id="an-on" ${settings.announcementOn ? "checked" : ""}> Show it</label>
      <button class="btn-primary" id="an-save">Save announcement</button><span class="status" id="an-msg"></span></div></div>

  <div class="card"><h3>📚 Chapters visible to students</h3>
    <p class="small muted">Untick chapters you haven't taught yet. Students won't see them; you still see everything (marked "hidden").</p>
    ${COURSE.map(c => `<label style="display:flex;gap:.5rem;align-items:center;margin:.25rem 0"><input type="checkbox" class="ch-vis" value="${c.id}" ${hidden.has(c.id) ? "" : "checked"}> ${esc(c.title)}</label>`).join("")}
    <div class="btn-row"><button class="small" id="ch-all">Show all</button><button class="btn-primary" id="ch-save">Save chapters</button><span class="status" id="ch-msg"></span></div></div>

  <div class="card"><h3>🔐 Who can sign in?</h3>
    <label class="opt" style="display:flex;gap:.5rem;align-items:baseline"><input type="radio" name="mode" value="domain" ${access.mode !== "list" ? "checked" : ""}>
      <span><b>Any @${esc(ALLOWED_DOMAIN)} account</b>, plus the extra emails listed below</span></label>
    <label class="opt" style="display:flex;gap:.5rem;align-items:baseline;margin-top:.3rem"><input type="radio" name="mode" value="list" ${access.mode === "list" ? "checked" : ""}>
      <span><b>Only the emails listed below</b> (everyone else is blocked, even @${esc(ALLOWED_DOMAIN)} accounts)</span></label>
    <div class="label">Allowed emails — one per line, or separated by commas (you can paste a column from Excel)</div>
    <textarea class="in" id="emails" rows="10" style="font-family:var(--mono);font-size:14px">${esc((access.emails || []).join("\n"))}</textarea>
    <div class="btn-row"><button class="btn-primary" id="save">Save access settings</button><span class="status" id="msg"></span></div>
    <p class="small muted">Faculty accounts (${esc(FACULTY_EMAILS_TEXT)}) always have access. These rules are enforced by the database, so a blocked account can't read or save anything even by changing the website code.</p>
    <div class="btn-row"><input class="in" id="probe" placeholder="Check an email, e.g. someone@rru.ac.in" style="max-width:360px;font-family:var(--mono)"><button id="check">Check</button><span class="status" id="pmsg"></span></div>
  </div>

  <div class="card"><h3>💾 Backup</h3>
    <p class="small muted">Download every test (with answer keys) as JSON files, plus all submissions as one CSV. Keep these somewhere safe.</p>
    <button id="bk-all">⬇ Download full backup</button><span class="status" id="bk-msg"></span></div>`;

  body.querySelector("#an-save").onclick = async () => {
    await saveSettings({ announcement: body.querySelector("#an-text").value.trim(), announcementOn: body.querySelector("#an-on").checked });
    const m = body.querySelector("#an-msg"); m.className = "status ok"; m.textContent = "✓ Saved";
  };
  body.querySelector("#ch-all").onclick = () => body.querySelectorAll(".ch-vis").forEach(c => c.checked = true);
  body.querySelector("#ch-save").onclick = async () => {
    const hiddenChapters = [...body.querySelectorAll(".ch-vis")].filter(c => !c.checked).map(c => c.value);
    await saveSettings({ hiddenChapters });
    const m = body.querySelector("#ch-msg"); m.className = "status ok"; m.textContent = `✓ Saved — ${COURSE.length - hiddenChapters.length} chapter(s) visible`;
  };
  const mode = () => body.querySelector('input[name="mode"]:checked').value;
  body.querySelector("#save").onclick = async () => {
    const { valid, invalid } = parseEmails(body.querySelector("#emails").value);
    const msg = body.querySelector("#msg");
    if (mode() === "list" && !valid.length) { msg.className = "status bad"; msg.textContent = "Add at least one email, or everyone will be blocked."; return; }
    await saveAccess(mode(), valid);
    body.querySelector("#emails").value = valid.join("\n");
    msg.className = "status ok";
    msg.textContent = `✓ Saved — ${valid.length} email(s) listed` + (invalid.length ? `; ignored invalid: ${invalid.join(", ")}` : "");
  };
  body.querySelector("#check").onclick = async () => {
    const e = body.querySelector("#probe").value.trim().toLowerCase();
    const ok = FACULTY_EMAILS_LIST.includes(e) || isAllowed(e, (await getAccess()) || { mode: "domain", emails: [] });
    const m = body.querySelector("#pmsg");
    m.className = "status " + (ok ? "ok" : "bad");
    m.textContent = ok ? "✓ can sign in" : "✗ blocked";
  };
  body.querySelector("#bk-all").onclick = async () => {
    const m = body.querySelector("#bk-msg"); m.textContent = " preparing…";
    const results = await loadAllResults();
    const files = results.map(r => [`tests/${r.t.id}.json`, JSON.stringify(toJSON(toEditable(r.t, r.key)), null, 2)]);
    const rows = [["Test", "Roll", "Name", "Email", "Submitted", "Answers", "Penalty", "Adjust", "Final", "Out of", "Left test"]];
    results.forEach(r => r.subs.forEach(s => rows.push([r.t.title, s.roll, s.name, s.email, s.submittedAt, s.auto.raw, s.auto.penalty, s.adjust || 0, s.auto.score, s.auto.total, s.tabSwitches || 0])));
    files.push(["all-submissions.csv", "﻿" + rows.map(r => r.map(v => `"${String(v ?? "").replace(/"/g, '""')}"`).join(",")).join("\n")]);
    const a = document.createElement("a"); a.href = URL.createObjectURL(makeZip(files)); a.download = `java-lab-backup-${new Date().toISOString().slice(0, 10)}.zip`; a.click();
    m.className = "status ok"; m.textContent = ` ✓ ${results.length} test(s) backed up`;
  };
}
