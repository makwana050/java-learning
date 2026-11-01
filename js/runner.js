// Runs Java inside the student's browser using CheerpJ (a JVM in WebAssembly)
// and the OpenJDK javac compiler (tools.jar, Java 8 language level).
// Nothing is sent to any server.

const CHEERPJ_LOADER = "https://cjrtnc.leaningtech.com/5.0/loader.js";
const RUN_TIMEOUT_MS = 15000;          // a student's program (catches infinite loops)
const FIRST_COMPILE_MS = 240000;       // first compile downloads the compiler (18 MB) — can be slow on college Wi-Fi
const COMPILE_MS = 90000;              // later compiles are usually 1–5 s

const params = new URLSearchParams(location.search);
const DEV = params.has("dev") && ["localhost", "127.0.0.1"].includes(location.hostname);

let readyPromise = null;
let queue = Promise.resolve();
let compilerWarm = false;   // true after the first successful compile in this page
let busy = null;            // a CheerpJ call that is still running after we stopped waiting for it
let primePromise = null;

function loadScript(src) {
  return new Promise((res, rej) => {
    const s = document.createElement("script");
    s.src = src; s.onload = res; s.onerror = () => rej(new Error("Could not load " + src));
    document.head.appendChild(s);
  });
}

export function warmUp() {
  if (DEV) return Promise.resolve();
  if (!readyPromise) {
    readyPromise = (async () => {
      await loadScript(CHEERPJ_LOADER);
      await window.cheerpjInit({ status: "none" });
    })();
    readyPromise.catch(() => { readyPromise = null; });
  }
  return readyPromise;
}

// Starts Java AND compiles a tiny program in the background, so the compiler is
// downloaded and ready before the student presses Run for the first time.
export function primeCompiler() {
  if (DEV || compilerWarm || primePromise) return primePromise || Promise.resolve();
  primePromise = runJava("public class Warm { public static void main(String[] a) { } }", () => {}, { silent: true })
    .catch(() => {}).finally(() => { primePromise = null; });
  return primePromise;
}

// Finds the class name to use as the file name / main class.
export function findMainClass(code) {
  const pub = code.match(/public\s+(?:final\s+|abstract\s+)*class\s+([A-Za-z_$][\w$]*)/);
  if (pub) return pub[1];
  const any = code.match(/\bclass\s+([A-Za-z_$][\w$]*)/);
  return any ? any[1] : null;
}

