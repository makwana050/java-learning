const J = String.raw;

export default {
  title: "Inheritance basics",
  summary: "Build a new class on top of an existing one with extends: reuse its fields and methods, add new ones, and model IS-A relationships.",

  concept: J`
<h2>Concept</h2>
<p><b>Inheritance</b> lets one class (the <b>subclass</b> / child / derived class) acquire the fields and methods of another (the <b>superclass</b> / parent / base class). The child can then <b>add</b> new members and <b>change</b> (override) inherited behaviour.</p>
<pre class="java">class Vehicle {                     // parent
    String brand;
    int speed;
    void accelerate(int x) { speed += x; }
}

class Car extends Vehicle {         // child IS-A Vehicle
    int doors;                      // new field
    void honk() { System.out.println("Beep!"); }   // new method
}

Car c = new Car();
c.brand = "Tata";      // inherited
c.accelerate(40);      // inherited
c.honk();              // its own</pre>

<h3>IS-A vs HAS-A</h3>
<ul>
<li><b>IS-A</b> → inheritance. A Car <i>is a</i> Vehicle; a SavingsAccount <i>is an</i> Account.</li>
<li><b>HAS-A</b> → composition (a field). A Car <i>has an</i> Engine → <code>class Car { Engine engine; }</code>.</li>
</ul>
<p>Use inheritance only when IS-A really holds. "A Stack is a List" or "a Square is a Rectangle" often cause trouble — prefer composition when in doubt.</p>

<h3>What is inherited?</h3>
<table>
<tr><th>Member</th><th>Inherited?</th></tr>
<tr><td>public and protected fields/methods</td><td>Yes</td></tr>
<tr><td>default (package-private) members</td><td>Yes, if the child is in the same package</td></tr>
<tr><td>private members</td><td>No access (they exist inside the object, but the child must use public/protected methods)</td></tr>
<tr><td>Constructors</td><td>No — but the child's constructor always calls one (next topic)</td></tr>
<tr><td>static members</td><td>Accessible through the child, but they still belong to the parent (they are <i>hidden</i>, not overridden)</td></tr>
</table>

<h3>Types of inheritance</h3>
<table>
<tr><th>Type</th><th>Shape</th><th>In Java?</th></tr>
<tr><td>Single</td><td>B extends A</td><td>✓</td></tr>
<tr><td>Multilevel</td><td>C extends B extends A</td><td>✓</td></tr>
<tr><td>Hierarchical</td><td>B and C both extend A</td><td>✓</td></tr>
<tr><td>Multiple (classes)</td><td>C extends A, B</td><td>✗ not with classes — avoids the diamond problem; use interfaces</td></tr>
<tr><td>Hybrid</td><td>combination</td><td>only with interfaces</td></tr>
</table>
<p>Every class without <code>extends</code> implicitly extends <code>Object</code>, so <code>Object</code> is the root of every inheritance tree.</p>

<h3>Benefits</h3>
<ul>
<li><b>Code reuse</b> — common code written once in the parent.</li>
<li><b>Extensibility</b> — add new kinds (a new Vehicle type) without changing existing code.</li>
<li><b>Polymorphism</b> — treat all subclasses through the parent type (coming soon).</li>
</ul>
`,

  samples: [
    {
      title: "Single and multilevel inheritance",
      code: J`class Person {
    String name;
    void introduce() {
        System.out.println("I am " + name);
    }
}

class Employee extends Person {
    double salary;
    void work() {
        System.out.println(name + " is working");
    }
}

class Manager extends Employee {
    int teamSize;
    void meeting() {
        System.out.println(name + " leads a team of " + teamSize);
    }
}

public class Main {
    public static void main(String[] args) {
        Manager m = new Manager();
        m.name = "Kavita";
        m.salary = 120000;
        m.teamSize = 8;
        m.introduce();
        m.work();
        m.meeting();
        System.out.println(m instanceof Person);
    }
}`,
      output: "I am Kavita\nKavita is working\nKavita leads a team of 8\ntrue",
    },
    {
      title: "Hierarchical inheritance",
      code: J`class Shape {
    String colour = "black";
    String describe() {
        return colour + " shape";
    }
}

class Circle extends Shape {
    double r = 2;
}

class Square extends Shape {
    double side = 3;
}

public class Main {
    public static void main(String[] args) {
        Circle c = new Circle();
        Square s = new Square();
        s.colour = "red";
        System.out.println(c.describe() + ", r = " + c.r);
        System.out.println(s.describe() + ", side = " + s.side);
    }
}`,
      output: "black shape, r = 2.0\nred shape, side = 3.0",
    },
  ],

  practice: [
    {
      id: "c9t1p1", title: "Account and SavingsAccount",
      task: "<p>Class <code>Account</code> has <code>holder</code>, <code>balance</code>, <code>deposit(double)</code> and <code>show()</code>. <code>SavingsAccount extends Account</code> adds <code>rate</code> and <code>addInterest()</code> (balance += balance × rate / 100). Run: deposit 10000, rate 6, add interest, show.</p>",
      expected: "Lakshmi: 10600.0",
      mustUse: ["class SavingsAccount extends Account", "void addInterest()"],
      hints: ["SavingsAccount can use balance directly if it isn't private (or use a protected field)."],
      solution: J`class Account {
    String holder;
    protected double balance;

    void deposit(double amount) {
        balance += amount;
    }

    void show() {
        System.out.println(holder + ": " + balance);
    }
}

class SavingsAccount extends Account {
    double rate;

    void addInterest() {
        balance += balance * rate / 100;
    }
}

public class Main {
    public static void main(String[] args) {
        SavingsAccount s = new SavingsAccount();
        s.holder = "Lakshmi";
        s.deposit(10000);
        s.rate = 6;
        s.addInterest();
        s.show();
    }
}`,
    },
    {
      id: "c9t1p2", title: "Three-level family",
      task: "<p>Create <code>Animal</code> (method <code>eat()</code>), <code>Mammal extends Animal</code> (method <code>breathe()</code>) and <code>Dog extends Mammal</code> (method <code>bark()</code>). Call all three methods on one Dog.</p>",
      expected: "Eating...\nBreathing air...\nWoof!",
      mustUse: ["extends Animal", "extends Mammal"],
      hints: ["Each class adds just one method."],
      solution: J`class Animal {
    void eat() { System.out.println("Eating..."); }
}

class Mammal extends Animal {
    void breathe() { System.out.println("Breathing air..."); }
}

class Dog extends Mammal {
    void bark() { System.out.println("Woof!"); }
}

public class Main {
    public static void main(String[] args) {
        Dog d = new Dog();
        d.eat();
        d.breathe();
        d.bark();
    }
}`,
    },
    {
      id: "c9t1p3", title: "Private needs a getter",
      task: "<p>The child class tries to read a private parent field and fails to compile. Add a <b>protected getter</b> in the parent and use it in the child (keep the field private).</p>",
      starter: J`class Device {
    private String serial;

    Device(String serial) {
        this.serial = serial;
    }
}

class Phone extends Device {
    Phone(String serial) {
        super(serial);
    }

    void label() {
        System.out.println("Phone #" + serial);
    }
}

public class Main {
    public static void main(String[] args) {
        new Phone("PX-7781").label();
    }
}`,
      expected: "Phone #PX-7781",
      mustUse: ["private String serial", "protected String getSerial()"],
      hints: ["In Device: <code>protected String getSerial() { return serial; }</code>", "In Phone: use getSerial()."],
      solution: J`class Device {
    private String serial;

    Device(String serial) {
        this.serial = serial;
    }

    protected String getSerial() {
        return serial;
    }
}

class Phone extends Device {
    Phone(String serial) {
        super(serial);
    }

    void label() {
        System.out.println("Phone #" + getSerial());
    }
}

public class Main {
    public static void main(String[] args) {
        new Phone("PX-7781").label();
    }
}`,
    },
  ],

  fill: [
    { id: "c9t1f1", prompt: "Make Bike a subclass of Vehicle.", template: "class Bike ___ Vehicle { }", answers: [["extends"]], explain: "extends creates an IS-A relationship." },
    { id: "c9t1f2", prompt: "Every class without extends implicitly extends…", template: "java.lang.___", answers: [["Object"]], explain: "Object is the root class." },
  ],

  quiz: [
    { type: "mcq", q: "Which inheritance type does Java NOT support with classes?", options: ["Single", "Multilevel", "Hierarchical", "Multiple"], answer: 3, explain: "A class can extend only one class." },
    { type: "mcq", q: "Which relationship should use composition (a field) instead of inheritance?", options: ["Teacher – Person", "Car – Engine", "Circle – Shape", "Parrot – Bird"], answer: 1, explain: "A car HAS-AN engine." },
    { type: "mcq", q: "Are constructors inherited?", options: ["Yes", "No", "Only public ones", "Only default ones"], answer: 1, explain: "They're called via super(), not inherited." },
    { type: "output", q: "Predict the output.", code: J`class A { int x = 1; void show() { System.out.print(x); } }
class B extends A { int y = 2; }
public class Q {
    public static void main(String[] args) {
        B b = new B();
        b.x = 5;
        b.show();
        System.out.println(b.y);
    }
}`, answer: "52", explain: "B inherits x and show()." },
  ],
};
