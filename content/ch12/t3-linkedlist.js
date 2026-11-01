const J = String.raw;

export default {
  title: "LinkedList & build your own",
  summary: "Understand how a linked list works inside by building one with nodes, then use Java's LinkedList as a list, queue and stack.",

  concept: J`
<h2>Concept</h2>
<h3>How a linked list works</h3>
<p>Instead of one block of memory (like an array), a <b>linked list</b> is a chain of <b>nodes</b>. Each node holds a value and a reference to the next node. The list remembers the first node (the <b>head</b>).</p>
<pre>head
 │
 ▼
[10|•]──►[20|•]──►[30|•]──►null</pre>
<pre class="java">class Node {
    int data;
    Node next;
    Node(int data) { this.data = data; }
}</pre>
<ul>
<li><b>Add at front:</b> new node points to old head; head = new node. Instant.</li>
<li><b>Add at end:</b> walk to the last node (or keep a <b>tail</b> reference) and link it.</li>
<li><b>Remove:</b> make the previous node skip the removed one: <code>prev.next = prev.next.next</code>.</li>
<li><b>Get the i-th element:</b> walk i steps from the head — slow for large i.</li>
</ul>
<p>A <b>doubly linked list</b> also stores a <code>prev</code> reference in each node, so it can be walked both ways. Java's <code>LinkedList</code> is doubly linked.</p>

<h3>ArrayList vs LinkedList</h3>
<table>
<tr><th>Operation</th><th>ArrayList</th><th>LinkedList</th></tr>
<tr><td>get(i) / set(i)</td><td><b>fast</b> O(1)</td><td>slow O(n)</td></tr>
<tr><td>add/remove at the ends</td><td>fast at end, slow at start</td><td><b>fast</b> at both ends</td></tr>
<tr><td>add/remove in the middle</td><td>slow (shift)</td><td>fast once you are there (relinking), but finding the spot is O(n)</td></tr>
<tr><td>Memory</td><td>compact</td><td>extra references per node</td></tr>
</table>
<p>In practice ArrayList is the default choice. Use LinkedList (or better, <code>ArrayDeque</code>) when you mostly add/remove at the ends.</p>

<h3>Java's LinkedList as a List, Queue and Stack</h3>
<table>
<tr><th>Use</th><th>Methods</th></tr>
<tr><td>List</td><td><code>add, get, set, remove, size</code> (all the List methods)</td></tr>
<tr><td>Both ends</td><td><code>addFirst, addLast, getFirst, getLast, removeFirst, removeLast</code></td></tr>
<tr><td>Queue (FIFO)</td><td><code>offer(e)</code> add at end, <code>poll()</code> remove from front (null if empty), <code>peek()</code> look at front</td></tr>
<tr><td>Stack (LIFO)</td><td><code>push(e)</code> add at front, <code>pop()</code> remove from front, <code>peek()</code></td></tr>
</table>
`,

  samples: [
    {
      title: "A hand-made singly linked list",
      code: J`class Node {
    int data;
    Node next;
    Node(int data) { this.data = data; }
}

class MyLinkedList {
    private Node head;
    private int size;

    void addFirst(int value) {
        Node n = new Node(value);
        n.next = head;
        head = n;
        size++;
    }

    void addLast(int value) {
        Node n = new Node(value);
        if (head == null) {
            head = n;
        } else {
            Node cur = head;
            while (cur.next != null) cur = cur.next;
            cur.next = n;
        }
        size++;
    }

    boolean remove(int value) {
        if (head == null) return false;
        if (head.data == value) {
            head = head.next;
            size--;
            return true;
        }
        Node cur = head;
        while (cur.next != null && cur.next.data != value) cur = cur.next;
        if (cur.next == null) return false;
        cur.next = cur.next.next;
        size--;
        return true;
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        for (Node cur = head; cur != null; cur = cur.next) sb.append(cur.data).append(" -> ");
        return sb.append("null").toString();
    }

    int size() { return size; }
}

public class Main {
    public static void main(String[] args) {
        MyLinkedList list = new MyLinkedList();
        list.addLast(20);
        list.addLast(30);
        list.addFirst(10);
        list.addLast(40);
        System.out.println(list + " (size " + list.size() + ")");
        list.remove(30);
        list.remove(10);
        System.out.println(list + " (size " + list.size() + ")");
    }
}`,
      output: "10 -> 20 -> 30 -> 40 -> null (size 4)\n20 -> 40 -> null (size 2)",
    },
    {
      title: "java.util.LinkedList as queue and stack",
      code: J`import java.util.LinkedList;

public class Main {
    public static void main(String[] args) {
        LinkedList<String> queue = new LinkedList<>();
        queue.offer("Token 1");
        queue.offer("Token 2");
        queue.offer("Token 3");
        System.out.println("Serving " + queue.poll() + ", next " + queue.peek());

        LinkedList<String> stack = new LinkedList<>();
        stack.push("page1");
        stack.push("page2");
        stack.push("page3");
        System.out.println("Back from " + stack.pop() + " to " + stack.peek());

        LinkedList<Integer> deque = new LinkedList<>();
        deque.addFirst(2);
        deque.addFirst(1);
        deque.addLast(3);
        System.out.println(deque + " first " + deque.getFirst() + " last " + deque.getLast());
    }
}`,
      output: "Serving Token 1, next Token 2\nBack from page3 to page2\n[1, 2, 3] first 1 last 3",
    },
  ],

  practice: [
    {
      id: "c12t3p1", title: "Extend the linked list",
      task: "<p>Using the <code>Node</code>/<code>MyLinkedList</code> idea from the example, implement <code>addLast</code>, <code>contains(int)</code>, <code>get(int index)</code> (throw <code>IndexOutOfBoundsException</code> for bad indexes) and <code>toString</code>. Test as in the expected output.</p>",
      starter: J`class Node {
    int data;
    Node next;
    Node(int data) { this.data = data; }
}

class MyLinkedList {
    private Node head;
    private int size;

    // addLast, contains, get, toString
}

public class Main {
    public static void main(String[] args) {
        MyLinkedList l = new MyLinkedList();
        l.addLast(5);
        l.addLast(15);
        l.addLast(25);
        System.out.println(l);
        System.out.println(l.contains(15) + " " + l.contains(99));
        System.out.println(l.get(2));
        try {
            l.get(7);
        } catch (IndexOutOfBoundsException e) {
            System.out.println("Bad index: " + e.getMessage());
        }
    }
}`,
      expected: "[5, 15, 25]\ntrue false\n25\nBad index: 7",
      mustUse: ["Node next", "IndexOutOfBoundsException"],
      hints: ["get: walk index steps from head: <code>Node cur = head; for (int i = 0; i < index; i++) cur = cur.next;</code>", "Throw with <code>throw new IndexOutOfBoundsException(\"\" + index);</code> when index < 0 or index >= size."],
      solution: J`class Node {
    int data;
    Node next;
    Node(int data) { this.data = data; }
}

class MyLinkedList {
    private Node head;
    private int size;

    void addLast(int value) {
        Node n = new Node(value);
        if (head == null) {
            head = n;
        } else {
            Node cur = head;
            while (cur.next != null) cur = cur.next;
            cur.next = n;
        }
        size++;
    }

    boolean contains(int value) {
        for (Node cur = head; cur != null; cur = cur.next) {
            if (cur.data == value) return true;
        }
        return false;
    }

    int get(int index) {
        if (index < 0 || index >= size) throw new IndexOutOfBoundsException("" + index);
        Node cur = head;
        for (int i = 0; i < index; i++) cur = cur.next;
        return cur.data;
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder("[");
        for (Node cur = head; cur != null; cur = cur.next) {
            sb.append(cur.data);
            if (cur.next != null) sb.append(", ");
        }
        return sb.append("]").toString();
    }
}

public class Main {
    public static void main(String[] args) {
        MyLinkedList l = new MyLinkedList();
        l.addLast(5);
        l.addLast(15);
        l.addLast(25);
        System.out.println(l);
        System.out.println(l.contains(15) + " " + l.contains(99));
        System.out.println(l.get(2));
        try {
            l.get(7);
        } catch (IndexOutOfBoundsException e) {
            System.out.println("Bad index: " + e.getMessage());
        }
    }
}`,
    },
    {
      id: "c12t3p2", title: "Reverse a linked list",
      task: "<p>Add a method <code>void reverse()</code> to your list that reverses the links <b>in place</b> (no new nodes, no arrays). Build 1→2→3→4 and reverse it.</p>",
      expected: "Before: 1 2 3 4\nAfter: 4 3 2 1",
      mustUse: ["void reverse()"],
      hints: ["Three references: prev = null, cur = head, next.", "Loop: next = cur.next; cur.next = prev; prev = cur; cur = next. At the end head = prev."],
      solution: J`class Node {
    int data;
    Node next;
    Node(int data) { this.data = data; }
}

class MyLinkedList {
    Node head;

    void addLast(int v) {
        Node n = new Node(v);
        if (head == null) { head = n; return; }
        Node cur = head;
        while (cur.next != null) cur = cur.next;
        cur.next = n;
    }

    void reverse() {
        Node prev = null, cur = head;
        while (cur != null) {
            Node next = cur.next;
            cur.next = prev;
            prev = cur;
            cur = next;
        }
        head = prev;
    }

    String show() {
        StringBuilder sb = new StringBuilder();
        for (Node c = head; c != null; c = c.next) sb.append(c.data).append(" ");
        return sb.toString().trim();
    }
}

public class Main {
    public static void main(String[] args) {
        MyLinkedList l = new MyLinkedList();
        for (int i = 1; i <= 4; i++) l.addLast(i);
        System.out.println("Before: " + l.show());
        l.reverse();
        System.out.println("After: " + l.show());
    }
}`,
    },
    {
      id: "c12t3p3", title: "Balanced brackets with a stack",
      task: "<p>Use a <code>LinkedList&lt;Character&gt;</code> as a stack (push/pop) to check whether brackets are balanced in each expression.</p>",
      expected: "{[()]} -> balanced\n([)] -> not balanced\n((a+b)*c -> not balanced",
      mustUse: ["push", "pop"],
      hints: ["Push every opening bracket. On a closing bracket, the stack must not be empty and pop() must be the matching opener.", "At the end the stack must be empty."],
      solution: J`import java.util.LinkedList;

public class Main {
    static boolean balanced(String s) {
        LinkedList<Character> stack = new LinkedList<>();
        for (char c : s.toCharArray()) {
            if (c == '(' || c == '[' || c == '{') {
                stack.push(c);
            } else if (c == ')' || c == ']' || c == '}') {
                if (stack.isEmpty()) return false;
                char open = stack.pop();
                if ((c == ')' && open != '(') || (c == ']' && open != '[') || (c == '}' && open != '{')) return false;
            }
        }
        return stack.isEmpty();
    }

    public static void main(String[] args) {
        String[] tests = {"{[()]}", "([)]", "((a+b)*c"};
        for (String t : tests) System.out.println(t + " -> " + (balanced(t) ? "balanced" : "not balanced"));
    }
}`,
    },
  ],

  fill: [
    { id: "c12t3f1", prompt: "Queue methods: add at the end and remove from the front.", template: "q.___(\"next\");\nString first = q.___();", answers: [["offer", "add", "addLast"], ["poll", "remove", "removeFirst"]], explain: "offer/poll are the queue-style names." },
    { id: "c12t3f2", prompt: "A node of a singly linked list stores data and…", template: "Node ___;", answers: [["next"]], explain: "A reference to the next node." },
  ],

  quiz: [
    { type: "mcq", q: "Which is faster in a LinkedList than an ArrayList?", options: ["get(500)", "addFirst(x)", "set(10, x)", "memory use"], answer: 1, explain: "Adding at the head is just relinking." },
    { type: "output", q: "Predict the output.", code: J`import java.util.*;
public class Q {
    public static void main(String[] args) {
        LinkedList<Integer> s = new LinkedList<>();
        s.push(1); s.push(2); s.push(3);
        s.pop();
        s.offer(9);
        System.out.println(s);
    }
}`, answer: "[2, 1, 9]", explain: "push/pop work at the front; offer adds at the end." },
    { type: "mcq", q: "Java's LinkedList is…", options: ["singly linked", "doubly linked", "array based", "a tree"], answer: 1, explain: "Each node has next and prev." },
  ],
};
