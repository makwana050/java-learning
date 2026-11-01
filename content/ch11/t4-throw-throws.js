const J = String.raw;

export default {
  title: "throw, throws, checked & unchecked",
  summary: "Raise your own exceptions with throw, declare checked ones with throws, and decide whether to handle or pass an exception on.",

  concept: J`
<h2>Concept</h2>
<h3>throw — raise an exception yourself</h3>
<pre class="java">static void setAge(int age) {
    if (age &lt; 0) {
        throw new IllegalArgumentException("Age cannot be negative: " + age);
    }
    …
}</pre>
<ul>
<li><code>throw</code> is followed by <b>one exception object</b>.</li>
<li>Execution stops at that line and the exception travels up the call stack like any other.</li>
<li>Statements right after an unconditional <code>throw</code> are unreachable (compile error).</li>
</ul>

<h3>throws — declare that a method may throw</h3>
<pre class="java">static String readFirstLine(String path) throws IOException {
    …   // code that may throw IOException, which we don't handle here
}</pre>
<ul>
<li>Written in the method <b>signature</b>, can list several types: <code>throws IOException, SQLException</code>.</li>
<li><b>Required for checked exceptions</b> that the method doesn't catch. Optional (but allowed, as documentation) for unchecked ones.</li>
<li>The caller must then either <b>catch</b> it or <b>declare</b> it too ("handle or declare" rule).</li>
<li><code>main</code> may declare <code>throws Exception</code> — then an uncaught checked exception just ends the program with a stack trace.</li>
</ul>

<h3>throw vs throws</h3>
<table>
<tr><th>throw</th><th>throws</th></tr>
<tr><td>a statement inside a method</td><td>part of the method declaration</td></tr>
<tr><td>actually raises one exception</td><td>declares exceptions that may happen</td></tr>
<tr><td>followed by an object: <code>throw new X()</code></td><td>followed by class names: <code>throws X, Y</code></td></tr>
</table>

<h3>The compiler and checked exceptions</h3>
<pre class="java">static void pause() {
    Thread.sleep(1000);   // ✗ error: unreported exception InterruptedException; must be caught or declared to be thrown
}</pre>
<p>Fix 1 — handle it: wrap in try-catch. Fix 2 — declare it: <code>static void pause() throws InterruptedException</code>.</p>

<h3>Rethrowing and wrapping</h3>
<p>A catch block can log a problem and throw it again, or wrap a low-level exception in a more meaningful one, keeping the original as the <b>cause</b>:</p>
<pre class="java">catch (NumberFormatException e) {
    throw new IllegalArgumentException("Bad roll number: " + text, e);
}</pre>

<h3>Overriding and throws</h3>
<p>An overriding method may throw the same checked exceptions, narrower ones, or none — never new or broader checked exceptions.</p>
`,

  samples: [
    {
      title: "throw for validation",
      code: J`public class Validate {
    static double sqrtOf(double x) {
        if (x < 0) {
            throw new IllegalArgumentException("Negative input: " + x);
        }
        return Math.sqrt(x);
    }

    public static void main(String[] args) {
        double[] inputs = {49, -4, 2.25};
        for (double x : inputs) {
            try {
                System.out.println("sqrt(" + x + ") = " + sqrtOf(x));
            } catch (IllegalArgumentException e) {
                System.out.println("Error: " + e.getMessage());
            }
        }
    }
}`,
      output: "sqrt(49.0) = 7.0\nError: Negative input: -4.0\nsqrt(2.25) = 1.5",
    },
    {
      title: "Handle or declare a checked exception",
      code: J`public class Checked {
    static void waitAbit() throws InterruptedException {
        Thread.sleep(10);
        System.out.println("waited (declared)");
    }

    static void waitSafely() {
        try {
            Thread.sleep(10);
            System.out.println("waited (handled)");
        } catch (InterruptedException e) {
            System.out.println("interrupted");
        }
    }

    public static void main(String[] args) throws InterruptedException {
        waitSafely();
        waitAbit();
    }
}`,
      output: "waited (handled)\nwaited (declared)",
    },
    {
      title: "Wrapping with a cause",
      code: J`public class Wrap {
    static int parseRoll(String text) {
        try {
            return Integer.parseInt(text);
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("Bad roll number: " + text, e);
        }
    }

    public static void main(String[] args) {
        try {
            parseRoll("21A");
        } catch (IllegalArgumentException e) {
            System.out.println(e.getMessage());
            System.out.println("Cause: " + e.getCause().getClass().getSimpleName());
        }
    }
}`,
      output: "Bad roll number: 21A\nCause: NumberFormatException",
    },
  ],

  practice: [
    {
      id: "c11t4p1", title: "Withdraw with throw",
      task: "<p>Write <code>static double withdraw(double balance, double amount)</code> that throws <code>IllegalArgumentException</code> with the messages shown when the amount is not positive or more than the balance; otherwise returns the new balance. Call it three times inside try-catch.</p>",
      expected: "New balance: 3000.0\nError: Amount must be positive\nError: Insufficient funds: balance 5000.0, requested 9000.0",
      mustUse: ["throw new IllegalArgumentException"],
      hints: ["Two if checks, each with a throw; then return balance - amount."],
      solution: J`public class Main {
    static double withdraw(double balance, double amount) {
        if (amount <= 0) throw new IllegalArgumentException("Amount must be positive");
        if (amount > balance) throw new IllegalArgumentException("Insufficient funds: balance " + balance + ", requested " + amount);
        return balance - amount;
    }

    public static void main(String[] args) {
        double[] requests = {2000, -50, 9000};
        for (double r : requests) {
            try {
                System.out.println("New balance: " + withdraw(5000, r));
            } catch (IllegalArgumentException e) {
                System.out.println("Error: " + e.getMessage());
            }
        }
    }
}`,
    },
    {
      id: "c11t4p2", title: "Fix: unreported exception",
      task: "<p>The starter doesn't compile because <code>Thread.sleep</code> throws a checked <code>InterruptedException</code>. Fix <code>countdown</code> by <b>declaring</b> it with <code>throws</code>, and handle it in main with try-catch.</p>",
      starter: J`public class Main {
    static void countdown(int from) {
        for (int i = from; i >= 1; i--) {
            System.out.println(i);
            Thread.sleep(50);
        }
        System.out.println("Go!");
    }

    public static void main(String[] args) {
        countdown(3);
    }
}`,
      expected: "3\n2\n1\nGo!",
      mustUse: ["throws InterruptedException", "catch (InterruptedException"],
      hints: ["<code>static void countdown(int from) throws InterruptedException</code>", "In main: <code>try { countdown(3); } catch (InterruptedException e) { … }</code>"],
      solution: J`public class Main {
    static void countdown(int from) throws InterruptedException {
        for (int i = from; i >= 1; i--) {
            System.out.println(i);
            Thread.sleep(50);
        }
        System.out.println("Go!");
    }

    public static void main(String[] args) {
        try {
            countdown(3);
        } catch (InterruptedException e) {
            System.out.println("Countdown interrupted");
        }
    }
}`,
    },
    {
      id: "c11t4p3", title: "Parse a marks record",
      task: "<p>Write <code>static int[] parseMarks(String csv)</code> that splits by commas and parses each mark; if any mark is not a number <b>or</b> is outside 0–100, throw <code>IllegalArgumentException</code> with a message naming the bad value (wrap the NumberFormatException as the cause). Test the three records.</p>",
      expected: "[78, 92, 65]\nInvalid mark: 'abc'\nOut of range: 105",
      mustUse: ["throw new IllegalArgumentException"],
      hints: ["Inside the loop: try { int m = Integer.parseInt(p.trim()); } catch (NumberFormatException e) { throw new IllegalArgumentException(\"Invalid mark: '\" + p + \"'\", e); }"],
      solution: J`import java.util.Arrays;

public class Main {
    static int[] parseMarks(String csv) {
        String[] parts = csv.split(",");
        int[] marks = new int[parts.length];
        for (int i = 0; i < parts.length; i++) {
            String p = parts[i].trim();
            int m;
            try {
                m = Integer.parseInt(p);
            } catch (NumberFormatException e) {
                throw new IllegalArgumentException("Invalid mark: '" + p + "'", e);
            }
            if (m < 0 || m > 100) throw new IllegalArgumentException("Out of range: " + m);
            marks[i] = m;
        }
        return marks;
    }

    public static void main(String[] args) {
        String[] records = {"78, 92, 65", "80,abc,70", "99,105"};
        for (String r : records) {
            try {
                System.out.println(Arrays.toString(parseMarks(r)));
            } catch (IllegalArgumentException e) {
                System.out.println(e.getMessage());
            }
        }
    }
}`,
    },
  ],

  fill: [
    { id: "c11t4f1", prompt: "Raise an exception.", template: "___ new IllegalStateException(\"Not ready\");", answers: [["throw"]], explain: "throw + object." },
    { id: "c11t4f2", prompt: "Declare a checked exception in the method header.", template: "void load() ___ IOException { … }", answers: [["throws"]], explain: "throws + class names." },
  ],

  quiz: [
    { type: "mcq", q: "For which exception does the compiler force 'catch or declare'?", options: ["IllegalArgumentException", "InterruptedException", "NullPointerException", "ArithmeticException"], answer: 1, explain: "It's checked." },
    { type: "mcq", q: "Parent method <code>void f() throws IOException</code>. Which override is legal?", options: ["void f() throws Exception", "void f() throws FileNotFoundException", "void f() throws IOException, SQLException", "void f() throws Throwable"], answer: 1, explain: "FileNotFoundException is narrower than IOException." },
    { type: "output", q: "Predict the output.", code: J`public class Q {
    static void check(int n) {
        if (n > 2) throw new RuntimeException("big " + n);
        System.out.print(n + " ");
    }
    public static void main(String[] args) {
        try {
            for (int i = 1; i <= 5; i++) check(i);
        } catch (RuntimeException e) {
            System.out.print(e.getMessage());
        }
    }
}`, answer: "1 2 big 3", explain: "The loop stops at the first throw." },
    { type: "mcq", q: "Which statement is correct?", options: ["throw can list several exceptions", "throws is used inside the method body", "throw is followed by an exception object", "throws creates the exception object"], answer: 2, explain: "throw new X(...)." },
  ],
};
