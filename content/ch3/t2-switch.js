const J = String.raw;

export default {
  title: "switch statement",
  summary: "Choose one of many branches based on the value of a single expression — and understand fall-through.",

  concept: J`
<h2>Concept</h2>
<p>When you compare one variable against many fixed values, a <code>switch</code> is cleaner than a long if-else ladder.</p>
<pre class="java">switch (day) {
    case 1:
        System.out.println("Monday");
        break;
    case 2:
        System.out.println("Tuesday");
        break;
    default:
        System.out.println("Other day");
}</pre>

<h3>How it works</h3>
<ol>
<li>The expression in <code>switch ( )</code> is evaluated once.</li>
<li>Java jumps to the <code>case</code> with a matching value.</li>
<li>Statements run until a <code>break</code> (or the end of the switch).</li>
<li>If no case matches, <code>default</code> runs (if present). default can be anywhere, but is usually last.</li>
</ol>

<h3>Fall-through</h3>
<p>Without <code>break</code>, execution <b>falls through</b> into the next case's statements, without checking its label. This is a common bug — and occasionally useful to group cases:</p>
<pre class="java">switch (month) {
    case 12: case 1: case 2:
        season = "Winter"; break;
    case 3: case 4: case 5:
        season = "Summer"; break;
    default:
        season = "Other";
}</pre>

<h3>Rules</h3>
<ul>
<li>Allowed types: <code>byte, short, char, int</code>, their wrappers, <code>String</code> (Java 7+) and <code>enum</code>. <b>Not allowed:</b> <code>long, float, double, boolean</code>.</li>
<li>Case labels must be <b>compile-time constants</b> (literals or <code>final</code> variables with constant values) and must be unique.</li>
<li>A String switch is case-sensitive and uses <code>equals()</code> internally. If the String is <code>null</code> → <code>NullPointerException</code>.</li>
</ul>

<h3>Modern switch (Java 14+)</h3>
<p>Newer Java adds arrow cases (no fall-through, no break needed) and switch <b>expressions</b> that return a value:</p>
<pre class="java">String type = switch (day) {
    case 6, 7 -> "Weekend";
    default   -> "Weekday";
};</pre>
<div class="warn">The arrow form needs Java 14 or later — use it on JDK 25 in the lab. The Run button on this site uses the classic form.</div>
`,

  samples: [
    {
      title: "Calculator with char switch",
      code: J`public class Calc {
    public static void main(String[] args) {
        int a = 24, b = 5;
        char op = '%';
        switch (op) {
            case '+': System.out.println(a + b); break;
            case '-': System.out.println(a - b); break;
            case '*': System.out.println(a * b); break;
            case '/': System.out.println(a / b); break;
            case '%': System.out.println(a % b); break;
            default:  System.out.println("Unknown operator");
        }
    }
}`,
      output: "4",
    },
    {
      title: "Fall-through",
      code: J`public class Fall {
    public static void main(String[] args) {
        int level = 2;
        switch (level) {
            case 1:
                System.out.println("Basic badge");
            case 2:
                System.out.println("Silver badge");
            case 3:
                System.out.println("Gold badge");
                break;
            case 4:
                System.out.println("Platinum badge");
        }
    }
}`,
      output: "Silver badge\nGold badge",
      explain: "Execution starts at case 2 and continues into case 3 until the break.",
    },
    {
      title: "Switch on a String",
      code: J`public class Plan {
    public static void main(String[] args) {
        String plan = "pro";
        int price;
        switch (plan) {
            case "free": price = 0; break;
            case "pro": price = 499; break;
            case "team": price = 1999; break;
            default: price = -1;
        }
        System.out.println(plan + " costs " + price);
    }
}`,
      output: "pro costs 499",
    },
  ],

  practice: [
    {
      id: "c3t2p1", title: "Day name",
      task: "<p>For <code>int day = 5;</code> print the day name (1 = Monday … 7 = Sunday). For any other number print <code>Invalid day</code>.</p>",
      expected: "Friday",
      mustUse: ["switch", "break", "default"],
      hints: ["One case per day, each ending with break."],
      solution: J`public class Main {
    public static void main(String[] args) {
        int day = 5;
        switch (day) {
            case 1: System.out.println("Monday"); break;
            case 2: System.out.println("Tuesday"); break;
            case 3: System.out.println("Wednesday"); break;
            case 4: System.out.println("Thursday"); break;
            case 5: System.out.println("Friday"); break;
            case 6: System.out.println("Saturday"); break;
            case 7: System.out.println("Sunday"); break;
            default: System.out.println("Invalid day");
        }
    }
}`,
    },
    {
      id: "c3t2p2", title: "Days in a month",
      task: "<p>For <code>month = 9</code> and <code>year = 2028</code> print the number of days. Group months using fall-through. February has 29 days in a leap year.</p>",
      expected: "Month 9 has 30 days",
      mustUse: ["switch"],
      hints: ["<code>case 4: case 6: case 9: case 11: days = 30; break;</code>", "For case 2 use a leap-year check inside."],
      solution: J`public class Main {
    public static void main(String[] args) {
        int month = 9, year = 2028;
        int days;
        switch (month) {
            case 4: case 6: case 9: case 11:
                days = 30;
                break;
            case 2:
                boolean leap = (year % 4 == 0 && year % 100 != 0) || year % 400 == 0;
                days = leap ? 29 : 28;
                break;
            default:
                days = 31;
        }
        System.out.println("Month " + month + " has " + days + " days");
    }
}`,
    },
    {
      id: "c3t2p3", title: "Vowel counter case",
      task: "<p>Classify <code>char c = 'U';</code> using a switch: vowels (upper or lower case) print <code>Vowel</code>; digits '0'–'9' are not needed. Anything else prints <code>Consonant or symbol</code>.</p>",
      expected: "U: Vowel",
      mustUse: ["switch", "case 'u'"],
      hints: ["Group with fall-through: <code>case 'a': case 'A': case 'e': ...</code>", "Or switch on <code>Character.toLowerCase(c)</code>."],
      solution: J`public class Main {
    public static void main(String[] args) {
        char c = 'U';
        switch (Character.toLowerCase(c)) {
            case 'a': case 'e': case 'i': case 'o': case 'u':
                System.out.println(c + ": Vowel");
                break;
            default:
                System.out.println(c + ": Consonant or symbol");
        }
    }
}`,
    },
    {
      id: "c3t2p4", title: "Menu-driven area",
      task: "<p>A menu: 1 = circle area (r = 7), 2 = rectangle area (5 × 8), 3 = triangle area (base 10, height 6). For <code>choice = 1</code>, print the circle area using <code>Math.PI</code> rounded to 2 decimals with printf.</p>",
      expected: "Circle area: 153.94",
      mustUse: ["switch", "printf"],
      hints: ["<code>System.out.printf(\"Circle area: %.2f%n\", Math.PI * 7 * 7);</code>"],
      solution: J`public class Main {
    public static void main(String[] args) {
        int choice = 1;
        switch (choice) {
            case 1:
                System.out.printf("Circle area: %.2f%n", Math.PI * 7 * 7);
                break;
            case 2:
                System.out.println("Rectangle area: " + (5 * 8));
                break;
            case 3:
                System.out.println("Triangle area: " + (0.5 * 10 * 6));
                break;
            default:
                System.out.println("Invalid choice");
        }
    }
}`,
    },
  ],

  fill: [
    { id: "c3t2f1", prompt: "Complete the switch.", template: "___ (code) {\n    ___ 1: System.out.println(\"One\"); ___;\n    ___: System.out.println(\"Other\");\n}", answers: [["switch"], ["case"], ["break"], ["default"]], explain: "switch, case, break and default." },
  ],

  quiz: [
    { type: "output", q: "Predict the output.", code: J`public class Q {
    public static void main(String[] args) {
        int x = 3;
        switch (x) {
            case 1: System.out.print("one ");
            case 3: System.out.print("three ");
            case 5: System.out.print("five ");
            default: System.out.print("other");
        }
    }
}`, answer: "three five other", explain: "No breaks: everything from case 3 down runs." },
    { type: "output", q: "Predict the output.", code: J`public class Q {
    public static void main(String[] args) {
        int x = 9;
        switch (x) {
            default: System.out.print("D ");
            case 1: System.out.print("1 "); break;
            case 2: System.out.print("2 ");
        }
    }
}`, answer: "D 1", explain: "No case matches, so execution starts at default, falls into case 1, then breaks." },
    { type: "mcq", q: "Which type can NOT be used in a switch?", options: ["char", "String", "long", "Integer"], answer: 2, explain: "long, float, double and boolean are not allowed." },
    { type: "mcq", q: "<code>int k = 2; switch (x) { case k: … }</code> — k is not final. What happens?", options: ["works", "compile error: constant expression required", "runtime error", "matches every value"], answer: 1, explain: "Case labels must be compile-time constants." },
    { type: "mcq", q: "What happens if a String used in switch is null?", options: ["default runs", "nothing runs", "NullPointerException", "compile error"], answer: 2, explain: "The switch calls hashCode() on it." },
  ],
};
