const J = String.raw;

export default {
  title: "Blocks & order of initialization",
  summary: "Static blocks, instance blocks and constructors — and the exact order in which Java runs them when a class loads and an object is created.",

  concept: J`
<h2>Concept</h2>
<h3>1. Static initializer block</h3>
<pre class="java">static {
    // runs ONCE, when the class is loaded (before main, before any object)
}</pre>
<p>Use it for complex initialisation of static variables (loading settings, filling a lookup table).</p>

<h3>2. Instance initializer block</h3>
<pre class="java">{
    // runs EVERY time an object is created, before the constructor body
}</pre>
<p>Useful for code shared by all constructors. (The compiler actually copies it into every constructor, right after the <code>super()</code> call.)</p>

<h3>3. Constructor</h3>
<p>Runs after the instance blocks and field initialisers.</p>

<h3>4. Local block</h3>
<p>A plain <code>{ }</code> inside a method just limits the scope of variables.</p>

<h3>The order of execution</h3>
<p><b>When the class is loaded (once):</b></p>
<ol>
<li>Static variables get default values.</li>
<li>Static variable initialisers and static blocks run <b>top to bottom</b>, in the order they appear in the class.</li>
</ol>
<p><b>Every time <code>new</code> runs:</b></p>
<ol>
<li>Memory is allocated; instance fields get default values.</li>
<li>The constructor is called — its first step is <code>super()</code> (the parent class is initialised first; see the Inheritance chapter).</li>
<li>Instance variable initialisers and instance blocks run <b>top to bottom</b>, in the order they appear.</li>
<li>The rest of the constructor body runs.</li>
</ol>
<pre class="java">class Demo {
    static { System.out.println("1 static block"); }     // once
    { System.out.println("2 instance block"); }          // each object
    Demo() { System.out.println("3 constructor"); }      // each object
}
// new Demo(); new Demo();  →  1, 2, 3, 2, 3</pre>

<h3>Where does main fit?</h3>
<p>The JVM loads the class containing main first, so <b>its static blocks run before main's first line</b>.</p>

<h3>Rules</h3>
<ul>
<li>A class can have several static and instance blocks; they run in textual order.</li>
<li>Static blocks can use only static members. Instance blocks can use both.</li>
<li>A static block can't use <code>this</code> or <code>return</code>.</li>
<li>A block can't read a field declared <b>below</b> it by its simple name before it is assigned (illegal forward reference).</li>
</ul>
`,

  samples: [
    {
      title: "The complete order",
      code: J`class Demo {
    static int s = initStatic();
    int i = initInstance();

    static {
        System.out.println("static block");
    }

    {
        System.out.println("instance block");
    }

    Demo() {
        System.out.println("constructor");
    }

    static int initStatic() {
        System.out.println("static variable");
        return 1;
    }

    int initInstance() {
        System.out.println("instance variable");
        return 2;
    }
}

public class Main {
    static {
        System.out.println("Main's static block");
    }

    public static void main(String[] args) {
        System.out.println("main starts");
        new Demo();
        System.out.println("--- second object ---");
        new Demo();
    }
}`,
      output: "Main's static block\nmain starts\nstatic variable\nstatic block\ninstance variable\ninstance block\nconstructor\n--- second object ---\ninstance variable\ninstance block\nconstructor",
      explain: "Demo is loaded only when it is first used (the first new Demo()), so its static parts run after \"main starts\" — and only once.",
    },
    {
      title: "Instance block shared by constructors",
      code: J`class Session {
    long id;
    String user;
    static long nextId;

    static {
        nextId = 5000;
    }

    {
        id = nextId++;
    }

    Session() {
        user = "guest";
    }

    Session(String user) {
        this.user = user;
    }
}

public class Main {
    public static void main(String[] args) {
        Session a = new Session();
        Session b = new Session("meera");
        System.out.println(a.id + " " + a.user);
        System.out.println(b.id + " " + b.user);
    }
}`,
      output: "5000 guest\n5001 meera",
    },
  ],

  practice: [
    {
      id: "c7t6p1", title: "Predict and build the order",
      task: "<p>Write a class <code>Car</code> with a static block printing <code>Car class loaded</code>, an instance block printing <code>Preparing car</code>, and a constructor <code>Car(String model)</code> printing <code>Car ready: model</code>. Create two cars in main after printing <code>Factory open</code>.</p>",
      expected: "Factory open\nCar class loaded\nPreparing car\nCar ready: Nexon\nPreparing car\nCar ready: Creta",
      mustUse: ["static {"],
      hints: ["The static block runs only once, when Car is first used."],
      solution: J`class Car {
    static {
        System.out.println("Car class loaded");
    }

    {
        System.out.println("Preparing car");
    }

    Car(String model) {
        System.out.println("Car ready: " + model);
    }
}

public class Main {
    public static void main(String[] args) {
        System.out.println("Factory open");
        new Car("Nexon");
        new Car("Creta");
    }
}`,
    },
    {
      id: "c7t6p2", title: "Lookup table in a static block",
      task: "<p>Class <code>Squares</code> has <code>static int[] table = new int[11];</code> filled in a static block with squares of 0–10. A static method <code>get(int n)</code> returns <code>table[n]</code>. Print get(7) and get(10).</p>",
      expected: "49\n100",
      mustUse: ["static {", "static int get(int n)"],
      hints: ["<code>static { for (int i = 0; i <= 10; i++) table[i] = i * i; }</code>"],
      solution: J`class Squares {
    static int[] table = new int[11];

    static {
        for (int i = 0; i <= 10; i++) table[i] = i * i;
    }

    static int get(int n) {
        return table[n];
    }
}

public class Main {
    public static void main(String[] args) {
        System.out.println(Squares.get(7));
        System.out.println(Squares.get(10));
    }
}`,
    },
    {
      id: "c7t6p3", title: "Bank account numbers",
      task: "<p>Class <code>BankAccount</code>: a static block sets <code>static int nextNumber = 1001</code>; an instance block assigns <code>accountNo = nextNumber++</code>; constructors <code>BankAccount(String holder)</code> (balance 0) and <code>BankAccount(String holder, double opening)</code> chain using this(). Create 3 accounts.</p>",
      expected: "1001 Priya 0.0\n1002 Rahul 2500.0\n1003 Sana 0.0",
      mustUse: ["static {", "accountNo = nextNumber++", "this(holder, 0)"],
      hints: ["<code>BankAccount(String holder) { this(holder, 0); }</code>", "The instance block runs once per object, even with chaining."],
      solution: J`class BankAccount {
    static int nextNumber;
    int accountNo;
    String holder;
    double balance;

    static {
        nextNumber = 1001;
    }

    {
        accountNo = nextNumber++;
    }

    BankAccount(String holder) {
        this(holder, 0);
    }

    BankAccount(String holder, double opening) {
        this.holder = holder;
        this.balance = opening;
    }

    void show() {
        System.out.println(accountNo + " " + holder + " " + balance);
    }
}

public class Main {
    public static void main(String[] args) {
        new BankAccount("Priya").show();
        new BankAccount("Rahul", 2500).show();
        new BankAccount("Sana").show();
    }
}`,
      explain: "Even though BankAccount(String) calls this(...), the instance block runs only once per object — Java places it only in constructors that do not start with this().",
    },
  ],

  fill: [
    { id: "c7t6f1", prompt: "Write the keyword that starts a block run once at class loading.", template: "___ {\n    System.out.println(\"loaded\");\n}", answers: [["static"]], explain: "A static initializer block." },
    { id: "c7t6f2", prompt: "Order for each new object (after super()):", template: "instance blocks → ___ body", answers: [["constructor"]], explain: "Instance initialisers run before the rest of the constructor." },
  ],

  quiz: [
    { type: "output", q: "Predict the output.", code: J`class A {
    static { System.out.print("S"); }
    { System.out.print("I"); }
    A() { System.out.print("C"); }
}
public class Q {
    public static void main(String[] args) {
        new A(); new A();
    }
}`, answer: "SICIC", explain: "Static once, then instance + constructor for each object." },
    { type: "output", q: "Predict the output.", code: J`public class Q {
    static { System.out.print("1"); }
    public static void main(String[] args) {
        System.out.print("2");
    }
    static { System.out.print("3"); }
}`, answer: "132", explain: "All static blocks of the main class run before main, in textual order." },
    { type: "mcq", q: "How many times does a static block run if you create 10 objects?", options: ["0", "1", "10", "11"], answer: 1, explain: "Once per class load." },
    { type: "mcq", q: "Which can a static block NOT use?", options: ["static variables", "static methods", "this", "local variables"], answer: 2, explain: "There is no object." },
  ],
};
