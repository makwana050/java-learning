const J = String.raw;

export default {
  title: "One-dimensional arrays",
  summary: "Store many values of the same type under one name, access them by index, and process them with loops.",

  concept: J`
<h2>Concept</h2>
<p>An <b>array</b> is a fixed-size container that holds many values of the <b>same type</b>. Each value (element) has a numbered position called an <b>index</b>, starting at <b>0</b>.</p>
<pre>index:   0    1    2    3    4
marks: [ 72 | 85 | 91 | 64 | 78 ]      marks.length = 5</pre>

<h3>Creating arrays</h3>
<pre class="java">int[] marks = new int[5];               // 5 elements, all 0
int[] marks = {72, 85, 91, 64, 78};     // declare + create + fill
String[] names = new String[3];         // all null
double[] prices = new double[] {9.5, 12.0};
int marks2[] = new int[5];              // also legal (C style), but int[] is preferred</pre>
<ul>
<li>Arrays are <b>objects</b>: the variable holds a reference; the elements live on the heap.</li>
<li>Size is fixed when created and can't change. It can be a variable: <code>new int[n]</code>.</li>
<li>Elements get <b>default values</b>: 0, 0.0, false, '\u0000' or null.</li>
<li><code>arr.length</code> is a <b>field</b> (no brackets), unlike <code>String.length()</code>.</li>
</ul>

<h3>Accessing elements</h3>
<pre class="java">marks[0] = 75;                    // change first element
int last = marks[marks.length - 1];</pre>
<p>Using an index outside 0 … length−1 compiles, but at runtime throws <code>ArrayIndexOutOfBoundsException</code>.</p>

<h3>Looping over an array</h3>
<pre class="java">for (int i = 0; i &lt; marks.length; i++) {      // when you need the index
    System.out.println(i + ": " + marks[i]);
}
for (int m : marks) {                         // when you only need values
    total += m;
}</pre>
<div class="warn">The for-each variable is a <b>copy</b>. <code>for (int m : marks) m = 0;</code> does <b>not</b> change the array. Use an index loop to modify elements.</div>

<h3>Arrays are references</h3>
<pre class="java">int[] a = {1, 2, 3};
int[] b = a;        // b points to the SAME array
b[0] = 99;
System.out.println(a[0]);   // 99</pre>
<p>To make an independent copy use <code>a.clone()</code> or <code>Arrays.copyOf(a, a.length)</code>. Comparing with <code>a == b</code> checks whether they are the same object, not whether the contents are equal — use <code>Arrays.equals(a, b)</code>.</p>

<h3>Printing an array</h3>
<p><code>System.out.println(arr)</code> prints something like <code>[I@1b6d3586</code> (type code + hash) — not the contents. Use <code>Arrays.toString(arr)</code> → <code>[72, 85, 91]</code> (import <code>java.util.Arrays</code>). Exception: a <code>char[]</code> passed alone to println prints its characters.</p>
`,

  samples: [
    {
      title: "Create, change, loop",
      code: J`public class ArrayBasics {
    public static void main(String[] args) {
        int[] marks = {72, 85, 91, 64, 78};
        marks[3] = 69;
        int total = 0;
        for (int i = 0; i < marks.length; i++) {
            System.out.println("Student " + (i + 1) + ": " + marks[i]);
            total += marks[i];
        }
        System.out.println("Total: " + total + ", length: " + marks.length);
    }
}`,
      output: "Student 1: 72\nStudent 2: 85\nStudent 3: 91\nStudent 4: 69\nStudent 5: 78\nTotal: 395, length: 5",
    },
    {
      title: "Default values and Arrays.toString",
      code: J`import java.util.Arrays;

public class Defaults {
    public static void main(String[] args) {
        int[] a = new int[3];
        boolean[] b = new boolean[2];
        String[] s = new String[2];
        char[] word = {'J', 'a', 'v', 'a'};
        System.out.println(Arrays.toString(a));
        System.out.println(Arrays.toString(b));
        System.out.println(Arrays.toString(s));
        System.out.println(word);
    }
}`,
      output: "[0, 0, 0]\n[false, false]\n[null, null]\nJava",
    },
    {
      title: "Two names for one array",
      code: J`import java.util.Arrays;

public class Reference {
    public static void main(String[] args) {
        int[] a = {1, 2, 3};
        int[] b = a;
        int[] c = a.clone();
        b[0] = 99;
        System.out.println(Arrays.toString(a));
        System.out.println(Arrays.toString(c));
        System.out.println((a == b) + " " + (a == c) + " " + Arrays.equals(new int[] {99, 2, 3}, a));
    }
}`,
      output: "[99, 2, 3]\n[1, 2, 3]\ntrue false true",
    },
  ],

  practice: [
    {
      id: "c4t1p1", title: "Max, min and average",
      task: "<p>For <code>int[] temps = {31, 28, 35, 40, 26, 33, 29};</code> print the maximum, minimum and average (as a double).</p>",
      expected: "Max: 40\nMin: 26\nAverage: 31.714285714285715",
      mustUse: ["temps.length"],
      hints: ["Start max and min at temps[0] and compare with every other element.", "Average: <code>(double) sum / temps.length</code>"],
      solution: J`public class Main {
    public static void main(String[] args) {
        int[] temps = {31, 28, 35, 40, 26, 33, 29};
        int max = temps[0], min = temps[0], sum = 0;
        for (int i = 0; i < temps.length; i++) {
            if (temps[i] > max) max = temps[i];
            if (temps[i] < min) min = temps[i];
            sum += temps[i];
        }
        System.out.println("Max: " + max);
        System.out.println("Min: " + min);
        System.out.println("Average: " + (double) sum / temps.length);
    }
}`,
    },
    {
      id: "c4t1p2", title: "Reverse in place",
      task: "<p>Reverse <code>int[] a = {10, 20, 30, 40, 50, 60};</code> <b>in place</b> (swap elements, no second array) and print it with <code>Arrays.toString</code>.</p>",
      expected: "[60, 50, 40, 30, 20, 10]",
      mustUse: ["Arrays.toString"],
      hints: ["Swap a[i] with a[length − 1 − i] for i from 0 to length/2 − 1."],
      solution: J`import java.util.Arrays;

public class Main {
    public static void main(String[] args) {
        int[] a = {10, 20, 30, 40, 50, 60};
        for (int i = 0; i < a.length / 2; i++) {
            int temp = a[i];
            a[i] = a[a.length - 1 - i];
            a[a.length - 1 - i] = temp;
        }
        System.out.println(Arrays.toString(a));
    }
}`,
    },
    {
      id: "c4t1p3", title: "Linear search",
      task: "<p>Search <code>int[] ids = {104, 287, 356, 412, 598};</code> for 412 and for 300. Print the index or <code>not found</code>.</p>",
      expected: "412 found at index 3\n300 not found",
      hints: ["Loop through; when ids[i] == key, remember i and break. Start with index = -1."],
      solution: J`public class Main {
    public static void main(String[] args) {
        int[] ids = {104, 287, 356, 412, 598};
        int[] keys = {412, 300};
        for (int key : keys) {
            int index = -1;
            for (int i = 0; i < ids.length; i++) {
                if (ids[i] == key) {
                    index = i;
                    break;
                }
            }
            if (index >= 0) System.out.println(key + " found at index " + index);
            else System.out.println(key + " not found");
        }
    }
}`,
    },
    {
      id: "c4t1p4", title: "Count even, odd, and above average",
      task: "<p>For <code>int[] n = {12, 7, 19, 4, 25, 8, 16};</code> count the even and odd numbers, then count how many are above the average.</p>",
      expected: "Even: 4, Odd: 3\nAverage: 13.0\nAbove average: 3",
      hints: ["First loop: sum, even/odd counts. Average = (double) sum / length.", "Second loop: count values greater than the average."],
      solution: J`public class Main {
    public static void main(String[] args) {
        int[] n = {12, 7, 19, 4, 25, 8, 16};
        int even = 0, odd = 0, sum = 0;
        for (int x : n) {
            if (x % 2 == 0) even++; else odd++;
            sum += x;
        }
        double avg = (double) sum / n.length;
        int above = 0;
        for (int x : n) if (x > avg) above++;
        System.out.println("Even: " + even + ", Odd: " + odd);
        System.out.println("Average: " + avg);
        System.out.println("Above average: " + above);
    }
}`,
    },
    {
      id: "c4t1p5", title: "Second largest",
      task: "<p>Find the second largest <b>distinct</b> value in <code>int[] s = {45, 89, 72, 89, 60, 81};</code> in a single loop.</p>",
      expected: "Largest: 89\nSecond largest: 81",
      hints: ["Keep <code>first</code> and <code>second</code>, both starting at Integer.MIN_VALUE.", "If x > first: second = first; first = x. Else if x > second && x != first: second = x."],
      solution: J`public class Main {
    public static void main(String[] args) {
        int[] s = {45, 89, 72, 89, 60, 81};
        int first = Integer.MIN_VALUE, second = Integer.MIN_VALUE;
        for (int x : s) {
            if (x > first) {
                second = first;
                first = x;
            } else if (x > second && x != first) {
                second = x;
            }
        }
        System.out.println("Largest: " + first);
        System.out.println("Second largest: " + second);
    }
}`,
    },
    {
      id: "c4t1p6", title: "Frequency of digits",
      task: "<p>Count how many times each digit 0–9 appears in <code>long num = 3141592653589L;</code>. Use an <code>int[10]</code> counting array and print only digits that appear.</p>",
      expected: "1 -> 2\n2 -> 1\n3 -> 2\n4 -> 1\n5 -> 3\n6 -> 1\n8 -> 1\n9 -> 2",
      mustUse: ["new int[10]"],
      hints: ["<code>count[(int) (num % 10)]++;</code> then <code>num /= 10;</code>", "Then loop d from 0 to 9 and print if count[d] > 0."],
      solution: J`public class Main {
    public static void main(String[] args) {
        long num = 3141592653589L;
        int[] count = new int[10];
        while (num > 0) {
            count[(int) (num % 10)]++;
            num /= 10;
        }
        for (int d = 0; d < 10; d++) {
            if (count[d] > 0) System.out.println(d + " -> " + count[d]);
        }
    }
}`,
    },
  ],

  fill: [
    { id: "c4t1f1", prompt: "Create an array of 10 doubles.", template: "___[] rates = ___ double[10];", answers: [["double"], ["new"]], explain: "type[] name = new type[size];" },
    { id: "c4t1f2", prompt: "Access the last element.", template: "int last = arr[arr.___ - 1];", answers: [["length"]], explain: "length is a field of arrays." },
    { id: "c4t1f3", prompt: "Print the contents of the array.", template: "System.out.println(Arrays.___(arr));", answers: [["toString"]], explain: "Arrays.toString formats as [a, b, c]." },
  ],

  quiz: [
    { type: "mcq", q: "What is the index of the last element of <code>new int[8]</code>?", options: ["8", "7", "9", "0"], answer: 1, explain: "Indexes go from 0 to length − 1." },
    { type: "output", q: "Predict the output.", code: J`public class Q {
    public static void main(String[] args) {
        int[] a = {5, 10, 15};
        for (int x : a) x = x * 2;
        System.out.println(a[0] + a[1] + a[2]);
    }
}`, answer: "30", explain: "The for-each variable is a copy; the array is unchanged." },
    { type: "output", q: "Predict the output.", code: J`public class Q {
    public static void main(String[] args) {
        int[] p = {1, 2, 3};
        int[] q = p;
        q[2] = 7;
        p = new int[] {4, 5, 6};
        System.out.println(q[2] + " " + p[2]);
    }
}`, answer: "7 6", explain: "q still refers to the first array after p is pointed to a new one." },
    { type: "mcq", q: "<code>int[] a = new int[3]; a[3] = 1;</code>", options: ["compile error", "ArrayIndexOutOfBoundsException", "a grows to 4", "nothing happens"], answer: 1, explain: "Index 3 doesn't exist; the error happens at runtime." },
    { type: "mcq", q: "Which declaration is INVALID?", options: ["int[] a = new int[0];", "int a[] = {1, 2};", "int[] a = new int[];", "int[] a = {};"], answer: 2, explain: "new int[] needs either a size or an initializer list." },
  ],
};
