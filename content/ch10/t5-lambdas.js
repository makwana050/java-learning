const J = String.raw;

export default {
  title: "Functional interfaces & lambdas",
  summary: "An interface with one abstract method can be implemented in one short expression. Learn lambda syntax, the built-in functional interfaces and method references.",

  concept: J`
<h2>Concept</h2>
<h3>Functional interface</h3>
<p>An interface with <b>exactly one abstract method</b> (default and static methods don't count). Mark it with <code>@FunctionalInterface</code> so the compiler checks this.</p>
<pre class="java">@FunctionalInterface
interface MathOp {
    int apply(int a, int b);
}</pre>

<h3>Lambda expression</h3>
<p>A lambda is a short way to provide that one method — no class, no method name:</p>
<pre class="java">MathOp add = (a, b) -&gt; a + b;
MathOp max = (a, b) -&gt; { if (a &gt; b) return a; return b; };
add.apply(3, 4);   // 7</pre>
<table>
<tr><th>Form</th><th>Example</th></tr>
<tr><td>No parameters</td><td><code>() -&gt; System.out.println("Hi")</code></td></tr>
<tr><td>One parameter (brackets optional)</td><td><code>x -&gt; x * x</code></td></tr>
<tr><td>Several parameters</td><td><code>(a, b) -&gt; a + b</code></td></tr>
<tr><td>Types written out</td><td><code>(int a, int b) -&gt; a + b</code></td></tr>
<tr><td>Block body (needs return)</td><td><code>(a, b) -&gt; { int s = a + b; return s * 2; }</code></td></tr>
</table>
<p>Compared to an anonymous class, a lambda is shorter, and <code>this</code> inside it refers to the enclosing object. Like anonymous classes, lambdas can use only <b>effectively final</b> local variables.</p>

<h3>Built-in functional interfaces (java.util.function)</h3>
<table>
<tr><th>Interface</th><th>Method</th><th>Use</th><th>Example</th></tr>
<tr><td><code>Predicate&lt;T&gt;</code></td><td><code>boolean test(T t)</code></td><td>a condition</td><td><code>n -&gt; n % 2 == 0</code></td></tr>
<tr><td><code>Function&lt;T,R&gt;</code></td><td><code>R apply(T t)</code></td><td>convert T to R</td><td><code>s -&gt; s.length()</code></td></tr>
<tr><td><code>Consumer&lt;T&gt;</code></td><td><code>void accept(T t)</code></td><td>do something with T</td><td><code>s -&gt; System.out.println(s)</code></td></tr>
<tr><td><code>Supplier&lt;T&gt;</code></td><td><code>T get()</code></td><td>produce a value</td><td><code>() -&gt; "default"</code></td></tr>
<tr><td><code>BinaryOperator&lt;T&gt;</code></td><td><code>T apply(T a, T b)</code></td><td>combine two</td><td><code>(a, b) -&gt; a * b</code></td></tr>
<tr><td><code>Runnable</code></td><td><code>void run()</code></td><td>a task (threads!)</td><td><code>() -&gt; work()</code></td></tr>
<tr><td><code>Comparator&lt;T&gt;</code></td><td><code>int compare(T a, T b)</code></td><td>ordering (Collections chapter)</td><td><code>(a, b) -&gt; a.age - b.age</code></td></tr>
</table>

<h3>Method references</h3>
<p>When a lambda only calls an existing method, write the method's name with <code>::</code>:</p>
<table>
<tr><th>Lambda</th><th>Method reference</th></tr>
<tr><td><code>s -&gt; System.out.println(s)</code></td><td><code>System.out::println</code></td></tr>
<tr><td><code>s -&gt; s.toUpperCase()</code></td><td><code>String::toUpperCase</code></td></tr>
<tr><td><code>s -&gt; Integer.parseInt(s)</code></td><td><code>Integer::parseInt</code></td></tr>
<tr><td><code>() -&gt; new ArrayList&lt;&gt;()</code></td><td><code>ArrayList::new</code></td></tr>
</table>

<h3>Passing behaviour as an argument</h3>
<pre class="java">static int count(int[] a, Predicate&lt;Integer&gt; rule) {
    int c = 0;
    for (int x : a) if (rule.test(x)) c++;
    return c;
}
count(marks, m -&gt; m &gt;= 40);    // how many passed
count(marks, m -&gt; m &gt;= 90);    // how many toppers</pre>
`,

  samples: [
    {
      title: "Lambdas vs anonymous class",
      code: J`@FunctionalInterface
interface MathOp {
    int apply(int a, int b);
}

public class Main {
    public static void main(String[] args) {
        MathOp addOld = new MathOp() {
            @Override
            public int apply(int a, int b) { return a + b; }
        };
        MathOp add = (a, b) -> a + b;
        MathOp power = (base, exp) -> {
            int r = 1;
            for (int i = 0; i < exp; i++) r *= base;
            return r;
        };
        System.out.println(addOld.apply(2, 3) + " " + add.apply(2, 3) + " " + power.apply(2, 10));
    }
}`,
      output: "5 5 1024",
    },
    {
      title: "Built-in functional interfaces",
      code: J`import java.util.function.*;

public class Main {
    public static void main(String[] args) {
        Predicate<Integer> isEven = n -> n % 2 == 0;
        Function<String, Integer> length = s -> s.length();
        Consumer<String> shout = s -> System.out.println(s.toUpperCase() + "!");
        Supplier<String> greeting = () -> "Good morning";
        BinaryOperator<Integer> multiply = (a, b) -> a * b;

        System.out.println(isEven.test(14) + " " + isEven.test(7));
        System.out.println(length.apply("lambda"));
        shout.accept("java");
        System.out.println(greeting.get());
        System.out.println(multiply.apply(6, 7));
        System.out.println(isEven.negate().test(7));
    }
}`,
      output: "true false\n6\nJAVA!\nGood morning\n42\ntrue",
    },
    {
      title: "Behaviour as a parameter + method references",
      code: J`import java.util.Arrays;
import java.util.List;
import java.util.function.Predicate;

public class Main {
    static int count(int[] a, Predicate<Integer> rule) {
        int c = 0;
        for (int x : a) if (rule.test(x)) c++;
        return c;
    }

    public static void main(String[] args) {
        int[] marks = {35, 92, 67, 48, 99, 21};
        System.out.println("Passed: " + count(marks, m -> m >= 40));
        System.out.println("Toppers: " + count(marks, m -> m >= 90));
        List<String> names = Arrays.asList("ravi", "meena", "joseph");
        names.forEach(System.out::println);
    }
}`,
      output: "Passed: 4\nToppers: 2\nravi\nmeena\njoseph",
    },
  ],

  practice: [
    {
      id: "c10t5p1", title: "Your own functional interface",
      task: "<p>Create <code>@FunctionalInterface interface StringOp { String apply(String s); }</code>. Using <b>lambdas</b>, make: reverse, first-letter-capital, and add stars around the text. Apply each to \"java\".</p>",
      expected: "avaj\nJava\n*java*",
      mustUse: ["@FunctionalInterface", "->"],
      hints: ["<code>StringOp rev = s -> new StringBuilder(s).reverse().toString();</code>"],
      solution: J`@FunctionalInterface
interface StringOp {
    String apply(String s);
}

public class Main {
    public static void main(String[] args) {
        StringOp rev = s -> new StringBuilder(s).reverse().toString();
        StringOp cap = s -> Character.toUpperCase(s.charAt(0)) + s.substring(1);
        StringOp star = s -> "*" + s + "*";
        String w = "java";
        System.out.println(rev.apply(w));
        System.out.println(cap.apply(w));
        System.out.println(star.apply(w));
    }
}`,
    },
    {
      id: "c10t5p2", title: "Filter with Predicate",
      task: "<p>Write <code>static void printIf(int[] a, Predicate&lt;Integer&gt; p)</code> that prints matching numbers on one line. Call it for {3, 10, 15, 22, 27, 30} with: multiples of 5, odd numbers, and numbers greater than 20 that are even.</p>",
      expected: "10 15 30\n3 15 27\n22 30",
      mustUse: ["Predicate<Integer>"],
      hints: ["Combine conditions inside one lambda with &&, or use <code>p1.and(p2)</code>."],
      solution: J`import java.util.function.Predicate;

public class Main {
    static void printIf(int[] a, Predicate<Integer> p) {
        StringBuilder sb = new StringBuilder();
        for (int x : a) {
            if (p.test(x)) {
                if (sb.length() > 0) sb.append(" ");
                sb.append(x);
            }
        }
        System.out.println(sb);
    }

    public static void main(String[] args) {
        int[] a = {3, 10, 15, 22, 27, 30};
        printIf(a, n -> n % 5 == 0);
        printIf(a, n -> n % 2 != 0);
        Predicate<Integer> big = n -> n > 20;
        Predicate<Integer> even = n -> n % 2 == 0;
        printIf(a, big.and(even));
    }
}`,
    },
    {
      id: "c10t5p3", title: "Calculator map with lambdas",
      task: "<p>Store four <code>BinaryOperator&lt;Integer&gt;</code> lambdas (+, −, ×, ÷) in an array with a matching array of symbols, then compute 84 ? 7 for each.</p>",
      expected: "84 + 7 = 91\n84 - 7 = 77\n84 * 7 = 588\n84 / 7 = 12",
      mustUse: ["BinaryOperator<Integer>"],
      hints: ["Generic arrays are awkward; use a List or individual variables. E.g. <code>List&lt;BinaryOperator&lt;Integer&gt;&gt; ops = Arrays.asList((a, b) -> a + b, …);</code>"],
      solution: J`import java.util.Arrays;
import java.util.List;
import java.util.function.BinaryOperator;

public class Main {
    public static void main(String[] args) {
        List<BinaryOperator<Integer>> ops = Arrays.asList(
            (a, b) -> a + b,
            (a, b) -> a - b,
            (a, b) -> a * b,
            (a, b) -> a / b
        );
        String[] sym = {"+", "-", "*", "/"};
        for (int i = 0; i < ops.size(); i++) {
            System.out.println("84 " + sym[i] + " 7 = " + ops.get(i).apply(84, 7));
        }
    }
}`,
    },
    {
      id: "c10t5p4", title: "Method references",
      task: "<p>Given <code>List&lt;String&gt; codes = Arrays.asList(\"12\", \"7\", \"30\");</code> use <code>Function&lt;String, Integer&gt; parse = Integer::parseInt;</code> to sum them, then print each code using <code>codes.forEach(System.out::println)</code>.</p>",
      expected: "Sum: 49\n12\n7\n30",
      mustUse: ["Integer::parseInt", "System.out::println"],
      hints: ["<code>for (String c : codes) sum += parse.apply(c);</code>"],
      solution: J`import java.util.Arrays;
import java.util.List;
import java.util.function.Function;

public class Main {
    public static void main(String[] args) {
        List<String> codes = Arrays.asList("12", "7", "30");
        Function<String, Integer> parse = Integer::parseInt;
        int sum = 0;
        for (String c : codes) sum += parse.apply(c);
        System.out.println("Sum: " + sum);
        codes.forEach(System.out::println);
    }
}`,
    },
  ],

  fill: [
    { id: "c10t5f1", prompt: "Write a lambda that squares x.", template: "Function<Integer, Integer> sq = x ___ x * x;", answers: [["->"]], explain: "parameters -> body." },
    { id: "c10t5f2", prompt: "Which built-in interface returns true/false?", template: "___<String> isEmpty = s -> s.isEmpty();", answers: [["Predicate"]], explain: "Predicate.test returns boolean." },
    { id: "c10t5f3", prompt: "Method reference for printing.", template: "list.forEach(System.out___println);", answers: [["::"]], explain: "ClassOrObject::method." },
  ],

  quiz: [
    { type: "mcq", q: "A functional interface has…", options: ["no methods", "exactly one abstract method", "only default methods", "exactly one method of any kind"], answer: 1, explain: "Default and static methods are allowed in addition." },
    { type: "mcq", q: "Which interface fits <code>() -&gt; 42</code>?", options: ["Consumer<Integer>", "Supplier<Integer>", "Predicate<Integer>", "Function<Integer,Integer>"], answer: 1, explain: "No input, returns a value." },
    { type: "output", q: "Predict the output.", code: J`import java.util.function.*;
public class Q {
    public static void main(String[] args) {
        Function<Integer, Integer> dbl = x -> x * 2;
        Function<Integer, Integer> inc = x -> x + 1;
        System.out.println(dbl.andThen(inc).apply(5) + " " + dbl.compose(inc).apply(5));
    }
}`, answer: "11 12", explain: "andThen: double then add (10 + 1). compose: add then double ((5 + 1) × 2)." },
    { type: "mcq", q: "<code>int n = 5; Runnable r = () -&gt; System.out.println(n); n++;</code>", options: ["prints 6", "prints 5", "compile error", "runtime error"], answer: 2, explain: "n is not effectively final." },
  ],
};
