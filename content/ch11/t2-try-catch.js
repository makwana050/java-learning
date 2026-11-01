const J = String.raw;

export default {
  title: "try & catch",
  summary: "Handle exceptions so the program can recover: single and multiple catch blocks, multi-catch, nested try and the most useful exception methods.",

  concept: J`
<h2>Concept</h2>
<pre class="java">try {
    // code that might throw
} catch (ExceptionType e) {
    // runs only if that type (or a subclass) was thrown in try
}</pre>
<ul>
<li>When an exception occurs in the try block, the rest of the try block is <b>skipped</b> and control jumps to the first matching catch.</li>
<li>If no exception occurs, the catch blocks are skipped.</li>
<li>After the catch block, execution continues normally after the whole try-catch.</li>
</ul>

<h3>Multiple catch blocks</h3>
<pre class="java">try { … }
catch (NumberFormatException e) { System.out.println("Not a number"); }
catch (ArithmeticException e)   { System.out.println("Division by zero"); }
catch (Exception e)             { System.out.println("Something else: " + e); }</pre>
<p>Java checks the catch blocks <b>top to bottom</b> and runs the first one that matches. So <b>more specific (child) types must come first</b>. Putting <code>catch (Exception e)</code> before <code>catch (ArithmeticException e)</code> → <code>error: exception ArithmeticException has already been caught</code>.</p>

<h3>Multi-catch (Java 7)</h3>
<pre class="java">catch (NumberFormatException | ArithmeticException e) { … }</pre>
<p>The types must not be parent/child of each other, and <code>e</code> is implicitly final.</p>

<h3>Useful methods of an exception</h3>
<table>
<tr><th>Method</th><th>Returns</th></tr>
<tr><td><code>e.getMessage()</code></td><td>the detail message, e.g. "/ by zero"</td></tr>
<tr><td><code>e.toString()</code></td><td>class name + message: "java.lang.ArithmeticException: / by zero"</td></tr>
<tr><td><code>e.printStackTrace()</code></td><td>prints the full stack trace (great for debugging)</td></tr>
<tr><td><code>e.getClass().getSimpleName()</code></td><td>"ArithmeticException"</td></tr>
<tr><td><code>e.getCause()</code></td><td>the exception that caused this one (chained exceptions)</td></tr>
</table>

<h3>Nested try</h3>
<p>A try block can contain another try-catch. If the inner catch doesn't match, the exception goes to the outer catch.</p>

<h3>Good habits</h3>
<ul>
<li>Catch the most <b>specific</b> exception you can handle.</li>
<li>Never write an empty catch block that silently swallows an error.</li>
<li>Don't use exceptions for normal control flow — check <code>if (b != 0)</code> instead of catching ArithmeticException when you can.</li>
<li>Keep the try block small — only around the code that can actually fail.</li>
</ul>
`,

  samples: [
    {
      title: "Order of execution",
      code: J`public class Flow {
    public static void main(String[] args) {
        String[] inputs = {"25", "abc", "0"};
        for (String in : inputs) {
            try {
                System.out.println("Trying " + in);
                int n = Integer.parseInt(in);
                System.out.println("100 / " + n + " = " + (100 / n));
            } catch (NumberFormatException e) {
                System.out.println("  not a number");
            } catch (ArithmeticException e) {
                System.out.println("  cannot divide by zero");
            }
            System.out.println("  next");
        }
    }
}`,
      output: "Trying 25\n100 / 25 = 4\n  next\nTrying abc\n  not a number\n  next\nTrying 0\n  cannot divide by zero\n  next",
    },
    {
      title: "Multi-catch and exception methods",
      code: J`public class Methods {
    public static void main(String[] args) {
        Object[] data = {"7", 3, null};
        for (Object d : data) {
            try {
                String s = (String) d;
                System.out.println("Length: " + s.length());
            } catch (ClassCastException | NullPointerException e) {
                System.out.println("Problem: " + e.getClass().getSimpleName());
            }
        }
        try {
            int x = 1 / 0;
        } catch (ArithmeticException e) {
            System.out.println(e.getMessage());
            System.out.println(e.toString());
        }
    }
}`,
      output: "Length: 1\nProblem: ClassCastException\nProblem: NullPointerException\n/ by zero\njava.lang.ArithmeticException: / by zero",
    },
  ],

  practice: [
    {
      id: "c11t2p1", title: "Safe division",
      task: "<p>Write <code>static String safeDivide(String a, String b)</code> that parses both numbers and returns the integer quotient as text, or <code>\"Invalid number\"</code> / <code>\"Cannot divide by zero\"</code>. Test the cases in the expected output.</p>",
      expected: "84/4 -> 21\n84/x -> Invalid number\n84/0 -> Cannot divide by zero",
      mustUse: ["catch (NumberFormatException", "catch (ArithmeticException"],
      hints: ["Put both parseInt calls and the division in one try; return the result as \"\" + q."],
      solution: J`public class Main {
    static String safeDivide(String a, String b) {
        try {
            int x = Integer.parseInt(a);
            int y = Integer.parseInt(b);
            return "" + (x / y);
        } catch (NumberFormatException e) {
            return "Invalid number";
        } catch (ArithmeticException e) {
            return "Cannot divide by zero";
        }
    }

    public static void main(String[] args) {
        System.out.println("84/4 -> " + safeDivide("84", "4"));
        System.out.println("84/x -> " + safeDivide("84", "x"));
        System.out.println("84/0 -> " + safeDivide("84", "0"));
    }
}`,
    },
    {
      id: "c11t2p2", title: "Keep asking until valid",
      task: "<p>Simulate a user typing <code>\"ten\"</code>, <code>\"-5\"</code>, <code>\"42\"</code>. Read with a Scanner on that text using <code>next()</code>, and keep asking until a valid <b>positive</b> integer is entered. Use try-catch for non-numbers.</p>",
      starter: J`import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner("ten -5 42");
    }
}`,
      expected: "'ten' is not a number\n'-5' must be positive\nAccepted: 42",
      mustUse: ["catch (NumberFormatException"],
      hints: ["<code>while (true) { String t = sc.next(); try { int n = Integer.parseInt(t); if (n <= 0) { …; continue; } …; break; } catch (NumberFormatException e) { … } }</code>"],
      solution: J`import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner("ten -5 42");
        while (true) {
            String t = sc.next();
            try {
                int n = Integer.parseInt(t);
                if (n <= 0) {
                    System.out.println("'" + t + "' must be positive");
                    continue;
                }
                System.out.println("Accepted: " + n);
                break;
            } catch (NumberFormatException e) {
                System.out.println("'" + t + "' is not a number");
            }
        }
    }
}`,
    },
    {
      id: "c11t2p3", title: "Fix the catch order",
      task: "<p>The starter doesn't compile because a general catch comes before a specific one. Reorder the catch blocks so it compiles and prints the expected output.</p>",
      starter: J`public class Main {
    public static void main(String[] args) {
        int[] marks = {80, 90};
        try {
            System.out.println(marks[2]);
        } catch (Exception e) {
            System.out.println("Something went wrong");
        } catch (ArrayIndexOutOfBoundsException e) {
            System.out.println("No such student");
        }
    }
}`,
      expected: "No such student",
      hints: ["Specific (child) exceptions first, Exception last."],
      solution: J`public class Main {
    public static void main(String[] args) {
        int[] marks = {80, 90};
        try {
            System.out.println(marks[2]);
        } catch (ArrayIndexOutOfBoundsException e) {
            System.out.println("No such student");
        } catch (Exception e) {
            System.out.println("Something went wrong");
        }
    }
}`,
    },
    {
      id: "c11t2p4", title: "Process a dirty list",
      task: "<p>Sum the valid integers in <code>{\"10\", \"20\", \"x\", null, \"5\", \"7.5\"}</code>. Count the bad entries (non-numbers <b>and</b> nulls) with one multi-catch.</p>",
      expected: "Sum: 35, bad entries: 3",
      mustUse: ["NumberFormatException | NullPointerException"],
      hints: ["Call <code>s.trim()</code> before parsing so a null throws NullPointerException."],
      solution: J`public class Main {
    public static void main(String[] args) {
        String[] data = {"10", "20", "x", null, "5", "7.5"};
        int sum = 0, bad = 0;
        for (String s : data) {
            try {
                sum += Integer.parseInt(s.trim());
            } catch (NumberFormatException | NullPointerException e) {
                bad++;
            }
        }
        System.out.println("Sum: " + sum + ", bad entries: " + bad);
    }
}`,
    },
  ],

  fill: [
    { id: "c11t2f1", prompt: "Catch two unrelated exceptions in one block.", template: "catch (NumberFormatException ___ ArithmeticException e)", answers: [["|"]], explain: "Multi-catch uses |." },
    { id: "c11t2f2", prompt: "Get just the message of an exception.", template: "System.out.println(e.___());", answers: [["getMessage"]], explain: "getMessage() returns the detail message." },
  ],

  quiz: [
    { type: "output", q: "Predict the output.", code: J`public class Q {
    public static void main(String[] args) {
        try {
            System.out.print("A");
            int x = 5 / 0;
            System.out.print("B");
        } catch (ArithmeticException e) {
            System.out.print("C");
        }
        System.out.print("D");
    }
}`, answer: "ACD", explain: "B is skipped once the exception is thrown." },
    { type: "mcq", q: "Which catch order compiles?", options: ["Exception, then RuntimeException", "RuntimeException, then ArithmeticException", "ArithmeticException, then RuntimeException, then Exception", "Throwable, then Exception"], answer: 2, explain: "Children before parents." },
    { type: "output", q: "Predict the output.", code: J`public class Q {
    public static void main(String[] args) {
        try {
            try {
                Object o = "x";
                Integer i = (Integer) o;
            } catch (ArithmeticException e) {
                System.out.print("inner ");
            }
        } catch (ClassCastException e) {
            System.out.print("outer ");
        }
        System.out.print("end");
    }
}`, answer: "outer end", explain: "The inner catch doesn't match, so the outer one handles it." },
    { type: "mcq", q: "<code>catch (IOException | Exception e)</code> —", options: ["valid", "compile error: types are related", "catches only IOException", "runtime error"], answer: 1, explain: "Multi-catch types can't be subclasses of each other." },
  ],
};
