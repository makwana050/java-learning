const J = String.raw;

export default {
  title: "toString(), equals() & hashCode()",
  summary: "Every class inherits from Object. Override toString() to print objects nicely and equals()/hashCode() to compare them by content.",

  concept: J`
<h2>Concept</h2>
<p>Every class in Java automatically extends <code>java.lang.Object</code>. So every object already has these methods — but their default versions are rarely what you want.</p>
<table>
<tr><th>Method</th><th>Default behaviour (from Object)</th></tr>
<tr><td><code>String toString()</code></td><td><code>ClassName@hexHashCode</code>, e.g. <code>Student@1b6d3586</code></td></tr>
<tr><td><code>boolean equals(Object o)</code></td><td>same as <code>==</code> — true only for the very same object</td></tr>
<tr><td><code>int hashCode()</code></td><td>a number derived from the object's identity</td></tr>
<tr><td><code>Class getClass()</code></td><td>runtime class information (<code>getClass().getSimpleName()</code>)</td></tr>
</table>

<h3>toString()</h3>
<p>Java calls toString() automatically when you print an object or join it with a String:</p>
<pre class="java">System.out.println(s);        // calls s.toString()
String line = "Student: " + s; // calls s.toString()</pre>
<p>Override it to return a readable description:</p>
<pre class="java">@Override
public String toString() {
    return "Student[" + rollNo + ", " + name + "]";
}</pre>
<p><code>@Override</code> asks the compiler to check that you really are overriding a parent method — a misspelt <code>tostring()</code> would then be an error instead of a silent bug. It must be <code>public</code>.</p>

<h3>equals()</h3>
<p>Two different Student objects with the same roll number should usually count as "equal". Override equals to compare <b>contents</b>:</p>
<pre class="java">@Override
public boolean equals(Object o) {
    if (this == o) return true;                    // same object
    if (o == null || getClass() != o.getClass()) return false;
    Student other = (Student) o;                   // cast
    return rollNo == other.rollNo &amp;&amp; name.equals(other.name);
}</pre>
<p>The parameter must be <code>Object</code>; writing <code>equals(Student o)</code> creates an <i>overload</i>, not an override, and collections won't use it.</p>

<h3>hashCode() — the contract</h3>
<p><b>If two objects are equal by equals(), they must return the same hashCode().</b> HashMap and HashSet first look in the bucket given by hashCode, then use equals. If you override equals but not hashCode, "equal" objects land in different buckets and a HashSet will keep duplicates.</p>
<pre class="java">@Override
public int hashCode() {
    return java.util.Objects.hash(rollNo, name);
}</pre>
<p>(Unequal objects may share a hash code — that's allowed, just slower.)</p>

<h3>String already does this</h3>
<p><code>String</code> overrides all three, which is why <code>"a".equals(new String("a"))</code> is true and why Strings work well as HashMap keys.</p>
`,

  samples: [
    {
      title: "Before and after overriding toString",
      code: J`class Plain {
    int x = 5;
}

class Pretty {
    int x = 5;

    @Override
    public String toString() {
        return "Pretty(x=" + x + ")";
    }
}

public class Main {
    public static void main(String[] args) {
        String p = new Plain().toString();
        System.out.println(p.startsWith("Plain@"));
        System.out.println(new Pretty());
        System.out.println("Value: " + new Pretty());
    }
}`,
      output: "true\nPretty(x=5)\nValue: Pretty(x=5)",
      explain: "The default toString gives Plain@ plus a hash that changes from run to run, so this example just checks how it starts.",
    },
    {
      title: "equals and hashCode in a HashSet",
      code: J`import java.util.HashSet;
import java.util.Objects;

class Point {
    int x, y;
    Point(int x, int y) { this.x = x; this.y = y; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Point p = (Point) o;
        return x == p.x && y == p.y;
    }

    @Override
    public int hashCode() {
        return Objects.hash(x, y);
    }
}

public class Main {
    public static void main(String[] args) {
        Point a = new Point(2, 3);
        Point b = new Point(2, 3);
        System.out.println(a == b);
        System.out.println(a.equals(b));
        HashSet<Point> set = new HashSet<>();
        set.add(a);
        set.add(b);
        System.out.println("Set size: " + set.size());
    }
}`,
      output: "false\ntrue\nSet size: 1",
    },
  ],

  practice: [
    {
      id: "c7t7p1", title: "Readable objects",
      task: "<p>Write class <code>Movie</code> (title, year, rating) and override <code>toString()</code> so that printing an object gives the format below. Print an array of two movies with a for-each loop.</p>",
      expected: "Lagaan (2001) - 8.1/10\nSwades (2004) - 8.2/10",
      mustUse: ["public String toString()", "@Override"],
      hints: ["<code>return title + \" (\" + year + \") - \" + rating + \"/10\";</code>", "Then simply <code>System.out.println(m);</code>"],
      solution: J`class Movie {
    String title;
    int year;
    double rating;

    Movie(String title, int year, double rating) {
        this.title = title;
        this.year = year;
        this.rating = rating;
    }

    @Override
    public String toString() {
        return title + " (" + year + ") - " + rating + "/10";
    }
}

public class Main {
    public static void main(String[] args) {
        Movie[] list = {new Movie("Lagaan", 2001, 8.1), new Movie("Swades", 2004, 8.2)};
        for (Movie m : list) System.out.println(m);
    }
}`,
    },
    {
      id: "c7t7p2", title: "Content equality",
      task: "<p>Class <code>Employee</code> has <code>id</code> and <code>name</code>. Two employees are equal when their ids are equal. Override <code>equals(Object)</code> and <code>hashCode()</code> accordingly, then show the results.</p>",
      expected: "e1 == e2: false\ne1.equals(e2): true\ne1.equals(e3): false\nsame hash: true",
      mustUse: ["public boolean equals(Object o)", "public int hashCode()"],
      hints: ["equals: check this == o, null and class, cast, compare ids.", "hashCode: <code>return Integer.hashCode(id);</code> or <code>return id;</code>"],
      solution: J`class Employee {
    int id;
    String name;

    Employee(int id, String name) {
        this.id = id;
        this.name = name;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Employee other = (Employee) o;
        return id == other.id;
    }

    @Override
    public int hashCode() {
        return id;
    }
}

public class Main {
    public static void main(String[] args) {
        Employee e1 = new Employee(7, "Ravi");
        Employee e2 = new Employee(7, "Ravi K.");
        Employee e3 = new Employee(8, "Ravi");
        System.out.println("e1 == e2: " + (e1 == e2));
        System.out.println("e1.equals(e2): " + e1.equals(e2));
        System.out.println("e1.equals(e3): " + e1.equals(e3));
        System.out.println("same hash: " + (e1.hashCode() == e2.hashCode()));
    }
}`,
    },
    {
      id: "c7t7p3", title: "Overload vs override bug",
      task: "<p>This <code>equals</code> takes a <code>Coin</code> instead of an <code>Object</code>, so it <b>overloads</b> instead of overriding, and the list search fails. Fix it (and add hashCode) so <code>contains</code> finds the coin.</p>",
      starter: J`import java.util.ArrayList;

class Coin {
    int value;
    Coin(int value) { this.value = value; }

    public boolean equals(Coin c) {
        return c != null && value == c.value;
    }
}

public class Main {
    public static void main(String[] args) {
        ArrayList<Coin> purse = new ArrayList<>();
        purse.add(new Coin(5));
        purse.add(new Coin(10));
        System.out.println("Has a 10? " + purse.contains(new Coin(10)));
    }
}`,
      expected: "Has a 10? true",
      mustUse: ["equals(Object"],
      hints: ["ArrayList.contains calls equals(Object). Change the parameter type and cast inside.", "Add @Override — the compiler will then confirm you are overriding."],
      solution: J`import java.util.ArrayList;

class Coin {
    int value;
    Coin(int value) { this.value = value; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Coin)) return false;
        return value == ((Coin) o).value;
    }

    @Override
    public int hashCode() {
        return value;
    }
}

public class Main {
    public static void main(String[] args) {
        ArrayList<Coin> purse = new ArrayList<>();
        purse.add(new Coin(5));
        purse.add(new Coin(10));
        System.out.println("Has a 10? " + purse.contains(new Coin(10)));
    }
}`,
    },
  ],

  fill: [
    { id: "c7t7f1", prompt: "Correct header to override toString.", template: "@Override\n___ String toString()", answers: [["public"]], explain: "Overrides can't reduce visibility; Object.toString is public." },
    { id: "c7t7f2", prompt: "The equals parameter type must be…", template: "public boolean equals(___ o)", answers: [["Object"]], explain: "Otherwise it is an overload." },
  ],

  quiz: [
    { type: "mcq", q: "Default <code>equals()</code> from Object compares…", options: ["all fields", "references (same object)", "hash codes only", "toString results"], answer: 1, explain: "It behaves like ==." },
    { type: "mcq", q: "If a.equals(b) is true, then…", options: ["a == b must be true", "a.hashCode() must equal b.hashCode()", "hash codes must differ", "nothing is required"], answer: 1, explain: "The equals/hashCode contract." },
    { type: "mcq", q: "Which line calls toString() automatically?", options: ["obj.equals(x)", "System.out.println(obj)", "obj.hashCode()", "Object o = obj;"], answer: 1, explain: "println and string concatenation use toString()." },
    { type: "mcq", q: "You override equals but not hashCode, then add two equal objects to a HashSet. Most likely size?", options: ["1", "2", "0", "error"], answer: 1, explain: "Different identity hash codes put them in different buckets." },
  ],
};
