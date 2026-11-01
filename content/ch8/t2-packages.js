const J = String.raw;

export default {
  title: "Packages & import",
  summary: "Organise classes into folders called packages, avoid name clashes, and use classes from other packages with import.",

  concept: J`
<h2>Concept</h2>
<p>A <b>package</b> is a named group of related classes and interfaces — like a folder. It:</p>
<ul>
<li>organises large programs (model, service, util…);</li>
<li>prevents <b>name clashes</b> — <code>java.util.Date</code> and <code>java.sql.Date</code> can both exist;</li>
<li>controls access — default (package-private) members are visible only inside the same package.</li>
</ul>

<h3>Built-in packages</h3>
<table>
<tr><th>Package</th><th>Contains</th></tr>
<tr><td><code>java.lang</code></td><td>String, Math, System, Integer, Object, Thread — <b>imported automatically</b></td></tr>
<tr><td><code>java.util</code></td><td>Scanner, ArrayList, HashMap, Arrays, Random</td></tr>
<tr><td><code>java.io</code></td><td>File, readers, writers, IOException</td></tr>
<tr><td><code>java.time</code></td><td>LocalDate, LocalTime, Duration</td></tr>
<tr><td><code>java.util.concurrent</code></td><td>ExecutorService, locks, thread-safe collections</td></tr>
</table>

<h3>Creating your own package</h3>
<p>The <code>package</code> statement must be the <b>first statement</b> in the file (only comments may come before it), and the folder structure must match the package name:</p>
<pre class="java">// file: src/com/college/exam/Result.java
package com.college.exam;

public class Result {
    public static String grade(int m) { return m &gt;= 40 ? "Pass" : "Fail"; }
}</pre>
<p>Package names are all lowercase and usually start with a reversed domain (<code>com.company.project</code>) to be globally unique.</p>

<h3>Using classes from another package</h3>
<pre class="java">package com.college.app;

import com.college.exam.Result;     // single-type import (preferred)
import java.util.*;                 // on-demand: every class of java.util

public class Main {
    public static void main(String[] args) {
        System.out.println(Result.grade(55));
        java.time.LocalDate d = java.time.LocalDate.of(2026, 10, 31);   // fully qualified, no import needed
    }
}</pre>
<ul>
<li><code>import x.y.*;</code> imports the classes of that package only — <b>not</b> its sub-packages (<code>java.util.*</code> doesn't include <code>java.util.concurrent.locks</code>).</li>
<li>Imports don't copy code or slow anything down; they just let you write the short name.</li>
<li>If two imports give the same short name, use the fully qualified name.</li>
<li>Order in a file: <code>package</code> → <code>import</code>s → class declarations.</li>
</ul>

<h3>Static import</h3>
<pre class="java">import static java.lang.Math.*;      // use static members without the class name
double r = sqrt(pow(3, 2) + pow(4, 2));   // 5.0</pre>
<p>Handy, but use sparingly — code becomes harder to read when you can't see where a name comes from.</p>

<h3>Compiling and running packaged code</h3>
<pre>javac -d out src/com/college/exam/Result.java src/com/college/app/Main.java
java -cp out com.college.app.Main</pre>
<p><code>-d out</code> creates the package folders under <code>out</code>; <code>-cp</code> (classpath) tells java where to find them; you run the <b>fully qualified</b> class name.</p>

<h3>Modules (Java 9+) in one paragraph</h3>
<p>A <b>module</b> is a group of packages with a <code>module-info.java</code> file that says which packages it <code>exports</code> and which modules it <code>requires</code>. It adds a stronger level of encapsulation above packages. The JDK itself is split into modules (<code>java.base</code>, <code>java.sql</code>…).</p>

<div class="warn">The Run button on this site compiles a single file, so packages can't be created here. In the practice below you'll use import and fully qualified names; try creating your own packages on your lab machine.</div>
`,

  samples: [
    {
      title: "Three ways to use a class",
      code: J`import java.util.ArrayList;
import java.util.*;
import static java.lang.Math.max;

public class Main {
    public static void main(String[] args) {
        ArrayList<String> list = new ArrayList<>();
        list.add("one");
        Random r = new Random(42);
        java.time.LocalDate d = java.time.LocalDate.of(2026, 1, 26);
        System.out.println(list + " " + (r.nextInt(100) >= 0) + " " + d.getDayOfWeek());
        System.out.println(max(17, 29));
    }
}`,
      output: "[one] true MONDAY\n29",
    },
    {
      title: "Name clash: two Date classes",
      code: J`public class Main {
    public static void main(String[] args) {
        java.util.Date utilDate = new java.util.Date(0);
        java.sql.Date sqlDate = java.sql.Date.valueOf("2026-10-31");
        System.out.println(utilDate.getClass().getName());
        System.out.println(sqlDate);
    }
}`,
      output: "java.util.Date\n2026-10-31",
      explain: "When two packages have classes with the same name, write the full package name.",
    },
  ],

  practice: [
    {
      id: "c8t2p1", title: "Import and use",
      task: "<p>Import <code>java.util.Arrays</code> and <code>java.util.Random</code>. Create <code>new Random(7)</code> (a fixed seed makes it repeat the same numbers) and fill an int array of 5 with <code>nextInt(50)</code>. Print the sorted array.</p>",
      expected: "[14, 30, 35, 36, 44]",
      mustUse: ["import java.util.Arrays", "import java.util.Random", "new Random(7)"],
      hints: ["<code>for (int i = 0; i < a.length; i++) a[i] = r.nextInt(50);</code>", "Then Arrays.sort and Arrays.toString."],
      solution: J`import java.util.Arrays;
import java.util.Random;

public class Main {
    public static void main(String[] args) {
        Random r = new Random(7);
        int[] a = new int[5];
        for (int i = 0; i < a.length; i++) a[i] = r.nextInt(50);
        Arrays.sort(a);
        System.out.println(Arrays.toString(a));
    }
}`,
    },
    {
      id: "c8t2p2", title: "Static import",
      task: "<p>Use <code>import static java.lang.Math.*;</code> and compute, without writing <code>Math.</code> anywhere: the distance between points (1, 2) and (7, 10), and the larger of 3⁴ and 4³.</p>",
      expected: "Distance: 10.0\nLarger: 81.0",
      mustUse: ["import static java.lang.Math"],
      hints: ["distance = sqrt(pow(x2 − x1, 2) + pow(y2 − y1, 2))."],
      solution: J`import static java.lang.Math.*;

public class Main {
    public static void main(String[] args) {
        double d = sqrt(pow(7 - 1, 2) + pow(10 - 2, 2));
        System.out.println("Distance: " + d);
        System.out.println("Larger: " + max(pow(3, 4), pow(4, 3)));
    }
}`,
    },
    {
      id: "c8t2p3", title: "Fully qualified names",
      task: "<p>Without any import statements, create a <code>java.util.ArrayList&lt;Integer&gt;</code>, add 10, 20, 30, and print it along with <code>java.time.LocalDate.of(2026, 8, 15).getDayOfWeek()</code>.</p>",
      expected: "[10, 20, 30]\nSATURDAY",
      mustUse: ["java.util.ArrayList", "java.time.LocalDate"],
      hints: ["<code>java.util.ArrayList&lt;Integer&gt; list = new java.util.ArrayList&lt;&gt;();</code>"],
      solution: J`public class Main {
    public static void main(String[] args) {
        java.util.ArrayList<Integer> list = new java.util.ArrayList<>();
        list.add(10);
        list.add(20);
        list.add(30);
        System.out.println(list);
        System.out.println(java.time.LocalDate.of(2026, 8, 15).getDayOfWeek());
    }
}`,
    },
  ],

  fill: [
    { id: "c8t2f1", prompt: "First line of a file in package com.shop.billing.", template: "___ com.shop.billing;", answers: [["package"]], explain: "package must be the first statement." },
    { id: "c8t2f2", prompt: "Import a single class.", template: "___ java.util.Scanner;", answers: [["import"]], explain: "import packageName.ClassName;" },
    { id: "c8t2f3", prompt: "Run a class in a package (classes compiled into folder out).", template: "java -cp ___ com.shop.billing.App", answers: [["out"]], explain: "-cp gives the classpath root." },
  ],

  quiz: [
    { type: "mcq", q: "Which package is imported automatically?", options: ["java.util", "java.io", "java.lang", "java.time"], answer: 2, explain: "java.lang (String, Math, System…)." },
    { type: "mcq", q: "Does <code>import java.util.*;</code> import <code>java.util.concurrent.locks.ReentrantLock</code>?", options: ["Yes", "No", "Only if used", "Only in Java 25"], answer: 1, explain: "Wildcards don't include sub-packages." },
    { type: "mcq", q: "Correct order in a source file:", options: ["import, package, class", "package, import, class", "class, import, package", "any order"], answer: 1, explain: "package first, then imports, then types." },
    { type: "mcq", q: "Why do companies name packages like <code>com.infosys.payroll</code>?", options: ["required by javac", "to keep names globally unique", "for speed", "to make them public"], answer: 1, explain: "Reversed domain names avoid clashes between libraries." },
  ],
};
