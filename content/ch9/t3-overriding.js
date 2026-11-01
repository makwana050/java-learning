const J = String.raw;

export default {
  title: "Method overriding",
  summary: "Give a subclass its own version of an inherited method. Learn all the overriding rules and how it differs from overloading.",

  concept: J`
<h2>Concept</h2>
<p><b>Overriding</b> means a subclass provides its own implementation of a method it inherited, with the <b>same signature</b>. When the method is called on a child object, the child's version runs.</p>
<pre class="java">class Animal {
    String sound() { return "..."; }
}
class Cat extends Animal {
    @Override
    String sound() { return "Meow"; }
}</pre>

<h3>Rules for overriding</h3>
<table>
<tr><th>Rule</th><th>Details</th></tr>
<tr><td>Same name and parameter list</td><td>Different parameters = overloading, not overriding.</td></tr>
<tr><td>Return type</td><td>Same, or a <b>subtype</b> (covariant return): parent returns <code>Animal</code>, child may return <code>Cat</code>. For primitives it must be identical.</td></tr>
<tr><td>Access</td><td>Same or <b>wider</b> (protected → public OK; public → protected ✗).</td></tr>
<tr><td>Checked exceptions</td><td>Can't throw new or broader checked exceptions (may throw fewer/narrower, or any unchecked).</td></tr>
<tr><td>Can't override</td><td><code>final</code> methods, <code>static</code> methods (they are <i>hidden</i>), <code>private</code> methods (not inherited), constructors.</td></tr>
<tr><td><code>@Override</code></td><td>Optional, but always use it — the compiler then reports mistakes like a wrong parameter type or a typo in the name.</td></tr>
</table>

<h3>Overloading vs overriding</h3>
<table>
<tr><th></th><th>Overloading</th><th>Overriding</th></tr>
<tr><td>Where</td><td>same class (or inherited + new)</td><td>parent and child</td></tr>
<tr><td>Parameters</td><td><b>must differ</b></td><td><b>must be the same</b></td></tr>
<tr><td>Return type</td><td>can be anything</td><td>same or covariant</td></tr>
<tr><td>Decided</td><td>at <b>compile time</b> (by argument types)</td><td>at <b>runtime</b> (by the object's actual class)</td></tr>
<tr><td>Polymorphism</td><td>compile-time / static</td><td>runtime / dynamic</td></tr>
<tr><td>static / private / final methods</td><td>can be overloaded</td><td>can't be overridden</td></tr>
</table>

<h3>Why override?</h3>
<p>The parent defines <b>what</b> every subclass can do; each subclass decides <b>how</b>. Code that works with the parent type automatically uses the right version (next topic: runtime polymorphism).</p>
`,

  samples: [
    {
      title: "Overriding in a hierarchy",
      code: J`class Employee {
    String name;
    double baseSalary;

    Employee(String name, double baseSalary) {
        this.name = name;
        this.baseSalary = baseSalary;
    }

    double pay() {
        return baseSalary;
    }
}

class Manager extends Employee {
    Manager(String name, double base) { super(name, base); }

    @Override
    double pay() {
        return baseSalary + 15000;
    }
}

class Intern extends Employee {
    Intern(String name, double base) { super(name, base); }

    @Override
    double pay() {
        return baseSalary * 0.5;
    }
}

public class Main {
    public static void main(String[] args) {
        System.out.println(new Employee("Asha", 40000).pay());
        System.out.println(new Manager("Bharat", 40000).pay());
        System.out.println(new Intern("Chitra", 40000).pay());
    }
}`,
      output: "40000.0\n55000.0\n20000.0",
    },
    {
      title: "Covariant return type",
      code: J`class Animal {
    Animal reproduce() {
        return new Animal();
    }
    String kind() { return "animal"; }
}

class Rabbit extends Animal {
    @Override
    Rabbit reproduce() {
        return new Rabbit();
    }
    @Override
    String kind() { return "rabbit"; }
}

public class Main {
    public static void main(String[] args) {
        Rabbit baby = new Rabbit().reproduce();
        System.out.println(baby.kind());
    }
}`,
      output: "rabbit",
      explain: "Rabbit.reproduce() returns Rabbit (a subtype of Animal), so no cast is needed.",
    },
  ],

  practice: [
    {
      id: "c9t3p1", title: "Shapes with area()",
      task: "<p>Class <code>Shape</code> has <code>double area()</code> returning 0 and <code>String name()</code>. Override both in <code>Rect</code> (4 × 5) and <code>Triangle</code> (base 6, height 3). Print name and area for each.</p>",
      expected: "Shape: 0.0\nRectangle: 20.0\nTriangle: 9.0",
      mustUse: ["@Override", "double area()"],
      hints: ["Triangle area = 0.5 × base × height."],
      solution: J`class Shape {
    double area() { return 0; }
    String name() { return "Shape"; }
}

class Rect extends Shape {
    double w = 4, h = 5;
    @Override double area() { return w * h; }
    @Override String name() { return "Rectangle"; }
}

class Triangle extends Shape {
    double b = 6, h = 3;
    @Override double area() { return 0.5 * b * h; }
    @Override String name() { return "Triangle"; }
}

public class Main {
    public static void main(String[] args) {
        Shape s = new Shape();
        Rect r = new Rect();
        Triangle t = new Triangle();
        System.out.println(s.name() + ": " + s.area());
        System.out.println(r.name() + ": " + r.area());
        System.out.println(t.name() + ": " + t.area());
    }
}`,
    },
    {
      id: "c9t3p2", title: "@Override catches the bug",
      task: "<p>The child's method was meant to override <code>calculateFee</code>, but the output shows the parent's fee. Find why, fix it, and add <code>@Override</code>.</p>",
      starter: J`class Course {
    double calculateFee(int months) {
        return months * 1000;
    }
}

class PremiumCourse extends Course {
    double calculateFee(long months) {
        return months * 1500;
    }
}

public class Main {
    public static void main(String[] args) {
        Course c = new PremiumCourse();
        System.out.println(c.calculateFee(6));
    }
}`,
      expected: "9000.0",
      mustUse: ["@Override", "calculateFee(int months)"],
      hints: ["The parameter type is different (long vs int) — that's overloading, not overriding."],
      solution: J`class Course {
    double calculateFee(int months) {
        return months * 1000;
    }
}

class PremiumCourse extends Course {
    @Override
    double calculateFee(int months) {
        return months * 1500;
    }
}

public class Main {
    public static void main(String[] args) {
        Course c = new PremiumCourse();
        System.out.println(c.calculateFee(6));
    }
}`,
    },
    {
      id: "c9t3p3", title: "Notification channels",
      task: "<p>Class <code>Notifier</code> has <code>String send(String msg)</code> returning <code>\"[LOG] \" + msg</code>. <code>SmsNotifier</code> overrides it to return <code>\"[SMS] \" + msg</code> (max 10 chars of msg). <code>EmailNotifier</code> overrides it by calling <code>super.send(msg)</code> and adding <code>\" (emailed)\"</code>.</p>",
      expected: "[LOG] Exam on Monday\n[SMS] Exam on Mo\n[LOG] Exam on Monday (emailed)",
      mustUse: ["super.send(msg)"],
      hints: ["For SMS: <code>msg.length() > 10 ? msg.substring(0, 10) : msg</code>"],
      solution: J`class Notifier {
    String send(String msg) {
        return "[LOG] " + msg;
    }
}

class SmsNotifier extends Notifier {
    @Override
    String send(String msg) {
        return "[SMS] " + (msg.length() > 10 ? msg.substring(0, 10) : msg);
    }
}

class EmailNotifier extends Notifier {
    @Override
    String send(String msg) {
        return super.send(msg) + " (emailed)";
    }
}

public class Main {
    public static void main(String[] args) {
        String m = "Exam on Monday";
        System.out.println(new Notifier().send(m));
        System.out.println(new SmsNotifier().send(m));
        System.out.println(new EmailNotifier().send(m));
    }
}`,
    },
  ],

  fill: [
    { id: "c9t3f1", prompt: "Ask the compiler to check that this really overrides.", template: "___\npublic String toString() { … }", answers: [["@Override"]], explain: "An annotation, checked at compile time." },
  ],

  quiz: [
    { type: "mcq", q: "Which method can be overridden?", options: ["a final method", "a static method", "a private method", "a public instance method"], answer: 3, explain: "final, static and private methods can't be overridden." },
    { type: "mcq", q: "Parent: <code>protected Object get()</code>. Which child method is a valid override?", options: ["private Object get()", "public String get()", "protected int get()", "Object get(int x)"], answer: 1, explain: "Wider access and a covariant (subtype) return type." },
    { type: "mcq", q: "Overriding is resolved…", options: ["at compile time", "at runtime", "by the programmer", "at class loading"], answer: 1, explain: "Based on the actual object." },
    { type: "output", q: "Predict the output.", code: J`class P { int f(int x) { return x + 1; } }
class C extends P {
    int f(int x) { return x * 10; }
    int f(double x) { return -1; }
}
public class Q {
    public static void main(String[] args) {
        C c = new C();
        System.out.println(c.f(3) + " " + c.f(3.0));
    }
}`, answer: "30 -1", explain: "f(int) is overridden; f(double) is an overload." },
  ],
};
