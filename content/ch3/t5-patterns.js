const J = String.raw;

export default {
  title: "Pattern programs",
  summary: "Nested loops made visual. Learn a simple method to turn any star or number pattern into code.",

  concept: J`
<h2>Concept</h2>
<p>Pattern programs train you to think with <b>nested loops</b>: the <b>outer loop</b> controls the <b>rows</b>, the <b>inner loop(s)</b> control what is printed in each row.</p>

<h3>The 4-step method</h3>
<ol>
<li><b>Count the rows</b> → outer loop <code>for (int i = 1; i &lt;= n; i++)</code>.</li>
<li>For row <code>i</code>, <b>write down how many spaces and how many symbols</b> it has. Make a small table.</li>
<li>Turn each count into a formula of <code>i</code> and <code>n</code> → one inner loop per part.</li>
<li>After the inner loops, <code>System.out.println()</code> to end the row.</li>
</ol>

<h3>Example: a right-aligned triangle (n = 4)</h3>
<pre>   *
  **
 ***
****</pre>
<table>
<tr><th>Row i</th><th>Spaces</th><th>Stars</th></tr>
<tr><td>1</td><td>3</td><td>1</td></tr>
<tr><td>2</td><td>2</td><td>2</td></tr>
<tr><td>3</td><td>1</td><td>3</td></tr>
<tr><td>4</td><td>0</td><td>4</td></tr>
<tr><td>formula</td><td><b>n − i</b></td><td><b>i</b></td></tr>
</table>
<pre class="java">for (int i = 1; i &lt;= n; i++) {
    for (int s = 1; s &lt;= n - i; s++) System.out.print(" ");
    for (int k = 1; k &lt;= i; k++) System.out.print("*");
    System.out.println();
}</pre>

<h3>Useful formulas</h3>
<table>
<tr><th>Shape</th><th>Row i symbols</th></tr>
<tr><td>Increasing triangle</td><td>i</td></tr>
<tr><td>Decreasing triangle</td><td>n − i + 1</td></tr>
<tr><td>Pyramid (centred)</td><td>spaces n − i, stars 2i − 1</td></tr>
<tr><td>Number triangle (1 12 123)</td><td>print k for k = 1..i</td></tr>
<tr><td>Floyd's triangle</td><td>a counter that keeps increasing across rows</td></tr>
<tr><td>Hollow square</td><td>print * when row or column is first/last, else space</td></tr>
</table>
<div class="note">Trailing spaces at the end of a line don't matter on this site (they are ignored when checking), but spaces <b>before</b> symbols do.</div>
`,

  samples: [
    {
      title: "Centred pyramid",
      code: J`public class Pyramid {
    public static void main(String[] args) {
        int n = 4;
        for (int i = 1; i <= n; i++) {
            for (int s = 1; s <= n - i; s++) System.out.print(" ");
            for (int k = 1; k <= 2 * i - 1; k++) System.out.print("*");
            System.out.println();
        }
    }
}`,
      output: "   *\n  ***\n *****\n*******",
    },
    {
      title: "Floyd's triangle",
      code: J`public class Floyd {
    public static void main(String[] args) {
        int num = 1;
        for (int i = 1; i <= 4; i++) {
            for (int j = 1; j <= i; j++) {
                System.out.print(num + " ");
                num++;
            }
            System.out.println();
        }
    }
}`,
      output: "1\n2 3\n4 5 6\n7 8 9 10",
    },
    {
      title: "Hollow square",
      code: J`public class Hollow {
    public static void main(String[] args) {
        int n = 5;
        for (int r = 1; r <= n; r++) {
            for (int c = 1; c <= n; c++) {
                if (r == 1 || r == n || c == 1 || c == n) System.out.print("*");
                else System.out.print(" ");
            }
            System.out.println();
        }
    }
}`,
      output: "*****\n*   *\n*   *\n*   *\n*****",
    },
  ],

  practice: [
    {
      id: "c3t5p1", title: "Decreasing triangle",
      task: "<p>Print this pattern for n = 5.</p>",
      expected: "*****\n****\n***\n**\n*",
      mustUse: ["for"],
      hints: ["Row i has n − i + 1 stars."],
      solution: J`public class Main {
    public static void main(String[] args) {
        int n = 5;
        for (int i = 1; i <= n; i++) {
            for (int k = 1; k <= n - i + 1; k++) System.out.print("*");
            System.out.println();
        }
    }
}`,
    },
    {
      id: "c3t5p2", title: "Number triangle",
      task: "<p>Print this pattern for n = 5.</p>",
      expected: "1\n12\n123\n1234\n12345",
      hints: ["Inner loop prints k from 1 to i."],
      solution: J`public class Main {
    public static void main(String[] args) {
        int n = 5;
        for (int i = 1; i <= n; i++) {
            for (int k = 1; k <= i; k++) System.out.print(k);
            System.out.println();
        }
    }
}`,
    },
    {
      id: "c3t5p3", title: "Repeated row numbers",
      task: "<p>Print this pattern for n = 4.</p>",
      expected: "1\n2 2\n3 3 3\n4 4 4 4",
      hints: ["Row i prints the number i, i times.", "Print a space between numbers but not after the last one, or just print \"i \" (trailing spaces are ignored here)."],
      solution: J`public class Main {
    public static void main(String[] args) {
        int n = 4;
        for (int i = 1; i <= n; i++) {
            for (int k = 1; k <= i; k++) {
                System.out.print(i);
                if (k < i) System.out.print(" ");
            }
            System.out.println();
        }
    }
}`,
    },
    {
      id: "c3t5p4", title: "Alphabet triangle",
      task: "<p>Print letters for n = 5. Hint: use a char variable and ++.</p>",
      expected: "A\nAB\nABC\nABCD\nABCDE",
      mustUse: ["char"],
      hints: ["<code>for (char c = 'A'; c < 'A' + i; c++) System.out.print(c);</code>"],
      solution: J`public class Main {
    public static void main(String[] args) {
        int n = 5;
        for (int i = 1; i <= n; i++) {
            for (char c = 'A'; c < 'A' + i; c++) System.out.print(c);
            System.out.println();
        }
    }
}`,
    },
    {
      id: "c3t5p5", title: "Diamond",
      task: "<p>Print a diamond with 4 rows going up and 3 coming down.</p>",
      expected: "   *\n  ***\n *****\n*******\n *****\n  ***\n   *",
      hints: ["Top half is the pyramid from the examples (i = 1..4).", "Bottom half: i goes from 3 down to 1 with the same formulas (spaces n − i, stars 2i − 1)."],
      solution: J`public class Main {
    public static void main(String[] args) {
        int n = 4;
        for (int i = 1; i <= n; i++) {
            for (int s = 1; s <= n - i; s++) System.out.print(" ");
            for (int k = 1; k <= 2 * i - 1; k++) System.out.print("*");
            System.out.println();
        }
        for (int i = n - 1; i >= 1; i--) {
            for (int s = 1; s <= n - i; s++) System.out.print(" ");
            for (int k = 1; k <= 2 * i - 1; k++) System.out.print("*");
            System.out.println();
        }
    }
}`,
    },
    {
      id: "c3t5p6", title: "Binary triangle",
      task: "<p>Print 1s and 0s alternating so that each row starts with 1 when (row) is odd and with 0 when even — row i column j prints <code>(i + j) % 2 == 0 ? 1 : 0</code>.</p>",
      expected: "1\n01\n101\n0101\n10101",
      hints: ["Inner loop j from 1 to i; print <code>(i + j) % 2 == 0 ? 1 : 0</code>."],
      solution: J`public class Main {
    public static void main(String[] args) {
        int n = 5;
        for (int i = 1; i <= n; i++) {
            for (int j = 1; j <= i; j++) {
                System.out.print((i + j) % 2 == 0 ? 1 : 0);
            }
            System.out.println();
        }
    }
}`,
    },
    {
      id: "c3t5p7", title: "Number pyramid (palindrome rows)",
      task: "<p>Print this centred pattern for n = 4.</p>",
      expected: "   1\n  121\n 12321\n1234321",
      hints: ["Spaces: n − i. Then count up from 1 to i, then down from i − 1 to 1."],
      solution: J`public class Main {
    public static void main(String[] args) {
        int n = 4;
        for (int i = 1; i <= n; i++) {
            for (int s = 1; s <= n - i; s++) System.out.print(" ");
            for (int k = 1; k <= i; k++) System.out.print(k);
            for (int k = i - 1; k >= 1; k--) System.out.print(k);
            System.out.println();
        }
    }
}`,
    },
  ],

  fill: [
    { id: "c3t5f1", prompt: "Complete the pyramid loops (row i, n rows).", template: "for (int s = 1; s <= ___; s++) print(\" \");\nfor (int k = 1; k <= ___; k++) print(\"*\");", answers: [["n-i", "n - i"], ["2*i-1", "2 * i - 1"]], explain: "Spaces n − i, stars 2i − 1." },
  ],

  quiz: [
    { type: "output", q: "Predict the output.", code: J`public class Q {
    public static void main(String[] args) {
        for (int i = 3; i >= 1; i--) {
            for (int j = 1; j <= i; j++) System.out.print(j);
            System.out.println();
        }
    }
}`, answer: "123\n12\n1", explain: "Rows have 3, 2, 1 numbers." },
    { type: "output", q: "Predict the output.", code: J`public class Q {
    public static void main(String[] args) {
        for (int i = 1; i <= 3; i++) {
            for (int j = 1; j <= 3; j++) System.out.print(i * j + " ");
            System.out.println();
        }
    }
}`, answer: "1 2 3\n2 4 6\n3 6 9", explain: "A small multiplication grid." },
    { type: "mcq", q: "How many times does the inner statement run? <code>for (i=1;i&lt;=4;i++) for (j=1;j&lt;=i;j++) x++;</code>", options: ["4", "8", "10", "16"], answer: 2, explain: "1 + 2 + 3 + 4 = 10." },
  ],
};
