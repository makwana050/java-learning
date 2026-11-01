const J = String.raw;

export default {
  title: "Set: HashSet, LinkedHashSet, TreeSet",
  summary: "Collections of unique elements. Choose the right Set for the order you need, and understand how equals() and hashCode() decide uniqueness.",

  concept: J`
<h2>Concept</h2>
<p>A <code>Set</code> holds <b>no duplicates</b>. Adding an element that is already there does nothing (<code>add</code> returns false). There is no index — no <code>get(i)</code>.</p>
<table>
<tr><th>Class</th><th>Order when you loop/print</th><th>Speed of add/contains</th><th>null?</th><th>Built on</th></tr>
<tr><td><code>HashSet</code></td><td><b>no guaranteed order</b></td><td>fastest (O(1))</td><td>one null</td><td>hash table</td></tr>
<tr><td><code>LinkedHashSet</code></td><td><b>insertion order</b></td><td>fast</td><td>one null</td><td>hash table + linked list</td></tr>
<tr><td><code>TreeSet</code></td><td><b>sorted</b> (natural order or a Comparator)</td><td>O(log n)</td><td>no null</td><td>red-black tree</td></tr>
</table>

<h3>Common methods</h3>
<p><code>add</code>, <code>remove</code>, <code>contains</code>, <code>size</code>, <code>isEmpty</code>, <code>clear</code>, and set algebra:</p>
<table>
<tr><th>Operation</th><th>Code (modifies a)</th></tr>
<tr><td>Union a ∪ b</td><td><code>a.addAll(b)</code></td></tr>
<tr><td>Intersection a ∩ b</td><td><code>a.retainAll(b)</code></td></tr>
<tr><td>Difference a − b</td><td><code>a.removeAll(b)</code></td></tr>
<tr><td>Subset?</td><td><code>a.containsAll(b)</code></td></tr>
</table>
<p>Copy first if you need to keep the original: <code>Set&lt;String&gt; u = new TreeSet&lt;&gt;(a); u.addAll(b);</code></p>

<h3>TreeSet extras (NavigableSet)</h3>
<p><code>first()</code>, <code>last()</code>, <code>floor(x)</code> (≤ x), <code>ceiling(x)</code> (≥ x), <code>headSet(x)</code> (&lt; x), <code>tailSet(x)</code> (≥ x), <code>descendingSet()</code>.</p>

<h3>How a HashSet decides "duplicate"</h3>
<ol>
<li>It computes <code>hashCode()</code> to find a bucket.</li>
<li>Inside the bucket it compares with <code>equals()</code>.</li>
</ol>
<p>So for your own classes you must override <b>both</b> equals and hashCode (Classes chapter), or two "equal" objects will both be kept. A TreeSet instead uses <code>compareTo</code>/<code>Comparator</code>: elements that compare as 0 are duplicates.</p>
<div class="warn">Never rely on HashSet's printing order — it can differ between Java versions and set sizes. Use LinkedHashSet or TreeSet when order matters.</div>
`,

  samples: [
    {
      title: "Three sets, same input",
      code: J`import java.util.*;

public class Sets {
    public static void main(String[] args) {
        String[] words = {"mango", "apple", "kiwi", "apple", "banana", "kiwi"};
        Set<String> linked = new LinkedHashSet<>();
        Set<String> tree = new TreeSet<>();
        Set<String> hash = new HashSet<>();
        for (String w : words) {
            linked.add(w);
            tree.add(w);
            hash.add(w);
        }
        System.out.println(linked);
        System.out.println(tree);
        System.out.println(hash.size() + " unique, contains kiwi? " + hash.contains("kiwi"));
        System.out.println(hash.add("mango"));
    }
}`,
      output: "[mango, apple, kiwi, banana]\n[apple, banana, kiwi, mango]\n4 unique, contains kiwi? true\nfalse",
    },
    {
      title: "Set algebra and TreeSet navigation",
      code: J`import java.util.*;

public class Algebra {
    public static void main(String[] args) {
        Set<Integer> a = new TreeSet<>(Arrays.asList(1, 2, 3, 4, 5));
        Set<Integer> b = new TreeSet<>(Arrays.asList(4, 5, 6, 7));
        Set<Integer> union = new TreeSet<>(a);
        union.addAll(b);
        Set<Integer> inter = new TreeSet<>(a);
        inter.retainAll(b);
        Set<Integer> diff = new TreeSet<>(a);
        diff.removeAll(b);
        System.out.println(union + " " + inter + " " + diff);
        TreeSet<Integer> scores = new TreeSet<>(Arrays.asList(35, 60, 72, 88, 95));
        System.out.println(scores.first() + " " + scores.last() + " " + scores.floor(70) + " " + scores.ceiling(70));
        System.out.println(scores.headSet(72) + " " + scores.descendingSet());
    }
}`,
      output: "[1, 2, 3, 4, 5, 6, 7] [4, 5] [1, 2, 3]\n35 95 60 72\n[35, 60] [95, 88, 72, 60, 35]",
    },
  ],

  practice: [
    {
      id: "c12t4p1", title: "Remove duplicates, keep order",
      task: "<p>Remove duplicate roll numbers from <code>{21, 7, 33, 7, 21, 18, 33, 5}</code> keeping the order of first appearance, then print them sorted as well.</p>",
      expected: "Unique in order: [21, 7, 33, 18, 5]\nSorted: [5, 7, 18, 21, 33]",
      mustUse: ["LinkedHashSet", "TreeSet"],
      hints: ["A LinkedHashSet keeps insertion order; <code>new TreeSet&lt;&gt;(linkedSet)</code> sorts it."],
      solution: J`import java.util.*;

public class Main {
    public static void main(String[] args) {
        int[] rolls = {21, 7, 33, 7, 21, 18, 33, 5};
        Set<Integer> unique = new LinkedHashSet<>();
        for (int r : rolls) unique.add(r);
        System.out.println("Unique in order: " + unique);
        System.out.println("Sorted: " + new TreeSet<>(unique));
    }
}`,
    },
    {
      id: "c12t4p2", title: "Common and exclusive subjects",
      task: "<p>Riya studies {Java, DBMS, OS, Maths} and Kunal studies {Java, Networks, Maths, AI}. Using TreeSets, print the subjects they share, the ones only Riya has, and all subjects together.</p>",
      expected: "Common: [Java, Maths]\nOnly Riya: [DBMS, OS]\nAll: [AI, DBMS, Java, Maths, Networks, OS]",
      mustUse: ["retainAll", "removeAll", "addAll"],
      hints: ["Make copies before each operation so the originals stay unchanged."],
      solution: J`import java.util.*;

public class Main {
    public static void main(String[] args) {
        Set<String> riya = new TreeSet<>(Arrays.asList("Java", "DBMS", "OS", "Maths"));
        Set<String> kunal = new TreeSet<>(Arrays.asList("Java", "Networks", "Maths", "AI"));
        Set<String> common = new TreeSet<>(riya);
        common.retainAll(kunal);
        Set<String> onlyRiya = new TreeSet<>(riya);
        onlyRiya.removeAll(kunal);
        Set<String> all = new TreeSet<>(riya);
        all.addAll(kunal);
        System.out.println("Common: " + common);
        System.out.println("Only Riya: " + onlyRiya);
        System.out.println("All: " + all);
    }
}`,
    },
    {
      id: "c12t4p3", title: "First repeated word",
      task: "<p>Find the first word that repeats in <code>\"to be or not to be that is\"</code> using a HashSet and the return value of <code>add</code>.</p>",
      expected: "First repeated: to",
      mustUse: ["HashSet", "!seen.add("],
      hints: ["<code>if (!seen.add(w)) { found = w; break; }</code> — add returns false when the word is already there."],
      solution: J`import java.util.*;

public class Main {
    public static void main(String[] args) {
        Set<String> seen = new HashSet<>();
        String found = "none";
        for (String w : "to be or not to be that is".split(" ")) {
            if (!seen.add(w)) {
                found = w;
                break;
            }
        }
        System.out.println("First repeated: " + found);
    }
}`,
    },
    {
      id: "c12t4p4", title: "Unique objects need equals and hashCode",
      task: "<p>Class <code>Student</code> (roll, name). Add Student(1,\"Asha\"), Student(2,\"Ben\") and another Student(1,\"Asha\") to a HashSet. Make the set treat students with the same roll as duplicates.</p>",
      expected: "Unique students: 2",
      mustUse: ["public boolean equals(Object", "public int hashCode()"],
      hints: ["Without these overrides the set size would be 3."],
      solution: J`import java.util.*;

class Student {
    int roll;
    String name;
    Student(int roll, String name) { this.roll = roll; this.name = name; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Student)) return false;
        return roll == ((Student) o).roll;
    }

    @Override
    public int hashCode() {
        return Integer.hashCode(roll);
    }
}

public class Main {
    public static void main(String[] args) {
        Set<Student> set = new HashSet<>();
        set.add(new Student(1, "Asha"));
        set.add(new Student(2, "Ben"));
        set.add(new Student(1, "Asha"));
        System.out.println("Unique students: " + set.size());
    }
}`,
    },
  ],

  fill: [
    { id: "c12t4f1", prompt: "Which Set keeps elements sorted, and which keeps insertion order?", template: "sorted → ___\ninsertion order → ___", answers: [["TreeSet"], ["LinkedHashSet"]], explain: "HashSet guarantees no order." },
    { id: "c12t4f2", prompt: "Keep only elements also in b (intersection).", template: "a.___(b);", answers: [["retainAll"]], explain: "retainAll = intersection." },
  ],

  quiz: [
    { type: "output", q: "Predict the output.", code: J`import java.util.*;
public class Q {
    public static void main(String[] args) {
        Set<Character> s = new TreeSet<>();
        for (char c : "banana".toCharArray()) s.add(c);
        System.out.println(s + " " + s.size());
    }
}`, answer: "[a, b, n] 3", explain: "Unique letters, sorted." },
    { type: "mcq", q: "What does <code>set.add(x)</code> return if x is already present?", options: ["true", "false", "throws", "null"], answer: 1, explain: "false — nothing was added." },
    { type: "mcq", q: "Which Set does NOT allow null?", options: ["HashSet", "LinkedHashSet", "TreeSet", "all allow null"], answer: 2, explain: "TreeSet must compare elements." },
    { type: "mcq", q: "HashSet uses which methods to detect duplicates?", options: ["toString and equals", "hashCode and equals", "compareTo only", "=="], answer: 1, explain: "hashCode for the bucket, equals inside it." },
  ],
};
