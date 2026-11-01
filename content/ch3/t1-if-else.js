const J = String.raw;

export default {
  title: "if, else-if and nested if",
  summary: "Make your program take decisions: run some statements only when a condition is true.",

  concept: J`
<h2>Concept</h2>
<p>Normally statements run top to bottom. <b>Decision statements</b> let a program choose which statements to run based on a <b>condition</b> (a boolean expression).</p>

<h3>1. if</h3>
<pre class="java">if (marks >= 40) {
    System.out.println("Pass");
}</pre>
<h3>2. if-else</h3>
<pre class="java">if (n % 2 == 0) {
    System.out.println("Even");
} else {
    System.out.println("Odd");
}</pre>
<h3>3. else-if ladder — exactly one branch runs</h3>
<pre class="java">if (marks >= 75) {
    grade = 'A';
} else if (marks >= 60) {
    grade = 'B';
} else if (marks >= 40) {
    grade = 'C';
} else {
    grade = 'F';
}</pre>
<p>Conditions are checked from top to bottom. The <b>first</b> true condition wins and the rest are skipped. Order matters: if you test <code>marks >= 40</code> first, a student with 90 gets 'C'.</p>

<h3>4. Nested if — an if inside another</h3>
<pre class="java">if (age >= 18) {
    if (hasLicence) {
        System.out.println("Can drive");
    } else {
        System.out.println("Get a licence first");
    }
} else {
    System.out.println("Too young");
}</pre>

<h3>Rules and traps</h3>
<ul>
<li>The condition must be <code>boolean</code>. <code>if (x)</code> where x is an int does not compile (unlike C).</li>
<li>Without braces, only the <b>next single statement</b> belongs to the if:
<pre class="java">if (x > 10)
    System.out.println("big");
    System.out.println("always printed!");   // not part of the if</pre></li>
<li><b>Semicolon trap:</b> <code>if (x > 10); { ... }</code> — the <code>;</code> is an empty statement, so the block always runs.</li>
<li><b>Dangling else:</b> an <code>else</code> belongs to the <b>nearest</b> unmatched <code>if</code>, whatever the indentation says. Always use braces.</li>
<li><code>if (flag = true)</code> compiles for a boolean (it assigns!) and is always true. Write <code>if (flag)</code>.</li>
</ul>
`,

  samples: [
    {
      title: "Grade calculator",
      code: J`public class Grade {
    public static void main(String[] args) {
        int marks = 67;
        char grade;
        if (marks >= 75) {
            grade = 'A';
        } else if (marks >= 60) {
            grade = 'B';
        } else if (marks >= 40) {
            grade = 'C';
        } else {
            grade = 'F';
        }
        System.out.println("Marks " + marks + " -> grade " + grade);
    }
}`,
      output: "Marks 67 -> grade B",
    },
    {
      title: "Nested if",
      code: J`public class Login {
    public static void main(String[] args) {
        String user = "admin";
        int pin = 4321;
        if (user.equals("admin")) {
            if (pin == 1234) {
                System.out.println("Welcome, admin");
            } else {
                System.out.println("Wrong PIN");
            }
        } else {
            System.out.println("Unknown user");
        }
    }
}`,
      output: "Wrong PIN",
    },
    {
      title: "Braces and the dangling else",
      code: J`public class Dangling {
    public static void main(String[] args) {
        int x = 5;
        if (x > 10)
            System.out.println("A");
            System.out.println("B");
        if (x > 0)
            if (x > 8)
                System.out.println("C");
        else
            System.out.println("D");
    }
}`,
      output: "B\nD",
      explain: "\"B\" is not inside the first if. The else pairs with <code>if (x > 8)</code> — the nearest if — even though it is indented under the outer one.",
    },
  ],

  practice: [
    {
      id: "c3t1p1", title: "Positive, negative or zero",
      task: "<p>For <code>int n = -14;</code> print whether it is positive, negative or zero, and whether it is even or odd, using if-else.</p>",
      expected: "-14 is negative\n-14 is even",
      mustUse: ["else if"],
      hints: ["An else-if ladder for the sign; a separate if-else for even/odd.", "-14 % 2 is 0, so negative even numbers work with % 2 == 0."],
      solution: J`public class Main {
    public static void main(String[] args) {
        int n = -14;
        if (n > 0) {
            System.out.println(n + " is positive");
        } else if (n < 0) {
            System.out.println(n + " is negative");
        } else {
            System.out.println(n + " is zero");
        }
        if (n % 2 == 0) {
            System.out.println(n + " is even");
        } else {
            System.out.println(n + " is odd");
        }
    }
}`,
    },
    {
      id: "c3t1p2", title: "Triangle type",
      task: "<p>Sides are <code>a = 7, b = 7, c = 10</code>. First check it is a valid triangle (each pair of sides adds to more than the third). Then print equilateral, isosceles or scalene.</p>",
      expected: "Valid triangle\nIsosceles",
      mustUse: ["&&", "||"],
      hints: ["Valid: <code>a + b > c && b + c > a && a + c > b</code>.", "Equilateral: all equal. Isosceles: any two equal (<code>a == b || b == c || a == c</code>)."],
      solution: J`public class Main {
    public static void main(String[] args) {
        int a = 7, b = 7, c = 10;
        if (a + b > c && b + c > a && a + c > b) {
            System.out.println("Valid triangle");
            if (a == b && b == c) {
                System.out.println("Equilateral");
            } else if (a == b || b == c || a == c) {
                System.out.println("Isosceles");
            } else {
                System.out.println("Scalene");
            }
        } else {
            System.out.println("Not a triangle");
        }
    }
}`,
    },
    {
      id: "c3t1p3", title: "Income tax slab",
      task: "<p>Compute tax on <code>income = 1150000</code>: 0% up to 3,00,000; 5% on the part from 3,00,001 to 7,00,000; 10% on the part from 7,00,001 to 10,00,000; 15% on the part above 10,00,000.</p>",
      expected: "Tax: 72500",
      hints: ["Work from the highest slab: if income > 1000000, add (income − 1000000) × 15 / 100 and set income = 1000000 — then continue down.", "20,000 + 30,000 + 22,500 = 72,500."],
      solution: J`public class Main {
    public static void main(String[] args) {
        long income = 1150000;
        long tax = 0;
        if (income > 1000000) {
            tax += (income - 1000000) * 15 / 100;
            income = 1000000;
        }
        if (income > 700000) {
            tax += (income - 700000) * 10 / 100;
            income = 700000;
        }
        if (income > 300000) {
            tax += (income - 300000) * 5 / 100;
        }
        System.out.println("Tax: " + tax);
    }
}`,
    },
    {
      id: "c3t1p4", title: "Largest of three (if)",
      task: "<p>Find the largest of <code>x = 34, y = 91, z = 58</code> using a nested if or an else-if ladder.</p>",
      expected: "Largest is 91",
      mustUse: ["if"],
      hints: ["<code>if (x >= y && x >= z) ... else if (y >= z) ... else ...</code>"],
      solution: J`public class Main {
    public static void main(String[] args) {
        int x = 34, y = 91, z = 58;
        int max;
        if (x >= y && x >= z) {
            max = x;
        } else if (y >= z) {
            max = y;
        } else {
            max = z;
        }
        System.out.println("Largest is " + max);
    }
}`,
    },
    {
      id: "c3t1p5", title: "Vowel or consonant",
      task: "<p>For <code>char ch = 'E';</code> print whether it is a vowel, a consonant, or not a letter. Handle both upper and lower case.</p>",
      expected: "E is a vowel",
      mustUse: ["Character.toLowerCase"],
      hints: ["Convert first: <code>char c = Character.toLowerCase(ch);</code>", "Check letter: <code>c >= 'a' && c <= 'z'</code>."],
      solution: J`public class Main {
    public static void main(String[] args) {
        char ch = 'E';
        char c = Character.toLowerCase(ch);
        if (c >= 'a' && c <= 'z') {
            if (c == 'a' || c == 'e' || c == 'i' || c == 'o' || c == 'u') {
                System.out.println(ch + " is a vowel");
            } else {
                System.out.println(ch + " is a consonant");
            }
        } else {
            System.out.println(ch + " is not a letter");
        }
    }
}`,
    },
  ],

  fill: [
    { id: "c3t1f1", prompt: "Complete the if-else.", template: "___ (age >= 18) {\n    System.out.println(\"Adult\");\n} ___ {\n    System.out.println(\"Minor\");\n}", answers: [["if"], ["else"]], explain: "if (condition) { … } else { … }" },
    { id: "c3t1f2", prompt: "Add the middle branch of the ladder.", template: "if (t > 35) s = \"Hot\";\n___ ___ (t > 20) s = \"Warm\";\nelse s = \"Cold\";", answers: [["else"], ["if"]], explain: "else if adds another condition." },
  ],

  quiz: [
    { type: "output", q: "Predict the output.", code: J`public class Q {
    public static void main(String[] args) {
        int m = 85;
        if (m >= 40) System.out.println("C");
        else if (m >= 60) System.out.println("B");
        else if (m >= 75) System.out.println("A");
    }
}`, answer: "C", explain: "The first true condition wins — the ladder is in the wrong order." },
    { type: "output", q: "Predict the output.", code: J`public class Q {
    public static void main(String[] args) {
        int x = 3;
        if (x > 5); {
            System.out.println("inside");
        }
        System.out.println("end");
    }
}`, answer: "inside\nend", explain: "The semicolon ends the if; the block is a normal block that always runs." },
    { type: "mcq", q: "<code>int n = 1; if (n) { }</code> — what happens?", options: ["runs the block", "skips the block", "compile error", "runtime error"], answer: 2, explain: "Java needs a boolean condition." },
    { type: "output", q: "Predict the output.", code: J`public class Q {
    public static void main(String[] args) {
        boolean ready = false;
        if (ready = true) System.out.println("Go");
        else System.out.println("Wait");
    }
}`, answer: "Go", explain: "= assigns true, and the value of the assignment (true) is the condition." },
    { type: "mcq", q: "In an else-if ladder, how many branches can run?", options: ["all true ones", "at most one", "exactly two", "only the last"], answer: 1, explain: "The first true branch runs; the rest are skipped (none run if no condition is true and there is no else)." },
  ],
};
