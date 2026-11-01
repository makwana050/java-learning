const J = String.raw;

export default {
  title: "StringBuilder & StringBuffer",
  summary: "Mutable strings: build and edit text efficiently, and know when to choose String, StringBuilder or StringBuffer.",

  concept: J`
<h2>Concept</h2>
<p>Because String is immutable, every <code>s = s + x</code> makes a brand-new object. In a loop of 10,000 iterations that is 10,000 throw-away objects. <code>StringBuilder</code> is a <b>mutable</b> sequence of characters — it changes itself in place.</p>
<pre class="java">StringBuilder sb = new StringBuilder();
for (int i = 1; i &lt;= 5; i++) {
    sb.append(i).append(",");
}
String result = sb.toString();     // "1,2,3,4,5,"</pre>

<h3>Common methods</h3>
<table>
<tr><th>Method</th><th>sb = "Java" → after the call</th></tr>
<tr><td><code>append(x)</code></td><td>add at the end: <code>append(25)</code> → "Java25"</td></tr>
<tr><td><code>insert(i, x)</code></td><td>insert at index: <code>insert(0, "Core ")</code> → "Core Java"</td></tr>
<tr><td><code>delete(start, end)</code></td><td>remove start…end−1: <code>delete(1, 3)</code> → "Ja"</td></tr>
<tr><td><code>deleteCharAt(i)</code></td><td><code>deleteCharAt(0)</code> → "ava"</td></tr>
<tr><td><code>replace(start, end, str)</code></td><td><code>replace(0, 1, "L")</code> → "Lava"</td></tr>
<tr><td><code>reverse()</code></td><td>"avaJ"</td></tr>
<tr><td><code>setCharAt(i, c)</code></td><td><code>setCharAt(0, 'K')</code> → "Kava"</td></tr>
<tr><td><code>length()</code>, <code>charAt(i)</code>, <code>indexOf(s)</code></td><td>same as String</td></tr>
<tr><td><code>toString()</code></td><td>convert to an immutable String</td></tr>
</table>
<p>Most methods return the same StringBuilder, so calls can be <b>chained</b>: <code>sb.append("a").append("b").reverse();</code></p>

<h3>Capacity</h3>
<p>A StringBuilder has an internal char array. The default capacity is 16; when it fills, a bigger array (about double) is created automatically. <code>new StringBuilder(100)</code> starts with room for 100.</p>

<h3>String vs StringBuilder vs StringBuffer</h3>
<table>
<tr><th></th><th>String</th><th>StringBuilder</th><th>StringBuffer</th></tr>
<tr><td>Mutable?</td><td>No</td><td>Yes</td><td>Yes</td></tr>
<tr><td>Thread-safe?</td><td>Yes (immutable)</td><td><b>No</b></td><td><b>Yes</b> — methods are <code>synchronized</code></td></tr>
<tr><td>Speed</td><td>slow for repeated changes</td><td><b>fastest</b></td><td>a bit slower (locking)</td></tr>
<tr><td>Since</td><td>Java 1.0</td><td>Java 5</td><td>Java 1.0</td></tr>
<tr><td>Use when</td><td>text that doesn't change</td><td>building text in one thread (almost always)</td><td>several threads modify the same buffer</td></tr>
</table>

<h3>Watch out</h3>
<ul>
<li><code>equals()</code> is <b>not</b> overridden in StringBuilder: <code>new StringBuilder("a").equals(new StringBuilder("a"))</code> is false. Compare <code>sb1.toString().equals(sb2.toString())</code> (or use <code>compareTo</code> in Java 11+).</li>
<li>A StringBuilder is not a String: <code>String s = sb;</code> doesn't compile — call <code>toString()</code>.</li>
</ul>
`,

  samples: [
    {
      title: "Building and editing",
      code: J`public class SbDemo {
    public static void main(String[] args) {
        StringBuilder sb = new StringBuilder("Java");
        sb.append(" 25");
        System.out.println(sb);
        sb.insert(0, "Core ");
        System.out.println(sb);
        sb.replace(5, 9, "JAVA");
        System.out.println(sb);
        sb.delete(0, 5);
        System.out.println(sb);
        sb.reverse();
        System.out.println(sb + " (length " + sb.length() + ")");
    }
}`,
      output: "Java 25\nCore Java 25\nCore JAVA 25\nJAVA 25\n52 AVAJ (length 7)",
    },
    {
      title: "Same object, changed in place",
      code: J`public class Mutable {
    public static void main(String[] args) {
        StringBuilder a = new StringBuilder("tea");
        StringBuilder b = a;
        b.append("m");
        System.out.println(a);
        System.out.println(a == b);
        StringBuilder c = new StringBuilder("team");
        System.out.println(a.equals(c));
        System.out.println(a.toString().equals(c.toString()));
    }
}`,
      output: "team\ntrue\nfalse\ntrue",
    },
  ],

  practice: [
    {
      id: "c5t4p1", title: "Palindrome check",
      task: "<p>Check whether <code>\"Malayalam\"</code> and <code>\"Gujarati\"</code> are palindromes (ignoring case) using <code>StringBuilder.reverse()</code>.</p>",
      expected: "Malayalam -> palindrome\nGujarati -> not a palindrome",
      mustUse: ["reverse()"],
      hints: ["<code>String rev = new StringBuilder(s).reverse().toString();</code>", "Compare with equalsIgnoreCase."],
      solution: J`public class Main {
    public static void main(String[] args) {
        String[] words = {"Malayalam", "Gujarati"};
        for (String w : words) {
            String rev = new StringBuilder(w).reverse().toString();
            System.out.println(w + (w.equalsIgnoreCase(rev) ? " -> palindrome" : " -> not a palindrome"));
        }
    }
}`,
    },
    {
      id: "c5t4p2", title: "Comma-separated list",
      task: "<p>Build the string <code>1, 4, 9, 16, 25, 36</code> (squares of 1 to 6) with a StringBuilder. No comma after the last number.</p>",
      expected: "1, 4, 9, 16, 25, 36",
      mustUse: ["StringBuilder", "append"],
      hints: ["Append \", \" before every number except the first — or delete the last 2 chars at the end."],
      solution: J`public class Main {
    public static void main(String[] args) {
        StringBuilder sb = new StringBuilder();
        for (int i = 1; i <= 6; i++) {
            if (i > 1) sb.append(", ");
            sb.append(i * i);
        }
        System.out.println(sb.toString());
    }
}`,
    },
    {
      id: "c5t4p3", title: "Reverse each word",
      task: "<p>Reverse every word of <code>\"Java makes coding fun\"</code> but keep the word order.</p>",
      expected: "avaJ sekam gnidoc nuf",
      mustUse: ["StringBuilder"],
      hints: ["Split into words; append <code>new StringBuilder(word).reverse()</code> plus a space; trim at the end."],
      solution: J`public class Main {
    public static void main(String[] args) {
        String s = "Java makes coding fun";
        StringBuilder out = new StringBuilder();
        for (String w : s.split(" ")) {
            out.append(new StringBuilder(w).reverse()).append(" ");
        }
        System.out.println(out.toString().trim());
    }
}`,
    },
    {
      id: "c5t4p4", title: "Format a number with commas",
      task: "<p>Insert commas into <code>\"1234567890\"</code> every 3 digits from the right using <code>insert</code>.</p>",
      expected: "1,234,567,890",
      mustUse: ["insert"],
      hints: ["Start at i = length − 3 and move left by 3 while i > 0: <code>sb.insert(i, ',');</code>"],
      solution: J`public class Main {
    public static void main(String[] args) {
        StringBuilder sb = new StringBuilder("1234567890");
        for (int i = sb.length() - 3; i > 0; i -= 3) {
            sb.insert(i, ',');
        }
        System.out.println(sb);
    }
}`,
    },
    {
      id: "c5t4p5", title: "Remove vowels in place",
      task: "<p>Remove all vowels from <code>\"Education is important\"</code> using <code>deleteCharAt</code> on a StringBuilder.</p>",
      expected: "dctn s mprtnt",
      mustUse: ["deleteCharAt"],
      hints: ["When you delete at index i, the next char moves to index i — so don't increase i after a deletion (or loop backwards)."],
      solution: J`public class Main {
    public static void main(String[] args) {
        StringBuilder sb = new StringBuilder("Education is important");
        for (int i = sb.length() - 1; i >= 0; i--) {
            if ("aeiouAEIOU".indexOf(sb.charAt(i)) >= 0) {
                sb.deleteCharAt(i);
            }
        }
        System.out.println(sb);
    }
}`,
    },
  ],

  fill: [
    { id: "c5t4f1", prompt: "Reverse a String in one line.", template: "String r = new ___(s).___().toString();", answers: [["StringBuilder", "StringBuffer"], ["reverse"]], explain: "String has no reverse(); StringBuilder does." },
    { id: "c5t4f2", prompt: "Which class is synchronized (thread-safe)?", template: "___", answers: [["StringBuffer"]], explain: "StringBuffer's methods are synchronized." },
  ],

  quiz: [
    { type: "output", q: "Predict the output.", code: J`public class Q {
    public static void main(String[] args) {
        StringBuilder sb = new StringBuilder("abc");
        sb.append("d").insert(1, "X").reverse();
        System.out.println(sb);
    }
}`, answer: "dcbXa", explain: "abcd → aXbcd → dcbXa." },
    { type: "output", q: "Predict the output.", code: J`public class Q {
    public static void main(String[] args) {
        String s = "x";
        StringBuilder sb = new StringBuilder("x");
        s.concat("y");
        sb.append("y");
        System.out.println(s + " " + sb);
    }
}`, answer: "x xy", explain: "String is immutable; StringBuilder changes in place." },
    { type: "mcq", q: "Which should you use to build a large string inside a loop in a single-threaded program?", options: ["String with +", "StringBuilder", "StringBuffer", "char"], answer: 1, explain: "Fastest mutable option without locking." },
    { type: "mcq", q: "Default capacity of <code>new StringBuilder()</code> is…", options: ["0", "8", "16", "32"], answer: 2, explain: "16 characters." },
  ],
};
