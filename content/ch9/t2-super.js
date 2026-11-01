const J = String.raw;

export default {
  title: "super & constructor chaining in inheritance",
  summary: "How parent and child constructors run together, how super() and this() build a chain, and how super reaches the parent's fields and methods.",

  concept: J`
<h2>Concept</h2>
<p><code>super</code> refers to the <b>parent part</b> of the current object. It has three uses.</p>

<h3>1. super(...) — call the parent constructor</h3>
<p>Every constructor of a child <b>must</b> start by calling a parent constructor, so the parent part of the object is initialised first.</p>
<ul>
<li>If you don't write it, the compiler inserts <code>super();</code> (the parent's <b>no-arg</b> constructor) as the first statement.</li>
<li>If the parent has <b>no</b> no-arg constructor, you must call another one explicitly: <code>super(name, age);</code> — otherwise: <code>error: constructor Person in class Person cannot be applied to given types</code>.</li>
<li><code>super(...)</code> must be the <b>first statement</b>. A constructor can begin with <code>this(...)</code> <b>or</b> <code>super(...)</code>, not both.</li>
</ul>

<h3>Constructor chaining across classes</h3>
<p>Calls go <b>up</b> the hierarchy first; bodies finish <b>top-down</b>: Object → grandparent → parent → child.</p>
<pre class="java">class A { A() { System.out.println("A"); } }
class B extends A { B() { System.out.println("B"); } }        // super() inserted
class C extends B { C() { System.out.println("C"); } }
new C();     // prints A, B, C</pre>
<p>Combine <code>this()</code> and <code>super()</code>: a child constructor may call another child constructor with <code>this(...)</code>, and the last one in that chain calls <code>super(...)</code>.</p>
<pre class="java">class Employee extends Person {
    double salary;
    Employee(String name) { this(name, 30000); }            // → same class
    Employee(String name, double salary) {
        super(name);                                         // → parent
        this.salary = salary;
    }
}</pre>

<h3>Full order when creating a child object</h3>
<ol>
<li>Parent static blocks, then child static blocks (once, at class loading).</li>
<li>Parent instance initialisers/blocks → parent constructor body.</li>
<li>Child instance initialisers/blocks → child constructor body.</li>
</ol>

<h3>2. super.method() — call the parent's version</h3>
<p>When the child overrides a method, it can still reuse the parent's version:</p>
<pre class="java">@Override
String describe() {
    return super.describe() + ", salary " + salary;
}</pre>

<h3>3. super.field — reach a parent field hidden by a child field</h3>
<p>If the child declares a field with the same name, <code>super.name</code> refers to the parent's one (see "variable hiding" later).</p>

<div class="warn"><code>super</code> can't be used in a static context, and <code>super.super.x</code> is not allowed — you can only reach the direct parent.</div>
`,

  samples: [
    {
      title: "Constructors run top-down",
      code: J`class Grandparent {
    Grandparent() {
        System.out.println("1. Grandparent constructor");
    }
}

class Parent extends Grandparent {
    Parent() {
        System.out.println("2. Parent constructor");
    }
}

class Child extends Parent {
    Child() {
        System.out.println("3. Child constructor");
    }
}

public class Main {
    public static void main(String[] args) {
        new Child();
    }
}`,
      output: "1. Grandparent constructor\n2. Parent constructor\n3. Child constructor",
    },
    {
      title: "this() and super() in one chain",
      code: J`class Person {
    String name;

    Person(String name) {
        this.name = name;
        System.out.println("Person(" + name + ")");
    }

    String describe() {
        return "Name: " + name;
    }
}

class Employee extends Person {
    double salary;

    Employee(String name) {
        this(name, 30000);
        System.out.println("Employee(String)");
    }

    Employee(String name, double salary) {
        super(name);
        this.salary = salary;
        System.out.println("Employee(String, double)");
    }

    @Override
    String describe() {
        return super.describe() + ", Salary: " + salary;
    }
}

public class Main {
    public static void main(String[] args) {
        Employee e = new Employee("Gaurav");
        System.out.println(e.describe());
    }
}`,
      output: "Person(Gaurav)\nEmployee(String, double)\nEmployee(String)\nName: Gaurav, Salary: 30000.0",
    },
    {
      title: "Blocks, constructors and inheritance — the full order",
      code: J`class Base {
    static { System.out.println("Base static"); }
    { System.out.println("Base instance block"); }
    Base() { System.out.println("Base constructor"); }
}

class Derived extends Base {
    static { System.out.println("Derived static"); }
    { System.out.println("Derived instance block"); }
    Derived() { System.out.println("Derived constructor"); }
}

public class Main {
    public static void main(String[] args) {
        new Derived();
        System.out.println("---");
        new Derived();
    }
}`,
      output: "Base static\nDerived static\nBase instance block\nBase constructor\nDerived instance block\nDerived constructor\n---\nBase instance block\nBase constructor\nDerived instance block\nDerived constructor",
    },
  ],

  practice: [
    {
      id: "c9t2p1", title: "Call the right parent constructor",
      task: "<p>The starter doesn't compile because <code>Vehicle</code> has no no-arg constructor. Fix <code>Truck</code>'s constructor with an explicit <code>super(...)</code> call.</p>",
      starter: J`class Vehicle {
    String regNo;
    int wheels;

    Vehicle(String regNo, int wheels) {
        this.regNo = regNo;
        this.wheels = wheels;
    }
}

class Truck extends Vehicle {
    double loadTonnes;

    Truck(String regNo, double loadTonnes) {
        this.loadTonnes = loadTonnes;
    }

    void show() {
        System.out.println(regNo + ", " + wheels + " wheels, " + loadTonnes + " t");
    }
}

public class Main {
    public static void main(String[] args) {
        new Truck("GJ01AB1234", 12.5).show();
    }
}`,
      expected: "GJ01AB1234, 6 wheels, 12.5 t",
      mustUse: ["super(regNo, 6)"],
      hints: ["The first line of Truck's constructor must be <code>super(regNo, 6);</code>"],
      solution: J`class Vehicle {
    String regNo;
    int wheels;

    Vehicle(String regNo, int wheels) {
        this.regNo = regNo;
        this.wheels = wheels;
    }
}

class Truck extends Vehicle {
    double loadTonnes;

    Truck(String regNo, double loadTonnes) {
        super(regNo, 6);
        this.loadTonnes = loadTonnes;
    }

    void show() {
        System.out.println(regNo + ", " + wheels + " wheels, " + loadTonnes + " t");
    }
}

public class Main {
    public static void main(String[] args) {
        new Truck("GJ01AB1234", 12.5).show();
    }
}`,
    },
    {
      id: "c9t2p2", title: "Reuse with super.method()",
      task: "<p><code>Product</code> has <code>name</code>, <code>price</code> and <code>String details()</code>. <code>Electronics extends Product</code> adds <code>warrantyYears</code> and overrides <code>details()</code> by calling <code>super.details()</code> and adding the warranty.</p>",
      expected: "Product: Headphones, Rs.2499.0\nProduct: Headphones, Rs.2499.0 | Warranty: 2 years",
      mustUse: ["super.details()", "super(name, price)"],
      hints: ["<code>return super.details() + \" | Warranty: \" + warrantyYears + \" years\";</code>"],
      solution: J`class Product {
    String name;
    double price;

    Product(String name, double price) {
        this.name = name;
        this.price = price;
    }

    String details() {
        return "Product: " + name + ", Rs." + price;
    }
}

class Electronics extends Product {
    int warrantyYears;

    Electronics(String name, double price, int warrantyYears) {
        super(name, price);
        this.warrantyYears = warrantyYears;
    }

    @Override
    String details() {
        return super.details() + " | Warranty: " + warrantyYears + " years";
    }
}

public class Main {
    public static void main(String[] args) {
        Electronics e = new Electronics("Headphones", 2499, 2);
        System.out.println(new Product("Headphones", 2499).details());
        System.out.println(e.details());
    }
}`,
    },
    {
      id: "c9t2p3", title: "Build the full chain",
      task: "<p>Create <code>Person(String name)</code>, <code>Student extends Person</code> with <code>Student(String name)</code> → delegates with <code>this(name, \"General\")</code>, and <code>Student(String name, String course)</code> → calls <code>super(name)</code>. Each constructor prints a line. Create one student with one argument.</p>",
      expected: "Person: Rhea\nStudent(name, course): General\nStudent(name)",
      mustUse: ["this(name, \"General\")", "super(name)"],
      hints: ["Order: the call goes Student(name) → Student(name, course) → Person(name); bodies print in reverse."],
      solution: J`class Person {
    String name;

    Person(String name) {
        this.name = name;
        System.out.println("Person: " + name);
    }
}

class Student extends Person {
    String course;

    Student(String name) {
        this(name, "General");
        System.out.println("Student(name)");
    }

    Student(String name, String course) {
        super(name);
        this.course = course;
        System.out.println("Student(name, course): " + course);
    }
}

public class Main {
    public static void main(String[] args) {
        new Student("Rhea");
    }
}`,
    },
  ],

  fill: [
    { id: "c9t2f1", prompt: "Call the parent's 2-argument constructor.", template: "Child(int a, int b) {\n    ___(a, b);\n}", answers: [["super"]], explain: "super(...) must be the first statement." },
    { id: "c9t2f2", prompt: "Call the parent's version of an overridden method.", template: "return ___.area() * 2;", answers: [["super"]], explain: "super.method()." },
  ],

  quiz: [
    { type: "output", q: "Predict the output.", code: J`class A { A() { System.out.print("A"); } A(int x) { System.out.print("a" + x); } }
class B extends A { B() { super(5); System.out.print("B"); } B(int x) { System.out.print("b"); } }
public class Q {
    public static void main(String[] args) {
        new B(); System.out.print(" "); new B(1);
    }
}`, answer: "a5B Ab", explain: "B(int) has an implicit super(), which calls A()." },
    { type: "mcq", q: "Parent has only <code>Parent(int x)</code>. Child has <code>Child() { }</code>. Result?", options: ["compiles", "compile error", "runtime error", "x = 0"], answer: 1, explain: "The implicit super() finds no no-arg constructor." },
    { type: "mcq", q: "Can one constructor contain both this(...) and super(...)?", options: ["Yes, in any order", "Yes, super first", "No", "Only in abstract classes"], answer: 2, explain: "Both must be first — only one is allowed." },
    { type: "mcq", q: "In which order do constructor bodies finish for <code>new C()</code> (C extends B extends A)?", options: ["C, B, A", "A, B, C", "B, A, C", "Only C"], answer: 1, explain: "Parents finish first." },
  ],
};
