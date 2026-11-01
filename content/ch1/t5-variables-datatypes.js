const J = String.raw;

export default {
  title: "Variables & primitive data types",
  summary: "Variables are named boxes that hold values. The data type decides what kind of value fits in the box and how much memory it uses.",

  concept: J`
<h2>Concept</h2>
<h3>What is a variable?</h3>
<p>A <b>variable</b> is a named location in memory that stores a value. Java is <b>statically typed</b>: every variable has a type that is fixed when you declare it, and the compiler checks that you only store matching values.</p>
<pre class="java">int age;            // declaration: type + name
age = 19;           // assignment
int marks = 87;     // declaration + initialization in one line
int a = 1, b = 2;   // several variables of the same type
marks = 91;         // a variable can change (that's why it is "variable")</pre>
<div class="warn">A <b>local variable</b> (declared inside a method) must be given a value before you use it. <code>int x; System.out.println(x);</code> → <code>error: variable x might not have been initialized</code>.</div>

<h3>Two families of data types</h3>
<ul>
<li><b>Primitive types</b> — 8 built-in types that store the value directly (numbers, characters, true/false).</li>
<li><b>Reference types</b> — classes, arrays, interfaces (e.g. <code>String</code>, <code>int[]</code>). The variable stores a <i>reference</i> (address) to an object. You'll learn these later.</li>
</ul>

<h3>The 8 primitive types</h3>
<table>
<tr><th>Type</th><th>Size</th><th>Range / values</th><th>Default*</th><th>Example</th></tr>
<tr><td><code>byte</code></td><td>1 byte (8 bits)</td><td>-128 to 127</td><td>0</td><td><code>byte b = 100;</code></td></tr>
<tr><td><code>short</code></td><td>2 bytes</td><td>-32,768 to 32,767</td><td>0</td><td><code>short s = 3000;</code></td></tr>
<tr><td><code>int</code></td><td>4 bytes</td><td>about -2.1 billion to 2.1 billion (-2<sup>31</sup> to 2<sup>31</sup>-1)</td><td>0</td><td><code>int n = 250000;</code></td></tr>
<tr><td><code>long</code></td><td>8 bytes</td><td>-2<sup>63</sup> to 2<sup>63</sup>-1</td><td>0L</td><td><code>long pop = 1400000000L;</code></td></tr>
<tr><td><code>float</code></td><td>4 bytes</td><td>about 6–7 decimal digits of precision</td><td>0.0f</td><td><code>float f = 3.5f;</code></td></tr>
<tr><td><code>double</code></td><td>8 bytes</td><td>about 15–16 decimal digits of precision</td><td>0.0</td><td><code>double pi = 3.14159;</code></td></tr>
<tr><td><code>char</code></td><td>2 bytes</td><td>one Unicode character, 0 to 65,535</td><td>'\u0000'</td><td><code>char grade = 'A';</code></td></tr>
<tr><td><code>boolean</code></td><td>JVM dependent (1 bit of information)</td><td><code>true</code> or <code>false</code></td><td>false</td><td><code>boolean pass = true;</code></td></tr>
</table>
<p class="small muted">*Default values apply to fields (variables in a class), not to local variables.</p>

<h3>Choosing a type</h3>
<ul>
<li>Whole numbers → <code>int</code> by default; <code>long</code> when values can exceed about 2 billion (phone numbers, populations, milliseconds).</li>
<li>Decimal numbers → <code>double</code> by default. Use <code>float</code> only to save memory.</li>
<li>Money in real systems → not double (see the precision trap below); professionals use <code>long</code> paise or <code>BigDecimal</code>.</li>
<li>One character → <code>char</code> with <b>single</b> quotes. Text → <code>String</code> with double quotes.</li>
<li>Yes/No → <code>boolean</code>. In Java a boolean is <b>not</b> a number: <code>boolean b = 1;</code> is an error.</li>
</ul>

<h3>Integer overflow — the number wraps around</h3>
<p>If a value goes beyond the range of its type, Java does not stop with an error. It silently <b>wraps around</b> to the other end:</p>
<pre class="java">int big = 2147483647;    // Integer.MAX_VALUE
big = big + 1;
System.out.println(big); // -2147483648</pre>

<h3>Floating-point is approximate</h3>
<p><code>double</code> stores numbers in binary, so many decimals (like 0.1) can't be stored exactly. <code>0.1 + 0.2</code> prints <code>0.30000000000000004</code>. Never compare doubles with <code>==</code> for exact equality in real programs.</p>

<h3>char is a number underneath</h3>
<p>A <code>char</code> stores the Unicode code of the character. <code>'A'</code> is 65, <code>'a'</code> is 97, <code>'0'</code> is 48. So <code>'A' + 1</code> is the int 66, and <code>(char)('A' + 1)</code> is <code>'B'</code>.</p>
`,

  syntax: [
    { title: "Declaring and initializing a variable", parts: [
      { t: "double", m: "<b>Data type</b> — decides what values the variable can hold and how much memory it uses." },
      { t: " " },
      { t: "price", m: "<b>Variable name</b> — an identifier in camelCase." },
      { t: " " },
      { t: "=", m: "<b>Assignment operator</b> — stores the value on the right into the variable on the left." },
      { t: " " },
      { t: "249.99", m: "<b>Literal</b> — the value written directly in the code." },
      { t: ";", m: "End of statement." },
    ]},
  ],

  samples: [
    {
      title: "All eight primitive types",
      code: J`public class Primitives {
    public static void main(String[] args) {
        byte level = 7;
        short year = 2026;
        int students = 70;
        long distanceKm = 384400L;
        float ratingF = 4.5f;
        double cgpa = 8.75;
        char section = 'B';
        boolean isOpen = true;
        System.out.println(level + " " + year + " " + students + " " + distanceKm);
        System.out.println(ratingF + " " + cgpa + " " + section + " " + isOpen);
    }
}`,
      output: "7 2026 70 384400\n4.5 8.75 B true",
    },
    {
      title: "Overflow wraps around",
      code: J`public class Overflow {
    public static void main(String[] args) {
        byte b = 127;
        b++;
        System.out.println(b);
        int i = 2147483647;
        i = i + 1;
        System.out.println(i);
        long ok = 2147483647L + 1;
        System.out.println(ok);
    }
}`,
      output: "-128\n-2147483648\n2147483648",
      explain: "byte and int wrap around to their minimum. Using <code>long</code> gives the correct result because it has room for bigger numbers.",
    },
    {
      title: "char arithmetic and decimal precision",
      code: J`public class CharDouble {
    public static void main(String[] args) {
        char c = 'A';
        System.out.println(c + 1);
        System.out.println((char) (c + 1));
        System.out.println(0.1 + 0.2);
        System.out.println(10 / 4);
        System.out.println(10.0 / 4);
    }
}`,
      output: "66\nB\n0.30000000000000004\n2\n2.5",
      explain: "<code>c + 1</code> becomes an int (66). Dividing two ints drops the decimal part (10 / 4 = 2); if one operand is a double the result is a double.",
    },
  ],

  practice: [
    {
      id: "c1t5p1", title: "Student profile",
      task: "<p>Create variables with the most suitable types: name <code>\"Isha\"</code> (String), age <code>18</code>, section <code>'C'</code>, cgpa <code>9.1</code>, hosteller <code>false</code>. Print them as shown using the variables.</p>",
      expected: "Name: Isha\nAge: 18\nSection: C\nCGPA: 9.1\nHosteller: false",
      mustUse: ["char", "double", "boolean"],
      hints: ["<code>char section = 'C';</code> uses single quotes.", "Print with <code>System.out.println(\"Age: \" + age);</code>"],
      solution: J`public class Main {
    public static void main(String[] args) {
        String name = "Isha";
        int age = 18;
        char section = 'C';
        double cgpa = 9.1;
        boolean hosteller = false;
        System.out.println("Name: " + name);
        System.out.println("Age: " + age);
        System.out.println("Section: " + section);
        System.out.println("CGPA: " + cgpa);
        System.out.println("Hosteller: " + hosteller);
    }
}`,
    },
    {
      id: "c1t5p2", title: "Rectangle calculator",
      task: "<p>Store length <code>12.5</code> and width <code>4</code> in <code>double</code> variables. Calculate the area and perimeter in variables and print them.</p>",
      expected: "Area = 50.0\nPerimeter = 33.0",
      mustUse: ["double"],
      hints: ["Area = length × width; perimeter = 2 × (length + width).", "Store results in variables before printing, e.g. <code>double area = length * width;</code>"],
      solution: J`public class Main {
    public static void main(String[] args) {
        double length = 12.5;
        double width = 4;
        double area = length * width;
        double perimeter = 2 * (length + width);
        System.out.println("Area = " + area);
        System.out.println("Perimeter = " + perimeter);
    }
}`,
    },
    {
      id: "c1t5p3", title: "Swap two numbers",
      task: "<p>Given <code>int x = 15, y = 40;</code> swap their values using a third variable <code>temp</code>, then print.</p>",
      expected: "Before: x = 15, y = 40\nAfter: x = 40, y = 15",
      mustUse: ["temp"],
      hints: ["Save x in temp, copy y into x, then copy temp into y.", "<code>int temp = x; x = y; y = temp;</code>"],
      solution: J`public class Main {
    public static void main(String[] args) {
        int x = 15, y = 40;
        System.out.println("Before: x = " + x + ", y = " + y);
        int temp = x;
        x = y;
        y = temp;
        System.out.println("After: x = " + x + ", y = " + y);
    }
}`,
    },
    {
      id: "c1t5p4", title: "Swap without a third variable",
      task: "<p>Swap <code>a = 7</code> and <code>b = 3</code> using only addition and subtraction — no third variable.</p>",
      expected: "a = 3, b = 7",
      hints: ["Start with <code>a = a + b;</code> — now a holds the total.", "Then <code>b = a - b;</code> and <code>a = a - b;</code>"],
      solution: J`public class Main {
    public static void main(String[] args) {
        int a = 7, b = 3;
        a = a + b;
        b = a - b;
        a = a - b;
        System.out.println("a = " + a + ", b = " + b);
    }
}`,
    },
    {
      id: "c1t5p5", title: "Seconds converter",
      task: "<p>Convert <code>10000</code> seconds into hours, minutes and seconds using integer division <code>/</code> and remainder <code>%</code>.</p>",
      expected: "2 h 46 min 40 s",
      mustUse: ["/", "%"],
      hints: ["Hours = total / 3600.", "Remaining seconds after hours = total % 3600; minutes = that / 60; seconds = total % 60."],
      solution: J`public class Main {
    public static void main(String[] args) {
        int total = 10000;
        int hours = total / 3600;
        int minutes = (total % 3600) / 60;
        int seconds = total % 60;
        System.out.println(hours + " h " + minutes + " min " + seconds + " s");
    }
}`,
    },
    {
      id: "c1t5p6", title: "Next letters",
      task: "<p>Store <code>char start = 'P';</code>. Print the next three letters by adding to <code>start</code> and casting back to <code>char</code>, all on one line.</p>",
      expected: "Q R S",
      mustUse: ["(char)"],
      hints: ["<code>start + 1</code> is an int; <code>(char) (start + 1)</code> is the letter.", "Join them with <code>\" \"</code>. Careful: <code>char + char</code> adds numbers, so start the expression with a String or print in parts."],
      solution: J`public class Main {
    public static void main(String[] args) {
        char start = 'P';
        char a = (char) (start + 1);
        char b = (char) (start + 2);
        char c = (char) (start + 3);
        System.out.println(a + " " + b + " " + c);
    }
}`,
    },
  ],

  fill: [
    { id: "c1t5f1", prompt: "Choose the right types.", template: "___ distance = 9876543210L;\n___ grade = 'A';\n___ passed = true;", answers: [["long"], ["char"], ["boolean"]], explain: "The <code>L</code> suffix marks a long literal; chars use single quotes." },
    { id: "c1t5f2", prompt: "Complete the float declaration.", template: "float temperature = 36.6___;", answers: [["f", "F"]], explain: "Decimal literals are double by default; add <code>f</code> to make it a float." },
    { id: "c1t5f3", prompt: "How many bytes does each type use?", template: "byte: ___  short: ___  int: ___  long: ___", answers: [["1"], ["2"], ["4"], ["8"]], explain: "1, 2, 4 and 8 bytes." },
  ],

  quiz: [
    { type: "mcq", q: "What is the range of <code>byte</code>?", options: ["0 to 255", "-128 to 127", "-127 to 128", "-256 to 255"], answer: 1, explain: "8 bits, signed: -2<sup>7</sup> to 2<sup>7</sup>-1." },
    { type: "mcq", q: "Which line does NOT compile?", options: ["double d = 5;", "long l = 5;", "boolean b = 0;", "char c = 65;"], answer: 2, explain: "boolean only accepts true/false. <code>char c = 65;</code> is fine (it is 'A')." },
    { type: "mcq", q: "What happens here? <code>int x; System.out.println(x);</code> inside main", options: ["prints 0", "prints null", "compile error", "runtime error"], answer: 2, explain: "Local variables have no default value — 'variable x might not have been initialized'." },
    { type: "output", q: "Predict the output.", code: J`public class Q {
    public static void main(String[] args) {
        short s = 32767;
        s++;
        System.out.println(s);
        System.out.println(7 / 2 + " " + 7 / 2.0);
    }
}`, answer: "-32768\n3 3.5", explain: "short wraps from 32767 to -32768. 7/2 is integer division; 7/2.0 is decimal division." },
    { type: "output", q: "Predict the output.", code: J`public class Q {
    public static void main(String[] args) {
        char c = 'a';
        System.out.println(c + 2);
        System.out.println((char) (c + 2));
    }
}`, answer: "99\nc", explain: "'a' is 97, so c + 2 is the int 99; cast back to char it is 'c'." },
    { type: "mcq", q: "Which type is the best choice to store the world population (about 8 billion)?", options: ["int", "long", "short", "float"], answer: 1, explain: "8 billion is larger than int's maximum (about 2.1 billion)." },
  ],
};
