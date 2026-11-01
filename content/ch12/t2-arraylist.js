const J = String.raw;

export default {
  title: "ArrayList",
  summary: "The most-used collection: a resizable array. Add, get, set, remove, search, sort, and loop — plus the ConcurrentModificationException trap.",

  concept: J`
<h2>Concept</h2>
<p><code>ArrayList&lt;E&gt;</code> is a <b>resizable array</b> that implements <code>List</code>. It keeps insertion order, allows duplicates and nulls, and gives fast access by index.</p>
<pre class="java">import java.util.ArrayList;
import java.util.List;

List&lt;String&gt; names = new ArrayList&lt;&gt;();    // declare with the interface type</pre>

<h3>Important methods</h3>
<table>
<tr><th>Method</th><th>Does</th></tr>
<tr><td><code>add(e)</code> / <code>add(i, e)</code></td><td>append / insert at index i (shifts the rest right)</td></tr>
<tr><td><code>get(i)</code></td><td>element at index i</td></tr>
<tr><td><code>set(i, e)</code></td><td>replace element at i, returns the old one</td></tr>
<tr><td><code>remove(i)</code> / <code>remove(obj)</code></td><td>remove by index / first equal object</td></tr>
<tr><td><code>size()</code>, <code>isEmpty()</code>, <code>clear()</code></td><td>count / empty? / remove all</td></tr>
<tr><td><code>contains(o)</code>, <code>indexOf(o)</code>, <code>lastIndexOf(o)</code></td><td>search (uses <code>equals</code>)</td></tr>
<tr><td><code>addAll(coll)</code>, <code>removeAll(coll)</code>, <code>retainAll(coll)</code></td><td>bulk operations</td></tr>
<tr><td><code>removeIf(predicate)</code></td><td>remove every element matching a lambda</td></tr>
<tr><td><code>Collections.sort(list)</code> / <code>list.sort(null)</code></td><td>sort ascending</td></tr>
<tr><td><code>Collections.reverse</code>, <code>max</code>, <code>min</code>, <code>frequency</code></td><td>handy utilities</td></tr>
<tr><td><code>toString()</code></td><td>"[a, b, c]" — just print the list</td></tr>
</table>

<h3>Looping</h3>
<pre class="java">for (int i = 0; i &lt; list.size(); i++) …   // index loop
for (String s : list) …                     // for-each
list.forEach(s -&gt; System.out.println(s));   // lambda</pre>

<h3>ConcurrentModificationException</h3>
<p>Removing elements inside a for-each loop over the same list throws <code>ConcurrentModificationException</code>. Use <code>removeIf</code>, an <code>Iterator</code>'s <code>remove()</code>, or loop backwards with an index.</p>

<h3>ArrayList vs array</h3>
<table>
<tr><th></th><th>Array</th><th>ArrayList</th></tr>
<tr><td>Size</td><td>fixed</td><td>grows automatically (about 1.5× when full; default capacity 10)</td></tr>
<tr><td>Elements</td><td>primitives or objects</td><td>objects only (autoboxing)</td></tr>
<tr><td>Length</td><td><code>arr.length</code></td><td><code>list.size()</code></td></tr>
<tr><td>Methods</td><td>few (Arrays class helps)</td><td>many</td></tr>
</table>

<h3>Performance</h3>
<p><code>get</code>/<code>set</code> are instant (O(1)). <code>add</code> at the end is fast. Inserting or removing near the <b>start</b> is slow for big lists because elements must shift (O(n)).</p>

<h3>Fixed-size lists</h3>
<p><code>Arrays.asList(1, 2, 3)</code> returns a list backed by an array — you can <code>set</code> but not <code>add</code>/<code>remove</code> (UnsupportedOperationException). Wrap it to get a normal list: <code>new ArrayList&lt;&gt;(Arrays.asList(…))</code>. (Java 9+ also has <code>List.of(…)</code>, which is completely unmodifiable.)</p>
`,

  samples: [
    {
      title: "Core operations",
      code: J`import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class ListDemo {
    public static void main(String[] args) {
        List<String> cities = new ArrayList<>();
        cities.add("Pune");
        cities.add("Delhi");
        cities.add("Chennai");
        cities.add(1, "Jaipur");
        System.out.println(cities + " size " + cities.size());
        cities.set(2, "New Delhi");
        cities.remove("Pune");
        System.out.println(cities);
        System.out.println(cities.contains("Chennai") + " " + cities.indexOf("Chennai"));
        Collections.sort(cities);
        System.out.println(cities);
        System.out.println(cities.get(0) + " .. " + cities.get(cities.size() - 1));
    }
}`,
      output: "[Pune, Jaipur, Delhi, Chennai] size 4\n[Jaipur, New Delhi, Chennai]\ntrue 2\n[Chennai, Jaipur, New Delhi]\nChennai .. New Delhi",
    },
    {
      title: "Removing safely",
      code: J`import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class Remove {
    public static void main(String[] args) {
        List<Integer> marks = new ArrayList<>(Arrays.asList(45, 12, 78, 33, 90, 28));
        try {
            for (Integer m : marks) {
                if (m < 35) marks.remove(m);
            }
        } catch (java.util.ConcurrentModificationException e) {
            System.out.println("ConcurrentModificationException!");
        }
        marks = new ArrayList<>(Arrays.asList(45, 12, 78, 33, 90, 28));
        marks.removeIf(m -> m < 35);
        System.out.println(marks);
    }
}`,
      output: "ConcurrentModificationException!\n[45, 78, 90]",
    },
  ],

  practice: [
    {
      id: "c12t2p1", title: "Shopping list manager",
      task: "<p>Start with an empty <code>ArrayList&lt;String&gt;</code>. Add Rice, Dal, Oil, Sugar. Insert Salt at index 2. Replace Sugar with Jaggery. Remove Dal. Print the list, its size, and whether it contains Oil.</p>",
      expected: "[Rice, Salt, Oil, Jaggery]\nItems: 4\nHas Oil: true",
      mustUse: ["add(2,", ".set(", ".remove("],
      hints: ["Use indexOf(\"Sugar\") to find where to set Jaggery."],
      solution: J`import java.util.ArrayList;
import java.util.List;

public class Main {
    public static void main(String[] args) {
        List<String> list = new ArrayList<>();
        list.add("Rice");
        list.add("Dal");
        list.add("Oil");
        list.add("Sugar");
        list.add(2, "Salt");
        list.set(list.indexOf("Sugar"), "Jaggery");
        list.remove("Dal");
        System.out.println(list);
        System.out.println("Items: " + list.size());
        System.out.println("Has Oil: " + list.contains("Oil"));
    }
}`,
    },
    {
      id: "c12t2p2", title: "Marks statistics",
      task: "<p>Read the marks from the input text into an <code>ArrayList&lt;Integer&gt;</code>, then print the count, average, highest and lowest (use <code>Collections.max/min</code>), and the list sorted in descending order.</p>",
      starter: J`import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner("67 89 45 92 73 58");
    }
}`,
      expected: "Count: 6\nAverage: 70.66666666666667\nHighest: 92, Lowest: 45\n[92, 89, 73, 67, 58, 45]",
      mustUse: ["Collections.max", "Collections.min"],
      hints: ["Descending: <code>Collections.sort(list); Collections.reverse(list);</code> or <code>list.sort(Collections.reverseOrder());</code>"],
      solution: J`import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner("67 89 45 92 73 58");
        List<Integer> marks = new ArrayList<>();
        while (sc.hasNextInt()) marks.add(sc.nextInt());
        int sum = 0;
        for (int m : marks) sum += m;
        System.out.println("Count: " + marks.size());
        System.out.println("Average: " + (double) sum / marks.size());
        System.out.println("Highest: " + Collections.max(marks) + ", Lowest: " + Collections.min(marks));
        marks.sort(Collections.reverseOrder());
        System.out.println(marks);
    }
}`,
    },
    {
      id: "c12t2p3", title: "List of objects",
      task: "<p>Class <code>Task</code> has <code>title</code> and <code>done</code>. Add four tasks to an ArrayList, mark two as done, then remove the done ones with <code>removeIf</code> and print the remaining titles.</p>",
      expected: "Pending: 2\nWrite report\nCall plumber",
      mustUse: ["removeIf"],
      hints: ["<code>tasks.removeIf(t -> t.done);</code>"],
      solution: J`import java.util.ArrayList;
import java.util.List;

class Task {
    String title;
    boolean done;
    Task(String title) { this.title = title; }
}

public class Main {
    public static void main(String[] args) {
        List<Task> tasks = new ArrayList<>();
        tasks.add(new Task("Buy milk"));
        tasks.add(new Task("Write report"));
        tasks.add(new Task("Pay fees"));
        tasks.add(new Task("Call plumber"));
        tasks.get(0).done = true;
        tasks.get(2).done = true;
        tasks.removeIf(t -> t.done);
        System.out.println("Pending: " + tasks.size());
        for (Task t : tasks) System.out.println(t.title);
    }
}`,
    },
    {
      id: "c12t2p4", title: "Merge without duplicates",
      task: "<p>Two clubs' members: A = [Asha, Ravi, Neel, Tara], B = [Neel, Joy, Asha]. Build: (1) everyone, without duplicates, in order of first appearance; (2) members of both clubs. Use ArrayList methods.</p>",
      expected: "All: [Asha, Ravi, Neel, Tara, Joy]\nBoth: [Asha, Neel]",
      mustUse: ["retainAll"],
      hints: ["All: copy A, then add each name of B if not contains.", "Both: <code>List&lt;String&gt; both = new ArrayList&lt;&gt;(a); both.retainAll(b);</code>"],
      solution: J`import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class Main {
    public static void main(String[] args) {
        List<String> a = Arrays.asList("Asha", "Ravi", "Neel", "Tara");
        List<String> b = Arrays.asList("Neel", "Joy", "Asha");
        List<String> all = new ArrayList<>(a);
        for (String n : b) {
            if (!all.contains(n)) all.add(n);
        }
        List<String> both = new ArrayList<>(a);
        both.retainAll(b);
        System.out.println("All: " + all);
        System.out.println("Both: " + both);
    }
}`,
    },
  ],

  fill: [
    { id: "c12t2f1", prompt: "Number of elements and element at index 3.", template: "int n = list.___();\nString s = list.___(3);", answers: [["size"], ["get"]], explain: "size() and get(index)." },
    { id: "c12t2f2", prompt: "Remove all negative numbers.", template: "nums.___(x -> x < 0);", answers: [["removeIf"]], explain: "removeIf takes a Predicate." },
  ],

  quiz: [
    { type: "output", q: "Predict the output.", code: J`import java.util.*;
public class Q {
    public static void main(String[] args) {
        List<String> l = new ArrayList<>();
        l.add("a"); l.add("b"); l.add(0, "c"); l.add("a");
        l.remove("a");
        System.out.println(l + " " + l.indexOf("a"));
    }
}`, answer: "[c, b, a] 2", explain: "remove(Object) removes the first \"a\" only." },
    { type: "mcq", q: "<code>Arrays.asList(1,2,3).add(4)</code> —", options: ["[1, 2, 3, 4]", "UnsupportedOperationException", "compile error", "ignored"], answer: 1, explain: "Arrays.asList returns a fixed-size list." },
    { type: "mcq", q: "Which ArrayList operation is slowest for a large list?", options: ["get(i)", "set(i, x)", "add at the end", "remove(0)"], answer: 3, explain: "Every other element must shift left." },
    { type: "mcq", q: "Removing elements inside a for-each over the same ArrayList usually causes…", options: ["nothing", "ConcurrentModificationException", "NullPointerException", "an infinite loop"], answer: 1, explain: "Use removeIf or an Iterator." },
  ],
};
