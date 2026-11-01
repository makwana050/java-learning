const J = String.raw;

export default {
  title: "Recursion",
  summary: "A method that calls itself. Learn base case and recursive case, trace the call stack, and solve classic problems recursively.",

  concept: J`
<h2>Concept</h2>
<p><b>Recursion</b> is when a method calls itself to solve a smaller version of the same problem. Every recursive method needs two parts:</p>
<ol>
<li><b>Base case</b> — a simple input answered directly, which <b>stops</b> the recursion.</li>
<li><b>Recursive case</b> — solve the problem using a call on a <b>smaller</b> input that moves toward the base case.</li>
</ol>
<pre class="java">static int factorial(int n) {
    if (n &lt;= 1) return 1;              // base case
    return n * factorial(n - 1);       // recursive case
}</pre>

<h3>Tracing factorial(4)</h3>
<pre>factorial(4) = 4 * factorial(3)
             = 4 * (3 * factorial(2))
             = 4 * (3 * (2 * factorial(1)))
             = 4 * (3 * (2 * 1))
             = 24</pre>
<p>Each call waits on the <b>call stack</b> until the call it made returns. The calls "wind up" to the base case, then "unwind" multiplying the results.</p>

<h3>StackOverflowError</h3>
<p>With no base case, or a step that doesn't get closer to it, the method calls itself forever until the stack runs out of memory: <code>java.lang.StackOverflowError</code>.</p>

<h3>Recursion vs loops</h3>
<table>
<tr><th></th><th>Recursion</th><th>Loop (iteration)</th></tr>
<tr><td>Code</td><td>often shorter, closer to the maths definition</td><td>sometimes longer</td></tr>
<tr><td>Memory</td><td>one stack frame per call</td><td>constant</td></tr>
<tr><td>Speed</td><td>call overhead; naive versions may repeat work (e.g. Fibonacci)</td><td>usually faster</td></tr>
<tr><td>Best for</td><td>trees, nested structures, divide-and-conquer (merge sort, binary search), Tower of Hanoi</td><td>simple counting and accumulating</td></tr>
</table>
<p>Anything written with recursion can be written with loops, and vice versa.</p>

<h3>Where to put the work</h3>
<p>Code <b>before</b> the recursive call runs on the way down; code <b>after</b> it runs on the way back up — in reverse order:</p>
<pre class="java">static void count(int n) {
    if (n == 0) return;
    System.out.print(n + " ");   // before: 3 2 1
    count(n - 1);
    System.out.print(n + " ");   // after:  1 2 3
}</pre>
`,

  samples: [
    {
      title: "Factorial and power",
      code: J`public class Rec {
    static long factorial(int n) {
        if (n <= 1) return 1;
        return n * factorial(n - 1);
    }

    static long power(int base, int exp) {
        if (exp == 0) return 1;
        return base * power(base, exp - 1);
    }

    public static void main(String[] args) {
        System.out.println(factorial(10));
        System.out.println(power(3, 5));
    }
}`,
      output: "3628800\n243",
    },
    {
      title: "Before and after the call",
      code: J`public class Order {
    static void count(int n) {
        if (n == 0) return;
        System.out.print("v" + n + " ");
        count(n - 1);
        System.out.print("^" + n + " ");
    }

    public static void main(String[] args) {
        count(3);
        System.out.println();
    }
}`,
      output: "v3 v2 v1 ^1 ^2 ^3",
    },
    {
      title: "Tower of Hanoi",
      code: J`public class Hanoi {
    static int moves = 0;

    static void hanoi(int n, char from, char to, char via) {
        if (n == 0) return;
        hanoi(n - 1, from, via, to);
        moves++;
        System.out.println("Move disk " + n + " " + from + " -> " + to);
        hanoi(n - 1, via, to, from);
    }

    public static void main(String[] args) {
        hanoi(3, 'A', 'C', 'B');
        System.out.println(moves + " moves");
    }
}`,
      output: "Move disk 1 A -> C\nMove disk 2 A -> B\nMove disk 1 C -> B\nMove disk 3 A -> C\nMove disk 1 B -> A\nMove disk 2 B -> C\nMove disk 1 A -> C\n7 moves",
      explain: "To move n disks: move n−1 out of the way, move the biggest, then move the n−1 back on top. It always takes 2ⁿ − 1 moves.",
    },
  ],

  practice: [
    {
      id: "c6t3p1", title: "Sum of digits (recursive)",
      task: "<p>Write a recursive <code>static int digitSum(int n)</code>. Test with 98765.</p>",
      expected: "digitSum(98765) = 35",
      mustUse: ["digitSum(n / 10)"],
      hints: ["Base case: n == 0 → 0.", "Recursive case: last digit + digitSum of the rest: <code>n % 10 + digitSum(n / 10)</code>."],
      solution: J`public class Main {
    static int digitSum(int n) {
        if (n == 0) return 0;
        return n % 10 + digitSum(n / 10);
    }

    public static void main(String[] args) {
        System.out.println("digitSum(98765) = " + digitSum(98765));
    }
}`,
    },
    {
      id: "c6t3p2", title: "Fibonacci (recursive)",
      task: "<p>Write <code>static int fib(int n)</code> where fib(0) = 0, fib(1) = 1, fib(n) = fib(n−1) + fib(n−2). Print fib(0) … fib(10) on one line.</p>",
      expected: "0 1 1 2 3 5 8 13 21 34 55",
      mustUse: ["fib(n - 1) + fib(n - 2)"],
      hints: ["Two base cases: <code>if (n < 2) return n;</code>"],
      solution: J`public class Main {
    static int fib(int n) {
        if (n < 2) return n;
        return fib(n - 1) + fib(n - 2);
    }

    public static void main(String[] args) {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i <= 10; i++) {
            if (i > 0) sb.append(" ");
            sb.append(fib(i));
        }
        System.out.println(sb);
    }
}`,
    },
    {
      id: "c6t3p3", title: "Reverse a String recursively",
      task: "<p>Write <code>static String reverse(String s)</code> using recursion (no loops, no StringBuilder). Test with \"recursion\".</p>",
      expected: "noisrucer",
      mustUse: ["reverse(s.substring(1))"],
      hints: ["Base case: empty string (or length ≤ 1) → return s.", "reverse of s = reverse(rest) + first char."],
      solution: J`public class Main {
    static String reverse(String s) {
        if (s.length() <= 1) return s;
        return reverse(s.substring(1)) + s.charAt(0);
    }

    public static void main(String[] args) {
        System.out.println(reverse("recursion"));
    }
}`,
    },
    {
      id: "c6t3p4", title: "Binary search (recursive)",
      task: "<p>Write <code>static int search(int[] a, int key, int lo, int hi)</code> recursively. Search <code>{2, 5, 8, 12, 16, 23, 38, 56, 72, 91}</code> for 23 and 40.</p>",
      expected: "23 at index 5\n40 at index -1",
      mustUse: ["static int search(int[] a, int key, int lo, int hi)"],
      hints: ["Base case: lo > hi → −1.", "mid = (lo + hi) / 2; equal → mid; key smaller → search(a, key, lo, mid − 1); else search(a, key, mid + 1, hi)."],
      solution: J`public class Main {
    static int search(int[] a, int key, int lo, int hi) {
        if (lo > hi) return -1;
        int mid = (lo + hi) / 2;
        if (a[mid] == key) return mid;
        if (key < a[mid]) return search(a, key, lo, mid - 1);
        return search(a, key, mid + 1, hi);
    }

    public static void main(String[] args) {
        int[] a = {2, 5, 8, 12, 16, 23, 38, 56, 72, 91};
        System.out.println("23 at index " + search(a, 23, 0, a.length - 1));
        System.out.println("40 at index " + search(a, 40, 0, a.length - 1));
    }
}`,
    },
    {
      id: "c6t3p5", title: "Decimal to binary",
      task: "<p>Write a recursive <code>static String toBinary(int n)</code> (without Integer.toBinaryString). Test with 37 and 0.</p>",
      expected: "37 -> 100101\n0 -> 0",
      hints: ["Base case: n < 2 → return \"\" + n.", "Otherwise: toBinary(n / 2) + (n % 2)."],
      solution: J`public class Main {
    static String toBinary(int n) {
        if (n < 2) return "" + n;
        return toBinary(n / 2) + (n % 2);
    }

    public static void main(String[] args) {
        System.out.println("37 -> " + toBinary(37));
        System.out.println("0 -> " + toBinary(0));
    }
}`,
    },
  ],

  fill: [
    { id: "c6t3f1", prompt: "Complete the recursive sum 1 + 2 + … + n.", template: "static int sum(int n) {\n    if (n == ___) return 0;\n    return n + sum(___);\n}", answers: [["0"], ["n - 1", "n-1"]], explain: "Base case n == 0; each call moves one step closer." },
    { id: "c6t3f2", prompt: "Infinite recursion ends with which error?", template: "java.lang.___", answers: [["StackOverflowError"]], explain: "Each call adds a stack frame until memory runs out." },
  ],

  quiz: [
    { type: "output", q: "Predict the output.", code: J`public class Q {
    static int f(int n) {
        if (n <= 0) return 0;
        return n + f(n - 2);
    }
    public static void main(String[] args) {
        System.out.println(f(7));
    }
}`, answer: "16", explain: "7 + 5 + 3 + 1 + 0." },
    { type: "output", q: "Predict the output.", code: J`public class Q {
    static void p(int n) {
        if (n > 2) return;
        p(n + 1);
        System.out.print(n);
    }
    public static void main(String[] args) {
        p(0);
    }
}`, answer: "210", explain: "Printing happens after the call, on the way back." },
    { type: "mcq", q: "What does every correct recursive method need?", options: ["a loop", "a static variable", "a base case", "two parameters"], answer: 2, explain: "Without a base case it never stops." },
    { type: "mcq", q: "How many calls does naive <code>fib(5)</code> make in total (including fib(5) itself)?", options: ["5", "9", "15", "32"], answer: 2, explain: "The tree of calls repeats work: 15 calls — why memoization or a loop is better." },
  ],
};
