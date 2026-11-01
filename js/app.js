import { COURSE, allTopics } from "../content/course.js";
import { store, initAuth, signIn, signOut, DEV } from "./store.js";
import { esc, fmtTime } from "./ui.js";
import { ALLOWED_DOMAIN } from "./config.js";
import { renderTopic, stopTopicTimer } from "./topic.js";
import { renderTests, renderTakeTest, stopExam } from "./tests.js";
import { renderFaculty } from "./faculty.js";

const app = document.getElementById("app");
const topicCache = {};

export async function loadTopic(t) {
  if (!topicCache[t.id]) topicCache[t.id] = (await import("../content/" + t.file)).default;
  return topicCache[t.id];
}

function topicStats(t, data) {
  const items = store.progress.items;
  const pr = data.practice || [];
  const solved = pr.filter(p => items[p.id]?.solved).length;
  const runs = Object.values(items).filter(i => i.topic === t.id).reduce((a, i) => a + (i.runs || 0), 0);
  const quiz = items["quiz:" + t.id];
  return { solved, total: pr.length, runs, quiz: quiz ? `${quiz.best}/${quiz.total}` : "–", time: store.progress.time?.[t.id] || 0 };
}

// ---------- header ----------
function renderHeader(route) {
  const nav = document.getElementById("nav"), ub = document.getElementById("userbox");
  if (!store.user) { nav.innerHTML = ""; ub.innerHTML = ""; return; }
  const links = [["#/", "Learn"], ["#/progress", "My Progress"], ["#/tests", "Tests"]];
  if (store.isFaculty) links.push(["#/faculty", "Faculty"]);
  nav.innerHTML = links.map(([h, n]) => `<a href="${h}" class="${(route === h || (h === "#/" && route.startsWith("#/topic"))) ? "active" : ""}">${n}</a>`).join("");
  ub.innerHTML = `${store.user.photoURL ? `<img src="${esc(store.user.photoURL)}" alt="">` : ""}<span>${esc(store.user.displayName || store.user.email)}</span><button id="logout" class="small">Sign out</button>`;
  document.getElementById("logout").onclick = () => signOut();
}

// ---------- views ----------
function renderLogin() {
  app.innerHTML = `<div class="login"><div class="card">
    <div class="brand-mark" style="margin:0 auto 1rem;width:56px;height:56px;font-size:1.6rem;color:#fff">J</div>
    <h1>Java Lab</h1>
    <p class="muted">Learn Core Java by reading, running and writing real code — right in your browser.</p>
    <button class="btn-primary" id="signin" style="font-size:1rem;padding:.7rem 1.4rem;margin-top:1rem">Sign in with Google</button>
    <p class="small muted" style="margin-top:1.4rem">Sign in with your <b>@${esc(ALLOWED_DOMAIN)}</b> Google account. Your practice progress is saved to it, so you can continue on any computer.</p>
    <p class="small" id="err" style="color:var(--bad)">${store.deniedEmail ? `Access denied for <b>${esc(store.deniedEmail)}</b>. This site is only for authorised ${esc(ALLOWED_DOMAIN)} accounts — please sign in with your college email, or ask your faculty to add you.` : ""}</p>
  </div></div>`;
  document.getElementById("signin").onclick = () => signIn().catch(e => {
    document.getElementById("err").textContent = e.code === "auth/unauthorized-domain"
      ? "This website address is not yet allowed in Firebase (Authentication → Settings → Authorized domains)."
      : "Sign-in failed: " + (e.code || e.message);
  });
}

// chapters the faculty has hidden (faculty always sees everything)
const hiddenCh = () => new Set(store.isFaculty ? [] : (store.settings?.hiddenChapters || []));
const visibleTopics = () => { const h = hiddenCh(); return allTopics().filter(t => !h.has(t.chapter.id)); };

async function renderHome() {
  const first = (store.user.displayName || "").split(" ")[0];
  const loaded = await Promise.all(visibleTopics().map(async t => [t.id, await loadTopic(t)]));
  const st = store.settings || {}, hiddenAll = new Set(st.hiddenChapters || []), hid = hiddenCh();
  const data = Object.fromEntries(loaded);
  app.innerHTML = `<div class="page">
    ${st.announcementOn && st.announcement ? `<div class="announce"><b>📢 Announcement</b><br>${esc(st.announcement).replace(/\n/g, "<br>")}</div>` : ""}
    <div class="hero"><div><h1>Welcome${first ? ", " + esc(first) : ""} 👋</h1>
      <p>Read the concept → run the examples → write the practice programs yourself → check yourself with the quiz.</p></div>
      <a class="btn btn-primary" href="#/topic/${nextTopic(data).id}">Continue learning →</a></div>
    ${COURSE.filter(c => !hid.has(c.id)).map(c => `<div class="chapter">
      <div class="chapter-head"><div><h3>${esc(c.title)}</h3><span class="muted small">${esc(c.blurb)}</span></div>
      ${c.comingSoon ? `<span class="pill">Coming soon</span>` : ""}${hiddenAll.has(c.id) ? `<span class="pill bad">Hidden from students</span>` : ""}</div>
      ${c.topics.map(t => {
        if (t.soon) return `<div class="topic-row soon"><span>${esc(t.title)}</span><span class="pill">Coming soon</span></div>`;
        const s = topicStats(t, data[t.id]);
        const done = s.total && s.solved === s.total;
        return `<a class="topic-row" href="#/topic/${t.id}"><span>${esc(t.title)}</span>
          <span><span class="pill ${done ? "ok" : s.solved ? "blue" : ""}">${s.solved}/${s.total} solved</span></span></a>`;
      }).join("")}
    </div>`).join("")}
  </div>`;
}

