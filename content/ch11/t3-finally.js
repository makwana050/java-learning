const J = String.raw;

export default {
  title: "finally & try-with-resources",
  summary: "Code that must always run — for cleanup — and the modern way to close files and connections automatically.",

  concept: J`
<h2>Concept</h2>
<h3>finally</h3>
<pre class="java">try {
    …
} catch (Exception e) {
    …
} finally {
    // ALWAYS runs: after try if no exception, after catch if one was caught,
    // and even if the exception was not caught (before it propagates)
}</pre>
<p>Use it for <b>cleanup</b>: closing files, releasing locks, closing database connections.</p>
<ul>
<li>Allowed forms: try-catch, try-finally, try-catch-finally. A <code>try</code> alone is a compile error.</li>
<li>finally runs even when try or catch executes <code>return</code> — it runs <b>before</b> the method actually returns.</li>
<li>If finally itself has a <code>return</code>, it <b>overrides</b> the earlier return value (and swallows any exception) — a bad practice.</li>
<li>The only things that skip finally: <code>System.exit()</code>, a JVM crash, or the thread being killed.</li>
</ul>

<h3>try-with-resources (Java 7)</h3>
<p>Writing <code>close()</code> in finally is verbose and easy to get wrong. Any object that implements <code>AutoCloseable</code> (Scanner, readers, writers, connections) can be declared in the try's brackets and is closed <b>automatically</b>:</p>
<pre class="java">try (Scanner sc = new Scanner(new File("marks.txt"))) {
    while (sc.hasNextInt()) total += sc.nextInt();
} catch (FileNotFoundException e) {
    System.out.println("File missing");
}   // sc.close() has already been called here</pre>
<ul>
<li>Several resources: separate with <code>;</code>. They are closed in <b>reverse</b> order of opening.</li>
<li>Resources are closed <b>before</b> the catch/finally blocks run.</li>
<li>Your own classes can be used too — just implement <code>AutoCloseable</code> and its <code>close()</code> method.</li>
</ul>

<h3>final vs finally vs finalize</h3>
<table>
<tr><th>Word</th><th>What it is</th></tr>
<tr><td><code>final</code></td><td>keyword: constant variable / no override / no subclass</td></tr>
<tr><td><code>finally</code></td><td>block that always runs after try/catch</td></tr>
<tr><td><code>finalize()</code></td><td>old Object method called before garbage collection — deprecated, don't use</td></tr>
</table>
`,

  samples: [
    {
      title: "finally always runs",
      code: J`public class Always {
    static void test(int d) {
        try {
            System.out.println("  result " + (10 / d));
        } catch (ArithmeticException e) {
            System.out.println("  caught");
        } finally {
            System.out.println("  finally");
        }
    }

    static int early() {
        try {
            return 1;
        } finally {
            System.out.println("  finally before return");
        }
    }

    public static void main(String[] args) {
        System.out.println("d = 2:");
        test(2);
        System.out.println("d = 0:");
        test(0);
        System.out.println("early returned " + early());
    }
}`,
      output: "d = 2:\n  result 5\n  finally\nd = 0:\n  caught\n  finally\n  finally before return\nearly returned 1",
    },
    {
      title: "try-with-resources with your own resource",
      code: J`class Connection implements AutoCloseable {
    String name;
    Connection(String name) {
        this.name = name;
        System.out.println("open " + name);
    }
    @Override
    public void close() {
        System.out.println("close " + name);
    }
}

public class Main {
    public static void main(String[] args) {
        try (Connection db = new Connection("database"); Connection log = new Connection("logfile")) {
            System.out.println("working...");
            throw new IllegalStateException("disk full");
        } catch (IllegalStateException e) {
            System.out.println("caught: " + e.getMessage());
        } finally {
            System.out.println("finally");
        }
    }
}`,
      output: "open database\nopen logfile\nworking...\nclose logfile\nclose database\ncaught: disk full\nfinally",
      explain: "Resources close in reverse order, before catch and finally run.",
    },
  ],

  practice: [
    {
      id: "c11t3p1", title: "Lock and unlock",
      task: "<p>Write <code>static void useLab(String student, boolean crash)</code> that prints <code>student unlocked lab</code>, then <code>student is working</code>; if crash is true, throw <code>new RuntimeException(\"power cut\")</code>. The lab must be locked again in <b>finally</b>. Catch the exception in main.</p>",
      expected: "Ali unlocked lab\nAli is working\nlab locked\nBela unlocked lab\nBela is working\nlab locked\nmain caught: power cut",
      mustUse: ["finally"],
      hints: ["Don't catch inside useLab — let the exception pass through finally to main."],
      solution: J`public class Main {
    static void useLab(String student, boolean crash) {
        System.out.println(student + " unlocked lab");
        try {
            System.out.println(student + " is working");
            if (crash) throw new RuntimeException("power cut");
        } finally {
            System.out.println("lab locked");
        }
    }

    public static void main(String[] args) {
        try {
            useLab("Ali", false);
            useLab("Bela", true);
        } catch (RuntimeException e) {
            System.out.println("main caught: " + e.getMessage());
        }
    }
}`,
    },
    {
      id: "c11t3p2", title: "Auto-closing resource",
      task: "<p>Create class <code>Printer implements AutoCloseable</code> that prints <code>Printer on</code> when created, <code>Printing: text</code> in <code>print(String)</code> and <code>Printer off</code> in close(). Use it in try-with-resources to print two pages.</p>",
      expected: "Printer on\nPrinting: page 1\nPrinting: page 2\nPrinter off\nDone",
      mustUse: ["implements AutoCloseable", "try (Printer"],
      hints: ["<code>try (Printer p = new Printer()) { p.print(\"page 1\"); … }</code>"],
      solution: J`class Printer implements AutoCloseable {
    Printer() {
        System.out.println("Printer on");
    }

    void print(String text) {
        System.out.println("Printing: " + text);
    }

    @Override
    public void close() {
        System.out.println("Printer off");
    }
}

public class Main {
    public static void main(String[] args) {
        try (Printer p = new Printer()) {
            p.print("page 1");
            p.print("page 2");
        }
        System.out.println("Done");
    }
}`,
    },
  ],

  fill: [
    { id: "c11t3f1", prompt: "Block that runs whether or not an exception occurred.", template: "try { … } catch (Exception e) { … } ___ { cleanup(); }", answers: [["finally"]], explain: "finally always runs (except System.exit)." },
    { id: "c11t3f2", prompt: "Interface a resource must implement for try-with-resources.", template: "class Db implements ___ { public void close() { … } }", answers: [["AutoCloseable", "Closeable"]], explain: "AutoCloseable (Closeable extends it)." },
  ],

  quiz: [
    { type: "output", q: "Predict the output.", code: J`public class Q {
    static int f() {
        try { return 10; }
        finally { return 20; }
    }
    public static void main(String[] args) {
        System.out.println(f());
    }
}`, answer: "20", explain: "A return in finally overrides the try's return — avoid this." },
    { type: "output", q: "Predict the output.", code: J`public class Q {
    public static void main(String[] args) {
        try {
            System.out.print("T");
        } finally {
            System.out.print("F");
        }
        System.out.print("E");
    }
}`, answer: "TFE", explain: "try-finally without catch is allowed." },
    { type: "mcq", q: "What prevents finally from running?", options: ["return in try", "an exception in try", "System.exit(0) in try", "a break in try"], answer: 2, explain: "System.exit stops the JVM." },
    { type: "mcq", q: "In try-with-resources, resources are closed…", options: ["in the order opened", "in reverse order, before catch/finally", "only if no exception", "after finally"], answer: 1, explain: "Reverse order, then catch, then finally." },
  ],
};
