// Code editor: CodeMirror 5 (from CDN) with a plain textarea fallback.
const CM = "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/";
let cmReady = null;

function css(href) { const l = document.createElement("link"); l.rel = "stylesheet"; l.href = href; document.head.appendChild(l); }
function js(src) { return new Promise((res, rej) => { const s = document.createElement("script"); s.src = src; s.onload = res; s.onerror = rej; document.head.appendChild(s); }); }

function loadCM() {
  if (!cmReady) {
    cmReady = (async () => {
      css(CM + "codemirror.min.css"); css(CM + "theme/material-darker.min.css");
      await js(CM + "codemirror.min.js");
      await Promise.all([js(CM + "mode/clike/clike.min.js"), js(CM + "addon/edit/matchbrackets.min.js"), js(CM + "addon/edit/closebrackets.min.js")]);
      return true;
    })().catch(() => false);
  }
  return cmReady;
}

/** Creates an editor inside `host`. Returns { getValue, setValue, focus } */
export async function createEditor(host, value = "") {
  host.classList.add("editor-wrap");
  const ok = await Promise.race([loadCM(), new Promise(r => setTimeout(() => r(false), 6000))]);
  if (ok && window.CodeMirror) {
    const cm = window.CodeMirror(host, {
      value, mode: "text/x-java", theme: "material-darker", lineNumbers: true,
      indentUnit: 4, tabSize: 4, matchBrackets: true, autoCloseBrackets: true,
      viewportMargin: Infinity, extraKeys: { Tab: c => c.replaceSelection("    ") },
    });
    return { getValue: () => cm.getValue(), setValue: v => cm.setValue(v), focus: () => cm.focus() };
  }
  const ta = document.createElement("textarea");
  ta.className = "plain-editor"; ta.spellcheck = false; ta.value = value;
  ta.addEventListener("keydown", e => {
    if (e.key === "Tab") { e.preventDefault(); const s = ta.selectionStart; ta.setRangeText("    ", s, ta.selectionEnd, "end"); }
  });
  host.appendChild(ta);
  return { getValue: () => ta.value, setValue: v => (ta.value = v), focus: () => ta.focus() };
}
