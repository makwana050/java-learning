const J = String.raw;

export default {
  title: "Increment & decrement",
  summary: "++ and -- look simple, but prefix and postfix forms give different results inside expressions. Master them with step-by-step tracing.",

  concept: J`
<h2>Concept</h2>
<p><code>++</code> adds 1 to a variable and <code>--</code> subtracts 1. Each comes in two forms:</p>
<table>
<tr><th>Form</th><th>Name</th><th>What happens</th><th>x = 5; y = …</th><th>Then x =</th></tr>
<tr><td><code>++x</code></td><td>pre-increment</td><td><b>first</b> increase x, <b>then</b> use the new value</td><td><code>y = ++x;</code> → y = 6</td><td>6</td></tr>
<tr><td><code>x++</code></td><td>post-increment</td><td><b>first</b> use the old value, <b>then</b> increase x</td><td><code>y = x++;</code> → y = 5</td><td>6</td></tr>
<tr><td><code>--x</code></td><td>pre-decrement</td><td>decrease, then use</td><td><code>y = --x;</code> → y = 4</td><td>4</td></tr>
<tr><td><code>x--</code></td><td>post-decrement</td><td>use, then decrease</td><td><code>y = x--;</code> → y = 5</td><td>4</td></tr>
</table>
<p>Used alone as a statement (<code>x++;</code> or <code>++x;</code>) both forms do the same thing. The difference only matters when the value is <b>used</b> in the same expression.</p>

<h3>How to trace an expression</h3>
<p>Java evaluates operands <b>from left to right</b>. Replace each <code>++</code>/<code>--</code> term with the value it produces, updating the variable as you go:</p>
<pre class="java">int a = 4;
int r = a++ + ++a;   // a++ gives 4 (a becomes 5), ++a makes a 6 and gives 6
                     // r = 4 + 6 = 10, a = 6</pre>
<table>
<tr><th>Step</th><th>Term</th><th>Value used</th><th>a afterwards</th></tr>
<tr><td>1</td><td><code>a++</code></td><td>4</td><td>5</td></tr>
<tr><td>2</td><td><code>++a</code></td><td>6</td><td>6</td></tr>
</table>

<h3>The x = x++ trap</h3>
<pre class="java">int x = 7;
x = x++;
System.out.println(x);   // 7, not 8!</pre>
<p><code>x++</code> produces the old value 7 and sets x to 8, but then the assignment stores the produced value 7 back into x.</p>

<h3>Rules</h3>
<ul>
<li>++ and -- work only on <b>variables</b>: <code>5++</code> and <code>++(a + b)</code> are compile errors.</li>
<li>They work on all number types and <code>char</code>: <code>char c = 'a'; c++;</code> → 'b'.</li>
<li>They include an automatic cast: <code>byte b = 127; b++;</code> → -128.</li>
<li>They don't work on <code>boolean</code>.</li>
<li>Writing several ++/-- on the same variable in one expression is legal but hard to read — in real code, keep it simple. In exams, trace carefully.</li>
</ul>
`,

  samples: [
    {
      title: "Prefix vs postfix",
      code: J`public class IncDemo {
    public static void main(String[] args) {
        int x = 10;
        int a = x++;
        System.out.println("a = " + a + ", x = " + x);
        int b = ++x;
        System.out.println("b = " + b + ", x = " + x);
        int c = x--;
        int d = --x;
        System.out.println("c = " + c + ", d = " + d + ", x = " + x);
    }
}`,
      output: "a = 10, x = 11\nb = 12, x = 12\nc = 12, d = 10, x = 10",
    },
    {
      title: "Tracing an expression",
      code: J`public class Trace {
    public static void main(String[] args) {
        int i = 3;
        int r = i++ * 2 + --i + i++;
        System.out.println("r = " + r + ", i = " + i);
    }
}`,
      output: "r = 12, i = 4",
      explain: "Left to right: <code>i++</code> gives 3 (i becomes 4), 3 × 2 = 6. <code>--i</code> makes i 3 and gives 3. <code>i++</code> gives 3 (i becomes 4). r = 6 + 3 + 3 = 12, and i ends at 4.",
    },
    {
      title: "x = x++ and char increment",
      code: J`public class Traps {
    public static void main(String[] args) {
        int x = 7;
        x = x++;
        System.out.println(x);
        char grade = 'A';
        grade++;
        grade++;
        System.out.println(grade);
    }
}`,
      output: "7\nC",
    },
  ],

  practice: [
    {
      id: "c2t2p1", title: "Predict, then prove",
      task: "<p>Write a program that declares <code>int m = 5;</code> and then prints the values below — each line must come from one expression using <code>m++</code>, <code>++m</code>, <code>m--</code> or <code>--m</code> on the same variable (in that order), so that the output matches.</p>",
      expected: "5\n7\n7\n5",
      mustUse: ["m++", "++m", "m--", "--m"],
      hints: ["m++ prints 5 (m becomes 6). ++m makes it 7 and prints 7.", "m-- prints 7 (m becomes 6). --m makes it 5 and prints 5."],
      solution: J`public class Main {
    public static void main(String[] args) {
        int m = 5;
        System.out.println(m++);
        System.out.println(++m);
        System.out.println(m--);
        System.out.println(--m);
    }
}`,
    },
    {
      id: "c2t2p2", title: "Ticket counter",
      task: "<p>A counter starts at <code>int ticket = 100;</code>. Three customers arrive. Each customer gets the current number and the counter moves up by one. Use <b>post</b>-increment inside the println.</p>",
      expected: "Customer 1 gets ticket 100\nCustomer 2 gets ticket 101\nCustomer 3 gets ticket 102\nNext free ticket: 103",
      mustUse: ["ticket++"],
      hints: ["<code>System.out.println(\"Customer 1 gets ticket \" + ticket++);</code>"],
      solution: J`public class Main {
    public static void main(String[] args) {
        int ticket = 100;
        System.out.println("Customer 1 gets ticket " + ticket++);
        System.out.println("Customer 2 gets ticket " + ticket++);
        System.out.println("Customer 3 gets ticket " + ticket++);
        System.out.println("Next free ticket: " + ticket);
    }
}`,
    },
    {
      id: "c2t2p3", title: "Countdown with --",
      task: "<p>Start from <code>int launch = 3;</code> and use <b>pre</b>-decrement so the output below is printed (no loops yet).</p>",
      expected: "3\n2\n1\nLift off!",
      mustUse: ["--launch"],
      hints: ["Print launch first, then <code>System.out.println(--launch);</code> twice."],
      solution: J`public class Main {
    public static void main(String[] args) {
        int launch = 3;
        System.out.println(launch);
        System.out.println(--launch);
        System.out.println(--launch);
        System.out.println("Lift off!");
    }
}`,
    },
  ],

  fill: [
    { id: "c2t2f1", prompt: "Make y equal 9 and x equal 9.", template: "int x = 8;\nint y = ___x;", answers: [["++"]], explain: "Pre-increment changes x first, then y gets the new value." },
    { id: "c2t2f2", prompt: "Make y equal 8 while x becomes 9.", template: "int x = 8;\nint y = x___;", answers: [["++"]], explain: "Post-increment: y gets the old value." },
  ],

  quiz: [
    { type: "output", q: "Predict the output.", code: J`public class Q {
    public static void main(String[] args) {
        int a = 5;
        int b = a++ + a++;
        System.out.println(a + " " + b);
    }
}`, answer: "7 11", explain: "5 (a → 6) + 6 (a → 7) = 11." },
    { type: "output", q: "Predict the output.", code: J`public class Q {
    public static void main(String[] args) {
        int a = 5;
        int b = ++a + ++a;
        System.out.println(a + " " + b);
    }
}`, answer: "7 13", explain: "6 + 7 = 13." },
    { type: "output", q: "Predict the output.", code: J`public class Q {
    public static void main(String[] args) {
        int k = 10;
        k = k++ + k--;
        System.out.println(k);
    }
}`, answer: "21", explain: "k++ → 10 (k = 11), k-- → 11 (k = 10), sum 21 is then assigned to k." },
    { type: "mcq", q: "Which statement does NOT compile?", options: ["char c = 'a'; c++;", "double d = 1.5; d++;", "int x = 5++;", "byte b = 1; b--;"], answer: 2, explain: "++ needs a variable, not a literal." },
    { type: "output", q: "Predict the output.", code: J`public class Q {
    public static void main(String[] args) {
        int n = 4;
        n = n++;
        n = ++n;
        System.out.println(n);
    }
}`, answer: "5", explain: "n = n++ leaves n at 4; n = ++n makes it 5." },
  ],
};
