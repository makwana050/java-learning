const J = String.raw;

export default {
  title: "static vs instance members",
  summary: "Some data belongs to each object; some belongs to the whole class. Learn static variables, static methods, and what static code can and cannot access.",

  concept: J`
<h2>Concept</h2>
<h3>Instance members — one copy per object</h3>
<p>A field without <code>static</code> is an <b>instance variable</b>: every object gets its own copy. Two students each have their own <code>name</code>.</p>

<h3>Static members — one copy per class</h3>
<p>A field marked <code>static</code> is a <b>class variable</b>: there is exactly <b>one</b> copy, shared by all objects (and it exists even if no object is created). It's created when the class is loaded.</p>
<pre class="java">class Student {
    String name;                       // instance: each student has one
    static String college = "GEC";     // static: shared by all students
    static int count = 0;              // how many students were created

    Student(String name) {
        this.name = name;
        count++;                       // update the shared counter
    }
}</pre>
<div style="margin:1rem 0;font-family:var(--mono);font-size:.9rem;max-width:560px">
<div style="border:2px dashed #c2410c;padding:.5rem .8rem;border-radius:8px;background:#fff8f2;margin-bottom:.5rem">Class Student (method area): college = "GEC", count = 2</div>
<div style="display:flex;gap:.6rem"><div style="border:1px solid #888;padding:.5rem;border-radius:6px;background:#fff">s1: name = "Asha"</div><div style="border:1px solid #888;padding:.5rem;border-radius:6px;background:#fff">s2: name = "Ravi"</div></div>
</div>
<p>Access static members with the <b>class name</b>: <code>Student.count</code>, <code>Math.PI</code>, <code>Integer.MAX_VALUE</code>. (Using an object reference also compiles — <code>s1.count</code> — but it's misleading; avoid it.)</p>

<h3>Static methods</h3>
<p>A <code>static</code> method belongs to the class. It is called without an object: <code>Math.sqrt(16)</code>, <code>Student.getCount()</code>.</p>
<table>
<tr><th></th><th>Static method</th><th>Instance method</th></tr>
<tr><td>Called with</td><td><code>ClassName.method()</code></td><td><code>object.method()</code></td></tr>
<tr><td>Can use instance variables/methods directly?</td><td><b>No</b> (which object's would it use?)</td><td>Yes</td></tr>
<tr><td>Can use static variables/methods?</td><td>Yes</td><td>Yes</td></tr>
<tr><td>Can use <code>this</code> / <code>super</code>?</td><td>No</td><td>Yes</td></tr>
<tr><td>Typical use</td><td>utilities (Math), counters, factory methods, main</td><td>behaviour that depends on the object's state</td></tr>
</table>
<p>From a static method you <b>can</b> use instance members through an object reference: <code>s1.name</code>.</p>
<pre class="java">static void report() {
    System.out.println(count);   // ✓ static
    System.out.println(name);    // ✗ error: non-static variable name cannot be referenced from a static context
}</pre>

<h3>Why is main static?</h3>
<p>The JVM must call main before any object exists, so main can't need an object. That's also why calling a non-static method directly from main fails — create an object first, or make the method static.</p>

<h3>static final — constants</h3>
<p><code>static final double GST_RATE = 0.18;</code> → one shared value that can never change. Name constants in UPPER_SNAKE_CASE.</p>

<h3>Static and null references</h3>
<p>Because static members are resolved by the class, <code>Student s = null; s.count</code> doesn't throw NullPointerException — it reads Student.count. (A classic trick question.)</p>
`,

  samples: [
    {
      title: "Shared counter",
      code: J`class Student {
    String name;
    static String college = "GEC";
    static int count = 0;

    Student(String name) {
        this.name = name;
        count++;
    }

    void show() {
        System.out.println(name + " studies at " + college);
    }
}

public class Main {
    public static void main(String[] args) {
        System.out.println("Before: " + Student.count);
        Student a = new Student("Asha");
        Student b = new Student("Ravi");
        Student.college = "GEC Gandhinagar";
        a.show();
        b.show();
        System.out.println("After: " + Student.count);
    }
}`,
      output: "Before: 0\nAsha studies at GEC Gandhinagar\nRavi studies at GEC Gandhinagar\nAfter: 2",
      explain: "Changing the static field once changes it for every object.",
    },
    {
      title: "Static utility methods",
      code: J`class MathUtil {
    static final double PI = 3.14159;

    static int cube(int n) {
        return n * n * n;
    }

    static boolean isPerfect(int n) {
        int sum = 0;
        for (int i = 1; i < n; i++) if (n % i == 0) sum += i;
        return sum == n;
    }
}

public class Main {
    public static void main(String[] args) {
        System.out.println(MathUtil.cube(4));
        System.out.println(MathUtil.isPerfect(28));
        System.out.println(MathUtil.PI * 2);
    }
}`,
      output: "64\ntrue\n6.28318",
    },
    {
      title: "Static via a null reference",
      code: J`class Server {
    static String status = "ONLINE";
    String name = "alpha";
}

public class Main {
    public static void main(String[] args) {
        Server s = null;
        System.out.println(s.status);
        try {
            System.out.println(s.name);
        } catch (NullPointerException e) {
            System.out.println("NPE for the instance field");
        }
    }
}`,
      output: "ONLINE\nNPE for the instance field",
    },
  ],

  practice: [
    {
      id: "c7t4p1", title: "Game server",
      task: "<p>Class <code>GamePlayer</code> has instance fields <code>username</code>, <code>score</code> and static fields <code>playersOnline</code> and <code>highScore</code>. The constructor increments playersOnline. <code>addPoints(int p)</code> adds to score and updates highScore if beaten. A static method <code>serverStatus()</code> prints the static data. Run the scenario in main.</p>",
      starter: J`class GamePlayer {
    // fields, constructor, addPoints, static serverStatus
}

public class Main {
    public static void main(String[] args) {
        GamePlayer a = new GamePlayer("ninja");
        GamePlayer b = new GamePlayer("rocket");
        a.addPoints(120);
        b.addPoints(90);
        b.addPoints(70);
        GamePlayer.serverStatus();
        System.out.println(a.username + ": " + a.score + ", " + b.username + ": " + b.score);
    }
}`,
      expected: "Online: 2, high score: 160\nninja: 120, rocket: 160",
      mustUse: ["static int playersOnline", "static int highScore", "static void serverStatus()"],
      hints: ["<code>void addPoints(int p) { score += p; if (score > highScore) highScore = score; }</code>", "serverStatus can use only static fields."],
      solution: J`class GamePlayer {
    String username;
    int score;
    static int playersOnline = 0;
    static int highScore = 0;

    GamePlayer(String username) {
        this.username = username;
        playersOnline++;
    }

    void addPoints(int p) {
        score += p;
        if (score > highScore) highScore = score;
    }

    static void serverStatus() {
        System.out.println("Online: " + playersOnline + ", high score: " + highScore);
    }
}

public class Main {
    public static void main(String[] args) {
        GamePlayer a = new GamePlayer("ninja");
        GamePlayer b = new GamePlayer("rocket");
        a.addPoints(120);
        b.addPoints(90);
        b.addPoints(70);
        GamePlayer.serverStatus();
        System.out.println(a.username + ": " + a.score + ", " + b.username + ": " + b.score);
    }
}`,
    },
    {
      id: "c7t4p2", title: "Fix the static context errors",
      task: "<p>The program doesn't compile: main (static) tries to use an instance variable and an instance method directly. Fix it by creating an object in main — don't add <code>static</code> to them.</p>",
      starter: J`public class Main {
    int visits = 0;

    void visit() {
        visits++;
    }

    public static void main(String[] args) {
        visit();
        visit();
        System.out.println("Visits: " + visits);
    }
}`,
      expected: "Visits: 2",
      mustUse: ["new Main()"],
      hints: ["<code>Main m = new Main(); m.visit(); … m.visits</code>"],
      solution: J`public class Main {
    int visits = 0;

    void visit() {
        visits++;
    }

    public static void main(String[] args) {
        Main m = new Main();
        m.visit();
        m.visit();
        System.out.println("Visits: " + m.visits);
    }
}`,
    },
    {
      id: "c7t4p3", title: "Smart home power meter",
      task: "<p>Class <code>Appliance</code> has <code>name</code>, <code>watts</code>, <code>on</code>, and a static <code>totalWatts</code>. <code>turnOn()</code> adds its watts to the total (only if it was off); <code>turnOff()</code> subtracts (only if it was on). Run: fan (75 W) on, AC (1500 W) on, fan on again, AC off, heater (2000 W) on.</p>",
      starter: J`class Appliance {
}

public class Main {
    public static void main(String[] args) {
        Appliance fan = new Appliance("Fan", 75);
        Appliance ac = new Appliance("AC", 1500);
        Appliance heater = new Appliance("Heater", 2000);
        fan.turnOn();
        ac.turnOn();
        fan.turnOn();
        ac.turnOff();
        heater.turnOn();
        System.out.println("Total load: " + Appliance.totalWatts + " W");
    }
}`,
      expected: "Fan ON (load 75 W)\nAC ON (load 1575 W)\nFan is already ON\nAC OFF (load 75 W)\nHeater ON (load 2075 W)\nTotal load: 2075 W",
      mustUse: ["static int totalWatts"],
      hints: ["turnOn: <code>if (on) { print already; return; } on = true; totalWatts += watts; print</code>"],
      solution: J`class Appliance {
    String name;
    int watts;
    boolean on;
    static int totalWatts = 0;

    Appliance(String name, int watts) {
        this.name = name;
        this.watts = watts;
    }

    void turnOn() {
        if (on) {
            System.out.println(name + " is already ON");
            return;
        }
        on = true;
        totalWatts += watts;
        System.out.println(name + " ON (load " + totalWatts + " W)");
    }

    void turnOff() {
        if (!on) {
            System.out.println(name + " is already OFF");
            return;
        }
        on = false;
        totalWatts -= watts;
        System.out.println(name + " OFF (load " + totalWatts + " W)");
    }
}

public class Main {
    public static void main(String[] args) {
        Appliance fan = new Appliance("Fan", 75);
        Appliance ac = new Appliance("AC", 1500);
        Appliance heater = new Appliance("Heater", 2000);
        fan.turnOn();
        ac.turnOn();
        fan.turnOn();
        ac.turnOff();
        heater.turnOn();
        System.out.println("Total load: " + Appliance.totalWatts + " W");
    }
}`,
    },
    {
      id: "c7t4p4", title: "Static factory and ID generator",
      task: "<p>Class <code>Invoice</code> has a <b>private</b> constructor and a static method <code>Invoice create(double amount)</code> that assigns ids \"INV-1\", \"INV-2\"… from a static counter. Create three invoices and print them.</p>",
      expected: "INV-1: 1200.0\nINV-2: 350.5\nINV-3: 99.0\nInvoices created: 3",
      mustUse: ["private Invoice(", "static Invoice create(double amount)"],
      hints: ["<code>static Invoice create(double amount) { counter++; return new Invoice(\"INV-\" + counter, amount); }</code>"],
      solution: J`class Invoice {
    private static int counter = 0;
    String id;
    double amount;

    private Invoice(String id, double amount) {
        this.id = id;
        this.amount = amount;
    }

    static Invoice create(double amount) {
        counter++;
        return new Invoice("INV-" + counter, amount);
    }

    static int count() {
        return counter;
    }
}

public class Main {
    public static void main(String[] args) {
        Invoice[] list = {Invoice.create(1200), Invoice.create(350.5), Invoice.create(99)};
        for (Invoice i : list) System.out.println(i.id + ": " + i.amount);
        System.out.println("Invoices created: " + Invoice.count());
    }
}`,
    },
  ],

  fill: [
    { id: "c7t4f1", prompt: "Declare a shared constant for the tax rate.", template: "___ ___ double TAX = 0.18;", answers: [["static"], ["final"]], explain: "static = one copy, final = cannot change." },
    { id: "c7t4f2", prompt: "Call a static method correctly.", template: "int c = ___.getCount();", answers: [["Student"]], explain: "Use the class name." },
  ],

  quiz: [
    { type: "output", q: "Predict the output.", code: J`class C {
    static int s = 0;
    int i = 0;
    C() { s++; i++; }
}
public class Q {
    public static void main(String[] args) {
        C a = new C(); C b = new C(); C c = new C();
        System.out.println(C.s + " " + c.i);
    }
}`, answer: "3 1", explain: "s is shared; i belongs to each object." },
    { type: "mcq", q: "Which can a static method access directly?", options: ["instance variables", "this", "static variables", "super"], answer: 2, explain: "Only static members (or instance members through an object)." },
    { type: "mcq", q: "When is a static variable created?", options: ["each time an object is created", "when the class is loaded", "when main ends", "when first printed"], answer: 1, explain: "Once, at class loading." },
    { type: "output", q: "Predict the output.", code: J`class K {
    static int n = 10;
}
public class Q {
    public static void main(String[] args) {
        K x = new K(), y = new K();
        x.n = 20;
        y.n++;
        System.out.println(K.n);
    }
}`, answer: "21", explain: "x.n and y.n are both K.n." },
  ],
};
