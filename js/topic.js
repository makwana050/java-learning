// Topic page: concept, syntax breakdown, examples, practice, fill-in-the-syntax, quick check
import { esc, el, highlightJava, guardCopy, toast, normBlank, fillTemplateHTML } from "./ui.js";
import { runJava, warmUp, outputsMatch, firstDiffLine, normalizeOutput, codeOnly, missingMust } from "./runner.js";
import { createEditor } from "./editor.js";
import { store, track, trackTime, inc } from "./store.js";

let timeTimer = null;
export function stopTopicTimer() { clearInterval(timeTimer); timeTimer = null; }

export function renderTopic(root, topic, data, chapter, prev, next) {
  stopTopicTimer();
  const sec = [];
  if (data.concept) sec.push(["concept", "Concept"]);
  if (data.syntax?.length) sec.push(["syntax", "Syntax breakdown"]);
  if (data.samples?.length) sec.push(["examples", "Examples"]);
  if (data.practice?.length) sec.push(["practice", "Practice"]);
  if (data.fill?.length) sec.push(["fill", "Fill in the syntax"]);
  if (data.quiz?.length) sec.push(["quiz", "Quick check"]);

  root.innerHTML = `
  <div class="topic-layout">
    <aside class="sidebar">
      <h4>${esc(chapter.title)}</h4>
      ${chapter.topics.map(t => t.soon ? `<span class="soon">${esc(t.title)}</span>` :
        `<a href="#/topic/${t.id}" class="${t.id === topic.id ? "active" : ""}">${esc(t.title)}</a>`).join("")}
      <div class="jump"><h4>On this page</h4>${sec.map(([id, n]) => `<a href="javascript:void 0" data-jump="${id}">${n}</a>`).join("")}</div>
    </aside>
    <article class="content">
      <div class="kicker">${esc(chapter.title)}</div>
      <h1>${esc(data.title)}</h1>
      <p class="lead">${esc(data.summary || "")}</p>
      ${data.concept ? `<section id="sec-concept">${data.concept}</section>` : ""}
      ${data.syntax?.length ? `<section id="sec-syntax"><h2>Syntax breakdown</h2><p class="muted small">Hover over (or tap) each part to see what it means.</p><div id="syntax-host"></div></section>` : ""}
      ${data.samples?.length ? `<section id="sec-examples"><h2>Examples</h2><p class="muted small">Read each example, predict the output, then press Run to check.</p><div id="samples-host"></div></section>` : ""}
      ${data.practice?.length ? `<section id="sec-practice"><h2>Practice</h2><p class="muted small">Write the program yourself so that your output matches the expected output exactly. Stuck? Use a hint. The solution unlocks after your first run.</p><div id="practice-host"></div></section>` : ""}
      ${data.fill?.length ? `<section id="sec-fill"><h2>Fill in the syntax</h2><p class="muted small">Type the missing part in each box, then press Check.</p><div id="fill-host"></div></section>` : ""}
      ${data.quiz?.length ? `<section id="sec-quiz"><h2>Quick check</h2><div id="quiz-host"></div></section>` : ""}
      <div class="btn-row" style="justify-content:space-between;margin-top:3rem">
        ${prev ? `<a class="btn" href="#/topic/${prev.id}">← ${esc(prev.title)}</a>` : "<span></span>"}
        ${next ? `<a class="btn btn-primary" href="#/topic/${next.id}">${esc(next.title)} →</a>` : ""}
      </div>
    </article>
  </div>`;

  root.querySelectorAll("[data-jump]").forEach(a => a.onclick = () => document.getElementById("sec-" + a.dataset.jump)?.scrollIntoView({ behavior: "smooth" }));
  root.querySelectorAll("#sec-concept pre.java").forEach(p => { p.classList.add("codebox", "no-copy"); p.innerHTML = highlightJava(p.textContent); });

  if (data.syntax?.length) renderSyntax(root.querySelector("#syntax-host"), data.syntax);
  if (data.samples?.length) data.samples.forEach((s, i) => root.querySelector("#samples-host").appendChild(sampleCard(s, i)));
  if (data.practice?.length) data.practice.forEach((p, i) => root.querySelector("#practice-host").appendChild(practiceCard(p, i, topic.id)));
  if (data.fill?.length) data.fill.forEach((f, i) => root.querySelector("#fill-host").appendChild(fillCard(f, i, topic.id)));
  if (data.quiz?.length) root.querySelector("#quiz-host").appendChild(quizCard(data.quiz, topic.id));
  guardCopy(root);

  if (data.practice?.length || data.samples?.length) setTimeout(() => warmUp().catch(() => {}), 1500);
  timeTimer = setInterval(() => { if (document.visibilityState === "visible") trackTime(topic.id, 30); }, 30000);
}

