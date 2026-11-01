const J = String.raw;

export default {
  title: "Comments, identifiers & keywords",
  summary: "The names you give to things, the words Java reserves for itself, and how to leave notes in your code.",

  concept: J`
<h2>Concept</h2>
<h3>1. Comments</h3>
<p>Comments are notes for people. The compiler ignores them completely, so they never change the output.</p>
<table>
<tr><th>Type</th><th>Syntax</th><th>Use it for</th></tr>
<tr><td>Single-line</td><td><code>// text</code></td><td>A short note; everything after <code>//</code> on that line is ignored</td></tr>
<tr><td>Multi-line</td><td><code>/* text */</code></td><td>Longer explanations or temporarily switching off several lines</td></tr>
<tr><td>Documentation</td><td><code>/** text */</code></td><td>Describing classes and methods; the <code>javadoc</code> tool turns these into HTML pages</td></tr>
</table>
<pre class="java">/** Calculates the area of a rectangle. */
public class Area {
    public static void main(String[] args) {
        // length and width in cm
        System.out.println(5 * 3);   /* prints 15 */
    }
}</pre>
<div class="warn">Multi-line comments cannot be nested: <code>/* outer /* inner */ still outside */</code> is a compile error, because the first <code>*/</code> ends the comment.</div>

<h3>2. Identifiers — the names you choose</h3>
<p>An <b>identifier</b> is a name for a class, variable, method or package. The rules are strict — break one and the code does not compile:</p>
<ol>
<li>May contain letters, digits, underscore <code>_</code> and dollar sign <code>$</code>.</li>
<li>Must <b>not start with a digit</b>.</li>
<li>No spaces and no other symbols (<code>-</code>, <code>@</code>, <code>#</code>, <code>.</code> are not allowed).</li>
<li>Cannot be a <b>keyword</b> (like <code>int</code> or <code>class</code>) or the literals <code>true</code>, <code>false</code>, <code>null</code>.</li>
<li>Case-sensitive: <code>total</code>, <code>Total</code> and <code>TOTAL</code> are three different names.</li>
<li>A single underscore <code>_</code> alone is not allowed (since Java 9).</li>
</ol>
<table>
<tr><th>Valid ✓</th><th>Invalid ✗</th><th>Why invalid</th></tr>
<tr><td><code>marks</code></td><td><code>2ndPlace</code></td><td>starts with a digit</td></tr>
<tr><td><code>totalMarks</code></td><td><code>total marks</code></td><td>contains a space</td></tr>
<tr><td><code>_count</code>, <code>$price</code></td><td><code>roll-no</code></td><td><code>-</code> is not allowed</td></tr>
<tr><td><code>student2</code></td><td><code>class</code></td><td>keyword</td></tr>
<tr><td><code>Integer</code> (legal, but confusing)</td><td><code>true</code></td><td>reserved literal</td></tr>
</table>

<h3>3. Naming conventions — rules that programmers follow</h3>
<p>These are not checked by the compiler, but every Java programmer follows them, and your code should too:</p>
<table>
<tr><th>Kind</th><th>Style</th><th>Example</th></tr>
<tr><td>Class, interface</td><td>PascalCase (each word capitalised)</td><td><code>StudentRecord</code>, <code>Runnable</code></td></tr>
<tr><td>Variable, method</td><td>camelCase (first word small)</td><td><code>totalMarks</code>, <code>calculateGrade()</code></td></tr>
<tr><td>Constant (<code>static final</code>)</td><td>UPPER_SNAKE_CASE</td><td><code>MAX_STUDENTS</code></td></tr>
<tr><td>Package</td><td>all lowercase</td><td><code>com.college.exam</code></td></tr>
</table>
<p>Choose meaningful names: <code>studentCount</code> tells a story, <code>x2</code> does not.</p>

<h3>4. Keywords</h3>
<p><b>Keywords</b> (reserved words) have a fixed meaning in Java and are always lowercase. Java has around 50. Group them to remember them:</p>
<table>
<tr><th>Group</th><th>Keywords</th></tr>
<tr><td>Data types</td><td><code>byte short int long float double char boolean void</code></td></tr>
<tr><td>Decisions & loops</td><td><code>if else switch case default for while do break continue return</code></td></tr>
<tr><td>Classes & objects</td><td><code>class interface enum extends implements new this super instanceof package import</code></td></tr>
<tr><td>Modifiers</td><td><code>public private protected static final abstract synchronized volatile transient native strictfp</code></td></tr>
<tr><td>Exceptions</td><td><code>try catch finally throw throws assert</code></td></tr>
<tr><td>Unused but reserved</td><td><code>goto const</code></td></tr>
</table>
<div class="note"><code>true</code>, <code>false</code> and <code>null</code> look like keywords but are <b>literals</b> — still, you can't use them as names. Words like <code>var</code>, <code>record</code>, <code>yield</code> and <code>sealed</code> are <b>contextual keywords</b> (newer Java): special only in certain places.</div>
`,

  samples: [
    {
      title: "Comments don't change the output",
      code: J`public class Comments {
    public static void main(String[] args) {
        // System.out.println("This line is switched off");
        System.out.println("Visible line"); // a note after code
        /*
        System.out.println("Also switched off");
        */
        System.out.println("Done");
    }
}`,
      output: "Visible line\nDone",
    },
    {
      title: "Identifiers are case-sensitive",
      code: J`public class CaseDemo {
    public static void main(String[] args) {
        int total = 10;
        int Total = 20;
        int TOTAL = 30;
        int $bonus = 5;
        int _extra = 1;
        System.out.println(total + Total + TOTAL + $bonus + _extra);
    }
}`,
      output: "66",
      explain: "Three different variables with different capitalisation. <code>$</code> and <code>_</code> are allowed at the start of a name.",
    },
  ],

  practice: [
    {
      id: "c1t4p1", title: "Fix the names",
      task: "<p>The starter code does not compile because three variable names break the identifier rules. Rename them to valid camelCase names (<code>firstScore</code>, <code>secondScore</code>, <code>finalScore</code>) so the program prints the expected output.</p>",
      starter: J`public class Main {
    public static void main(String[] args) {
        int 1stScore = 40;
        int second-score = 35;
        int final = 1stScore + second-score;
        System.out.println("Total: " + final);
    }
}`,
      expected: "Total: 75",
      hints: ["A name cannot start with a digit, contain <code>-</code>, or be a keyword (<code>final</code> is a keyword!).", "Rename every place where the old name is used, not just the declaration."],
      solution: J`public class Main {
    public static void main(String[] args) {
        int firstScore = 40;
        int secondScore = 35;
        int finalScore = firstScore + secondScore;
        System.out.println("Total: " + finalScore);
    }
}`,
    },
    {
      id: "c1t4p2", title: "Switch off a line",
      task: "<p>Don't delete anything. Use comments to switch off the lines so only the expected output is printed. Add one <code>//</code> comment and one <code>/* */</code> comment.</p>",
      starter: J`public class Main {
    public static void main(String[] args) {
        System.out.println("Step 1");
        System.out.println("Debug: x = 5");
        System.out.println("Step 2");
        System.out.println("Debug: y = 9");
        System.out.println("Debug: z = 1");
        System.out.println("Step 3");
    }
}`,
      expected: "Step 1\nStep 2\nStep 3",
      mustUse: ["//", "/*", "*/"],
      hints: ["Put <code>//</code> at the start of the first Debug line.", "Wrap the last two Debug lines between <code>/*</code> and <code>*/</code>."],
      solution: J`public class Main {
    public static void main(String[] args) {
        System.out.println("Step 1");
        // System.out.println("Debug: x = 5");
        System.out.println("Step 2");
        /*
        System.out.println("Debug: y = 9");
        System.out.println("Debug: z = 1");
        */
        System.out.println("Step 3");
    }
}`,
    },
    {
      id: "c1t4p3", title: "Follow the conventions",
      task: "<p>Write a program with a constant <code>MAX_SEATS</code> (value 60) and a variable <code>bookedSeats</code> (value 47). Print the free seats.</p><p>Declare the constant as <code>static final int MAX_SEATS = 60;</code> inside the class (outside main).</p>",
      expected: "Free seats: 13",
      mustUse: ["static final int MAX_SEATS", "bookedSeats"],
      hints: ["The constant goes inside the class but before <code>main</code>.", "Print <code>\"Free seats: \" + (MAX_SEATS - bookedSeats)</code>."],
      solution: J`public class Main {
    static final int MAX_SEATS = 60;

    public static void main(String[] args) {
        int bookedSeats = 47;
        System.out.println("Free seats: " + (MAX_SEATS - bookedSeats));
    }
}`,
    },
  ],

  fill: [
    { id: "c1t4f1", prompt: "Complete the three comment styles.", template: "___ single line\n___ multi\n   line ___\n___ documentation */", answers: [["//"], ["/*"], ["*/"], ["/**"]], explain: "<code>//</code>, <code>/* ... */</code> and <code>/** ... */</code>." },
    { id: "c1t4f2", prompt: "Write a valid camelCase variable name for 'roll number'.", template: "int ___ = 21;", answers: [["rollNumber", "rollNo"]], explain: "camelCase: first word lowercase, every next word starts with a capital." },
    { id: "c1t4f3", prompt: "Write the constant for a maximum of 5 attempts using the correct convention.", template: "static final int ___ = 5;", answers: [["MAX_ATTEMPTS"]], explain: "Constants use UPPER_SNAKE_CASE." },
  ],

  quiz: [
    { type: "mcq", q: "Which is a <b>valid</b> identifier?", options: ["3rdRank", "student-name", "_rank3", "int"], answer: 2, explain: "It starts with an underscore and contains only letters and digits." },
    { type: "mcq", q: "Which of these is NOT a Java keyword?", options: ["static", "goto", "main", "volatile"], answer: 2, explain: "<code>main</code> is just a method name. <code>goto</code> is reserved even though it is unused." },
    { type: "mcq", q: "Which naming follows Java conventions for a class?", options: ["bankAccount", "Bank_account", "BankAccount", "BANKACCOUNT"], answer: 2, explain: "Classes use PascalCase." },
    { type: "mcq", q: "<code>true</code>, <code>false</code> and <code>null</code> are…", options: ["keywords", "literals that can't be used as identifiers", "valid identifiers", "classes"], answer: 1, explain: "They are reserved literals." },
    { type: "output", q: "Predict the output.", code: J`public class Q {
    public static void main(String[] args) {
        int a = 2; // a = 5;
        /* a = 9; */ a = a * 3;
        System.out.println(a);
    }
}`, answer: "6", explain: "Both reassignments inside comments are ignored. a = 2 * 3." },
  ],
};
