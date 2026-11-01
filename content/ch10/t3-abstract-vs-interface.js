const J = String.raw;

export default {
  title: "Abstract class vs interface",
  summary: "Two tools for abstraction. Compare them point by point and learn when to choose each — often both together.",

  concept: J`
<h2>Concept</h2>
<table>
<tr><th></th><th>Abstract class</th><th>Interface</th></tr>
<tr><td>Keyword to use it</td><td><code>extends</code></td><td><code>implements</code></td></tr>
<tr><td>How many per class</td><td>only <b>one</b></td><td><b>many</b></td></tr>
<tr><td>Instance fields (state)</td><td>✓ any kind</td><td>✗ only <code>public static final</code> constants</td></tr>
<tr><td>Constructors</td><td>✓</td><td>✗</td></tr>
<tr><td>Method types</td><td>abstract and concrete, any access</td><td>abstract, default, static (Java 8), private (Java 9)</td></tr>
<tr><td>Default access of methods</td><td>package-private unless stated</td><td>public</td></tr>
<tr><td>Instance/static blocks</td><td>✓</td><td>✗</td></tr>
<tr><td>Relationship expressed</td><td><b>IS-A</b> — a shared identity and shared code</td><td><b>CAN-DO</b> — a capability (Comparable, Runnable, Payable)</td></tr>
<tr><td>Can extend</td><td>one class, many interfaces</td><td>many interfaces</td></tr>
</table>

<h3>When to choose which</h3>
<ul>
<li><b>Abstract class</b>: closely related classes that share <b>state and code</b> (all Accounts have a number and a balance and the same deposit logic).</li>
<li><b>Interface</b>: a <b>capability</b> that unrelated classes can have (a Document, a Photo and a Song can all be Printable / Shareable), or when a class needs several types.</li>
<li><b>Both</b>: define the contract as an interface, provide an abstract class with common code that implements it, and let concrete classes extend the abstract class. The Java libraries do this: <code>List</code> (interface) → <code>AbstractList</code> (abstract) → <code>ArrayList</code>.</li>
</ul>
<pre class="java">interface Account { void deposit(double a); double balance(); }

abstract class BaseAccount implements Account {   // shared state + code
    protected double balance;
    public void deposit(double a) { balance += a; }
    public double balance() { return balance; }
    abstract double interestRate();
}

class Savings extends BaseAccount { double interestRate() { return 3.5; } }</pre>
`,

  samples: [
    {
      title: "Interface + abstract class + concrete classes",
      code: J`interface Account {
    void deposit(double amount);
    double getBalance();
    String type();
}

abstract class BaseAccount implements Account {
    protected double balance;

    public void deposit(double amount) {
        balance += amount;
    }

    public double getBalance() {
        return balance;
    }

    abstract double interestRate();

    void addYearlyInterest() {
        balance += balance * interestRate() / 100;
    }
}

class Savings extends BaseAccount {
    double interestRate() { return 4; }
    public String type() { return "Savings"; }
}

class Fixed extends BaseAccount {
    double interestRate() { return 7; }
    public String type() { return "Fixed Deposit"; }
}

public class Main {
    public static void main(String[] args) {
        BaseAccount[] all = {new Savings(), new Fixed()};
        for (BaseAccount a : all) {
            a.deposit(10000);
            a.addYearlyInterest();
            System.out.println(a.type() + ": " + a.getBalance());
        }
    }
}`,
      output: "Savings: 10400.0\nFixed Deposit: 10700.0",
    },
  ],

  practice: [
    {
      id: "c10t3p1", title: "Capability across unrelated classes",
      task: "<p>Classes <code>Report</code> and <code>Photo</code> are unrelated, but both can be printed. Create interface <code>Printable</code> with <code>String printText()</code> and a static method <code>printAll(Printable... items)</code> that prints each one.</p>",
      expected: "[Report] Quarterly sales\n[Photo] beach.jpg 1920x1080",
      mustUse: ["interface Printable", "Printable... items"],
      hints: ["<code>static void printAll(Printable... items) { for (Printable p : items) System.out.println(p.printText()); }</code>"],
      solution: J`interface Printable {
    String printText();

    static void printAll(Printable... items) {
        for (Printable p : items) System.out.println(p.printText());
    }
}

class Report implements Printable {
    String title;
    Report(String title) { this.title = title; }
    public String printText() { return "[Report] " + title; }
}

class Photo implements Printable {
    String file; int w, h;
    Photo(String file, int w, int h) { this.file = file; this.w = w; this.h = h; }
    public String printText() { return "[Photo] " + file + " " + w + "x" + h; }
}

public class Main {
    public static void main(String[] args) {
        Printable.printAll(new Report("Quarterly sales"), new Photo("beach.jpg", 1920, 1080));
    }
}`,
    },
    {
      id: "c10t3p2", title: "Combine both",
      task: "<p>Interface <code>Ride</code> with <code>double fare(double km)</code> and <code>String name()</code>. Abstract class <code>BaseRide implements Ride</code> stores <code>baseFare</code> and <code>perKm</code> and implements <code>fare</code> as baseFare + perKm × km. <code>Auto</code> (30, 15) and <code>Cab</code> (50, 22) only set the numbers and the name. Print the fare for 8 km.</p>",
      expected: "Auto: 150.0\nCab: 226.0",
      mustUse: ["abstract class BaseRide implements Ride"],
      hints: ["BaseRide has a constructor <code>BaseRide(double baseFare, double perKm)</code>; subclasses call super(30, 15)."],
      solution: J`interface Ride {
    double fare(double km);
    String name();
}

abstract class BaseRide implements Ride {
    protected double baseFare, perKm;

    BaseRide(double baseFare, double perKm) {
        this.baseFare = baseFare;
        this.perKm = perKm;
    }

    public double fare(double km) {
        return baseFare + perKm * km;
    }
}

class Auto extends BaseRide {
    Auto() { super(30, 15); }
    public String name() { return "Auto"; }
}

class Cab extends BaseRide {
    Cab() { super(50, 22); }
    public String name() { return "Cab"; }
}

public class Main {
    public static void main(String[] args) {
        Ride[] rides = {new Auto(), new Cab()};
        for (Ride r : rides) System.out.println(r.name() + ": " + r.fare(8));
    }
}`,
    },
  ],

  fill: [
    { id: "c10t3f1", prompt: "Which can have constructors and instance fields?", template: "___ class", answers: [["abstract"]], explain: "Interfaces can't have either." },
  ],

  quiz: [
    { type: "mcq", q: "A class needs code from two parents that each hold state. Best approach?", options: ["extend both", "make both interfaces with default methods holding state", "extend one, compose (have a field of) the other", "impossible"], answer: 2, explain: "Single class inheritance + composition." },
    { type: "mcq", q: "Which expresses a CAN-DO capability?", options: ["abstract class Animal", "interface Comparable", "class Object", "final class String"], answer: 1, explain: "Comparable = can be compared." },
    { type: "mcq", q: "Interface methods without a modifier are…", options: ["package-private", "protected", "public", "private"], answer: 2, explain: "Always public." },
    { type: "mcq", q: "Which is true for BOTH abstract classes and interfaces?", options: ["can have constructors", "can't be instantiated with new", "can have instance fields", "support multiple inheritance"], answer: 1, explain: "Neither can be instantiated directly." },
  ],
};
