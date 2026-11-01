const J = String.raw;

export default {
  title: "Variable types & scope",
  summary: "Local, instance and static variables — where each lives, how long it lives, its default value, and where it can be used.",

  concept: J`
<h2>Concept</h2>
<p>Java has three kinds of variables, depending on <b>where they are declared</b>:</p>
<table>
<tr><th></th><th>Local variable</th><th>Instance variable</th><th>Static (class) variable</th></tr>
<tr><td>Declared</td><td>inside a method, constructor or block (including parameters)</td><td>inside the class, outside methods, <b>without</b> static</td><td>inside the class, outside methods, <b>with</b> static</td></tr>
<tr><td>Copies</td><td>a new one for each method call</td><td>one per object</td><td>one per class</td></tr>
<tr><td>Memory</td><td>stack (in the method's frame)</td><td>heap (inside the object)</td><td>method area (with the class data)</td></tr>
<tr><td>Created / destroyed</td><td>when the block runs / when it ends</td><td>with the object / when the object is garbage-collected</td><td>when the class loads / when the program ends</td></tr>
<tr><td>Default value</td><td><b>none</b> — must assign before use</td><td>yes (0, false, null…)</td><td>yes</td></tr>
<tr><td>Access modifiers</td><td>not allowed (only <code>final</code>)</td><td>allowed</td><td>allowed</td></tr>
<tr><td>Accessed by</td><td>its name, inside its scope</td><td><code>object.name</code> / <code>this.name</code></td><td><code>ClassName.name</code></td></tr>
</table>

<h3>Scope — where a name can be used</h3>
<p>A local variable is visible from its declaration to the end of the <b>block</b> <code>{ }</code> it's declared in.</p>
<pre class="java">void demo() {
    int a = 1;
    if (a &gt; 0) {
        int b = 2;               // b exists only inside this if-block
    }
    System.out.println(b);       // ✗ cannot find symbol
    for (int i = 0; i &lt; 3; i++) { }
    System.out.println(i);       // ✗ i only existed in the loop
}</pre>
<ul>
<li>You can't declare a local variable with the same name as another local still in scope: <code>int a = 1; { int a = 2; }</code> → error.</li>
<li>A local variable <b>can</b> have the same name as a field — it then <b>shadows</b> the field (use <code>this.name</code> to reach the field).</li>
</ul>

<h3>Effectively final</h3>
<p>A local variable that is never changed after it's assigned is "effectively final". Lambdas and inner classes can use only such locals (Interfaces chapter).</p>

<h3>Other names you'll hear</h3>
<ul>
<li><b>Parameters</b> — local variables that receive the arguments.</li>
<li><b>Fields / member variables / attributes</b> — instance and static variables together.</li>
<li><b>Reference variables</b> — any variable whose type is a class, array or interface.</li>
</ul>
`,

  samples: [
    {
      title: "All three kinds",
      code: J`class Visitor {
    static int totalVisitors = 0;     // static variable
    String name;                      // instance variable

    Visitor(String name) {            // name (parameter) is local
        this.name = name;
        totalVisitors++;
    }

    void greet(int hour) {            // hour is local
        String msg = hour < 12 ? "Good morning" : "Good evening";   // local
        System.out.println(msg + ", " + name + " (#" + totalVisitors + ")");
    }
}

public class Main {
    public static void main(String[] args) {
        new Visitor("Ira").greet(9);
        new Visitor("Om").greet(19);
    }
}`,
      output: "Good morning, Ira (#1)\nGood evening, Om (#2)",
    },
    {
      title: "Shadowing a field",
      code: J`public class Main {
    static int x = 100;
    int y = 5;

    void show() {
        int y = 50;
        System.out.println(y + " " + this.y);
    }

    public static void main(String[] args) {
        int x = 1;
        System.out.println(x + " " + Main.x);
        new Main().show();
    }
}`,
      output: "1 100\n50 5",
    },
    {
      title: "Each call gets fresh locals",
      code: J`public class Main {
    static int calls = 0;

    static void tick() {
        int local = 0;
        local++;
        calls++;
        System.out.println("local = " + local + ", calls = " + calls);
    }

    public static void main(String[] args) {
        tick();
        tick();
        tick();
    }
}`,
      output: "local = 1, calls = 1\nlocal = 1, calls = 2\nlocal = 1, calls = 3",
    },
  ],

  practice: [
    {
      id: "c7t5p1", title: "Fix the scope errors",
      task: "<p>This program uses two variables outside their scope. Move the declarations (don't change the logic) so it compiles and prints the expected output.</p>",
      starter: J`public class Main {
    public static void main(String[] args) {
        int[] marks = {45, 82, 67, 91};
        for (int i = 0; i < marks.length; i++) {
            int highest = 0;
            if (marks[i] > highest) highest = marks[i];
        }
        System.out.println("Highest: " + highest);
        System.out.println("Checked " + i + " marks");
    }
}`,
      expected: "Highest: 91\nChecked 4 marks",
      hints: ["Declare <code>highest</code> before the loop (otherwise it is reset every iteration too!).", "Declare <code>int i;</code> before the loop and write <code>for (i = 0; …)</code>."],
      solution: J`public class Main {
    public static void main(String[] args) {
        int[] marks = {45, 82, 67, 91};
        int highest = 0;
        int i;
        for (i = 0; i < marks.length; i++) {
            if (marks[i] > highest) highest = marks[i];
        }
        System.out.println("Highest: " + highest);
        System.out.println("Checked " + i + " marks");
    }
}`,
    },
    {
      id: "c7t5p2", title: "Label every variable",
      task: "<p>Write class <code>Library</code> with a static <code>booksIssued</code>, an instance <code>branch</code>, and a method <code>issue(String title)</code> that uses a local <code>String receipt</code>. Issue two books from \"Central\" and one from \"North\", printing the receipts and the total.</p>",
      expected: "Central issued Gitanjali (total 1)\nCentral issued Godaan (total 2)\nNorth issued Malgudi Days (total 3)",
      mustUse: ["static int booksIssued", "String receipt"],
      hints: ["<code>String receipt = branch + \" issued \" + title + \" (total \" + booksIssued + \")\";</code>"],
      solution: J`class Library {
    static int booksIssued = 0;
    String branch;

    Library(String branch) {
        this.branch = branch;
    }

    void issue(String title) {
        booksIssued++;
        String receipt = branch + " issued " + title + " (total " + booksIssued + ")";
        System.out.println(receipt);
    }
}

public class Main {
    public static void main(String[] args) {
        Library central = new Library("Central");
        Library north = new Library("North");
        central.issue("Gitanjali");
        central.issue("Godaan");
        north.issue("Malgudi Days");
    }
}`,
    },
  ],

  fill: [
    { id: "c7t5f1", prompt: "Which variable type has no default value?", template: "___ variables", answers: [["local", "Local"]], explain: "Locals must be assigned before use." },
    { id: "c7t5f2", prompt: "Where does each live?", template: "local → ___\ninstance → ___", answers: [["stack"], ["heap"]], explain: "Locals in the stack frame, instance fields inside the object on the heap." },
  ],

  quiz: [
    { type: "mcq", q: "Which modifier can a local variable have?", options: ["public", "static", "final", "private"], answer: 2, explain: "Only final is allowed on locals." },
    { type: "output", q: "Predict the output.", code: J`public class Q {
    static int n = 10;
    public static void main(String[] args) {
        int n = 3;
        n += Q.n;
        System.out.println(n + " " + Q.n);
    }
}`, answer: "13 10", explain: "The local n shadows the static field; Q.n reaches the field." },
    { type: "mcq", q: "How many copies of an instance variable exist if 5 objects are created?", options: ["1", "5", "0", "depends on the method"], answer: 1, explain: "One per object." },
    { type: "mcq", q: "<code>{ int a = 1; } { int a = 2; }</code> inside one method —", options: ["error: a already defined", "compiles: different blocks", "a becomes 2 everywhere", "runtime error"], answer: 1, explain: "The first a is out of scope when the second is declared." },
  ],
};
