const J = String.raw;

export default {
  title: "Important String methods",
  summary: "The String methods you will use every day: searching, extracting, changing case, splitting, replacing and formatting.",

  concept: J`
<h2>Concept</h2>
<p>All these methods <b>return</b> a result — remember that the original String never changes.</p>

<h3>Length and characters</h3>
<table>
<tr><th>Method</th><th>"Hello World"</th></tr>
<tr><td><code>length()</code></td><td>11</td></tr>
<tr><td><code>charAt(4)</code></td><td>'o'</td></tr>
<tr><td><code>isEmpty()</code></td><td>false (true only for "")</td></tr>
<tr><td><code>toCharArray()</code></td><td>{'H','e','l',…} — a char[]</td></tr>
</table>

<h3>Searching</h3>
<table>
<tr><th>Method</th><th>Result for "banana"</th></tr>
<tr><td><code>indexOf('a')</code></td><td>1 — first position (−1 if not found)</td></tr>
<tr><td><code>indexOf('a', 2)</code></td><td>3 — search starting at index 2</td></tr>
<tr><td><code>lastIndexOf('a')</code></td><td>5</td></tr>
<tr><td><code>indexOf("nan")</code></td><td>2</td></tr>
<tr><td><code>contains("nan")</code></td><td>true</td></tr>
<tr><td><code>startsWith("ba")</code>, <code>endsWith("na")</code></td><td>true, true</td></tr>
</table>

<h3>Extracting: substring</h3>
<p><code>substring(begin)</code> → from begin to the end. <code>substring(begin, end)</code> → from begin up to <b>but not including</b> end. Length of the result = end − begin.</p>
<pre class="java">"Programming".substring(3)      // "gramming"
"Programming".substring(0, 7)   // "Program"
"Programming".substring(3, 7)   // "gram"</pre>

<h3>Changing (returns a new String)</h3>
<table>
<tr><th>Method</th><th>Example → result</th></tr>
<tr><td><code>toUpperCase()</code>, <code>toLowerCase()</code></td><td>"Java" → "JAVA", "java"</td></tr>
<tr><td><code>trim()</code></td><td>"  hi  " → "hi" (removes leading/trailing spaces)</td></tr>
<tr><td><code>replace('a', 'o')</code></td><td>"banana" → "bonono" (all occurrences)</td></tr>
<tr><td><code>replace("na", "NA")</code></td><td>"banana" → "baNANA"</td></tr>
<tr><td><code>replaceAll("[0-9]", "#")</code></td><td>uses a regular expression: "a1b2" → "a#b#"</td></tr>
<tr><td><code>concat("!")</code></td><td>same as + "!"</td></tr>
</table>

<h3>Splitting and joining</h3>
<pre class="java">String csv = "Asha,21,Pune";
String[] parts = csv.split(",");      // ["Asha", "21", "Pune"]
String[] words = "to  be or".split("\\s+");   // split on one or more spaces
String line = String.join("-", "2026", "10", "31");   // "2026-10-31"</pre>
<p><code>split</code> takes a <b>regular expression</b>; to split on a dot write <code>split("\\.")</code>.</p>

<h3>Converting</h3>
<table>
<tr><th>Code</th><th>Result</th></tr>
<tr><td><code>String.valueOf(42)</code></td><td>"42" (also works for double, char, boolean, char[])</td></tr>
<tr><td><code>Integer.parseInt("42")</code></td><td>42</td></tr>
<tr><td><code>String.format("%05.1f", 3.14159)</code></td><td>"003.1" — like printf but returns a String</td></tr>
<tr><td><code>new String(charArray)</code></td><td>String from characters</td></tr>
</table>

<h3>Useful Character methods</h3>
<p><code>Character.isLetter(c)</code>, <code>isDigit(c)</code>, <code>isWhitespace(c)</code>, <code>isUpperCase(c)</code>, <code>isLowerCase(c)</code>, <code>toUpperCase(c)</code>, <code>toLowerCase(c)</code>.</p>
<div class="note">Newer Java adds <code>strip()</code>, <code>isBlank()</code>, <code>repeat(n)</code> and <code>lines()</code> (Java 11). They're great on JDK 25 in the lab, but the Run button here uses Java 8, so the practice problems avoid them.</div>
`,

  samples: [
    {
      title: "Searching and extracting",
      code: J`public class Search {
    public static void main(String[] args) {
        String email = "priya.sharma@college.edu.in";
        int at = email.indexOf('@');
        String user = email.substring(0, at);
        String domain = email.substring(at + 1);
        System.out.println(user);
        System.out.println(domain);
        System.out.println(email.endsWith(".in"));
        System.out.println(email.lastIndexOf('.'));
        System.out.println(email.contains("college"));
    }
}`,
      output: "priya.sharma\ncollege.edu.in\ntrue\n24\ntrue",
    },
    {
      title: "split, join, replace",
      code: J`public class SplitJoin {
    public static void main(String[] args) {
        String record = "Rohan,19,CSE,8.7";
        String[] f = record.split(",");
        System.out.println(f.length + " fields, branch = " + f[2]);
        String date = String.join("/", "31", "10", "2026");
        System.out.println(date);
        System.out.println("Hello   big   world".split("\\s+").length);
        System.out.println("2026-10-31".replace('-', '.'));
        System.out.println("A1B22C333".replaceAll("[0-9]", ""));
    }
}`,
      output: "4 fields, branch = CSE\n31/10/2026\n3\n2026.10.31\nABC",
    },
    {
      title: "Character checks",
      code: J`public class CharCheck {
    public static void main(String[] args) {
        String pwd = "Code@2026";
        int upper = 0, lower = 0, digit = 0, special = 0;
        for (char c : pwd.toCharArray()) {
            if (Character.isUpperCase(c)) upper++;
            else if (Character.isLowerCase(c)) lower++;
            else if (Character.isDigit(c)) digit++;
            else special++;
        }
        System.out.println(upper + " " + lower + " " + digit + " " + special);
    }
}`,
      output: "1 3 4 1",
    },
  ],

  practice: [
    {
      id: "c5t3p1", title: "File name parts",
      task: "<p>From <code>\"Report_Final.v2.pdf\"</code> print the file name without extension and the extension (after the <b>last</b> dot), the extension in uppercase.</p>",
      expected: "Name: Report_Final.v2\nExtension: PDF",
      mustUse: ["lastIndexOf", "substring"],
      hints: ["<code>int dot = file.lastIndexOf('.');</code>", "Name = substring(0, dot); extension = substring(dot + 1)."],
      solution: J`public class Main {
    public static void main(String[] args) {
        String file = "Report_Final.v2.pdf";
        int dot = file.lastIndexOf('.');
        System.out.println("Name: " + file.substring(0, dot));
        System.out.println("Extension: " + file.substring(dot + 1).toUpperCase());
    }
}`,
    },
    {
      id: "c5t3p2", title: "Capitalize each word",
      task: "<p>Convert <code>\"the quick brown fox\"</code> so each word starts with a capital letter.</p>",
      expected: "The Quick Brown Fox",
      mustUse: ["split"],
      hints: ["Split on spaces; for each word: <code>Character.toUpperCase(w.charAt(0)) + w.substring(1)</code>.", "Join the words back with spaces (watch out for the extra space at the end — use trim() or String.join)."],
      solution: J`public class Main {
    public static void main(String[] args) {
        String s = "the quick brown fox";
        String[] words = s.split(" ");
        for (int i = 0; i < words.length; i++) {
            words[i] = Character.toUpperCase(words[i].charAt(0)) + words[i].substring(1);
        }
        System.out.println(String.join(" ", words));
    }
}`,
    },
    {
      id: "c5t3p3", title: "Count words, vowels and spaces",
      task: "<p>For <code>\"  Java is fun to learn  \"</code>, trim it and print the number of words, vowels and spaces (after trimming).</p>",
      expected: "Words: 5\nVowels: 7\nSpaces: 4",
      mustUse: ["trim()"],
      hints: ["Words: <code>s.trim().split(\"\\\\s+\").length</code>.", "Vowels: check <code>\"aeiouAEIOU\".indexOf(c) >= 0</code> for each char."],
      solution: J`public class Main {
    public static void main(String[] args) {
        String s = "  Java is fun to learn  ".trim();
        int words = s.split("\\s+").length;
        int vowels = 0, spaces = 0;
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            if ("aeiouAEIOU".indexOf(c) >= 0) vowels++;
            if (c == ' ') spaces++;
        }
        System.out.println("Words: " + words);
        System.out.println("Vowels: " + vowels);
        System.out.println("Spaces: " + spaces);
    }
}`,
    },
    {
      id: "c5t3p4", title: "Mask a phone number",
      task: "<p>Show only the last 4 digits of <code>\"9876543210\"</code>, replacing the others with <code>*</code>.</p>",
      expected: "******3210",
      mustUse: ["substring"],
      hints: ["Build the stars with a loop (length − 4 times), then add <code>s.substring(s.length() - 4)</code>."],
      solution: J`public class Main {
    public static void main(String[] args) {
        String phone = "9876543210";
        String masked = "";
        for (int i = 0; i < phone.length() - 4; i++) masked += "*";
        masked += phone.substring(phone.length() - 4);
        System.out.println(masked);
    }
}`,
    },
    {
      id: "c5t3p5", title: "Count occurrences of a word",
      task: "<p>Count how many times <code>\"the\"</code> appears (as text, case-insensitive) in <code>\"The cat and the hat sat on the mat\"</code> using <code>indexOf(str, from)</code> in a loop.</p>",
      expected: "Found 3 times",
      mustUse: ["indexOf"],
      hints: ["Lower-case the sentence first.", "<code>int pos = s.indexOf(\"the\"); while (pos != -1) { count++; pos = s.indexOf(\"the\", pos + 1); }</code>"],
      solution: J`public class Main {
    public static void main(String[] args) {
        String s = "The cat and the hat sat on the mat".toLowerCase();
        int count = 0;
        int pos = s.indexOf("the");
        while (pos != -1) {
            count++;
            pos = s.indexOf("the", pos + 1);
        }
        System.out.println("Found " + count + " times");
    }
}`,
    },
    {
      id: "c5t3p6", title: "Parse a CSV line",
      task: "<p>Parse <code>\"Laptop,2,45999.50\"</code> into name, quantity and price, then print the bill total with 2 decimals using <code>String.format</code>.</p>",
      expected: "Laptop x 2 = 91999.00",
      mustUse: ["split", "String.format"],
      hints: ["Convert with Integer.parseInt and Double.parseDouble.", "<code>String.format(\"%s x %d = %.2f\", name, qty, qty * price)</code>"],
      solution: J`public class Main {
    public static void main(String[] args) {
        String[] f = "Laptop,2,45999.50".split(",");
        String name = f[0];
        int qty = Integer.parseInt(f[1]);
        double price = Double.parseDouble(f[2]);
        System.out.println(String.format("%s x %d = %.2f", name, qty, qty * price));
    }
}`,
    },
  ],

  fill: [
    { id: "c5t3f1", prompt: "Extract \"gram\" from \"Programming\".", template: "\"Programming\".substring(___, ___)", answers: [["3"], ["7"]], explain: "End index is excluded: indexes 3, 4, 5, 6." },
    { id: "c5t3f2", prompt: "Split a sentence into words on spaces.", template: "String[] w = line.___(\" \");", answers: [["split"]], explain: "split returns a String[]." },
    { id: "c5t3f3", prompt: "Convert a number to a String without +.", template: "String s = String.___(250);", answers: [["valueOf"]], explain: "String.valueOf works for all primitives." },
  ],

  quiz: [
    { type: "output", q: "Predict the output.", code: J`public class Q {
    public static void main(String[] args) {
        String s = "Mississippi";
        System.out.println(s.indexOf("ss") + " " + s.lastIndexOf("ss") + " " + s.indexOf('z'));
    }
}`, answer: "2 5 -1", explain: "Index positions of \"ss\" and a missing char." },
    { type: "output", q: "Predict the output.", code: J`public class Q {
    public static void main(String[] args) {
        String s = "abcdef";
        System.out.println(s.substring(2, 2).length() + s.substring(4));
    }
}`, answer: "0ef", explain: "substring(2, 2) is empty; 0 + \"ef\" → \"0ef\"." },
    { type: "output", q: "Predict the output.", code: J`public class Q {
    public static void main(String[] args) {
        System.out.println("a.b.c".split(".").length);
        System.out.println("a.b.c".split("\\.").length);
    }
}`, answer: "0\n3", explain: "\".\" in a regex means \"any character\", so every character is a separator and nothing remains." },
    { type: "mcq", q: "What does <code>\"  hi there  \".trim()</code> return?", options: ["\"hithere\"", "\"hi there\"", "\"hi there  \"", "\"  hi there\""], answer: 1, explain: "Only leading and trailing whitespace is removed." },
    { type: "mcq", q: "Which method does NOT exist on String?", options: ["contains", "reverse", "startsWith", "toCharArray"], answer: 1, explain: "reverse() belongs to StringBuilder." },
  ],
};
