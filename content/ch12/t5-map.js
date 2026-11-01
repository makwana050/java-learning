const J = String.raw;

export default {
  title: "Map: HashMap, LinkedHashMap, TreeMap",
  summary: "Store key → value pairs: phone books, word counts, marks by roll number. Learn put/get, iteration over entries, counting patterns and which Map to choose.",

  concept: J`
<h2>Concept</h2>
<p>A <code>Map&lt;K, V&gt;</code> stores <b>key–value pairs</b>. Each key appears <b>once</b>; putting an existing key replaces its value. Maps are not part of <code>Collection</code>, but are part of the framework.</p>
<pre class="java">Map&lt;String, Integer&gt; marks = new HashMap&lt;&gt;();
marks.put("Asha", 88);
marks.put("Ravi", 74);
marks.put("Asha", 91);        // replaces 88
marks.get("Asha");            // 91
marks.get("Zoya");            // null — key not present</pre>

<h3>Important methods</h3>
<table>
<tr><th>Method</th><th>Does</th></tr>
<tr><td><code>put(k, v)</code></td><td>add or replace; returns the old value (or null)</td></tr>
<tr><td><code>get(k)</code>, <code>getOrDefault(k, d)</code></td><td>value for k (or d if missing)</td></tr>
<tr><td><code>containsKey(k)</code>, <code>containsValue(v)</code></td><td>search</td></tr>
<tr><td><code>remove(k)</code>, <code>size()</code>, <code>isEmpty()</code>, <code>clear()</code></td><td></td></tr>
<tr><td><code>putIfAbsent(k, v)</code></td><td>put only if the key is new</td></tr>
<tr><td><code>merge(k, 1, Integer::sum)</code></td><td>counting in one line: add 1 or start at 1</td></tr>
<tr><td><code>keySet()</code>, <code>values()</code>, <code>entrySet()</code></td><td>views for looping</td></tr>
</table>

<h3>Looping over a map</h3>
<pre class="java">for (Map.Entry&lt;String, Integer&gt; e : marks.entrySet()) {
    System.out.println(e.getKey() + " = " + e.getValue());
}
for (String name : marks.keySet()) …
marks.forEach((k, v) -&gt; System.out.println(k + ": " + v));</pre>

<h3>The counting pattern</h3>
<pre class="java">Map&lt;String, Integer&gt; freq = new TreeMap&lt;&gt;();
for (String w : words) {
    freq.put(w, freq.getOrDefault(w, 0) + 1);   // or: freq.merge(w, 1, Integer::sum);
}</pre>

<h3>Which Map?</h3>
<table>
<tr><th>Class</th><th>Key order</th><th>null key?</th><th>Speed</th></tr>
<tr><td><code>HashMap</code></td><td>no guaranteed order</td><td>one</td><td>O(1)</td></tr>
<tr><td><code>LinkedHashMap</code></td><td>insertion order</td><td>one</td><td>O(1)</td></tr>
<tr><td><code>TreeMap</code></td><td>sorted by key (<code>firstKey</code>, <code>lastKey</code>, <code>headMap</code>…)</td><td>no</td><td>O(log n)</td></tr>
<tr><td><code>Hashtable</code> (legacy)</td><td>none</td><td>no</td><td>synchronized, old — prefer ConcurrentHashMap</td></tr>
</table>
<p>Keys use <code>equals</code>/<code>hashCode</code> (HashMap) or <code>compareTo</code> (TreeMap) — just like sets. Strings and wrapper classes are ideal keys. Don't change an object while it's used as a key.</p>

<h3>How HashMap works (briefly)</h3>
<p>It keeps an array of buckets. <code>hashCode()</code> of the key picks a bucket; <code>equals()</code> finds the exact key inside it. When the map gets about 75% full (load factor 0.75), it doubles the array and redistributes entries. Since Java 8, a very crowded bucket turns into a small tree to stay fast.</p>
`,

  samples: [
    {
      title: "Phone book",
      code: J`import java.util.*;

public class PhoneBook {
    public static void main(String[] args) {
        Map<String, String> book = new TreeMap<>();
        book.put("Nikhil", "98111");
        book.put("Arti", "98222");
        book.put("Manoj", "98333");
        book.put("Arti", "90000");
        System.out.println(book);
        System.out.println(book.get("Manoj") + " " + book.get("Zara") + " " + book.getOrDefault("Zara", "not saved"));
        System.out.println(book.containsKey("Nikhil") + " " + book.size());
        book.remove("Nikhil");
        for (Map.Entry<String, String> e : book.entrySet()) {
            System.out.println(e.getKey() + " -> " + e.getValue());
        }
    }
}`,
      output: "{Arti=90000, Manoj=98333, Nikhil=98111}\n98333 null not saved\ntrue 3\nArti -> 90000\nManoj -> 98333",
    },
    {
      title: "Word frequency",
      code: J`import java.util.*;

public class WordCount {
    public static void main(String[] args) {
        String text = "the cat and the dog and the bird";
        Map<String, Integer> freq = new LinkedHashMap<>();
        for (String w : text.split(" ")) {
            freq.put(w, freq.getOrDefault(w, 0) + 1);
        }
        System.out.println(freq);
        Map<Character, Integer> letters = new TreeMap<>();
        for (char c : "mississippi".toCharArray()) letters.merge(c, 1, Integer::sum);
        System.out.println(letters);
    }
}`,
      output: "{the=3, cat=1, and=2, dog=1, bird=1}\n{i=4, m=1, p=2, s=4}",
    },
  ],

  practice: [
    {
      id: "c12t5p1", title: "Marks register",
      task: "<p>Store marks in a <code>TreeMap&lt;Integer, Integer&gt;</code> (roll → marks): 104→78, 101→92, 103→55, 102→81. Print all entries in roll order as <code>roll: marks</code>, then the topper's roll number and the average.</p>",
      expected: "101: 92\n102: 81\n103: 55\n104: 78\nTopper: 101\nAverage: 76.5",
      mustUse: ["TreeMap", "entrySet()"],
      hints: ["Loop over entrySet(); track the entry with the highest value."],
      solution: J`import java.util.*;

public class Main {
    public static void main(String[] args) {
        Map<Integer, Integer> marks = new TreeMap<>();
        marks.put(104, 78);
        marks.put(101, 92);
        marks.put(103, 55);
        marks.put(102, 81);
        int topRoll = -1, best = -1, sum = 0;
        for (Map.Entry<Integer, Integer> e : marks.entrySet()) {
            System.out.println(e.getKey() + ": " + e.getValue());
            sum += e.getValue();
            if (e.getValue() > best) {
                best = e.getValue();
                topRoll = e.getKey();
            }
        }
        System.out.println("Topper: " + topRoll);
        System.out.println("Average: " + (double) sum / marks.size());
    }
}`,
    },
    {
      id: "c12t5p2", title: "Character frequency with a Map",
      task: "<p>Count every letter (ignore spaces, case-insensitive) in <code>\"Java Lab Rocks\"</code> using a <code>TreeMap&lt;Character, Integer&gt;</code> and print the map.</p>",
      expected: "{a=3, b=1, c=1, j=1, k=1, l=1, o=1, r=1, s=1, v=1}",
      mustUse: ["TreeMap", "getOrDefault"],
      hints: ["Lower-case the text first; skip ' '.", "<code>freq.put(c, freq.getOrDefault(c, 0) + 1);</code>"],
      solution: J`import java.util.*;

public class Main {
    public static void main(String[] args) {
        Map<Character, Integer> freq = new TreeMap<>();
        for (char c : "Java Lab Rocks".toLowerCase().toCharArray()) {
            if (c == ' ') continue;
            freq.put(c, freq.getOrDefault(c, 0) + 1);
        }
        System.out.println(freq);
    }
}`,
    },
    {
      id: "c12t5p3", title: "Group students by grade",
      task: "<p>Group names by grade into a <code>TreeMap&lt;Character, List&lt;String&gt;&gt;</code>. Data: Aman 'B', Bina 'A', Chirag 'C', Dia 'A', Esha 'B'.</p>",
      expected: "A: [Bina, Dia]\nB: [Aman, Esha]\nC: [Chirag]",
      mustUse: ["Map<Character, List<String>>"],
      hints: ["If the grade isn't a key yet, put a new ArrayList; then get(grade).add(name).", "Shortcut (Java 8): <code>map.computeIfAbsent(g, k -> new ArrayList&lt;&gt;()).add(name);</code>"],
      solution: J`import java.util.*;

public class Main {
    public static void main(String[] args) {
        String[] names = {"Aman", "Bina", "Chirag", "Dia", "Esha"};
        char[] grades = {'B', 'A', 'C', 'A', 'B'};
        Map<Character, List<String>> groups = new TreeMap<>();
        for (int i = 0; i < names.length; i++) {
            groups.computeIfAbsent(grades[i], k -> new ArrayList<>()).add(names[i]);
        }
        for (Map.Entry<Character, List<String>> e : groups.entrySet()) {
            System.out.println(e.getKey() + ": " + e.getValue());
        }
    }
}`,
    },
    {
      id: "c12t5p4", title: "Inventory update",
      task: "<p>A shop's stock is a <code>LinkedHashMap</code>: pen 50, pencil 30, eraser 20. Process orders <code>{\"pen:12\", \"eraser:25\", \"stapler:1\", \"pencil:30\"}</code>: if the item exists and enough stock, reduce it; otherwise print why. Finally remove items with 0 stock and print the map.</p>",
      expected: "Sold 12 pen\nNot enough eraser (have 20)\nNo such item: stapler\nSold 30 pencil\n{pen=38, eraser=20}",
      mustUse: ["LinkedHashMap", "containsKey"],
      hints: ["Split each order on ':'.", "To remove zero entries: <code>stock.values().removeIf(q -> q == 0);</code>"],
      solution: J`import java.util.*;

public class Main {
    public static void main(String[] args) {
        Map<String, Integer> stock = new LinkedHashMap<>();
        stock.put("pen", 50);
        stock.put("pencil", 30);
        stock.put("eraser", 20);
        String[] orders = {"pen:12", "eraser:25", "stapler:1", "pencil:30"};
        for (String o : orders) {
            String[] p = o.split(":");
            String item = p[0];
            int qty = Integer.parseInt(p[1]);
            if (!stock.containsKey(item)) {
                System.out.println("No such item: " + item);
            } else if (stock.get(item) < qty) {
                System.out.println("Not enough " + item + " (have " + stock.get(item) + ")");
            } else {
                stock.put(item, stock.get(item) - qty);
                System.out.println("Sold " + qty + " " + item);
            }
        }
        stock.values().removeIf(q -> q == 0);
        System.out.println(stock);
    }
}`,
    },
  ],

  fill: [
    { id: "c12t5f1", prompt: "Count a word in one line, starting from 0 if missing.", template: "freq.put(w, freq.___(w, 0) + 1);", answers: [["getOrDefault"]], explain: "getOrDefault avoids null." },
    { id: "c12t5f2", prompt: "Loop over all key-value pairs.", template: "for (Map.Entry<String, Integer> e : map.___())", answers: [["entrySet"]], explain: "entrySet gives Entry objects with getKey/getValue." },
  ],

  quiz: [
    { type: "output", q: "Predict the output.", code: J`import java.util.*;
public class Q {
    public static void main(String[] args) {
        Map<String, Integer> m = new TreeMap<>();
        m.put("b", 1); m.put("a", 2);
        Integer old = m.put("b", 5);
        System.out.println(m + " " + old + " " + m.get("z"));
    }
}`, answer: "{a=2, b=5} 1 null", explain: "put returns the previous value; get on a missing key returns null." },
    { type: "mcq", q: "Which Map keeps keys sorted?", options: ["HashMap", "LinkedHashMap", "TreeMap", "Hashtable"], answer: 2, explain: "TreeMap sorts by key." },
    { type: "mcq", q: "Can a Map have duplicate keys?", options: ["Yes", "No — the new value replaces the old", "Only TreeMap", "Only with null"], answer: 1, explain: "Keys are unique; values may repeat." },
    { type: "mcq", q: "What is the default load factor of HashMap?", options: ["0.5", "0.75", "1.0", "2.0"], answer: 1, explain: "It resizes when about 75% full." },
  ],
};