// ---------- syntax breakdown ----------
function renderSyntax(host, list) {
  list.forEach(item => {
    const card = el(`<div class="card"><h3>${esc(item.title || "")}</h3>
      <div class="syntax-line">${item.parts.map((p, i) => p.m ? `<span class="part" data-i="${i}">${esc(p.t)}</span>` : `<span>${esc(p.t)}</span>`).join("")}</div>
      <table><thead><tr><th style="width:28%">Part</th><th>What it means</th></tr></thead><tbody>
      ${item.parts.map((p, i) => p.m ? `<tr data-row="${i}"><td><code>${esc(p.t)}</code></td><td>${p.m}</td></tr>` : "").join("")}
      </tbody></table></div>`);
    card.querySelectorAll(".part").forEach(sp => {
      const row = card.querySelector(`[data-row="${sp.dataset.i}"]`);
      const on = () => { sp.classList.add("hl"); row.style.background = "#fff3e8"; };
      const off = () => { sp.classList.remove("hl"); row.style.background = ""; };
      sp.onmouseenter = on; sp.onmouseleave = off; sp.onclick = on;
    });
    host.appendChild(card);
  });
}

// ---------- examples ----------
function sampleCard(s, i) {
  const card = el(`<div class="card">
    <h3>Example ${i + 1}: ${esc(s.title)}</h3>
    ${s.note ? `<p>${s.note}</p>` : ""}
    <pre class="codebox no-copy">${highlightJava(s.code)}</pre>
    <div class="btn-row"><button class="btn-run">▶ Run</button><button class="btn-ghost show-out">Show expected output</button><span class="status"></span></div>
    <div class="out-area"></div>
    ${s.explain ? `<div class="explain" hidden>${s.explain}</div>` : ""}
  </div>`);
  const area = card.querySelector(".out-area"), status = card.querySelector(".status");
  const showExplain = () => card.querySelector(".explain")?.removeAttribute("hidden");
  card.querySelector(".show-out").onclick = () => {
    area.innerHTML = `<div class="label">Expected output</div><pre class="outbox">${esc(s.output)}</pre>`; showExplain();
  };
  card.querySelector(".btn-run").onclick = async e => {
    const b = e.currentTarget; b.disabled = true;
    const r = await runJava(s.code, ph => status.textContent = phaseText(ph));
    status.textContent = ""; b.disabled = false;
    area.innerHTML = `<div class="label">Output</div><pre class="outbox">${esc(r.output || "(no output)")}</pre>`;
    showExplain();
  };
  return card;
}

export function phaseText(ph) {
  return { loading: "Starting Java… (first run can take 20–40 s)", compiling: "Compiling…", running: "Running…" }[ph] || "";
}

