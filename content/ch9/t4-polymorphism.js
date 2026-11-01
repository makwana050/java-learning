const J = String.raw;

export default {
  title: "Runtime polymorphism, casting & instanceof",
  summary: "A parent reference can point to any child object, and the right overridden method runs at runtime. Learn upcasting, downcasting and instanceof.",

  concept: J`
<h2>Concept</h2>
<p><b>Polymorphism</b> = "many forms". One reference type, many possible object types, each behaving in its own way.</p>

<h3>Upcasting — parent reference, child object</h3>
<pre class="java">Animal a = new Dog();     // automatic (implicit): a Dog IS-A Animal
a.sound();                // runs Dog's sound()  ← decided at runtime</pre>

<h3>Dynamic method dispatch</h3>
<p>Two different types are involved:</p>
<ul>
<li>The <b>reference type</b> (<code>Animal</code>) — the compiler uses it to decide <b>which methods you may call</b>.</li>
<li>The <b>object type</b> (<code>Dog</code>) — the JVM uses it at runtime to decide <b>which overridden version runs</b>.</li>
</ul>
<pre class="java">Animal a = new Dog();
a.sound();    // ✓ Animal has sound(); Dog's version runs
a.fetch();    // ✗ compile error: Animal has no fetch()</pre>
<div class="note">Only <b>overridden instance methods</b> are dynamic. <b>Fields</b>, <b>static</b> methods and <b>private</b> methods are chosen by the reference type at compile time (see "hiding" in the next topic).</div>

<h3>Why it's powerful</h3>
<pre class="java">Animal[] zoo = { new Dog(), new Cat(), new Cow() };
for (Animal x : zoo) x.sound();     // each speaks in its own way

static void feed(Animal x) { … }    // works for every current and future Animal</pre>
<p>Add a new subclass tomorrow and this code keeps working unchanged.</p>

<h3>Downcasting — back to the child type</h3>
<pre class="java">Animal a = new Dog();
Dog d = (Dog) a;      // explicit cast: OK because the object really is a Dog
d.fetch();

Animal b = new Cat();
Dog wrong = (Dog) b;  // compiles, but at runtime: ClassCastException</pre>
<p>Casting between unrelated types (<code>(String) someAnimal</code>) doesn't even compile.</p>

<h3>instanceof — check before you cast</h3>
<pre class="java">if (a instanceof Dog) {
    Dog d = (Dog) a;
    d.fetch();
}</pre>
<ul>
<li><code>x instanceof T</code> is true if the object is a T <b>or any subclass of T</b> (or implements interface T).</li>
<li><code>null instanceof Anything</code> is always false.</li>
<li>Java 16+ pattern matching: <code>if (a instanceof Dog d) { d.fetch(); }</code> — the cast is built in (use on JDK 25 in the lab).</li>
</ul>
<p>Tip: if you find many <code>instanceof</code> checks, it often means the behaviour should be an overridden method instead.</p>
`,

  samples: [
    {
      title: "One loop, many behaviours",
      code: J`class Payment {
    double amount;
    Payment(double amount) { this.amount = amount; }
    double fee() { return 0; }
    String type() { return "Payment"; }
}

class CardPayment extends Payment {
    CardPayment(double a) { super(a); }
    @Override double fee() { return amount * 0.02; }
    @Override String type() { return "Card"; }
}

class UpiPayment extends Payment {
    UpiPayment(double a) { super(a); }
    @Override String type() { return "UPI"; }
}

class WalletPayment extends Payment {
    WalletPayment(double a) { super(a); }
    @Override double fee() { return 5; }
    @Override String type() { return "Wallet"; }
}

public class Main {
    public static void main(String[] args) {
        Payment[] list = {new CardPayment(1000), new UpiPayment(1000), new WalletPayment(1000)};
        for (Payment p : list) {
            System.out.println(p.type() + " fee: " + p.fee());
        }
    }
}`,
      output: "Card fee: 20.0\nUPI fee: 0.0\nWallet fee: 5.0",
    },
    {
      title: "Reference type vs object type",
      code: J`class Parent {
    String name = "parent-field";
    String who() { return "Parent.who()"; }
}

class Child extends Parent {
    String name = "child-field";
    @Override String who() { return "Child.who()"; }
    String extra() { return "Child.extra()"; }
}

public class Main {
    public static void main(String[] args) {
        Parent p = new Child();
        System.out.println(p.who());
        System.out.println(p.name);
        Child c = (Child) p;
        System.out.println(c.extra() + " " + c.name);
    }
}`,
      output: "Child.who()\nparent-field\nChild.extra() child-field",
      explain: "Methods are chosen by the object (Child). Fields are chosen by the reference type (Parent).",
    },
    {
      title: "Safe downcasting",
      code: J`class Animal { }
class Dog extends Animal { void fetch() { System.out.println("Dog fetches"); } }
class Cat extends Animal { void climb() { System.out.println("Cat climbs"); } }

public class Main {
    public static void main(String[] args) {
        Animal[] pets = {new Dog(), new Cat(), null};
        for (Animal a : pets) {
            if (a instanceof Dog) {
                ((Dog) a).fetch();
            } else if (a instanceof Cat) {
                ((Cat) a).climb();
            } else {
                System.out.println("not an animal object");
            }
        }
        try {
            Dog d = (Dog) pets[1];
        } catch (ClassCastException e) {
            System.out.println("ClassCastException: a Cat is not a Dog");
        }
    }
}`,
      output: "Dog fetches\nCat climbs\nnot an animal object\nClassCastException: a Cat is not a Dog",
    },
  ],

  practice: [
    {
      id: "c9t4p1", title: "Polymorphic salary sheet",
      task: "<p>Create <code>Staff</code> (name, <code>double monthlyPay()</code> returning 0) and three subclasses: <code>Permanent</code> (salary 50000 → monthly = salary), <code>Contract</code> (hours 120 × rate 400), <code>Visiting</code> (lectures 10 × 1500). Store them in a <code>Staff[]</code> and print each plus the total — using only the Staff type in the loop.</p>",
      expected: "Anil: 50000.0\nBeena: 48000.0\nCharu: 15000.0\nTotal: 113000.0",
      mustUse: ["Staff[]", "@Override"],
      hints: ["Each subclass has its own fields and overrides monthlyPay().", "Loop: <code>for (Staff s : list) { System.out.println(s.name + \": \" + s.monthlyPay()); total += s.monthlyPay(); }</code>"],
      solution: J`class Staff {
    String name;
    Staff(String name) { this.name = name; }
    double monthlyPay() { return 0; }
}

class Permanent extends Staff {
    double salary;
    Permanent(String n, double salary) { super(n); this.salary = salary; }
    @Override double monthlyPay() { return salary; }
}

class Contract extends Staff {
    int hours; double rate;
    Contract(String n, int hours, double rate) { super(n); this.hours = hours; this.rate = rate; }
    @Override double monthlyPay() { return hours * rate; }
}

class Visiting extends Staff {
    int lectures; double perLecture;
    Visiting(String n, int lectures, double perLecture) { super(n); this.lectures = lectures; this.perLecture = perLecture; }
    @Override double monthlyPay() { return lectures * perLecture; }
}

public class Main {
    public static void main(String[] args) {
        Staff[] list = {new Permanent("Anil", 50000), new Contract("Beena", 120, 400), new Visiting("Charu", 10, 1500)};
        double total = 0;
        for (Staff s : list) {
            System.out.println(s.name + ": " + s.monthlyPay());
            total += s.monthlyPay();
        }
        System.out.println("Total: " + total);
    }
}`,
    },
    {
      id: "c9t4p2", title: "Count with instanceof",
      task: "<p>Given the array in the starter, count how many are Cars, how many are Bikes, and how many are any kind of Vehicle (including null entries that are not). Then call <code>openTrunk()</code> only on cars using a safe downcast.</p>",
      starter: J`class Vehicle { }
class Car extends Vehicle {
    String model;
    Car(String m) { model = m; }
    void openTrunk() { System.out.println(model + " trunk opened"); }
}
class Bike extends Vehicle { }

public class Main {
    public static void main(String[] args) {
        Vehicle[] parking = {new Car("Baleno"), new Bike(), null, new Bike(), new Car("Venue")};
        // count and open trunks
    }
}`,
      expected: "Baleno trunk opened\nVenue trunk opened\nCars: 2, Bikes: 2, Vehicles: 4",
      mustUse: ["instanceof Car", "(Car)"],
      hints: ["null instanceof Vehicle is false, so the null slot isn't counted.", "<code>if (v instanceof Car) { cars++; ((Car) v).openTrunk(); }</code>"],
      solution: J`class Vehicle { }
class Car extends Vehicle {
    String model;
    Car(String m) { model = m; }
    void openTrunk() { System.out.println(model + " trunk opened"); }
}
class Bike extends Vehicle { }

public class Main {
    public static void main(String[] args) {
        Vehicle[] parking = {new Car("Baleno"), new Bike(), null, new Bike(), new Car("Venue")};
        int cars = 0, bikes = 0, vehicles = 0;
        for (Vehicle v : parking) {
            if (v instanceof Vehicle) vehicles++;
            if (v instanceof Car) {
                cars++;
                ((Car) v).openTrunk();
            } else if (v instanceof Bike) {
                bikes++;
            }
        }
        System.out.println("Cars: " + cars + ", Bikes: " + bikes + ", Vehicles: " + vehicles);
    }
}`,
    },
    {
      id: "c9t4p3", title: "A method that accepts any child",
      task: "<p>Write <code>static void printBill(Item item)</code> that prints the item's name and its <code>price()</code>. <code>Item</code>'s price is the base price; <code>DiscountedItem</code> overrides price() to take 10% off; <code>ImportedItem</code> adds 25% duty. Call printBill with one of each (base 1000).</p>",
      expected: "Pen drive: 1000.0\nPen drive (sale): 900.0\nPen drive (imported): 1250.0",
      mustUse: ["static void printBill(Item item)"],
      hints: ["The method parameter is the parent type; dynamic dispatch picks the right price()."],
      solution: J`class Item {
    String name;
    double base;
    Item(String name, double base) { this.name = name; this.base = base; }
    double price() { return base; }
}

class DiscountedItem extends Item {
    DiscountedItem(String n, double b) { super(n, b); }
    @Override double price() { return base * 0.9; }
}

class ImportedItem extends Item {
    ImportedItem(String n, double b) { super(n, b); }
    @Override double price() { return base * 1.25; }
}

public class Main {
    static void printBill(Item item) {
        System.out.println(item.name + ": " + item.price());
    }

    public static void main(String[] args) {
        printBill(new Item("Pen drive", 1000));
        printBill(new DiscountedItem("Pen drive (sale)", 1000));
        printBill(new ImportedItem("Pen drive (imported)", 1000));
    }
}`,
    },
  ],

  fill: [
    { id: "c9t4f1", prompt: "Check the type, then downcast.", template: "if (shape ___ Circle) {\n    Circle c = (___) shape;\n}", answers: [["instanceof"], ["Circle"]], explain: "instanceof before casting avoids ClassCastException." },
    { id: "c9t4f2", prompt: "Upcast a Laptop to its parent type Device.", template: "___ d = new Laptop();", answers: [["Device"]], explain: "A parent reference can hold a child object." },
  ],

  quiz: [
    { type: "output", q: "Predict the output.", code: J`class A { String f() { return "A"; } }
class B extends A { String f() { return "B"; } }
class C extends B { }
public class Q {
    public static void main(String[] args) {
        A x = new C();
        System.out.println(x.f() + (x instanceof B) + (x instanceof C));
    }
}`, answer: "Btruetrue", explain: "C inherits B's override; x is a C, which is also a B." },
    { type: "mcq", q: "<code>Animal a = new Cat(); Dog d = (Dog) a;</code>", options: ["compile error", "ClassCastException at runtime", "d is null", "works"], answer: 1, explain: "Compiles (Dog is an Animal subtype) but the object is a Cat." },
    { type: "mcq", q: "<code>Animal a = new Dog(); a.fetch();</code> where only Dog has fetch():", options: ["runs Dog.fetch()", "compile error", "ClassCastException", "does nothing"], answer: 1, explain: "The compiler checks methods against the reference type." },
    { type: "mcq", q: "What is <code>null instanceof Object</code>?", options: ["true", "false", "NullPointerException", "compile error"], answer: 1, explain: "instanceof is always false for null." },
    { type: "mcq", q: "Runtime polymorphism applies to…", options: ["fields", "static methods", "overridden instance methods", "constructors"], answer: 2, explain: "Only overridden instance methods are dispatched dynamically." },
  ],
};
