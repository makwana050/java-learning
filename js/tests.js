// Student side of tests: list, take (with integrity rules), submit, see published results
import { esc, el, toast, fillTemplateHTML, pickQuestions, textCanvas, htmlToText } from "./ui.js";
import { store, listLiveIndex, getTest, mySubmissions, submitTest, setLive, loadExamState, saveExamState, clearExamState, getStart, saveStart, deviceId, takeHint } from "./store.js";
import { runJava, warmUp, primeCompiler } from "./runner.js";
import { createEditor } from "./editor.js";
import { phaseText } from "./topic.js";
import { reviewHTML } from "./faculty.js";

let tick = null;
let cleanup = () => {};

const hhmm = iso => new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

let listTimer = null;
const countdown = ms => { const s = Math.max(0, Math.round(ms / 1000)); const h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60), x = s % 60;
  return (h ? h + "h " : "") + String(m).padStart(h ? 2 : 1, "0") + "m " + String(x).padStart(2, "0") + "s"; };
const whenText = ms => new Date(ms).toLocaleString([], { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

export async function renderTests(app) {
  stopExam();
  const [index, subs] = await Promise.all([listLiveIndex(), mySubmissions()]);
  const done = new Set(subs.map(s => s.testId));
  const now = Date.now();
  const open = index.filter(t => !t.endsAtMs || now < t.endsAtMs + 120000)
    .sort((a, b) => (a.opensAtMs || 0) - (b.opensAtMs || 0));
  app.innerHTML = `<div class="page">
    <h1>Tests</h1><p class="lead">Live and upcoming tests appear here. You can submit each test once.</p>
    <h2>Live and upcoming</h2>
    ${open.length ? open.map(t => {
      const later = t.opensAtMs && now < t.opensAtMs;
      return `<div class="card" style="display:flex;justify-content:space-between;align-items:center;gap:1rem;flex-wrap:wrap">
      <div><h3 style="margin:0">${esc(t.title)}</h3><span class="muted small">${t.n} questions${later ? ` · opens <b>${whenText(t.opensAtMs)}</b>` : ""}${t.endsAtMs ? ` · ends at ${hhmm(new Date(t.endsAtMs).toISOString())}` : ""}</span></div>
      ${done.has(t.id) ? `<span class="pill ok">Submitted</span>`
        : later ? `<div style="text-align:right"><span class="pill blue">Starts in <b class="cd" data-at="${t.opensAtMs}">${countdown(t.opensAtMs - now)}</b></span><br><span class="small muted">The Start button appears here at the opening time.</span></div>`
        : `<a class="btn btn-primary" href="#/test/${encodeURIComponent(t.id)}">Start →</a>`}
    </div>`; }).join("") : `<p class="muted">No test is live or scheduled right now.</p>`}
    <h2>My results</h2>
    ${subs.length ? subs.map((s, i) => `<div class="card">
      <div style="display:flex;justify-content:space-between;gap:1rem;align-items:center;flex-wrap:wrap">
        <div><h3 style="margin:0">${esc(s.testTitle || s.testId)}</h3><span class="small muted">Submitted ${s.submittedAt ? new Date(s.submittedAt).toLocaleString() : ""}</span></div>
        ${s.released && s.score != null
          ? `<div style="text-align:right"><span style="font-size:1.6rem;font-weight:700">${s.score} / ${s.total}</span><br><span class="small muted">${s.total ? Math.round(s.score / s.total * 100) : 0}%</span></div>`
          : `<span class="pill">Result not published yet</span>`}
      </div>
      ${s.released && s.penalty ? `<p class="small" style="color:var(--bad);margin:.6rem 0 0">Answers scored ${s.raw}. Penalty −${s.penalty} for leaving the test ${s.tabSwitches}× → final ${s.score}.</p>` : ""}
      ${s.released && s.review ? `<div class="btn-row"><button class="small showrev" data-i="${i}">Show my answers</button></div><div class="rev" data-i="${i}" hidden>${reviewHTML(s.review)}</div>` : ""}
    </div>`).join("") : `<p class="muted">You have not submitted any test yet.</p>`}
  </div>`;
  // live countdown; the page refreshes itself when a test opens
  clearInterval(listTimer);
  if (app.querySelector(".cd")) listTimer = setInterval(() => {
    if (!document.body.contains(app) || location.hash !== "#/tests") return clearInterval(listTimer);
    let opened = false;
    app.querySelectorAll(".cd").forEach(el => { const left = +el.dataset.at - Date.now(); if (left <= 0) opened = true; else el.textContent = countdown(left); });
    if (opened) { clearInterval(listTimer); setTimeout(() => renderTests(app), 1500); }
  }, 1000);
  app.querySelectorAll(".showrev").forEach(b => b.onclick = () => {
    const r = app.querySelector(`.rev[data-i="${b.dataset.i}"]`);
    r.hidden = !r.hidden;
    b.textContent = r.hidden ? "Show my answers" : "Hide my answers";
  });
}

export function stopExam() {
  clearInterval(tick);
  clearInterval(listTimer);
  cleanup();
  cleanup = () => {};
  window.onbeforeunload = null;
  document.body.classList.remove("exam-mode");
}

export async function renderTakeTest(app, id) {
  stopExam();
  const subs = await mySubmissions();
  if (subs.some(s => s.testId === id)) {
    app.innerHTML = `<div class="page"><div class="note">You have already submitted this test. <a href="#/tests">See your result</a></div></div>`; return;
  }
  let t;
  try { t = await getTest(id); } catch { t = null; }
  if (!t || !t.open) {
    const sch = (await listLiveIndex().catch(() => [])).find(x => x.id === id && x.opensAtMs && Date.now() < x.opensAtMs);
    app.innerHTML = `<div class="page"><div class="warn">${sch ? `This test opens at <b>${whenText(sch.opensAtMs)}</b>. Please wait on the Tests page; the Start button appears there at that time.` : "This test is not live."} <a href="#/tests">Back to tests</a></div></div>`;
    return;
  }
  if (t.endsAt && Date.now() > new Date(t.endsAt).getTime()) { app.innerHTML = `<div class="page"><div class="warn">Time for this test is over. <a href="#/tests">Back to tests</a></div></div>`; return; }

  const retake = (t.retakes && t.retakes[store.user.uid]) || 0;
  const k = `test:${id}:${store.user.uid}:${t.startedAt || ""}${retake ? ":r" + retake : ""}`;
  let saved = JSON.parse(localStorage.getItem(k) || "null");
  let how = "page reloaded / re-opened";
  if (!saved?.startedAt) {
    // not in this browser: maybe the student started on another browser/computer (crash, power cut…)
    app.innerHTML = `<div class="page"><p class="muted">Loading…</p></div>`;
    const remote = await loadExamState(k);
    if (remote?.startedAt) { saved = remote; how = "continued on another browser or computer"; localStorage.setItem(k, JSON.stringify(saved)); }
  }
  if (!saved?.startedAt) return renderStart(app, t, k);
  saved.events = saved.events || [];
  saved.events.push({ at: Math.round((Date.now() - saved.startedAt) / 1000), type: how });
  saved.devices = saved.devices || [];
  if (!saved.devices.includes(deviceId())) {
    saved.devices.push(deviceId());
    if (saved.devices.length > 1) saved.events.push({ at: Math.round((Date.now() - saved.startedAt) / 1000), type: `opened on another device (${saved.devices.length} devices so far)` });
  }
  renderPaper(app, t, k, saved);
}

function rulesList(t) {
  const n = t.pick || t.questions.length;
  const r = [];
  r.push(`${n} questions${t.pick ? " — every student gets a different random set" : ""}.`);
  if (t.perQuestionSec && isOneAtATime(t)) r.push(`<b>One question at a time, at least ${t.perQuestionSec} seconds each</b> (the timer on each question shows its time). When the time is up the next question appears automatically. <b>You cannot go back.</b>`);
  else if (isOneAtATime(t)) r.push(`<b>One question at a time.</b> Press <b>Next</b> when you are ready. <b>You cannot go back</b> to earlier questions.`);
  if (t.endsAt) r.push(`The test ends at <b>${hhmm(t.endsAt)}</b> for everyone and submits automatically.`);
  if (t.requireFullscreen) r.push(`The test runs in <b>full screen</b>.`);
  r.push(`<b>Do not leave the test window.</b> Switching tab or app, opening a sidebar or assistant (e.g. Copilot), resizing/splitting the window${t.requireFullscreen ? ", leaving full screen" : ""} or pressing Print Screen is recorded.`);
  if (t.penaltyPerLeave) r.push(`<b>Each time you leave, ${t.penaltyPerLeave} mark${t.penaltyPerLeave === 1 ? "" : "s"} will be deducted.</b>`);
  if (t.autoSubmitAfter) r.push(`<b>After ${t.autoSubmitAfter} leaves, your test is submitted automatically.</b>`);
  r.push(`Copying, pasting and right-click are disabled. You can submit only once.`);
  return r.map(x => `<li>${x}</li>`).join("");
}

// A question box drawn inside the page. The browser's own confirm()/alert() pop-ups take focus
// away from the page and end full screen, which the test counts as leaving, so the test never uses them.
function askBox(message, { ok = "OK", cancel = "Cancel" } = {}) {
  return new Promise(resolve => {
    const wrap = document.createElement("div");
    wrap.className = "ask-box";
    wrap.style.cssText = "position:fixed;inset:0;z-index:10000;background:rgba(20,20,20,.45);display:flex;align-items:center;justify-content:center;padding:16px";
    wrap.innerHTML = `<div style="background:var(--card,#fff);color:inherit;max-width:460px;width:100%;border-radius:12px;padding:1.2rem 1.3rem;box-shadow:0 10px 40px rgba(0,0,0,.25)">
      <div style="white-space:pre-line;margin-bottom:1rem">${esc(message)}</div>
      <div class="btn-row" style="justify-content:flex-end">${cancel ? `<button class="ab-no">${esc(cancel)}</button>` : ""}<button class="btn-primary ab-yes">${esc(ok)}</button></div></div>`;
    const done = v => { wrap.remove(); resolve(v); };
    wrap.querySelector(".ab-yes").onclick = () => done(true);
    wrap.querySelector(".ab-no")?.addEventListener("click", () => done(false));
    document.body.appendChild(wrap);
    wrap.querySelector(".ab-yes").focus();
  });
}

// One question at a time? (older tests: yes whenever they have a per-question time)
export const isOneAtATime = t => t.oneAtATime != null ? !!t.oneAtATime : (t.perQuestionSec || 0) > 0;

// Roll / ID comes from the college email (e.g. 23ce045@student.rru.ac.in → 23CE045), so nobody can type someone else's.
export const rollFromEmail = email => (email || "").split("@")[0].toUpperCase();

async function renderStart(app, t, k) {
  app.innerHTML = `<div class="page"><p class="muted">Loading…</p></div>`;
  const st = await getStart(t.id);
  const alreadyIn = st && st.session === t.startedAt;          // e.g. allowed a re-attempt
  if (!alreadyIn && t.lateUntilMs && Date.now() > t.lateUntilMs) {
    app.innerHTML = `<div class="page" style="max-width:640px"><div class="warn"><b>Entry to this test closed at ${hhmm(new Date(t.lateUntilMs).toISOString())}.</b><br>
      You can't start it now. If you had a genuine problem, speak to your teacher.</div><a class="btn" href="#/tests">Back to tests</a></div>`;
    return;
  }
  const needCode = t.codeRequired && !alreadyIn;
  const roll = rollFromEmail(store.user.email);
  app.innerHTML = `<div class="page" style="max-width:720px"><div class="card">
    <div class="kicker">Test</div><h1>${esc(t.title)}</h1>
    ${t.instructions ? `<p>${t.instructions}</p>` : ""}
    <h3>Rules</h3><ul>${rulesList(t)}</ul>
    <div class="field"><div class="label">Signed in as</div><p style="margin:0">${esc(store.user.displayName)} (${esc(store.user.email)})</p></div>
    <div class="field"><div class="label">Roll / ID (from your college email)</div><p style="margin:0;font-weight:700;font-size:1.1rem">${esc(roll)}</p></div>
    ${needCode ? `<div class="field"><div class="label">Start code (your teacher shows it on screen)</div>
      <input id="code" inputmode="numeric" autocomplete="off" maxlength="6" placeholder="4 digits" style="font-family:var(--mono);font-size:1.4rem;letter-spacing:.3em;width:8ch"></div>` : ""}
    ${t.lateUntilMs && !alreadyIn ? `<p class="small muted">Entry closes at <b>${hhmm(new Date(t.lateUntilMs).toISOString())}</b>.</p>` : ""}
    <label style="display:flex;gap:.5rem;margin-top:1rem"><input type="checkbox" id="agree"> <span>I have read the rules and will not use any other app, tab, person or AI tool during the test.</span></label>
    <div class="btn-row"><button class="btn-primary" id="start">Start test</button><a class="btn btn-ghost" href="#/tests">Cancel</a></div>
  </div></div>`;
  app.querySelector("#start").onclick = async () => {
    if (!app.querySelector("#agree").checked) return toast("Please accept the rules first");
    const btn = app.querySelector("#start");
    if (!alreadyIn) {
      const code = needCode ? app.querySelector("#code").value.trim() : "";
      if (needCode && !/^\d{4,6}$/.test(code)) return toast("Enter the start code shown by your teacher");
      btn.disabled = true;
      try { await saveStart(t, code); }
      catch (e) {
        btn.disabled = false;
        if (t.lateUntilMs && Date.now() > t.lateUntilMs) return toast("Entry to this test has closed.");
        return toast(needCode ? "Wrong start code. Check the code on screen and try again." : "Could not start the test: " + (e.code || e.message));
      }
    }
    if (t.requireFullscreen) { try { await document.documentElement.requestFullscreen(); } catch { } }
    const { ids, optionOrder } = pickQuestions(t, store.user.uid);
    const s = { startedAt: Date.now(), roll, answers: {}, picked: ids, optionOrder, cur: 0, qEnds: null, timeSpent: {}, tabSwitches: 0, pasteBlocked: 0, events: [], devices: [deviceId()] };
    localStorage.setItem(k, JSON.stringify(s));
    saveExamState(k, s);
    renderPaper(app, t, k, s);
  };
}

function renderPaper(app, t, k, state) {
  // saved in this browser at once, and online every few seconds (and when the page is closed)
  let remoteTimer = null;
  const saveRemote = () => { clearTimeout(remoteTimer); remoteTimer = null; saveExamState(k, state); };
  const save = () => {
    localStorage.setItem(k, JSON.stringify(state));
    if (!remoteTimer) remoteTimer = setTimeout(saveRemote, 3000);
  };
  window.addEventListener("pagehide", () => { if (remoteTimer) saveRemote(); }, { once: true });
  const editors = {};
  const byId = Object.fromEntries(t.questions.map(q => [q.id, q]));
  const qs = (state.picked || t.questions.map(q => q.id)).map(id => byId[id]).filter(Boolean);
  const oneAtATime = isOneAtATime(t);
  const timedQs = oneAtATime && (t.perQuestionSec || 0) > 0;     // a countdown on each question
  const mark = `${state.roll} · ${store.user.email || ""}`;
  const since = () => Math.round((Date.now() - state.startedAt) / 1000);
  const log = type => { state.events.push({ at: since(), type }); if (state.events.length > 200) state.events.shift(); save(); };
  const live = (extra = {}) => setLive(t.id, { roll: state.roll, n: qs.length, cur: oneAtATime ? (state.cur ?? 0) : null, leaves: state.tabSwitches || 0, devices: (state.devices || []).length || 1,
    status: "writing", last: state.events.length ? state.events[state.events.length - 1].type : "started", ...extra });
  document.body.classList.add("exam-mode");

  app.innerHTML = `<div class="page exam no-select" style="max-width:900px">
    <div class="timer"><span>${esc(t.title)} · ${esc(state.roll)}</span><span><span id="qclock"></span> <span id="clock"></span></span></div>
    <div id="qs"></div>
    <div class="card" id="footer"></div>
    <div id="guard" hidden><div class="guard-box">
      <h2>⚠ You left the test</h2>
      <p id="guard-msg"></p>
      <p class="small">The question stays hidden while you are away. The clock keeps running.</p>
      <button class="btn-primary" id="guard-back">Return to the test</button>
    </div></div>
  </div>`;
  const host = app.querySelector("#qs"), footer = app.querySelector("#footer");
  const width = () => Math.max(280, Math.min(820, host.clientWidth - 40));

  // ---------- one question card ----------
  function buildCard(q, i) {
    const a = state.answers[q.id];
    const card = el(`<div class="card" data-q="${esc(q.id)}">
      <div style="display:flex;justify-content:space-between;margin-bottom:.4rem"><b>Question ${i + 1} of ${qs.length}</b><span class="pill">${q.marks || 1} mark${(q.marks || 1) > 1 ? "s" : ""}</span></div>
      <div class="qtext"></div>
    </div>`);
    const w = width();
    card.querySelector(".qtext").appendChild(textCanvas(htmlToText(q.q), { width: w, size: 17, mark }));
    if (q.code) {
      const cv = textCanvas(q.code, { mono: true, width: w, size: 14, color: "#e6e1d6", bg: "#1f2430", pad: 14, mark });
      cv.style.margin = ".6rem 0";
      card.querySelector(".qtext").appendChild(cv);
    }
    if (q.type === "mcq") {
      const order = state.optionOrder?.[q.id] || q.options.map((_, j) => j);
      order.forEach(j => {
        const lab = el(`<label class="opt" style="display:flex;gap:.6rem;align-items:center;padding:.35rem .4rem;border-radius:6px;cursor:pointer"><input type="radio" name="tq-${esc(q.id)}" value="${j}" ${a === j ? "checked" : ""}></label>`);
        lab.appendChild(textCanvas(q.options[j], { width: w - 40, size: 16 }));
        lab.querySelector("input").onchange = () => { state.answers[q.id] = j; save(); };
        card.appendChild(lab);
      });
    } else if (q.type === "output") {
      // a hand-marked question is a written answer, so it gets a bigger box and normal text
      card.insertAdjacentHTML("beforeend", q.manual
        ? `<div class="label">Your answer</div><textarea rows="12" spellcheck="false" autocomplete="off" style="width:100%;line-height:1.5">${esc(a || "")}</textarea>`
        : `<div class="label">Your predicted output (one line per output line)</div><textarea rows="4" spellcheck="false" autocomplete="off" style="width:100%;font-family:var(--mono)">${esc(a || "")}</textarea>`);
      card.querySelector("textarea").oninput = e => { state.answers[q.id] = e.target.value; save(); };
    } else if (q.type === "fill") {
      card.insertAdjacentHTML("beforeend", `<div class="label">Type the missing parts</div><div class="fill-code">${fillTemplateHTML(q.template, null, "t" + i)}</div>`);
      const ins = [...card.querySelectorAll("input")];
      ins.forEach((inp, j) => { inp.value = (a || [])[j] || ""; inp.oninput = () => { state.answers[q.id] = ins.map(x => x.value); save(); }; });
    } else if (q.type === "code") {
      if (q.mustUse?.length) card.insertAdjacentHTML("beforeend", `<div class="musts"><span class="small muted">Your code must use:</span>${q.mustUse.map(m => `<code>${esc(m)}</code>`).join("")}</div>`);
      if (q.expected) {
        const exps = [].concat(q.expected);
        exps.forEach((e, j) => {
          card.insertAdjacentHTML("beforeend", `<div class="label">${"Expected output"}${exps.length > 1 ? ` — Option ${String.fromCharCode(65 + j)}` : ""}</div>`);
          card.appendChild(textCanvas(e, { mono: true, width: w, size: 14, bg: "#f8f7f3", pad: 12 }));
        });
      }
      card.insertAdjacentHTML("beforeend", `<div class="label">Your code</div><div class="ed"></div>
        <div class="btn-row"><button class="btn-run">▶ Run</button><span class="status run"></span></div>
        <div class="label">Output of your last run (this is what gets graded)</div><pre class="outbox out">${esc(a?.output || "(not run yet)")}</pre>`);
      createEditor(card.querySelector(".ed"), a?.code || q.starter || "public class Main {\n    public static void main(String[] args) {\n        \n    }\n}\n").then(ed => editors[q.id] = ed);
      card.querySelector(".btn-run").onclick = async e => {
        const ed = editors[q.id]; if (!ed) return;
        const b = e.currentTarget; b.disabled = true;
        const st = card.querySelector(".status");
        const code = ed.getValue();
        const r = await runJava(code, (ph, s) => st.textContent = phaseText(ph, s));
        b.disabled = false; st.textContent = "";
        state.answers[q.id] = { code, output: r.output, status: r.status, runs: (state.answers[q.id]?.runs || 0) + 1 };
        save();
        card.querySelector(".out").textContent = r.output || "(no output)";
      };
    }
    // ---------- hint button (works for every kind of question) ----------
    if (q.hasHint) {
      const pen = q.hintPenalty ?? 30;
      const isCode = q.type === "code";
      const hb = el(`<div class="hint-area" style="margin-top:.8rem"></div>`);
      card.appendChild(hb);
      const showHint = text => {
        hb.innerHTML = `<div class="label">💡 Hint <span class="small muted">(−${pen}% of this question's marks)</span></div>`;
        // a hint can hold one part per option, each starting with a line "// ===== Option A ..."
        const parts = text.split(/^(?=\/\/ =+ Option [A-Z])/m).map(s => s.trim()).filter(Boolean);
        parts.forEach(part => {
          const name = (part.match(/^\/\/ =+ (Option [A-Z])/) || [])[1] || "";
          hb.appendChild(textCanvas(part, { mono: isCode, width: w, size: isCode ? 14 : 16, bg: "#fff8e1", pad: 12 }));
          if (!isCode) return;   // only a code question has an editor to put the hint into
          const put = el(`<button class="small" style="margin:.4rem 0 .8rem">Put the ${name ? name + " " : ""}hint code in my editor</button>`);
          put.onclick = async () => {
            const ed = editors[q.id]; if (!ed) return;
            if (ed.getValue().trim() && !(await askBox("Replace the code in your editor with this hint code?", { ok: "Replace" }))) return;
            ed.setValue(part.replace(/^\/\/ =+ Option [A-Z][^\n]*\n/, "")); log(`hint code put in editor (Q${i + 1}${name ? ", " + name : ""})`);
          };
          hb.appendChild(put);
        });
      };
      if (state.hints?.[q.id] != null) showHint(state.hints[q.id]);
      else {
        const b = el(`<button class="small" style="border-color:#e0a800">💡 Show hint (−${pen}% marks for this question)</button>`);
        b.onclick = async () => {
          if (!(await askBox(`Show the hint for this question?\n\n${pen}% of this question's marks will be deducted, even if you don't use it. This can't be undone.`, { ok: "Show hint" }))) return;
          b.disabled = true; b.textContent = "Loading hint…";
          try {
            const text = await takeHint(t.id, q.id);
            state.hints = { ...(state.hints || {}), [q.id]: text };
            log(`took the hint for question ${i + 1}`); save();
            showHint(text);
          } catch (e) { b.disabled = false; b.textContent = `💡 Show hint (−${pen}% marks for this question)`; toast("Could not load the hint: " + (e.code || e.message)); }
        };
        hb.appendChild(b);
      }
    }
    return card;
  }

  const captureEditor = q => {
    const ed = editors[q.id]; if (!ed) return;
    const cur = state.answers[q.id] || {};
    if (cur.code !== ed.getValue()) state.answers[q.id] = { ...cur, code: ed.getValue(), editedAfterRun: (cur.runs || 0) > 0 };
  };
  // the faculty's "seconds per question" is the minimum; a question with more time of its own keeps it
  const qTime = q => timedQs ? Math.max(t.perQuestionSec, q.timeSec || 0) : null;

  // ---------- one-at-a-time flow ----------
  let shownAt = Date.now();
  function show(i) {
    state.cur = i;
    const q = qs[i];
    if (!state.qEnds && timedQs) state.qEnds = Date.now() + qTime(q) * 1000;
    save();
    shownAt = Date.now();
    live({ away: false });
    host.innerHTML = "";
    host.appendChild(buildCard(q, i));
    const last = i === qs.length - 1;
    footer.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center;gap:1rem;flex-wrap:wrap">
      <span class="small muted">Answered questions can't be changed after you move on.</span>
      <button class="btn-primary" id="next">${last ? "Finish & submit" : "Save & next →"}</button></div>`;
    footer.querySelector("#next").onclick = () => next(false);
    if (q.type === "code") primeCompiler();
  }
  function next(timedOut) {
    const q = qs[state.cur];
    captureEditor(q);
    state.timeSpent[q.id] = (state.timeSpent[q.id] || 0) + Math.round((Date.now() - shownAt) / 1000);
    if (timedOut) log(`time up on question ${state.cur + 1}`);
    if (state.cur >= qs.length - 1) { save(); return doSubmit(timedOut, timedOut ? "" : "confirm"); }
    state.qEnds = null;
    show(state.cur + 1);
  }

  // ---------- all-on-one-page flow ----------
  function showAll() {
    qs.forEach((q, i) => host.appendChild(buildCard(q, i)));
    footer.innerHTML = `<p>Check your answers, then submit. <b>You cannot change them after submitting.</b></p><button class="btn-primary" id="submit">Submit test</button>`;
    footer.querySelector("#submit").onclick = () => doSubmit(false, "confirm");
    if (qs.some(q => q.type === "code")) primeCompiler();
  }

  // ---------- integrity guard ----------
  const guard = app.querySelector("#guard");
  let away = false, ignoreUntil = Date.now() + 2000, sending = false;
  let baseW = window.innerWidth, baseH = window.innerHeight;
  const penaltyText = () => t.penaltyPerLeave ? ` ${parseFloat((state.tabSwitches * t.penaltyPerLeave).toFixed(2))} mark(s) will be deducted.` : "";
  function recordLeave(type) {
    if (sending || away || Date.now() < ignoreUntil) return;
    away = true;
    state.tabSwitches = (state.tabSwitches || 0) + 1;
    log(type);
    guard.hidden = false;
    live({ away: true });
    const limit = t.autoSubmitAfter ? ` After ${t.autoSubmitAfter} times the test is submitted automatically.` : "";
    app.querySelector("#guard-msg").innerHTML = `<b>${esc(type)}</b> — recorded (${state.tabSwitches}×).${penaltyText()}${limit}`;
    if (t.autoSubmitAfter && state.tabSwitches >= t.autoSubmitAfter) {
      log("auto-submitted: too many leaves");
      doSubmit(true, "", `you left the test ${state.tabSwitches} times`);
    }
  }
  app.querySelector("#guard-back").onclick = async () => {
    if (t.requireFullscreen && !document.fullscreenElement) { try { await document.documentElement.requestFullscreen(); } catch { } }
    ignoreUntil = Date.now() + 1500;
    setTimeout(() => { baseW = window.innerWidth; baseH = window.innerHeight; }, 800);
    away = false;
    guard.hidden = true;
    live({ away: false });
  };

  const onVis = () => { if (document.visibilityState === "hidden") recordLeave("Switched tab or minimised the browser"); };
  const onBlur = () => recordLeave("Left the test window (another app, tab, sidebar or assistant)");
  const onFs = () => {
    if (document.fullscreenElement) { setTimeout(() => { baseW = window.innerWidth; baseH = window.innerHeight; }, 500); return; }
    if (t.requireFullscreen) recordLeave("Exited full screen");
  };
  let resizeTimer;
  const onResize = () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (window.innerWidth < baseW * 0.85 || window.innerHeight < baseH * 0.8) recordLeave("Window made smaller (split screen or side panel opened)");
      else if (!away) { baseW = Math.max(baseW, window.innerWidth); baseH = Math.max(baseH, window.innerHeight); }
    }, 350);
  };
  const block = e => e.preventDefault();
  const onPaste = e => { e.preventDefault(); state.pasteBlocked = (state.pasteBlocked || 0) + 1; log("tried to paste"); toast("Pasting is disabled during the test"); };
  const onCopy = e => { e.preventDefault(); log("tried to copy"); toast("Copying is disabled during the test"); };
  const onKey = e => {
    const key = (e.key || "").toLowerCase();
    if (key === "printscreen") { recordLeave("Pressed Print Screen"); try { navigator.clipboard.writeText(""); } catch { } return; }
    if (e.key === "F12" || ((e.ctrlKey || e.metaKey) && e.shiftKey && ["i", "j", "c"].includes(key))) { e.preventDefault(); log("tried to open developer tools"); return; }
    if ((e.ctrlKey || e.metaKey) && ["c", "x", "v", "p", "s", "u", "f"].includes(key)) {
      e.preventDefault();
      if (key === "v") onPaste(e); else if (key === "c" || key === "x") onCopy(e);
    }
  };
  let channel = null;
  try {
    channel = new BroadcastChannel("exam-" + t.id + "-" + store.user.uid);
    channel.onmessage = () => recordLeave("Test opened in another tab");
    channel.postMessage("here");
  } catch { }

  const paper = app.querySelector(".exam");
  ["copy", "cut"].forEach(ev => paper.addEventListener(ev, onCopy, true));
  paper.addEventListener("paste", onPaste, true);
  ["contextmenu", "dragstart", "drop", "selectstart"].forEach(ev => paper.addEventListener(ev, e => { if (!e.target.closest?.("input, textarea, .CodeMirror")) block(e); }, true));
  document.addEventListener("keydown", onKey, true);
  document.addEventListener("visibilitychange", onVis);
  document.addEventListener("fullscreenchange", onFs);
  window.addEventListener("blur", onBlur);
  window.addEventListener("resize", onResize);
  cleanup = () => {
    document.removeEventListener("keydown", onKey, true);
    document.removeEventListener("visibilitychange", onVis);
    document.removeEventListener("fullscreenchange", onFs);
    window.removeEventListener("blur", onBlur);
    window.removeEventListener("resize", onResize);
    try { channel?.close(); } catch { }
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
  };

  // ---------- submit ----------
  async function doSubmit(auto, mode, reason) {
    if (sending) return;
    if (mode === "confirm") {
      ignoreUntil = Date.now() + 60000;
      const ok = await askBox("Submit now? You cannot change your answers after this.", { ok: "Submit" });
      ignoreUntil = Date.now() + 500;
      if (!ok) return;
    }
    sending = true; clearInterval(tick);
    if (!oneAtATime) qs.forEach(captureEditor);
    try {
      // include devices seen by any other browser that opened this same attempt
      const other = await loadExamState(k);
      const devices = [...new Set([...(state.devices || []), ...((other && other.devices) || [])])];
      await submitTest(t.id, {
        testTitle: t.title, roll: state.roll, answers: state.answers, picked: state.picked || null,
        devices: devices.length || 1,
        tabSwitches: state.tabSwitches || 0, pasteBlocked: state.pasteBlocked || 0,
        events: state.events || [], timeSpent: state.timeSpent || {},
        startedAt: new Date(state.startedAt).toISOString(), autoSubmit: !!auto, autoReason: reason || "",
      });
      localStorage.removeItem(k);
      clearTimeout(remoteTimer); remoteTimer = null; clearExamState(k);
      setLive(t.id, { roll: state.roll, n: qs.length, leaves: state.tabSwitches || 0, status: "submitted", away: false, last: reason ? "auto-submitted: " + reason : auto ? "auto-submitted (time up)" : "submitted" });
      stopExam();
      app.innerHTML = `<div class="page" style="max-width:640px"><div class="card"><h1>✓ Submitted</h1>
        <p>Your answers for <b>${esc(t.title)}</b> were submitted${reason ? ` automatically because ${esc(reason)}` : auto ? " automatically because time ran out" : ""}.</p>
        ${state.tabSwitches ? `<p style="color:var(--bad)">You left the test ${state.tabSwitches} time(s).</p>` : ""}
        <p>Your marks and the correct answers will appear on the Tests page as soon as the results are published.</p>
        <a class="btn btn-primary" href="#/tests">Go to Tests</a></div></div>`;
    } catch (e) {
      sending = false;
      askBox("Submission failed: " + (e.code || e.message) + "\nYour answers are still saved on this computer. Check your internet and submit again.\n(If the test has been stopped, submissions are no longer accepted.)", { cancel: "" });
    }
  }
  window.onbeforeunload = () => "Your test is in progress.";

  // ---------- clocks ----------
  const clock = app.querySelector("#clock"), qclock = app.querySelector("#qclock");
  const deadline = () => t.endsAt ? new Date(t.endsAt).getTime() : t.durationMin ? state.startedAt + t.durationMin * 60000 : null;
  const fmt = s => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  const update = () => {
    if (!document.body.contains(clock)) { stopExam(); return; }
    const end = deadline();
    if (end) {
      const left = Math.round((end - Date.now()) / 1000);
      if (left <= 0) { clock.textContent = "Time up"; log("overall time up"); return doSubmit(true, ""); }
      clock.textContent = `⏱ ${fmt(left)} total`;
      clock.style.color = left < 120 ? "#fca5a5" : "";
    } else clock.textContent = "";
    if (timedQs && !sending) {
      const ql = Math.round((state.qEnds - Date.now()) / 1000);
      if (ql <= 0) { qclock.textContent = ""; return next(true); }
      qclock.innerHTML = `<span style="background:${ql <= 10 ? "#b91c1c" : "#c2410c"};padding:.15rem .55rem;border-radius:6px;margin-right:.6rem">This question: ${ql}s</span>`;
    }
  };

  if (oneAtATime) {
    // after a reload, skip questions whose time already ran out
    while (timedQs && state.qEnds && Date.now() > state.qEnds && state.cur < qs.length - 1) {
      log(`time up on question ${state.cur + 1} (while away)`);
      state.cur++; state.qEnds = state.cur < qs.length ? Date.now() + qTime(qs[state.cur]) * 1000 : null;
    }
    show(state.cur || 0);
  } else { showAll(); live({ away: false }); }
  update(); tick = setInterval(update, 1000);
}
