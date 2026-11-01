const J = String.raw;

export default {
  title: "this keyword & constructor chaining",
  summary: "Use this to refer to the current object, resolve name clashes, return the object for method chaining, and call one constructor from another with this().",

  concept: J`
<h2>Concept</h2>
<p>Inside an instance method or constructor, <code>this</code> is a reference to the <b>current object</b> — the object the method was called on (or that is being constructed).</p>

<h3>Use 1: separate a field from a parameter with the same name</h3>
<pre class="java">class Student {
    String name;
    Student(String name) {
        name = name;          // ✗ assigns the parameter to itself — field stays null
        this.name = name;     // ✓ field = parameter
    }
}</pre>
<p>When a local variable or parameter has the same name as a field, the local one <b>shadows</b> the field. <code>this.name</code> always means the field.</p>

<h3>Use 2: constructor chaining with this(…)</h3>
<p>One constructor can call another constructor of the <b>same class</b> using <code>this(arguments)</code>. Put the real initialisation in one "main" constructor and let the others delegate to it — no duplicated code.</p>
<pre class="java">class Product {
    String name; double price; int qty;

    Product() {
        this("Unknown");               // → Product(String)
    }
    Product(String name) {
        this(name, 0.0, 1);            // → Product(String, double, int)
    }
    Product(String name, double price, int qty) {
        this.name = name;              // the one place that does the work
        this.price = price;
        this.qty = qty;
    }
}</pre>
<p><b>Rules for this():</b></p>
<ul>
<li>It must be the <b>first statement</b> in the constructor.</li>
<li>Only one <code>this()</code> call per constructor (and you can't use both <code>this()</code> and <code>super()</code> in the same constructor — both want to be first).</li>
<li>Only allowed <b>inside a constructor</b>, not in methods.</li>
<li>No cycles: if A calls B and B calls A → <code>error: recursive constructor invocation</code>.</li>
</ul>
<p>The chain runs from the most specific constructor first: <code>new Product()</code> → Product() calls Product(String) calls Product(String,double,int); the 3-arg body runs, then control returns to Product(String)'s remaining statements, then Product()'s.</p>

<h3>Use 3: pass or return the current object</h3>
<pre class="java">class Counter {
    int count;
    Counter inc() { count++; return this; }   // return the same object
}
new Counter().inc().inc().inc();   // method chaining → count = 3</pre>
<p>You can also pass <code>this</code> as an argument: <code>register(this)</code>.</p>

<h3>Use 4: call another method of the same object</h3>
<p><code>this.display()</code> — usually just written <code>display()</code>.</p>

<div class="warn"><code>this</code> cannot be used inside a <code>static</code> method — a static method belongs to the class, not to any object.</div>
`,

  samples: [
    {
      title: "Shadowing bug and fix",
      code: J`class Wrong {
    String city;
    Wrong(String city) {
        city = city;
    }
}

class Right {
    String city;
    Right(String city) {
        this.city = city;
    }
}

public class Main {
    public static void main(String[] args) {
        System.out.println(new Wrong("Mumbai").city);
        System.out.println(new Right("Mumbai").city);
    }
}`,
      output: "null\nMumbai",
    },
    {
      title: "Constructor chaining — watch the order",
      code: J`class Laptop {
    String brand;
    int ram;
    int storage;

    Laptop() {
        this("Generic");
        System.out.println("3. Laptop() finished");
    }

    Laptop(String brand) {
        this(brand, 8, 512);
        System.out.println("2. Laptop(String) finished");
    }

    Laptop(String brand, int ram, int storage) {
        this.brand = brand;
        this.ram = ram;
        this.storage = storage;
        System.out.println("1. Laptop(String, int, int) finished");
    }
}

public class Main {
    public static void main(String[] args) {
        Laptop l = new Laptop();
        System.out.println(l.brand + " " + l.ram + "GB " + l.storage + "GB");
    }
}`,
      output: "1. Laptop(String, int, int) finished\n2. Laptop(String) finished\n3. Laptop() finished\nGeneric 8GB 512GB",
    },
    {
      title: "Returning this for method chaining",
      code: J`class Order {
    StringBuilder items = new StringBuilder();
    double total;

    Order add(String item, double price) {
        items.append(item).append(" ");
        total += price;
        return this;
    }
}

public class Main {
    public static void main(String[] args) {
        Order o = new Order().add("Dosa", 80).add("Coffee", 30).add("Vada", 40);
        System.out.println(o.items.toString().trim() + " = " + o.total);
    }
}`,
      output: "Dosa Coffee Vada = 150.0",
    },
  ],

  practice: [
    {
      id: "c7t3p1", title: "Use this correctly",
      task: "<p>Create class <code>Book</code> with fields <code>title</code>, <code>author</code>, <code>price</code>. Its constructor parameters must have the <b>same names</b> as the fields; use <code>this</code> to assign them. Print one book.</p>",
      expected: "The Guide | R. K. Narayan | 299.0",
      mustUse: ["this.title = title", "this.author = author", "this.price = price"],
      hints: ["<code>Book(String title, String author, double price) { this.title = title; … }</code>"],
      solution: J`class Book {
    String title;
    String author;
    double price;

    Book(String title, String author, double price) {
        this.title = title;
        this.author = author;
        this.price = price;
    }

    void show() {
        System.out.println(title + " | " + author + " | " + price);
    }
}

public class Main {
    public static void main(String[] args) {
        new Book("The Guide", "R. K. Narayan", 299).show();
    }
}`,
    },
    {
      id: "c7t3p2", title: "Chain the constructors",
      task: "<p>Class <code>Pizza</code> has <code>size</code>, <code>crust</code>, <code>toppings</code>. Write three constructors: <code>Pizza()</code> → \"Medium\", \"Thin\", 1; <code>Pizza(String size)</code> → crust \"Thin\", 1 topping; <code>Pizza(String size, String crust, int toppings)</code>. The first two must use <code>this(...)</code>; only the third assigns fields.</p>",
      expected: "Medium Thin 1\nLarge Thin 1\nSmall Cheese-burst 3",
      mustUse: ["this(\"Medium\")", "this(size, \"Thin\", 1)"],
      hints: ["<code>Pizza() { this(\"Medium\"); }</code>", "<code>Pizza(String size) { this(size, \"Thin\", 1); }</code>"],
      solution: J`class Pizza {
    String size;
    String crust;
    int toppings;

    Pizza() {
        this("Medium");
    }

    Pizza(String size) {
        this(size, "Thin", 1);
    }

    Pizza(String size, String crust, int toppings) {
        this.size = size;
        this.crust = crust;
        this.toppings = toppings;
    }

    void show() {
        System.out.println(size + " " + crust + " " + toppings);
    }
}

public class Main {
    public static void main(String[] args) {
        new Pizza().show();
        new Pizza("Large").show();
        new Pizza("Small", "Cheese-burst", 3).show();
    }
}`,
    },
    {
      id: "c7t3p3", title: "Fluent calculator",
      task: "<p>Write class <code>Calc</code> with a field <code>value</code> and methods <code>add</code>, <code>sub</code>, <code>mul</code>, each returning <code>this</code>. Compute ((10 + 5) × 4) − 7 in one chained statement starting from <code>new Calc(10)</code>.</p>",
      expected: "Result: 53",
      mustUse: ["return this"],
      hints: ["<code>Calc add(int n) { value += n; return this; }</code>", "<code>new Calc(10).add(5).mul(4).sub(7).value</code>"],
      solution: J`class Calc {
    int value;

    Calc(int value) {
        this.value = value;
    }

    Calc add(int n) { value += n; return this; }
    Calc sub(int n) { value -= n; return this; }
    Calc mul(int n) { value *= n; return this; }
}

public class Main {
    public static void main(String[] args) {
        int r = new Calc(10).add(5).mul(4).sub(7).value;
        System.out.println("Result: " + r);
    }
}`,
    },
    {
      id: "c7t3p4", title: "Fix the chaining errors",
      task: "<p>This code has two constructor-chaining mistakes. Fix them so it compiles and prints the expected output.</p>",
      starter: J`class Box {
    int l, w, h;

    Box() {
        System.out.println("Cube by default");
        this(1);
    }

    Box(int side) {
        this(side, side, side);
    }

    Box(int l, int w, int h) {
        this.l = l; this.w = w; this.h = h;
    }

    int volume() {
        this(2, 2, 2);
        return l * w * h;
    }
}

public class Main {
    public static void main(String[] args) {
        System.out.println(new Box().volume());
        System.out.println(new Box(3).volume());
    }
}`,
      expected: "Cube by default\n1\n27",
      hints: ["this() must be the FIRST statement in a constructor — move the println after it.", "this() is not allowed inside a method — remove it from volume()."],
      solution: J`class Box {
    int l, w, h;

    Box() {
        this(1);
        System.out.println("Cube by default");
    }

    Box(int side) {
        this(side, side, side);
    }

    Box(int l, int w, int h) {
        this.l = l; this.w = w; this.h = h;
    }

    int volume() {
        return l * w * h;
    }
}

public class Main {
    public static void main(String[] args) {
        System.out.println(new Box().volume());
        System.out.println(new Box(3).volume());
    }
}`,
    },
  ],

  fill: [
    { id: "c7t3f1", prompt: "Assign the parameter to the field with the same name.", template: "___.speed = speed;", answers: [["this"]], explain: "this.speed is the field." },
    { id: "c7t3f2", prompt: "Call the 2-argument constructor of the same class.", template: "Rect() {\n    ___(1, 1);\n}", answers: [["this"]], explain: "this(...) must be the first statement." },
  ],

  quiz: [
    { type: "output", q: "Predict the output.", code: J`class T {
    int x;
    T() { this(5); System.out.print("A"); }
    T(int x) { this.x = x; System.out.print("B"); }
}
public class Q {
    public static void main(String[] args) {
        T t = new T();
        System.out.println(t.x);
    }
}`, answer: "BA5", explain: "T() calls T(int) first; its body prints B, then T() prints A." },
    { type: "mcq", q: "Where must <code>this(...)</code> appear?", options: ["anywhere in a method", "first statement of a constructor", "last statement of a constructor", "in static methods"], answer: 1, explain: "It must be the very first statement of a constructor." },
    { type: "mcq", q: "Can <code>this</code> be used in a static method?", options: ["Yes", "No", "Only in main", "Only with fields"], answer: 1, explain: "There is no current object in a static context." },
    { type: "output", q: "Predict the output.", code: J`class N {
    int v;
    N(int v) { v = v; }
}
public class Q {
    public static void main(String[] args) {
        System.out.println(new N(7).v);
    }
}`, answer: "0", explain: "Without this, the parameter is assigned to itself; the field keeps its default 0." },
    { type: "mcq", q: "Constructor A() calls this(1) and A(int) calls this(). Result?", options: ["infinite loop at runtime", "compile error: recursive constructor invocation", "works", "StackOverflowError only if called"], answer: 1, explain: "The compiler detects constructor cycles." },
  ],
};
