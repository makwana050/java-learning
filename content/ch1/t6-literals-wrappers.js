const J = String.raw;

export default {
  title: "Literals, wrapper classes & default values",
  summary: "How to write values directly in code (in decimal, binary, hex…), the wrapper class for each primitive, and what value a field gets if you don't set one.",

  concept: J`
<h2>Concept</h2>
<h3>1. Literals</h3>
<p>A <b>literal</b> is a fixed value written directly in the source code, like <code>42</code>, <code>3.5</code>, <code>'x'</code>, <code>"Hi"</code> or <code>true</code>.</p>
<table>
<tr><th>Kind</th><th>Examples</th><th>Notes</th></tr>
<tr><td>Integer (decimal)</td><td><code>250</code>, <code>-17</code></td><td>Type is <code>int</code> by default</td></tr>
<tr><td>Long</td><td><code>250L</code></td><td>Suffix <code>L</code> (use capital L — small l looks like 1)</td></tr>
<tr><td>Binary</td><td><code>0b1010</code></td><td>Prefix <code>0b</code> → 10</td></tr>
<tr><td>Octal</td><td><code>017</code></td><td>Leading <code>0</code> → 15 (a common trap!)</td></tr>
<tr><td>Hexadecimal</td><td><code>0x1F</code></td><td>Prefix <code>0x</code> → 31</td></tr>
<tr><td>Underscores</td><td><code>1_00_000</code></td><td>Only for readability (Java 7+); value is 100000</td></tr>
<tr><td>Floating</td><td><code>3.14</code>, <code>2.5f</code>, <code>1.2e3</code></td><td>double by default; <code>f</code> for float; <code>e3</code> means ×10³</td></tr>
<tr><td>Character</td><td><code>'A'</code>, <code>'\n'</code>, <code>'A'</code></td><td>Single quotes; <code>A</code> is the Unicode for A</td></tr>
<tr><td>String</td><td><code>"Java"</code></td><td>Double quotes</td></tr>
<tr><td>Boolean</td><td><code>true</code>, <code>false</code></td><td>Lowercase only</td></tr>
<tr><td>Null</td><td><code>null</code></td><td>"No object" — only for reference types</td></tr>
</table>

<h3>2. Wrapper classes</h3>
<p>Each primitive type has a matching <b>class</b> in <code>java.lang</code>, called its <b>wrapper class</b>. Wrapper objects are needed wherever Java expects objects (for example in collections like <code>ArrayList</code>), and the classes contain useful constants and methods.</p>
<table>
<tr><th>Primitive</th><th>Wrapper</th><th>Useful members</th></tr>
<tr><td>byte</td><td>Byte</td><td><code>Byte.MAX_VALUE</code> (127)</td></tr>
<tr><td>short</td><td>Short</td><td><code>Short.MIN_VALUE</code> (-32768)</td></tr>
<tr><td>int</td><td><b>Integer</b></td><td><code>Integer.MAX_VALUE</code>, <code>Integer.parseInt("42")</code>, <code>Integer.toBinaryString(10)</code></td></tr>
<tr><td>long</td><td>Long</td><td><code>Long.parseLong("99")</code></td></tr>
<tr><td>float</td><td>Float</td><td><code>Float.parseFloat("2.5")</code></td></tr>
<tr><td>double</td><td>Double</td><td><code>Double.parseDouble("3.75")</code></td></tr>
<tr><td>char</td><td><b>Character</b></td><td><code>Character.isDigit(c)</code>, <code>Character.toUpperCase(c)</code></td></tr>
<tr><td>boolean</td><td>Boolean</td><td><code>Boolean.parseBoolean("true")</code></td></tr>
</table>
<p><b>Autoboxing</b>: Java converts automatically between primitives and wrappers. <code>Integer n = 5;</code> (boxing) and <code>int m = n;</code> (unboxing). You'll use this a lot with collections.</p>
<div class="warn"><code>Integer.parseInt("12a")</code> throws a <code>NumberFormatException</code> at runtime — the text must be a valid number.</div>

<h3>3. Default values</h3>
<p>Variables declared <b>inside a class but outside any method</b> (fields) get a default value automatically. Local variables do not — you must assign them.</p>
<table>
<tr><th>Type</th><th>Default value</th></tr>
<tr><td>byte, short, int, long</td><td><code>0</code></td></tr>
<tr><td>float, double</td><td><code>0.0</code></td></tr>
<tr><td>char</td><td><code>'\u0000'</code> (the null character — prints as nothing visible)</td></tr>
<tr><td>boolean</td><td><code>false</code></td></tr>
<tr><td>Any reference (String, arrays, objects)</td><td><code>null</code></td></tr>
</table>
`,

  samples: [
    {
      title: "Number literals in different bases",
      code: J`public class Literals {
    public static void main(String[] args) {
        System.out.println(0b1010);
        System.out.println(017);
        System.out.println(0x1F);
        System.out.println(1_00_000);
        System.out.println(1.2e3);
        System.out.println('A');
    }
}`,
      output: "10\n15\n31\n100000\n1200.0\nA",
      explain: "Java always prints in decimal, whatever base you wrote the literal in. <code>017</code> is octal 15, not seventeen!",
    },
    {
      title: "Wrapper constants and parsing",
      code: J`public class Wrappers {
    public static void main(String[] args) {
        System.out.println(Integer.MAX_VALUE);
        System.out.println(Long.MIN_VALUE);
        System.out.println(Character.MAX_VALUE + 0);
        int marks = Integer.parseInt("88");
        double fee = Double.parseDouble("1500.50");
        System.out.println(marks + 2);
        System.out.println(fee * 2);
        System.out.println(Integer.toBinaryString(13));
    }
}`,
      output: "2147483647\n-9223372036854775808\n65535\n90\n3001.0\n1101",
    },
    {
      title: "Default values of fields",
      code: J`public class Defaults {
    static int count;
    static double rate;
    static boolean active;
    static String name;

    public static void main(String[] args) {
        System.out.println(count);
        System.out.println(rate);
        System.out.println(active);
        System.out.println(name);
    }
}`,
      output: "0\n0.0\nfalse\nnull",
    },
  ],

  practice: [
    {
      id: "c1t6p1", title: "Range table",
      task: "<p>Print the minimum and maximum of <code>byte</code>, <code>short</code> and <code>int</code> using the wrapper class constants (don't type the numbers).</p>",
      expected: "byte: -128 to 127\nshort: -32768 to 32767\nint: -2147483648 to 2147483647",
      mustUse: ["Byte.MIN_VALUE", "Short.MAX_VALUE", "Integer.MAX_VALUE"],
      hints: ["Use <code>Byte.MIN_VALUE</code>, <code>Byte.MAX_VALUE</code> and so on.", "<code>\"byte: \" + Byte.MIN_VALUE + \" to \" + Byte.MAX_VALUE</code>"],
      solution: J`public class Main {
    public static void main(String[] args) {
        System.out.println("byte: " + Byte.MIN_VALUE + " to " + Byte.MAX_VALUE);
        System.out.println("short: " + Short.MIN_VALUE + " to " + Short.MAX_VALUE);
        System.out.println("int: " + Integer.MIN_VALUE + " to " + Integer.MAX_VALUE);
    }
}`,
    },
    {
      id: "c1t6p2", title: "Text to numbers",
      task: "<p>You receive three values as text: <code>\"45\"</code>, <code>\"30\"</code> and <code>\"2.5\"</code>. Convert them to numbers and print their sum, then the first two multiplied by the third.</p>",
      expected: "Sum: 77.5\nProduct: 187.5",
      mustUse: ["Integer.parseInt", "Double.parseDouble"],
      hints: ["<code>int a = Integer.parseInt(\"45\");</code>", "(a + b) * c → (45 + 30) × 2.5 = 187.5"],
      solution: J`public class Main {
    public static void main(String[] args) {
        int a = Integer.parseInt("45");
        int b = Integer.parseInt("30");
        double c = Double.parseDouble("2.5");
        System.out.println("Sum: " + (a + b + c));
        System.out.println("Product: " + ((a + b) * c));
    }
}`,
    },
    {
      id: "c1t6p3", title: "One number, four bases",
      task: "<p>Store the number 200 in an <code>int</code>. Print it in decimal, binary, octal and hexadecimal using <code>Integer</code> methods.</p>",
      expected: "Decimal: 200\nBinary: 11001000\nOctal: 310\nHex: c8",
      mustUse: ["Integer.toBinaryString", "Integer.toOctalString", "Integer.toHexString"],
      hints: ["<code>Integer.toBinaryString(n)</code>, <code>Integer.toOctalString(n)</code>, <code>Integer.toHexString(n)</code>"],
      solution: J`public class Main {
    public static void main(String[] args) {
        int n = 200;
        System.out.println("Decimal: " + n);
        System.out.println("Binary: " + Integer.toBinaryString(n));
        System.out.println("Octal: " + Integer.toOctalString(n));
        System.out.println("Hex: " + Integer.toHexString(n));
    }
}`,
    },
    {
      id: "c1t6p4", title: "Write literals",
      task: "<p>Declare <code>int a</code> using a <b>binary</b> literal, <code>int b</code> using a <b>hex</b> literal and <code>long c</code> using <b>underscores</b>, so the program prints the expected output.</p>",
      expected: "a = 5\nb = 255\nc = 7000000000",
      mustUse: ["0b", "0x", "_"],
      hints: ["5 in binary is 101 → <code>0b101</code>; 255 in hex is FF → <code>0xFF</code>.", "<code>7_000_000_000L</code> — don't forget the L, it is bigger than int."],
      solution: J`public class Main {
    public static void main(String[] args) {
        int a = 0b101;
        int b = 0xFF;
        long c = 7_000_000_000L;
        System.out.println("a = " + a);
        System.out.println("b = " + b);
        System.out.println("c = " + c);
    }
}`,
    },
  ],

  fill: [
    { id: "c1t6f1", prompt: "Name the wrapper classes.", template: "int → ___\nchar → ___\nboolean → ___", answers: [["Integer"], ["Character"], ["Boolean"]], explain: "Only int and char have names different from the primitive." },
    { id: "c1t6f2", prompt: "Convert the text to an int.", template: "int roll = Integer.___(\"21\");", answers: [["parseInt"]], explain: "<code>Integer.parseInt(String)</code> returns an int." },
    { id: "c1t6f3", prompt: "Default values of fields.", template: "int → ___\nboolean → ___\nString → ___", answers: [["0"], ["false"], ["null"]], explain: "Numbers 0, boolean false, references null." },
  ],

  quiz: [
    { type: "output", q: "Predict the output.", code: J`public class Q {
    public static void main(String[] args) {
        System.out.println(010 + 0b10 + 0x10);
    }
}`, answer: "26", explain: "Octal 010 = 8, binary 0b10 = 2, hex 0x10 = 16. 8 + 2 + 16 = 26." },
    { type: "mcq", q: "What does <code>Integer.parseInt(\"7.5\")</code> do?", options: ["returns 7", "returns 8", "throws NumberFormatException", "compile error"], answer: 2, explain: "\"7.5\" is not a valid int, so it fails at runtime." },
    { type: "mcq", q: "Which is the wrapper class of <code>char</code>?", options: ["Char", "Character", "Chars", "String"], answer: 1, explain: "<code>Character</code>." },
    { type: "mcq", q: "Which literal is a <code>long</code>?", options: ["100", "100L", "100.0", "100f"], answer: 1, explain: "The L suffix." },
    { type: "output", q: "Predict the output.", code: J`public class Q {
    static double d;
    static char c;
    public static void main(String[] args) {
        System.out.println(d + 1);
        System.out.println(c + 0);
    }
}`, answer: "1.0\n0", explain: "Field defaults: double 0.0, char '\\u0000' whose code is 0." },
  ],
};
