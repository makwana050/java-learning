const J = String.raw;

export default {
  title: "Type casting: widening & narrowing",
  summary: "Converting a value from one type to another — automatically when it's safe, and with an explicit cast when data might be lost.",

  concept: J`
<h2>Concept</h2>
<p><b>Type casting</b> means converting a value of one data type into another. There are two kinds.</p>

<h3>1. Widening (implicit) — small to big, automatic</h3>
<p>When the target type can hold every value of the source type, Java converts automatically. No data is lost.</p>
<pre>byte → short → int → long → float → double
           char ↗</pre>
<pre class="java">int marks = 85;
double d = marks;     // 85.0 — automatic
long l = marks;       // 85
char c = 'A';
int code = c;         // 65 — char widens to int</pre>
<div class="note"><code>long → float</code> is allowed automatically even though float has fewer bytes (4 vs 8), because float's <i>range</i> is larger. Precision can be lost for very large values.</div>

<h3>2. Narrowing (explicit) — big to small, you must cast</h3>
<p>Going the other way could lose data, so Java refuses unless you write a <b>cast</b>: the target type in brackets.</p>
<pre class="java">double price = 99.99;
int p = (int) price;        // 99 — the decimal part is cut off (not rounded!)
int big = 300;
byte b = (byte) big;        // 44 — only the lowest 8 bits are kept
int n = 66;
char ch = (char) n;         // 'B'</pre>
<p>Without the cast: <code>int p = price;</code> → <code>error: incompatible types: possible lossy conversion from double to int</code>.</p>

<h3>How narrowing to byte works</h3>
<p>A byte keeps only the last 8 bits. A quick way to calculate: subtract 256 until the value is in -128..127. <code>300 - 256 = 44</code>. <code>200 - 256 = -56</code>. <code>(byte) 130</code> = -126.</p>

<h3>Truncation vs rounding</h3>
<p>Casting a decimal to int <b>truncates toward zero</b>: <code>(int) 7.9</code> = 7 and <code>(int) -7.9</code> = -7. To round, use <code>Math.round(7.9)</code> = 8 (returns a long for double input).</p>

<h3>Type promotion in expressions</h3>
<p>In arithmetic, Java first promotes the operands:</p>
<ol>
<li><code>byte</code>, <code>short</code> and <code>char</code> are always promoted to <b>int</b> before any arithmetic.</li>
<li>If either operand is long → the result is long; else if float → float; else if double → double.</li>
</ol>
<pre class="java">byte a = 10, b = 20;
byte c = a + b;          // ✗ error: a + b is an int
byte c = (byte) (a + b); // ✓
a += 5;                  // ✓ compound assignment casts automatically</pre>
<div class="note"><b>Compile-time constants are special:</b> <code>byte x = 10 + 20;</code> compiles, because the compiler knows the value (30) fits in a byte. Same for <code>final int k = 50; byte y = k;</code>.</div>

<h3>Casting with boolean</h3>
<p><code>boolean</code> cannot be cast to or from any number type. <code>(int) true</code> is a compile error.</p>
`,

  samples: [
    {
      title: "Widening is automatic",
      code: J`public class Widening {
    public static void main(String[] args) {
        int i = 42;
        long l = i;
        float f = l;
        double d = f;
        char c = 'z';
        int code = c;
        System.out.println(i + " " + l + " " + f + " " + d);
        System.out.println(code);
    }
}`,
      output: "42 42 42.0 42.0\n122",
    },
    {
      title: "Narrowing needs a cast",
      code: J`public class Narrowing {
    public static void main(String[] args) {
        double price = 249.99;
        int rupees = (int) price;
        System.out.println(rupees);
        System.out.println((int) -3.7);
        System.out.println(Math.round(249.99));
        System.out.println((byte) 300);
        System.out.println((byte) 200);
        System.out.println((char) 97);
    }
}`,
      output: "249\n-3\n250\n44\n-56\na",
      explain: "Casts cut off the decimal part. <code>Math.round</code> rounds. 300 − 256 = 44, 200 − 256 = −56.",
    },
    {
      title: "Promotion in expressions",
      code: J`public class Promotion {
    public static void main(String[] args) {
        byte a = 100, b = 50;
        int sum = a + b;
        byte small = (byte) (a + b);
        char c = 'A';
        System.out.println(sum);
        System.out.println(small);
        System.out.println(c + c);
        System.out.println(5 / 2 * 2.0);
        System.out.println(5 / 2.0 * 2);
    }
}`,
      output: "150\n-106\n130\n4.0\n5.0",
      explain: "150 does not fit in a byte: 150 − 256 = −106. <code>c + c</code> is int 130. In <code>5 / 2 * 2.0</code>, 5/2 is integer division (2) before the double appears.",
    },
  ],

  practice: [
    {
      id: "c1t7p1", title: "Average with decimals",
      task: "<p>Three subject marks are stored as ints: 78, 85, 90. Print the total, then the average with decimals. Make sure the average is <b>not</b> calculated with integer division.</p>",
      expected: "Total: 253\nAverage: 84.33333333333333",
      mustUse: ["(double)"],
      hints: ["253 / 3 with ints gives 84. Cast one side to double first.", "<code>double avg = (double) total / 3;</code>"],
      solution: J`public class Main {
    public static void main(String[] args) {
        int m1 = 78, m2 = 85, m3 = 90;
        int total = m1 + m2 + m3;
        double avg = (double) total / 3;
        System.out.println("Total: " + total);
        System.out.println("Average: " + avg);
    }
}`,
    },
    {
      id: "c1t7p2", title: "Rupees and paise",
      task: "<p>A bill is <code>double amount = 456.78;</code>. Separate it into whole rupees and paise using casting.</p>",
      expected: "Rupees: 456\nPaise: 78",
      mustUse: ["(int)"],
      hints: ["Rupees = <code>(int) amount</code>.", "Paise: <code>(int) Math.round(amount * 100) % 100</code> — round first, because 456.78 × 100 is stored as 45677.99999…"],
      solution: J`public class Main {
    public static void main(String[] args) {
        double amount = 456.78;
        int rupees = (int) amount;
        int paise = (int) Math.round(amount * 100) % 100;
        System.out.println("Rupees: " + rupees);
        System.out.println("Paise: " + paise);
    }
}`,
      explain: "Try <code>(int) (amount * 100) % 100</code> and see that you get 77 — a real-life floating-point trap.",
    },
    {
      id: "c1t7p3", title: "Character codes",
      task: "<p>Print the Unicode codes of <code>'J'</code> and <code>'j'</code>, then the difference between a capital and small letter, then convert <code>'m'</code> to capital using that difference.</p>",
      expected: "J = 74\nj = 106\nDifference = 32\nm -> M",
      hints: ["<code>(int) 'J'</code> gives 74.", "Capital = <code>(char) ('m' - 32)</code>"],
      solution: J`public class Main {
    public static void main(String[] args) {
        int upper = 'J';
        int lower = 'j';
        System.out.println("J = " + upper);
        System.out.println("j = " + lower);
        System.out.println("Difference = " + (lower - upper));
        char small = 'm';
        char capital = (char) (small - (lower - upper));
        System.out.println(small + " -> " + capital);
    }
}`,
    },
    {
      id: "c1t7p4", title: "Byte overflow detective",
      task: "<p>Cast the ints 127, 128, 255, 256 and -129 to byte and print each on its own line in the format <code>value -> result</code>.</p>",
      expected: "127 -> 127\n128 -> -128\n255 -> -1\n256 -> 0\n-129 -> 127",
      mustUse: ["(byte)"],
      hints: ["<code>System.out.println(128 + \" -> \" + (byte) 128);</code>"],
      solution: J`public class Main {
    public static void main(String[] args) {
        System.out.println(127 + " -> " + (byte) 127);
        System.out.println(128 + " -> " + (byte) 128);
        System.out.println(255 + " -> " + (byte) 255);
        System.out.println(256 + " -> " + (byte) 256);
        System.out.println(-129 + " -> " + (byte) -129);
    }
}`,
    },
    {
      id: "c1t7p5", title: "Fix the lossy conversions",
      task: "<p>This code does not compile. Add casts (don't change the values or types) so it prints the expected output.</p>",
      starter: J`public class Main {
    public static void main(String[] args) {
        byte a = 40, b = 50;
        byte sum = a + b;
        double temp = 36.9;
        int t = temp;
        long big = 123456789012L;
        int part = big % 1000;
        System.out.println(sum + " " + t + " " + part);
    }
}`,
      expected: "90 36 12",
      mustUse: ["(byte)", "(int)"],
      hints: ["<code>a + b</code> is an int — cast the whole expression: <code>(byte) (a + b)</code>.", "<code>big % 1000</code> is a long — cast it to int."],
      solution: J`public class Main {
    public static void main(String[] args) {
        byte a = 40, b = 50;
        byte sum = (byte) (a + b);
        double temp = 36.9;
        int t = (int) temp;
        long big = 123456789012L;
        int part = (int) (big % 1000);
        System.out.println(sum + " " + t + " " + part);
    }
}`,
    },
  ],

  fill: [
    { id: "c1t7f1", prompt: "Complete the widening order.", template: "byte → short → ___ → ___ → float → ___", answers: [["int"], ["long"], ["double"]], explain: "byte → short → int → long → float → double." },
    { id: "c1t7f2", prompt: "Cast to make it compile.", template: "double d = 9.8;\nint n = ___ d;", answers: [["(int)"]], explain: "Narrowing needs an explicit cast." },
    { id: "c1t7f3", prompt: "Make the byte sum compile.", template: "byte x = 1, y = 2;\nbyte z = ___(x + y);", answers: [["(byte)"]], explain: "Arithmetic on bytes produces an int." },
  ],

  quiz: [
    { type: "output", q: "Predict the output.", code: J`public class Q {
    public static void main(String[] args) {
        int x = (int) 9.99;
        int y = (int) -9.99;
        byte z = (byte) 129;
        System.out.println(x + " " + y + " " + z);
    }
}`, answer: "9 -9 -127", explain: "Truncation toward zero; 129 − 256 = −127." },
    { type: "mcq", q: "Which line compiles?", options: ["int i = 3.0;", "float f = 1.5;", "long l = 2.5f;", "double d = 'A';"], answer: 3, explain: "char widens to double (65.0). The others are narrowing without a cast." },
    { type: "mcq", q: "<code>byte b = 10; b = b * 2;</code> — what happens?", options: ["b becomes 20", "compile error", "runtime error", "b becomes 0"], answer: 1, explain: "b * 2 is an int. <code>b *= 2;</code> would compile." },
    { type: "output", q: "Predict the output.", code: J`public class Q {
    public static void main(String[] args) {
        char c = 'B';
        c += 2;
        System.out.println(c);
        System.out.println('B' + 2);
    }
}`, answer: "D\n68", explain: "Compound assignment casts back to char; the plain + produces an int." },
    { type: "mcq", q: "What does <code>(int) true</code> give?", options: ["1", "0", "-1", "compile error"], answer: 3, explain: "boolean can't be cast to a number." },
    { type: "output", q: "Predict the output.", code: J`public class Q {
    public static void main(String[] args) {
        System.out.println(7 / 2);
        System.out.println((double) 7 / 2);
        System.out.println((double) (7 / 2));
    }
}`, answer: "3\n3.5\n3.0", explain: "The cast applies before the division in line 2, after it in line 3." },
  ],
};
