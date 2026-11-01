const J = String.raw;

export default {
  title: "The final keyword",
  summary: "final variables can't be reassigned, final methods can't be overridden and final classes can't be extended. Plus blank finals and final references.",

  concept: J`
<h2>Concept</h2>
<p><code>final</code> means "this can't be changed later". It applies to three things:</p>
<table>
<tr><th>Applied to</th><th>Meaning</th><th>Example</th></tr>
<tr><td>Variable</td><td>can be assigned <b>only once</b></td><td><code>final int MAX = 100;</code></td></tr>
<tr><td>Method</td><td>can <b>not be overridden</b> by a subclass</td><td><code>final void calculateTax()</code></td></tr>
<tr><td>Class</td><td>can <b>not be extended</b> (no subclasses)</td><td><code>final class String</code>, <code>Integer</code>, <code>Math</code></td></tr>
</table>

<h3>final variables</h3>
<ul>
<li><b>Local:</b> <code>final int x = 5; x = 6;</code> → <code>error: cannot assign a value to final variable x</code>.</li>
<li><b>Parameter:</b> <code>void f(final int n)</code> — n can't be changed inside the method.</li>
<li><b>Instance field:</b> must be assigned exactly once — at the declaration, in an instance block, or in <b>every</b> constructor. A final field assigned later is called a <b>blank final</b>. Each object can have a different value (e.g. a final <code>id</code>).</li>
<li><b>static final:</b> a class constant — assign at the declaration or in a static block. Name it in UPPER_SNAKE_CASE.</li>
</ul>
<pre class="java">class Student {
    final int rollNo;              // blank final
    Student(int r) { rollNo = r; } // must be set in every constructor
    Student() { }                  // ✗ error: variable rollNo might not have been initialized
}</pre>

<h3>final reference ≠ immutable object</h3>
<pre class="java">final int[] arr = {1, 2, 3};
arr[0] = 99;            // ✓ the array's contents can change
arr = new int[5];       // ✗ the reference can't point elsewhere
final StringBuilder sb = new StringBuilder("a");
sb.append("b");         // ✓</pre>
<p>final fixes the <b>variable</b>, not the object it points to.</p>

<h3>final methods and classes</h3>
<ul>
<li>Use a final method when subclasses must not change a critical behaviour (security checks, algorithms that must stay correct).</li>
<li>Use a final class when the class must not be extended at all — for security and to guarantee behaviour (String is final so nobody can make a "fake String" that breaks immutability).</li>
<li>A final class's methods are effectively final.</li>
<li><code>private</code> and <code>static</code> methods can't be overridden anyway.</li>
<li><code>abstract</code> and <code>final</code> can never be combined — abstract needs overriding/extending, final forbids it.</li>
</ul>

<h3>Compile-time constants</h3>
<p>A <code>final</code> primitive or String initialised with a constant expression is a <b>compile-time constant</b>: the compiler can use its value directly. That's why <code>final int k = 10; byte b = k;</code> compiles and why final variables can be <code>case</code> labels.</p>
`,

  samples: [
    {
      title: "final field per object",
      code: J`class Order {
    static final double GST = 0.18;
    final int orderId;
    double amount;

    Order(int orderId, double amount) {
        this.orderId = orderId;
        this.amount = amount;
    }

    double total() {
        return amount + amount * GST;
    }
}

public class Main {
    public static void main(String[] args) {
        Order o1 = new Order(501, 1000);
        Order o2 = new Order(502, 250);
        o1.amount = 2000;
        System.out.println(o1.orderId + ": " + o1.total());
        System.out.println(o2.orderId + ": " + o2.total());
    }
}`,
      output: "501: 2360.0\n502: 295.0",
      explain: "amount can change; orderId can't (o1.orderId = 7 would not compile).",
    },
    {
      title: "final reference, changeable contents",
      code: J`import java.util.Arrays;

public class Main {
    public static void main(String[] args) {
        final int[] scores = {10, 20, 30};
        scores[1] = 25;
        System.out.println(Arrays.toString(scores));
        final StringBuilder log = new StringBuilder("start");
        log.append(" -> step1");
        System.out.println(log);
        final int k = 100;
        byte b = k;
        System.out.println(b);
    }
}`,
      output: "[10, 25, 30]\nstart -> step1\n100",
    },
  ],

  practice: [
    {
      id: "c8t4p1", title: "Fix the final errors",
      task: "<p>The starter has three errors related to <code>final</code>. Fix them without removing any <code>final</code> keyword.</p>",
      starter: J`class Circle {
    static final double PI = 3.14;
    final double radius;

    Circle(double radius) {
        this.radius = radius;
    }

    Circle() {
    }

    void grow() {
        radius = radius + 1;
    }
}

public class Main {
    public static void main(String[] args) {
        final int count = 2;
        count++;
        Circle c = new Circle(10);
        System.out.println(Circle.PI * c.radius * c.radius);
        System.out.println(count);
    }
}`,
      expected: "314.0\n3",
      hints: ["The no-arg constructor must also give radius a value — e.g. <code>this(1);</code>", "A final field can't be changed in grow(); remove that method or return a new Circle.", "Use a new variable instead of count++: <code>final int newCount = count + 1;</code>"],
      solution: J`class Circle {
    static final double PI = 3.14;
    final double radius;

    Circle(double radius) {
        this.radius = radius;
    }

    Circle() {
        this(1);
    }

    Circle grow() {
        return new Circle(radius + 1);
    }
}

public class Main {
    public static void main(String[] args) {
        final int count = 2;
        final int newCount = count + 1;
        Circle c = new Circle(10);
        System.out.println(Circle.PI * c.radius * c.radius);
        System.out.println(newCount);
    }
}`,
    },
    {
      id: "c8t4p2", title: "Immutable class",
      task: "<p>Create an immutable class <code>Money</code>: declared <code>final</code>, with <code>private final</code> fields <code>rupees</code> and <code>currency</code>, no setters, and a method <code>add(Money other)</code> that returns a <b>new</b> Money. Show that the originals don't change.</p>",
      expected: "a = 500 INR\nb = 250 INR\na + b = 750 INR",
      mustUse: ["final class Money", "private final"],
      hints: ["<code>Money add(Money o) { return new Money(rupees + o.rupees, currency); }</code>", "Override toString for printing."],
      solution: J`final class Money {
    private final long rupees;
    private final String currency;

    Money(long rupees, String currency) {
        this.rupees = rupees;
        this.currency = currency;
    }

    Money add(Money other) {
        return new Money(rupees + other.rupees, currency);
    }

    @Override
    public String toString() {
        return rupees + " " + currency;
    }
}

public class Main {
    public static void main(String[] args) {
        Money a = new Money(500, "INR");
        Money b = new Money(250, "INR");
        Money c = a.add(b);
        System.out.println("a = " + a);
        System.out.println("b = " + b);
        System.out.println("a + b = " + c);
    }
}`,
    },
  ],

  fill: [
    { id: "c8t4f1", prompt: "Make a class that can't be extended.", template: "public ___ class Constants { }", answers: [["final"]], explain: "A final class has no subclasses." },
    { id: "c8t4f2", prompt: "Combine: one shared copy that never changes.", template: "___ ___ int MAX_USERS = 70;", answers: [["static"], ["final"]], explain: "static final (or final static) = class constant." },
  ],

  quiz: [
    { type: "mcq", q: "Which combination is illegal?", options: ["static final", "public final", "abstract final", "private final"], answer: 2, explain: "abstract requires a subclass/override; final forbids it." },
    { type: "output", q: "Predict the output.", code: J`public class Q {
    public static void main(String[] args) {
        final StringBuilder sb = new StringBuilder("x");
        sb.append("y").append("z");
        System.out.println(sb);
    }
}`, answer: "xyz", explain: "The reference is final; the object can still change." },
    { type: "mcq", q: "A blank final instance field must be assigned…", options: ["in main", "in every constructor (or an instance block)", "in a static block", "never"], answer: 1, explain: "Every path that creates an object must set it exactly once." },
    { type: "mcq", q: "Can a final method be overloaded?", options: ["No", "Yes", "Only if static", "Only in the same class"], answer: 1, explain: "final prevents overriding, not overloading." },
    { type: "mcq", q: "Which JDK class is final?", options: ["Object", "ArrayList", "String", "Thread"], answer: 2, explain: "String (and the wrapper classes, Math…)." },
  ],
};