function nextTopic(data) {
  const ts = visibleTopics();
  return ts.find(t => { const s = topicStats(t, data[t.id]); return s.solved < s.total; }) || ts[0];
}

async function renderProgress() {
  const ts = visibleTopics();
  const data = Object.fromEntries(await Promise.all(ts.map(async t => [t.id, await loadTopic(t)])));
  const items = Object.values(store.progress.items);
  const sum = f => items.reduce((a, i) => a + (f(i) || 0), 0);
  const totalProblems = ts.reduce((a, t) => a + (data[t.id].practice?.length || 0), 0);
  const totalTime = Object.values(store.progress.time || {}).reduce((a, b) => a + b, 0);
  app.innerHTML = `<div class="page">
    <h1>My Progress</h1><p class="lead">Only you can see this page.</p>
    <div class="stats">
      <div class="stat"><b>${sum(i => i.solved ? 1 : 0)} / ${totalProblems}</b><span>practice problems solved</span></div>
      <div class="stat"><b>${sum(i => i.runs)}</b><span>times you pressed Run</span></div>
      <div class="stat"><b>${sum(i => i.hints)}</b><span>hints opened</span></div>
      <div class="stat"><b>${sum(i => i.solution ? 1 : 0)}</b><span>solutions viewed</span></div>
      <div class="stat"><b>${sum(i => i.correct ? 1 : 0)}</b><span>syntax blanks completed</span></div>
      <div class="stat"><b>${fmtTime(totalTime)}</b><span>time spent learning</span></div>
    </div>
    <table class="tbl"><thead><tr><th>Topic</th><th class="num">Solved</th><th class="num">Runs</th><th class="num">Quiz best</th><th class="num">Time</th></tr></thead>
    <tbody>${ts.map(t => { const s = topicStats(t, data[t.id]); return `<tr><td><a href="#/topic/${t.id}">${esc(t.title)}</a></td>
      <td class="num">${s.solved}/${s.total}</td><td class="num">${s.runs}</td><td class="num">${s.quiz}</td><td class="num">${fmtTime(s.time)}</td></tr>`; }).join("")}</tbody></table>
    <h2>Problem by problem</h2>
    ${ts.map(t => `<h3>${esc(t.title)}</h3><table class="tbl"><thead><tr><th>Problem</th><th class="num">Runs</th><th>Hints</th><th>Solution viewed</th><th>Status</th></tr></thead><tbody>
      ${(data[t.id].practice || []).map(p => { const i = store.progress.items[p.id] || {}; return `<tr><td>${esc(p.title)}</td><td class="num">${i.runs || 0}</td><td>${i.hints || 0}</td><td>${i.solution ? "Yes" : "No"}</td>
      <td>${i.solved ? '<span class="pill ok">Solved</span>' : i.runs ? '<span class="pill blue">Attempted</span>' : '<span class="pill">Not started</span>'}</td></tr>`; }).join("")}
    </tbody></table>`).join("")}
  </div>`;
}

// ---------- router ----------
async function route() {
  stopTopicTimer();
  stopExam();
  const h = location.hash || "#/";
  renderHeader(h);
  if (!store.user) return renderLogin();
  window.scrollTo(0, 0);
  try {
    if (h.startsWith("#/topic/")) {
      const ts = visibleTopics(), i = ts.findIndex(t => t.id === h.slice(8));
      if (i < 0) return (location.hash = "#/");
      const t = ts[i];
      renderTopic(app, t, await loadTopic(t), t.chapter, ts[i - 1], ts[i + 1]);
    } else if (h === "#/progress") await renderProgress();
    else if (h === "#/tests") await renderTests(app);
    else if (h.startsWith("#/test/")) await renderTakeTest(app, decodeURIComponent(h.slice(7)));
    else if (h.startsWith("#/faculty")) store.isFaculty ? await renderFaculty(app) : (location.hash = "#/");
    else await renderHome();
  } catch (e) {
    console.error(e);
    app.innerHTML = `<div class="page"><div class="warn"><b>Something went wrong.</b><br>${esc(e.message)}</div></div>`;
  }
}

window.addEventListener("hashchange", route);
if (DEV) document.title += " (dev)";
initAuth(() => route()).catch(e => {
  app.innerHTML = `<div class="page"><div class="warn"><b>Could not connect.</b> Check your internet connection and reload.<br><span class="small">${esc(e.message)}</span></div></div>`;
});
