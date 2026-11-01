const J = String.raw;

export default {
  title: "Strings & the String Pool",
  summary: "A String is an object, not a primitive. Learn the two ways to create one and how Java saves memory with the String Constant Pool.",

  concept: J`
<h2>Concept</h2>
<h3>A String is an object</h3>
<p><code>String</code> is a class in <code>java.lang</code>. A String object stores a sequence of characters. Because it is so common, Java gives it special support: you can create one with a literal, and use <code>+</code> to join strings.</p>
<pre class="java">String course = "Java";        // literal
String city = new String("Pune"); // using the constructor
char[] letters = {'H', 'i'};
String hi = new String(letters);  // from a char array</pre>

<h3>Where do Strings live? The String Constant Pool</h3>
<p>Objects are created in the <b>heap</b>. Inside the heap, Java keeps a special area called the <b>String Constant Pool</b> (SCP) for string literals.</p>
<ul>
<li>When the code uses a literal like <code>"Java"</code>, the JVM checks the pool. If an identical string is already there, it <b>reuses</b> it; otherwise it adds one. So all <code>"Java"</code> literals in the program share <b>one</b> object.</li>
<li><code>new String("Java")</code> <b>always creates a new object</b> in the normal heap, even if "Java" is already in the pool.</li>
</ul>
<pre class="java">String a = "Java";
String b = "Java";
String c = new String("Java");

a == b   // true  — same pooled object
a == c   // false — c is a separate heap object
a.equals(c) // true — same characters</pre>
<div style="margin:1rem 0;max-width:520px;font-family:var(--mono);font-size:.9rem">
<div style="border:2px solid #1e40af;border-radius:10px;padding:.7rem;background:#f5f7ff"><b>Heap</b>
  <div style="border:2px dashed #c2410c;border-radius:8px;padding:.5rem;margin:.5rem 0;background:#fff8f2"><b>String Pool</b>: "Java" ← a, b</div>
  <div style="border:1px solid #888;border-radius:6px;padding:.4rem;background:#fff">"Java" (separate object) ← c</div>
</div></div>

<h3>Why a pool?</h3>
<p>Programs use the same text again and again (keys, messages, names). Sharing one object saves memory. This is safe only because Strings are <b>immutable</b> — no one can change a shared string (next topic).</p>

<h3>intern()</h3>
<p><code>s.intern()</code> returns the pooled copy of s (adding it to the pool if needed). So <code>c.intern() == a</code> is true.</p>

<h3>Compile-time constants are pooled too</h3>
<p><code>"Ja" + "va"</code> is joined by the <b>compiler</b>, so it's the same pooled "Java". But if a variable is involved — <code>String x = "Ja"; x + "va"</code> — the join happens at runtime and creates a <b>new</b> object (unless x is <code>final</code>).</p>

<h3>How many objects?</h3>
<p><code>String s = new String("Hello");</code> can create <b>two</b> objects: the literal "Hello" in the pool (if not already there) and the new heap object. A classic interview question.</p>

<h3>Basic String operations</h3>
<table>
<tr><th>Code</th><th>Result for s = "Program"</th></tr>
<tr><td><code>s.length()</code></td><td>7 (a method, with brackets)</td></tr>
<tr><td><code>s.charAt(0)</code></td><td>'P' — indexes start at 0</td></tr>
<tr><td><code>s.charAt(s.length() - 1)</code></td><td>'m'</td></tr>
<tr><td><code>s + "ming"</code></td><td>"Programming"</td></tr>
<tr><td><code>s.charAt(7)</code></td><td><code>StringIndexOutOfBoundsException</code></td></tr>
</table>
`,

  samples: [
    {
      title: "Literal vs new",
      code: J`public class PoolDemo {
    public static void main(String[] args) {
        String a = "Java";
        String b = "Java";
        String c = new String("Java");
        String d = c.intern();
        System.out.println(a == b);
        System.out.println(a == c);
        System.out.println(a.equals(c));
        System.out.println(a == d);
    }
}`,
      output: "true\nfalse\ntrue\ntrue",
    },
    {
      title: "Compile-time vs runtime joining",
      code: J`public class Joining {
    public static void main(String[] args) {
        String full = "Hello World";
        String s1 = "Hello " + "World";
        String part = "Hello ";
        String s2 = part + "World";
        final String fpart = "Hello ";
        String s3 = fpart + "World";
        System.out.println(full == s1);
        System.out.println(full == s2);
        System.out.println(full == s3);
        System.out.println(full.equals(s2));
    }
}`,
      output: "true\nfalse\ntrue\ntrue",
      explain: "s1 and s3 are joined by the compiler (constants) and come from the pool. s2 is built at runtime from a variable, so it's a new object.",
    },
    {
      title: "Reading characters",
      code: J`public class Chars {
    public static void main(String[] args) {
        String word = "Bengaluru";
        System.out.println(word.length());
        System.out.println(word.charAt(0) + "" + word.charAt(word.length() - 1));
        for (int i = 0; i < word.length(); i += 2) {
            System.out.print(word.charAt(i));
        }
        System.out.println();
    }
}`,
      output: "9\nBu\nBnauu",
    },
  ],

  practice: [
    {
      id: "c5t1p1", title: "Initials",
      task: "<p>Store the first name <code>\"Rahul\"</code>, middle <code>\"Kumar\"</code> and last <code>\"Verma\"</code> in three Strings and print the initials with dots.</p>",
      expected: "R.K.V.",
      mustUse: ["charAt(0)"],
      hints: ["<code>first.charAt(0) + \".\"</code> — start with a String or the chars get added as numbers."],
      solution: J`public class Main {
    public static void main(String[] args) {
        String first = "Rahul", middle = "Kumar", last = "Verma";
        System.out.println(first.charAt(0) + "." + middle.charAt(0) + "." + last.charAt(0) + ".");
    }
}`,
    },
    {
      id: "c5t1p2", title: "Print in reverse",
      task: "<p>Print the characters of <code>\"Compiler\"</code> in reverse order using a loop and <code>charAt</code>.</p>",
      expected: "relipmoC",
      mustUse: ["charAt", "length()"],
      hints: ["<code>for (int i = s.length() - 1; i >= 0; i--)</code>"],
      solution: J`public class Main {
    public static void main(String[] args) {
        String s = "Compiler";
        for (int i = s.length() - 1; i >= 0; i--) {
            System.out.print(s.charAt(i));
        }
        System.out.println();
    }
}`,
    },
    {
      id: "c5t1p3", title: "Pool or not?",
      task: "<p>Create these Strings and print the results of the comparisons as shown: <code>x = \"code\"</code>, <code>y = \"co\" + \"de\"</code>, <code>z = new String(\"code\")</code>, <code>w = z.intern()</code>.</p>",
      expected: "x == y : true\nx == z : false\nx == w : true\nx.equals(z) : true",
      mustUse: ["intern()", "new String"],
      hints: ["Brackets matter: <code>\"x == y : \" + (x == y)</code>. Without them, the String is compared instead!"],
      solution: J`public class Main {
    public static void main(String[] args) {
        String x = "code";
        String y = "co" + "de";
        String z = new String("code");
        String w = z.intern();
        System.out.println("x == y : " + (x == y));
        System.out.println("x == z : " + (x == z));
        System.out.println("x == w : " + (x == w));
        System.out.println("x.equals(z) : " + x.equals(z));
    }
}`,
    },
    {
      id: "c5t1p4", title: "Count a letter",
      task: "<p>Count how many times <code>'a'</code> appears in <code>\"banana and papaya\"</code>.</p>",
      expected: "'a' appears 7 times",
      hints: ["Loop over every index; compare <code>s.charAt(i) == 'a'</code> (chars use ==)."],
      solution: J`public class Main {
    public static void main(String[] args) {
        String s = "banana and papaya";
        int count = 0;
        for (int i = 0; i < s.length(); i++) {
            if (s.charAt(i) == 'a') count++;
        }
        System.out.println("'a' appears " + count + " times");
    }
}`,
    },
  ],

  fill: [
    { id: "c5t1f1", prompt: "Get the number of characters and the first character.", template: "int n = s.___();\nchar first = s.___(0);", answers: [["length"], ["charAt"]], explain: "length() for Strings (method) — arrays use length (field)." },
    { id: "c5t1f2", prompt: "Get the pooled copy of a heap String.", template: "String p = heapString.___();", answers: [["intern"]], explain: "intern() returns the canonical pooled instance." },
  ],

  quiz: [
    { type: "mcq", q: "Where are string literals stored?", options: ["Stack", "String Constant Pool (in the heap)", "Method's local variables", "CPU registers"], answer: 1, explain: "The SCP is part of the heap (since Java 7)." },
    { type: "mcq", q: "How many objects may <code>new String(\"Delhi\")</code> create if \"Delhi\" isn't in the pool yet?", options: ["0", "1", "2", "3"], answer: 2, explain: "One pooled literal plus one heap object." },
    { type: "output", q: "Predict the output.", code: J`public class Q {
    public static void main(String[] args) {
        String s1 = "Hi";
        String s2 = new String("Hi");
        System.out.println(s1 == s2);
        System.out.println(s1 == s2.intern());
    }
}`, answer: "false\ntrue", explain: "intern() returns the pooled \"Hi\"." },
    { type: "output", q: "Predict the output.", code: J`public class Q {
    public static void main(String[] args) {
        String a = "ab";
        String b = "a";
        String c = b + "b";
        System.out.println(a == c);
        System.out.println(a.equals(c));
    }
}`, answer: "false\ntrue", explain: "b is a non-final variable, so b + \"b\" is built at runtime." },
    { type: "mcq", q: "<code>\"Java\".charAt(4)</code> gives…", options: ["'a'", "' '", "StringIndexOutOfBoundsException", "null"], answer: 2, explain: "Valid indexes are 0 to 3." },
  ],
};
