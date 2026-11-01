const J = String.raw;

export default {
  title: "Abstract classes",
  summary: "A class that can't be instantiated, holding common code plus abstract methods that every subclass must implement.",

  concept: J`
<h2>Concept</h2>
<p>Sometimes a parent class represents an idea too general to exist on its own. There is no "plain shape" — only circles, squares… An <b>abstract class</b> captures what all of them share, and leaves some methods for each subclass to define.</p>
<pre class="java">abstract class Shape {
    String colour;                      // fields allowed
    Shape(String colour) {              // constructors allowed
        this.colour = colour;
    }
    abstract double area();             // no body — subclasses MUST implement
    void describe() {                   // normal method with a body
        System.out.println(colour + " shape with area " + area());
    }
}

class Circle extends Shape {
    double r;
    Circle(String c, double r) { super(c); this.r = r; }
    @Override double area() { return Math.PI * r * r; }
}</pre>

<h3>Rules</h3>
<ul>
<li><code>new Shape(...)</code> → <code>error: Shape is abstract; cannot be instantiated</code>. But <code>Shape s = new Circle(...)</code> is fine (a reference of abstract type).</li>
<li>An <b>abstract method</b> has no body and ends with <code>;</code>. A class with any abstract method <b>must</b> be declared abstract.</li>
<li>An abstract class may have <b>zero</b> abstract methods (just to prevent instantiation).</li>
<li>A concrete subclass must implement <b>all</b> inherited abstract methods; otherwise it must itself be abstract.</li>
<li>Abstract classes <b>can</b> have constructors (called through <code>super()</code>), fields, static methods, final methods and a main method.</li>
<li>Illegal combinations: <code>abstract</code> with <code>final</code>, <code>private</code> or <code>static</code> on a method (none of those could ever be overridden). Fields can't be abstract.</li>
</ul>

<h3>Template method pattern</h3>
<p>The parent defines the steps of an algorithm in a (often final) method and leaves certain steps abstract:</p>
<pre class="java">abstract class Exam {
    final void conduct() {        // the fixed recipe
        distributePapers();
        write();                  // varies
        collect();
    }
    abstract void write();
}</pre>

<h3>Abstraction</h3>
<p>Abstraction means showing <b>what</b> an object does and hiding <b>how</b>. Abstract classes give partial abstraction (some code is shared); interfaces (next chapter) give a pure contract.</p>
`,

  samples: [
    {
      title: "Abstract Shape",
      code: J`abstract class Shape {
    String name;

    Shape(String name) {
        this.name = name;
    }

    abstract double area();
    abstract double perimeter();

    void report() {
        System.out.printf("%s: area %.2f, perimeter %.2f%n", name, area(), perimeter());
    }
}

class Rectangle extends Shape {
    double w, h;
    Rectangle(double w, double h) { super("Rectangle"); this.w = w; this.h = h; }
    @Override double area() { return w * h; }
    @Override double perimeter() { return 2 * (w + h); }
}

class Circle extends Shape {
    double r;
    Circle(double r) { super("Circle"); this.r = r; }
    @Override double area() { return Math.PI * r * r; }
    @Override double perimeter() { return 2 * Math.PI * r; }
}

public class Main {
    public static void main(String[] args) {
        Shape[] shapes = {new Rectangle(4, 2.5), new Circle(1.5)};
        for (Shape s : shapes) s.report();
    }
}`,
      output: "Rectangle: area 10.00, perimeter 13.00\nCircle: area 7.07, perimeter 9.42",
    },
    {
      title: "Template method",
      code: J`abstract class Beverage {
    final void prepare() {
        boilWater();
        brew();
        pour();
        if (wantsMilk()) System.out.println("Adding milk");
        System.out.println("---");
    }

    void boilWater() { System.out.println("Boiling water"); }
    void pour() { System.out.println("Pouring into cup"); }
    boolean wantsMilk() { return true; }
    abstract void brew();
}

class Tea extends Beverage {
    @Override void brew() { System.out.println("Steeping tea leaves"); }
}

class BlackCoffee extends Beverage {
    @Override void brew() { System.out.println("Filtering coffee"); }
    @Override boolean wantsMilk() { return false; }
}

public class Main {
    public static void main(String[] args) {
        new Tea().prepare();
        new BlackCoffee().prepare();
    }
}`,
      output: "Boiling water\nSteeping tea leaves\nPouring into cup\nAdding milk\n---\nBoiling water\nFiltering coffee\nPouring into cup\n---",
    },
  ],

  practice: [
    {
      id: "c9t6p1", title: "Abstract Employee",
      task: "<p>Make <code>Employee</code> abstract with fields <code>name</code>, a constructor, an abstract <code>double salary()</code> and a concrete <code>void payslip()</code> that prints <code>name: salary</code>. Implement <code>FullTime</code> (monthly 60000) and <code>PartTime</code> (hours × 500, 64 hours).</p>",
      expected: "Ishaan: 60000.0\nJaya: 32000.0",
      mustUse: ["abstract class Employee", "abstract double salary()"],
      hints: ["payslip(): <code>System.out.println(name + \": \" + salary());</code> — the abstract method is called from concrete code."],
      solution: J`abstract class Employee {
    String name;

    Employee(String name) {
        this.name = name;
    }

    abstract double salary();

    void payslip() {
        System.out.println(name + ": " + salary());
    }
}

class FullTime extends Employee {
    double monthly;
    FullTime(String n, double monthly) { super(n); this.monthly = monthly; }
    @Override double salary() { return monthly; }
}

class PartTime extends Employee {
    int hours;
    PartTime(String n, int hours) { super(n); this.hours = hours; }
    @Override double salary() { return hours * 500; }
}

public class Main {
    public static void main(String[] args) {
        Employee[] staff = {new FullTime("Ishaan", 60000), new PartTime("Jaya", 64)};
        for (Employee e : staff) e.payslip();
    }
}`,
    },
    {
      id: "c9t6p2", title: "Fix the abstract errors",
      task: "<p>The starter has three mistakes: an abstract method with a body, an attempt to instantiate the abstract class, and a subclass that doesn't implement the abstract method. Fix them.</p>",
      starter: J`abstract class Animal {
    String name;
    Animal(String name) { this.name = name; }
    abstract String sound() { return "?"; }
    void speak() { System.out.println(name + " says " + sound()); }
}

class Cow extends Animal {
    Cow() { super("Cow"); }
}

public class Main {
    public static void main(String[] args) {
        Animal a = new Animal("Generic");
        Animal c = new Cow();
        c.speak();
    }
}`,
      expected: "Cow says Moo",
      mustUse: ["abstract String sound();"],
      hints: ["An abstract method ends with ; — no body.", "Cow must override sound(). Delete the line that creates new Animal(...)."],
      solution: J`abstract class Animal {
    String name;
    Animal(String name) { this.name = name; }
    abstract String sound();
    void speak() { System.out.println(name + " says " + sound()); }
}

class Cow extends Animal {
    Cow() { super("Cow"); }
    @Override
    String sound() { return "Moo"; }
}

public class Main {
    public static void main(String[] args) {
        Animal c = new Cow();
        c.speak();
    }
}`,
    },
    {
      id: "c9t6p3", title: "Exam template",
      task: "<p>Abstract class <code>Exam</code> has a final method <code>conduct()</code> that prints <code>Papers distributed</code>, calls abstract <code>write()</code>, then prints <code>Papers collected</code>. Implement <code>WrittenExam</code> (\"Students write answers\") and <code>LabExam</code> (\"Students write and run code\").</p>",
      expected: "Papers distributed\nStudents write answers\nPapers collected\nPapers distributed\nStudents write and run code\nPapers collected",
      mustUse: ["final void conduct()", "abstract void write()"],
      hints: ["The final keyword stops subclasses from changing the order of steps."],
      solution: J`abstract class Exam {
    final void conduct() {
        System.out.println("Papers distributed");
        write();
        System.out.println("Papers collected");
    }

    abstract void write();
}

class WrittenExam extends Exam {
    @Override void write() { System.out.println("Students write answers"); }
}

class LabExam extends Exam {
    @Override void write() { System.out.println("Students write and run code"); }
}

public class Main {
    public static void main(String[] args) {
        new WrittenExam().conduct();
        new LabExam().conduct();
    }
}`,
    },
  ],

  fill: [
    { id: "c9t6f1", prompt: "Declare an abstract method.", template: "___ double area()___", answers: [["abstract"], [";"]], explain: "No body, just a semicolon." },
    { id: "c9t6f2", prompt: "A class with an abstract method must be declared…", template: "___ class Payment { … }", answers: [["abstract"]], explain: "Otherwise it's a compile error." },
  ],

  quiz: [
    { type: "mcq", q: "Can an abstract class have a constructor?", options: ["No", "Yes — called through super() from subclasses", "Only private", "Only if it has no abstract methods"], answer: 1, explain: "It initialises the shared fields." },
    { type: "mcq", q: "Which combination is legal?", options: ["abstract final method", "abstract static method", "abstract protected method", "abstract private method"], answer: 2, explain: "The others can never be overridden." },
    { type: "mcq", q: "A subclass doesn't implement one inherited abstract method. Then it must be…", options: ["final", "abstract", "static", "public"], answer: 1, explain: "Or the code doesn't compile." },
    { type: "mcq", q: "Can an abstract class have zero abstract methods?", options: ["Yes", "No"], answer: 0, explain: "Legal — it simply can't be instantiated." },
    { type: "output", q: "Predict the output.", code: J`abstract class A {
    A() { System.out.print("A"); show(); }
    abstract void show();
}
class B extends A {
    int x = 5;
    B() { System.out.print("B"); }
    void show() { System.out.print(x); }
}
public class Q {
    public static void main(String[] args) { new B(); }
}`, answer: "A0B", explain: "A's constructor calls the overridden show() before B's fields are initialised, so x is still 0. (A reason not to call overridable methods from constructors.)" },
  ],
};
