const J = String.raw;

export default {
  title: "Arithmetic & assignment operators",
  summary: "+, -, *, /, % and the shortcut assignment operators — including integer division, remainder rules and what + does with Strings.",

  concept: J`
<h2>Concept</h2>
<p>An <b>operator</b> is a symbol that performs an operation on values called <b>operands</b>. In <code>a + b</code>, <code>+</code> is the operator, <code>a</code> and <code>b</code> are operands, and the whole thing is an <b>expression</b>.</p>

<h3>Arithmetic operators</h3>
<table>
<tr><th>Operator</th><th>Meaning</th><th>Example</th><th>Result</th></tr>
<tr><td><code>+</code></td><td>addition (or String joining)</td><td><code>17 + 5</code></td><td>22</td></tr>
<tr><td><code>-</code></td><td>subtraction</td><td><code>17 - 5</code></td><td>12</td></tr>
<tr><td><code>*</code></td><td>multiplication</td><td><code>17 * 5</code></td><td>85</td></tr>
<tr><td><code>/</code></td><td>division</td><td><code>17 / 5</code></td><td><b>3</b> (int ÷ int = int)</td></tr>
<tr><td><code>%</code></td><td>remainder (modulus)</td><td><code>17 % 5</code></td><td>2</td></tr>
</table>

<h3>Integer division</h3>
<p>When <b>both</b> operands are integers, <code>/</code> discards the fractional part: <code>9 / 2</code> is 4, <code>-9 / 2</code> is -4 (toward zero). If at least one operand is a floating-point number the result is decimal: <code>9 / 2.0</code> is 4.5.</p>

<h3>The remainder operator %</h3>
<ul>
<li><code>n % 2 == 0</code> → n is even. <code>n % 10</code> → last digit. <code>n / 10</code> → remove last digit.</li>
<li>The sign of the result follows the <b>left</b> operand: <code>-17 % 5</code> = -2, <code>17 % -5</code> = 2.</li>
<li>Works on decimals too: <code>7.5 % 2</code> = 1.5.</li>
</ul>

<h3>Division by zero</h3>
<table>
<tr><th>Expression</th><th>Result</th></tr>
<tr><td><code>10 / 0</code> (ints)</td><td><code>ArithmeticException: / by zero</code> — the program crashes</td></tr>
<tr><td><code>10 % 0</code> (ints)</td><td>ArithmeticException too</td></tr>
<tr><td><code>10.0 / 0</code></td><td><code>Infinity</code></td></tr>
<tr><td><code>-10.0 / 0</code></td><td><code>-Infinity</code></td></tr>
<tr><td><code>0.0 / 0</code></td><td><code>NaN</code> (Not a Number)</td></tr>
</table>

<h3>+ with Strings: concatenation</h3>
<p>If either operand of <code>+</code> is a String, the other is converted to text and joined. Expressions are evaluated <b>left to right</b>, so the position of the String matters:</p>
<pre class="java">System.out.println("Total: " + 4 + 6);    // Total: 46
System.out.println(4 + 6 + " total");     // 10 total
System.out.println("Total: " + (4 + 6));  // Total: 10
System.out.println('A' + 'B');            // 131 (chars are numbers)
System.out.println("" + 'A' + 'B');       // AB</pre>

<h3>Assignment operators</h3>
<table>
<tr><th>Operator</th><th>Same as</th><th>x = 20, then…</th></tr>
<tr><td><code>=</code></td><td>assign</td><td><code>x = 7</code> → 7</td></tr>
<tr><td><code>+=</code></td><td><code>x = x + n</code></td><td><code>x += 5</code> → 25</td></tr>
<tr><td><code>-=</code></td><td><code>x = x - n</code></td><td><code>x -= 5</code> → 15</td></tr>
<tr><td><code>*=</code></td><td><code>x = x * n</code></td><td><code>x *= 3</code> → 60</td></tr>
<tr><td><code>/=</code></td><td><code>x = x / n</code></td><td><code>x /= 6</code> → 3</td></tr>
<tr><td><code>%=</code></td><td><code>x = x % n</code></td><td><code>x %= 6</code> → 2</td></tr>
</table>
<div class="note">Compound operators include an <b>automatic cast</b>: <code>byte b = 10; b += 5;</code> compiles, but <code>b = b + 5;</code> doesn't. Also <code>int i = 10; i *= 2.5;</code> compiles and gives 25 (the double result is cast back to int).</div>
<p>Assignment is <b>right-associative</b> and returns a value: <code>a = b = c = 9;</code> sets all three to 9.</p>
`,

  samples: [
    {
      title: "All arithmetic operators",
      code: J`public class Arith {
    public static void main(String[] args) {
        int a = 29, b = 6;
        System.out.println(a + b);
        System.out.println(a - b);
        System.out.println(a * b);
        System.out.println(a / b);
        System.out.println(a % b);
        System.out.println((double) a / b);
        System.out.println(-a % b);
    }
}`,
      output: "35\n23\n174\n4\n5\n4.833333333333333\n-5",
    },
    {
      title: "Strings and + (left to right)",
      code: J`public class Concat {
    public static void main(String[] args) {
        int x = 3, y = 4;
        System.out.println("Sum: " + x + y);
        System.out.println(x + y + " is the sum");
        System.out.println("Sum: " + (x + y));
        System.out.println(x + y + "" + x + y);
        System.out.println('a' + 1 + "b");
    }
}`,
      output: "Sum: 34\n7 is the sum\nSum: 7\n734\n98b",
      explain: "Once a String appears, every following + joins text. Before that, numbers are added. 'a' + 1 = 98, then \"b\" is joined.",
    },
    {
      title: "Compound assignment",
      code: J`public class Compound {
    public static void main(String[] args) {
        int balance = 1000;
        balance += 250;
        balance -= 100;
        balance *= 2;
        balance /= 3;
        balance %= 400;
        System.out.println(balance);
        byte b = 120;
        b += 10;
        System.out.println(b);
    }
}`,
      output: "366\n-126",
      explain: "1000 → 1250 → 1150 → 2300 → 766 → 366. For the byte, += casts 130 back to byte: 130 − 256 = −126.",
    },
  ],

  practice: [
    {
      id: "c2t1p1", title: "Digits of a number",
      task: "<p>For <code>int n = 4729;</code> print the last digit, the number without its last digit, and the sum of its first and last digits. Use <code>/</code> and <code>%</code>.</p>",
      expected: "Last digit: 9\nWithout last digit: 472\nFirst + last: 13",
      mustUse: ["% 10", "/ 10"],
      hints: ["Last digit: <code>n % 10</code>. Remove last digit: <code>n / 10</code>.", "First digit of a 4-digit number: <code>n / 1000</code>."],
      solution: J`public class Main {
    public static void main(String[] args) {
        int n = 4729;
        System.out.println("Last digit: " + n % 10);
        System.out.println("Without last digit: " + n / 10);
        System.out.println("First + last: " + (n / 1000 + n % 10));
    }
}`,
    },
    {
      id: "c2t1p2", title: "Sum of digits",
      task: "<p>Find the sum of the digits of <code>int n = 5836;</code> without a loop — extract each digit with <code>%</code> and <code>/</code>.</p>",
      expected: "Sum of digits of 5836 = 22",
      hints: ["d4 = n % 10, d3 = n / 10 % 10, d2 = n / 100 % 10, d1 = n / 1000."],
      solution: J`public class Main {
    public static void main(String[] args) {
        int n = 5836;
        int d1 = n / 1000;
        int d2 = n / 100 % 10;
        int d3 = n / 10 % 10;
        int d4 = n % 10;
        System.out.println("Sum of digits of " + n + " = " + (d1 + d2 + d3 + d4));
    }
}`,
    },
    {
      id: "c2t1p3", title: "Temperature converter",
      task: "<p>Convert 98.6 °F to Celsius using <code>C = (F - 32) * 5 / 9</code>, and 37 °C to Fahrenheit using <code>F = C * 9 / 5 + 32</code>. Be careful with integer division for the second one!</p>",
      expected: "98.6 F = 37.0 C\n37 C = 98.6 F",
      hints: ["Store 98.6 in a double. For 37 (int), use <code>37 * 9 / 5.0 + 32</code> or a double variable.", "With all ints, 37 * 9 / 5 = 66 (not 66.6)."],
      solution: J`public class Main {
    public static void main(String[] args) {
        double f = 98.6;
        double c = (f - 32) * 5 / 9;
        System.out.println(f + " F = " + Math.round(c * 10) / 10.0 + " C");
        int celsius = 37;
        double fahr = celsius * 9 / 5.0 + 32;
        System.out.println(celsius + " C = " + fahr + " F");
    }
}`,
      explain: "(98.6 − 32) × 5 / 9 is 36.99999… in floating point, so it is rounded to one decimal with <code>Math.round(c * 10) / 10.0</code>.",
    },
    {
      id: "c2t1p4", title: "Notes counter",
      task: "<p>An ATM must pay <code>₹3780</code> using as few notes as possible from ₹500, ₹200, ₹100, ₹50, ₹20 and ₹10 notes. Use <code>/</code> and <code>%=</code>.</p>",
      expected: "500 x 7\n200 x 1\n100 x 0\n50 x 1\n20 x 1\n10 x 1",
      mustUse: ["%="],
      hints: ["count = amount / 500; then amount %= 500; repeat for each note.", "3780 → 7 × 500 leaves 280 → 1 × 200 leaves 80 …"],
      solution: J`public class Main {
    public static void main(String[] args) {
        int amount = 3780;
        System.out.println("500 x " + amount / 500); amount %= 500;
        System.out.println("200 x " + amount / 200); amount %= 200;
        System.out.println("100 x " + amount / 100); amount %= 100;
        System.out.println("50 x " + amount / 50);   amount %= 50;
        System.out.println("20 x " + amount / 20);   amount %= 20;
        System.out.println("10 x " + amount / 10);
    }
}`,
    },
    {
      id: "c2t1p5", title: "Fix the concatenation",
      task: "<p>This program should print the totals correctly, but the output is wrong. Fix it using brackets only.</p>",
      starter: J`public class Main {
    public static void main(String[] args) {
        int theory = 62, practical = 25;
        System.out.println("Total = " + theory + practical);
        System.out.println("Out of " + 75 + 25);
    }
}`,
      expected: "Total = 87\nOut of 100",
      hints: ["Put the additions inside brackets so they happen before joining with the text."],
      solution: J`public class Main {
    public static void main(String[] args) {
        int theory = 62, practical = 25;
        System.out.println("Total = " + (theory + practical));
        System.out.println("Out of " + (75 + 25));
    }
}`,
    },
  ],

  fill: [
    { id: "c2t1f1", prompt: "Complete so it checks whether n is even and finds its last digit.", template: "boolean even = n ___ 2 == 0;\nint last = n ___ 10;", answers: [["%"], ["%"]], explain: "The remainder operator." },
    { id: "c2t1f2", prompt: "Rewrite with compound operators.", template: "total = total + price;  →  total ___ price;\ncount = count * 2;     →  count ___ 2;", answers: [["+="], ["*="]], explain: "+= and *=." },
    { id: "c2t1f3", prompt: "Make the division give a decimal answer.", template: "double avg = (___) sum / n;", answers: [["double"]], explain: "Cast one operand to double before dividing." },
  ],

  quiz: [
    { type: "output", q: "Predict the output.", code: J`public class Q {
    public static void main(String[] args) {
        System.out.println(23 / 4 + " " + 23 % 4);
        System.out.println(-23 / 4 + " " + -23 % 4);
    }
}`, answer: "5 3\n-5 -3", explain: "Division truncates toward zero; the remainder takes the sign of the left operand." },
    { type: "output", q: "Predict the output.", code: J`public class Q {
    public static void main(String[] args) {
        System.out.println(1 + 2 + "3" + 4 + 5);
    }
}`, answer: "3345", explain: "1 + 2 = 3, then \"3\" joins → \"33\", then \"334\", \"3345\"." },
    { type: "mcq", q: "What does <code>int r = 10 / 0;</code> do at runtime?", options: ["r = 0", "r = Infinity", "ArithmeticException", "compile error"], answer: 2, explain: "Integer division by zero throws ArithmeticException." },
    { type: "mcq", q: "What is <code>5.0 / 0</code>?", options: ["0", "Infinity", "NaN", "ArithmeticException"], answer: 1, explain: "Floating-point division by zero gives Infinity." },
    { type: "output", q: "Predict the output.", code: J`public class Q {
    public static void main(String[] args) {
        int i = 10;
        i *= 2.5;
        short s = 5;
        s -= 7;
        System.out.println(i + " " + s);
    }
}`, answer: "25 -2", explain: "Compound assignment casts the result back to the variable's type." },
    { type: "output", q: "Predict the output.", code: J`public class Q {
    public static void main(String[] args) {
        System.out.println('x' + 'y');
        System.out.println("" + 'x' + 'y');
    }
}`, answer: "241\nxy", explain: "'x' = 120, 'y' = 121 — added as numbers unless a String comes first." },
  ],
};
