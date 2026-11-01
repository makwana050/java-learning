const J = String.raw;

export default {
  title: "sleep, join, names & priority",
  summary: "The everyday Thread methods: pause with sleep(), wait for another thread with join(), name threads, set priorities, use daemon threads and interrupt.",

  concept: J`
<h2>Concept</h2>
<table>
<tr><th>Method</th><th>What it does</th></tr>
<tr><td><code>Thread.sleep(ms)</code></td><td><b>static</b>: pauses the <b>current</b> thread for at least ms milliseconds (TIMED_WAITING). Throws checked <code>InterruptedException</code>.</td></tr>
<tr><td><code>t.join()</code></td><td>the current thread waits until thread t finishes. <code>join(ms)</code> waits at most ms. Throws <code>InterruptedException</code>.</td></tr>
<tr><td><code>getName()</code> / <code>setName()</code></td><td>thread name (default "Thread-0", "Thread-1"…). Give meaningful names — they appear in logs and stack traces.</td></tr>
<tr><td><code>getPriority()</code> / <code>setPriority(1..10)</code></td><td>a <b>hint</b> to the scheduler: MIN_PRIORITY 1, NORM_PRIORITY 5 (default), MAX_PRIORITY 10. Not a guarantee of order!</td></tr>
<tr><td><code>setDaemon(true)</code></td><td>marks a background "service" thread. The JVM exits when only daemon threads remain. Must be called <b>before</b> start().</td></tr>
<tr><td><code>isAlive()</code></td><td>true after start() until run() ends.</td></tr>
<tr><td><code>t.interrupt()</code></td><td>politely asks t to stop: if t is sleeping/waiting it gets an <code>InterruptedException</code>; otherwise its interrupted flag is set (<code>isInterrupted()</code>).</td></tr>
<tr><td><code>Thread.yield()</code></td><td>hint that the current thread is willing to give up the CPU.</td></tr>
</table>

<h3>Why join() matters</h3>
<p>Without join, main may read results before the worker has finished, or print "done" while workers are still running. join() is the simplest way to say "continue only after that thread is finished".</p>

<h3>Stopping a thread properly</h3>
<p><code>stop()</code> is deprecated and dangerous. Instead, the thread should check a flag or its interrupted status and end its own run() method:</p>
<pre class="java">while (!Thread.currentThread().isInterrupted()) {
    … work …
}</pre>
<p>When catching InterruptedException, either stop the work or restore the flag with <code>Thread.currentThread().interrupt()</code> — never ignore it silently.</p>
`,

  samples: [
    {
      title: "sleep and join keep things in order",
      code: J`public class Kitchen {
    public static void main(String[] args) throws InterruptedException {
        Thread rice = new Thread(() -> {
            try {
                Thread.sleep(300);
            } catch (InterruptedException e) {
                return;
            }
            System.out.println("Rice is cooked");
        }, "rice");
        Thread dal = new Thread(() -> {
            try {
                Thread.sleep(100);
            } catch (InterruptedException e) {
                return;
            }
            System.out.println("Dal is cooked");
        }, "dal");
        rice.start();
        dal.start();
        dal.join();
        rice.join();
        System.out.println("Meal ready");
    }
}`,
      output: "Dal is cooked\nRice is cooked\nMeal ready",
      explain: "Both threads cook at the same time, so the meal is ready after about 300 ms, not 400. main joins both before announcing the meal.",
    },
    {
      title: "Names, priority, daemon, isAlive",
      code: J`public class Props {
    public static void main(String[] args) throws InterruptedException {
        Thread t = new Thread(() -> { }, "logger");
        t.setPriority(Thread.MAX_PRIORITY);
        t.setDaemon(true);
        System.out.println(t.getName() + " " + t.getPriority() + " daemon=" + t.isDaemon() + " alive=" + t.isAlive());
        t.start();
        t.join();
        System.out.println("alive after join=" + t.isAlive());
        System.out.println(Thread.MIN_PRIORITY + " " + Thread.NORM_PRIORITY + " " + Thread.MAX_PRIORITY);
    }
}`,
      output: "logger 10 daemon=true alive=false\nalive after join=false\n1 5 10",
    },
    {
      title: "Interrupting a sleeping thread",
      code: J`public class Interrupt {
    public static void main(String[] args) throws InterruptedException {
        Thread worker = new Thread(() -> {
            try {
                System.out.println("worker: sleeping for 10 seconds");
                Thread.sleep(10000);
                System.out.println("worker: woke up normally");
            } catch (InterruptedException e) {
                System.out.println("worker: interrupted, stopping early");
            }
        });
        worker.start();
        Thread.sleep(200);
        worker.interrupt();
        worker.join();
        System.out.println("main: done");
    }
}`,
      output: "worker: sleeping for 10 seconds\nworker: interrupted, stopping early\nmain: done",
    },
  ],

  practice: [
    {
      id: "c13t3p1", title: "Countdown thread",
      task: "<p>Create a thread named <code>timer</code> that prints a countdown 3, 2, 1 with <code>Thread.sleep(100)</code> between numbers and then <code>timer: Go!</code>. main must print <code>main: waiting</code> before joining and <code>main: race started</code> after.</p>",
      expected: "main: waiting\ntimer: 3\ntimer: 2\ntimer: 1\ntimer: Go!\nmain: race started",
      mustUse: ["Thread.sleep(100)", "join()", "getName()"],
      hints: ["Print \"main: waiting\" before start() so it is surely first.", "Inside run use <code>Thread.currentThread().getName()</code>."],
      solution: J`public class Main {
    public static void main(String[] args) throws InterruptedException {
        Thread timer = new Thread(() -> {
            String me = Thread.currentThread().getName();
            try {
                for (int i = 3; i >= 1; i--) {
                    System.out.println(me + ": " + i);
                    Thread.sleep(100);
                }
                System.out.println(me + ": Go!");
            } catch (InterruptedException e) {
                System.out.println(me + ": cancelled");
            }
        }, "timer");
        System.out.println("main: waiting");
        timer.start();
        timer.join();
        System.out.println("main: race started");
    }
}`,
    },
    {
      id: "c13t3p2", title: "Stop a worker with interrupt",
      task: "<p>A worker counts in a loop <code>while (!Thread.currentThread().isInterrupted())</code>, sleeping 50 ms each round. main lets it run about 300 ms, then interrupts it. When interrupted during sleep, the worker must print <code>worker stopped</code> and end. Print whether the worker counted at least 3 rounds.</p>",
      expected: "worker stopped\nCounted at least 3 rounds: true",
      mustUse: ["interrupt()", "isInterrupted()"],
      hints: ["Keep the count in a field or an int[1] array so main can read it after join().", "Catch InterruptedException inside the loop and break out."],
      solution: J`public class Main {
    public static void main(String[] args) throws InterruptedException {
        int[] rounds = new int[1];
        Thread worker = new Thread(() -> {
            while (!Thread.currentThread().isInterrupted()) {
                rounds[0]++;
                try {
                    Thread.sleep(50);
                } catch (InterruptedException e) {
                    break;
                }
            }
            System.out.println("worker stopped");
        });
        worker.start();
        Thread.sleep(300);
        worker.interrupt();
        worker.join();
        System.out.println("Counted at least 3 rounds: " + (rounds[0] >= 3));
    }
}`,
    },
  ],

  fill: [
    { id: "c13t3f1", prompt: "Pause the current thread for half a second.", template: "Thread.___(500);", answers: [["sleep"]], explain: "sleep is static and pauses the calling thread." },
    { id: "c13t3f2", prompt: "Wait until thread t has finished.", template: "t.___();", answers: [["join"]], explain: "join blocks the caller until t ends." },
  ],

  quiz: [
    { type: "mcq", q: "Inside main, <code>t.sleep(1000)</code> (t is another thread) pauses…", options: ["thread t", "the main thread", "both", "neither"], answer: 1, explain: "sleep is static — it always pauses the current thread (a classic trap)." },
    { type: "mcq", q: "setDaemon(true) must be called…", options: ["after start()", "before start()", "inside run()", "anytime"], answer: 1, explain: "Calling it on a started thread throws IllegalThreadStateException." },
    { type: "mcq", q: "Does a higher priority guarantee that a thread runs first?", options: ["Yes", "No, it's only a hint to the scheduler"], answer: 1, explain: "Behaviour depends on the OS." },
    { type: "mcq", q: "Which exception do sleep() and join() declare?", options: ["IOException", "InterruptedException", "IllegalStateException", "none"], answer: 1, explain: "A checked exception — handle or declare it." },
  ],
};
