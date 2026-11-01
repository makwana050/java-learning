const J = String.raw;

export default {
  title: "What is an exception?",
  summary: "Errors that happen while a program runs: what an exception is, the exception class hierarchy, and what happens when nobody handles one.",

  concept: J`
<h2>Concept</h2>
<p>An <b>exception</b> is an event during execution that disrupts the normal flow of a program — dividing by zero, reading a missing file, using a null reference, converting "abc" to a number.</p>
<p>When it happens, Java creates an <b>exception object</b> describing the problem and <b>throws</b> it. The JVM then looks for code that <b>catches</b> it. If none is found, the program stops and prints a <b>stack trace</b>:</p>
<pre>Exception in thread "main" java.lang.ArithmeticException: / by zero
    at Main.divide(Main.java:4)
    at Main.main(Main.java:9)</pre>
<p>Read it top-down: the exception type, its message, then the chain of method calls (most recent first) with line numbers.</p>

<h3>Errors vs exceptions vs compile errors</h3>
<table>
<tr><th>Kind</th><th>Example</th><th>Handle it?</th></tr>
<tr><td>Compile-time error</td><td>missing semicolon</td><td>fix the code — the program never runs</td></tr>
<tr><td><b>Exception</b></td><td>file not found, bad input, divide by zero</td><td>yes — recover or report nicely</td></tr>
<tr><td><b>Error</b></td><td><code>OutOfMemoryError</code>, <code>StackOverflowError</code></td><td>no — serious JVM problems</td></tr>
<tr><td>Logical error</td><td>wrong formula</td><td>test and debug</td></tr>
</table>

<h3>The hierarchy</h3>
<pre>                 Throwable
              /             \
          Error            Exception
   (OutOfMemoryError,    /            \
  StackOverflowError)  IOException    RuntimeException  ← unchecked
                       SQLException      ArithmeticException
                       (checked)         NullPointerException
                                         ArrayIndexOutOfBoundsException
                                         NumberFormatException → IllegalArgumentException
                                         ClassCastException
                                         InputMismatchException</pre>

<h3>Checked vs unchecked</h3>
<table>
<tr><th></th><th>Checked exceptions</th><th>Unchecked exceptions</th></tr>
<tr><td>Classes</td><td>Exception and its subclasses <b>except</b> RuntimeException</td><td>RuntimeException and its subclasses (plus Errors)</td></tr>
<tr><td>Compiler</td><td><b>forces</b> you to catch them or declare them with <code>throws</code></td><td>doesn't force anything</td></tr>
<tr><td>Typical cause</td><td>outside problems you can't prevent (file missing, network down)</td><td>programming bugs (null, bad index, bad cast)</td></tr>
<tr><td>Examples</td><td>IOException, FileNotFoundException, SQLException, InterruptedException</td><td>ArithmeticException, NullPointerException, ArrayIndexOutOfBoundsException</td></tr>
</table>

<h3>Common unchecked exceptions</h3>
<table>
<tr><th>Exception</th><th>Caused by</th></tr>
<tr><td>ArithmeticException</td><td><code>10 / 0</code> (integers)</td></tr>
<tr><td>NullPointerException</td><td>calling a method/field on <code>null</code></td></tr>
<tr><td>ArrayIndexOutOfBoundsException</td><td><code>arr[arr.length]</code></td></tr>
<tr><td>StringIndexOutOfBoundsException</td><td><code>"abc".charAt(5)</code></td></tr>
<tr><td>NumberFormatException</td><td><code>Integer.parseInt("12a")</code></td></tr>
<tr><td>ClassCastException</td><td>wrong downcast</td></tr>
<tr><td>IllegalArgumentException</td><td>a method rejects an argument</td></tr>
</table>

<h3>Why handle exceptions?</h3>
<ul>
<li>Keep the program running (ask for input again, use a default value).</li>
<li>Show a friendly message instead of a stack trace.</li>
<li>Release resources (close files, connections) even when something fails.</li>
</ul>
`,

  samples: [
    {
      title: "Common exceptions, caught",
      code: J`public class Common {
    public static void main(String[] args) {
        try {
            int x = 10 / 0;
        } catch (ArithmeticException e) {
            System.out.println("1: " + e.getMessage());
        }
        try {
            int n = Integer.parseInt("12a");
        } catch (NumberFormatException e) {
            System.out.println("2: " + e.getMessage());
        }
        try {
            String s = null;
            s.length();
        } catch (NullPointerException e) {
            System.out.println("3: " + e.getClass().getSimpleName());
        }
        try {
            int[] a = new int[3];
            a[3] = 1;
        } catch (ArrayIndexOutOfBoundsException e) {
            System.out.println("4: " + e.getClass().getSimpleName());
        }
        System.out.println("Program continues normally");
    }
}`,
      output: "1: / by zero\n2: For input string: \"12a\"\n3: NullPointerException\n4: ArrayIndexOutOfBoundsException\nProgram continues normally",
    },
    {
      title: "Exceptions travel up the call stack",
      code: J`public class Propagate {
    static int divide(int a, int b) {
        System.out.println("divide starts");
        int r = a / b;
        System.out.println("divide ends");
        return r;
    }

    static int calculate() {
        System.out.println("calculate starts");
        int r = divide(10, 0);
        System.out.println("calculate ends");
        return r;
    }

    public static void main(String[] args) {
        try {
            calculate();
        } catch (ArithmeticException e) {
            System.out.println("Caught in main: " + e.getMessage());
        }
    }
}`,
      output: "calculate starts\ndivide starts\nCaught in main: / by zero",
      explain: "The exception leaves divide() and calculate() immediately (their \"ends\" lines never run) until main catches it.",
    },
  ],

  practice: [
    {
      id: "c11t1p1", title: "Name that exception",
      task: "<p>Write five small try-catch blocks that each trigger and catch one exception, printing only its simple class name: ArithmeticException, NumberFormatException, StringIndexOutOfBoundsException, ClassCastException, NullPointerException. Use <code>catch (Exception e)</code> and <code>e.getClass().getSimpleName()</code>.</p>",
      expected: "ArithmeticException\nNumberFormatException\nStringIndexOutOfBoundsException\nClassCastException\nNullPointerException",
      mustUse: ["getSimpleName()"],
      hints: ["ClassCastException: <code>Object o = \"text\"; Integer i = (Integer) o;</code>", "StringIndexOutOfBounds: <code>\"abc\".charAt(10);</code>"],
      solution: J`public class Main {
    public static void main(String[] args) {
        try { int x = 5 / 0; } catch (Exception e) { System.out.println(e.getClass().getSimpleName()); }
        try { Double.parseDouble("1.2.3"); } catch (Exception e) { System.out.println(e.getClass().getSimpleName()); }
        try { "abc".charAt(10); } catch (Exception e) { System.out.println(e.getClass().getSimpleName()); }
        try { Object o = "text"; Integer i = (Integer) o; } catch (Exception e) { System.out.println(e.getClass().getSimpleName()); }
        try { int[] a = null; int n = a.length; } catch (Exception e) { System.out.println(e.getClass().getSimpleName()); }
    }
}`,
    },
    {
      id: "c11t1p2", title: "Checked or unchecked?",
      task: "<p>Use <code>instanceof RuntimeException</code> to classify these exception objects and print whether each is checked or unchecked: <code>new java.io.IOException()</code>, <code>new ArithmeticException()</code>, <code>new InterruptedException()</code>, <code>new NumberFormatException()</code>.</p>",
      expected: "IOException: checked\nArithmeticException: unchecked\nInterruptedException: checked\nNumberFormatException: unchecked",
      mustUse: ["instanceof RuntimeException"],
      hints: ["Put them in an <code>Exception[]</code> and loop."],
      solution: J`public class Main {
    public static void main(String[] args) {
        Exception[] list = {
            new java.io.IOException(),
            new ArithmeticException(),
            new InterruptedException(),
            new NumberFormatException()
        };
        for (Exception e : list) {
            String kind = (e instanceof RuntimeException) ? "unchecked" : "checked";
            System.out.println(e.getClass().getSimpleName() + ": " + kind);
        }
    }
}`,
    },
  ],

  fill: [
    { id: "c11t1f1", prompt: "The root class of all exceptions and errors.", template: "java.lang.___", answers: [["Throwable"]], explain: "Throwable → Error / Exception." },
    { id: "c11t1f2", prompt: "Unchecked exceptions extend…", template: "___Exception", answers: [["Runtime"]], explain: "RuntimeException and its subclasses." },
  ],

  quiz: [
    { type: "mcq", q: "Which is a checked exception?", options: ["NullPointerException", "IOException", "ArithmeticException", "ClassCastException"], answer: 1, explain: "IOException is not a RuntimeException." },
    { type: "mcq", q: "NumberFormatException is a subclass of…", options: ["IOException", "IllegalArgumentException", "Error", "ArithmeticException"], answer: 1, explain: "It's an illegal argument to parseInt." },
    { type: "mcq", q: "StackOverflowError is…", options: ["a checked exception", "an unchecked exception", "an Error", "a compile error"], answer: 2, explain: "Errors indicate serious JVM problems." },
    { type: "mcq", q: "If an exception isn't caught anywhere…", options: ["it's ignored", "the program prints a stack trace and stops (that thread)", "the method returns 0", "Java retries"], answer: 1, explain: "The default handler prints the trace." },
  ],
};
