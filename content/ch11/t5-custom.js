const J = String.raw;

export default {
  title: "Custom exceptions",
  summary: "Create your own exception classes that describe problems in your program's language — checked or unchecked — and use them in a small real-world system.",

  concept: J`
<h2>Concept</h2>
<p>Built-in exceptions describe technical problems. Your program has its own business rules — "insufficient balance", "seat already booked", "invalid roll number". A <b>custom exception</b> names these problems clearly.</p>

<h3>Creating one</h3>
<pre class="java">// checked: extends Exception → callers must handle or declare it
class InsufficientBalanceException extends Exception {
    private final double shortBy;

    public InsufficientBalanceException(String message, double shortBy) {
        super(message);              // pass the message to Throwable
        this.shortBy = shortBy;
    }

    public double getShortBy() { return shortBy; }
}

// unchecked: extends RuntimeException → no forced handling
class InvalidRollNumberException extends RuntimeException {
    public InvalidRollNumberException(String message) { super(message); }
}</pre>
<ul>
<li>Name it ending in <b>Exception</b>.</li>
<li>Call <code>super(message)</code> so <code>getMessage()</code> works. Add a <code>(String message, Throwable cause)</code> constructor if you wrap other exceptions.</li>
<li>You can add fields (like <code>shortBy</code>) that carry extra information for the handler.</li>
</ul>

<h3>Checked or unchecked?</h3>
<table>
<tr><th>Extend…</th><th>When</th></tr>
<tr><td><code>Exception</code> (checked)</td><td>the caller can reasonably recover and you want the compiler to remind them (payment failed, file missing)</td></tr>
<tr><td><code>RuntimeException</code> (unchecked)</td><td>it signals a programming mistake or invalid argument the caller should have avoided</td></tr>
</table>

<h3>Using it</h3>
<pre class="java">void withdraw(double amt) throws InsufficientBalanceException {
    if (amt &gt; balance)
        throw new InsufficientBalanceException("Balance too low", amt - balance);
    balance -= amt;
}

try {
    acc.withdraw(9000);
} catch (InsufficientBalanceException e) {
    System.out.println(e.getMessage() + ", short by " + e.getShortBy());
}</pre>

<h3>Exception hierarchies</h3>
<p>Group related exceptions under a common parent (<code>BankException</code> → <code>InsufficientBalanceException</code>, <code>AccountFrozenException</code>). Callers can catch the specific child or the whole family with the parent.</p>
`,

  samples: [
    {
      title: "Checked custom exception with extra data",
      code: J`class InsufficientBalanceException extends Exception {
    private final double shortBy;

    InsufficientBalanceException(String message, double shortBy) {
        super(message);
        this.shortBy = shortBy;
    }

    double getShortBy() { return shortBy; }
}

class Wallet {
    private double balance;
    Wallet(double balance) { this.balance = balance; }

    void pay(double amount) throws InsufficientBalanceException {
        if (amount > balance) {
            throw new InsufficientBalanceException("Payment of " + amount + " declined", amount - balance);
        }
        balance -= amount;
        System.out.println("Paid " + amount + ", left " + balance);
    }
}

public class Main {
    public static void main(String[] args) {
        Wallet w = new Wallet(1000);
        double[] bills = {400, 900};
        for (double b : bills) {
            try {
                w.pay(b);
            } catch (InsufficientBalanceException e) {
                System.out.println(e.getMessage() + " (short by " + e.getShortBy() + ")");
            }
        }
    }
}`,
      output: "Paid 400.0, left 600.0\nPayment of 900.0 declined (short by 300.0)",
    },
    {
      title: "A family of exceptions",
      code: J`class BookingException extends Exception {
    BookingException(String m) { super(m); }
}
class SeatTakenException extends BookingException {
    SeatTakenException(int seat) { super("Seat " + seat + " is already booked"); }
}
class InvalidSeatException extends BookingException {
    InvalidSeatException(int seat) { super("Seat " + seat + " does not exist"); }
}

class Theatre {
    boolean[] booked = new boolean[10];

    void book(int seat) throws BookingException {
        if (seat < 1 || seat > booked.length) throw new InvalidSeatException(seat);
        if (booked[seat - 1]) throw new SeatTakenException(seat);
        booked[seat - 1] = true;
        System.out.println("Booked seat " + seat);
    }
}

public class Main {
    public static void main(String[] args) {
        Theatre t = new Theatre();
        int[] requests = {4, 4, 15};
        for (int s : requests) {
            try {
                t.book(s);
            } catch (SeatTakenException e) {
                System.out.println("Sorry: " + e.getMessage());
            } catch (BookingException e) {
                System.out.println("Error: " + e.getMessage());
            }
        }
    }
}`,
      output: "Booked seat 4\nSorry: Seat 4 is already booked\nError: Seat 15 does not exist",
    },
  ],

  practice: [
    {
      id: "c11t5p1", title: "Age validation exception",
      task: "<p>Create an <b>unchecked</b> <code>InvalidAgeException</code>. Method <code>static void register(String name, int age)</code> throws it when age is below 18 or above 65 (messages as shown), else prints a confirmation.</p>",
      expected: "Registered Mira (24)\nInvalidAgeException: Tarun is too young (16)\nInvalidAgeException: Hari is above the limit (70)",
      mustUse: ["class InvalidAgeException extends RuntimeException", "super(message)"],
      hints: ["Print with <code>e.getClass().getSimpleName() + \": \" + e.getMessage()</code>."],
      solution: J`class InvalidAgeException extends RuntimeException {
    InvalidAgeException(String message) {
        super(message);
    }
}

public class Main {
    static void register(String name, int age) {
        if (age < 18) throw new InvalidAgeException(name + " is too young (" + age + ")");
        if (age > 65) throw new InvalidAgeException(name + " is above the limit (" + age + ")");
        System.out.println("Registered " + name + " (" + age + ")");
    }

    public static void main(String[] args) {
        String[] names = {"Mira", "Tarun", "Hari"};
        int[] ages = {24, 16, 70};
        for (int i = 0; i < names.length; i++) {
            try {
                register(names[i], ages[i]);
            } catch (InvalidAgeException e) {
                System.out.println(e.getClass().getSimpleName() + ": " + e.getMessage());
            }
        }
    }
}`,
    },
    {
      id: "c11t5p2", title: "Library system",
      task: "<p>Create checked exceptions <code>BookNotFoundException</code> and <code>BookAlreadyIssuedException</code>, both extending <code>LibraryException</code>. Class <code>Library</code> has books {\"Java\", \"DBMS\", \"OS\"} and <code>issue(String title)</code>. Process requests: Java, DBMS, Java, Networks.</p>",
      expected: "Issued: Java\nIssued: DBMS\nAlready issued: Java\nNot found: Networks\nIssued count: 2",
      mustUse: ["extends LibraryException", "throws LibraryException"],
      hints: ["Keep a boolean[] issued parallel to the titles array.", "Catch the two specific exceptions to print different prefixes."],
      solution: J`class LibraryException extends Exception {
    LibraryException(String m) { super(m); }
}
class BookNotFoundException extends LibraryException {
    BookNotFoundException(String t) { super(t); }
}
class BookAlreadyIssuedException extends LibraryException {
    BookAlreadyIssuedException(String t) { super(t); }
}

class Library {
    private String[] titles = {"Java", "DBMS", "OS"};
    private boolean[] issued = new boolean[titles.length];
    private int count = 0;

    void issue(String title) throws LibraryException {
        for (int i = 0; i < titles.length; i++) {
            if (titles[i].equals(title)) {
                if (issued[i]) throw new BookAlreadyIssuedException(title);
                issued[i] = true;
                count++;
                System.out.println("Issued: " + title);
                return;
            }
        }
        throw new BookNotFoundException(title);
    }

    int getCount() { return count; }
}

public class Main {
    public static void main(String[] args) {
        Library lib = new Library();
        String[] requests = {"Java", "DBMS", "Java", "Networks"};
        for (String r : requests) {
            try {
                lib.issue(r);
            } catch (BookAlreadyIssuedException e) {
                System.out.println("Already issued: " + e.getMessage());
            } catch (BookNotFoundException e) {
                System.out.println("Not found: " + e.getMessage());
            } catch (LibraryException e) {
                System.out.println("Library error: " + e.getMessage());
            }
        }
        System.out.println("Issued count: " + lib.getCount());
    }
}`,
    },
  ],

  fill: [
    { id: "c11t5f1", prompt: "Make a checked custom exception.", template: "class PaymentFailedException ___ ___ { }", answers: [["extends"], ["Exception"]], explain: "Extend Exception for checked, RuntimeException for unchecked." },
    { id: "c11t5f2", prompt: "Pass the message to the parent.", template: "PaymentFailedException(String msg) { ___(msg); }", answers: [["super"]], explain: "So getMessage() returns it." },
  ],

  quiz: [
    { type: "mcq", q: "A custom exception that extends RuntimeException is…", options: ["checked", "unchecked", "an Error", "not allowed"], answer: 1, explain: "Anything under RuntimeException is unchecked." },
    { type: "mcq", q: "Why call super(message) in a custom exception constructor?", options: ["required to compile", "so getMessage() returns the message", "to make it checked", "to print the stack trace"], answer: 1, explain: "Throwable stores the message." },
    { type: "mcq", q: "Catch blocks for SeatTakenException (child) and BookingException (parent) must be ordered…", options: ["parent first", "child first", "any order", "only one is allowed"], answer: 1, explain: "Child before parent." },
  ],
};
