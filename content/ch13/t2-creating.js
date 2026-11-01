const J = String.raw;

export default {
  title: "Creating threads",
  summary: "Three ways to create a thread — extending Thread, implementing Runnable, and lambdas — and the crucial difference between start() and run().",

  concept: J`
<h2>Concept</h2>
<h3>Way 1: extend Thread</h3>
<pre class="java">class Downloader extends Thread {
    @Override
    public void run() {                 // the work this thread does
        System.out.println("Downloading in " + getName());
    }
}
Downloader d = new Downloader();
d.start();                              // creates the new thread, which calls run()</pre>

<h3>Way 2: implement Runnable (preferred)</h3>
<pre class="java">class Task implements Runnable {
    @Override
    public void run() { … }
}
Thread t = new Thread(new Task(), "worker-1");   // pass the task (+ optional name)
t.start();</pre>

<h3>Way 3: Runnable as a lambda</h3>
<pre class="java">Thread t = new Thread(() -&gt; System.out.println("Quick task"));
t.start();</pre>
<p><code>Runnable</code> has exactly one method, <code>void run()</code>, so it's a functional interface.</p>

<h3>Thread vs Runnable</h3>
<table>
<tr><th>extends Thread</th><th>implements Runnable</th></tr>
<tr><td>uses up your one superclass</td><td>class can still extend another class</td></tr>
<tr><td>task and thread are the same object</td><td>task is separate from the thread — the same Runnable can be given to several threads or to a thread pool</td></tr>
<tr><td>quick for tiny demos</td><td><b>recommended</b> in real code</td></tr>
</table>

<h3>start() vs run() — the classic mistake</h3>
<table>
<tr><th><code>t.start()</code></th><th><code>t.run()</code></th></tr>
<tr><td>creates a <b>new thread</b>, which then calls run()</td><td>just a normal method call — runs in the <b>current</b> thread</td></tr>
<tr><td>returns immediately; both threads continue</td><td>the caller waits until run() finishes</td></tr>
<tr><td>can be called only once</td><td>can be called any number of times</td></tr>
</table>

<h3>Passing data to a thread</h3>
<p>Give the Runnable fields through its constructor, or capture effectively final variables in a lambda. Collect results into fields or arrays, and read them only <b>after join()</b>.</p>
`,

  samples: [
    {
      title: "Three ways, made predictable with join()",
      code: J`class Greeter extends Thread {
    Greeter(String name) { super(name); }
    @Override
    public void run() {
        System.out.println(getName() + ": extends Thread");
    }
}

class Counter implements Runnable {
    @Override
    public void run() {
        System.out.println(Thread.currentThread().getName() + ": implements Runnable");
    }
}

public class Main {
    public static void main(String[] args) throws InterruptedException {
        Thread a = new Greeter("alpha");
        Thread b = new Thread(new Counter(), "beta");
        Thread c = new Thread(() -> System.out.println(Thread.currentThread().getName() + ": lambda"), "gamma");
        a.start(); a.join();
        b.start(); b.join();
        c.start(); c.join();
        System.out.println("main done");
    }
}`,
      output: "alpha: extends Thread\nbeta: implements Runnable\ngamma: lambda\nmain done",
    },
    {
      title: "start() vs run()",
      code: J`public class StartRun {
    public static void main(String[] args) throws InterruptedException {
        Thread t = new Thread(() -> System.out.println("running in: " + Thread.currentThread().getName()), "worker");
        t.run();
        t.start();
        t.join();
    }
}`,
      output: "running in: main\nrunning in: worker",
      explain: "run() executed the code in the main thread. Only start() created the worker thread.",
    },
    {
      title: "Splitting work between threads",
      code: J`class RangeSum implements Runnable {
    private final int from, to;
    long result;

    RangeSum(int from, int to) { this.from = from; this.to = to; }

    @Override
    public void run() {
        for (int i = from; i <= to; i++) result += i;
    }
}

public class Main {
    public static void main(String[] args) throws InterruptedException {
        RangeSum first = new RangeSum(1, 500000);
        RangeSum second = new RangeSum(500001, 1000000);
        Thread t1 = new Thread(first);
        Thread t2 = new Thread(second);
        t1.start();
        t2.start();
        t1.join();
        t2.join();
        System.out.println("Total = " + (first.result + second.result));
    }
}`,
      output: "Total = 500000500000",
      explain: "Both halves run at the same time. main reads the results only after both joins.",
    },
  ],

  practice: [
    {
      id: "c13t2p1", title: "Runnable with a constructor",
      task: "<p>Write <code>class TablePrinter implements Runnable</code> that prints the table of the number given in its constructor up to 3. Run it for 4 and then 9 in two threads, one after the other (start then join each).</p>",
      expected: "4 x 1 = 4\n4 x 2 = 8\n4 x 3 = 12\n9 x 1 = 9\n9 x 2 = 18\n9 x 3 = 27",
      mustUse: ["implements Runnable", "public void run()"],
      hints: ["<code>Thread t1 = new Thread(new TablePrinter(4)); t1.start(); t1.join();</code>"],
      solution: J`class TablePrinter implements Runnable {
    private final int n;
    TablePrinter(int n) { this.n = n; }

    @Override
    public void run() {
        for (int i = 1; i <= 3; i++) System.out.println(n + " x " + i + " = " + n * i);
    }
}

public class Main {
    public static void main(String[] args) throws InterruptedException {
        Thread t1 = new Thread(new TablePrinter(4));
        t1.start();
        t1.join();
        Thread t2 = new Thread(new TablePrinter(9));
        t2.start();
        t2.join();
    }
}`,
    },
    {
      id: "c13t2p2", title: "Extend Thread with a name",
      task: "<p>Write <code>class Racer extends Thread</code> whose constructor takes a name (pass it to <code>super(name)</code>). Its run() prints <code>name finished lap N</code> for laps 1–2. Run racers \"Red\" then \"Blue\" one after the other.</p>",
      expected: "Red finished lap 1\nRed finished lap 2\nBlue finished lap 1\nBlue finished lap 2",
      mustUse: ["extends Thread", "super(name)", "getName()"],
      hints: ["Inside run(): <code>System.out.println(getName() + \" finished lap \" + lap);</code>"],
      solution: J`class Racer extends Thread {
    Racer(String name) { super(name); }

    @Override
    public void run() {
        for (int lap = 1; lap <= 2; lap++) {
            System.out.println(getName() + " finished lap " + lap);
        }
    }
}

public class Main {
    public static void main(String[] args) throws InterruptedException {
        Racer r = new Racer("Red");
        r.start();
        r.join();
        Racer b = new Racer("Blue");
        b.start();
        b.join();
    }
}`,
    },
    {
      id: "c13t2p3", title: "Parallel count of primes",
      task: "<p>Count primes from 1 to 20000 using <b>four</b> threads, each checking a quarter of the range (1–5000, 5001–10000, …). Store each count in an <code>int[] counts = new int[4]</code>, join all threads, then print the total.</p>",
      expected: "Primes up to 20000: 2262",
      mustUse: ["new Thread", "join()"],
      hints: ["Create threads in a loop: <code>final int part = i;</code> then a lambda that fills counts[part].", "Start all four first, then join all four — that's what makes them run in parallel."],
      solution: J`public class Main {
    static boolean isPrime(int n) {
        if (n < 2) return false;
        for (int d = 2; d * d <= n; d++) if (n % d == 0) return false;
        return true;
    }

    public static void main(String[] args) throws InterruptedException {
        int[] counts = new int[4];
        Thread[] threads = new Thread[4];
        for (int i = 0; i < 4; i++) {
            final int part = i;
            threads[i] = new Thread(() -> {
                int from = part * 5000 + 1, to = (part + 1) * 5000;
                for (int n = from; n <= to; n++) if (isPrime(n)) counts[part]++;
            });
            threads[i].start();
        }
        int total = 0;
        for (int i = 0; i < 4; i++) {
            threads[i].join();
            total += counts[i];
        }
        System.out.println("Primes up to 20000: " + total);
    }
}`,
    },
  ],

  fill: [
    { id: "c13t2f1", prompt: "Create and start a thread from a Runnable task.", template: "Thread t = new Thread(task);\nt.___();", answers: [["start"]], explain: "start() creates the new thread; run() would not." },
    { id: "c13t2f2", prompt: "The one method of Runnable.", template: "public void ___()", answers: [["run"]], explain: "Runnable.run()." },
  ],

  quiz: [
    { type: "mcq", q: "Why is implementing Runnable usually preferred over extending Thread?", options: ["it's faster", "the class can still extend another class and the task is separate from the thread", "Thread is deprecated", "Runnable has more methods"], answer: 1, explain: "Composition over inheritance." },
    { type: "mcq", q: "Calling <code>t.run()</code> instead of <code>t.start()</code>…", options: ["throws an exception", "runs the code in the current thread, no new thread", "starts two threads", "does nothing"], answer: 1, explain: "It's an ordinary method call." },
    { type: "mcq", q: "Which is a valid way to create a thread with a lambda?", options: ["new Thread(-> work())", "new Thread(() -> work())", "Thread.run(() -> work())", "new Runnable(() -> work())"], answer: 1, explain: "Runnable is a functional interface." },
  ],
};
