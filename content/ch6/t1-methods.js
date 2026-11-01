const J = String.raw;

export default {
  title: "Methods: define, call, return",
  summary: "Split a program into small named blocks that do one job each. Learn method syntax, parameters, return values and the call stack.",

  concept: J`
<h2>Concept</h2>
<p>A <b>method</b> is a named block of code that performs a task. You write it once and <b>call</b> it as many times as needed. Methods make programs shorter, easier to read, test and fix.</p>

<h3>Method syntax</h3>
<pre class="java">public static int square(int n) {
    return n * n;
}</pre>
<table>
<tr><th>Part</th><th>Meaning</th></tr>
<tr><td><code>public</code></td><td>access modifier — who can call it</td></tr>
<tr><td><code>static</code></td><td>belongs to the class; can be called from main without an object (Classes chapter explains non-static methods)</td></tr>
<tr><td><code>int</code></td><td><b>return type</b> — the type of value sent back; <code>void</code> means nothing is returned</td></tr>
<tr><td><code>square</code></td><td>method name (camelCase, usually a verb)</td></tr>
<tr><td><code>(int n)</code></td><td><b>parameter list</b> — inputs, each with a type and a name</td></tr>
<tr><td><code>return n * n;</code></td><td>sends a value back to the caller and ends the method</td></tr>
</table>
<p>The name plus the parameter types — <code>square(int)</code> — is the method's <b>signature</b>.</p>

<h3>Calling a method</h3>
<pre class="java">int a = square(7);                   // 49
System.out.println(square(3) + 1);   // 10
printLine();                         // a void method is called as a statement</pre>
<p>The values passed in a call are <b>arguments</b>; they are copied into the method's <b>parameters</b> in order. The number, order and types must match.</p>

<h3>Kinds of methods by input/output</h3>
<table>
<tr><th>Kind</th><th>Example</th></tr>
<tr><td>No parameters, no return</td><td><code>static void greet() { System.out.println("Hi"); }</code></td></tr>
<tr><td>Parameters, no return</td><td><code>static void printTable(int n) { … }</code></td></tr>
<tr><td>No parameters, returns</td><td><code>static double pi() { return 3.14159; }</code></td></tr>
<tr><td>Parameters and return</td><td><code>static int max(int a, int b) { return a &gt; b ? a : b; }</code></td></tr>
</table>
<p>Methods are also classified as <b>predefined</b> (from the Java library: <code>Math.sqrt</code>, <code>println</code>) and <b>user-defined</b> (yours); and as <b>static</b> vs <b>instance</b> methods (next chapter).</p>

<h3>Rules about return</h3>
<ul>
<li>A non-void method must return a value on <b>every</b> path. <code>if (n &gt; 0) return 1;</code> alone → <code>error: missing return statement</code>.</li>
<li>A void method may use <code>return;</code> (no value) to leave early.</li>
<li>Statements after a <code>return</code> in the same block are unreachable → compile error.</li>
<li>The returned value must match the return type (widening is allowed: an int can be returned from a double method).</li>
</ul>

<h3>The call stack</h3>
<p>Each call gets its own <b>stack frame</b> holding its parameters and local variables. When the method returns, the frame is removed. That's why local variables of one method can't be seen in another, and why two calls never mix up their variables.</p>
<pre>main() calls total() calls square()
┌──────────────┐
│ square: n=4  │  ← top (running now)
│ total: a, b  │
│ main: args   │
└──────────────┘</pre>

<h3>Methods from the Math class</h3>
<p><code>Math.max(a,b)</code>, <code>Math.min</code>, <code>Math.abs</code>, <code>Math.pow(2, 10)</code> (1024.0), <code>Math.sqrt(81)</code> (9.0), <code>Math.round(2.5)</code> (3), <code>Math.ceil(2.1)</code> (3.0), <code>Math.floor(2.9)</code> (2.0), <code>Math.random()</code> (0.0 ≤ x &lt; 1.0).</p>
`,

  samples: [
    {
      title: "Four kinds of methods",
      code: J`public class Kinds {
    static void line() {
        System.out.println("----------");
    }

    static void greet(String name) {
        System.out.println("Hello, " + name);
    }

    static int dice() {
        return 6;
    }

    static double average(int a, int b, int c) {
        return (a + b + c) / 3.0;
    }

    public static void main(String[] args) {
        line();
        greet("Anika");
        System.out.println("Dice: " + dice());
        System.out.println("Average: " + average(70, 80, 96));
        line();
    }
}`,
      output: "----------\nHello, Anika\nDice: 6\nAverage: 82.0\n----------",
    },
    {
      title: "Methods calling methods",
      code: J`public class Calls {
    static int square(int n) {
        System.out.println("  square(" + n + ")");
        return n * n;
    }

    static int sumOfSquares(int a, int b) {
        System.out.println(" sumOfSquares(" + a + ", " + b + ")");
        return square(a) + square(b);
    }

    public static void main(String[] args) {
        System.out.println("main starts");
        int r = sumOfSquares(3, 4);
        System.out.println("main got " + r);
    }
}`,
      output: "main starts\n sumOfSquares(3, 4)\n  square(3)\n  square(4)\nmain got 25",
    },
    {
      title: "Early return",
      code: J`public class Early {
    static String grade(int marks) {
        if (marks < 0 || marks > 100) return "Invalid";
        if (marks >= 75) return "A";
        if (marks >= 60) return "B";
        return "C";
    }

    public static void main(String[] args) {
        System.out.println(grade(82) + grade(64) + grade(30) + " " + grade(140));
    }
}`,
      output: "ABC Invalid",
    },
  ],

  practice: [
    {
      id: "c6t1p1", title: "isEven and isPrime",
      task: "<p>Write <code>static boolean isEven(int n)</code> and <code>static boolean isPrime(int n)</code>. Call them from main for 29 and 42.</p>",
      expected: "29: even=false, prime=true\n42: even=true, prime=false",
      mustUse: ["static boolean isEven(int n)", "static boolean isPrime(int n)"],
      hints: ["isEven: <code>return n % 2 == 0;</code>", "isPrime: return false if n < 2; loop i from 2 while i * i <= n; return false on a divisor; return true at the end."],
      solution: J`public class Main {
    static boolean isEven(int n) {
        return n % 2 == 0;
    }

    static boolean isPrime(int n) {
        if (n < 2) return false;
        for (int i = 2; i * i <= n; i++) {
            if (n % i == 0) return false;
        }
        return true;
    }

    public static void main(String[] args) {
        int[] nums = {29, 42};
        for (int n : nums) {
            System.out.println(n + ": even=" + isEven(n) + ", prime=" + isPrime(n));
        }
    }
}`,
    },
    {
      id: "c6t1p2", title: "Reusable table printer",
      task: "<p>Write <code>static void printTable(int n, int upto)</code> that prints <code>n x i = result</code> for i = 1..upto. Call it for 3 up to 4 and 12 up to 3.</p>",
      expected: "3 x 1 = 3\n3 x 2 = 6\n3 x 3 = 9\n3 x 4 = 12\n12 x 1 = 12\n12 x 2 = 24\n12 x 3 = 36",
      mustUse: ["static void printTable"],
      hints: ["The loop goes inside the method; main only calls it twice."],
      solution: J`public class Main {
    static void printTable(int n, int upto) {
        for (int i = 1; i <= upto; i++) {
            System.out.println(n + " x " + i + " = " + n * i);
        }
    }

    public static void main(String[] args) {
        printTable(3, 4);
        printTable(12, 3);
    }
}`,
    },
    {
      id: "c6t1p3", title: "GCD and LCM",
      task: "<p>Write <code>gcd(int a, int b)</code> using Euclid's algorithm (repeat: a, b = b, a % b until b is 0) and <code>lcm</code> that uses gcd. Print both for 84 and 36.</p>",
      expected: "GCD(84, 36) = 12\nLCM(84, 36) = 252",
      mustUse: ["static int gcd", "static int lcm"],
      hints: ["<code>while (b != 0) { int t = b; b = a % b; a = t; } return a;</code>", "lcm = a / gcd(a, b) * b"],
      solution: J`public class Main {
    static int gcd(int a, int b) {
        while (b != 0) {
            int t = b;
            b = a % b;
            a = t;
        }
        return a;
    }

    static int lcm(int a, int b) {
        return a / gcd(a, b) * b;
    }

    public static void main(String[] args) {
        System.out.println("GCD(84, 36) = " + gcd(84, 36));
        System.out.println("LCM(84, 36) = " + lcm(84, 36));
    }
}`,
    },
    {
      id: "c6t1p4", title: "Method returning an array",
      task: "<p>Write <code>static int[] minMax(int[] a)</code> that returns a 2-element array {min, max}. Use it on <code>{38, 12, 77, 45, 9, 61}</code>.</p>",
      expected: "Min = 9, Max = 77",
      mustUse: ["static int[] minMax(int[] a)", "return new int[]"],
      hints: ["Find min and max in a loop, then <code>return new int[] {min, max};</code>"],
      solution: J`public class Main {
    static int[] minMax(int[] a) {
        int min = a[0], max = a[0];
        for (int x : a) {
            if (x < min) min = x;
            if (x > max) max = x;
        }
        return new int[] {min, max};
    }

    public static void main(String[] args) {
        int[] r = minMax(new int[] {38, 12, 77, 45, 9, 61});
        System.out.println("Min = " + r[0] + ", Max = " + r[1]);
    }
}`,
    },
    {
      id: "c6t1p5", title: "Math methods",
      task: "<p>Write <code>static double hypotenuse(double a, double b)</code> using <code>Math.sqrt</code> and <code>Math.pow</code>. Print it for 5 and 12, then <code>Math.ceil</code>, <code>Math.floor</code> and <code>Math.round</code> of 7.5.</p>",
      expected: "Hypotenuse: 13.0\nceil: 8.0, floor: 7.0, round: 8",
      mustUse: ["Math.sqrt", "Math.pow"],
      hints: ["<code>return Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));</code>"],
      solution: J`public class Main {
    static double hypotenuse(double a, double b) {
        return Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
    }

    public static void main(String[] args) {
        System.out.println("Hypotenuse: " + hypotenuse(5, 12));
        System.out.println("ceil: " + Math.ceil(7.5) + ", floor: " + Math.floor(7.5) + ", round: " + Math.round(7.5));
    }
}`,
    },
    {
      id: "c6t1p6", title: "Fix the missing return",
      task: "<p>This method doesn't compile: <code>missing return statement</code>. Fix it so every path returns a value.</p>",
      starter: J`public class Main {
    static String sign(int n) {
        if (n > 0) {
            return "positive";
        } else if (n < 0) {
            return "negative";
        }
    }

    public static void main(String[] args) {
        System.out.println(sign(5) + " " + sign(-2) + " " + sign(0));
    }
}`,
      expected: "positive negative zero",
      hints: ["What does the method return when n is 0? Add a final return after the if-else."],
      solution: J`public class Main {
    static String sign(int n) {
        if (n > 0) {
            return "positive";
        } else if (n < 0) {
            return "negative";
        }
        return "zero";
    }

    public static void main(String[] args) {
        System.out.println(sign(5) + " " + sign(-2) + " " + sign(0));
    }
}`,
    },
  ],

  fill: [
    { id: "c6t1f1", prompt: "Complete the method that returns the cube of a number.", template: "static ___ cube(int x) {\n    ___ x * x * x;\n}", answers: [["int", "long"], ["return"]], explain: "Return type int and the return keyword." },
    { id: "c6t1f2", prompt: "A method that prints and returns nothing.", template: "static ___ show(String msg) { System.out.println(msg); }", answers: [["void"]], explain: "void means no return value." },
    { id: "c6t1f3", prompt: "Calculate 2 to the power 8 and the square root of 144.", template: "double p = Math.___(2, 8);\ndouble r = Math.___(144);", answers: [["pow"], ["sqrt"]], explain: "Math.pow and Math.sqrt return doubles." },
  ],

  quiz: [
    { type: "output", q: "Predict the output.", code: J`public class Q {
    static int f(int x) {
        x = x * 2;
        return x + 1;
    }
    public static void main(String[] args) {
        int a = 5;
        int b = f(a);
        System.out.println(a + " " + b);
    }
}`, answer: "5 11", explain: "The parameter is a copy — changing x doesn't change a." },
    { type: "mcq", q: "Which is the signature of <code>public static double area(double r, int n)</code>?", options: ["area", "double area", "area(double, int)", "public static double"], answer: 2, explain: "Name + parameter types." },
    { type: "mcq", q: "<code>static int f() { System.out.println(\"x\"); }</code> —", options: ["returns 0", "compile error: missing return statement", "prints x and returns null", "runtime error"], answer: 1, explain: "A non-void method must return a value." },
    { type: "output", q: "Predict the output.", code: J`public class Q {
    static void show(int n) {
        if (n > 3) return;
        System.out.print(n);
        show(n + 1);
    }
    public static void main(String[] args) {
        show(1);
    }
}`, answer: "123", explain: "Each call prints and calls the next until n > 3." },
    { type: "output", q: "Predict the output.", code: J`public class Q {
    public static void main(String[] args) {
        System.out.println(Math.round(-2.5) + " " + Math.ceil(-2.5) + " " + Math.abs(-7));
    }
}`, answer: "-2 -2.0 7", explain: "Math.round rounds half up (toward +∞): −2.5 → −2." },
  ],
};
