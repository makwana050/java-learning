const J = String.raw;

export default {
  title: "Input: Scanner & command-line arguments",
  summary: "Programs become useful when they read data. Learn the Scanner class for keyboard input and how command-line arguments reach main.",

  concept: J`
<h2>Concept</h2>
<h3>1. The Scanner class</h3>
<p><code>Scanner</code> (in the package <code>java.util</code>) reads text and converts it into numbers, words or lines. To read from the keyboard, connect it to <code>System.in</code>:</p>
<pre class="java">import java.util.Scanner;           // 1. import it (before the class)

public class Add {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);   // 2. create a Scanner
        System.out.print("Enter two numbers: ");
        int a = sc.nextInt();                  // 3. read values
        int b = sc.nextInt();
        System.out.println("Sum = " + (a + b));
        sc.close();                            // 4. close it when done
    }
}</pre>

<h3>Scanner methods</h3>
<table>
<tr><th>Method</th><th>Reads</th><th>Input "25 Ravi Kumar"</th></tr>
<tr><td><code>nextInt()</code></td><td>next whole number</td><td>25</td></tr>
<tr><td><code>nextDouble()</code>, <code>nextLong()</code>, <code>nextBoolean()</code></td><td>next value of that type</td><td></td></tr>
<tr><td><code>next()</code></td><td>next <b>word</b> (stops at a space)</td><td>after 25 → "Ravi"</td></tr>
<tr><td><code>nextLine()</code></td><td>the <b>rest of the current line</b>, including spaces</td><td>after 25 → " Ravi Kumar"</td></tr>
<tr><td><code>next().charAt(0)</code></td><td>one character (there is no nextChar)</td><td></td></tr>
<tr><td><code>hasNextInt()</code>, <code>hasNext()</code></td><td>checks whether another value is available</td><td>true / false</td></tr>
</table>

<h3>The famous nextInt() + nextLine() trap</h3>
<p>Suppose the user types <code>21</code> ⏎ then <code>Asha Rao</code> ⏎. <code>nextInt()</code> reads 21 but leaves the Enter (newline) behind. The following <code>nextLine()</code> immediately reads that leftover empty line, so the name becomes <code>""</code>.</p>
<p><b>Fix:</b> call an extra <code>sc.nextLine();</code> after <code>nextInt()</code> to consume the leftover newline, then read the real line.</p>

<h3>InputMismatchException</h3>
<p>If the user types <code>abc</code> when <code>nextInt()</code> expects a number, the program crashes with <code>java.util.InputMismatchException</code>. Later, in exception handling, you'll learn to handle it.</p>

<h3>How to practise on this website</h3>
<div class="note">The Run button here cannot type into a keyboard prompt. Instead, give the Scanner a <b>String</b> as its input — it works exactly the same way:
<pre class="java">Scanner sc = new Scanner("21\nAsha Rao");   // pretend the user typed this
int age = sc.nextInt();</pre>
In the lab, replace the string with <code>System.in</code> and type the input yourself.</div>

<h3>2. Command-line arguments</h3>
<p>Values written after the class name when running a program are passed into <code>main</code> through <code>String[] args</code>:</p>
<pre>java Marks Priya 82 91</pre>
<table>
<tr><th>Expression</th><th>Value</th></tr>
<tr><td><code>args.length</code></td><td>3</td></tr>
<tr><td><code>args[0]</code></td><td>"Priya"</td></tr>
<tr><td><code>args[1]</code></td><td>"82" — a String, not a number!</td></tr>
<tr><td><code>Integer.parseInt(args[1]) + Integer.parseInt(args[2])</code></td><td>173</td></tr>
</table>
<ul>
<li>Every argument arrives as a <b>String</b> — convert with <code>Integer.parseInt</code> / <code>Double.parseDouble</code>.</li>
<li>Arguments are separated by spaces; use quotes for one argument with spaces: <code>java Hello "Asha Rao"</code>.</li>
<li>Accessing <code>args[5]</code> when only 3 were given → <code>ArrayIndexOutOfBoundsException</code>.</li>
<li>With no arguments, <code>args</code> is an empty array (length 0), not null.</li>
</ul>
`,

  samples: [
    {
      title: "Reading different types",
      code: J`import java.util.Scanner;

public class ReadTypes {
    public static void main(String[] args) {
        Scanner sc = new Scanner("Neha 19 8.6 true");
        String name = sc.next();
        int age = sc.nextInt();
        double cgpa = sc.nextDouble();
        boolean hosteller = sc.nextBoolean();
        System.out.println(name + " is " + age);
        System.out.println("CGPA " + cgpa + ", hosteller: " + hosteller);
        sc.close();
    }
}`,
      output: "Neha is 19\nCGPA 8.6, hosteller: true",
    },
    {
      title: "The nextInt() + nextLine() trap",
      code: J`import java.util.Scanner;

public class Trap {
    public static void main(String[] args) {
        Scanner sc = new Scanner("21\nAsha Rao\n22\nVikram Shah");
        int age1 = sc.nextInt();
        String name1 = sc.nextLine();
        System.out.println("[" + name1 + "]");

        String skip = sc.nextLine();
        int age2 = sc.nextInt();
        sc.nextLine();
        String name2 = sc.nextLine();
        System.out.println("[" + name2 + "] " + age2);
    }
}`,
      output: "[]\n[Vikram Shah] 22",
      explain: "The first nextLine() returns the empty leftover after 21. Calling an extra <code>sc.nextLine()</code> after nextInt() fixes it.",
    },
    {
      title: "Reading until input ends",
      code: J`import java.util.Scanner;

public class SumAll {
    public static void main(String[] args) {
        Scanner sc = new Scanner("4 8 15 16 23 42");
        int sum = 0, count = 0;
        while (sc.hasNextInt()) {
            sum += sc.nextInt();
            count++;
        }
        System.out.println(count + " numbers, sum = " + sum);
    }
}`,
      output: "6 numbers, sum = 108",
    },
  ],

  practice: [
    {
      id: "c1t8p1", title: "Simple interest",
      task: "<p>Read principal, rate and time from the input <code>\"5000 7.5 3\"</code> using a Scanner and print the simple interest (P × R × T / 100).</p>",
      starter: J`import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner("5000 7.5 3");
        // read the three values and print the interest
    }
}`,
      expected: "Simple Interest = 1125.0",
      mustUse: ["nextDouble"],
      hints: ["Read all three with <code>sc.nextDouble()</code>.", "<code>double si = p * r * t / 100;</code>"],
      solution: J`import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner("5000 7.5 3");
        double p = sc.nextDouble();
        double r = sc.nextDouble();
        double t = sc.nextDouble();
        double si = p * r * t / 100;
        System.out.println("Simple Interest = " + si);
        sc.close();
    }
}`,
    },
    {
      id: "c1t8p2", title: "Full name and city",
      task: "<p>The input is two lines: an age and a full name with spaces, then a city. Read them correctly (avoid the nextLine trap!) and print as shown.</p>",
      starter: J`import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner("20\nKaran Mehta\nSurat");
        // read age, full name and city
    }
}`,
      expected: "Karan Mehta (20) from Surat",
      mustUse: ["nextInt", "nextLine"],
      hints: ["After <code>nextInt()</code>, call <code>sc.nextLine();</code> once to skip the leftover newline.", "Then read the name with nextLine() and the city with nextLine()."],
      solution: J`import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner("20\nKaran Mehta\nSurat");
        int age = sc.nextInt();
        sc.nextLine();
        String name = sc.nextLine();
        String city = sc.nextLine();
        System.out.println(name + " (" + age + ") from " + city);
    }
}`,
    },
    {
      id: "c1t8p3", title: "First letter",
      task: "<p>Read the word from the input <code>\"java\"</code> and print its first character in capitals. Scanner has no <code>nextChar()</code>.</p>",
      starter: J`import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner("java");
    }
}`,
      expected: "First letter: J",
      mustUse: ["charAt(0)"],
      hints: ["<code>char c = sc.next().charAt(0);</code>", "<code>Character.toUpperCase(c)</code>"],
      solution: J`import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner("java");
        char c = sc.next().charAt(0);
        System.out.println("First letter: " + Character.toUpperCase(c));
    }
}`,
    },
    {
      id: "c1t8p4", title: "Marks from command-line arguments",
      task: "<p>Imagine the program is run as <code>java Main Riya 72 88</code>. Inside main, the first line creates that <code>args</code> array for you. Convert the marks and print the name and total.</p>",
      starter: J`public class Main {
    public static void main(String[] args) {
        args = new String[] {"Riya", "72", "88"}; // pretend command-line input
        // your code
    }
}`,
      expected: "Arguments: 3\nRiya scored 160",
      mustUse: ["args.length", "Integer.parseInt"],
      hints: ["<code>args.length</code> is the count.", "<code>Integer.parseInt(args[1]) + Integer.parseInt(args[2])</code>"],
      solution: J`public class Main {
    public static void main(String[] args) {
        args = new String[] {"Riya", "72", "88"};
        System.out.println("Arguments: " + args.length);
        int total = Integer.parseInt(args[1]) + Integer.parseInt(args[2]);
        System.out.println(args[0] + " scored " + total);
    }
}`,
    },
    {
      id: "c1t8p5", title: "Average of all numbers",
      task: "<p>The input contains an unknown number of integers. Read all of them with <code>hasNextInt()</code> and print the count, the sum and the average (as a double).</p>",
      starter: J`import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner("12 7 30 5 21");
    }
}`,
      expected: "Count: 5\nSum: 75\nAverage: 15.0",
      mustUse: ["hasNextInt"],
      hints: ["Loop: <code>while (sc.hasNextInt()) { sum += sc.nextInt(); count++; }</code>", "Average: <code>(double) sum / count</code>"],
      solution: J`import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner("12 7 30 5 21");
        int sum = 0, count = 0;
        while (sc.hasNextInt()) {
            sum += sc.nextInt();
            count++;
        }
        System.out.println("Count: " + count);
        System.out.println("Sum: " + sum);
        System.out.println("Average: " + (double) sum / count);
    }
}`,
    },
  ],

  fill: [
    { id: "c1t8f1", prompt: "Create a Scanner that reads from the keyboard.", template: "import java.___.Scanner;\nScanner sc = new Scanner(System.___);", answers: [["util"], ["in"]], explain: "Scanner lives in java.util; System.in is the keyboard (standard input)." },
    { id: "c1t8f2", prompt: "Read a whole line with spaces, and one word.", template: "String address = sc.___();\nString word = sc.___();", answers: [["nextLine"], ["next"]], explain: "nextLine() reads to the end of the line; next() reads one word." },
    { id: "c1t8f3", prompt: "Read the second command-line argument as a number.", template: "int qty = Integer.parseInt(args[___]);", answers: [["1"]], explain: "Arrays start at index 0, so the second argument is args[1]." },
  ],

  quiz: [
    { type: "mcq", q: "Input is <code>Ravi Kumar</code>. What does <code>sc.next()</code> return?", options: ["Ravi Kumar", "Ravi", "Kumar", "R"], answer: 1, explain: "next() stops at whitespace." },
    { type: "mcq", q: "Program run as <code>java App</code> (no arguments). What is <code>args.length</code>?", options: ["null", "0", "1", "Error"], answer: 1, explain: "args is an empty array." },
    { type: "mcq", q: "Run as <code>java App 5 6</code>. What does <code>System.out.println(args[0] + args[1]);</code> print?", options: ["11", "56", "5 6", "Error"], answer: 1, explain: "Arguments are Strings, so + joins them." },
    { type: "output", q: "Predict the output.", code: J`import java.util.Scanner;
public class Q {
    public static void main(String[] args) {
        Scanner sc = new Scanner("10 20\n30");
        int a = sc.nextInt();
        String rest = sc.nextLine();
        int c = sc.nextInt();
        System.out.println(a + "|" + rest + "|" + c);
    }
}`, answer: "10| 20|30", explain: "nextLine() returns the rest of the first line: \" 20\" (with the space)." },
    { type: "mcq", q: "User types <code>twelve</code> for <code>nextInt()</code>. What happens?", options: ["returns 0", "returns 12", "InputMismatchException", "compile error"], answer: 2, explain: "The token is not an int." },
  ],
};
