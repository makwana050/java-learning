const J = String.raw;

export default {
  title: "Access modifiers",
  summary: "public, protected, default and private: who can see a class, field, method or constructor — including the tricky protected rules across packages.",

  concept: J`
<h2>Concept</h2>
<p>Access modifiers control <b>visibility</b>: which other code may use a class or member. There are four levels, from most open to most closed:</p>
<table>
<tr><th>Modifier</th><th>Same class</th><th>Same package</th><th>Subclass in another package</th><th>Any other class</th></tr>
<tr><td><code>public</code></td><td>✓</td><td>✓</td><td>✓</td><td>✓</td></tr>
<tr><td><code>protected</code></td><td>✓</td><td>✓</td><td>✓ (through inheritance only)</td><td>✗</td></tr>
<tr><td><i>default</i> (no keyword — "package-private")</td><td>✓</td><td>✓</td><td>✗</td><td>✗</td></tr>
<tr><td><code>private</code></td><td>✓</td><td>✗</td><td>✗</td><td>✗</td></tr>
</table>
<p>Memory trick: <b>private &lt; default &lt; protected &lt; public</b>.</p>

<h3>What can have which modifier?</h3>
<table>
<tr><th>Element</th><th>Allowed</th></tr>
<tr><td>Top-level class / interface</td><td><code>public</code> or default only. <code>private class X</code> or <code>protected class X</code> at top level → compile error.</td></tr>
<tr><td>Fields, methods, constructors, nested classes</td><td>all four</td></tr>
<tr><td>Local variables</td><td>none (only <code>final</code>)</td></tr>
<tr><td>Interface methods</td><td>implicitly <code>public</code></td></tr>
</table>

<h3>The protected rule in detail</h3>
<p>In a <b>different package</b>, a subclass can use a protected member only <b>through inheritance</b> — on <code>this</code>, or on a reference of its own (sub)class type. It can <b>not</b> use it on a plain parent-type object:</p>
<pre class="java">// package shapes;
public class Shape { protected int sides; }

// package app;
public class Square extends shapes.Shape {
    void test(shapes.Shape other, Square sq) {
        this.sides = 4;      // ✓ inherited
        sq.sides = 4;        // ✓ a Square reference
        other.sides = 4;     // ✗ compile error: sides has protected access
    }
}</pre>
<p>Within the <b>same package</b>, protected behaves like default — everyone in the package can use it.</p>

<h3>Overriding can't reduce visibility</h3>
<p>An overriding method must be <b>as visible or more visible</b> than the method it overrides. A <code>public</code> method can't be overridden as <code>protected</code>; a <code>protected</code> one can become <code>public</code>. (That's why <code>toString()</code> overrides must be public.)</p>

<h3>private members are not inherited</h3>
<p>A subclass object still contains the parent's private fields in memory, but the subclass code can't name them — it must use the parent's public/protected methods.</p>

<h3>Choosing a modifier</h3>
<ul>
<li>Fields → <b>private</b> (encapsulation).</li>
<li>Methods that form the class's API → <b>public</b>.</li>
<li>Helper methods → <b>private</b>.</li>
<li>Hooks meant for subclasses → <b>protected</b>.</li>
<li>Things shared only inside a package → default.</li>
</ul>
<p>Start as restrictive as possible and open up only when needed.</p>
<div class="note">The examples below run in one file (one package), where default and protected both work. The cross-package rules are tested in the quiz and the practice explanations — try them with two packages in the lab.</div>
`,

  samples: [
    {
      title: "Same package: everything but private",
      code: J`class Vault {
    public String name = "Main vault";
    protected int floors = 3;
    int doors = 2;
    private String code = "4321";

    private boolean check(String c) {
        return code.equals(c);
    }

    public boolean open(String c) {
        return check(c);
    }
}

public class Main {
    public static void main(String[] args) {
        Vault v = new Vault();
        System.out.println(v.name + " " + v.floors + " " + v.doors);
        System.out.println(v.open("0000") + " " + v.open("4321"));
    }
}`,
      output: "Main vault 3 2\nfalse true",
      explain: "<code>v.code</code> or <code>v.check(…)</code> from Main would not compile — only Vault's own code can use them.",
    },
    {
      title: "Widening visibility when overriding",
      code: J`class Animal {
    protected String sound() {
        return "...";
    }
}

class Dog extends Animal {
    @Override
    public String sound() {
        return "Woof";
    }
}

public class Main {
    public static void main(String[] args) {
        Animal a = new Dog();
        System.out.println(a.sound());
    }
}`,
      output: "Woof",
      explain: "protected → public is allowed. public → protected would be a compile error.",
    },
  ],

  practice: [
    {
      id: "c8t3p1", title: "Make it compile",
      task: "<p>The starter has three access-related compile errors. Fix them by changing <b>only</b> modifiers or by using the public method that already exists — keep <code>pin</code> private.</p>",
      starter: J`private class Locker {
    private int pin;
    private int number;

    Locker(int number, int pin) {
        this.number = number;
        this.pin = pin;
    }

    public boolean unlock(int attempt) {
        return attempt == pin;
    }
}

public class Main {
    public static void main(String[] args) {
        Locker l = new Locker(12, 9876);
        System.out.println("Locker " + l.number);
        System.out.println(l.pin == 9876);
    }
}`,
      expected: "Locker 12\ntrue",
      mustUse: ["private int pin", "unlock(9876)"],
      hints: ["A top-level class can't be private — remove the modifier.", "number can be default (no modifier). For the pin check use <code>l.unlock(9876)</code>."],
      solution: J`class Locker {
    private int pin;
    int number;

    Locker(int number, int pin) {
        this.number = number;
        this.pin = pin;
    }

    public boolean unlock(int attempt) {
        return attempt == pin;
    }
}

public class Main {
    public static void main(String[] args) {
        Locker l = new Locker(12, 9876);
        System.out.println("Locker " + l.number);
        System.out.println(l.unlock(9876));
    }
}`,
    },
    {
      id: "c8t3p2", title: "Protected hook for subclasses",
      task: "<p>Class <code>Report</code> has a public method <code>print()</code> that prints a header, then calls a <b>protected</b> method <code>body()</code>, then a footer. Subclass <code>SalesReport</code> overrides <code>body()</code>. Print a sales report.</p>",
      expected: "=== REPORT ===\nSales this month: 42 units\n=== END ===",
      mustUse: ["protected String body()", "extends Report"],
      hints: ["<code>public void print() { System.out.println(\"=== REPORT ===\"); System.out.println(body()); System.out.println(\"=== END ===\"); }</code>"],
      solution: J`class Report {
    public void print() {
        System.out.println("=== REPORT ===");
        System.out.println(body());
        System.out.println("=== END ===");
    }

    protected String body() {
        return "(empty)";
    }
}

class SalesReport extends Report {
    @Override
    protected String body() {
        return "Sales this month: 42 units";
    }
}

public class Main {
    public static void main(String[] args) {
        new SalesReport().print();
    }
}`,
    },
  ],

  fill: [
    { id: "c8t3f1", prompt: "Order the access levels from most restrictive to least.", template: "___ < default < ___ < ___", answers: [["private"], ["protected"], ["public"]], explain: "private, default, protected, public." },
    { id: "c8t3f2", prompt: "Which modifiers are allowed on a top-level class?", template: "___ or default", answers: [["public"]], explain: "Top-level classes can't be private or protected." },
  ],

  quiz: [
    { type: "mcq", q: "A member with no modifier is visible to…", options: ["everyone", "only its class", "classes in the same package", "subclasses everywhere"], answer: 2, explain: "Default = package-private." },
    { type: "mcq", q: "<code>package a; public class P { protected int x; }</code> and <code>package b; class C extends a.P { void f(a.P p) { p.x = 1; } }</code> —", options: ["compiles", "compile error at p.x", "runtime error", "compiles only if x is static"], answer: 1, explain: "Outside the package, protected is reachable only through inheritance (this.x or a C reference), not through a plain P reference." },
    { type: "mcq", q: "Parent has <code>public void run()</code>. Child declares <code>protected void run()</code>. Result?", options: ["fine", "compile error: weaker access", "runtime error", "Child's run is hidden"], answer: 1, explain: "An override can't reduce visibility." },
    { type: "mcq", q: "Which is a valid local variable declaration?", options: ["private int x = 1;", "public int x = 1;", "final int x = 1;", "protected int x = 1;"], answer: 2, explain: "Only final is allowed." },
    { type: "mcq", q: "Can a subclass call its parent's private method?", options: ["Yes", "Only with super", "No", "Only in the same package"], answer: 2, explain: "private members are visible only inside the declaring class." },
  ],
};
