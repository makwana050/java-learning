const J = String.raw;

export default {
  title: "Locks: ReentrantLock",
  summary: "Explicit locks from java.util.concurrent.locks: lock/unlock with try-finally, why you'd choose them over synchronized, tryLock, fairness and read-write locks.",

  concept: J`
<h2>Concept</h2>
<p><code>synchronized</code> is simple but limited: you can't wait for a lock with a timeout, you can't give up if it's busy, and the lock is released only at the end of the block. The <code>Lock</code> interface (Java 5) gives explicit control. Its main implementation is <code>ReentrantLock</code>.</p>

<h3>The pattern — always unlock in finally</h3>
<pre class="java">import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

class Counter {
    private final Lock lock = new ReentrantLock();
    private int count;

    void increment() {
        lock.lock();            // acquire (waits if another thread holds it)
        try {
            count++;            // critical section
        } finally {
            lock.unlock();      // ALWAYS release, even if an exception happens
        }
    }
}</pre>
<div class="warn">If you forget <code>unlock()</code> (or an exception skips it), the lock stays held forever and every other thread blocks. That's why <code>unlock()</code> always goes in <code>finally</code>. With synchronized, Java releases the lock for you.</div>

<h3>Why apply a lock?</h3>
<p>For the same reason as synchronized: to make a critical section <b>mutually exclusive</b> and its changes <b>visible</b> to other threads. Choose ReentrantLock when you need one of its extras:</p>
<table>
<tr><th>Feature</th><th>synchronized</th><th>ReentrantLock</th></tr>
<tr><td>Release</td><td>automatic</td><td>manual (<code>unlock</code> in finally)</td></tr>
<tr><td>Try without waiting</td><td>✗</td><td><code>tryLock()</code> returns true/false immediately</td></tr>
<tr><td>Wait with a timeout</td><td>✗</td><td><code>tryLock(2, TimeUnit.SECONDS)</code></td></tr>
<tr><td>Interruptible waiting</td><td>✗</td><td><code>lockInterruptibly()</code></td></tr>
<tr><td>Fairness (longest-waiting thread goes first)</td><td>✗</td><td><code>new ReentrantLock(true)</code></td></tr>
<tr><td>Several wait-conditions</td><td>one (wait/notify)</td><td><code>lock.newCondition()</code> — many</td></tr>
<tr><td>Lock across methods</td><td>only within one block</td><td>lock in one method, unlock in another (carefully!)</td></tr>
</table>

<h3>Reentrant</h3>
<p>"Reentrant" means the thread that holds the lock may lock it <b>again</b> (e.g. one locked method calls another). The lock counts how many times it was taken (<code>getHoldCount()</code>) and is free only after the same number of <code>unlock()</code> calls. synchronized is reentrant too.</p>

<h3>tryLock — avoiding deadlock and long waits</h3>
<pre class="java">if (lock.tryLock()) {
    try { … } finally { lock.unlock(); }
} else {
    System.out.println("Busy — try later");
}</pre>

<h3>ReadWriteLock</h3>
<p><code>ReentrantReadWriteLock</code> has two locks: many threads may hold the <b>read</b> lock at the same time, but the <b>write</b> lock is exclusive. Great for data that is read often and changed rarely (a cache, settings).</p>
`,

  samples: [
    {
      title: "ReentrantLock counter",
      code: J`import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

class Counter {
    private final Lock lock = new ReentrantLock();
    private int count;

    void increment() {
        lock.lock();
        try {
            int c = count;
            Thread.yield();
            count = c + 1;
        } finally {
            lock.unlock();
        }
    }

    int get() {
        lock.lock();
        try {
            return count;
        } finally {
            lock.unlock();
        }
    }
}

public class Main {
    public static void main(String[] args) throws InterruptedException {
        Counter c = new Counter();
        Thread[] ts = new Thread[3];
        for (int i = 0; i < 3; i++) {
            ts[i] = new Thread(() -> { for (int k = 0; k < 1000; k++) c.increment(); });
            ts[i].start();
        }
        for (Thread t : ts) t.join();
        System.out.println("Count: " + c.get());
    }
}`,
      output: "Count: 3000",
    },
    {
      title: "Reentrancy and tryLock",
      code: J`import java.util.concurrent.locks.ReentrantLock;

public class Main {
    static ReentrantLock lock = new ReentrantLock();

    static void outer() {
        lock.lock();
        try {
            System.out.println("outer holds " + lock.getHoldCount());
            inner();
        } finally {
            lock.unlock();
        }
    }

    static void inner() {
        lock.lock();
        try {
            System.out.println("inner holds " + lock.getHoldCount());
        } finally {
            lock.unlock();
        }
    }

    public static void main(String[] args) throws InterruptedException {
        outer();
        System.out.println("after outer: locked? " + lock.isLocked());
        lock.lock();
        Thread other = new Thread(() -> {
            boolean got = lock.tryLock();
            System.out.println("other thread got the lock? " + got);
        });
        other.start();
        other.join();
        lock.unlock();
    }
}`,
      output: "outer holds 1\ninner holds 2\nafter outer: locked? false\nother thread got the lock? false",
      explain: "main holds the lock while the other thread tries, so tryLock() returns false immediately instead of waiting.",
    },
  ],

  practice: [
    {
      id: "c13t5p1", title: "Replace synchronized with a Lock",
      task: "<p>Rewrite the <code>Inventory</code> class to use a <code>ReentrantLock</code> instead of synchronized, with lock/unlock in try-finally. Three threads each add 200 items and one thread removes 150.</p>",
      starter: J`class Inventory {
    private int items = 0;

    synchronized void add(int n) {
        int c = items;
        Thread.yield();
        items = c + n;
    }

    synchronized void remove(int n) {
        int c = items;
        Thread.yield();
        items = c - n;
    }

    synchronized int count() { return items; }
}

public class Main {
    public static void main(String[] args) throws InterruptedException {
        Inventory inv = new Inventory();
        Runnable adder = () -> { for (int i = 0; i < 200; i++) inv.add(1); };
        Runnable remover = () -> { for (int i = 0; i < 150; i++) inv.remove(1); };
        Thread[] ts = {new Thread(adder), new Thread(adder), new Thread(adder), new Thread(remover)};
        for (Thread t : ts) t.start();
        for (Thread t : ts) t.join();
        System.out.println("Items: " + inv.count());
    }
}`,
      expected: "Items: 450",
      mustUse: ["ReentrantLock", "lock.unlock()", "finally"],
      hints: ["Field: <code>private final ReentrantLock lock = new ReentrantLock();</code>", "Each method: <code>lock.lock(); try { … } finally { lock.unlock(); }</code>"],
      solution: J`import java.util.concurrent.locks.ReentrantLock;

class Inventory {
    private int items = 0;
    private final ReentrantLock lock = new ReentrantLock();

    void add(int n) {
        lock.lock();
        try {
            int c = items;
            Thread.yield();
            items = c + n;
        } finally {
            lock.unlock();
        }
    }

    void remove(int n) {
        lock.lock();
        try {
            int c = items;
            Thread.yield();
            items = c - n;
        } finally {
            lock.unlock();
        }
    }

    int count() {
        lock.lock();
        try {
            return items;
        } finally {
            lock.unlock();
        }
    }
}

public class Main {
    public static void main(String[] args) throws InterruptedException {
        Inventory inv = new Inventory();
        Runnable adder = () -> { for (int i = 0; i < 200; i++) inv.add(1); };
        Runnable remover = () -> { for (int i = 0; i < 150; i++) inv.remove(1); };
        Thread[] ts = {new Thread(adder), new Thread(adder), new Thread(adder), new Thread(remover)};
        for (Thread t : ts) t.start();
        for (Thread t : ts) t.join();
        System.out.println("Items: " + inv.count());
    }
}`,
    },
    {
      id: "c13t5p2", title: "Printer with tryLock",
      task: "<p>A shared printer is protected by a ReentrantLock. Main locks it (a long print job). A second thread calls <code>tryPrint(\"Report\")</code>, which uses <code>tryLock()</code> and prints <code>Printer busy, Report queued</code> if it can't get the lock. After main unlocks, the second thread tries again and prints <code>Printing Report</code>.</p>",
      expected: "main: printing long job\nPrinter busy, Report queued\nmain: job done\nPrinting Report",
      mustUse: ["tryLock()"],
      hints: ["Run the first attempt in a thread and join it while main still holds the lock; unlock; then run a second thread (or call again) and join."],
      solution: J`import java.util.concurrent.locks.ReentrantLock;

public class Main {
    static final ReentrantLock printer = new ReentrantLock();

    static void tryPrint(String doc) {
        if (printer.tryLock()) {
            try {
                System.out.println("Printing " + doc);
            } finally {
                printer.unlock();
            }
        } else {
            System.out.println("Printer busy, " + doc + " queued");
        }
    }

    public static void main(String[] args) throws InterruptedException {
        printer.lock();
        try {
            System.out.println("main: printing long job");
            Thread first = new Thread(() -> tryPrint("Report"));
            first.start();
            first.join();
            System.out.println("main: job done");
        } finally {
            printer.unlock();
        }
        Thread second = new Thread(() -> tryPrint("Report"));
        second.start();
        second.join();
    }
}`,
    },
  ],

  fill: [
    { id: "c13t5f1", prompt: "The safe ReentrantLock pattern.", template: "lock.___();\ntry {\n    balance += amt;\n} ___ {\n    lock.___();\n}", answers: [["lock"], ["finally"], ["unlock"]], explain: "unlock() must be in finally so it always runs." },
    { id: "c13t5f2", prompt: "Try to take the lock without waiting.", template: "if (lock.___()) { … }", answers: [["tryLock"]], explain: "Returns true if it got the lock, false immediately otherwise." },
  ],

  quiz: [
    { type: "mcq", q: "Why must unlock() be in a finally block?", options: ["it's faster", "so the lock is released even if an exception is thrown", "required by the compiler", "to make it reentrant"], answer: 1, explain: "Otherwise other threads could wait forever." },
    { type: "mcq", q: "A thread holding a ReentrantLock calls lock() again. What happens?", options: ["deadlock", "exception", "succeeds; hold count becomes 2", "it waits for itself"], answer: 2, explain: "That's what reentrant means." },
    { type: "mcq", q: "Which feature does ReentrantLock have but synchronized doesn't?", options: ["mutual exclusion", "tryLock with timeout", "visibility of changes", "reentrancy"], answer: 1, explain: "The others are shared by both." },
    { type: "mcq", q: "ReentrantReadWriteLock allows…", options: ["many readers OR one writer at a time", "many writers at once", "only one reader", "no locking"], answer: 0, explain: "Read lock is shared, write lock is exclusive." },
  ],
};
