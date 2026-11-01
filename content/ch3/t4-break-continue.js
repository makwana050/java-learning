const J = String.raw;

export default {
  title: "break, continue & labels",
  summary: "Control a loop from inside: leave it early with break, skip to the next iteration with continue, and jump out of nested loops with labels.",

  concept: J`
<h2>Concept</h2>
<h3>break</h3>
<p><code>break</code> immediately <b>ends the innermost loop</b> (or switch) and continues with the statement after it.</p>
<pre class="java">for (int i = 1; i &lt;= 10; i++) {
    if (i == 4) break;
    System.out.print(i + " ");     // 1 2 3
}</pre>
<p>Typical use: stop searching once you found what you need.</p>

<h3>continue</h3>
<p><code>continue</code> <b>skips the rest of the current iteration</b> and goes to the next one. In a <code>for</code> loop the update (<code>i++</code>) still runs; in a <code>while</code> loop control goes straight to the condition — so make sure the variable was already updated, or you get an infinite loop.</p>
<pre class="java">for (int i = 1; i &lt;= 6; i++) {
    if (i % 3 == 0) continue;
    System.out.print(i + " ");     // 1 2 4 5
}</pre>

<h3>Labels: break and continue for outer loops</h3>
<p>In nested loops, plain <code>break</code> only leaves the inner loop. To leave (or continue) an outer loop, put a <b>label</b> before it and name it:</p>
<pre class="java">outer:
for (int i = 1; i &lt;= 3; i++) {
    for (int j = 1; j &lt;= 3; j++) {
        if (j == 2) continue outer;   // go to the next i
        if (i == 3) break outer;      // leave both loops
        System.out.println(i + "," + j);
    }
}</pre>
<ul>
<li>A label is an identifier followed by a colon, placed right before the loop.</li>
<li><code>break label;</code> ends the labelled loop; <code>continue label;</code> starts its next iteration.</li>
<li>Java has no <code>goto</code>; labelled break/continue are the safe replacement.</li>
</ul>

<h3>Infinite loops with break</h3>
<p>Sometimes a loop has no natural end condition; you write <code>while (true)</code> and break out from inside:</p>
<pre class="java">while (true) {
    int x = nextValue();
    if (x &lt; 0) break;
    sum += x;
}</pre>
<div class="note">Statements written directly after an unconditional <code>break</code> or <code>continue</code> in the same block are <b>unreachable</b> — a compile error.</div>
`,

  samples: [
    {
      title: "break and continue",
      code: J`public class BreakContinue {
    public static void main(String[] args) {
        for (int i = 1; i <= 10; i++) {
            if (i == 7) break;
            if (i % 2 == 0) continue;
            System.out.print(i + " ");
        }
        System.out.println();
    }
}`,
      output: "1 3 5",
    },
    {
      title: "Labelled break in nested loops",
      code: J`public class FindPair {
    public static void main(String[] args) {
        int target = 15;
        search:
        for (int a = 1; a <= 9; a++) {
            for (int b = a; b <= 9; b++) {
                if (a * b == target) {
                    System.out.println("Found: " + a + " x " + b);
                    break search;
                }
            }
        }
        System.out.println("Search over");
    }
}`,
      output: "Found: 3 x 5\nSearch over",
    },
    {
      title: "continue with a label",
      code: J`public class SkipRows {
    public static void main(String[] args) {
        rows:
        for (int i = 1; i <= 3; i++) {
            for (int j = 1; j <= 4; j++) {
                if (j > i) continue rows;
                System.out.print(j);
            }
        }
        System.out.println();
    }
}`,
      output: "112123",
      explain: "When j passes i, the rest of that row is skipped and the outer loop moves on.",
    },
  ],

  practice: [
    {
      id: "c3t4p1", title: "First multiple",
      task: "<p>Find the first number greater than 500 that is divisible by both 7 and 13. Use a loop with <code>break</code>.</p>",
      expected: "First: 546",
      mustUse: ["break"],
      hints: ["Loop from 501 upwards; break when <code>n % 7 == 0 && n % 13 == 0</code>."],
      solution: J`public class Main {
    public static void main(String[] args) {
        int found = 0;
        for (int n = 501; ; n++) {
            if (n % 7 == 0 && n % 13 == 0) {
                found = n;
                break;
            }
        }
        System.out.println("First: " + found);
    }
}`,
    },
    {
      id: "c3t4p2", title: "Skip the multiples",
      task: "<p>Print numbers from 1 to 20 on one line, skipping multiples of 3 and of 5 using <code>continue</code>.</p>",
      expected: "1 2 4 7 8 11 13 14 16 17 19",
      mustUse: ["continue"],
      hints: ["<code>if (i % 3 == 0 || i % 5 == 0) continue;</code>", "Build the line with a space between numbers (not after the last one)."],
      solution: J`public class Main {
    public static void main(String[] args) {
        String line = "";
        for (int i = 1; i <= 20; i++) {
            if (i % 3 == 0 || i % 5 == 0) continue;
            line += line.isEmpty() ? "" + i : " " + i;
        }
        System.out.println(line);
    }
}`,
    },
    {
      id: "c3t4p3", title: "Sum until a negative",
      task: "<p>Add the numbers from the input <code>\"8 3 12 5 -1 9 4\"</code> until you meet a negative number. Use <code>while (true)</code> and <code>break</code>.</p>",
      starter: J`import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner("8 3 12 5 -1 9 4");
    }
}`,
      expected: "Sum before negative: 28",
      mustUse: ["while (true)", "break"],
      hints: ["Inside the loop: read x; if x < 0 break; else sum += x."],
      solution: J`import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner("8 3 12 5 -1 9 4");
        int sum = 0;
        while (true) {
            int x = sc.nextInt();
            if (x < 0) break;
            sum += x;
        }
        System.out.println("Sum before negative: " + sum);
    }
}`,
    },
    {
      id: "c3t4p4", title: "Primes with labelled continue",
      task: "<p>Print all primes between 2 and 40 on one line. Use an outer loop for the number and an inner loop for divisors; when a divisor is found, use <code>continue outer;</code>.</p>",
      expected: "2 3 5 7 11 13 17 19 23 29 31 37",
      mustUse: ["continue outer"],
      hints: ["Label the outer loop <code>outer:</code>.", "If the inner loop finishes without continuing, the number is prime — print it."],
      solution: J`public class Main {
    public static void main(String[] args) {
        String out = "";
        outer:
        for (int n = 2; n <= 40; n++) {
            for (int d = 2; d * d <= n; d++) {
                if (n % d == 0) continue outer;
            }
            out += out.isEmpty() ? "" + n : " " + n;
        }
        System.out.println(out);
    }
}`,
    },
  ],

  fill: [
    { id: "c3t4f1", prompt: "Leave both loops when found.", template: "grid:\nfor (int r = 0; r < 5; r++)\n    for (int c = 0; c < 5; c++)\n        if (r * c == 6) ___ ___;", answers: [["break"], ["grid"]], explain: "break with the label of the outer loop." },
  ],

  quiz: [
    { type: "output", q: "Predict the output.", code: J`public class Q {
    public static void main(String[] args) {
        for (int i = 0; i < 3; i++) {
            for (int j = 0; j < 3; j++) {
                if (j == 1) break;
                System.out.print(i + "" + j + " ");
            }
        }
    }
}`, answer: "00 10 20", explain: "break leaves only the inner loop." },
    { type: "output", q: "Predict the output.", code: J`public class Q {
    public static void main(String[] args) {
        int i = 0, s = 0;
        while (i < 5) {
            i++;
            if (i == 3) continue;
            s += i;
        }
        System.out.println(s);
    }
}`, answer: "12", explain: "1 + 2 + 4 + 5 = 12." },
    { type: "mcq", q: "What does <code>continue</code> do inside a for loop?", options: ["exits the loop", "skips to the update and next condition check", "restarts the loop from i = 0", "exits the method"], answer: 1, explain: "The rest of the body is skipped; the update still runs." },
    { type: "mcq", q: "<code>break; System.out.println(\"x\");</code> in the same block —", options: ["prints x", "compile error: unreachable statement", "runtime error", "x printed after loop"], answer: 1, explain: "Code after an unconditional break can never run." },
  ],
};
