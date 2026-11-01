// Login + database (Firebase). Also a local mock used only for offline testing (?dev=1 on localhost).
import { firebaseConfig, FACULTY_EMAILS, ALLOWED_DOMAIN, RUN_SERVER } from "./config.js";
import { setRunServer, pingServer } from "./runner.js";

const FB = "https://www.gstatic.com/firebasejs/10.12.2/";
const params = new URLSearchParams(location.search);
export const DEV = params.has("dev") && ["localhost", "127.0.0.1"].includes(location.hostname);

export const store = { user: null, isFaculty: false, deniedEmail: null, progress: { items: {}, time: {} }, settings: {} };
let fb = null;

// ---------- tiny DB layer (Firestore or local mock) ----------
const INC = "__inc";
export const inc = n => ({ [INC]: n });

function deepMerge(target, src) {
  for (const [k, v] of Object.entries(src)) {
    if (v && typeof v === "object" && INC in v) target[k] = (Number(target[k]) || 0) + v[INC];
    else if (v && typeof v === "object" && !Array.isArray(v)) { target[k] = target[k] && typeof target[k] === "object" ? target[k] : {}; deepMerge(target[k], v); }
    else target[k] = v;
  }
  return target;
}
// Firestore can't store a list inside a list (e.g. fill-in answers [["void"],["String"]]),
// so such lists are saved as text and turned back into lists when read.
const hasNested = a => a.some(Array.isArray);
function packNested(obj) {
  if (Array.isArray(obj)) return hasNested(obj) ? { __json: JSON.stringify(obj) } : obj.map(packNested);
  if (obj && typeof obj === "object" && !(INC in obj)) { const o = {}; for (const k in obj) o[k] = packNested(obj[k]); return o; }
  return obj;
}
function unpackNested(v) {
  if (Array.isArray(v)) return v.map(unpackNested);
  if (v && typeof v === "object") {
    if (typeof v.__json === "string" && Object.keys(v).length === 1) { try { return JSON.parse(v.__json); } catch { return v; } }
    const o = {}; for (const k in v) o[k] = unpackNested(v[k]); return o;
  }
  return v;
}
function toFs(obj) { // convert inc() markers + timestamps for Firestore
  if (obj && typeof obj === "object" && INC in obj) return fb.F.increment(obj[INC]);
  if (obj === "__now__") return fb.F.serverTimestamp();
  if (Array.isArray(obj)) { if (hasNested(obj)) return { __json: JSON.stringify(obj) }; return obj.map(toFs); }
  if (obj && typeof obj === "object") { const o = {}; for (const k in obj) o[k] = toFs(obj[k]); return o; }
  return obj;
}
function fromFs(v) {
  if (v && typeof v.toDate === "function") return v.toDate().toISOString();
  if (Array.isArray(v)) return v.map(fromFs);
  if (v && typeof v === "object" && typeof v.__json === "string" && Object.keys(v).length === 1) { try { return JSON.parse(v.__json); } catch { return v; } }
  if (v && typeof v === "object") { const o = {}; for (const k in v) o[k] = fromFs(v[k]); return o; }
  return v;
}

const local = {
  load() { return JSON.parse(localStorage.getItem("devdb") || "{}"); },
  save(d) { localStorage.setItem("devdb", JSON.stringify(d)); },
  fix(o) { return JSON.parse(JSON.stringify(o, (k, v) => v === "__now__" ? new Date().toISOString() : v)); },
};

