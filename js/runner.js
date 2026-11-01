// Runs Java inside the student's browser using CheerpJ (a JVM in WebAssembly)
// and the OpenJDK javac compiler (tools.jar, Java 8 language level).
// Nothing is sent to any server.

const CHEERPJ_LOADER = "https://cjrtnc.leaningtech.com/5.0/loader.js";
const TIMEOUT_MS = 15000;

const params = new URLSearchParams(location.search);
const DEV = params.has("dev") && ["localhost", "127.0.0.1"].includes(location.hostname);

let readyPromise = null;
let queue = Promise.resolve();

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

function withTimeout(promise) {
  return Promise.race([
    promise,
    new Promise(res => setTimeout(() => res("__timeout__"), TIMEOUT_MS)),
  ]);
}

/**
 * Compile and run a Java program.
 * Returns { status: "ok" | "compile" | "runtime" | "timeout" | "error", output }
 */
export function runJava(code, onPhase = () => {}) {
  const job = queue.then(() => doRun(code, onPhase));
  queue = job.catch(() => {});
  return job;
}

async function doRun(code, onPhase) {
  const cls = findMainClass(code);
  if (!cls) return { status: "compile", output: "error: no class found.\nEvery Java program needs a class, e.g.  public class Main { ... }" };
  if (!/static\s+void\s+main\s*\(/.test(code))
    return { status: "compile", output: "error: no main method found.\nAdd:  public static void main(String[] args) { ... }" };

  if (DEV) {
    onPhase("compiling");
    const r = await fetch("/__run", { method: "POST", body: JSON.stringify({ cls, code }) });
    return r.json();
  }

  try {
    onPhase("loading");
    await warmUp();
  } catch (e) {
    return { status: "error", output: "Could not start Java in this browser. Check your internet connection and reload the page.\n(" + e.message + ")" };
  }

  const con = document.getElementById("console");
  const cp = "/app" + new URL("tools.jar", location.href).pathname + ":/files/";
  const src = "/str/" + cls + ".java";

  con.textContent = "";
  window.cheerpjAddStringFile(src, code);
  onPhase("compiling");
  const exit = await withTimeout(window.cheerpjRunMain("com.sun.tools.javac.Main", cp, src, "-d", "/files/"));
  if (exit === "__timeout__") return { status: "timeout", output: "Compiling took too long. Reload the page and try again." };
  const compileText = clean(con.textContent);
  if (exit !== 0) return { status: "compile", output: compileText || "Compilation failed." };

  con.textContent = "";
  onPhase("running");
  const rc = await withTimeout(window.cheerpjRunMain(cls, cp));
  const out = clean(con.textContent);
  if (rc === "__timeout__")
    return { status: "timeout", output: out + "\n⏱ Your program ran for more than 15 seconds — maybe an infinite loop? Reload the page to stop it." };
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
