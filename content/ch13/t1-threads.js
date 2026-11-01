const J = String.raw;

export default {
  title: "Threads & the thread life cycle",
  summary: "What a thread is, why programs use several of them, the main thread, and the states a thread passes through from birth to death.",

  concept: J`
<h2>Concept</h2>
<h3>Process vs thread</h3>
<ul>
<li>A <b>process</b> is a running program with its own memory (your browser, your IDE, a running Java program).</li>
<li>A <b>thread</b> is a single path of execution <b>inside</b> a process. A process can have many threads, which <b>share the same heap memory</b> (objects) but each has its <b>own stack</b> (local variables and method calls).</li>
</ul>
<p><b>Multithreading</b> = running several threads at the same time within one program. On a multi-core CPU they can truly run in parallel; on one core the OS switches between them very quickly.</p>

<h3>Why use threads?</h3>
<table>
<tr><th>Benefit</th><th>Example</th></tr>
<tr><td>Responsiveness</td><td>A UI stays usable while a file downloads in the background.</td></tr>
<tr><td>Speed on multi-core CPUs</td><td>Process 4 parts of a large image at once.</td></tr>
<tr><td>Doing work while waiting</td><td>A web server handles other users while one waits for the database.</td></tr>
</table>
<p>The cost: threads that share data must be coordinated, or you get wrong results (race conditions) or programs that freeze (deadlocks). You'll learn to handle both.</p>

<h3>The main thread</h3>
<p>Every Java program starts with one thread, named <code>main</code>, which runs <code>main()</code>. The JVM also runs background threads (e.g. the garbage collector). <code>Thread.currentThread()</code> returns the thread executing the current code.</p>

<h3>Thread life cycle (states)</h3>
<p><code>Thread.State</code> has six values:</p>
<table>
<tr><th>State</th><th>Meaning</th><th>Gets there by</th></tr>
<tr><td><code>NEW</code></td><td>created but not started</td><td><code>new Thread(…)</code></td></tr>
<tr><td><code>RUNNABLE</code></td><td>running, or ready and waiting for the CPU</td><td><code>start()</code></td></tr>
<tr><td><code>BLOCKED</code></td><td>waiting to enter a synchronized block held by another thread</td><td>lock contention</td></tr>
<tr><td><code>WAITING</code></td><td>waiting indefinitely for another thread</td><td><code>join()</code>, <code>wait()</code></td></tr>
<tr><td><code>TIMED_WAITING</code></td><td>waiting for a set time</td><td><code>sleep(ms)</code>, <code>join(ms)</code>, <code>wait(ms)</code></td></tr>
<tr><td><code>TERMINATED</code></td><td>finished (run() ended or threw)</td><td>end of <code>run()</code></td></tr>
</table>
<pre>NEW ──start()──► RUNNABLE ──run() ends──► TERMINATED
                  ▲   │
     notify/time  │   │ sleep / wait / join / lock busy
     up/lock free │   ▼
          BLOCKED / WAITING / TIMED_WAITING</pre>
<div class="warn">A thread can be started only <b>once</b>. Calling <code>start()</code> again → <code>IllegalThreadStateException</code>.</div>

<h3>Scheduling is not under your control</h3>
<p>Which thread runs when is decided by the JVM and operating system. If two threads print at the same time, the order can change from run to run. That's why the examples on this site use <code>join()</code> to wait for threads, so their output is predictable.</p>
`,

  samples: [
    {
      title: "The main thread",
      code: J`public class MainThread {
    public static void main(String[] args) {
        Thread t = Thread.currentThread();
        System.out.println("Name: " + t.getName());
        System.out.println("Priority: " + t.getPriority());
        t.setName("boss");
        System.out.println("Renamed: " + Thread.currentThread().getName());
    }
}`,
      output: "Name: main\nPriority: 5\nRenamed: boss",
    },
    {
      title: "Watching the states",
      code: J`public class States {
    public static void main(String[] args) throws InterruptedException {
        Thread worker = new Thread(() -> {
            int sum = 0;
            for (int i = 1; i <= 1000; i++) sum += i;
            System.out.println("worker computed " + sum);
        });
        System.out.println("Before start: " + worker.getState());
        worker.start();
        worker.join();
        System.out.println("After join: " + worker.getState());
        try {
            worker.start();
        } catch (IllegalThreadStateException e) {
            System.out.println("Cannot start a thread twice");
        }
    }
}`,
      output: "Before start: NEW\nworker computed 500500\nAfter join: TERMINATED\nCannot start a thread twice",
    },
  ],

  practice: [
    {
      id: "c13t1p1", title: "Your first extra thread",
      task: "<p>Create a thread (with a lambda) that prints <code>Hello from worker</code>. Start it, wait for it with <code>join()</code>, then print <code>Back in main</code>. Also print the worker's state before start and after join.</p>",
      expected: "State: NEW\nHello from worker\nBack in main\nState: TERMINATED",
      mustUse: ["start()", "join()", "getState()"],
      hints: ["<code>Thread w = new Thread(() -> System.out.println(\"Hello from worker\"));</code>", "main needs <code>throws InterruptedException</code> because join() can throw it."],
      solution: J`public class Main {
    public static void main(String[] args) throws InterruptedException {
        Thread w = new Thread(() -> System.out.println("Hello from worker"));
        System.out.println("State: " + w.getState());
        w.start();
        w.join();
        System.out.println("Back in main");
        System.out.println("State: " + w.getState());
    }
}`,
    },
  ],

  fill: [
    { id: "c13t1f1", prompt: "Get the thread that is running this code.", template: "Thread t = Thread.___();", answers: [["currentThread"]], explain: "A static method of Thread." },
    { id: "c13t1f2", prompt: "State of a thread right after new Thread(...)?", template: "___", answers: [["NEW"]], explain: "It becomes RUNNABLE after start()." },
  ],

  quiz: [
    { type: "mcq", q: "What do threads of the same process share?", options: ["stack", "heap (objects)", "local variables", "program counter"], answer: 1, explain: "Each thread has its own stack; all share the heap." },
    { type: "mcq", q: "A thread calling <code>Thread.sleep(500)</code> is in state…", options: ["BLOCKED", "WAITING", "TIMED_WAITING", "TERMINATED"], answer: 2, explain: "Waiting for a fixed time." },
    { type: "mcq", q: "What happens if you call start() twice on the same Thread?", options: ["it runs twice", "nothing", "IllegalThreadStateException", "compile error"], answer: 2, explain: "A thread can't be restarted." },
    { type: "mcq", q: "Default priority of the main thread?", options: ["1", "5", "10", "0"], answer: 1, explain: "NORM_PRIORITY = 5." },
  ],
};
