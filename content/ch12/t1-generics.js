const J = String.raw;

export default {
  title: "Autoboxing & generics",
  summary: "The two ideas you need before collections: how primitives become objects automatically, and how generics make containers type-safe.",

  concept: J`
<h2>Concept</h2>
<h3>The Collections Framework at a glance</h3>
<p>Arrays have a fixed size and few built-in operations. The <b>Java Collections Framework</b> (package <code>java.util</code>) gives you ready-made, resizable data structures:</p>
<pre>              Iterable
                 |
            Collection                         Map (separate tree)
        /        |         \                 /        |        \
     List       Set        Queue         HashMap  LinkedHashMap  TreeMap
   ArrayList  HashSet      PriorityQueue
   LinkedList LinkedHashSet ArrayDeque
              TreeSet</pre>
<table>
<tr><th>Interface</th><th>Idea</th><th>Duplicates?</th><th>Order</th></tr>
<tr><td><b>List</b></td><td>ordered sequence, index access</td><td>allowed</td><td>insertion order</td></tr>
<tr><td><b>Set</b></td><td>unique elements</td><td>no</td><td>depends on implementation</td></tr>
<tr><td><b>Queue</b></td><td>process in order (FIFO / priority)</td><td>allowed</td><td>by policy</td></tr>
<tr><td><b>Map</b></td><td>key → value pairs</td><td>keys unique</td><td>depends on implementation</td></tr>
</table>

<h3>Collections hold objects — wrapper classes and autoboxing</h3>
<p>Collections store <b>objects</b>, not primitives. You can't write <code>ArrayList&lt;int&gt;</code>; use the wrapper <code>ArrayList&lt;Integer&gt;</code>. Java converts automatically:</p>
<pre class="java">List&lt;Integer&gt; marks = new ArrayList&lt;&gt;();
marks.add(85);              // autoboxing: int 85 → Integer.valueOf(85)
int first = marks.get(0);   // unboxing: Integer → int</pre>
<div class="warn"><b>Traps:</b>
<ul>
<li>Unboxing <code>null</code> → <code>NullPointerException</code>: <code>Integer x = null; int y = x;</code></li>
<li>Comparing two <code>Integer</code> objects with <code>==</code> compares references. Values from -128 to 127 are cached so <code>==</code> happens to work; 1000 == 1000 may be <b>false</b>. Use <code>.equals()</code>.</li>
<li><code>list.remove(1)</code> on a <code>List&lt;Integer&gt;</code> removes the element at <b>index</b> 1; <code>list.remove(Integer.valueOf(1))</code> removes the <b>value</b> 1.</li>
</ul></div>

<h3>Generics — type parameters</h3>
<p>The <code>&lt;Integer&gt;</code> in <code>List&lt;Integer&gt;</code> is a <b>type argument</b>. It tells the compiler what the collection holds, so:</p>
<ul>
<li>adding the wrong type is a <b>compile error</b> (not a runtime crash);</li>
<li>no casts are needed when reading.</li>
</ul>
<pre class="java">List names = new ArrayList();          // raw type — avoid!
names.add("Asha"); names.add(42);      // anything goes
String s = (String) names.get(1);      // ClassCastException at runtime

List&lt;String&gt; safe = new ArrayList&lt;&gt;(); // the &lt;&gt; "diamond" infers String
safe.add(42);                          // ✗ compile error — caught early</pre>

<h3>Writing your own generic class and method</h3>
<pre class="java">class Box&lt;T&gt; {                  // T = a type chosen by the user of the class
    private T item;
    void put(T item) { this.item = item; }
    T get() { return item; }
}
Box&lt;String&gt; b = new Box&lt;&gt;();

static &lt;T&gt; void printTwice(T x) { … }      // generic method</pre>
<p>Common names: <code>T</code> type, <code>E</code> element, <code>K</code> key, <code>V</code> value. A <b>bounded</b> type <code>&lt;T extends Number&gt;</code> accepts only Number and its subclasses, so you may call <code>doubleValue()</code> on T.</p>
<p>Type arguments must be reference types — <code>Box&lt;int&gt;</code> is not allowed.</p>
`,

  samples: [
    {
      title: "Autoboxing and the Integer cache",
      code: J`import java.util.ArrayList;
import java.util.List;

public class Boxing {
    public static void main(String[] args) {
        List<Integer> nums = new ArrayList<>();
        nums.add(5);
        nums.add(10);
        nums.add(1);
        int sum = 0;
        for (int n : nums) sum += n;
        System.out.println("Sum: " + sum);
        nums.remove(1);
        System.out.println(nums);
        nums.remove(Integer.valueOf(1));
        System.out.println(nums);
        Integer a = 127, b = 127, c = 1000, d = 1000;
        System.out.println((a == b) + " " + (c == d) + " " + c.equals(d));
    }
}`,
      output: "Sum: 16\n[5, 1]\n[5]\ntrue false true",
    },
    {
      title: "A generic class and a bounded method",
      code: J`class Pair<K, V> {
    private K key;
    private V value;
    Pair(K key, V value) { this.key = key; this.value = value; }
    K getKey() { return key; }
    V getValue() { return value; }
    @Override public String toString() { return key + "=" + value; }
}

public class Main {
    static <T extends Number> double total(T[] values) {
        double s = 0;
        for (T v : values) s += v.doubleValue();
        return s;
    }

    public static void main(String[] args) {
        Pair<String, Integer> p = new Pair<>("roll", 21);
        Pair<String, Double> q = new Pair<>("cgpa", 8.6);
        System.out.println(p + ", " + q);
        int r = p.getValue() + 1;
        System.out.println(r);
        Integer[] ints = {1, 2, 3};
        Double[] dbls = {1.5, 2.5};
        System.out.println(total(ints) + " " + total(dbls));
    }
}`,
      output: "roll=21, cgpa=8.6\n22\n6.0 4.0",
    },
  ],

  practice: [
    {
      id: "c12t1p1", title: "Generic Box",
      task: "<p>Write <code>class Box&lt;T&gt;</code> with <code>put(T)</code>, <code>T get()</code> and <code>boolean isEmpty()</code>. Use a <code>Box&lt;String&gt;</code> and a <code>Box&lt;Integer&gt;</code>.</p>",
      expected: "empty? true\nMango\n42\nempty? false",
      mustUse: ["class Box<T>", "Box<String>", "Box<Integer>"],
      hints: ["isEmpty: <code>return item == null;</code>"],
      solution: J`class Box<T> {
    private T item;
    void put(T item) { this.item = item; }
    T get() { return item; }
    boolean isEmpty() { return item == null; }
}

public class Main {
    public static void main(String[] args) {
        Box<String> fruit = new Box<>();
        System.out.println("empty? " + fruit.isEmpty());
        fruit.put("Mango");
        System.out.println(fruit.get());
        Box<Integer> number = new Box<>();
        number.put(42);
        int n = number.get();
        System.out.println(n);
        System.out.println("empty? " + number.isEmpty());
    }
}`,
    },
    {
      id: "c12t1p2", title: "Generic max",
      task: "<p>Write a generic method <code>static &lt;T extends Comparable&lt;T&gt;&gt; T max(T[] a)</code> that returns the largest element using <code>compareTo</code>. Test with Integer[] {4, 19, 7}, String[] {\"pear\", \"apple\", \"zebra\"} and Double[] {2.5, 1.5}.</p>",
      expected: "19\nzebra\n2.5",
      mustUse: ["<T extends Comparable<T>>", "compareTo"],
      hints: ["<code>T best = a[0]; for (T x : a) if (x.compareTo(best) > 0) best = x; return best;</code>"],
      solution: J`public class Main {
    static <T extends Comparable<T>> T max(T[] a) {
        T best = a[0];
        for (T x : a) {
            if (x.compareTo(best) > 0) best = x;
        }
        return best;
    }

    public static void main(String[] args) {
        System.out.println(max(new Integer[] {4, 19, 7}));
        System.out.println(max(new String[] {"pear", "apple", "zebra"}));
        System.out.println(max(new Double[] {2.5, 1.5}));
    }
}`,
    },
    {
      id: "c12t1p3", title: "Integer comparison bug",
      task: "<p>This program compares Integer objects with <code>==</code> and gives a wrong answer for large values. Fix it.</p>",
      starter: J`import java.util.ArrayList;
import java.util.List;

public class Main {
    public static void main(String[] args) {
        List<Integer> scores = new ArrayList<>();
        scores.add(1500);
        scores.add(1500);
        scores.add(90);
        scores.add(90);
        System.out.println("First pair equal? " + (scores.get(0) == scores.get(1)));
        System.out.println("Second pair equal? " + (scores.get(2) == scores.get(3)));
    }
}`,
      expected: "First pair equal? true\nSecond pair equal? true",
      mustUse: [".equals("],
      hints: ["Use <code>scores.get(0).equals(scores.get(1))</code> — == only works by luck for -128..127."],
      solution: J`import java.util.ArrayList;
import java.util.List;

public class Main {
    public static void main(String[] args) {
        List<Integer> scores = new ArrayList<>();
        scores.add(1500);
        scores.add(1500);
        scores.add(90);
        scores.add(90);
        System.out.println("First pair equal? " + scores.get(0).equals(scores.get(1)));
        System.out.println("Second pair equal? " + scores.get(2).equals(scores.get(3)));
    }
}`,
    },
  ],

  fill: [
    { id: "c12t1f1", prompt: "A list of doubles (with the diamond operator).", template: "List<___> prices = new ArrayList<>();", answers: [["Double"]], explain: "Use the wrapper type Double; the diamond <> on the right infers it." },
    { id: "c12t1f2", prompt: "Declare a generic class with one type parameter.", template: "class Holder<___> { ___ value; }", answers: [["T"], ["T"]], explain: "T is a placeholder for a real type." },
  ],

  quiz: [
    { type: "mcq", q: "Why can't you write <code>List&lt;int&gt;</code>?", options: ["int is too small", "type arguments must be reference types", "List only stores Strings", "it's allowed"], answer: 1, explain: "Use Integer." },
    { type: "output", q: "Predict the output.", code: J`import java.util.*;
public class Q {
    public static void main(String[] args) {
        List<Integer> a = new ArrayList<>(Arrays.asList(10, 20, 30, 20));
        a.remove(Integer.valueOf(20));
        a.remove(0);
        System.out.println(a);
    }
}`, answer: "[30, 20]", explain: "First removes the value 20 (first occurrence), then index 0." },
    { type: "mcq", q: "Main benefit of generics?", options: ["faster loops", "compile-time type safety and no casts", "smaller memory", "allow primitives"], answer: 1, explain: "Errors are caught by the compiler." },
    { type: "mcq", q: "Which collection type does NOT allow duplicates?", options: ["List", "Set", "Queue", "ArrayList"], answer: 1, explain: "Sets keep unique elements." },
  ],
};
