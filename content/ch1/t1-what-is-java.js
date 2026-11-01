const J = String.raw; // keeps backslashes like \n exactly as written

export default {
  title: "What is Java?",
  summary: "What Java is, why it became so popular, and the journey of a program from the code you type to the output you see.",

  concept: J`
<h2>Concept</h2>
<h3>A programming language for humans and machines</h3>
<p>A computer only understands <b>machine code</b> — long patterns of 0s and 1s that are different for every type of processor. Writing those by hand is impossible for real programs, so we write in a <b>programming language</b> that people can read, and a tool translates it for the machine.</p>
<p><b>Java</b> is one of those languages. It was created by <b>James Gosling</b> and his team at <b>Sun Microsystems</b>, and released in <b>1995</b>. Oracle bought Sun in 2010 and maintains Java today. It was first called <i>Oak</i> (after a tree outside Gosling's office) and was renamed Java after the coffee.</p>

<h3>The big idea: Write Once, Run Anywhere</h3>
<p>In languages like C, the compiler turns your program into machine code for <i>one</i> type of computer. A program compiled on Windows will not run on a Mac.</p>
<p>Java takes a different route. The Java compiler does <b>not</b> produce machine code. It produces <b>bytecode</b> — instructions for an imaginary computer called the <b>Java Virtual Machine (JVM)</b>. Every operating system has its own JVM, and each JVM knows how to run the same bytecode on its machine.</p>
<div class="note">So you compile <b>once</b>, and the same <code>.class</code> file runs on Windows, Linux and macOS. This promise is called <b>WORA — Write Once, Run Anywhere</b>.</div>

<h3>The journey of a Java program</h3>
<table>
<tr><th>Step</th><th>What you do</th><th>What happens</th><th>File</th></tr>
<tr><td>1. Write</td><td>Type the program in an editor</td><td>Human-readable source code</td><td><code>Hello.java</code></td></tr>
<tr><td>2. Compile</td><td><code>javac Hello.java</code></td><td>The compiler checks the code for mistakes and converts it into bytecode</td><td><code>Hello.class</code></td></tr>
<tr><td>3. Run</td><td><code>java Hello</code></td><td>The JVM loads the bytecode, checks it, and executes it on your machine</td><td>Output on screen</td></tr>
</table>
<p>Notice two details: you compile with the file name <b>including</b> <code>.java</code>, but you run with the class name <b>without</b> <code>.class</code>.</p>
<p>Two kinds of mistakes can happen:</p>
<ul>
<li><b>Compile-time errors</b> — found by <code>javac</code> before the program runs (a missing semicolon, a misspelled keyword). No <code>.class</code> file is produced.</li>
<li><b>Runtime errors</b> — the program compiled fine but crashed while running (for example, dividing an integer by zero).</li>
</ul>

<h3>Why Java became so popular — its main features</h3>
<table>
<tr><th>Feature</th><th>What it means for you</th></tr>
<tr><td><b>Simple</b></td><td>Syntax similar to C/C++ but without confusing parts like pointers and manual memory freeing.</td></tr>
<tr><td><b>Object-oriented</b></td><td>Programs are built from objects that combine data and behaviour (you will learn this in the OOP chapter).</td></tr>
<tr><td><b>Platform independent</b></td><td>Bytecode runs on any machine that has a JVM.</td></tr>
<tr><td><b>Secure</b></td><td>Bytecode is verified before it runs, and there are no pointers to access memory directly.</td></tr>
<tr><td><b>Robust</b></td><td>Strong type checking at compile time, exception handling, and automatic <b>garbage collection</b> (unused memory is freed for you).</td></tr>
<tr><td><b>Multithreaded</b></td><td>A program can do several tasks at the same time.</td></tr>
<tr><td><b>High performance</b></td><td>The JVM's <b>JIT (Just-In-Time) compiler</b> turns frequently used bytecode into fast machine code while the program runs.</td></tr>
</table>

<h3>Where is Java used?</h3>
<p>Banking and enterprise back-end systems, Android apps, big-data tools (Hadoop, Kafka, Spark), web servers, scientific software and games such as Minecraft.</p>

<h3>Java versions</h3>
<p>A new Java version is released every six months. Every two years one of them is a <b>Long-Term Support (LTS)</b> version that companies use for years: <b>Java 8, 11, 17, 21 and 25</b>. Your course uses <b>JDK 25</b>.</p>
<div class="warn"><b>About the Run button on this website:</b> programs here run inside your browser using a Java 8 compiler. Everything in the early chapters works the same in every version. Newer syntax such as the Java 25 short <code>void main()</code> form is explained in the lessons — try those on your own JDK 25 in the lab.</div>

<h3>Your first look at Java code</h3>
<pre class="java">public class Hello {
    public static void main(String[] args) {
        System.out.println("Hello, Java!");
    }
}</pre>
<p>Don't worry about every word yet — the topic <i>"Your first program, line by line"</i> explains each one. For now, remember: the line inside the braces, <code>System.out.println(...)</code>, prints whatever is inside the brackets and then moves to a new line.</p>
`,

  samples: [
    {
      title: "Hello, Java!",
      note: "The smallest complete Java program. The text inside the double quotes is printed exactly.",
      code: J`public class Hello {
    public static void main(String[] args) {
        System.out.println("Hello, Java!");
    }
}`,
      output: "Hello, Java!",
    },
    {
      title: "Statements run from top to bottom",
      note: "Each <code>println</code> is one statement. Java runs them in order, one per line of output.",
      code: J`public class Steps {
    public static void main(String[] args) {
        System.out.println("1. Write the source code");
        System.out.println("2. Compile it with javac");
        System.out.println("3. Run it with java");
    }
}`,
      output: "1. Write the source code\n2. Compile it with javac\n3. Run it with java",
    },
    {
      title: "Java can calculate too",
      note: "When there are no quotes, Java works out the value first and then prints the result.",
      code: J`public class Calc {
    public static void main(String[] args) {
        System.out.println(1995);
        System.out.println(2026 - 1995);
        System.out.println("2026 - 1995");
    }
}`,
      output: "1995\n31\n2026 - 1995",
      explain: "Line 2 has no quotes, so Java calculates <code>2026 - 1995 = 31</code>. Line 3 is inside quotes, so it is just text and is printed as it is.",
    },
  ],

  practice: [
    {
      id: "c1t1p1",
      title: "Introduce Java",
      task: "<p>Write a program that prints the sentence below exactly. Pay attention to capital letters, spaces and the full stop.</p>",
      expected: "Java is a platform independent language.",
      hints: [
        "Use <code>System.out.println(\"...\");</code> inside the <code>main</code> method.",
        "Copy the sentence character by character — <code>Java</code> starts with a capital J and the line ends with a full stop.",
      ],
      solution: J`public class Main {
    public static void main(String[] args) {
        System.out.println("Java is a platform independent language.");
    }
}`,
    },
    {
      id: "c1t1p2",
      title: "Java fact card",
      task: "<p>Print these four facts about Java, each on its own line.</p>",
      expected: "Name: Java\nCreator: James Gosling\nCompany: Sun Microsystems\nYear: 1995",
      hints: [
        "You need four separate <code>println</code> statements — one for each line.",
        "There is one space after each colon, e.g. <code>\"Name: Java\"</code>.",
      ],
      solution: J`public class Main {
    public static void main(String[] args) {
        System.out.println("Name: Java");
        System.out.println("Creator: James Gosling");
        System.out.println("Company: Sun Microsystems");
        System.out.println("Year: 1995");
    }
}`,
    },
    {
      id: "c1t1p3",
      title: "The compile-and-run pipeline",
      task: "<p>Print the journey of a Java program as a simple text diagram.</p>",
      expected: "Hello.java\n    |  javac\n    v\nHello.class\n    |  java\n    v\nOutput",
      hints: [
        "Spaces inside the quotes are printed too. Count them: the <code>|</code> and <code>v</code> lines start with 4 spaces.",
        "Between <code>|</code> and <code>javac</code> there are 2 spaces.",
      ],
      solution: J`public class Main {
    public static void main(String[] args) {
        System.out.println("Hello.java");
        System.out.println("    |  javac");
        System.out.println("    v");
        System.out.println("Hello.class");
        System.out.println("    |  java");
        System.out.println("    v");
        System.out.println("Output");
    }
}`,
    },
    {
      id: "c1t1p4",
      title: "How old is Java?",
      task: "<p>Print the age of Java in 2026 using a calculation, not by typing the answer. Java was released in 1995.</p><p>Print the label in the first line and the calculated value in the second line.</p>",
      expected: "Age of Java in 2026:\n31",
      mustUse: ["2026 - 1995"],
      hints: [
        "Text goes inside quotes. A calculation goes <b>without</b> quotes.",
        "<code>System.out.println(2026 - 1995);</code> prints the result of the subtraction.",
      ],
      solution: J`public class Main {
    public static void main(String[] args) {
        System.out.println("Age of Java in 2026:");
        System.out.println(2026 - 1995);
    }
}`,
      explain: "If you write <code>\"2026 - 1995\"</code> with quotes, Java prints the text itself instead of calculating it.",
    },
  ],

  fill: [
    {
      id: "c1t1f1",
      prompt: "Complete the command that <b>compiles</b> the file <code>Hello.java</code>.",
      template: "___ Hello.java",
      answers: [["javac"]],
      explain: "<code>javac</code> is the Java compiler. It reads <code>Hello.java</code> and creates <code>Hello.class</code>.",
    },
    {
      id: "c1t1f2",
      prompt: "Complete the command that <b>runs</b> the compiled program.",
      template: "___ ___",
      answers: [["java"], ["Hello"]],
      explain: "Run with <code>java</code> followed by the class name — no <code>.class</code> and no <code>.java</code>.",
    },
    {
      id: "c1t1f3",
      prompt: "Fill in the file names in the journey of a program.",
      template: "Hello.___  --javac-->  Hello.___  --java-->  output",
      answers: [["java"], ["class"]],
      explain: "Source code is in a <code>.java</code> file; bytecode is in a <code>.class</code> file.",
    },
    {
      id: "c1t1f4",
      prompt: "Complete the statement that prints <code>Hi</code>.",
      template: "System.out.___(\"Hi\")___",
      answers: [["println"], [";"]],
      explain: "<code>println</code> prints and moves to the next line. Every statement in Java ends with a semicolon <code>;</code>.",
    },
  ],

  quiz: [
    { type: "mcq", q: "What does the <code>javac</code> compiler produce?", options: ["Machine code for your processor", "Bytecode in a .class file", "A .exe file", "A .java file"], answer: 1,
      explain: "<code>javac</code> produces platform-independent bytecode, stored in a <code>.class</code> file." },
    { type: "mcq", q: "Which part makes 'Write Once, Run Anywhere' possible?", options: ["The text editor", "The operating system", "The JVM available for each platform", "The internet"], answer: 2,
      explain: "The same bytecode runs everywhere because every platform has its own JVM that understands it." },
    { type: "mcq", q: "Who created Java?", options: ["Dennis Ritchie", "James Gosling", "Bjarne Stroustrup", "Guido van Rossum"], answer: 1,
      explain: "James Gosling led the team at Sun Microsystems. (Ritchie created C, Stroustrup C++, van Rossum Python.)" },
    { type: "mcq", q: "A missing semicolon is reported by <code>javac</code> before the program runs. What kind of error is it?", options: ["Runtime error", "Compile-time error", "Logical error", "Hardware error"], answer: 1,
      explain: "The compiler finds it, so it is a compile-time error and no .class file is created." },
    { type: "mcq", q: "Which feature frees memory that your program no longer uses?", options: ["JIT compiler", "Bytecode verifier", "Garbage collector", "javac"], answer: 2,
      explain: "The garbage collector automatically removes objects that are no longer used." },
    { type: "output", q: "Predict the output of this program.", code: J`public class Q {
    public static void main(String[] args) {
        System.out.println("10 + 5");
        System.out.println(10 + 5);
    }
}`, answer: "10 + 5\n15", explain: "Inside quotes it is text; without quotes Java calculates the sum." },
  ],
};
