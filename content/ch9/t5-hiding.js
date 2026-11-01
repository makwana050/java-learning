const J = String.raw;

export default {
  title: "Method hiding & variable hiding",
  summary: "Static methods and fields are not overridden — they are hidden. Learn the difference from overriding and why the reference type decides here.",

  concept: J`
<h2>Concept</h2>
<h3>Method hiding (static methods)</h3>
<p>If a child declares a <code>static</code> method with the same signature as a <code>static</code> method in the parent, the child's method <b>hides</b> the parent's. It does <b>not</b> override it.</p>
<pre class="java">class Parent { static String id() { return "Parent"; } }
class Child extends Parent { static String id() { return "Child"; } }

Parent p = new Child();
p.id();        // "Parent"  ← decided by the REFERENCE type at compile time
Child.id();    // "Child"
Parent.id();   // "Parent"</pre>
<p>Static methods belong to the class, not the object, so there is no dynamic dispatch. Always call them with the class name to avoid confusion.</p>

<h3>Overriding vs hiding</h3>
<table>
<tr><th></th><th>Overriding</th><th>Hiding</th></tr>
<tr><td>Applies to</td><td>instance methods</td><td>static methods and fields (static or instance)</td></tr>
<tr><td>Chosen by</td><td>object's runtime class</td><td>reference's declared type (compile time)</td></tr>
<tr><td><code>@Override</code></td><td>allowed</td><td>compile error if used</td></tr>
<tr><td>Parent version reachable via</td><td><code>super.method()</code></td><td><code>Parent.method()</code> / <code>super.field</code></td></tr>
</table>

<h3>Rules for static methods</h3>
<ul>
<li>A static method can't hide an <b>instance</b> method: <code>error: … overriding method is static</code>.</li>
<li>An instance method can't override a <b>static</b> method: <code>error: … overridden method is static</code>.</li>
<li>Hiding methods follow the same access and return-type rules as overriding.</li>
</ul>

<h3>Variable hiding (field shadowing)</h3>
<p>If a child declares a field with the same name as a parent field, the child object contains <b>both</b> fields. The one you get depends on the <b>reference type</b>:</p>
<pre class="java">class Parent { String label = "P"; }
class Child extends Parent {
    String label = "C";                  // hides Parent.label
    void show() {
        System.out.println(label);       // C
        System.out.println(super.label); // P
    }
}
Parent ref = new Child();
ref.label;            // "P" — fields are not polymorphic
((Child) ref).label;  // "C"</pre>
<p>This works for different types too (a child can hide an int field with a String field). It's legal but confusing — in real code, avoid giving child fields the same names as parent fields. Use private fields with getters; getters <i>are</i> overridable.</p>

<h3>Related: shadowing inside a class</h3>
<p>A local variable or parameter with the same name as a field <b>shadows</b> it in that method — that's why you write <code>this.name = name;</code>.</p>
`,

  samples: [
    {
      title: "Hiding vs overriding side by side",
      code: J`class Parent {
    static String stat() { return "Parent.stat"; }
    String inst() { return "Parent.inst"; }
}

class Child extends Parent {
    static String stat() { return "Child.stat"; }
    @Override
    String inst() { return "Child.inst"; }
}

public class Main {
    public static void main(String[] args) {
        Parent p = new Child();
        System.out.println(p.stat());
        System.out.println(p.inst());
        Child c = new Child();
        System.out.println(c.stat());
        System.out.println(Parent.stat());
    }
}`,
      output: "Parent.stat\nChild.inst\nChild.stat\nParent.stat",
    },
    {
      title: "Variable hiding",
      code: J`class Vehicle {
    int maxSpeed = 120;
    String type = "vehicle";
}

class SportsCar extends Vehicle {
    int maxSpeed = 300;

    void show() {
        System.out.println(maxSpeed + " vs parent " + super.maxSpeed + ", " + type);
    }
}

public class Main {
    public static void main(String[] args) {
        SportsCar s = new SportsCar();
        Vehicle v = s;
        s.show();
        System.out.println(v.maxSpeed);
        System.out.println(s.maxSpeed);
        System.out.println(((Vehicle) s).maxSpeed);
    }
}`,
      output: "300 vs parent 120, vehicle\n120\n300\n120",
    },
  ],

  practice: [
    {
      id: "c9t5p1", title: "Predict, then prove hiding",
      task: "<p>Create <code>Printer</code> with <code>static String model()</code> returning \"Basic\" and instance <code>String status()</code> returning \"Basic ready\". <code>LaserPrinter</code> hides model() (\"Laser\") and overrides status() (\"Laser ready\"). Using a <code>Printer p = new LaserPrinter()</code> reference, print as shown.</p>",
      expected: "p.model(): Basic\np.status(): Laser ready\nLaserPrinter.model(): Laser",
      mustUse: ["static String model()", "Printer p = new LaserPrinter()"],
      hints: ["Calling a static method through p uses Printer's version."],
      solution: J`class Printer {
    static String model() { return "Basic"; }
    String status() { return "Basic ready"; }
}

class LaserPrinter extends Printer {
    static String model() { return "Laser"; }
    @Override
    String status() { return "Laser ready"; }
}

public class Main {
    public static void main(String[] args) {
        Printer p = new LaserPrinter();
        System.out.println("p.model(): " + p.model());
        System.out.println("p.status(): " + p.status());
        System.out.println("LaserPrinter.model(): " + LaserPrinter.model());
    }
}`,
    },
    {
      id: "c9t5p2", title: "Reach the hidden field",
      task: "<p><code>Account</code> has <code>double rate = 3.5</code>. <code>FixedDeposit extends Account</code> hides it with <code>double rate = 7.0</code>. Add a method <code>compare()</code> in FixedDeposit that prints both rates and the difference, using <code>super</code>.</p>",
      expected: "FD rate: 7.0, savings rate: 3.5, extra: 3.5",
      mustUse: ["super.rate"],
      hints: ["<code>System.out.println(\"FD rate: \" + rate + \", savings rate: \" + super.rate + …);</code>"],
      solution: J`class Account {
    double rate = 3.5;
}

class FixedDeposit extends Account {
    double rate = 7.0;

    void compare() {
        System.out.println("FD rate: " + rate + ", savings rate: " + super.rate + ", extra: " + (rate - super.rate));
    }
}

public class Main {
    public static void main(String[] args) {
        new FixedDeposit().compare();
    }
}`,
    },
    {
      id: "c9t5p3", title: "Fix the static/instance clash",
      task: "<p>The starter doesn't compile: a static method tries to replace an instance method. Make <code>Child.greet</code> an instance method that overrides the parent (keep <code>Child.info</code> as a static hiding method).</p>",
      starter: J`class Parent {
    String greet() { return "Hello from Parent"; }
    static String info() { return "Parent info"; }
}

class Child extends Parent {
    static String greet() { return "Hello from Child"; }
    static String info() { return "Child info"; }
}

public class Main {
    public static void main(String[] args) {
        Parent p = new Child();
        System.out.println(p.greet());
        System.out.println(p.info());
    }
}`,
      expected: "Hello from Child\nParent info",
      mustUse: ["@Override"],
      hints: ["Remove static from Child.greet and add @Override."],
      solution: J`class Parent {
    String greet() { return "Hello from Parent"; }
    static String info() { return "Parent info"; }
}

class Child extends Parent {
    @Override
    String greet() { return "Hello from Child"; }
    static String info() { return "Child info"; }
}

public class Main {
    public static void main(String[] args) {
        Parent p = new Child();
        System.out.println(p.greet());
        System.out.println(p.info());
    }
}`,
    },
  ],

  fill: [
    { id: "c9t5f1", prompt: "Static methods with the same signature in parent and child are…", template: "___, not overridden", answers: [["hidden"]], explain: "Method hiding." },
    { id: "c9t5f2", prompt: "Read the parent's hidden field from the child.", template: "int p = ___.count;", answers: [["super"]], explain: "super.field reaches the parent's version." },
  ],

  quiz: [
    { type: "output", q: "Predict the output.", code: J`class A { static String s() { return "A"; } int v = 1; }
class B extends A { static String s() { return "B"; } int v = 2; }
public class Q {
    public static void main(String[] args) {
        A x = new B();
        System.out.println(x.s() + x.v + ((B) x).v);
    }
}`, answer: "A12", explain: "Static method and field are chosen by the reference type A." },
    { type: "mcq", q: "Can you put @Override on a method that hides a static method?", options: ["Yes", "No — compile error", "Only if public", "Only in interfaces"], answer: 1, explain: "Static methods can't be overridden." },
    { type: "mcq", q: "Parent has instance <code>void run()</code>. Child declares <code>static void run()</code>.", options: ["hides it", "overrides it", "compile error", "overloads it"], answer: 2, explain: "A static method can't hide an instance method." },
    { type: "mcq", q: "Which IS polymorphic (decided at runtime)?", options: ["fields", "static methods", "instance methods", "constructors"], answer: 2, explain: "Only overridden instance methods." },
  ],
};
