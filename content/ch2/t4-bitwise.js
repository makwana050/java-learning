const J = String.raw;

export default {
  title: "Bitwise & shift operators",
  summary: "Work directly on the binary digits of a number: AND, OR, XOR, NOT and the three shift operators.",

  concept: J`
<h2>Concept</h2>
<p>Integers are stored in binary. Bitwise operators work on each <b>bit</b> (0 or 1) separately. They work on <code>int</code>, <code>long</code>, <code>short</code>, <code>byte</code> and <code>char</code>.</p>

<h3>Bitwise operators</h3>
<table>
<tr><th>Operator</th><th>Rule for each bit</th><th>12 (1100) ? 10 (1010)</th></tr>
<tr><td><code>&amp;</code> AND</td><td>1 only if both bits are 1</td><td><code>1000</code> = 8</td></tr>
<tr><td><code>|</code> OR</td><td>1 if at least one bit is 1</td><td><code>1110</code> = 14</td></tr>
<tr><td><code>^</code> XOR</td><td>1 if the bits are different</td><td><code>0110</code> = 6</td></tr>
<tr><td><code>~</code> NOT</td><td>flips every bit</td><td><code>~12</code> = -13</td></tr>
</table>
<pre>   1100   (12)        1100        1100
 &amp; 1010   (10)      | 1010      ^ 1010
   ----               ----        ----
   1000   (8)         1110 (14)   0110 (6)</pre>
<div class="note"><b>Quick rule for NOT:</b> <code>~n = -(n + 1)</code>. So ~12 = -13 and ~-5 = 4. (Java uses two's complement for negative numbers.)</div>

<h3>Shift operators</h3>
<table>
<tr><th>Operator</th><th>What it does</th><th>Example</th></tr>
<tr><td><code>&lt;&lt;</code> left shift</td><td>moves bits left, fills with 0. Each shift multiplies by 2.</td><td><code>5 &lt;&lt; 3</code> = 5 × 2³ = 40</td></tr>
<tr><td><code>&gt;&gt;</code> signed right shift</td><td>moves bits right, keeps the sign bit. Each shift divides by 2 (rounding down).</td><td><code>40 &gt;&gt; 2</code> = 10, <code>-40 &gt;&gt; 2</code> = -10, <code>-7 &gt;&gt; 1</code> = -4</td></tr>
<tr><td><code>&gt;&gt;&gt;</code> unsigned right shift</td><td>moves bits right, always fills with 0. For negative numbers the result becomes a large positive number.</td><td><code>-8 &gt;&gt;&gt; 28</code> = 15</td></tr>
</table>
<div class="warn">For an <code>int</code>, only the lowest 5 bits of the shift distance are used (distance % 32). So <code>1 &lt;&lt; 32</code> is 1, not 0. For a long, it's distance % 64.</div>

<h3>Where are bits useful?</h3>
<ul>
<li><code>n &amp; 1</code> → 1 if odd, 0 if even (faster than %).</li>
<li><code>n &lt;&lt; 1</code> doubles, <code>n &gt;&gt; 1</code> halves.</li>
<li>Flags/permissions: store many on/off settings in one int (READ = 1, WRITE = 2, EXECUTE = 4; <code>perm | WRITE</code> turns write on, <code>perm &amp; WRITE</code> checks it).</li>
<li><code>a ^ b ^ b == a</code> → simple encryption tricks, and swapping without a temp variable.</li>
<li><code>n &amp; (n - 1) == 0</code> → n is a power of two (for n &gt; 0).</li>
</ul>
`,

  samples: [
    {
      title: "AND, OR, XOR, NOT",
      code: J`public class Bits {
    public static void main(String[] args) {
        int a = 12, b = 10;
        System.out.println(a & b);
        System.out.println(a | b);
        System.out.println(a ^ b);
        System.out.println(~a);
        System.out.println(Integer.toBinaryString(a & b));
    }
}`,
      output: "8\n14\n6\n-13\n1000",
    },
    {
      title: "Shifts",
      code: J`public class Shifts {
    public static void main(String[] args) {
        System.out.println(5 << 3);
        System.out.println(40 >> 2);
        System.out.println(-40 >> 2);
        System.out.println(-7 >> 1);
        System.out.println(-8 >>> 28);
        System.out.println(1 << 32);
        System.out.println(1L << 32);
    }
}`,
      output: "40\n10\n-10\n-4\n15\n1\n4294967296",
    },
    {
      title: "Permission flags",
      code: J`public class Flags {
    public static void main(String[] args) {
        final int READ = 1, WRITE = 2, EXECUTE = 4;
        int perm = READ;
        perm = perm | WRITE;
        System.out.println("perm = " + perm);
        System.out.println("can write? " + ((perm & WRITE) != 0));
        System.out.println("can execute? " + ((perm & EXECUTE) != 0));
        perm = perm & ~WRITE;
        System.out.println("after removing write: " + perm);
    }
}`,
      output: "perm = 3\ncan write? true\ncan execute? false\nafter removing write: 1",
    },
  ],

  practice: [
    {
      id: "c2t4p1", title: "Odd or even with bits",
      task: "<p>For the numbers 37 and 58, print <code>n &amp; 1</code> and whether the number is odd — using <code>&amp;</code>, not <code>%</code>.</p>",
      expected: "37 & 1 = 1 -> odd: true\n58 & 1 = 0 -> odd: false",
      mustUse: ["& 1"],
      hints: ["<code>(n & 1) == 1</code> means odd. Brackets are needed: == binds tighter than &."],
      solution: J`public class Main {
    public static void main(String[] args) {
        int n = 37;
        System.out.println(n + " & 1 = " + (n & 1) + " -> odd: " + ((n & 1) == 1));
        n = 58;
        System.out.println(n + " & 1 = " + (n & 1) + " -> odd: " + ((n & 1) == 1));
    }
}`,
    },
    {
      id: "c2t4p2", title: "Powers of two with shifts",
      task: "<p>Print 2⁰, 2⁵, 2¹⁰ and 2²⁰ using only the left shift operator on 1, then print 1000 divided by 8 using right shift.</p>",
      expected: "1\n32\n1024\n1048576\n125",
      mustUse: ["<<", ">>"],
      hints: ["2ⁿ = <code>1 << n</code>.", "Dividing by 8 = shifting right by 3."],
      solution: J`public class Main {
    public static void main(String[] args) {
        System.out.println(1 << 0);
        System.out.println(1 << 5);
        System.out.println(1 << 10);
        System.out.println(1 << 20);
        System.out.println(1000 >> 3);
    }
}`,
    },
    {
      id: "c2t4p3", title: "XOR swap and secret code",
      task: "<p>(1) Swap <code>p = 25</code> and <code>q = 90</code> using three XOR operations. (2) Encrypt the number 1234 with key 77 using XOR, then decrypt it with the same key.</p>",
      expected: "p = 90, q = 25\nencrypted = 1183\ndecrypted = 1234",
      mustUse: ["^="],
      hints: ["<code>p ^= q; q ^= p; p ^= q;</code>", "encrypted = 1234 ^ 77; decrypted = encrypted ^ 77."],
      solution: J`public class Main {
    public static void main(String[] args) {
        int p = 25, q = 90;
        p ^= q;
        q ^= p;
        p ^= q;
        System.out.println("p = " + p + ", q = " + q);
        int key = 77;
        int encrypted = 1234 ^ key;
        int decrypted = encrypted ^ key;
        System.out.println("encrypted = " + encrypted);
        System.out.println("decrypted = " + decrypted);
    }
}`,
    },
    {
      id: "c2t4p4", title: "Power of two?",
      task: "<p>Use the trick <code>n &gt; 0 &amp;&amp; (n &amp; (n - 1)) == 0</code> to test 64, 96 and 1.</p>",
      expected: "64 -> true\n96 -> false\n1 -> true",
      mustUse: ["n - 1"],
      hints: ["A power of two has exactly one 1-bit; n - 1 flips that bit and all lower bits, so the AND is 0."],
      solution: J`public class Main {
    public static void main(String[] args) {
        int n = 64;
        System.out.println(n + " -> " + (n > 0 && (n & (n - 1)) == 0));
        n = 96;
        System.out.println(n + " -> " + (n > 0 && (n & (n - 1)) == 0));
        n = 1;
        System.out.println(n + " -> " + (n > 0 && (n & (n - 1)) == 0));
    }
}`,
    },
  ],

  fill: [
    { id: "c2t4f1", prompt: "Fill the results (decimal).", template: "6 & 3 = ___\n6 | 3 = ___\n6 ^ 3 = ___", answers: [["2"], ["7"], ["5"]], explain: "110 & 011 = 010; 110 | 011 = 111; 110 ^ 011 = 101." },
    { id: "c2t4f2", prompt: "Multiply x by 16 and divide y by 4 with shifts.", template: "int a = x ___ 4;\nint b = y ___ 2;", answers: [["<<"], [">>"]], explain: "Shifting left by 4 multiplies by 2⁴; shifting right by 2 divides by 2²." },
  ],

  quiz: [
    { type: "output", q: "Predict the output.", code: J`public class Q {
    public static void main(String[] args) {
        System.out.println(~7);
        System.out.println(~-1);
    }
}`, answer: "-8\n0", explain: "~n = -(n + 1)." },
    { type: "output", q: "Predict the output.", code: J`public class Q {
    public static void main(String[] args) {
        System.out.println(3 << 2 | 1);
    }
}`, answer: "13", explain: "Shift has higher precedence than |: 12 | 1 = 13." },
    { type: "mcq", q: "What is <code>-16 &gt;&gt; 2</code>?", options: ["-4", "4", "1073741820", "-64"], answer: 0, explain: "Signed shift keeps the sign: -16 / 4 = -4." },
    { type: "mcq", q: "What is <code>1 &lt;&lt; 33</code> for an int?", options: ["0", "2", "8589934592", "compile error"], answer: 1, explain: "33 % 32 = 1, so it equals 1 << 1." },
    { type: "mcq", q: "Which operator always fills the left side with zeros?", options: [">>", ">>>", "<<", "~"], answer: 1, explain: "Unsigned right shift." },
  ],
};
