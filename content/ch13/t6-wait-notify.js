const J = String.raw;

export default {
  title: "wait/notify & ExecutorService",
  summary: "Let threads cooperate with wait() and notify() — the producer-consumer pattern — and let a thread pool manage threads for you with ExecutorService.",

  concept: J`
<h2>Concept</h2>
<h3>Inter-thread communication: wait() and notify()</h3>
<p>Sometimes a thread must wait until another thread has done something: a consumer waits until the producer has put an item; a producer waits until there is room. Every object has three methods for this (from <code>Object</code>):</p>
<table>
<tr><th>Method</th><th>Does</th></tr>
<tr><td><code>wait()</code></td><td>releases the object's lock and sleeps until notified (WAITING)</td></tr>
<tr><td><code>notify()</code></td><td>wakes up one thread waiting on this object</td></tr>
<tr><td><code>notifyAll()</code></td><td>wakes up all waiting threads (safer in most cases)</td></tr>
</table>
<ul>
<li>They must be called <b>inside synchronized</b> code on the same object, otherwise → <code>IllegalMonitorStateException</code>.</li>
<li>Always wait in a <b>while loop</b> that re-checks the condition: <code>while (empty) wait();</code> — a thread can wake up and find the condition still false.</li>
<li><code>wait()</code> releases the lock; <code>sleep()</code> does <b>not</b>.</li>
</ul>
<pre class="java">synchronized void put(int x) throws InterruptedException {
    while (full) wait();         // wait for space
    item = x; full = true;
    notifyAll();                 // tell the consumer
}
synchronized int take() throws InterruptedException {
    while (!full) wait();        // wait for an item
    full = false;
    notifyAll();                 // tell the producer
    return item;
}</pre>

<h3>sleep() vs wait()</h3>
<table>
<tr><th></th><th>sleep()</th><th>wait()</th></tr>
<tr><td>Class</td><td>Thread (static)</td><td>Object</td></tr>
<tr><td>Releases the lock?</td><td><b>No</b></td><td><b>Yes</b></td></tr>
<tr><td>Needs synchronized?</td><td>No</td><td>Yes</td></tr>
<tr><td>Wakes up</td><td>after the time</td><td>on notify/notifyAll (or timeout)</td></tr>
</table>
<p>In modern code, <code>BlockingQueue</code> (<code>ArrayBlockingQueue</code>) gives producer–consumer without writing wait/notify yourself — but understanding wait/notify is essential and often asked in interviews.</p>

<h3>ExecutorService — thread pools</h3>
<p>Creating a new Thread for every small task is expensive. An <b>ExecutorService</b> keeps a pool of reusable worker threads and a queue of tasks.</p>
<pre class="java">ExecutorService pool = Executors.newFixedThreadPool(3);
Future&lt;Integer&gt; f = pool.submit(() -&gt; computeSomething());   // Callable returns a value
pool.submit(() -&gt; System.out.println("work"));              // Runnable
int result = f.get();                                        // waits for the result
pool.shutdown();                                             // no new tasks; finish queued ones
pool.awaitTermination(5, TimeUnit.SECONDS);</pre>
<table>
<tr><th>Term</th><th>Meaning</th></tr>
<tr><td><code>Runnable</code></td><td>task with <code>void run()</code> — no result, can't throw checked exceptions</td></tr>
<tr><td><code>Callable&lt;V&gt;</code></td><td>task with <code>V call() throws Exception</code> — returns a result</td></tr>
<tr><td><code>Future&lt;V&gt;</code></td><td>a handle to a result that will be ready later; <code>get()</code> waits for it</td></tr>
<tr><td><code>shutdown()</code></td><td>always call it, or the pool's threads keep the program alive</td></tr>
</table>
`,

  samples: [
    {
      title: "Producer–consumer with wait/notify",
      code: J`class Slot {
    private int item;
    private boolean full = false;

    synchronized void put(int x) throws InterruptedException {
        while (full) wait();
        item = x;
        full = true;
        System.out.println("Produced " + x);
        notifyAll();
    }

    synchronized int take() throws InterruptedException {
        while (!full) wait();
        full = false;
        System.out.println("Consumed " + item);
        notifyAll();
        return item;
    }
}

public class Main {
    public static void main(String[] args) throws InterruptedException {
        Slot slot = new Slot();
        Thread producer = new Thread(() -> {
            try {
                for (int i = 1; i <= 3; i++) slot.put(i * 10);
            } catch (InterruptedException e) { }
        });
        Thread consumer = new Thread(() -> {
            try {
                for (int i = 1; i <= 3; i++) slot.take();
            } catch (InterruptedException e) { }
        });
        consumer.start();
        producer.start();
        producer.join();
        consumer.join();
        System.out.println("Done");
    }
}`,
      output: "Produced 10\nConsumed 10\nProduced 20\nConsumed 20\nProduced 30\nConsumed 30\nDone",
      explain: "The single slot forces strict turns: the producer waits while it's full, the consumer waits while it's empty.",
    },
    {
      title: "Thread pool with Callable and Future",
      code: J`import java.util.*;
import java.util.concurrent.*;

public class Main {
    static long sumOfSquares(int from, int to) {
        long s = 0;
        for (int i = from; i <= to; i++) s += (long) i * i;
        return s;
    }

    public static void main(String[] args) throws Exception {
        ExecutorService pool = Executors.newFixedThreadPool(3);
        List<Future<Long>> parts = new ArrayList<>();
        for (int p = 0; p < 4; p++) {
            final int from = p * 250 + 1, to = (p + 1) * 250;
            parts.add(pool.submit(() -> sumOfSquares(from, to)));
        }
        long total = 0;
        for (Future<Long> f : parts) total += f.get();
        pool.shutdown();
        System.out.println("Sum of squares 1..1000 = " + total);
        System.out.println("Pool shut down: " + pool.isShutdown());
    }
}`,
      output: "Sum of squares 1..1000 = 333833500\nPool shut down: true",
    },
  ],

  practice: [
    {
      id: "c13t6p1", title: "Ping-pong with wait/notify",
      task: "<p>Two threads must print <code>Ping</code> and <code>Pong</code> alternately, 3 times each, always starting with Ping. Use a shared object with a boolean <code>pingTurn</code> and wait/notifyAll inside synchronized methods.</p>",
      expected: "Ping\nPong\nPing\nPong\nPing\nPong",
      mustUse: ["wait()", "notifyAll()", "synchronized"],
      hints: ["<code>synchronized void ping() throws InterruptedException { while (!pingTurn) wait(); System.out.println(\"Ping\"); pingTurn = false; notifyAll(); }</code>", "pong() is the mirror image."],
      solution: J`class Table {
    private boolean pingTurn = true;

    synchronized void ping() throws InterruptedException {
        while (!pingTurn) wait();
        System.out.println("Ping");
        pingTurn = false;
        notifyAll();
    }

    synchronized void pong() throws InterruptedException {
        while (pingTurn) wait();
        System.out.println("Pong");
        pingTurn = true;
        notifyAll();
    }
}

public class Main {
    public static void main(String[] args) throws InterruptedException {
        Table t = new Table();
        Thread a = new Thread(() -> {
            try { for (int i = 0; i < 3; i++) t.ping(); } catch (InterruptedException e) { }
        });
        Thread b = new Thread(() -> {
            try { for (int i = 0; i < 3; i++) t.pong(); } catch (InterruptedException e) { }
        });
        b.start();
        a.start();
        a.join();
        b.join();
    }
}`,
    },
    {
      id: "c13t6p2", title: "Word lengths with a thread pool",
      task: "<p>Use a fixed thread pool of 2 threads. Submit one <code>Callable&lt;Integer&gt;</code> per word in <code>{\"thread\", \"pool\", \"executor\", \"future\"}</code> returning the word's length. Collect the Futures in order, print each word with its length and the total, then shut down the pool.</p>",
      expected: "thread: 6\npool: 4\nexecutor: 8\nfuture: 6\nTotal letters: 24",
      mustUse: ["Executors.newFixedThreadPool(2)", "Future<Integer>", "shutdown()"],
      hints: ["<code>futures.add(pool.submit(() -> w.length()));</code> — w must be effectively final (it is, in a for-each).", "f.get() waits for each result; main must declare <code>throws Exception</code>."],
      solution: J`import java.util.*;
import java.util.concurrent.*;

public class Main {
    public static void main(String[] args) throws Exception {
        String[] words = {"thread", "pool", "executor", "future"};
        ExecutorService pool = Executors.newFixedThreadPool(2);
        List<Future<Integer>> futures = new ArrayList<>();
        for (String w : words) {
            futures.add(pool.submit(() -> w.length()));
        }
        int total = 0;
        for (int i = 0; i < words.length; i++) {
            int len = futures.get(i).get();
            System.out.println(words[i] + ": " + len);
            total += len;
        }
        pool.shutdown();
        System.out.println("Total letters: " + total);
    }
}`,
    },
    {
      id: "c13t6p3", title: "Bounded buffer (capacity 2)",
      task: "<p>Extend the producer–consumer idea: a buffer that holds up to <b>2</b> items in a <code>LinkedList&lt;Integer&gt;</code>. The producer puts 1–5; the consumer takes 5 items and adds them. Print only the final sum from main (prints from both threads would interleave unpredictably).</p>",
      expected: "Consumed sum: 15",
      mustUse: ["wait()", "notifyAll()"],
      hints: ["put: <code>while (list.size() == 2) wait();</code> then add and notifyAll.", "take: <code>while (list.isEmpty()) wait();</code> then removeFirst and notifyAll."],
      solution: J`import java.util.LinkedList;

class Buffer {
    private final LinkedList<Integer> list = new LinkedList<>();
    private final int capacity = 2;

    synchronized void put(int x) throws InterruptedException {
        while (list.size() == capacity) wait();
        list.addLast(x);
        notifyAll();
    }

    synchronized int take() throws InterruptedException {
        while (list.isEmpty()) wait();
        int x = list.removeFirst();
        notifyAll();
        return x;
    }
}

public class Main {
    public static void main(String[] args) throws InterruptedException {
        Buffer buf = new Buffer();
        int[] sum = new int[1];
        Thread producer = new Thread(() -> {
            try { for (int i = 1; i <= 5; i++) buf.put(i); } catch (InterruptedException e) { }
        });
        Thread consumer = new Thread(() -> {
            try { for (int i = 0; i < 5; i++) sum[0] += buf.take(); } catch (InterruptedException e) { }
        });
        producer.start();
        consumer.start();
        producer.join();
        consumer.join();
        System.out.println("Consumed sum: " + sum[0]);
    }
}`,
    },
  ],

  fill: [
    { id: "c13t6f1", prompt: "Wait correctly for a condition.", template: "___ (queue.isEmpty()) {\n    ___();\n}", answers: [["while"], ["wait"]], explain: "Always re-check the condition in a while loop." },
    { id: "c13t6f2", prompt: "Create a pool of 4 threads and stop it at the end.", template: "ExecutorService es = Executors.___(4);\n…\nes.___();", answers: [["newFixedThreadPool"], ["shutdown"]], explain: "Without shutdown the program may not exit." },
  ],

  quiz: [
    { type: "mcq", q: "Calling wait() outside a synchronized block throws…", options: ["InterruptedException", "IllegalMonitorStateException", "NullPointerException", "nothing"], answer: 1, explain: "The thread must own the object's lock." },
    { type: "mcq", q: "Which releases the lock while waiting?", options: ["Thread.sleep()", "Object.wait()", "both", "neither"], answer: 1, explain: "sleep keeps the lock." },
    { type: "mcq", q: "Difference between Runnable and Callable?", options: ["Callable returns a value and can throw checked exceptions", "Runnable is faster", "Callable can't be used with thread pools", "none"], answer: 0, explain: "V call() throws Exception." },
    { type: "mcq", q: "What does <code>future.get()</code> do if the task isn't finished yet?", options: ["returns null", "throws", "waits until the result is ready", "cancels the task"], answer: 2, explain: "It blocks until the value is available." },
  ],
};
