const J = String.raw;

export default {
  title: "Classes, objects & references",
  summary: "The heart of object-oriented programming: design a class as a blueprint, create objects from it, and understand what a reference variable really holds.",

  concept: J`
<h2>Concept</h2>
<h3>Class and object</h3>
<p>A <b>class</b> is a blueprint or template. It describes what data an object will have (<b>fields</b> / attributes / state) and what it can do (<b>methods</b> / behaviour). An <b>object</b> is a real thing built from that blueprint, with its own values.</p>
<table>
<tr><th>Class (blueprint)</th><th>Objects (instances)</th></tr>
<tr><td><code>Car</code>: brand, speed; accelerate(), brake()</td><td>a red Tata Nexon at 60 km/h; a white Honda City at 0 km/h</td></tr>
<tr><td><code>Student</code>: name, rollNo, marks; display()</td><td>Asha / 21 / 88; Ravi / 22 / 74</td></tr>
</table>

<h3>Writing a class</h3>
<pre class="java">class Book {
    String title;        // fields (instance variables)
    String author;
    int pages;

    void describe() {    // method (instance method — no static)
        System.out.println(title + " by " + author + ", " + pages + " pages");
    }
}</pre>

<h3>Creating and using objects</h3>
<pre class="java">Book b1 = new Book();        // create an object
b1.title = "Wings of Fire";  // set fields with the dot operator
b1.author = "A. P. J. Abdul Kalam";
b1.pages = 180;
b1.describe();               // call a method on the object</pre>
<p>What <code>new Book()</code> does:</p>
<ol>
<li>Allocates memory for a new Book object on the <b>heap</b>.</li>
<li>Gives every field its default value (null, 0, false…).</li>
<li>Runs a <b>constructor</b> (next topic).</li>
<li>Returns a <b>reference</b> (address) to the object, stored in <code>b1</code>.</li>
</ol>

<h3>Reference variables</h3>
<p><code>b1</code> is not the object itself; it is a <b>reference</b> that points to it. The reference lives on the stack (if local); the object lives on the heap.</p>
<pre class="java">Book b2 = b1;           // copies the reference — both point to ONE object
b2.pages = 200;
System.out.println(b1.pages);   // 200
Book b3 = null;          // points to no object
b3.describe();           // NullPointerException at runtime</pre>
<p>An object with no references left becomes eligible for <b>garbage collection</b>.</p>

<h3>Instance methods use the object's own fields</h3>
<p>Inside <code>describe()</code>, <code>title</code> means "the title of the object this method was called on". <code>b1.describe()</code> uses b1's fields; <code>b2.describe()</code> uses b2's.</p>

<h3>One file, several classes</h3>
<p>A .java file may contain many classes, but at most <b>one public</b> class, whose name must match the file name. On this website, write helper classes without <code>public</code> and keep <code>public class Main</code> with the main method.</p>

<h3>OOP in one line each</h3>
<ul>
<li><b>Encapsulation</b> — bundle data with the methods that use it, and hide the data.</li>
<li><b>Inheritance</b> — a new class reuses and extends an existing one.</li>
<li><b>Polymorphism</b> — one name, many forms (overloading, overriding).</li>
<li><b>Abstraction</b> — expose what an object does, hide how it does it.</li>
</ul>
<p>You'll study each one in the coming chapters.</p>
`,

  samples: [
    {
      title: "A class with fields and methods",
      code: J`class Rectangle {
    double length;
    double width;

    double area() {
        return length * width;
    }

    double perimeter() {
        return 2 * (length + width);
    }
}

public class Main {
    public static void main(String[] args) {
        Rectangle r1 = new Rectangle();
        r1.length = 8;
        r1.width = 5;
        Rectangle r2 = new Rectangle();
        r2.length = 3.5;
        r2.width = 2;
        System.out.println("r1 area = " + r1.area() + ", perimeter = " + r1.perimeter());
        System.out.println("r2 area = " + r2.area() + ", perimeter = " + r2.perimeter());
    }
}`,
      output: "r1 area = 40.0, perimeter = 26.0\nr2 area = 7.0, perimeter = 11.0",
    },
    {
      title: "Two references, one object",
      code: J`class Counter {
    int value;
}

public class Main {
    public static void main(String[] args) {
        Counter a = new Counter();
        Counter b = a;
        Counter c = new Counter();
        b.value = 10;
        c.value = 99;
        System.out.println(a.value + " " + b.value + " " + c.value);
        System.out.println((a == b) + " " + (a == c));
    }
}`,
      output: "10 10 99\ntrue false",
    },
    {
      title: "Objects in an array",
      code: J`class Item {
    String name;
    int price;
}

public class Main {
    public static void main(String[] args) {
        Item[] cart = new Item[3];
        String[] names = {"Pen", "Notebook", "Bag"};
        int[] prices = {20, 60, 750};
        for (int i = 0; i < cart.length; i++) {
            cart[i] = new Item();
            cart[i].name = names[i];
            cart[i].price = prices[i];
        }
        int total = 0;
        for (Item it : cart) total += it.price;
        System.out.println("Items: " + cart.length + ", total: " + total);
    }
}`,
      output: "Items: 3, total: 830",
      explain: "<code>new Item[3]</code> creates an array of 3 <b>null</b> references — each Item object must still be created with <code>new Item()</code>.",
    },
  ],

  practice: [
    {
      id: "c7t1p1", title: "Student class",
      task: "<p>Create a class <code>Student</code> with fields <code>name</code>, <code>rollNo</code> and <code>marks</code> (int), and a method <code>void display()</code>. Create two students in main and display them.</p>",
      expected: "Roll 101: Kiran - 88\nRoll 102: Sneha - 93",
      mustUse: ["class Student", "void display()", "new Student()"],
      hints: ["display(): <code>System.out.println(\"Roll \" + rollNo + \": \" + name + \" - \" + marks);</code>", "In main: <code>Student s1 = new Student(); s1.name = \"Kiran\"; …</code>"],
      solution: J`class Student {
    String name;
    int rollNo;
    int marks;

    void display() {
        System.out.println("Roll " + rollNo + ": " + name + " - " + marks);
    }
}

public class Main {
    public static void main(String[] args) {
        Student s1 = new Student();
        s1.name = "Kiran";
        s1.rollNo = 101;
        s1.marks = 88;
        Student s2 = new Student();
        s2.name = "Sneha";
        s2.rollNo = 102;
        s2.marks = 93;
        s1.display();
        s2.display();
    }
}`,
    },
    {
      id: "c7t1p2", title: "Bank account behaviour",
      task: "<p>Create class <code>Account</code> with <code>holder</code> and <code>balance</code> (double), and methods <code>deposit(double)</code>, <code>withdraw(double)</code> (refuse if not enough money) and <code>show()</code>. Perform: deposit 5000, withdraw 1200, withdraw 10000.</p>",
      expected: "Deposited 5000.0\nWithdrew 1200.0\nInsufficient balance for 10000.0\nNeha: balance 3800.0",
      mustUse: ["class Account", "void deposit(double", "void withdraw(double"],
      hints: ["withdraw: <code>if (amount > balance) { print message; return; }</code>"],
      solution: J`class Account {
    String holder;
    double balance;

    void deposit(double amount) {
        balance += amount;
        System.out.println("Deposited " + amount);
    }

    void withdraw(double amount) {
        if (amount > balance) {
            System.out.println("Insufficient balance for " + amount);
            return;
        }
        balance -= amount;
        System.out.println("Withdrew " + amount);
    }

    void show() {
        System.out.println(holder + ": balance " + balance);
    }
}

public class Main {
    public static void main(String[] args) {
        Account acc = new Account();
        acc.holder = "Neha";
        acc.deposit(5000);
        acc.withdraw(1200);
        acc.withdraw(10000);
        acc.show();
    }
}`,
    },
    {
      id: "c7t1p3", title: "Default field values",
      task: "<p>Create a class <code>Config</code> with fields <code>String name; int retries; double timeout; boolean debug;</code> and don't set them. Print each field of a new Config object.</p>",
      expected: "null 0 0.0 false",
      mustUse: ["class Config"],
      hints: ["Fields get default values automatically."],
      solution: J`class Config {
    String name;
    int retries;
    double timeout;
    boolean debug;
}

public class Main {
    public static void main(String[] args) {
        Config c = new Config();
        System.out.println(c.name + " " + c.retries + " " + c.timeout + " " + c.debug);
    }
}`,
    },
    {
      id: "c7t1p4", title: "Find the topper",
      task: "<p>Using a class <code>Player</code> (name, score), create an array of 4 players: Arun 340, Bina 515, Chetan 480, Divya 515. Print the first player with the highest score and the average score.</p>",
      expected: "Top: Bina (515)\nAverage: 462.5",
      mustUse: ["class Player", "Player[]"],
      hints: ["Create the array, then fill each element with new Player() and set fields.", "Keep a reference <code>Player best = players[0];</code> and replace it only on a strictly higher score."],
      solution: J`class Player {
    String name;
    int score;
}

public class Main {
    public static void main(String[] args) {
        String[] names = {"Arun", "Bina", "Chetan", "Divya"};
        int[] scores = {340, 515, 480, 515};
        Player[] players = new Player[names.length];
        for (int i = 0; i < players.length; i++) {
            players[i] = new Player();
            players[i].name = names[i];
            players[i].score = scores[i];
        }
        Player best = players[0];
        int sum = 0;
        for (Player p : players) {
            if (p.score > best.score) best = p;
            sum += p.score;
        }
        System.out.println("Top: " + best.name + " (" + best.score + ")");
        System.out.println("Average: " + (double) sum / players.length);
    }
}`,
    },
  ],

  fill: [
    { id: "c7t1f1", prompt: "Create an object of class Car.", template: "Car myCar = ___ Car();", answers: [["new"]], explain: "new allocates the object and runs a constructor." },
    { id: "c7t1f2", prompt: "Set a field and call a method.", template: "myCar___speed = 40;\nmyCar___accelerate();", answers: [["."], ["."]], explain: "The dot operator accesses members of an object." },
  ],

  quiz: [
    { type: "mcq", q: "Where are objects created?", options: ["Stack", "Heap", "Method area", "String pool"], answer: 1, explain: "All objects live on the heap; local reference variables live on the stack." },
    { type: "output", q: "Predict the output.", code: J`class P { int x; }
public class Q {
    public static void main(String[] args) {
        P a = new P();
        P b = new P();
        a.x = 5;
        b = a;
        b.x++;
        System.out.println(a.x);
    }
}`, answer: "6", explain: "After b = a, both refer to the same object." },
    { type: "mcq", q: "<code>Item[] items = new Item[5];</code> creates how many Item objects?", options: ["5", "0", "1", "6"], answer: 1, explain: "Only the array of 5 null references is created." },
    { type: "mcq", q: "Calling a method on a reference that is null gives…", options: ["0", "nothing happens", "NullPointerException", "compile error"], answer: 2, explain: "There's no object to call the method on." },
    { type: "mcq", q: "How many public classes can one .java file have?", options: ["any number", "at most one", "exactly two", "none"], answer: 1, explain: "And its name must match the file name." },
  ],
};
