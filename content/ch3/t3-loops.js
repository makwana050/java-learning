const J = String.raw;

export default {
  title: "Loops: for, while, do-while",
  summary: "Repeat work without repeating code. Learn the three loops, when to use each, and how to trace them.",

  concept: J`
<h2>Concept</h2>
<p>A <b>loop</b> repeats a block of statements while a condition is true. Each repetition is called an <b>iteration</b>.</p>

<h3>1. for loop — when you know how many times</h3>
<pre class="java">for (int i = 1; i &lt;= 5; i++) {
    System.out.println(i);
}</pre>
<table>
<tr><th>Part</th><th>Runs</th></tr>
<tr><td><code>int i = 1</code> (initialization)</td><td>once, at the start</td></tr>
<tr><td><code>i &lt;= 5</code> (condition)</td><td>before every iteration — loop stops when false</td></tr>
<tr><td><code>i++</code> (update)</td><td>after every iteration</td></tr>
</table>
<p>Order: init → check → body → update → check → body → update → … → check fails → exit.</p>
<ul>
<li>A variable declared in the for header exists only inside the loop.</li>
<li>All three parts are optional: <code>for (;;)</code> is an infinite loop.</li>
<li>Several variables: <code>for (int i = 0, j = 10; i &lt; j; i++, j--)</code></li>
</ul>

<h3>2. while loop — when you don't know how many times</h3>
<pre class="java">int n = 1234, digits = 0;
while (n != 0) {
    n = n / 10;
    digits++;
}</pre>
<p>The condition is checked <b>before</b> each iteration. If it is false at the start, the body runs <b>zero</b> times.</p>

<h3>3. do-while — runs at least once</h3>
<pre class="java">int choice;
do {
    choice = readChoice();   // show menu, read option
} while (choice != 0);</pre>
<p>The condition is checked <b>after</b> the body, so the body always runs at least once. Note the semicolon after <code>while (…);</code>.</p>

<h3>4. Enhanced for (for-each) — for arrays and collections</h3>
<pre class="java">int[] marks = {70, 85, 92};
for (int m : marks) {
    System.out.println(m);
}</pre>
<p>Read it as "for each m in marks". You'll use it in the Arrays chapter.</p>

<h3>Which loop?</h3>
<table>
<tr><th>Situation</th><th>Loop</th></tr>
<tr><td>Fixed count (1 to n, every array index)</td><td>for</td></tr>
<tr><td>Repeat until something happens (digits run out, user enters 0)</td><td>while</td></tr>
<tr><td>Must run once before checking (menus, input validation)</td><td>do-while</td></tr>
<tr><td>Visit every element, no index needed</td><td>for-each</td></tr>
</table>

<h3>Common mistakes</h3>
<ul>
<li><b>Infinite loop:</b> forgetting to update the variable: <code>while (i &lt; 5) { System.out.println(i); }</code></li>
<li><b>Off-by-one:</b> <code>i &lt; n</code> vs <code>i &lt;= n</code> — decide carefully whether the last value is included.</li>
<li><b>Semicolon after for:</b> <code>for (int i = 0; i &lt; 5; i++);</code> → the loop body is empty.</li>
<li><b>Unreachable code:</b> <code>while (false) { … }</code> is a compile error.</li>
</ul>
`,

  samples: [
    {
      title: "Three loops, same output",
      code: J`public class Loops {
    public static void main(String[] args) {
        for (int i = 1; i <= 3; i++) {
            System.out.print(i + " ");
        }
        System.out.println();
        int j = 1;
        while (j <= 3) {
            System.out.print(j + " ");
            j++;
        }
        System.out.println();
        int k = 1;
        do {
            System.out.print(k + " ");
            k++;
        } while (k <= 3);
        System.out.println();
    }
}`,
      output: "1 2 3\n1 2 3\n1 2 3",
    },
    {
      title: "while vs do-while when the condition is false",
      code: J`public class ZeroOrOnce {
    public static void main(String[] args) {
        int x = 10;
        while (x < 5) {
            System.out.println("while body");
        }
        do {
            System.out.println("do-while body");
        } while (x < 5);
    }
}`,
      output: "do-while body",
    },
    {
      title: "Reverse a number",
      code: J`public class Reverse {
    public static void main(String[] args) {
        int n = 70394;
        int rev = 0;
        while (n > 0) {
            int digit = n % 10;
            rev = rev * 10 + digit;
            n = n / 10;
        }
        System.out.println(rev);
    }
}`,
      output: "49307",
      explain: "Each iteration takes the last digit off n and adds it to the end of rev.",
    },
  ],

  practice: [
    {
      id: "c3t3p1", title: "Multiplication table",
      task: "<p>Print the multiplication table of 7 from 1 to 10 using a for loop.</p>",
      expected: "7 x 1 = 7\n7 x 2 = 14\n7 x 3 = 21\n7 x 4 = 28\n7 x 5 = 35\n7 x 6 = 42\n7 x 7 = 49\n7 x 8 = 56\n7 x 9 = 63\n7 x 10 = 70",
      mustUse: ["for"],
      hints: ["<code>for (int i = 1; i <= 10; i++)</code>", "<code>System.out.println(n + \" x \" + i + \" = \" + n * i);</code>"],
      solution: J`public class Main {
    public static void main(String[] args) {
        int n = 7;
        for (int i = 1; i <= 10; i++) {
            System.out.println(n + " x " + i + " = " + n * i);
        }
    }
}`,
    },
    {
      id: "c3t3p2", title: "Sum of even and odd",
      task: "<p>Using one loop from 1 to 50, find the sum of even numbers and the sum of odd numbers separately.</p>",
      expected: "Even sum: 650\nOdd sum: 625",
      hints: ["Inside the loop: <code>if (i % 2 == 0) evenSum += i; else oddSum += i;</code>"],
      solution: J`public class Main {
    public static void main(String[] args) {
        int evenSum = 0, oddSum = 0;
        for (int i = 1; i <= 50; i++) {
            if (i % 2 == 0) {
                evenSum += i;
            } else {
                oddSum += i;
            }
        }
        System.out.println("Even sum: " + evenSum);
        System.out.println("Odd sum: " + oddSum);
    }
}`,
    },
    {
      id: "c3t3p3", title: "Factorial",
      task: "<p>Calculate 15! (15 factorial). It does not fit in an int, so use long.</p>",
      expected: "15! = 1307674368000",
      mustUse: ["long"],
      hints: ["Start with <code>long fact = 1;</code> and multiply by 1, 2, …, 15."],
      solution: J`public class Main {
    public static void main(String[] args) {
        int n = 15;
        long fact = 1;
        for (int i = 2; i <= n; i++) {
            fact *= i;
        }
        System.out.println(n + "! = " + fact);
    }
}`,
    },
    {
      id: "c3t3p4", title: "Digit statistics",
      task: "<p>For <code>long n = 8204731;</code> use a while loop to count the digits, sum the even digits and multiply the odd digits.</p>",
      expected: "Digits: 7\nEven sum: 14\nOdd product: 21",
      mustUse: ["while"],
      hints: ["Repeat while n > 0: digit = n % 10; then n /= 10.", "Start the product at 1."],
      solution: J`public class Main {
    public static void main(String[] args) {
        long n = 8204731;
        int count = 0, evenSum = 0, oddProduct = 1;
        while (n > 0) {
            int d = (int) (n % 10);
            count++;
            if (d % 2 == 0) {
                evenSum += d;
            } else {
                oddProduct *= d;
            }
            n /= 10;
        }
        System.out.println("Digits: " + count);
        System.out.println("Even sum: " + evenSum);
        System.out.println("Odd product: " + oddProduct);
    }
}`,
    },
    {
      id: "c3t3p5", title: "Fibonacci series",
      task: "<p>Print the first 12 Fibonacci numbers on one line, separated by spaces.</p>",
      expected: "0 1 1 2 3 5 8 13 21 34 55 89",
      hints: ["Keep two variables a = 0, b = 1. Each step: print a, then next = a + b; a = b; b = next."],
      solution: J`public class Main {
    public static void main(String[] args) {
        int a = 0, b = 1;
        for (int i = 1; i <= 12; i++) {
            System.out.print(a);
            if (i < 12) {
                System.out.print(" ");
            }
            int next = a + b;
            a = b;
            b = next;
        }
        System.out.println();
    }
}`,
    },
    {
      id: "c3t3p6", title: "Prime check",
      task: "<p>Check whether 97 and 91 are prime. A prime has no divisor from 2 to √n.</p>",
      expected: "97 is prime\n91 is not prime",
      hints: ["Loop <code>for (int i = 2; i * i <= n; i++)</code> and set a flag to false if <code>n % i == 0</code>.", "Repeat for both numbers (an outer loop over {97, 91} or just copy the code)."],
      solution: J`public class Main {
    public static void main(String[] args) {
        int[] nums = {97, 91};
        for (int n : nums) {
            boolean prime = n > 1;
            for (int i = 2; i * i <= n; i++) {
                if (n % i == 0) {
                    prime = false;
                    break;
                }
            }
            System.out.println(n + (prime ? " is prime" : " is not prime"));
        }
    }
}`,
    },
    {
      id: "c3t3p7", title: "Armstrong numbers",
      task: "<p>Print all 3-digit Armstrong numbers (the sum of the cubes of the digits equals the number, e.g. 153 = 1³ + 5³ + 3³).</p>",
      expected: "153 370 371 407",
      hints: ["Loop n from 100 to 999; for each, extract digits with % 10 and / 10 and add their cubes.", "Collect the output with a space before every number except the first."],
      solution: J`public class Main {
    public static void main(String[] args) {
        String result = "";
        for (int n = 100; n <= 999; n++) {
            int temp = n, sum = 0;
            while (temp > 0) {
                int d = temp % 10;
                sum += d * d * d;
                temp /= 10;
            }
            if (sum == n) {
                result += (result.isEmpty() ? "" : " ") + n;
            }
        }
        System.out.println(result);
    }
}`,
    },
  ],

  fill: [
    { id: "c3t3f1", prompt: "Complete the for loop that prints 10, 8, 6, 4, 2.", template: "for (int i = ___; i ___ 2; i ___ 2)", answers: [["10"], [">="], ["-="]], explain: "Start at 10, continue while i >= 2, subtract 2 each time." },
    { id: "c3t3f2", prompt: "Complete the do-while.", template: "___ {\n    n--;\n} ___ (n > 0)___", answers: [["do"], ["while"], [";"]], explain: "do { … } while (condition); — note the semicolon." },
    { id: "c3t3f3", prompt: "Complete the for-each loop over an int array.", template: "for (int v ___ values)", answers: [[":"]], explain: "for (type var : array)." },
  ],

  quiz: [
    { type: "output", q: "Predict the output.", code: J`public class Q {
    public static void main(String[] args) {
        int i;
        for (i = 0; i < 5; i += 2) { }
        System.out.println(i);
    }
}`, answer: "6", explain: "i takes 0, 2, 4, then 6 fails the condition." },
    { type: "output", q: "Predict the output.", code: J`public class Q {
    public static void main(String[] args) {
        int count = 0;
        for (int i = 1; i <= 20; i++) {
            if (i % 3 == 0) count++;
        }
        System.out.println(count);
    }
}`, answer: "6", explain: "3, 6, 9, 12, 15, 18." },
    { type: "output", q: "Predict the output.", code: J`public class Q {
    public static void main(String[] args) {
        int n = 5;
        while (n-- > 2) System.out.print(n + " ");
    }
}`, answer: "4 3 2", explain: "n-- compares the old value, then prints the decremented one." },
    { type: "mcq", q: "Which loop always runs its body at least once?", options: ["for", "while", "do-while", "for-each"], answer: 2, explain: "Its condition is checked after the body." },
    { type: "output", q: "Predict the output.", code: J`public class Q {
    public static void main(String[] args) {
        int s = 0;
        for (int i = 0; i < 5; i++);
        {
            s++;
        }
        System.out.println(s);
    }
}`, answer: "1", explain: "The semicolon makes the loop body empty; the block runs once afterwards." },
    { type: "mcq", q: "<code>while (false) { x++; }</code> — what happens?", options: ["runs 0 times", "runs once", "compile error: unreachable statement", "infinite loop"], answer: 2, explain: "The compiler rejects code it can prove is unreachable." },
  ],
};