const db = {
  async get(coll, id) {
    if (DEV) { const d = local.load(); return d[coll]?.[id] ? { id, ...unpackNested(d[coll][id]) } : null; }
    const s = await fb.F.getDoc(fb.F.doc(fb.db, coll, id));
    return s.exists() ? { id: s.id, ...fromFs(s.data()) } : null;
  },
  async set(coll, id, data, merge = true) {
    if (DEV) {
      const d = local.load(); d[coll] = d[coll] || {};
      if (d[coll][id] && !merge && coll === "submissions") throw new Error("permission-denied: already submitted");
      const packed = packNested(data);
      (function check(x) { if (Array.isArray(x)) { if (hasNested(x)) throw new Error("Nested arrays are not supported"); x.forEach(check); } else if (x && typeof x === "object") Object.values(x).forEach(check); })(packed);
      d[coll][id] = merge ? deepMerge(d[coll][id] || {}, local.fix(packed)) : local.fix(packed);
      return local.save(d);
    }
    return fb.F.setDoc(fb.F.doc(fb.db, coll, id), toFs(data), { merge });
  },
  async del(coll, id) {
    if (DEV) { const d = local.load(); if (d[coll]) delete d[coll][id]; return local.save(d); }
    return fb.F.deleteDoc(fb.F.doc(fb.db, coll, id));
  },
  async query(coll, filters = []) {
    if (DEV) {
      const d = local.load()[coll] || {};
      return Object.entries(d).map(([id, v]) => ({ id, ...unpackNested(v) })).filter(r => filters.every(([f, , val]) => r[f] === val));
    }
    const q = fb.F.query(fb.F.collection(fb.db, coll), ...filters.map(([f, op, v]) => fb.F.where(f, op, v)));
    const snap = await fb.F.getDocs(q);
    return snap.docs.map(s => ({ id: s.id, ...fromFs(s.data()) }));
  },
};

// ---------- auth ----------
export async function initAuth(onChange) {
  if (DEV) {
    store.user = { uid: params.get("uid") || "dev-student", displayName: params.get("name") || "Dev Student", email: params.has("faculty") ? FACULTY_EMAILS[0] : "dev.student@rru.ac.in" };
    if (params.get("email")) store.user.email = params.get("email");
    store.isFaculty = params.has("faculty");
    if (!store.isFaculty && !isAllowed(store.user.email, await db.get("config", "access"))) {
      store.deniedEmail = store.user.email;
      store.user = null;
      return onChange(null);
    }
    await loadProgress();
    await loadSettings();
    return onChange(store.user);
  }
  const [app, auth, fs] = await Promise.all([import(FB + "firebase-app.js"), import(FB + "firebase-auth.js"), import(FB + "firebase-firestore.js")]);
  const a = app.initializeApp(firebaseConfig);
  fb = { auth: auth.getAuth(a), db: fs.getFirestore(a), A: auth, F: fs };
  auth.onAuthStateChanged(fb.auth, async u => {
    store.user = u;
    store.isFaculty = !!u && FACULTY_EMAILS.includes(u.email);
    if (u && !store.isFaculty) {
      // Quick check for the wrong domain; the database rules make the final decision
      // (they also enforce the "only listed emails" mode).
      const domainOk = (u.email || "").toLowerCase().endsWith("@" + ALLOWED_DOMAIN);
      let denied = !domainOk && !(await probeAccess());
      if (!denied) {
        try { await loadProgress(); }
        catch (e) { if (e.code === "permission-denied") denied = true; else console.warn("progress load failed", e); }
      }
      if (denied) {
        store.deniedEmail = u.email;
        store.user = null;
        await fb.A.signOut(fb.auth);
        return onChange(null);
      }
    } else if (u) {
      await loadProgress().catch(e => console.warn("progress load failed", e));
    }
    if (u) { store.deniedEmail = null; await loadSettings(); }
    onChange(store.user);
  });
}
export function signIn() {
  const p = new fb.A.GoogleAuthProvider();
  p.setCustomParameters({ prompt: "select_account" });
  return fb.A.signInWithPopup(fb.auth, p);
}
export function signOut() { return DEV ? location.reload() : fb.A.signOut(fb.auth); }

// ---------- access control ----------
// access document (config/access): { mode: "domain" | "list", emails: [..] }
//   domain → any @ALLOWED_DOMAIN account, plus listed emails
//   list   → only the listed emails
export function isAllowed(email, access) {
  email = (email || "").toLowerCase();
  const listed = (access?.emails || []).includes(email);
  if (access?.mode === "list") return listed;
  return email.endsWith("@" + ALLOWED_DOMAIN) || listed;
}
async function probeAccess() {
  try { await db.get("progress", store.user.uid); return true; }
  catch (e) { return false; }
}
export const getAccess = () => db.get("config", "access");
export const saveAccess = (mode, emails) => db.set("config", "access", { mode, emails, updatedAt: "__now__" }, false);