// ---------- practice ----------
function practiceCard(p, i, topicId) {
  const st = () => store.progress.items[p.id] || {};
  const card = el(`<div class="card" id="p-${p.id}">
    <div style="display:flex;justify-content:space-between;gap:1rem;align-items:baseline">
      <h3>Problem ${i + 1}: ${esc(p.title)}</h3><span class="pill solved-pill"></span>
    </div>
    <div>${p.task}</div>
    ${p.mustUse?.length ? `<div class="musts"><span class="small muted">Your code must use:</span>${p.mustUse.map(m => `<code>${esc(m)}</code>`).join("")}</div>` : ""}
    <div class="label">Expected output</div>
    <pre class="outbox">${esc(p.expected)}</pre>
    <div class="label">Your code</div>
    <div class="ed"></div>
    <div class="btn-row">
      <button class="btn-run do-run">▶ Run</button>
      <button class="hint">💡 Hint</button>
      <button class="sol">🔓 Show solution</button>
      <button class="btn-ghost reset small">Reset code</button>
      <span class="status"></span>
      <span class="small muted runs" style="margin-left:auto"></span>
    </div>
    <div class="hints"></div>
    <div class="result"></div>
    <div class="solution"></div>
  </div>`);
  const $ = s => card.querySelector(s);
  const draftKey = "draft:" + store.user.uid + ":" + p.id;
  let editor, hintLevel = 0;
  const starter = p.starter ?? "public class Main {\n    public static void main(String[] args) {\n        // write your code here\n        \n    }\n}\n";
  createEditor($(".ed"), localStorage.getItem(draftKey) || starter).then(e => editor = e);

  const refresh = () => {
    const s = st();
    $(".runs").textContent = `Runs: ${s.runs || 0}`;
    const pill = $(".solved-pill");
    pill.textContent = s.solved ? "✓ Solved" : s.runs ? "Attempted" : "Not started";
    pill.className = "pill solved-pill " + (s.solved ? "ok" : s.runs ? "blue" : "");
    $(".sol").disabled = !s.runs;
    $(".sol").title = s.runs ? "" : "Run your own attempt at least once to unlock";
    $(".hint").disabled = hintLevel >= (p.hints?.length || 0);
    $(".hint").textContent = p.hints?.length ? `💡 Hint (${(p.hints.length - hintLevel)} left)` : "💡 No hints";
  };
  refresh();

  $(".hint").onclick = () => {
    if (hintLevel >= p.hints.length) return;
    $(".hints").appendChild(el(`<div class="hintbox"><b>Hint ${hintLevel + 1}:</b> ${p.hints[hintLevel]}</div>`));
    hintLevel++;
    if (hintLevel > (st().hints || 0)) track(p.id, topicId, { hints: hintLevel });
    refresh();
  };
  $(".sol").onclick = () => {
    if ($(".solution").innerHTML) return;
    $(".solution").innerHTML = `<div class="label">Solution — read it, understand it, then type it yourself</div>
      <pre class="codebox no-copy">${highlightJava(p.solution)}</pre>${p.explain ? `<div class="explain">${p.explain}</div>` : ""}`;
    guardCopy($(".solution"));
    if (!st().solution) track(p.id, topicId, { solution: true });
  };
  $(".reset").onclick = () => { if (confirm("Replace your code with the starting code?")) { editor?.setValue(starter); localStorage.removeItem(draftKey); } };

  $(".do-run").onclick = async () => {
    if (!editor) return;
    const code = editor.getValue();
    localStorage.setItem(draftKey, code);
    const b = $(".do-run"); b.disabled = true;
    const status = $(".status"); status.className = "status run";
    const r = await runJava(code, ph => status.textContent = phaseText(ph));
    b.disabled = false; status.textContent = "";

    const missing = missingMust(code, p.mustUse);
    const match = r.status === "ok" && outputsMatch(r.output, p.expected);
    const solved = match && !missing.length;
    track(p.id, topicId, solved && !st().solved ? { runs: inc(1), solved: true } : { runs: inc(1) });
    refresh();

    let msg;
    if (r.status === "compile") msg = `<span class="status bad">✗ Compile error</span> — read the message below: it tells you the line number and what Java expected.`;
    else if (r.status === "runtime") msg = `<span class="status bad">✗ Your program crashed while running</span> (exception below).`;
    else if (r.status !== "ok") msg = `<span class="status bad">✗ ${esc(r.status)}</span>`;
    else if (!match) msg = `<span class="status bad">✗ Output does not match yet.</span> The first different line is highlighted.`;
    else if (missing.length) msg = `<span class="status bad">Output is correct, but your code must use: ${missing.map(m => `<code>${esc(m)}</code>`).join(" ")}</span>`;
    else msg = `<span class="status ok">✓ Correct! Well done.</span>`;

    const d = r.status === "ok" && !match ? firstDiffLine(r.output, p.expected) : -1;
    const lines = normalizeOutput(r.output).split("\n");
    const outHTML = r.output ? lines.map((l, k) => k === d ? `<span class="diffline">${esc(l) || " "}</span>` : esc(l)).join("\n") : "(no output)";
    $(".result").innerHTML = `<p>${msg}</p>
      <div class="split"><div><div class="label">Your output</div><pre class="outbox ${solved ? "ok" : "bad"}">${outHTML}${d >= lines.length ? '\n<span class="diffline">(missing line)</span>' : ""}</pre></div>
      <div><div class="label">Expected output</div><pre class="outbox">${esc(p.expected)}</pre></div></div>`;
  };
  return card;
}

