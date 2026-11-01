const J = String.raw;

export default {
  title: "Inner, static nested & anonymous classes",
  summary: "Classes inside classes: member inner classes, static nested classes, local classes and anonymous classes — what each can access and when to use it.",

  concept: J`
<h2>Concept</h2>
<p>A class can be declared inside another class. This groups helper classes with the only class that uses them and gives them special access to the outer class.</p>
<table>
<tr><th>Kind</th><th>Declared</th><th>Needs an outer object?</th><th>Can access</th></tr>
<tr><td><b>Static nested class</b></td><td>inside the class, with <code>static</code></td><td>No</td><td>outer's static members (even private)</td></tr>
<tr><td><b>Inner (member) class</b></td><td>inside the class, no <code>static</code></td><td>Yes</td><td>all outer members, even private instance ones</td></tr>
<tr><td><b>Local class</b></td><td>inside a method</td><td>(if in an instance method)</td><td>outer members + <b>effectively final</b> local variables</td></tr>
<tr><td><b>Anonymous class</b></td><td>an expression: <code>new Type() { … }</code></td><td>(same as local)</td><td>same as local</td></tr>
</table>

<h3>Static nested class</h3>
<pre class="java">class University {
    static class Address { String city; }
}
University.Address a = new University.Address();   // no University object needed</pre>

<h3>Inner class</h3>
<pre class="java">class Bank {
    private double rate = 6.5;
    class Loan {                       // each Loan belongs to a Bank object
        double interest(double p) { return p * rate / 100; }   // uses outer's private field
    }
}
Bank sbi = new Bank();
Bank.Loan loan = sbi.new Loan();       // note the syntax: outerObject.new Inner()</pre>
<p>Inside the inner class, <code>Bank.this</code> refers to the outer object (useful when names clash).</p>

<h3>Anonymous class</h3>
<p>A class with no name, declared and instantiated in one expression — perfect for a one-off implementation of an interface or a subclass:</p>
<pre class="java">Greeting g = new Greeting() {          // implements interface Greeting
    @Override
    public String hello(String n) { return "Namaste, " + n; }
};</pre>
<ul>
<li>It can implement one interface <b>or</b> extend one class — not both.</li>
<li>It has no constructor (no name!), but can pass arguments to the parent constructor: <code>new Thread("worker") { … }</code>.</li>
<li>If the interface has exactly one abstract method, a <b>lambda</b> is usually shorter (next topic).</li>
</ul>

<h3>Effectively final</h3>
<p>Local and anonymous classes may read local variables of the enclosing method only if they are never changed after initialisation. Changing them → <code>error: local variables referenced from an inner class must be final or effectively final</code>.</p>
`,

  samples: [
    {
      title: "Static nested and inner class",
      code: J`class Bank {
    private String name;
    private double rate;
    private static int branches = 12;

    Bank(String name, double rate) {
        this.name = name;
        this.rate = rate;
    }

    static class Info {
        String summary() { return "Branches: " + branches; }
    }

    class Loan {
        double principal;
        Loan(double principal) { this.principal = principal; }
        String quote() {
            return name + " loan of " + principal + " -> interest " + principal * rate / 100;
        }
    }
}

public class Main {
    public static void main(String[] args) {
        System.out.println(new Bank.Info().summary());
        Bank sbi = new Bank("SBI", 8.5);
        Bank.Loan l = sbi.new Loan(200000);
        System.out.println(l.quote());
    }
}`,
      output: "Branches: 12\nSBI loan of 200000.0 -> interest 17000.0",
    },
    {
      title: "Anonymous classes",
      code: J`interface Greeting {
    String hello(String name);
}

abstract class Task {
    String label;
    Task(String label) { this.label = label; }
    abstract void run();
}

public class Main {
    public static void main(String[] args) {
        String prefix = "Namaste";
        Greeting g = new Greeting() {
            @Override
            public String hello(String name) {
                return prefix + ", " + name + "!";
            }
        };
        System.out.println(g.hello("Asha"));

        Task t = new Task("backup") {
            @Override
            void run() {
                System.out.println("Running " + label);
            }
        };
        t.run();
    }
}`,
      output: "Namaste, Asha!\nRunning backup",
      explain: "<code>prefix</code> is effectively final, so the anonymous class may use it.",
    },
  ],

  practice: [
    {
      id: "c10t4p1", title: "Inner class with outer access",
      task: "<p>Class <code>Course</code> has a private <code>title</code> and a private int <code>maxSeats</code>. Inner class <code>Enrollment</code> has a student name and a method <code>confirm(int seatNo)</code> that prints whether the seat is valid, using the outer class's private fields.</p>",
      expected: "Ria enrolled in Java Lab, seat 12 of 60\nSeat 75 invalid for Java Lab",
      mustUse: ["class Enrollment", ".new Enrollment("],
      hints: ["<code>Course.Enrollment e = c.new Enrollment(\"Ria\");</code>", "Inside Enrollment you can use title and maxSeats directly."],
      solution: J`class Course {
    private String title;
    private int maxSeats;

    Course(String title, int maxSeats) {
        this.title = title;
        this.maxSeats = maxSeats;
    }

    class Enrollment {
        String student;
        Enrollment(String student) { this.student = student; }

        void confirm(int seatNo) {
            if (seatNo >= 1 && seatNo <= maxSeats) {
                System.out.println(student + " enrolled in " + title + ", seat " + seatNo + " of " + maxSeats);
            } else {
                System.out.println("Seat " + seatNo + " invalid for " + title);
            }
        }
    }
}

public class Main {
    public static void main(String[] args) {
        Course c = new Course("Java Lab", 60);
        Course.Enrollment e = c.new Enrollment("Ria");
        e.confirm(12);
        e.confirm(75);
    }
}`,
    },
    {
      id: "c10t4p2", title: "Anonymous strategies",
      task: "<p>Interface <code>Operation</code> has <code>int apply(int a, int b)</code> and <code>String symbol()</code>. In main, create three <b>anonymous classes</b> for +, −, × and print each applied to 12 and 4.</p>",
      expected: "12 + 4 = 16\n12 - 4 = 8\n12 * 4 = 48",
      mustUse: ["new Operation()"],
      hints: ["<code>Operation add = new Operation() { public int apply(int a, int b) { return a + b; } public String symbol() { return \"+\"; } };</code>"],
      solution: J`interface Operation {
    int apply(int a, int b);
    String symbol();
}

public class Main {
    public static void main(String[] args) {
        Operation add = new Operation() {
            public int apply(int a, int b) { return a + b; }
            public String symbol() { return "+"; }
        };
        Operation sub = new Operation() {
            public int apply(int a, int b) { return a - b; }
            public String symbol() { return "-"; }
        };
        Operation mul = new Operation() {
            public int apply(int a, int b) { return a * b; }
            public String symbol() { return "*"; }
        };
        Operation[] ops = {add, sub, mul};
        for (Operation op : ops) {
            System.out.println("12 " + op.symbol() + " 4 = " + op.apply(12, 4));
        }
    }
}`,
    },
    {
      id: "c10t4p3", title: "Static nested builder",
      task: "<p>Class <code>Pizza</code> has a private constructor and a <b>static nested</b> class <code>Builder</code> with methods <code>size(String)</code>, <code>topping(String)</code> (each returning the Builder) and <code>build()</code>. Build one pizza with chained calls and print it.</p>",
      expected: "Large pizza with paneer, onion, capsicum",
      mustUse: ["static class Builder", "new Pizza.Builder()"],
      hints: ["Builder keeps a size and a StringBuilder of toppings; build() returns new Pizza(size, toppings).", "This is the Builder pattern — used widely in real Java libraries."],
      solution: J`class Pizza {
    private final String size;
    private final String toppings;

    private Pizza(String size, String toppings) {
        this.size = size;
        this.toppings = toppings;
    }

    @Override
    public String toString() {
        return size + " pizza with " + toppings;
    }

    static class Builder {
        private String size = "Medium";
        private StringBuilder toppings = new StringBuilder();

        Builder size(String s) {
            size = s;
            return this;
        }

        Builder topping(String t) {
            if (toppings.length() > 0) toppings.append(", ");
            toppings.append(t);
            return this;
        }

        Pizza build() {
            return new Pizza(size, toppings.toString());
        }
    }
}

public class Main {
    public static void main(String[] args) {
        Pizza p = new Pizza.Builder().size("Large").topping("paneer").topping("onion").topping("capsicum").build();
        System.out.println(p);
    }
}`,
    },
  ],

  fill: [
    { id: "c10t4f1", prompt: "Create an inner-class object from an outer object 'car'.", template: "Car.Engine e = car.___ Engine();", answers: [["new"]], explain: "outerObject.new Inner()." },
    { id: "c10t4f2", prompt: "A nested class that doesn't need an outer object is declared…", template: "___ class Helper { }", answers: [["static"]], explain: "A static nested class." },
  ],

  quiz: [
    { type: "mcq", q: "Which nested class can access the outer class's private instance fields directly?", options: ["static nested", "inner (member) class", "neither", "only anonymous"], answer: 1, explain: "An inner class is tied to an outer object." },
    { type: "mcq", q: "An anonymous class can…", options: ["have a constructor", "extend a class AND implement an interface", "implement exactly one interface or extend one class", "be reused by name"], answer: 2, explain: "One supertype, no name, no constructor." },
    { type: "mcq", q: "A local variable used inside an anonymous class must be…", options: ["static", "public", "effectively final", "an int"], answer: 2, explain: "It must not change after being initialised." },
    { type: "mcq", q: "How do you refer to the outer object from inside inner class Loan of Bank?", options: ["this", "super", "Bank.this", "outer"], answer: 2, explain: "OuterClass.this." },
  ],
};
