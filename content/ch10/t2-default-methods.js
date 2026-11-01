const J = String.raw;

export default {
  title: "Default & static methods, multiple interfaces",
  summary: "Interfaces with code: default and static methods, how the diamond problem is resolved, and the rules when two interfaces clash.",

  concept: J`
<h2>Concept</h2>
<h3>default methods (Java 8)</h3>
<p>A <code>default</code> method has a body inside the interface. Every implementing class gets it for free and <b>may</b> override it.</p>
<pre class="java">interface Greeter {
    String name();
    default String greet() {             // inherited by all implementers
        return "Hello, " + name() + "!";
    }
}</pre>
<p>Why? To add new methods to an existing interface without breaking every class that already implements it. (This is how Java 8 added <code>forEach</code> to <code>Iterable</code> and <code>sort</code> to <code>List</code>.)</p>

<h3>static methods (Java 8)</h3>
<p>Belong to the interface itself; call them with the interface name: <code>Validator.isEmpty(s)</code>. They are <b>not</b> inherited by implementing classes (you can't call them through an object or the class name).</p>

<h3>private methods (Java 9+)</h3>
<p>Helpers that default/static methods share, hidden from implementers. (Use on JDK 25; this site runs Java 8.)</p>

<h3>The diamond problem — and how Java resolves it</h3>
<p>If a class gets two default methods with the same signature from two interfaces, Java refuses to guess:</p>
<pre class="java">interface Camera { default String start() { return "Camera on"; } }
interface Torch  { default String start() { return "Torch on"; } }

class Phone implements Camera, Torch {
    // without this override → error: class Phone inherits unrelated defaults for start()
    @Override
    public String start() {
        return Camera.super.start() + " + " + Torch.super.start();
    }
}</pre>
<p><code>InterfaceName.super.method()</code> calls a specific interface's default version.</p>

<h3>Resolution rules (in order)</h3>
<ol>
<li><b>Classes win:</b> a method in the class or any superclass beats any interface default.</li>
<li><b>More specific interface wins:</b> if B extends A and both have the default, B's is used.</li>
<li>Otherwise the class <b>must override</b> and choose explicitly.</li>
</ol>

<h3>Interface vs abstract class (preview)</h3>
<p>Interfaces with default methods look more like abstract classes, but they still can't hold instance state or constructors. The next topic compares them in detail.</p>
`,

  samples: [
    {
      title: "default and static methods",
      code: J`interface Vehicle {
    String name();
    int wheels();

    default String describe() {
        return name() + " has " + wheels() + " wheels";
    }

    static boolean isHeavy(int wheels) {
        return wheels > 4;
    }
}

class Car implements Vehicle {
    public String name() { return "Car"; }
    public int wheels() { return 4; }
}

class Truck implements Vehicle {
    public String name() { return "Truck"; }
    public int wheels() { return 10; }
    @Override
    public String describe() { return "Heavy truck with " + wheels() + " wheels"; }
}

public class Main {
    public static void main(String[] args) {
        Vehicle[] vs = {new Car(), new Truck()};
        for (Vehicle v : vs) {
            System.out.println(v.describe() + " | heavy? " + Vehicle.isHeavy(v.wheels()));
        }
    }
}`,
      output: "Car has 4 wheels | heavy? false\nHeavy truck with 10 wheels | heavy? true",
    },
    {
      title: "Resolving the diamond",
      code: J`interface Camera {
    default String start() { return "Camera on"; }
}

interface Torch {
    default String start() { return "Torch on"; }
}

class Phone implements Camera, Torch {
    @Override
    public String start() {
        return Camera.super.start() + " + " + Torch.super.start();
    }
}

class Base {
    public String start() { return "Base wins"; }
}

class Gadget extends Base implements Camera { }

public class Main {
    public static void main(String[] args) {
        System.out.println(new Phone().start());
        System.out.println(new Gadget().start());
    }
}`,
      output: "Camera on + Torch on\nBase wins",
      explain: "Gadget inherits start() from its superclass Base; class methods always beat interface defaults.",
    },
  ],

  practice: [
    {
      id: "c10t2p1", title: "Default discount",
      task: "<p>Interface <code>Billable</code> has <code>double basePrice()</code> and a default <code>double finalPrice()</code> that adds 18% GST. <code>Book</code> (₹500) uses the default; <code>Medicine</code> (₹500) overrides finalPrice to add only 5%.</p>",
      expected: "Book: 590.0\nMedicine: 525.0",
      mustUse: ["default double finalPrice()"],
      hints: ["<code>default double finalPrice() { return basePrice() * 1.18; }</code>"],
      solution: J`interface Billable {
    double basePrice();

    default double finalPrice() {
        return basePrice() * 1.18;
    }
}

class Book implements Billable {
    public double basePrice() { return 500; }
}

class Medicine implements Billable {
    public double basePrice() { return 500; }
    @Override
    public double finalPrice() { return basePrice() * 1.05; }
}

public class Main {
    public static void main(String[] args) {
        System.out.println("Book: " + new Book().finalPrice());
        System.out.println("Medicine: " + new Medicine().finalPrice());
    }
}`,
    },
    {
      id: "c10t2p2", title: "Static helper in an interface",
      task: "<p>Interface <code>Validator</code> has abstract <code>boolean isValid(String s)</code> and a static <code>boolean notBlank(String s)</code>. <code>PinValidator</code> accepts exactly 6 digits; <code>EmailValidator</code> needs an @ and a dot after it. Both use <code>Validator.notBlank</code> first.</p>",
      expected: "pin 380015: true\npin 38A01: false\nemail a@b.in: true\nemail ab.in: false\nemail blank: false",
      mustUse: ["static boolean notBlank(String s)", "Validator.notBlank"],
      hints: ["notBlank: <code>return s != null && !s.trim().isEmpty();</code>", "Email: <code>int at = s.indexOf('@'); return at > 0 && s.indexOf('.', at) > at + 1;</code>"],
      solution: J`interface Validator {
    boolean isValid(String s);

    static boolean notBlank(String s) {
        return s != null && !s.trim().isEmpty();
    }
}

class PinValidator implements Validator {
    public boolean isValid(String s) {
        if (!Validator.notBlank(s) || s.length() != 6) return false;
        for (char c : s.toCharArray()) if (!Character.isDigit(c)) return false;
        return true;
    }
}

class EmailValidator implements Validator {
    public boolean isValid(String s) {
        if (!Validator.notBlank(s)) return false;
        int at = s.indexOf('@');
        return at > 0 && s.indexOf('.', at) > at + 1;
    }
}

public class Main {
    public static void main(String[] args) {
        Validator pin = new PinValidator();
        Validator mail = new EmailValidator();
        System.out.println("pin 380015: " + pin.isValid("380015"));
        System.out.println("pin 38A01: " + pin.isValid("38A01"));
        System.out.println("email a@b.in: " + mail.isValid("a@b.in"));
        System.out.println("email ab.in: " + mail.isValid("ab.in"));
        System.out.println("email blank: " + mail.isValid("  "));
    }
}`,
    },
    {
      id: "c10t2p3", title: "Resolve the clash",
      task: "<p><code>class Robot implements Speaker, Logger</code> doesn't compile: both interfaces have a default <code>String output()</code>. Override it in Robot to return Logger's version followed by Speaker's, separated by \" | \".</p>",
      starter: J`interface Speaker {
    default String output() { return "Beep"; }
}

interface Logger {
    default String output() { return "LOG: started"; }
}

class Robot implements Speaker, Logger {
}

public class Main {
    public static void main(String[] args) {
        System.out.println(new Robot().output());
    }
}`,
      expected: "LOG: started | Beep",
      mustUse: ["Logger.super.output()", "Speaker.super.output()"],
      hints: ["<code>public String output() { return Logger.super.output() + \" | \" + Speaker.super.output(); }</code>"],
      solution: J`interface Speaker {
    default String output() { return "Beep"; }
}

interface Logger {
    default String output() { return "LOG: started"; }
}

class Robot implements Speaker, Logger {
    @Override
    public String output() {
        return Logger.super.output() + " | " + Speaker.super.output();
    }
}

public class Main {
    public static void main(String[] args) {
        System.out.println(new Robot().output());
    }
}`,
    },
  ],

  fill: [
    { id: "c10t2f1", prompt: "Declare an interface method that has a body and is inherited.", template: "___ void log(String m) { System.out.println(m); }", answers: [["default"]], explain: "default methods (Java 8)." },
    { id: "c10t2f2", prompt: "Call interface A's default version of hello().", template: "return A.___.hello();", answers: [["super"]], explain: "InterfaceName.super.method()." },
  ],

  quiz: [
    { type: "mcq", q: "Can a class call an interface's static method through an object of the class?", options: ["Yes", "No — use InterfaceName.method()", "Only if public", "Only from main"], answer: 1, explain: "Interface static methods are not inherited." },
    { type: "mcq", q: "Superclass has <code>public void x()</code>, an interface has <code>default void x()</code>. Which runs?", options: ["interface default", "superclass method", "compile error", "both"], answer: 1, explain: "Class methods win." },
    { type: "mcq", q: "Why were default methods added in Java 8?", options: ["to allow constructors", "to add methods to interfaces without breaking existing implementations", "for speed", "to replace abstract classes"], answer: 1, explain: "Backward-compatible evolution." },
    { type: "output", q: "Predict the output.", code: J`interface A { default String f() { return "A"; } }
interface B extends A { default String f() { return "B"; } }
class C implements A, B { }
public class Q {
    public static void main(String[] args) {
        System.out.println(new C().f());
    }
}`, answer: "B", explain: "B is more specific than A, so its default wins — no conflict." },
  ],
};
