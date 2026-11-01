const J = String.raw;

export default {
  title: "Constructors",
  summary: "Special methods that initialise a new object. Default, no-argument and parameterised constructors, constructor overloading and copy constructors.",

  concept: J`
<h2>Concept</h2>
<p>A <b>constructor</b> runs automatically when an object is created with <code>new</code>. Its job is to put the new object into a valid starting state.</p>
<pre class="java">class Student {
    String name;
    int age;

    Student(String n, int a) {   // constructor
        name = n;
        age = a;
    }
}
Student s = new Student("Asha", 19);   // the constructor runs here</pre>

<h3>Rules</h3>
<ul>
<li>Same name as the class (exactly, same capitals).</li>
<li><b>No return type</b> — not even void. If you write <code>void Student()</code>, it becomes an ordinary method that never runs on <code>new</code>!</li>
<li>Can have any access modifier (public, private…), can be overloaded, can throw exceptions.</li>
<li>Cannot be <code>static</code>, <code>final</code> or <code>abstract</code>, and is <b>not inherited</b>.</li>
</ul>

<h3>Types of constructors</h3>
<table>
<tr><th>Type</th><th>What it is</th></tr>
<tr><td><b>Default constructor</b></td><td>If a class has <b>no</b> constructor at all, the compiler adds an empty no-argument one: <code>Student() { super(); }</code></td></tr>
<tr><td><b>No-argument constructor</b></td><td>One you write yourself with no parameters, e.g. to set sensible defaults.</td></tr>
<tr><td><b>Parameterised constructor</b></td><td>Takes values to initialise fields.</td></tr>
<tr><td><b>Copy constructor</b></td><td>Takes another object of the same class and copies its fields (Java doesn't create one for you).</td></tr>
</table>
<div class="warn"><b>Trap:</b> once you write <b>any</b> constructor, the compiler no longer adds the default one. If you then write <code>new Student()</code> without defining a no-arg constructor → <code>error: constructor Student in class Student cannot be applied to given types</code>.</div>

<h3>Constructor overloading</h3>
<p>A class can have several constructors with different parameter lists, giving callers different ways to create objects:</p>
<pre class="java">Product()                          // name "Unknown", price 0
Product(String name)               // price 0
Product(String name, double price)</pre>

<h3>Constructor vs method</h3>
<table>
<tr><th>Constructor</th><th>Method</th></tr>
<tr><td>name = class name</td><td>any name</td></tr>
<tr><td>no return type</td><td>must have a return type (or void)</td></tr>
<tr><td>called automatically by <code>new</code>, once per object</td><td>called explicitly, any number of times</td></tr>
<tr><td>not inherited</td><td>inherited (unless private)</td></tr>
</table>

<h3>Private constructors</h3>
<p>A <code>private</code> constructor stops other classes from creating objects. Used for utility classes (like <code>Math</code>) and for the <b>Singleton</b> pattern (a class with exactly one object).</p>
`,

  samples: [
    {
      title: "Overloaded constructors",
      code: J`class Product {
    String name;
    double price;

    Product() {
        name = "Unknown";
        price = 0;
    }

    Product(String n) {
        name = n;
        price = 0;
    }

    Product(String n, double p) {
        name = n;
        price = p;
    }

    void show() {
        System.out.println(name + " : Rs." + price);
    }
}

public class Main {
    public static void main(String[] args) {
        new Product().show();
        new Product("Eraser").show();
        new Product("Calculator", 649.5).show();
    }
}`,
      output: "Unknown : Rs.0.0\nEraser : Rs.0.0\nCalculator : Rs.649.5",
    },
    {
      title: "The void constructor trap",
      code: J`class Lamp {
    boolean on;

    void Lamp() {
        on = true;
        System.out.println("This is a method, not a constructor!");
    }
}

public class Main {
    public static void main(String[] args) {
        Lamp l = new Lamp();
        System.out.println("on = " + l.on);
        l.Lamp();
        System.out.println("on = " + l.on);
    }
}`,
      output: "on = false\nThis is a method, not a constructor!\non = true",
      explain: "Because of <code>void</code>, Lamp() is a normal method. The compiler added a default constructor, which sets nothing.",
    },
    {
      title: "Copy constructor",
      code: J`class Point {
    int x, y;

    Point(int x0, int y0) {
        x = x0;
        y = y0;
    }

    Point(Point other) {
        x = other.x;
        y = other.y;
    }
}

public class Main {
    public static void main(String[] args) {
        Point p = new Point(3, 4);
        Point copy = new Point(p);
        copy.x = 30;
        System.out.println(p.x + "," + p.y + "  " + copy.x + "," + copy.y);
    }
}`,
      output: "3,4  30,4",
    },
  ],

  practice: [
    {
      id: "c7t2p1", title: "Circle with a constructor",
      task: "<p>Create class <code>Circle</code> with field <code>radius</code>, a constructor <code>Circle(double r)</code>, and methods <code>area()</code> and <code>circumference()</code>. Print both for radius 7 with 2 decimals.</p>",
      expected: "Area: 153.94\nCircumference: 43.98",
      mustUse: ["Circle(double r)", "new Circle(7)"],
      hints: ["area = Math.PI * r * r; circumference = 2 * Math.PI * r.", "Print with <code>System.out.printf(\"Area: %.2f%n\", c.area());</code>"],
      solution: J`class Circle {
    double radius;

    Circle(double r) {
        radius = r;
    }

    double area() {
        return Math.PI * radius * radius;
    }

    double circumference() {
        return 2 * Math.PI * radius;
    }
}

public class Main {
    public static void main(String[] args) {
        Circle c = new Circle(7);
        System.out.printf("Area: %.2f%n", c.area());
        System.out.printf("Circumference: %.2f%n", c.circumference());
    }
}`,
    },
    {
      id: "c7t2p2", title: "Fix the missing constructor",
      task: "<p>The code doesn't compile because <code>new Employee()</code> has no matching constructor. Add a no-argument constructor that sets name to <code>\"Trainee\"</code> and salary to <code>15000</code>.</p>",
      starter: J`class Employee {
    String name;
    double salary;

    Employee(String n, double s) {
        name = n;
        salary = s;
    }

    void show() {
        System.out.println(name + " earns " + salary);
    }
}

public class Main {
    public static void main(String[] args) {
        new Employee("Ritu", 52000).show();
        new Employee().show();
    }
}`,
      expected: "Ritu earns 52000.0\nTrainee earns 15000.0",
      mustUse: ["Employee()"],
      hints: ["Writing a parameterised constructor removed the compiler's default one. Add <code>Employee() { name = \"Trainee\"; salary = 15000; }</code>"],
      solution: J`class Employee {
    String name;
    double salary;

    Employee() {
        name = "Trainee";
        salary = 15000;
    }

    Employee(String n, double s) {
        name = n;
        salary = s;
    }

    void show() {
        System.out.println(name + " earns " + salary);
    }
}

public class Main {
    public static void main(String[] args) {
        new Employee("Ritu", 52000).show();
        new Employee().show();
    }
}`,
    },
    {
      id: "c7t2p3", title: "Time with three constructors",
      task: "<p>Create class <code>Time</code> (hours, minutes) with constructors <code>Time()</code> → 00:00, <code>Time(int h)</code> → h:00 and <code>Time(int h, int m)</code>. Add <code>String format()</code> returning HH:MM with leading zeros.</p>",
      expected: "00:00\n09:00\n17:05",
      mustUse: ["Time()", "Time(int h)", "Time(int h, int m)"],
      hints: ["<code>return String.format(\"%02d:%02d\", hours, minutes);</code>"],
      solution: J`class Time {
    int hours, minutes;

    Time() {
        hours = 0;
        minutes = 0;
    }

    Time(int h) {
        hours = h;
        minutes = 0;
    }

    Time(int h, int m) {
        hours = h;
        minutes = m;
    }

    String format() {
        return String.format("%02d:%02d", hours, minutes);
    }
}

public class Main {
    public static void main(String[] args) {
        System.out.println(new Time().format());
        System.out.println(new Time(9).format());
        System.out.println(new Time(17, 5).format());
    }
}`,
    },
    {
      id: "c7t2p4", title: "Counting objects",
      task: "<p>Create class <code>Ticket</code> whose constructor gives each ticket a number automatically: the first is 1001, then 1002… Use a <code>static int next = 1001;</code> counter and an instance field <code>id</code>. Create three tickets for passengers and print them.</p>",
      expected: "Ticket 1001 -> Aman\nTicket 1002 -> Bela\nTicket 1003 -> Chirag",
      mustUse: ["static int next", "next++"],
      hints: ["In the constructor: <code>id = next++;</code> (static belongs to the class, so all objects share one counter — more about static soon)."],
      solution: J`class Ticket {
    static int next = 1001;
    int id;
    String passenger;

    Ticket(String p) {
        id = next++;
        passenger = p;
    }

    void print() {
        System.out.println("Ticket " + id + " -> " + passenger);
    }
}

public class Main {
    public static void main(String[] args) {
        Ticket a = new Ticket("Aman");
        Ticket b = new Ticket("Bela");
        Ticket c = new Ticket("Chirag");
        a.print();
        b.print();
        c.print();
    }
}`,
    },
  ],

  fill: [
    { id: "c7t2f1", prompt: "Write the constructor header of class Car that takes a model name.", template: "___(String model) { … }", answers: [["Car"]], explain: "Same name as the class, no return type." },
    { id: "c7t2f2", prompt: "When does the compiler add a default constructor?", template: "Only when the class has ___ constructors.", answers: [["no", "zero"]], explain: "Writing any constructor removes the default." },
  ],

  quiz: [
    { type: "mcq", q: "Which is a valid constructor for class <code>Box</code>?", options: ["void Box() {}", "Box() {}", "static Box() {}", "int Box() {}"], answer: 1, explain: "No return type, not static." },
    { type: "output", q: "Predict the output.", code: J`class A {
    int v = 5;
    A() { v = 10; }
    A(int x) { v = x; }
}
public class Q {
    public static void main(String[] args) {
        System.out.println(new A().v + new A(3).v);
    }
}`, answer: "13", explain: "10 + 3." },
    { type: "mcq", q: "Class <code>Pen</code> has only <code>Pen(String colour)</code>. What does <code>new Pen()</code> do?", options: ["uses a default constructor", "compile error", "colour becomes null", "runtime error"], answer: 1, explain: "No default constructor is generated once you define one." },
    { type: "mcq", q: "Can constructors be inherited?", options: ["Yes, always", "Only public ones", "No", "Only no-arg ones"], answer: 2, explain: "Each class has its own constructors; subclasses call them with super()." },
    { type: "mcq", q: "A private constructor is used to…", options: ["make the class faster", "prevent other classes from creating objects", "allow inheritance", "make fields private"], answer: 1, explain: "e.g. utility classes and singletons." },
  ],
};
