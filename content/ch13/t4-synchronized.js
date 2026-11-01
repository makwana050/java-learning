const J = String.raw;

export default {
  title: "Race conditions & synchronized",
  summary: "Why threads that share data give wrong answers, what synchronized does, how to apply it to methods and blocks, and when volatile or atomic variables are enough.",

  concept: J`
<h2>Concept</h2>
<h3>The problem: a race condition</h3>
<p><code>count++</code> looks like one step but is really three: <b>read</b> count, <b>add</b> 1, <b>write</b> it back. If two threads do this at the same moment:</p>
<table>
<tr><th>Time</th><th>Thread A</th><th>Thread B</th><th>count</th></tr>
<tr><td>1</td><td>reads 10</td><td></td><td>10</td></tr>
<tr><td>2</td><td></td><td>reads 10</td><td>10</td></tr>
<tr><td>3</td><td>writes 11</td><td></td><td>11</td></tr>
<tr><td>4</td><td></td><td>writes 11</td><td><b>11</b> — one increment was lost!</td></tr>
</table>
<p>When the result depends on the timing of threads, it's a <b>race condition</b>. Code that touches shared data and must not be interleaved is a <b>critical section</b>.</p>

<h3>The fix: synchronized</h3>
<p>Every Java object has an internal <b>lock</b> (monitor). <code>synchronized</code> code must acquire that lock first. Only <b>one thread at a time</b> can hold it; others trying to enter wait in the <b>BLOCKED</b> state until it's released.</p>
<pre class="java">class Counter {
    private int count = 0;

    public synchronized void increment() {   // lock = this object
        count++;
    }
    public synchronized int get() { return count; }
}</pre>
<p>So <code>synchronized</code> gives:</p>
<ol>
<li><b>Mutual exclusion</b> — the critical section runs in one thread at a time (it becomes "atomic").</li>
<li><b>Visibility</b> — changes made inside are seen by the next thread that takes the same lock.</li>
</ol>

<h3>Ways to apply it</h3>
<table>
<tr><th>Form</th><th>Lock used</th></tr>
<tr><td><code>synchronized void m()</code> (instance method)</td><td><code>this</code> object</td></tr>
<tr><td><code>static synchronized void m()</code></td><td>the <b>class</b> object (<code>Counter.class</code>)</td></tr>
<tr><td><code>synchronized (obj) { … }</code> block</td><td>whatever object you name</td></tr>
</table>
<p>Prefer a <b>synchronized block</b> around only the lines that need it — holding a lock longer than necessary makes other threads wait. Often a private lock object is used: <code>private final Object lock = new Object();</code></p>
<div class="warn">Locks only work if every thread uses the <b>same</b> lock object. Two different Counter objects have two different locks — synchronizing on each doesn't protect a shared static field.</div>

<h3>Other tools</h3>
<ul>
<li><b>Atomic variables</b> (<code>java.util.concurrent.atomic</code>): <code>AtomicInteger.incrementAndGet()</code> is a lock-free, thread-safe counter. Great for single variables.</li>
<li><b>volatile</b>: guarantees every thread sees the latest value of a field (visibility), but does <b>not</b> make <code>count++</code> atomic. Good for simple flags like <code>volatile boolean running</code>.</li>
<li><b>Thread-safe classes</b>: <code>StringBuffer</code>, <code>ConcurrentHashMap</code>, <code>Collections.synchronizedList</code>.</li>
</ul>

<h3>Deadlock</h3>
<p>If thread 1 holds lock A and waits for lock B while thread 2 holds B and waits for A, both wait forever — a <b>deadlock</b>. Avoid it by always taking multiple locks in the <b>same order</b>, holding locks briefly, or using <code>tryLock</code> with a timeout (next topic).</p>
`,

  samples: [
    {
      title: "Lost updates without synchronization",
      code: J`class UnsafeCounter {
    int count = 0;

    void increment() {
        int current = count;
        Thread.yield();
        count = current + 1;
    }
}

public class Main {
    public static void main(String[] args) throws InterruptedException {
        UnsafeCounter c = new UnsafeCounter();
        Runnable task = () -> {
            for (int i = 0; i < 1000; i++) c.increment();
        };
        Thread a = new Thread(task);
        Thread b = new Thread(task);
        a.start();
        b.start();
        a.join();
        b.join();
        System.out.println("Expected 2000, got " + c.count + " (depends on timing)");
    }
}`,
      output: "Expected 2000, got (depends on timing — usually less than 2000)",
      explain: "<code>Thread.yield()</code> between the read and the write makes the problem show up more often. Run it several times — the number changes. That's a race condition.",
    },
    {
      title: "Fixed with synchronized",
      code: J`class SafeCounter {
    private int count = 0;

    synchronized void increment() {
        int current = count;
        Thread.yield();
        count = current + 1;
    }

    synchronized int get() {
        return count;
    }
}

public class Main {
    public static void main(String[] args) throws InterruptedException {
        SafeCounter c = new SafeCounter();
        Runnable task = () -> {
            for (int i = 0; i < 1000; i++) c.increment();
        };
        Thread a = new Thread(task);
        Thread b = new Thread(task);
        a.start();
        b.start();
        a.join();
        b.join();
        System.out.println("Expected 2000, got " + c.get());
    }
}`,
      output: "Expected 2000, got 2000",
    },
    {
      title: "Synchronized block and AtomicInteger",
      code: J`import java.util.concurrent.atomic.AtomicInteger;

public class Main {
    static int sharedTotal = 0;
    static final Object LOCK = new Object();
    static AtomicInteger hits = new AtomicInteger();

    public static void main(String[] args) throws InterruptedException {
        Runnable task = () -> {
            for (int i = 1; i <= 500; i++) {
                int local = i * 2;
                synchronized (LOCK) {
                    sharedTotal += local;
                }
                hits.incrementAndGet();
            }
        };
        Thread[] ts = new Thread[4];
        for (int i = 0; i < 4; i++) { ts[i] = new Thread(task); ts[i].start(); }
        for (Thread t : ts) t.join();
        System.out.println("Total: " + sharedTotal);
        System.out.println("Hits: " + hits.get());
    }
}`,
      output: "Total: 1002000\nHits: 2000",
      explain: "Only the update of the shared field is inside the lock; the calculation of <code>local</code> runs in parallel.",
    },
  ],

  practice: [
    {
      id: "c13t4p1", title: "Thread-safe bank account",
      task: "<p>Class <code>Account</code> has a balance of 10000. Three threads each <code>deposit(10)</code> 300 times, and one thread <code>withdraw(10)</code> 300 times. Make deposit and withdraw safe so the final balance is always correct.</p>",
      starter: J`class Account {
    private int balance = 10000;

    void deposit(int amount) {
        int b = balance;
        Thread.yield();
        balance = b + amount;
    }

    void withdraw(int amount) {
        int b = balance;
        Thread.yield();
        balance = b - amount;
    }

    int getBalance() { return balance; }
}

public class Main {
    public static void main(String[] args) throws InterruptedException {
        Account acc = new Account();
        Runnable dep = () -> { for (int i = 0; i < 300; i++) acc.deposit(10); };
        Runnable wd = () -> { for (int i = 0; i < 300; i++) acc.withdraw(10); };
        Thread[] ts = {new Thread(dep), new Thread(dep), new Thread(dep), new Thread(wd)};
        for (Thread t : ts) t.start();
        for (Thread t : ts) t.join();
        System.out.println("Final balance: " + acc.getBalance());
    }
}`,
      expected: "Final balance: 16000",
      mustUse: ["synchronized"],
      hints: ["Add <code>synchronized</code> to deposit, withdraw and getBalance.", "10000 + 3 × 300 × 10 − 300 × 10 = 16000."],
      solution: J`class Account {
    private int balance = 10000;

    synchronized void deposit(int amount) {
        int b = balance;
        Thread.yield();
        balance = b + amount;
    }

    synchronized void withdraw(int amount) {
        int b = balance;
        Thread.yield();
        balance = b - amount;
    }

    synchronized int getBalance() { return balance; }
}

public class Main {
    public static void main(String[] args) throws InterruptedException {
        Account acc = new Account();
        Runnable dep = () -> { for (int i = 0; i < 300; i++) acc.deposit(10); };
        Runnable wd = () -> { for (int i = 0; i < 300; i++) acc.withdraw(10); };
        Thread[] ts = {new Thread(dep), new Thread(dep), new Thread(dep), new Thread(wd)};
        for (Thread t : ts) t.start();
        for (Thread t : ts) t.join();
        System.out.println("Final balance: " + acc.getBalance());
    }
}`,
    },
    {
      id: "c13t4p2", title: "Ticket booking without overselling",
      task: "<p>A show has 10 seats. Four agent threads each try to book 4 seats one at a time with <code>boolean bookOne(String agent)</code>, which succeeds only if seats remain. Use a <b>synchronized block</b> on a private lock object so seats are never oversold. Print the total booked and seats left.</p>",
      expected: "Booked: 10, seats left: 0",
      mustUse: ["synchronized (lock)"],
      hints: ["Inside bookOne: <code>synchronized (lock) { if (seats > 0) { seats--; booked++; return true; } return false; }</code>"],
      solution: J`class Show {
    private int seats = 10;
    private int booked = 0;
    private final Object lock = new Object();

    boolean bookOne(String agent) {
        synchronized (lock) {
            if (seats > 0) {
                Thread.yield();
                seats--;
                booked++;
                return true;
            }
            return false;
        }
    }

    int getBooked() { synchronized (lock) { return booked; } }
    int getSeats() { synchronized (lock) { return seats; } }
}

public class Main {
    public static void main(String[] args) throws InterruptedException {
        Show show = new Show();
        Thread[] agents = new Thread[4];
        for (int i = 0; i < 4; i++) {
            final String name = "agent" + i;
            agents[i] = new Thread(() -> {
                for (int k = 0; k < 4; k++) show.bookOne(name);
            });
            agents[i].start();
        }
        for (Thread t : agents) t.join();
        System.out.println("Booked: " + show.getBooked() + ", seats left: " + show.getSeats());
    }
}`,
    },
    {
      id: "c13t4p3", title: "AtomicInteger visitor counter",
      task: "<p>Five threads each register 1000 website visits. Use an <code>AtomicInteger</code> (no synchronized) so the final count is exactly 5000.</p>",
      expected: "Visits: 5000",
      mustUse: ["AtomicInteger", "incrementAndGet"],
      hints: ["<code>static AtomicInteger visits = new AtomicInteger();</code> and <code>visits.incrementAndGet();</code>"],
      solution: J`import java.util.concurrent.atomic.AtomicInteger;

public class Main {
    static AtomicInteger visits = new AtomicInteger();

    public static void main(String[] args) throws InterruptedException {
        Thread[] ts = new Thread[5];
        for (int i = 0; i < 5; i++) {
            ts[i] = new Thread(() -> {
                for (int k = 0; k < 1000; k++) visits.incrementAndGet();
            });
            ts[i].start();
        }
        for (Thread t : ts) t.join();
        System.out.println("Visits: " + visits.get());
    }
}`,
    },
  ],

  fill: [
    { id: "c13t4f1", prompt: "Make only one thread at a time run this method.", template: "public ___ void transfer(int amt) { … }", answers: [["synchronized"]], explain: "A synchronized instance method locks on this." },
    { id: "c13t4f2", prompt: "Lock on a private object for just a few lines.", template: "___ (lock) {\n    total += x;\n}", answers: [["synchronized"]], explain: "A synchronized block." },
    { id: "c13t4f3", prompt: "Which lock does a static synchronized method use?", template: "the ___ object", answers: [["class", "Class"]], explain: "e.g. Counter.class." },
  ],

  quiz: [
    { type: "mcq", q: "Why can <code>count++</code> give wrong results with two threads?", options: ["++ is slow", "it is read-modify-write, not atomic", "int is too small", "threads can't share ints"], answer: 1, explain: "Two threads can read the same old value." },
    { type: "mcq", q: "What does a thread do when another thread holds the lock it needs?", options: ["skips the block", "waits in BLOCKED state", "throws an exception", "runs anyway"], answer: 1, explain: "It waits until the lock is released." },
    { type: "mcq", q: "Does <code>volatile int count</code> make count++ thread-safe?", options: ["Yes", "No — volatile gives visibility, not atomicity"], answer: 1, explain: "Use synchronized or AtomicInteger." },
    { type: "mcq", q: "Two threads each call <code>synchronized</code> methods on two DIFFERENT objects. Do they block each other?", options: ["Yes", "No — different objects, different locks"], answer: 1, explain: "Locks are per object." },
    { type: "mcq", q: "How can you prevent deadlock with two locks A and B?", options: ["use more threads", "always acquire A then B in every thread", "use volatile", "call sleep()"], answer: 1, explain: "A consistent lock order prevents the circular wait." },
  ],
};