// ---------- learning progress ----------
async function loadProgress() {
  const doc = await db.get("progress", store.user.uid);
  store.progress = { items: {}, time: {}, ...(doc || {}) };
}

/** Record activity. changes example: { runs: inc(1), solved: true } */
export function track(itemId, topicId, changes) {
  const item = store.progress.items[itemId] = store.progress.items[itemId] || {};
  deepMerge(item, { ...changes, topic: topicId });
  return db.set("progress", store.user.uid, {
    name: store.user.displayName || "", email: store.user.email || "", lastActive: "__now__",
    items: { [itemId]: { ...changes, topic: topicId } },
  }).catch(e => console.warn("track failed", e));
}
export function trackTime(topicId, seconds) {
  store.progress.time[topicId] = (store.progress.time[topicId] || 0) + seconds;
  return db.set("progress", store.user.uid, { lastActive: "__now__", time: { [topicId]: inc(seconds) } }).catch(() => {});
}

// ---------- tests (student side) ----------
export const listOpenTests = () => db.query("tests", [["open", "==", true]]);
export const getTest = id => db.get("tests", id);
export const mySubmissions = () => db.query("submissions", [["uid", "==", store.user.uid]]);
export function submitTest(testId, data) {
  return db.set("submissions", `${testId}_${store.user.uid}`, {
    ...data, testId, uid: store.user.uid, name: store.user.displayName || "", email: store.user.email || "", submittedAt: "__now__",
  }, false);
}

// ---------- faculty ----------
export const listTests = () => db.query("tests");
export const getKey = id => db.get("testKeys", id);
// The answer key is saved first, so a test never appears without its key.
export async function saveTest(id, pub, key) {
  await db.set("testKeys", id, key, false);
  await db.set("tests", id, pub, false);
}
export const updateTest = (id, fields) => db.set("tests", id, fields);
export const listSubmissions = testId => db.query("submissions", [["testId", "==", testId]]);
export const updateSubmission = (id, fields) => db.set("submissions", id, fields);
export const listAllProgress = () => db.query("progress");

export const deleteTest = id => Promise.all([db.del("tests", id), db.del("testKeys", id)]);
export const deleteSubmission = id => db.del("submissions", id);
export const listAllSubmissions = () => db.query("submissions");
export const submissionsOf = uid => db.query("submissions", [["uid", "==", uid]]);
export const progressOf = uid => db.get("progress", uid);

// ---------- public settings (announcement, visible chapters) ----------
export async function loadSettings() {
  try { store.settings = (await db.get("settings", "public")) || {}; } catch { store.settings = {}; }
  setRunServer(store.settings.runServer != null ? store.settings.runServer : RUN_SERVER);
  pingServer();
  return store.settings;
}
export const saveSettings = fields => db.set("settings", "public", { ...fields, updatedAt: "__now__" }).then(loadSettings);

// ---------- live exam status (student writes, faculty reads) ----------
// An exam in progress is also kept online (in the student's own progress record),
// so it continues on another browser or computer after a crash, power cut or closed laptop.
const examKey = k => k.replace(/[^\w-]/g, "_");
export async function loadExamState(k) {
  try { const d = await db.get("progress", store.user.uid); return d?.exams?.[examKey(k)] || null; } catch { return null; }
}
export function saveExamState(k, state) {
  return db.set("progress", store.user.uid, { exams: { [examKey(k)]: state } }).catch(() => {});
}
export function clearExamState(k) {
  return db.set("progress", store.user.uid, { exams: { [examKey(k)]: null } }).catch(() => {});
}

export function setLive(testId, data) {
  return db.set("live", `${testId}_${store.user.uid}`, {
    ...data, testId, uid: store.user.uid, name: store.user.displayName || "", email: store.user.email || "", updatedAt: "__now__",
  }).catch(() => {});
}
export const listLive = testId => db.query("live", [["testId", "==", testId]]);
export const clearLive = (testId, uid) => db.del("live", `${testId}_${uid}`).catch(() => {});
