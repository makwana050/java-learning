const J = String.raw;

export default {
  title: "Immutability, == vs equals()",
  summary: "A String can never be changed once created. Understand why, what that means for your code, and how to compare Strings correctly.",

  concept: J`
<h2>Concept</h2>
<h3>Strings are immutable</h3>
<p>Once a String object is created, its characters <b>can never change</b>. Every method that seems to change a String actually <b>returns a new String</b> and leaves the original untouched.</p>
<pre class="java">String s = "java";
s.toUpperCase();          // creates "JAVA" — but the result is thrown away!
System.out.println(s);    // java
s = s.toUpperCase();      // now s refers to the new object
System.out.println(s);    // JAVA</pre>
<p>In the last step, the <b>variable</b> <code>s</code> changed to point at a different object. The old "java" object still exists unchanged (and will be garbage-collected if nothing uses it).</p>

<h3>Why did Java make Strings immutable?</h3>
<table>
<tr><th>Reason</th><th>Explanation</th></tr>
<tr><td>String Pool</td><td>Many variables share one pooled object. If one could change it, all others would change too.</td></tr>
<tr><td>Security</td><td>File paths, URLs, usernames and passwords are Strings. A method that checked a value can trust it won't change afterwards.</td></tr>
<tr><td>Thread safety</td><td>Immutable objects can be shared between threads without locking.</td></tr>
<tr><td>Hash caching</td><td>A String's <code>hashCode()</code> is calculated once and reused — fast keys in HashMap.</td></tr>
</table>
<p>The class is also declared <code>final</code>, so nobody can create a subclass that behaves differently.</p>

<h3>The cost: concatenation in loops</h3>
<p><code>s = s + x;</code> inside a loop creates a new String every time — slow for large loops. Use <code>StringBuilder</code> (a later topic) for repeated building.</p>

<h3>Comparing Strings</h3>
<table>
<tr><th>Expression</th><th>Compares</th></tr>
<tr><td><code>a == b</code></td><td>Do both variables refer to the <b>same object</b>?</td></tr>
<tr><td><code>a.equals(b)</code></td><td>Do they contain the <b>same characters</b> (case-sensitive)?</td></tr>
<tr><td><code>a.equalsIgnoreCase(b)</code></td><td>Same characters, ignoring case</td></tr>
<tr><td><code>a.compareTo(b)</code></td><td>Dictionary order: 0 if equal, negative if a comes first, positive if a comes after</td></tr>
<tr><td><code>a.compareToIgnoreCase(b)</code></td><td>Same, ignoring case</td></tr>
</table>
<div class="warn"><b>Golden rule:</b> use <code>equals()</code> to compare String contents. <code>==</code> may appear to work with literals (because of the pool) and then fail with input from a user, file or network.</div>

<h3>null safety</h3>
<p><code>name.equals("admin")</code> throws <code>NullPointerException</code> if name is null. Writing the literal first is safe: <code>"admin".equals(name)</code> just returns false.</p>

<h3>How compareTo works</h3>
<p>It compares character by character. At the first difference it returns <code>char1 - char2</code>. If one string is a prefix of the other, it returns the difference in length.</p>
<pre class="java">"apple".compareTo("banana")   // 'a' - 'b' = -1
"cat".compareTo("car")         // 't' - 'r' = 2
"pen".compareTo("pencil")      // 3 - 6 = -3
"Zoo".compareTo("ant")         // 'Z'(90) - 'a'(97) = -7 → capitals sort first</pre>
`,

  samples: [
    {
      title: "Methods don't change the String",
      code: J`public class Immutable {
    public static void main(String[] args) {
        String s = "  Hello  ";
        s.trim();
        s.toUpperCase();
        s.concat("!");
        System.out.println("[" + s + "]");
        s = s.trim().toUpperCase().concat("!");
        System.out.println("[" + s + "]");
    }
}`,
      output: "[  Hello  ]\n[HELLO!]",
    },
    {
      title: "Different ways to compare",
      code: J`public class Compare {
    public static void main(String[] args) {
        String a = "Mango";
        String b = new String("Mango");
        String c = "mango";
        System.out.println(a == b);
        System.out.println(a.equals(b));
        System.out.println(a.equals(c));
        System.out.println(a.equalsIgnoreCase(c));
        System.out.println(a.compareTo(c));
        System.out.println("apple".compareTo("banana"));
        System.out.println("pen".compareTo("pencil"));
    }
}`,
      output: "false\ntrue\nfalse\ntrue\n-32\n-1\n-3",
      explain: "'M' (77) − 'm' (109) = −32.",
    },
    {
      title: "Safe comparison with null",
      code: J`public class NullSafe {
    public static void main(String[] args) {
        String role = null;
        System.out.println("admin".equals(role));
        try {
            System.out.println(role.equals("admin"));
        } catch (NullPointerException e) {
            System.out.println("NullPointerException!");
        }
    }
}`,
      output: "false\nNullPointerException!",
    },
  ],

  practice: [
    {
      id: "c5t2p1", title: "Fix the comparison bug",
      task: "<p>This login check fails even though the password is right, because the password is built at runtime. Fix the comparison so the correct message prints.</p>",
      starter: J`public class Main {
    public static void main(String[] args) {
        String saved = "java@123";
        String typed = new StringBuilder("java").append("@123").toString();
        if (typed == saved) {
            System.out.println("Login successful");
        } else {
            System.out.println("Wrong password");
        }
    }
}`,
      expected: "Login successful",
      mustUse: [".equals("],
      hints: ["== compares objects. Use <code>typed.equals(saved)</code>."],
      solution: J`public class Main {
    public static void main(String[] args) {
        String saved = "java@123";
        String typed = new StringBuilder("java").append("@123").toString();
        if (typed.equals(saved)) {
            System.out.println("Login successful");
        } else {
            System.out.println("Wrong password");
        }
    }
}`,
    },
    {
      id: "c5t2p2", title: "Alphabetical order",
      task: "<p>Put three names in dictionary order using <code>compareTo</code> (no arrays/sort): <code>\"Meera\", \"Arjun\", \"Kabir\"</code>.</p>",
      expected: "Arjun\nKabir\nMeera",
      mustUse: ["compareTo"],
      hints: ["Like sorting three numbers: swap a and b if a.compareTo(b) > 0, then b and c, then a and b again."],
      solution: J`public class Main {
    public static void main(String[] args) {
        String a = "Meera", b = "Arjun", c = "Kabir", t;
        if (a.compareTo(b) > 0) { t = a; a = b; b = t; }
        if (b.compareTo(c) > 0) { t = b; b = c; c = t; }
        if (a.compareTo(b) > 0) { t = a; a = b; b = t; }
        System.out.println(a);
        System.out.println(b);
        System.out.println(c);
    }
}`,
    },
    {
      id: "c5t2p3", title: "Case-insensitive command",
      task: "<p>Commands arrive in mixed case: <code>\"START\"</code>, <code>\"stop\"</code>, <code>\"Pause\"</code>. For each, print whether it equals \"start\" ignoring case.</p>",
      expected: "START -> true\nstop -> false\nPause -> false",
      mustUse: ["equalsIgnoreCase"],
      hints: ["Put the commands in a String[] and loop."],
      solution: J`public class Main {
    public static void main(String[] args) {
        String[] cmds = {"START", "stop", "Pause"};
        for (String c : cmds) {
            System.out.println(c + " -> " + c.equalsIgnoreCase("start"));
        }
    }
}`,
    },
    {
      id: "c5t2p4", title: "Prove immutability",
      task: "<p>Show that two variables share a String and that \"changing\" one doesn't affect the other: <code>String first = \"Tea\"; String second = first;</code> then do <code>second = second.concat(\"m\");</code>. Print both and whether they are the same object.</p>",
      expected: "first = Tea\nsecond = Team\nsame object? false",
      mustUse: ["concat"],
      hints: ["concat returns a new String; second now points to it."],
      solution: J`public class Main {
    public static void main(String[] args) {
        String first = "Tea";
        String second = first;
        second = second.concat("m");
        System.out.println("first = " + first);
        System.out.println("second = " + second);
        System.out.println("same object? " + (first == second));
    }
}`,
    },
  ],

  fill: [
    { id: "c5t2f1", prompt: "Compare contents safely, with the literal first.", template: "if (\"yes\".___(answer))", answers: [["equals"]], explain: "Works even when answer is null." },
    { id: "c5t2f2", prompt: "Keep the uppercase version.", template: "name ___ name.toUpperCase();", answers: [["="]], explain: "Strings are immutable; you must store the returned String." },
  ],

  quiz: [
    { type: "output", q: "Predict the output.", code: J`public class Q {
    public static void main(String[] args) {
        String s = "abc";
        s.concat("def");
        s.replace('a', 'z');
        System.out.println(s);
    }
}`, answer: "abc", explain: "Results were not stored." },
    { type: "output", q: "Predict the output.", code: J`public class Q {
    public static void main(String[] args) {
        System.out.println("cat".compareTo("car"));
        System.out.println("B".compareTo("a"));
    }
}`, answer: "2\n-31", explain: "'t' − 'r' = 2; 'B' (66) − 'a' (97) = −31." },
    { type: "mcq", q: "Which is NOT a reason Strings are immutable?", options: ["String Pool sharing", "Security", "Thread safety", "To make + faster in loops"], answer: 3, explain: "Immutability makes repeated + slower; that's why StringBuilder exists." },
    { type: "mcq", q: "To compare user input with \"exit\" ignoring case you write:", options: ["input == \"exit\"", "input.equals(\"EXIT\")", "input.equalsIgnoreCase(\"exit\")", "input.compareTo(\"exit\") == 1"], answer: 2, explain: "equalsIgnoreCase." },
  ],
};