// ---------- fill in the syntax ----------
function fillCard(f, i, topicId) {
  const card = el(`<div class="card">
    <h3>${i + 1}. ${f.prompt}</h3>
    <div class="fill-code">${fillTemplateHTML(f.template, f.answers, f.id)}</div>
    <div class="btn-row"><button class="btn-primary check">Check</button><button class="btn-ghost reveal" hidden>Show answer</button><span class="status"></span></div>
    <div class="explain" hidden>${f.explain || ""}</div>
  </div>`);
  const inputs = [...card.querySelectorAll("input")];
  inputs.forEach((inp, k) => inp.addEventListener("keydown", e => { if (e.key === "Enter") (inputs[k + 1] || card.querySelector(".check")).focus(); }));
  card.querySelector(".check").onclick = () => {
    let good = 0;
    inputs.forEach((inp, k) => {
      const ok = f.answers[k].some(a => normBlank(a) === normBlank(inp.value));
      inp.classList.toggle("ok", ok); inp.classList.toggle("bad", !ok);
      if (ok) good++;
    });
    const all = good === inputs.length;
    const s = card.querySelector(".status");
    s.className = "status " + (all ? "ok" : "bad");
    s.textContent = all ? "✓ All correct" : `${good} of ${inputs.length} correct — fix the red boxes`;
    card.querySelector(".reveal").hidden = all;
    if (all) card.querySelector(".explain").hidden = false;
    const prev = store.progress.items[f.id] || {};
    track(f.id, topicId, all && !prev.correct ? { checks: inc(1), correct: true } : { checks: inc(1) });
  };
  card.querySelector(".reveal").onclick = () => {
    inputs.forEach((inp, k) => { inp.value = f.answers[k][0]; inp.classList.remove("bad"); inp.classList.add("ok"); });
    card.querySelector(".explain").hidden = false;
    card.querySelector(".reveal").hidden = true;
    track(f.id, topicId, { revealed: true });
  };
  return card;
}

// ---------- quick check quiz ----------
function quizCard(qs, topicId) {
  const key = "quiz:" + topicId;
  const card = el(`<div class="card">
    <p class="muted small">Answer all questions, then press Submit. Best score: <b class="best">${store.progress.items[key]?.best ?? "–"}</b> / ${qs.length}</p>
    <div class="qs">${qs.map((q, i) => `
      <div class="q" data-i="${i}">
        <b>Q${i + 1}.</b> ${q.q}
        ${q.code ? `<pre class="codebox no-copy" style="margin:.6rem 0">${highlightJava(q.code)}</pre>` : ""}
        ${q.type === "output"
          ? `<div class="label">Your predicted output</div><textarea rows="${Math.max(2, String(q.answer).split("\n").length + 1)}" spellcheck="false"></textarea>`
          : q.options.map((o, k) => `<label class="opt"><input type="radio" name="q-${topicId}-${i}" value="${k}"> <span>${esc(o)}</span></label>`).join("")}
        <div class="explain" hidden>${q.explain || ""}</div>
      </div>`).join("")}</div>
    <div class="btn-row"><button class="btn-primary submit">Submit answers</button><button class="retry" hidden>Try again</button><span class="status score"></span></div>
  </div>`);
  card.querySelector(".submit").onclick = () => {
    let score = 0;
    qs.forEach((q, i) => {
      const box = card.querySelector(`.q[data-i="${i}"]`);
      let ok;
      if (q.type === "output") {
        const ta = box.querySelector("textarea");
        ok = [].concat(q.answer).some(a => outputsMatch(ta.value, a));
        ta.style.borderColor = ok ? "var(--ok)" : "var(--bad)";
        if (!ok) box.querySelector(".explain").innerHTML = `<b>Correct output:</b><pre>${esc([].concat(q.answer)[0])}</pre>` + (q.explain || "");
      } else {
        const sel = box.querySelector("input:checked");
        ok = sel && +sel.value === q.answer;
        box.querySelectorAll("label.opt").forEach((l, k) => { l.classList.toggle("ok", k === q.answer); l.classList.toggle("bad", sel && +sel.value === k && k !== q.answer); });
      }
      if (ok) score++;
      box.querySelector(".explain").hidden = false;
    });
    const prev = store.progress.items[key] || {};
    const best = Math.max(prev.best || 0, score);
    track(key, topicId, { attempts: inc(1), best, last: score, total: qs.length });
    card.querySelector(".best").textContent = best;
    const s = card.querySelector(".score");
    s.className = "status score " + (score === qs.length ? "ok" : "bad");
    s.textContent = `Score: ${score} / ${qs.length}`;
    card.querySelector(".submit").disabled = true;
    card.querySelector(".retry").hidden = false;
    toast(score === qs.length ? "Perfect score! 🎉" : `You scored ${score}/${qs.length}`);
  };
  card.querySelector(".retry").onclick = () => {
    const fresh = quizCard(qs, topicId); card.replaceWith(fresh); guardCopy(fresh);
  };
  return card;
}
