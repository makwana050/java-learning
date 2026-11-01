const J = String.raw;

export default {
  title: "Interfaces",
  summary: "A contract that says what a class can do. Declare interfaces, implement them, use them as types, and see how they give Java multiple inheritance of type.",

  concept: J`
<h2>Concept</h2>
<p>An <b>interface</b> is a contract: a list of methods that a class promises to provide. It says <b>what</b> must be done; each implementing class decides <b>how</b>.</p>
<pre class="java">interface Payable {
    double amountDue();               // implicitly public abstract
}

class Invoice implements Payable {
    double total;
    Invoice(double total) { this.total = total; }
    @Override
    public double amountDue() { return total; }   // must be public
}</pre>

<h3>What an interface can contain</h3>
<table>
<tr><th>Member</th><th>Implicit modifiers</th></tr>
<tr><td>Abstract methods</td><td><code>public abstract</code></td></tr>
<tr><td>Constants (fields)</td><td><code>public static final</code> — must be initialised, can't change</td></tr>
<tr><td>default methods (Java 8)</td><td><code>public</code>, with a body — next topic</td></tr>
<tr><td>static methods (Java 8)</td><td><code>public</code>, with a body</td></tr>
<tr><td>private methods (Java 9)</td><td>helpers for default/static methods</td></tr>
</table>
<p>No constructors, no instance fields, no instance blocks. You can't write <code>new Payable()</code>.</p>

<h3>Implementing interfaces</h3>
<ul>
<li><code>class A implements I</code> — A must implement all abstract methods (or be declared abstract).</li>
<li>Implemented methods must be <b>public</b> — writing them without <code>public</code> reduces visibility → compile error.</li>
<li>A class can implement <b>many</b> interfaces: <code>class Phone implements Camera, MusicPlayer, GPS</code>.</li>
<li>A class can extend one class <b>and</b> implement interfaces: <code>class Dog extends Animal implements Pet, Trainable</code> (extends comes first).</li>
<li>An interface can <b>extend</b> other interfaces (even several): <code>interface SmartTV extends TV, Internet</code>.</li>
</ul>

<h3>Interfaces as types</h3>
<pre class="java">Payable p = new Invoice(500);      // interface reference, class object
Payable[] bills = { new Invoice(500), new Salary(30000) };
for (Payable b : bills) total += b.amountDue();     // polymorphism</pre>
<p>Code written against an interface works with any class that implements it — today's and tomorrow's. This is called <b>programming to an interface</b>, and it's how the Java libraries are built (<code>List</code>, <code>Runnable</code>, <code>Comparable</code>…).</p>

<h3>Marker interfaces</h3>
<p>An interface with no methods, like <code>Serializable</code> or <code>Cloneable</code>, just "marks" a class as having a property.</p>

<h3>Multiple inheritance of type</h3>
<p>Java forbids extending two classes (which state and constructor would win?), but implementing several interfaces is safe because interfaces have no instance state. If two interfaces declare the same abstract method, the class implements it once.</p>
`,

  samples: [
    {
      title: "One interface, many implementations",
      code: J`interface Payable {
    double amountDue();
}

class Invoice implements Payable {
    double qty, unitPrice;
    Invoice(double qty, double unitPrice) { this.qty = qty; this.unitPrice = unitPrice; }
    @Override
    public double amountDue() { return qty * unitPrice; }
}

class Salary implements Payable {
    double monthly;
    Salary(double monthly) { this.monthly = monthly; }
    @Override
    public double amountDue() { return monthly; }
}

public class Main {
    public static void main(String[] args) {
        Payable[] dues = {new Invoice(3, 250), new Salary(42000), new Invoice(1, 999)};
        double total = 0;
        for (Payable p : dues) total += p.amountDue();
        System.out.println("Total to pay: " + total);
    }
}`,
      output: "Total to pay: 43749.0",
    },
    {
      title: "extends + implements, multiple interfaces",
      code: J`interface Swimmer { void swim(); }
interface Flyer { void fly(); }
interface Walker { int MAX_SPEED = 10; void walk(); }

class Bird {
    String name;
    Bird(String name) { this.name = name; }
}

class Duck extends Bird implements Swimmer, Flyer, Walker {
    Duck() { super("Duck"); }
    public void swim() { System.out.println(name + " swims"); }
    public void fly() { System.out.println(name + " flies"); }
    public void walk() { System.out.println(name + " walks at most " + MAX_SPEED + " km/h"); }
}

public class Main {
    public static void main(String[] args) {
        Duck d = new Duck();
        d.swim();
        d.fly();
        d.walk();
        Swimmer s = d;
        System.out.println((s instanceof Flyer) + " " + Walker.MAX_SPEED);
    }
}`,
      output: "Duck swims\nDuck flies\nDuck walks at most 10 km/h\ntrue 10",
    },
  ],

  practice: [
    {
      id: "c10t1p1", title: "Shape contract",
      task: "<p>Create interface <code>Shape</code> with <code>double area()</code> and <code>String name()</code>. Implement it in <code>Square</code> (side 6) and <code>Ellipse</code> (a = 3, b = 2, area = π·a·b). Print each using a <code>Shape[]</code> with printf to 2 decimals.</p>",
      expected: "Square: 36.00\nEllipse: 18.85",
      mustUse: ["interface Shape", "implements Shape"],
      hints: ["Don't forget public on the implemented methods.", "<code>System.out.printf(\"%s: %.2f%n\", s.name(), s.area());</code>"],
      solution: J`interface Shape {
    double area();
    String name();
}

class Square implements Shape {
    double side;
    Square(double side) { this.side = side; }
    public double area() { return side * side; }
    public String name() { return "Square"; }
}

class Ellipse implements Shape {
    double a, b;
    Ellipse(double a, double b) { this.a = a; this.b = b; }
    public double area() { return Math.PI * a * b; }
    public String name() { return "Ellipse"; }
}

public class Main {
    public static void main(String[] args) {
        Shape[] shapes = {new Square(6), new Ellipse(3, 2)};
        for (Shape s : shapes) System.out.printf("%s: %.2f%n", s.name(), s.area());
    }
}`,
    },
    {
      id: "c10t1p2", title: "Smartphone with many abilities",
      task: "<p>Create interfaces <code>Camera</code> (<code>String click()</code>), <code>MusicPlayer</code> (<code>String play(String song)</code>) and <code>Phone</code> (<code>String call(String number)</code>). Class <code>Smartphone</code> implements all three. Call each through a reference of its interface type.</p>",
      expected: "Photo captured\nPlaying Vande Mataram\nCalling 9988776655",
      mustUse: ["implements Camera, MusicPlayer, Phone"],
      hints: ["<code>Camera c = sp; MusicPlayer m = sp; Phone p = sp;</code>"],
      solution: J`interface Camera { String click(); }
interface MusicPlayer { String play(String song); }
interface Phone { String call(String number); }

class Smartphone implements Camera, MusicPlayer, Phone {
    public String click() { return "Photo captured"; }
    public String play(String song) { return "Playing " + song; }
    public String call(String number) { return "Calling " + number; }
}

public class Main {
    public static void main(String[] args) {
        Smartphone sp = new Smartphone();
        Camera c = sp;
        MusicPlayer m = sp;
        Phone p = sp;
        System.out.println(c.click());
        System.out.println(m.play("Vande Mataram"));
        System.out.println(p.call("9988776655"));
    }
}`,
    },
    {
      id: "c10t1p3", title: "Fix the implementation",
      task: "<p>The starter fails to compile for two reasons: the implementing method isn't public, and one method isn't implemented. Fix both.</p>",
      starter: J`interface Discount {
    double apply(double price);
    String label();
}

class FestiveDiscount implements Discount {
    double apply(double price) {
        return price * 0.8;
    }
}

public class Main {
    public static void main(String[] args) {
        Discount d = new FestiveDiscount();
        System.out.println(d.label() + ": " + d.apply(2500));
    }
}`,
      expected: "Festive 20% off: 2000.0",
      mustUse: ["public double apply(double price)", "public String label()"],
      hints: ["Interface methods are public, so implementations must be public.", "Add <code>public String label() { return \"Festive 20% off\"; }</code>"],
      solution: J`interface Discount {
    double apply(double price);
    String label();
}

class FestiveDiscount implements Discount {
    public double apply(double price) {
        return price * 0.8;
    }

    public String label() {
        return "Festive 20% off";
    }
}

public class Main {
    public static void main(String[] args) {
        Discount d = new FestiveDiscount();
        System.out.println(d.label() + ": " + d.apply(2500));
    }
}`,
    },
    {
      id: "c10t1p4", title: "Interface inheritance",
      task: "<p>Interface <code>Readable</code> has <code>String read()</code>; <code>Writable</code> has <code>void write(String s)</code>; <code>ReadWrite extends Readable, Writable</code>. Class <code>Notebook implements ReadWrite</code> stores text in a StringBuilder. Write two lines and read them back.</p>",
      expected: "Line one; Line two;",
      mustUse: ["interface ReadWrite extends Readable, Writable"],
      hints: ["write: <code>sb.append(s).append(\"; \");</code> read: <code>return sb.toString().trim();</code>"],
      solution: J`interface Readable { String read(); }
interface Writable { void write(String s); }
interface ReadWrite extends Readable, Writable { }

class Notebook implements ReadWrite {
    private StringBuilder sb = new StringBuilder();
    public void write(String s) { sb.append(s).append("; "); }
    public String read() { return sb.toString().trim(); }
}

public class Main {
    public static void main(String[] args) {
        ReadWrite nb = new Notebook();
        nb.write("Line one");
        nb.write("Line two");
        System.out.println(nb.read());
    }
}`,
    },
  ],

  fill: [
    { id: "c10t1f1", prompt: "A class that extends Account and implements Taxable.", template: "class Savings ___ Account ___ Taxable { }", answers: [["extends"], ["implements"]], explain: "extends comes before implements." },
    { id: "c10t1f2", prompt: "Implicit modifiers of an interface field.", template: "___ ___ ___ int LIMIT = 5;", answers: [["public"], ["static"], ["final"]], explain: "Interface fields are constants." },
  ],

  quiz: [
    { type: "mcq", q: "How many interfaces can a class implement?", options: ["1", "2", "any number", "none if it extends a class"], answer: 2, explain: "Separate them with commas." },
    { type: "mcq", q: "Which is NOT allowed in an interface?", options: ["static method", "default method", "constructor", "constant"], answer: 2, explain: "Interfaces can't be instantiated, so no constructors." },
    { type: "mcq", q: "An interface extends other interfaces using…", options: ["implements", "extends", "inherits", "uses"], answer: 1, explain: "interface C extends A, B." },
    { type: "mcq", q: "Implementing <code>void run();</code> as <code>void run() { }</code> (no public) gives…", options: ["fine", "compile error: attempting to assign weaker access", "runtime error", "warning only"], answer: 1, explain: "Interface methods are public." },
    { type: "output", q: "Predict the output.", code: J`interface A { int X = 10; }
class B implements A { int y = X * 2; }
public class Q {
    public static void main(String[] args) {
        System.out.println(new B().y + A.X);
    }
}`, answer: "30", explain: "X is a constant shared through the interface." },
  ],
};