function clean(text) {
  return (text || "").replace(/\/str\//g, "").replace(/\r\n/g, "\n");
}

function withTimeout(promise, ms) {
  return Promise.race([
    promise,
    new Promise(res => setTimeout(() => res("__timeout__"), ms)),
  ]);
}

// Calls onPhase(phase, seconds) every second so the student sees it is still working.
function ticker(onPhase, phase) {
  const t0 = Date.now();
  onPhase(phase, 0);
  const id = setInterval(() => onPhase(phase, Math.round((Date.now() - t0) / 1000)), 1000);
  return () => clearInterval(id);
}

/**
 * Compile and run a Java program.
 * Returns { status: "ok" | "compile" | "runtime" | "timeout" | "error", output }
 */
export function runJava(code, onPhase = () => {}, opts = {}) {
  // If the compiler is still being prepared in the background, show that while this run waits.
  const stopWait = primePromise && !opts.silent ? ticker(onPhase, "compiling-first") : null;
  const job = queue.then(() => { if (stopWait) stopWait(); return doRun(code, onPhase, opts); });
  queue = job.catch(() => {});
  return job;
}

async function doRun(code, onPhase, opts = {}) {
  const cls = findMainClass(code);
  if (!cls) return { status: "compile", output: "error: no class found.\nEvery Java program needs a class, e.g.  public class Main { ... }" };
  if (!/static\s+void\s+main\s*\(/.test(code))
    return { status: "compile", output: "error: no main method found.\nAdd:  public static void main(String[] args) { ... }" };

  if (DEV) {
    onPhase("compiling");
    const r = await fetch("/__run", { method: "POST", body: JSON.stringify({ cls, code }) });
    return r.json();
  }

  // A previous compile that took too long may still be finishing: wait for it (it makes this one fast).
  if (busy) {
    const stop = ticker(onPhase, "finishing");
    await busy.catch(() => {});
    stop();
  }

  let stop = ticker(onPhase, "loading");
  try {
    await warmUp();
  } catch (e) {
    stop();
    return { status: "error", output: "Could not start Java in this browser. Check your internet connection and reload the page.\n(" + e.message + ")" };
  }
  stop();

  const con = document.getElementById("console");
  const jar = "/app" + new URL("tools.jar", location.href).pathname;
  const cp = jar + ":/files/";   // to start the compiler
  // javac options that make each compile much faster:
  //  -cp /files/      : don't make javac search the 18 MB tools.jar for every class name
  //  -proc:none       : don't scan for annotation processors
  //  -implicit:none   : don't write extra class files
  const src = "/str/" + cls + ".java";

  con.textContent = "";
  window.cheerpjAddStringFile(src, code);
  stop = ticker(onPhase, compilerWarm ? "compiling" : "compiling-first");
  const compileP = window.cheerpjRunMain("com.sun.tools.javac.Main", cp, "-proc:none", "-implicit:none", "-cp", "/files/", "-d", "/files/", src);
  const exit = await withTimeout(compileP, compilerWarm ? COMPILE_MS : FIRST_COMPILE_MS);
  stop();
  if (exit === "__timeout__") {
    busy = compileP.then(() => { compilerWarm = true; }).finally(() => { busy = null; });
    return { status: "timeout", output: "Java is still getting ready (the internet seems slow).\nWait a few seconds and press Run again; it continues from where it stopped, so there's no need to reload the page." };
  }
  compilerWarm = true;
  const compileText = clean(con.textContent);
  if (exit !== 0) return { status: "compile", output: compileText || "Compilation failed." };
  if (opts.silent) return { status: "ok", output: "" };

  con.textContent = "";
  stop = ticker(onPhase, "running");
  const runP = window.cheerpjRunMain(cls, "/files/");   // the student's program needs only its own classes
  const rc = await withTimeout(runP, RUN_TIMEOUT_MS);
  stop();
  const out = clean(con.textContent);
  if (rc === "__timeout__")
    return { status: "timeout", output: out + "\n⏱ Your program ran for more than 15 seconds. Maybe an infinite loop? Reload the page to stop it." };
  return { status: rc === 0 ? "ok" : "runtime", output: out };
}

// Output comparison: ignores \r, trailing spaces on each line and blank lines at the end.
export function normalizeOutput(s) {
  return (s || "").replace(/\r\n?/g, "\n").split("\n").map(l => l.replace(/[ \t]+$/, "")).join("\n").replace(/\n+$/, "").replace(/^\n+/, "");
}
export function outputsMatch(actual, expected) {
  return normalizeOutput(actual) === normalizeOutput(expected);
}
export function firstDiffLine(actual, expected) {
  const a = normalizeOutput(actual).split("\n"), e = normalizeOutput(expected).split("\n");
  for (let i = 0; i < Math.max(a.length, e.length); i++) if (a[i] !== e[i]) return i;
  return -1;
}
// Strips comments and string contents so "must use" checks look at real code only.
export function codeOnly(code) {
  return code.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");
}

// Returns the "must use" items missing from the code (comment markers are checked in the raw code).
export function missingMust(code, list = []) {
  const ns = s => String(s).replace(/\s+/g, "");
  const real = ns(codeOnly(code)), raw = ns(code);
  return list.filter(m => !(/^(\/\/|\/\*|\*\/)/.test(m) ? raw : real).includes(ns(m)));
}
