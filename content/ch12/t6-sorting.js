const J = String.raw;

export default {
  title: "Iterator, Comparable & Comparator",
  summary: "Walk through any collection with an Iterator, give your classes a natural order with Comparable, and sort any way you like with Comparator.",

  concept: J`
<h2>Concept</h2>
<h3>Iterator</h3>
<p>Every Collection can give you an <code>Iterator</code> — an object that walks through its elements one by one. The for-each loop uses one behind the scenes.</p>
<pre class="java">Iterator&lt;String&gt; it = list.iterator();
while (it.hasNext()) {
    String s = it.next();
    if (s.isEmpty()) it.remove();     // the SAFE way to remove while looping
}</pre>
<p><code>ListIterator</code> (for Lists) can also go backwards (<code>hasPrevious</code>, <code>previous</code>) and <code>set</code>/<code>add</code> while iterating.</p>

<h3>Comparable — the natural order of a class</h3>
<p>To sort your own objects with <code>Collections.sort</code> or put them in a TreeSet/TreeMap, the class can implement <code>Comparable&lt;T&gt;</code> and its one method:</p>
<pre class="java">class Student implements Comparable&lt;Student&gt; {
    int roll; String name; double cgpa;
    @Override
    public int compareTo(Student other) {
        return Integer.compare(this.roll, other.roll);   // natural order: by roll
    }
}</pre>
<p><code>compareTo</code> returns <b>negative</b> if this comes first, <b>0</b> if equal, <b>positive</b> if this comes after. Use <code>Integer.compare</code>, <code>Double.compare</code>, <code>String.compareTo</code> — avoid <code>a - b</code>, which can overflow.</p>
<p>String, Integer, Double, LocalDate… already implement Comparable — that's why they sort automatically.</p>

<h3>Comparator — any other order</h3>
<p>A <code>Comparator&lt;T&gt;</code> is a separate object (often a lambda) that compares two objects. Use it when you need several orders, or can't change the class.</p>
<pre class="java">Comparator&lt;Student&gt; byName = (a, b) -&gt; a.name.compareTo(b.name);
list.sort(byName);

// Java 8 helpers:
list.sort(Comparator.comparing(s -&gt; s.name));
list.sort(Comparator.comparingDouble((Student s) -&gt; s.cgpa).reversed());
list.sort(Comparator.comparing((Student s) -&gt; s.dept).thenComparing(s -&gt; s.name));</pre>

<h3>Comparable vs Comparator</h3>
<table>
<tr><th></th><th>Comparable</th><th>Comparator</th></tr>
<tr><td>Package</td><td>java.lang</td><td>java.util</td></tr>
<tr><td>Method</td><td><code>compareTo(T o)</code></td><td><code>compare(T a, T b)</code></td></tr>
<tr><td>Where</td><td>inside the class being sorted</td><td>separate class / lambda</td></tr>
<tr><td>How many orders</td><td>one natural order</td><td>as many as you like</td></tr>
<tr><td>Used by</td><td><code>Collections.sort(list)</code>, TreeSet()</td><td><code>list.sort(cmp)</code>, <code>new TreeSet&lt;&gt;(cmp)</code></td></tr>
</table>
`,

  samples: [
    {
      title: "Comparable and several Comparators",
      code: J`import java.util.*;

class Student implements Comparable<Student> {
    int roll;
    String name;
    double cgpa;

    Student(int roll, String name, double cgpa) {
        this.roll = roll; this.name = name; this.cgpa = cgpa;
    }

    @Override
    public int compareTo(Student o) {
        return Integer.compare(roll, o.roll);
    }

    @Override
    public String toString() { return roll + ":" + name + ":" + cgpa; }
}

public class Main {
    public static void main(String[] args) {
        List<Student> list = new ArrayList<>(Arrays.asList(
            new Student(3, "Zoya", 8.1), new Student(1, "Mihir", 9.2), new Student(2, "Ananya", 8.1)));
        Collections.sort(list);
        System.out.println(list);
        list.sort((a, b) -> a.name.compareTo(b.name));
        System.out.println(list);
        list.sort(Comparator.comparingDouble((Student s) -> s.cgpa).reversed().thenComparing(s -> s.name));
        System.out.println(list);
    }
}`,
      output: "[1:Mihir:9.2, 2:Ananya:8.1, 3:Zoya:8.1]\n[2:Ananya:8.1, 1:Mihir:9.2, 3:Zoya:8.1]\n[1:Mihir:9.2, 2:Ananya:8.1, 3:Zoya:8.1]",
    },
    {
      title: "Iterator removal",
      code: J`import java.util.*;

public class Iter {
    public static void main(String[] args) {
        List<String> emails = new ArrayList<>(Arrays.asList("a@x.com", "", "b@y.in", "bad", "c@z.org"));
        Iterator<String> it = emails.iterator();
        while (it.hasNext()) {
            String e = it.next();
            if (!e.contains("@")) it.remove();
        }
        System.out.println(emails);
        ListIterator<String> li = emails.listIterator(emails.size());
        while (li.hasPrevious()) System.out.print(li.previous() + " ");
        System.out.println();
    }
}`,
      output: "[a@x.com, b@y.in, c@z.org]\nc@z.org b@y.in a@x.com",
    },
  ],

  practice: [
    {
      id: "c12t6p1", title: "Natural order for Product",
      task: "<p>Make <code>Product</code> (name, price) implement <code>Comparable&lt;Product&gt;</code> ordered by price (lowest first). Sort the list with <code>Collections.sort</code> and print it.</p>",
      expected: "[Pen 20.0, Notebook 55.0, Bag 899.0, Shoes 1499.0]",
      mustUse: ["implements Comparable<Product>", "Double.compare"],
      hints: ["<code>public int compareTo(Product o) { return Double.compare(price, o.price); }</code>", "Override toString to return name + \" \" + price."],
      solution: J`import java.util.*;

class Product implements Comparable<Product> {
    String name;
    double price;
    Product(String name, double price) { this.name = name; this.price = price; }

    @Override
    public int compareTo(Product o) {
        return Double.compare(price, o.price);
    }

    @Override
    public String toString() { return name + " " + price; }
}

public class Main {
    public static void main(String[] args) {
        List<Product> list = new ArrayList<>();
        list.add(new Product("Bag", 899));
        list.add(new Product("Pen", 20));
        list.add(new Product("Shoes", 1499));
        list.add(new Product("Notebook", 55));
        Collections.sort(list);
        System.out.println(list);
    }
}`,
    },
    {
      id: "c12t6p2", title: "Leaderboard with Comparator",
      task: "<p>Players have name and score. Sort by score <b>descending</b>; if scores are equal, by name ascending. Print a numbered leaderboard.</p>",
      expected: "1. Isha 980\n2. Arjun 870\n3. Kabir 870\n4. Dev 640",
      mustUse: ["Comparator"],
      hints: ["<code>list.sort((a, b) -> b.score != a.score ? Integer.compare(b.score, a.score) : a.name.compareTo(b.name));</code>"],
      solution: J`import java.util.*;

class Player {
    String name;
    int score;
    Player(String name, int score) { this.name = name; this.score = score; }
}

public class Main {
    public static void main(String[] args) {
        List<Player> list = new ArrayList<>(Arrays.asList(
            new Player("Kabir", 870), new Player("Dev", 640), new Player("Isha", 980), new Player("Arjun", 870)));
        Comparator<Player> byScoreDesc = (a, b) -> Integer.compare(b.score, a.score);
        list.sort(byScoreDesc.thenComparing(p -> p.name));
        for (int i = 0; i < list.size(); i++) {
            System.out.println((i + 1) + ". " + list.get(i).name + " " + list.get(i).score);
        }
    }
}`,
    },
    {
      id: "c12t6p3", title: "Sort words by length",
      task: "<p>Sort <code>[\"banana\", \"fig\", \"cherry\", \"kiwi\", \"apple\"]</code> by length (shortest first), and alphabetically for equal lengths. Then print a TreeSet of the same words with a <b>reverse</b> alphabetical Comparator.</p>",
      expected: "[fig, kiwi, apple, banana, cherry]\n[kiwi, fig, cherry, banana, apple]",
      mustUse: ["Comparator.comparing", "Comparator.reverseOrder()"],
      hints: ["<code>words.sort(Comparator.comparing(String::length).thenComparing(Comparator.naturalOrder()));</code>", "<code>new TreeSet&lt;&gt;(Comparator.reverseOrder())</code>"],
      solution: J`import java.util.*;

public class Main {
    public static void main(String[] args) {
        List<String> words = new ArrayList<>(Arrays.asList("banana", "fig", "cherry", "kiwi", "apple"));
        words.sort(Comparator.comparing(String::length).thenComparing(Comparator.naturalOrder()));
        System.out.println(words);
        Set<String> rev = new TreeSet<>(Comparator.reverseOrder());
        rev.addAll(words);
        System.out.println(rev);
    }
}`,
    },
  ],

  fill: [
    { id: "c12t6f1", prompt: "Method of Comparable and method of Comparator.", template: "Comparable → ___(T o)\nComparator → ___(T a, T b)", answers: [["compareTo"], ["compare"]], explain: "compareTo inside the class; compare in a separate comparator." },
    { id: "c12t6f2", prompt: "Remove safely while iterating.", template: "while (it.hasNext()) { if (it.next() < 0) it.___(); }", answers: [["remove"]], explain: "Iterator.remove() avoids ConcurrentModificationException." },
  ],

  quiz: [
    { type: "mcq", q: "compareTo returns a negative number when…", options: ["this comes after other", "this comes before other", "they are equal", "other is null"], answer: 1, explain: "Negative = this first." },
    { type: "mcq", q: "You need to sort Employees by salary in one screen and by name in another. Best tool?", options: ["Comparable only", "two Comparators", "two compareTo methods", "a TreeSet"], answer: 1, explain: "A class has one natural order; extra orders come from Comparators." },
    { type: "output", q: "Predict the output.", code: J`import java.util.*;
public class Q {
    public static void main(String[] args) {
        List<Integer> l = new ArrayList<>(Arrays.asList(5, 1, 4));
        l.sort((a, b) -> b - a);
        System.out.println(l);
    }
}`, answer: "[5, 4, 1]", explain: "b − a sorts descending." },
    { type: "mcq", q: "Why prefer <code>Integer.compare(a, b)</code> over <code>a - b</code>?", options: ["faster", "a - b can overflow for large values", "a - b doesn't compile", "no reason"], answer: 1, explain: "e.g. Integer.MIN_VALUE − 1 overflows." },
  ],
};
