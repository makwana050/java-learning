const J = String.raw;

export default {
  title: "JDK, JRE and JVM",
  summary: "Three names you will hear all the time. Learn what each one is, what is inside it, and how they fit together.",

  concept: J`
<h2>Concept</h2>
<p>When you install Java you get a set of tools and programs. They come in three layers, one inside the other:</p>

<div style="margin:1.2rem 0;max-width:560px">
  <div style="border:3px solid #c2410c;border-radius:12px;padding:.8rem 1rem;background:#fff">
    <b style="color:#c2410c">JDK — Java Development Kit</b><br><span class="small">JRE + development tools: javac, java, javadoc, jar, jshell, jdb…</span>
    <div style="border:3px solid #1e40af;border-radius:10px;padding:.8rem 1rem;margin-top:.7rem;background:#f5f7ff">
      <b style="color:#1e40af">JRE — Java Runtime Environment</b><br><span class="small">JVM + class libraries (java.lang, java.util, java.io…)</span>
      <div style="border:3px solid #15803d;border-radius:8px;padding:.7rem 1rem;margin-top:.7rem;background:#f0faf3">
        <b style="color:#15803d">JVM — Java Virtual Machine</b><br><span class="small">Loads, verifies and executes bytecode</span>
      </div>
    </div>
  </div>
</div>
<div class="note"><b>JDK = JRE + development tools</b> &nbsp;·&nbsp; <b>JRE = JVM + class libraries</b><br>To <b>write and compile</b> programs you need the JDK. To only <b>run</b> them, the runtime part is enough.</div>

<h3>1. JVM — Java Virtual Machine</h3>
<p>The JVM is a program that behaves like a computer. Its "machine language" is <b>bytecode</b>. When you type <code>java Hello</code>, the JVM starts and does this:</p>
<table>
<tr><th>Part of the JVM</th><th>Job</th></tr>
<tr><td><b>Class Loader</b></td><td>Finds <code>Hello.class</code> (and any other classes it needs) and loads them into memory.</td></tr>
<tr><td><b>Bytecode Verifier</b></td><td>Checks the bytecode is valid and safe before it runs — part of why Java is called secure.</td></tr>
<tr><td><b>Execution Engine</b></td><td>An <b>interpreter</b> runs bytecode instruction by instruction; the <b>JIT compiler</b> converts frequently used parts into native machine code so they run fast.</td></tr>
<tr><td><b>Garbage Collector</b></td><td>Automatically frees memory used by objects that are no longer needed.</td></tr>
<tr><td><b>Runtime memory areas</b></td><td><b>Method area</b> (class information), <b>Heap</b> (all objects), <b>Stack</b> (one per thread — method calls and local variables), <b>PC register</b> and <b>native method stack</b>.</td></tr>
</table>
<div class="warn"><b>Important:</b> bytecode is platform independent, but <b>the JVM itself is platform dependent</b>. Windows, Linux and macOS each need their own JVM. That is exactly how the same <code>.class</code> file runs everywhere.</div>

<h3>2. JRE — Java Runtime Environment</h3>
<p>The JVM alone cannot do much. Even printing needs ready-made code — <code>System</code>, <code>String</code>, <code>Math</code> and thousands of other classes. These are the <b>Java class libraries</b> (also called the Java API).</p>
<p><b>JRE = JVM + class libraries + supporting files.</b> It is everything needed to <b>run</b> a Java program, but it cannot compile one — there is no <code>javac</code> inside it.</p>

<h3>3. JDK — Java Development Kit</h3>
<p>The JDK is what programmers install. It contains the full runtime <b>plus</b> development tools:</p>
<table>
<tr><th>Tool</th><th>What it does</th></tr>
<tr><td><code>javac</code></td><td>Compiler — converts <code>.java</code> source into <code>.class</code> bytecode</td></tr>
<tr><td><code>java</code></td><td>Launcher — starts the JVM and runs a class</td></tr>
<tr><td><code>javadoc</code></td><td>Generates HTML documentation from comments in your code</td></tr>
<tr><td><code>jar</code></td><td>Packs many <code>.class</code> files into one <code>.jar</code> archive</td></tr>
<tr><td><code>jshell</code></td><td>Interactive shell to try Java statements one line at a time (Java 9+)</td></tr>
<tr><td><code>jdb</code></td><td>Debugger — run a program step by step</td></tr>
</table>

<h3>Who needs what?</h3>
<table>
<tr><th>Person</th><th>Needs</th><th>Why</th></tr>
<tr><td>Student writing programs</td><td>JDK</td><td>Must compile with <code>javac</code></td></tr>
<tr><td>User who only runs a Java application</td><td>Runtime (JRE)</td><td>Only needs to run bytecode</td></tr>
</table>
<div class="note"><b>Modern Java note:</b> since Java 11, Oracle no longer ships a separate JRE download. You install the JDK, and application makers can bundle a small custom runtime with their app using the <code>jlink</code> tool. The JDK/JRE/JVM idea is still the same, and it is a favourite interview question.</div>

<h3>Checking your installation</h3>
<p>Open a terminal (Command Prompt) and type:</p>
<pre>java -version
javac -version</pre>
<p>If both commands print a version number (for example <code>25</code>), the JDK is installed correctly. If <code>java</code> works but <code>javac</code> says "not recognized", only a runtime is available or the JDK's <code>bin</code> folder is not in your PATH.</p>

<h3>Java can tell you about itself</h3>
<p>A running program can ask the JVM for information using <code>System.getProperty(...)</code>. Run Example 2 below — the result depends on the machine running it, which shows that the same bytecode runs on different systems.</p>
`,

  samples: [
    {
      title: "Which part does what?",
      code: J`public class Layers {
    public static void main(String[] args) {
        System.out.println("JVM runs bytecode");
        System.out.println("JRE = JVM + libraries");
        System.out.println("JDK = JRE + tools");
    }
}`,
      output: "JVM runs bytecode\nJRE = JVM + libraries\nJDK = JRE + tools",
    },
    {
      title: "Ask the JVM about itself",
      note: "<code>System.getProperty(\"name\")</code> returns information from the JVM that is running your program. Your output will differ from someone running it on another computer.",
      code: J`public class AboutJava {
    public static void main(String[] args) {
        System.out.println("Java version: " + System.getProperty("java.version"));
        System.out.println("Operating system: " + System.getProperty("os.name"));
    }
}`,
      output: "Java version: (depends on the JVM)\nOperating system: (depends on the computer)",
      explain: "On your lab machine with JDK 25 the first line will show 25. On this website it shows the in-browser JVM's version. Same code, different machines — that is platform independence.",
    },
  ],

  practice: [
    {
      id: "c1t2p1",
      title: "The three equations",
      task: "<p>Print the relationship between the JDK, JRE and JVM exactly as shown.</p>",
      expected: "JDK = JRE + Development Tools\nJRE = JVM + Class Libraries\nJVM = Executes Bytecode",
      hints: ["Three lines → three <code>println</code> statements.", "Watch the capital letters: <code>Development Tools</code>, <code>Class Libraries</code>, <code>Executes Bytecode</code>."],
      solution: J`public class Main {
    public static void main(String[] args) {
        System.out.println("JDK = JRE + Development Tools");
        System.out.println("JRE = JVM + Class Libraries");
        System.out.println("JVM = Executes Bytecode");
    }
}`,
    },
    {
      id: "c1t2p2",
      title: "JDK tool list",
      task: "<p>Print a short guide to four JDK tools. Each line has the tool name, a space, <code>-</code>, a space and its job.</p>",
      expected: "javac - compiles source code into bytecode\njava - starts the JVM and runs a class\njavadoc - creates documentation\njar - packs class files into one archive",
      hints: ["Each line is one string inside one <code>println</code>.", "Everything is in lowercase."],
      solution: J`public class Main {
    public static void main(String[] args) {
        System.out.println("javac - compiles source code into bytecode");
        System.out.println("java - starts the JVM and runs a class");
        System.out.println("javadoc - creates documentation");
        System.out.println("jar - packs class files into one archive");
    }
}`,
    },
    {
      id: "c1t2p3",
      title: "Nested boxes",
      task: "<p>Draw the JDK ⊃ JRE ⊃ JVM nesting using text. Count the spaces carefully — each inner level starts 2 spaces further right.</p>",
      expected: "[ JDK\n  [ JRE\n    [ JVM ]\n  ]\n]",
      hints: ["Line 2 and line 4 begin with 2 spaces; line 3 begins with 4 spaces.", "Spaces at the start of a string are printed, e.g. <code>\"  [ JRE\"</code>."],
      solution: J`public class Main {
    public static void main(String[] args) {
        System.out.println("[ JDK");
        System.out.println("  [ JRE");
        System.out.println("    [ JVM ]");
        System.out.println("  ]");
        System.out.println("]");
    }
}`,
    },
    {
      id: "c1t2p4",
      title: "Inside the JVM",
      task: "<p>Print the four main jobs of the JVM in the order they happen, numbered.</p>",
      expected: "1. Class Loader loads the .class file\n2. Bytecode Verifier checks the code\n3. Execution Engine runs the code\n4. Garbage Collector frees unused memory",
      hints: ["Order: load → verify → execute → clean up memory.", "There is a space after each number and full stop, e.g. <code>\"1. Class Loader...\"</code>."],
      solution: J`public class Main {
    public static void main(String[] args) {
        System.out.println("1. Class Loader loads the .class file");
        System.out.println("2. Bytecode Verifier checks the code");
        System.out.println("3. Execution Engine runs the code");
        System.out.println("4. Garbage Collector frees unused memory");
    }
}`,
    },
  ],

  fill: [
    { id: "c1t2f1", prompt: "Complete the two relationships.", template: "JDK = ___ + development tools\nJRE = ___ + class libraries", answers: [["JRE"], ["JVM"]],
      explain: "The JDK contains the JRE; the JRE contains the JVM." },
    { id: "c1t2f2", prompt: "Complete the commands that check your installation.", template: "java ___\n___ -version", answers: [["-version", "--version"], ["javac"]],
      explain: "<code>java -version</code> checks the runtime; <code>javac -version</code> checks that the compiler (JDK) is available." },
    { id: "c1t2f3", prompt: "Which JDK tool lets you try Java one line at a time?", template: "C:\\> ___\njshell> System.out.println(\"try me\");", answers: [["jshell"]],
      explain: "<code>jshell</code> (Java 9+) is an interactive shell — handy for quick experiments." },
    { id: "c1t2f4", prompt: "Complete the statement that asks the JVM for its Java version.", template: "System.out.println(System.___(\"java.version\"));", answers: [["getProperty"]],
      explain: "<code>System.getProperty(key)</code> returns a system property such as <code>java.version</code> or <code>os.name</code>." },
  ],

  quiz: [
    { type: "mcq", q: "Which of these is <b>not</b> included in the JRE?", options: ["JVM", "Class libraries", "javac compiler", "java.lang package"], answer: 2,
      explain: "The compiler is a development tool — it is part of the JDK only." },
    { type: "mcq", q: "Which statement is correct?", options: ["Bytecode and the JVM are both platform independent", "Bytecode is platform independent; the JVM is platform dependent", "Bytecode is platform dependent; the JVM is platform independent", "Both are platform dependent"], answer: 1,
      explain: "Each operating system has its own JVM, and all of them run the same bytecode." },
    { type: "mcq", q: "Which part of the JVM converts frequently used bytecode into native machine code for speed?", options: ["Class Loader", "Garbage Collector", "JIT compiler", "Bytecode Verifier"], answer: 2,
      explain: "JIT = Just-In-Time compiler, part of the execution engine." },
    { type: "mcq", q: "In which JVM memory area are objects created?", options: ["Stack", "Heap", "PC register", "Method area"], answer: 1,
      explain: "All objects live on the heap. Local variables and method calls live on the stack." },
    { type: "mcq", q: "A friend can run Java programs but gets <i>'javac is not recognized'</i>. What is the most likely reason?", options: ["Their program has a bug", "They have only a runtime, or the JDK bin folder is not in PATH", "Their computer has no JVM", "javac only works on Linux"], answer: 1,
      explain: "Running works, so a JVM exists. The compiler is missing or not reachable." },
    { type: "output", q: "Predict the output.", code: J`public class Q {
    public static void main(String[] args) {
        System.out.println("JDK");
        System.out.println("  JRE");
        System.out.println("    JVM");
    }
}`, answer: "JDK\n  JRE\n    JVM", explain: "Spaces inside the quotes are printed as they are." },
  ],
};
