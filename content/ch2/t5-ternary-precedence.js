const J = String.raw;

export default {
  title: "Ternary operator & precedence",
  summary: "The one-line if-else, and the rules that decide which operator runs first in a long expression.",

  concept: J`
<h2>Concept</h2>
<h3>The ternary (conditional) operator ? :</h3>
<p>It is Java's only operator with three operands:</p>
<pre class="java">result = condition ? valueIfTrue : valueIfFalse;</pre>
<pre class="java">int marks = 64;
String status = marks >= 40 ? "Pass" : "Fail";     // "Pass"
int bigger = a > b ? a : b;                         // maximum of a and b</pre>
<ul>
<li>The condition must be a <code>boolean</code>.</li>
<li>Both values must be compatible with the target type. In <code>true ? 1 : 2.0</code>, the int is promoted, giving <code>1.0</code>.</li>
<li>Ternaries can be nested, but use brackets and keep them short:<br><code>String grade = m >= 75 ? "A" : (m >= 60 ? "B" : "C");</code></li>
<li>It is an <b>expression</b> (it produces a value), not a statement: <code>x > 0 ? print1() : print2();</code> alone does not compile.</li>
</ul>

<h3>Operator precedence</h3>
<p>When an expression has several operators, <b>precedence</b> decides which runs first (like BODMAS). When operators have the same precedence, <b>associativity</b> decides the direction.</p>
<table>
<tr><th>Level (high → low)</th><th>Operators</th><th>Associativity</th></tr>
<tr><td>1. Postfix</td><td><code>x++ x--</code></td><td>left → right</td></tr>
<tr><td>2. Unary</td><td><code>++x --x + - ! ~ (cast)</code></td><td>right → left</td></tr>
<tr><td>3. Multiplicative</td><td><code>* / %</code></td><td>left → right</td></tr>
<tr><td>4. Additive</td><td><code>+ -</code></td><td>left → right</td></tr>
<tr><td>5. Shift</td><td><code>&lt;&lt; &gt;&gt; &gt;&gt;&gt;</code></td><td>left → right</td></tr>
<tr><td>6. Relational</td><td><code>&lt; &gt; &lt;= &gt;= instanceof</code></td><td>left → right</td></tr>
<tr><td>7. Equality</td><td><code>== !=</code></td><td>left → right</td></tr>
<tr><td>8. Bitwise AND</td><td><code>&amp;</code></td><td>left → right</td></tr>
<tr><td>9. Bitwise XOR</td><td><code>^</code></td><td>left → right</td></tr>
<tr><td>10. Bitwise OR</td><td><code>|</code></td><td>left → right</td></tr>
<tr><td>11. Logical AND</td><td><code>&amp;&amp;</code></td><td>left → right</td></tr>
<tr><td>12. Logical OR</td><td><code>||</code></td><td>left → right</td></tr>
<tr><td>13. Ternary</td><td><code>? :</code></td><td>right → left</td></tr>
<tr><td>14. Assignment</td><td><code>= += -= *= /= %= &amp;= |= ^= &lt;&lt;= &gt;&gt;=</code></td><td>right → left</td></tr>
</table>
<p><b>Memory aid:</b> "Unary, Maths, Shift, Compare, Bits, Logic, Ternary, Assign".</p>

<h3>Precedence vs evaluation order</h3>
<p>Precedence only decides how the expression is <b>grouped</b>. Java still evaluates operands <b>left to right</b>. In <code>a() + b() * c()</code>, the methods are called in the order a, b, c — then b×c is multiplied, then added.</p>
<div class="note">When in doubt, add brackets. Brackets cost nothing and make code easier to read.</div>
`,

  samples: [
    {
      title: "Ternary in practice",
      code: J`public class Ternary {
    public static void main(String[] args) {
        int a = 17, b = 29;
        int max = a > b ? a : b;
        System.out.println("Max: " + max);
        int n = 15;
        System.out.println(n + " is " + (n % 2 == 0 ? "even" : "odd"));
        int m = 68;
        String grade = m >= 75 ? "A" : m >= 60 ? "B" : m >= 40 ? "C" : "F";
        System.out.println("Grade: " + grade);
        System.out.println(true ? 1 : 2.0);
    }
}`,
      output: "Max: 29\n15 is odd\nGrade: B\n1.0",
    },
    {
      title: "Precedence step by step",
      code: J`public class Precedence {
    public static void main(String[] args) {
        System.out.println(2 + 3 * 4);
        System.out.println((2 + 3) * 4);
        System.out.println(20 - 10 - 5);
        System.out.println(100 / 10 / 5);
        System.out.println(10 + 20 % 7 * 2);
        int x = 5;
        int y = x++ * 2 + --x;
        System.out.println(y);
        int a, b, c;
        a = b = c = 4;
        System.out.println(a + b + c);
    }
}`,
      output: "14\n20\n5\n2\n22\n15\n12",
      explain: "20 % 7 = 6, × 2 = 12, + 10 = 22. x++ * 2 → 5 × 2 = 10 (x = 6), then --x → 5: 10 + 5 = 15.",
    },
  ],

  practice: [
    {
      id: "c2t5p1", title: "Largest of three",
      task: "<p>Find the largest of <code>a = 47, b = 82, c = 65</code> using ternary operators only (no if).</p>",
      expected: "Largest: 82",
      mustUse: ["?"],
      hints: ["First find max of a and b, then compare with c.", "<code>int max = (a > b ? a : b) > c ? (a > b ? a : b) : c;</code> — or use a helper variable."],
      solution: J`public class Main {
    public static void main(String[] args) {
        int a = 47, b = 82, c = 65;
        int ab = a > b ? a : b;
        int max = ab > c ? ab : c;
        System.out.println("Largest: " + max);
    }
}`,
    },
    {
      id: "c2t5p2", title: "Absolute value and sign",
      task: "<p>For <code>int n = -37;</code> print its absolute value and its sign word (positive, negative or zero) using ternaries.</p>",
      expected: "|-37| = 37\nSign: negative",
      mustUse: ["?"],
      hints: ["<code>int abs = n < 0 ? -n : n;</code>", "Nested: <code>n > 0 ? \"positive\" : n < 0 ? \"negative\" : \"zero\"</code>"],
      solution: J`public class Main {
    public static void main(String[] args) {
        int n = -37;
        int abs = n < 0 ? -n : n;
        String sign = n > 0 ? "positive" : n < 0 ? "negative" : "zero";
        System.out.println("|" + n + "| = " + abs);
        System.out.println("Sign: " + sign);
    }
}`,
    },
    {
      id: "c2t5p3", title: "Electricity bill",
      task: "<p>Units used: <code>units = 240</code>. The rate is ₹5 per unit if units ≤ 100, otherwise ₹7 per unit. A ₹50 surcharge is added if the bill exceeds ₹1000. Use ternaries.</p>",
      expected: "Rate: 7\nBill: 1730",
      mustUse: ["?"],
      hints: ["<code>int rate = units <= 100 ? 5 : 7;</code>", "<code>int bill = units * rate; bill = bill > 1000 ? bill + 50 : bill;</code>"],
      solution: J`public class Main {
    public static void main(String[] args) {
        int units = 240;
        int rate = units <= 100 ? 5 : 7;
        int bill = units * rate;
        bill = bill > 1000 ? bill + 50 : bill;
        System.out.println("Rate: " + rate);
        System.out.println("Bill: " + bill);
    }
}`,
    },
    {
      id: "c2t5p4", title: "Add brackets",
      task: "<p>Add brackets (only brackets — don't change numbers or operators) so each line prints the expected value.</p>",
      starter: J`public class Main {
    public static void main(String[] args) {
        System.out.println(8 + 4 / 2);
        System.out.println(3 * 2 + 4 * 5);
        System.out.println(36 / 6 / 3);
    }
}`,
      expected: "6\n90\n18",
      hints: ["(8 + 4) / 2 = 6.", "For 90, the addition in the middle must happen first: 3 * (2 + 4) * 5.", "36 / (6 / 3) = 18."],
      solution: J`public class Main {
    public static void main(String[] args) {
        System.out.println((8 + 4) / 2);
        System.out.println(3 * (2 + 4) * 5);
        System.out.println(36 / (6 / 3));
    }
}`,
    },
  ],

  fill: [
    { id: "c2t5f1", prompt: "Store the smaller of x and y.", template: "int min = x < y ___ x ___ y;", answers: [["?"], [":"]], explain: "condition ? ifTrue : ifFalse." },
    { id: "c2t5f2", prompt: "Which runs first? Write the operator.", template: "a + b * c      → first: ___\na || b && c    → first: ___", answers: [["*"], ["&&"]], explain: "* is above +; && is above ||." },
  ],

  quiz: [
    { type: "output", q: "Predict the output.", code: J`public class Q {
    public static void main(String[] args) {
        int x = 10;
        String s = x > 5 ? x > 8 ? "big" : "medium" : "small";
        System.out.println(s);
    }
}`, answer: "big", explain: "Ternary is right-associative: x > 5 ? (x > 8 ? \"big\" : \"medium\") : \"small\"." },
    { type: "output", q: "Predict the output.", code: J`public class Q {
    public static void main(String[] args) {
        System.out.println(5 + 3 * 2 > 10 && 4 % 3 == 1);
    }
}`, answer: "true", explain: "11 > 10 is true; 4 % 3 == 1 is true." },
    { type: "mcq", q: "Which has the LOWEST precedence?", options: ["&&", "==", "?:", "="], answer: 3, explain: "Assignment is evaluated last." },
    { type: "output", q: "Predict the output.", code: J`public class Q {
    public static void main(String[] args) {
        int a = 2;
        a += a++ * 3;
        System.out.println(a);
    }
}`, answer: "8", explain: "a += … means a = a + (…): the saved a is 2, a++ * 3 = 6 → 2 + 6 = 8." },
    { type: "output", q: "Predict the output.", code: J`public class Q {
    public static void main(String[] args) {
        char c = 'x';
        int i = 10;
        System.out.println(false ? i : c);
        System.out.println(false ? 10 : c);
    }
}`, answer: "120\nx", explain: "With an int variable the result is int (120). With a constant 10 that fits in char, the result type is char." },
  ],
};
