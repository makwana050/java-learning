const J = String.raw;

export default {
  title: "Pass-by-value, overloading & varargs",
  summary: "How arguments are really passed in Java, how several methods can share one name, and how to accept any number of arguments.",

  concept: J`
<h2>Concept</h2>
<h3>1. Java is always pass-by-value</h3>
<p>When you call a method, Java <b>copies</b> each argument into the parameter.</p>
<ul>
<li><b>Primitive</b> argument → the value is copied. Changing the parameter never affects the caller's variable.</li>
<li><b>Reference</b> argument (array, object) → the <b>reference</b> (address) is copied. Both now point to the <b>same object</b>, so changes made <i>through</i> the parameter (like <code>arr[0] = 9</code>) are visible to the caller. But assigning a new object to the parameter (<code>arr = new int[3]</code>) only changes the copy.</li>
</ul>
<pre class="java">static void change(int x, int[] arr) {
    x = 100;           // caller's int unchanged
    arr[0] = 100;      // caller sees this — same array
    arr = new int[]{7};// caller doesn't see this — only the copy now points elsewhere
}</pre>
<div class="note">Java has <b>no pass-by-reference</b>. That's why a <code>swap(int a, int b)</code> method can't swap the caller's variables.</div>

<h3>2. Method overloading</h3>
<p>Several methods in the same class can have the <b>same name</b> if their <b>parameter lists differ</b> — in number, type, or order of types.</p>
<pre class="java">static int add(int a, int b)           { return a + b; }
static int add(int a, int b, int c)    { return a + b + c; }
static double add(double a, double b)  { return a + b; }
static String add(String a, int b)     { return a + b; }</pre>
<ul>
<li>The compiler picks the method at <b>compile time</b> from the argument types — this is <b>compile-time (static) polymorphism</b>.</li>
<li>Changing <b>only the return type</b> is not overloading: <code>int f(int)</code> and <code>double f(int)</code> → compile error.</li>
<li>Parameter <b>names</b> don't matter, only their types.</li>
<li><code>println</code> itself is overloaded: println(int), println(String), println(char[]) …</li>
</ul>

<h3>How the compiler chooses</h3>
<ol>
<li>Exact match.</li>
<li>Widening of primitives (int → long → float → double).</li>
<li>Boxing / unboxing (int → Integer).</li>
<li>Varargs.</li>
</ol>
<p>So <code>f(5)</code> with only <code>f(long)</code> and <code>f(Integer)</code> available picks <code>f(long)</code> — widening beats boxing. If two choices are equally good → <code>error: reference to f is ambiguous</code>.</p>

<h3>3. Varargs — variable number of arguments</h3>
<pre class="java">static int sum(int... nums) {        // nums is an int[]
    int s = 0;
    for (int n : nums) s += n;
    return s;
}
sum();            // 0
sum(4);           // 4
sum(1, 2, 3, 4);  // 10
sum(new int[]{5, 5}); // 10</pre>
<ul>
<li>Inside the method a varargs parameter is just an <b>array</b>.</li>
<li>Only <b>one</b> varargs parameter is allowed, and it must be <b>last</b>: <code>printf(String format, Object... args)</code>.</li>
<li><code>main(String... args)</code> is a valid main method.</li>
</ul>
`,

  samples: [
    {
      title: "Primitives vs references",
      code: J`import java.util.Arrays;

public class PassByValue {
    static void modify(int x, int[] arr) {
        x = 100;
        arr[0] = 100;
        arr = new int[] {7, 7, 7};
        arr[1] = 55;
    }

    public static void main(String[] args) {
        int n = 1;
        int[] data = {1, 2, 3};
        modify(n, data);
        System.out.println(n);
        System.out.println(Arrays.toString(data));
    }
}`,
      output: "1\n[100, 2, 3]",
      explain: "Only the change made through the original reference (arr[0] = 100) is visible. After arr points to a new array, changes go to that new array.",
    },
    {
      title: "Overloaded area()",
      code: J`public class Area {
    static double area(double r) {
        return Math.PI * r * r;
    }

    static int area(int length, int width) {
        return length * width;
    }

    static double area(double base, double height, boolean triangle) {
        return 0.5 * base * height;
    }

    public static void main(String[] args) {
        System.out.printf("%.2f%n", area(3.0));
        System.out.println(area(4, 6));
        System.out.println(area(10, 5, true));
    }
}`,
      output: "28.27\n24\n25.0",
    },
    {
      title: "Which overload wins?",
      code: J`public class Choose {
    static void f(long x)    { System.out.println("long"); }
    static void f(Integer x) { System.out.println("Integer"); }
    static void f(int... x)  { System.out.println("varargs"); }
    static void g(double x)  { System.out.println("double"); }

    public static void main(String[] args) {
        f(5);
        f(5, 6);
        g(5);
        g('A');
    }
}`,
      output: "long\nvarargs\ndouble\ndouble",
      explain: "Widening int → long beats boxing int → Integer. char and int widen to double.",
    },
  ],

  practice: [
    {
      id: "c6t2p1", title: "Overloaded max",
      task: "<p>Write three overloaded <code>max</code> methods: two ints, three ints, and two doubles. Call each.</p>",
      expected: "max(4, 9) = 9\nmax(4, 9, 7) = 9\nmax(2.5, 1.5) = 2.5",
      mustUse: ["static int max(int a, int b)", "static int max(int a, int b, int c)", "static double max(double a, double b)"],
      hints: ["The 3-int version can call the 2-int version: <code>return max(max(a, b), c);</code>"],
      solution: J`public class Main {
    static int max(int a, int b) {
        return a > b ? a : b;
    }

    static int max(int a, int b, int c) {
        return max(max(a, b), c);
    }

    static double max(double a, double b) {
        return a > b ? a : b;
    }

    public static void main(String[] args) {
        System.out.println("max(4, 9) = " + max(4, 9));
        System.out.println("max(4, 9, 7) = " + max(4, 9, 7));
        System.out.println("max(2.5, 1.5) = " + max(2.5, 1.5));
    }
}`,
    },
    {
      id: "c6t2p2", title: "Varargs average",
      task: "<p>Write <code>static double average(int... marks)</code> that returns 0 when called with no arguments. Call it with (), (80), and (70, 85, 90, 75).</p>",
      expected: "0.0\n80.0\n80.0",
      mustUse: ["int... marks"],
      hints: ["<code>if (marks.length == 0) return 0;</code>"],
      solution: J`public class Main {
    static double average(int... marks) {
        if (marks.length == 0) return 0;
        int sum = 0;
        for (int m : marks) sum += m;
        return (double) sum / marks.length;
    }

    public static void main(String[] args) {
        System.out.println(average());
        System.out.println(average(80));
        System.out.println(average(70, 85, 90, 75));
    }
}`,
    },
    {
      id: "c6t2p3", title: "Double every element",
      task: "<p>Write <code>static void doubleAll(int[] a)</code> that doubles every element <b>in the caller's array</b> (returns nothing). Also write <code>static void tryDouble(int x)</code> and show it has no effect on the caller.</p>",
      expected: "[6, 14, 22]\nx is still 5",
      mustUse: ["static void doubleAll(int[] a)", "static void tryDouble(int x)"],
      hints: ["Use an index loop: <code>a[i] *= 2;</code> (a for-each copy wouldn't work)."],
      solution: J`import java.util.Arrays;

public class Main {
    static void doubleAll(int[] a) {
        for (int i = 0; i < a.length; i++) a[i] *= 2;
    }

    static void tryDouble(int x) {
        x *= 2;
    }

    public static void main(String[] args) {
        int[] nums = {3, 7, 11};
        doubleAll(nums);
        System.out.println(Arrays.toString(nums));
        int x = 5;
        tryDouble(x);
        System.out.println("x is still " + x);
    }
}`,
    },
    {
      id: "c6t2p4", title: "Labelled varargs",
      task: "<p>Write <code>static String join(String sep, String... parts)</code> that joins parts with sep (without using String.join). The varargs parameter must come last.</p>",
      expected: "a-b-c\n2026/10/31\nsingle",
      mustUse: ["String... parts"],
      hints: ["Use a StringBuilder; add sep before every part except the first."],
      solution: J`public class Main {
    static String join(String sep, String... parts) {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < parts.length; i++) {
            if (i > 0) sb.append(sep);
            sb.append(parts[i]);
        }
        return sb.toString();
    }

    public static void main(String[] args) {
        System.out.println(join("-", "a", "b", "c"));
        System.out.println(join("/", "2026", "10", "31"));
        System.out.println(join(", ", "single"));
    }
}`,
    },
  ],

  fill: [
    { id: "c6t2f1", prompt: "Declare a method that accepts any number of doubles.", template: "static double total(double___ values)", answers: [["..."]], explain: "Three dots after the type." },
    { id: "c6t2f2", prompt: "Overloading requires different…", template: "___ lists (the return type alone is not enough)", answers: [["parameter"]], explain: "Number, type or order of parameters." },
  ],

  quiz: [
    { type: "mcq", q: "Which pair is a valid overload?", options: ["int f(int a) / double f(int b)", "void f(int a) / void f(int b)", "void f(int a) / void f(long a)", "int f() / void f()"], answer: 2, explain: "Different parameter types. The others differ only in return type or parameter names." },
    { type: "output", q: "Predict the output.", code: J`public class Q {
    static void swap(int a, int b) { int t = a; a = b; b = t; }
    public static void main(String[] args) {
        int x = 1, y = 2;
        swap(x, y);
        System.out.println(x + " " + y);
    }
}`, answer: "1 2", explain: "Primitives are passed by value; the swap only affects the copies." },
    { type: "output", q: "Predict the output.", code: J`public class Q {
    static void p(Object o) { System.out.println("Object"); }
    static void p(String s) { System.out.println("String"); }
    public static void main(String[] args) {
        p("hi");
        p(42);
    }
}`, answer: "String\nObject", explain: "The most specific match is chosen; 42 is boxed to Integer, which is an Object." },
    { type: "mcq", q: "Which varargs declaration is valid?", options: ["void f(int... a, String s)", "void f(String s, int... a)", "void f(int... a, int... b)", "void f(...int a)"], answer: 1, explain: "Varargs must be last and only once." },
    { type: "mcq", q: "Overloading is an example of…", options: ["runtime polymorphism", "compile-time polymorphism", "encapsulation", "inheritance"], answer: 1, explain: "The method is chosen by the compiler." },
  ],
};
