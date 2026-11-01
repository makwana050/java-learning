const J = String.raw;

export default {
  title: "Relational & logical operators",
  summary: "Comparisons produce true or false; logical operators combine them. Learn short-circuit evaluation — one of Java's most useful (and most tested) behaviours.",

  concept: J`
<h2>Concept</h2>
<h3>Relational (comparison) operators</h3>
<p>They compare two values and always produce a <code>boolean</code>.</p>
<table>
<tr><th>Operator</th><th>Meaning</th><th>8 ? 3</th></tr>
<tr><td><code>==</code></td><td>equal to</td><td>false</td></tr>
<tr><td><code>!=</code></td><td>not equal to</td><td>true</td></tr>
<tr><td><code>&gt;</code></td><td>greater than</td><td>true</td></tr>
<tr><td><code>&lt;</code></td><td>less than</td><td>false</td></tr>
<tr><td><code>&gt;=</code></td><td>greater than or equal</td><td>true</td></tr>
<tr><td><code>&lt;=</code></td><td>less than or equal</td><td>false</td></tr>
</table>
<ul>
<li><code>=</code> assigns, <code>==</code> compares. <code>if (x = 5)</code> is a compile error for ints.</li>
<li>Numbers of different types are compared by value: <code>10 == 10.0</code> is true, <code>'A' == 65</code> is true.</li>
<li>For Strings and objects, <code>==</code> compares <b>references</b>, not text — use <code>.equals()</code> (Strings chapter).</li>
<li>You can't chain comparisons like maths: <code>1 &lt; x &lt; 10</code> is an error. Write <code>x &gt; 1 &amp;&amp; x &lt; 10</code>.</li>
</ul>

<h3>Logical operators</h3>
<table>
<tr><th>Operator</th><th>Name</th><th>true when…</th></tr>
<tr><td><code>&amp;&amp;</code></td><td>logical AND</td><td>both sides are true</td></tr>
<tr><td><code>||</code></td><td>logical OR</td><td>at least one side is true</td></tr>
<tr><td><code>!</code></td><td>logical NOT</td><td>flips true ↔ false</td></tr>
<tr><td><code>^</code></td><td>XOR (exclusive OR)</td><td>exactly one side is true</td></tr>
</table>
<table>
<tr><th>A</th><th>B</th><th>A &amp;&amp; B</th><th>A || B</th><th>A ^ B</th><th>!A</th></tr>
<tr><td>true</td><td>true</td><td>true</td><td>true</td><td>false</td><td>false</td></tr>
<tr><td>true</td><td>false</td><td>false</td><td>true</td><td>true</td><td>false</td></tr>
<tr><td>false</td><td>true</td><td>false</td><td>true</td><td>true</td><td>true</td></tr>
<tr><td>false</td><td>false</td><td>false</td><td>false</td><td>false</td><td>true</td></tr>
</table>

<h3>Short-circuit evaluation</h3>
<p><code>&amp;&amp;</code> and <code>||</code> stop as soon as the answer is known:</p>
<ul>
<li><code>A &amp;&amp; B</code>: if A is <b>false</b>, B is <b>never evaluated</b>.</li>
<li><code>A || B</code>: if A is <b>true</b>, B is <b>never evaluated</b>.</li>
</ul>
<p>This prevents errors: <code>if (count != 0 &amp;&amp; total / count &gt; 50)</code> never divides by zero. It also means side effects on the right may not happen:</p>
<pre class="java">int x = 5;
boolean r = (x &gt; 10) &amp;&amp; (++x &gt; 5);   // right side skipped
System.out.println(x);                 // 5</pre>

<h3>Non-short-circuit: &amp; and |</h3>
<p>Used with booleans, single <code>&amp;</code> and <code>|</code> give the same true/false result but <b>always evaluate both sides</b>. (With integers they are bitwise operators — next topic.)</p>

<h3>Precedence among these</h3>
<p><code>!</code> → relational (<code>&lt; &gt; &lt;= &gt;=</code>) → equality (<code>== !=</code>) → <code>&amp;</code> → <code>^</code> → <code>|</code> → <code>&amp;&amp;</code> → <code>||</code>. So <code>a || b &amp;&amp; c</code> means <code>a || (b &amp;&amp; c)</code>. Use brackets to make your intention clear.</p>
`,

  samples: [
    {
      title: "Comparisons give booleans",
      code: J`public class Compare {
    public static void main(String[] args) {
        int marks = 72;
        System.out.println(marks >= 40);
        System.out.println(marks == 100);
        System.out.println(marks != 72);
        System.out.println(10 == 10.0);
        System.out.println('a' > 'B');
        boolean distinction = marks >= 75;
        System.out.println("Distinction? " + distinction);
    }
}`,
      output: "true\nfalse\nfalse\ntrue\ntrue\nDistinction? false",
      explain: "'a' is 97 and 'B' is 66, so 'a' > 'B'.",
    },
    {
      title: "Combining conditions",
      code: J`public class Logic {
    public static void main(String[] args) {
        int age = 20;
        boolean hasId = true;
        boolean isMember = false;
        System.out.println(age >= 18 && hasId);
        System.out.println(isMember || age > 60);
        System.out.println(!isMember);
        System.out.println(hasId ^ isMember);
        System.out.println(age > 18 && age < 25 || isMember);
    }
}`,
      output: "true\nfalse\ntrue\ntrue\ntrue",
    },
    {
      title: "Short-circuit in action",
      code: J`public class Short {
    public static void main(String[] args) {
        int a = 5, b = 5;
        boolean r1 = (a > 10) && (++a > 0);
        boolean r2 = (b > 10) & (++b > 0);
        System.out.println(r1 + " a=" + a);
        System.out.println(r2 + " b=" + b);
        int count = 0;
        boolean safe = count != 0 && 100 / count > 5;
        System.out.println("safe = " + safe);
    }
}`,
      output: "false a=5\nfalse b=6\nsafe = false",
      explain: "<code>&amp;&amp;</code> skipped <code>++a</code>; <code>&amp;</code> evaluated <code>++b</code>. The last line never divides by zero.",
    },
  ],

  practice: [
    {
      id: "c2t3p1", title: "Eligibility checker",
      task: "<p>A student can sit for the exam if attendance is at least 75 <b>and</b> fees are paid, <b>or</b> if they have a medical certificate. Given <code>attendance = 68</code>, <code>feesPaid = true</code>, <code>medical = true</code>, print each check as shown.</p>",
      expected: "Attendance OK: false\nFees paid: true\nMedical: true\nEligible: true",
      mustUse: ["&&", "||"],
      hints: ["<code>boolean eligible = (attendance >= 75 && feesPaid) || medical;</code>"],
      solution: J`public class Main {
    public static void main(String[] args) {
        int attendance = 68;
        boolean feesPaid = true;
        boolean medical = true;
        boolean attendanceOk = attendance >= 75;
        boolean eligible = (attendanceOk && feesPaid) || medical;
        System.out.println("Attendance OK: " + attendanceOk);
        System.out.println("Fees paid: " + feesPaid);
        System.out.println("Medical: " + medical);
        System.out.println("Eligible: " + eligible);
    }
}`,
    },
    {
      id: "c2t3p2", title: "Leap year",
      task: "<p>A year is a leap year if it is divisible by 4 and not by 100, <b>or</b> divisible by 400. Print the result for 2024, 1900, 2000 and 2026 using one boolean expression (copy it four times or use a helper variable).</p>",
      expected: "2024: true\n1900: false\n2000: true\n2026: false",
      mustUse: ["% 4", "% 100", "% 400"],
      hints: ["<code>(y % 4 == 0 && y % 100 != 0) || y % 400 == 0</code>", "Change y and print again — e.g. <code>int y = 2024; System.out.println(y + \": \" + (...));</code> then <code>y = 1900;</code>"],
      solution: J`public class Main {
    public static void main(String[] args) {
        int y = 2024;
        System.out.println(y + ": " + ((y % 4 == 0 && y % 100 != 0) || y % 400 == 0));
        y = 1900;
        System.out.println(y + ": " + ((y % 4 == 0 && y % 100 != 0) || y % 400 == 0));
        y = 2000;
        System.out.println(y + ": " + ((y % 4 == 0 && y % 100 != 0) || y % 400 == 0));
        y = 2026;
        System.out.println(y + ": " + ((y % 4 == 0 && y % 100 != 0) || y % 400 == 0));
    }
}`,
    },
    {
      id: "c2t3p3", title: "In range?",
      task: "<p>For <code>int temp = 42;</code> print whether it is between 20 and 40 (inclusive), whether it is outside that range, and whether exactly one of these is true: temp is even, temp &gt; 50.</p>",
      expected: "In range: false\nOutside: true\nExactly one: true",
      mustUse: ["!", "^"],
      hints: ["In range: <code>temp >= 20 && temp <= 40</code>. Outside: <code>!(…)</code>.", "Exactly one: <code>(temp % 2 == 0) ^ (temp > 50)</code>"],
      solution: J`public class Main {
    public static void main(String[] args) {
        int temp = 42;
        boolean inRange = temp >= 20 && temp <= 40;
        System.out.println("In range: " + inRange);
        System.out.println("Outside: " + !inRange);
        System.out.println("Exactly one: " + ((temp % 2 == 0) ^ (temp > 50)));
    }
}`,
    },
    {
      id: "c2t3p4", title: "Short-circuit proof",
      task: "<p>Write a program with <code>int calls = 0;</code> that shows <code>||</code> skips its right side when the left side is true, but <code>|</code> doesn't. Use <code>++calls &gt; 0</code> as the right side each time.</p>",
      expected: "After ||: calls = 0\nAfter |: calls = 1",
      mustUse: ["||", "++calls"],
      hints: ["<code>boolean r = true || ++calls > 0;</code> — then print calls.", "Then <code>r = true | ++calls > 0;</code> and print again."],
      solution: J`public class Main {
    public static void main(String[] args) {
        int calls = 0;
        boolean r = true || ++calls > 0;
        System.out.println("After ||: calls = " + calls);
        r = true | ++calls > 0;
        System.out.println("After |: calls = " + calls);
    }
}`,
    },
  ],

  fill: [
    { id: "c2t3f1", prompt: "Check that age is from 13 to 19.", template: "boolean teen = age ___ 13 ___ age ___ 19;", answers: [[">="], ["&&"], ["<="]], explain: "Both conditions must be true." },
    { id: "c2t3f2", prompt: "Safely check average only when count is not zero.", template: "if (count ___ 0 ___ sum / count > 60)", answers: [["!="], ["&&"]], explain: "&& short-circuits, so the division is skipped when count is 0." },
  ],

  quiz: [
    { type: "output", q: "Predict the output.", code: J`public class Q {
    public static void main(String[] args) {
        int x = 3;
        boolean b = x > 5 || x++ < 10;
        System.out.println(b + " " + x);
    }
}`, answer: "true 4", explain: "Left side is false, so the right side runs: x++ < 10 uses 3 (true) and x becomes 4." },
    { type: "output", q: "Predict the output.", code: J`public class Q {
    public static void main(String[] args) {
        int x = 3;
        boolean b = x < 5 || x++ < 10;
        System.out.println(b + " " + x);
    }
}`, answer: "true 3", explain: "Left side is true, so x++ is skipped." },
    { type: "mcq", q: "What is <code>true ^ true</code>?", options: ["true", "false", "1", "error"], answer: 1, explain: "XOR is true only when exactly one is true." },
    { type: "mcq", q: "Which compiles?", options: ["if (5 < x < 10)", "if (x = 10)", "if (x > 5 && x < 10)", "if (x > 5 and x < 10)"], answer: 2, explain: "Chained comparisons and 'and' are not Java." },
    { type: "output", q: "Predict the output.", code: J`public class Q {
    public static void main(String[] args) {
        boolean a = false, b = true, c = true;
        System.out.println(a && b || c);
        System.out.println(a && (b || c));
    }
}`, answer: "true\nfalse", explain: "&& binds tighter: (a && b) || c is true; with brackets the answer is false." },
  ],
};
