const J = String.raw;

export default {
  title: "Your first program, line by line",
  summary: "Every word of a Java program has a job. Understand the class, the main method and System.out.println — plus print, printf and escape sequences.",

  concept: J`
<h2>Concept</h2>
<p>Here is a complete Java program. We will take it apart word by word.</p>
<pre class="java">public class Greeting {
    public static void main(String[] args) {
        System.out.println("Good morning, class!");
    }
}</pre>

<h3>The shape of every program</h3>
<ul>
<li>All Java code lives inside a <b>class</b>. The class is the outer box: <code>public class Greeting { ... }</code></li>
<li>Inside the class is the <b>main method</b>: <code>public static void main(String[] args) { ... }</code>. This is the <b>entry point</b> — when you type <code>java Greeting</code>, the JVM looks for exactly this method and starts running from its first line.</li>
<li>Inside main are <b>statements</b>, the instructions. Each one ends with a semicolon <code>;</code>.</li>
<li>Curly braces <code>{ }</code> mark where a class or method begins and ends. Every <code>{</code> needs a matching <code>}</code>.</li>
</ul>

<h3>Rules you must follow</h3>
<table>
<tr><th>Rule</th><th>Example</th></tr>
<tr><td>A <code>public class</code> must be saved in a file with <b>exactly the same name</b>.</td><td><code>public class Greeting</code> → <code>Greeting.java</code></td></tr>
<tr><td>Java is <b>case-sensitive</b>. <code>System</code> and <code>system</code> are different words.</td><td><code>system.out.println</code> ✗ compile error</td></tr>
<tr><td>Strings (text) use <b>double</b> quotes. Single quotes are for one character only.</td><td><code>"Hi"</code> ✓ &nbsp; <code>'Hi'</code> ✗</td></tr>
<tr><td>Every statement ends with <code>;</code></td><td><code>System.out.println("Hi");</code></td></tr>
<tr><td>Class names start with a capital letter by convention (PascalCase).</td><td><code>Greeting</code>, <code>StudentMarks</code></td></tr>
</table>

<h3>print vs println vs printf</h3>
<table>
<tr><th>Method</th><th>What it does</th><th>Example → output</th></tr>
<tr><td><code>print(x)</code></td><td>Prints x and <b>stays on the same line</b></td><td><code>print("A"); print("B");</code> → <code>AB</code></td></tr>
<tr><td><code>println(x)</code></td><td>Prints x and <b>then moves to a new line</b>. <code>println()</code> with nothing just prints an empty line.</td><td><code>println("A"); println("B");</code> → A, then B on the next line</td></tr>
<tr><td><code>printf(format, values)</code></td><td>Prints formatted text. Placeholders are replaced by the values in order. Does <b>not</b> add a new line by itself — use <code>%n</code>.</td><td><code>printf("%d marks%n", 90);</code> → <code>90 marks</code></td></tr>
</table>
<p>Common <code>printf</code> placeholders:</p>
<table>
<tr><th>Placeholder</th><th>For</th><th>Example → output</th></tr>
<tr><td><code>%d</code></td><td>whole numbers (int, long)</td><td><code>printf("%d", 42)</code> → <code>42</code></td></tr>
<tr><td><code>%f</code>, <code>%.2f</code></td><td>decimal numbers; <code>.2</code> = 2 digits after the point</td><td><code>printf("%.2f", 3.14159)</code> → <code>3.14</code></td></tr>
<tr><td><code>%s</code></td><td>text (String)</td><td><code>printf("%s", "Java")</code> → <code>Java</code></td></tr>
<tr><td><code>%c</code></td><td>one character</td><td><code>printf("%c", 'J')</code> → <code>J</code></td></tr>
<tr><td><code>%n</code></td><td>new line</td><td></td></tr>
<tr><td><code>%5d</code>, <code>%-8s</code></td><td>width: right-align in 5 places / left-align in 8 places</td><td><code>printf("[%5d]", 42)</code> → <code>[   42]</code></td></tr>
</table>

<h3>Escape sequences — special characters inside strings</h3>
<p>Some characters can't be typed directly inside <code>"..."</code>. A backslash <code>\</code> starts an <b>escape sequence</b>:</p>
<table>
<tr><th>Escape</th><th>Meaning</th></tr>
<tr><td><code>\n</code></td><td>new line</td></tr>
<tr><td><code>\t</code></td><td>tab (jumps to the next tab stop)</td></tr>
<tr><td><code>\"</code></td><td>a double quote character inside a string</td></tr>
<tr><td><code>\\</code></td><td>one backslash character</td></tr>
<tr><td><code>\'</code></td><td>a single quote (needed inside a char: <code>'\''</code>)</td></tr>
</table>

<h3>Comments — notes for humans</h3>
<p>The compiler ignores comments. Use them to explain your code.</p>
<pre class="java">// single-line comment
/* multi-line
   comment */
/** documentation comment — read by the javadoc tool */</pre>

<h3>The modern short form (Java 25)</h3>
<p>Since <b>JDK 25</b> (JEP 512, "compact source files and instance main methods"), a beginner program can be written without the class line and without <code>public static</code> and <code>String[] args</code>:</p>
<pre class="java">void main() {
    IO.println("Good morning, class!");
}</pre>
<p>Java wraps this in a class automatically, and <code>IO.println</code> is a new, shorter way to print. This is great for quick programs, but you must still know the full form: it is used in every real project, in exams and in older Java versions.</p>
<div class="warn">The Run button on this website uses a Java 8 compiler, so use the <b>full form</b> here. Try the short form on JDK 25 in the lab.</div>

<h3>Common beginner errors</h3>
<table>
<tr><th>Mistake</th><th>What you see</th></tr>
<tr><td>Missing <code>;</code></td><td><code>error: ';' expected</code></td></tr>
<tr><td><code>system.out.println</code> (small s)</td><td><code>error: package system does not exist</code></td></tr>
<tr><td><code>System.out.printn</code> (typo)</td><td><code>error: cannot find symbol</code></td></tr>
<tr><td>Text in single quotes <code>'Hello'</code></td><td><code>error: unclosed character literal</code></td></tr>
<tr><td>Missing closing <code>}</code></td><td><code>error: reached end of file while parsing</code></td></tr>
<tr><td>Writing <code>main</code> without <code>static</code></td><td>Compiles, but running gives <code>Error: Main method is not static in class ...</code> (on older Java versions)</td></tr>
</table>
<p>Read error messages carefully — they show the <b>file name, line number</b> and what the compiler expected.</p>
`,

  syntax: [
    {
      title: "The class declaration",
      parts: [
        { t: "public", m: "<b>Access modifier.</b> The class can be used from anywhere. A public class must be in a file with the same name." },
        { t: " " },
        { t: "class", m: "<b>Keyword</b> that says: a class is being defined here." },
        { t: " " },
        { t: "Greeting", m: "<b>Class name</b> (an identifier you choose). Starts with a capital letter by convention." },
        { t: " " },
        { t: "{", m: "Opening brace — the body of the class starts here. It is closed by a matching <code>}</code>." },
      ],
    },
    {
      title: "The main method",
      parts: [
        { t: "public", m: "The JVM calls main from <b>outside</b> your class, so it must be accessible — public." },
        { t: " " },
        { t: "static", m: "main belongs to the <b>class</b>, not to an object. The JVM can call it without creating an object first." },
        { t: " " },
        { t: "void", m: "<b>Return type.</b> main does not return any value." },
        { t: " " },
        { t: "main", m: "The <b>name</b> the JVM searches for. Must be exactly <code>main</code> in lowercase." },
        { t: "(" },
        { t: "String[]", m: "The parameter type: an <b>array of Strings</b>." },
        { t: " " },
        { t: "args", m: "The parameter name. It holds <b>command-line arguments</b>, e.g. <code>java Greeting Ravi 21</code> gives args[0] = \"Ravi\" and args[1] = \"21\". You may rename it, but <code>args</code> is the convention." },
        { t: ")" },
        { t: " {" },
      ],
    },
    {
      title: "The print statement",
      parts: [
        { t: "System", m: "A built-in <b>class</b> in the <code>java.lang</code> package (imported automatically). It gives access to system resources." },
        { t: ".", m: "The <b>dot operator</b> — 'go inside' and use a member." },
        { t: "out", m: "A <b>static field</b> of System. It is an object of type <code>PrintStream</code> connected to the console (standard output)." },
        { t: "." },
        { t: "println", m: "A <b>method</b> of PrintStream: print the value, then move to the next line." },
        { t: "(", m: "Brackets hold the <b>argument</b> — the value to print." },
        { t: "\"Good morning, class!\"", m: "A <b>String literal</b>: text inside double quotes, printed exactly." },
        { t: ")" },
        { t: ";", m: "<b>End of statement.</b> Every Java statement ends with a semicolon." },
      ],
    },
  ],

  samples: [
    {
      title: "print vs println",
      code: J`public class PrintDemo {
    public static void main(String[] args) {
        System.out.print("Java ");
        System.out.print("is ");
        System.out.println("fun");
        System.out.println("New line here");
        System.out.println();
        System.out.println("After an empty line");
    }
}`,
      output: "Java is fun\nNew line here\n\nAfter an empty line",
      explain: "<code>print</code> keeps the cursor on the same line. <code>println()</code> with no argument just ends the line, which creates an empty line.",
    },
    {
      title: "Escape sequences",
      code: J`public class EscapeDemo {
    public static void main(String[] args) {
        System.out.println("Line one\nLine two");
        System.out.println("Roll\tName");
        System.out.println("She said \"Java\"");
        System.out.println("Folder: D:\\java\\lab1");
    }
}`,
      output: "Line one\nLine two\nRoll\tName\nShe said \"Java\"\nFolder: D:\\java\\lab1",
      explain: "<code>\\n</code> breaks the line inside one string. <code>\\t</code> inserts a tab. <code>\\\"</code> prints a quote and <code>\\\\</code> prints one backslash.",
    },
    {
      title: "printf with placeholders",
      code: J`public class PrintfDemo {
    public static void main(String[] args) {
        System.out.printf("Name: %s%n", "Meera");
        System.out.printf("Age: %d years%n", 19);
        System.out.printf("CGPA: %.2f%n", 8.4567);
        System.out.printf("[%5d]%n", 42);
        System.out.printf("[%-6s]%n", "Hi");
    }
}`,
      output: "Name: Meera\nAge: 19 years\nCGPA: 8.46\n[   42]\n[Hi    ]",
      explain: "<code>%.2f</code> rounds to 2 decimal places (8.4567 → 8.46). <code>%5d</code> right-aligns in 5 spaces; <code>%-6s</code> left-aligns in 6 spaces.",
    },
  ],

  practice: [
    {
      id: "c1t3p1",
      title: "One line, three statements",
      task: "<p>Print the line below using <b>three</b> statements: two <code>print</code> calls and one <code>println</code> call.</p>",
      expected: "Learn. Code. Repeat.",
      mustUse: ["System.out.print(", "System.out.println("],
      hints: ["<code>print</code> keeps everything on the same line. Remember the space after each full stop.", "Try: <code>print(\"Learn. \")</code>, <code>print(\"Code. \")</code>, then <code>println(\"Repeat.\")</code>."],
      solution: J`public class Main {
    public static void main(String[] args) {
        System.out.print("Learn. ");
        System.out.print("Code. ");
        System.out.println("Repeat.");
    }
}`,
    },
    {
      id: "c1t3p2",
      title: "Two lines from one statement",
      task: "<p>Print these two lines using <b>only one</b> <code>println</code> statement.</p>",
      expected: "Welcome to Java Lab\nLet's write some code",
      mustUse: ["\\n"],
      hints: ["You need a new line <b>inside</b> the string.", "Use the escape sequence <code>\\n</code> between the two sentences."],
      solution: J`public class Main {
    public static void main(String[] args) {
        System.out.println("Welcome to Java Lab\nLet's write some code");
    }
}`,
      explain: "A single quote <code>'</code> inside a double-quoted string needs no escaping.",
    },
    {
      id: "c1t3p3",
      title: "Quotes and paths",
      task: "<p>Print exactly this. You will need escape sequences for the quotes and the backslashes.</p>",
      expected: "File \"Marks.java\" is saved in C:\\students\\java",
      hints: ["A double quote inside a string is written <code>\\\"</code>.", "One backslash in the output is written <code>\\\\</code> in the code."],
      solution: J`public class Main {
    public static void main(String[] args) {
        System.out.println("File \"Marks.java\" is saved in C:\\students\\java");
    }
}`,
    },
    {
      id: "c1t3p4",
      title: "A tabbed timetable",
      task: "<p>Print this small timetable. The gap between the columns is a <b>tab</b>, so use <code>\\t</code> (not spaces).</p>",
      expected: "Day\tSubject\nMon\tJava\nTue\tMaths",
      mustUse: ["\\t"],
      hints: ["Each row is <code>column1\\tcolumn2</code>.", "<code>System.out.println(\"Day\\tSubject\");</code> is the first line."],
      solution: J`public class Main {
    public static void main(String[] args) {
        System.out.println("Day\tSubject");
        System.out.println("Mon\tJava");
        System.out.println("Tue\tMaths");
    }
}`,
    },
    {
      id: "c1t3p5",
      title: "Report card with printf",
      task: "<p>Use <code>printf</code> to print the report card. Put the values in as arguments — e.g. <code>printf(\"Student: %s%n\", \"Kavya\")</code> — don't type them into the text.</p><p>The percentage <code>87.456</code> must be printed with 1 decimal place.</p>",
      expected: "Student: Kavya\nMarks: 437 / 500\nPercentage: 87.5%",
      mustUse: ["printf", "%s", "%d", "%.1f"],
      hints: [
        "Placeholders: <code>%s</code> for text, <code>%d</code> for whole numbers, <code>%.1f</code> for one decimal place, <code>%n</code> for a new line.",
        "To print a percent sign itself in printf, write <code>%%</code>.",
        "Line 2: <code>System.out.printf(\"Marks: %d / %d%n\", 437, 500);</code>",
      ],
      solution: J`public class Main {
    public static void main(String[] args) {
        System.out.printf("Student: %s%n", "Kavya");
        System.out.printf("Marks: %d / %d%n", 437, 500);
        System.out.printf("Percentage: %.1f%%%n", 87.456);
    }
}`,
      explain: "<code>%.1f</code> rounds 87.456 to 87.5, <code>%%</code> prints a single <code>%</code>, and <code>%n</code> ends the line.",
    },
    {
      id: "c1t3p6",
      title: "Debug it",
      task: "<p>This program has <b>five</b> mistakes. Fix them so it prints the expected output. Run it first and read the compiler's messages — they tell you where to look.</p>",
      starter: J`public class Main {
    public static void main(String[] args) {
        system.out.println("Debugging is a skill")
        System.out.printn("Errors tell you the line number");
        System.out.println('Fix one error at a time');
    }
`,
      expected: "Debugging is a skill\nErrors tell you the line number\nFix one error at a time",
      hints: [
        "Check capital letters: Java is case-sensitive.",
        "Look at the end of each statement and at the name of each method.",
        "Text needs double quotes, and every <code>{</code> needs a matching <code>}</code>.",
      ],
      solution: J`public class Main {
    public static void main(String[] args) {
        System.out.println("Debugging is a skill");
        System.out.println("Errors tell you the line number");
        System.out.println("Fix one error at a time");
    }
}`,
      explain: "The five fixes: <code>system</code> → <code>System</code>; add the missing <code>;</code> on line 3; <code>printn</code> → <code>println</code>; single quotes → double quotes; and add the missing closing <code>}</code> of the class at the end. Notice the compiler does not always report all errors at once — fix one, run again.",
    },
  ],

  fill: [
    { id: "c1t3f1", prompt: "Complete the main method header.", template: "public ___ ___ main(___ args) {", answers: [["static"], ["void"], ["String[]"]],
      explain: "<code>static</code> — no object needed; <code>void</code> — returns nothing; <code>String[]</code> — array of command-line arguments." },
    { id: "c1t3f2", prompt: "Complete the class declaration for a file named <code>Marks.java</code>.", template: "public ___ ___ {", answers: [["class"], ["Marks"]],
      explain: "A public class must have the same name as its file." },
    { id: "c1t3f3", prompt: "Complete the print statement.", template: "___.___.println(\"Ready\");", answers: [["System"], ["out"]],
      explain: "<code>System</code> is the class, <code>out</code> is its static PrintStream field." },
    { id: "c1t3f4", prompt: "Fill the placeholders so this prints <code>Score: 95</code> and then <code>Grade: A</code> on the next line.", template: "System.out.printf(\"Score: ___%nGrade: ___%n\", 95, \"A\");", answers: [["%d"], ["%s"]],
      explain: "<code>%d</code> for the whole number 95, <code>%s</code> for the String \"A\". (<code>%c</code> would need a char <code>'A'</code>.)" },
    { id: "c1t3f5", prompt: "Write the escape sequences so the output is two lines: <code>Name: \"Ravi\"</code> and <code>City: Pune</code>.", template: "System.out.println(\"Name: ___Ravi___City: Pune\");", answers: [["\\\""], ["\\\"\\n"]],
      explain: "<code>\\\"</code> prints a double quote; <code>\\n</code> starts a new line. The second box needs both: <code>\\\"\\n</code>." },
  ],

  quiz: [
    { type: "output", q: "Predict the output.", code: J`public class Q1 {
    public static void main(String[] args) {
        System.out.print("A");
        System.out.println("B");
        System.out.print("C");
        System.out.print("D");
    }
}`, answer: "AB\nCD", explain: "Only <code>println(\"B\")</code> moves to a new line, so C and D appear together on the second line." },
    { type: "output", q: "Predict the output.", code: J`public class Q2 {
    public static void main(String[] args) {
        System.out.println("1\n2");
        System.out.println("3\\n4");
    }
}`, answer: "1\n2\n3\\n4", explain: "<code>\\n</code> is a new line, but <code>\\\\n</code> is a backslash followed by the letter n." },
    { type: "mcq", q: "Your file is named <code>Calculator.java</code>. Which class declaration is correct?", options: ["public class calculator", "public class Calculator", "public Class Calculator", "class public Calculator"], answer: 1,
      explain: "Exact same name, same capital letters, and the keyword <code>class</code> is lowercase." },
    { type: "mcq", q: "Why is the main method declared <code>static</code>?", options: ["So that it runs faster", "So the JVM can call it without creating an object", "So it can return a value", "So other classes cannot call it"], answer: 1,
      explain: "Static methods belong to the class; no object needs to exist before main starts." },
    { type: "mcq", q: "What does <code>System.out.printf(\"%.2f\", 7.0/3);</code> print?", options: ["2.33", "2.3333333333333335", "2", "2.34"], answer: 0,
      explain: "<code>%.2f</code> keeps two digits after the decimal point, rounding 2.333… to 2.33." },
    { type: "mcq", q: "In <code>System.out.println</code>, what is <code>out</code>?", options: ["A method", "A package", "A static field of type PrintStream", "A keyword"], answer: 2,
      explain: "<code>out</code> is a static field (variable) in the System class; <code>println</code> is a method of its type, PrintStream." },
    { type: "mcq", q: "Which line causes a compile error?", options: ["System.out.println(\"Hi\");", "System.out.println();", "System.out.println('Hi');", "System.out.print(\"Hi\");"], answer: 2,
      explain: "Single quotes can hold only one character, so <code>'Hi'</code> is an error: unclosed character literal." },
  ],
};
