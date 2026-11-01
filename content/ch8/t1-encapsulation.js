const J = String.raw;

export default {
  title: "Encapsulation",
  summary: "Hide an object's data behind private fields and let the outside world change it only through methods that check the rules.",

  concept: J`
<h2>Concept</h2>
<p><b>Encapsulation</b> means bundling data with the methods that work on it, and <b>hiding the data</b> from direct outside access. The class controls how its state can change, so objects can never be put into an invalid state.</p>

<h3>The problem it solves</h3>
<pre class="java">class Account { double balance; }
Account a = new Account();
a.balance = -50000;     // nothing stops this!</pre>

<h3>The recipe</h3>
<ol>
<li>Make fields <code>private</code> — only code inside the class can touch them.</li>
<li>Provide <code>public</code> <b>getter</b> methods to read values.</li>
<li>Provide <code>public</code> <b>setter</b> methods (or other meaningful methods like <code>deposit</code>) that <b>validate</b> before changing values.</li>
</ol>
<pre class="java">class Account {
    private double balance;

    public double getBalance() {          // getter
        return balance;
    }

    public void deposit(double amount) {  // controlled change
        if (amount &lt;= 0) {
            System.out.println("Invalid amount");
            return;
        }
        balance += amount;
    }
}</pre>
<p>Now <code>a.balance = -50000;</code> → <code>error: balance has private access in Account</code>.</p>

<h3>Naming conventions (JavaBeans)</h3>
<table>
<tr><th>Field</th><th>Getter</th><th>Setter</th></tr>
<tr><td><code>private String name</code></td><td><code>getName()</code></td><td><code>setName(String name)</code></td></tr>
<tr><td><code>private int age</code></td><td><code>getAge()</code></td><td><code>setAge(int age)</code></td></tr>
<tr><td><code>private boolean active</code></td><td><code>isActive()</code></td><td><code>setActive(boolean active)</code></td></tr>
</table>

<h3>Read-only and write-only</h3>
<ul>
<li><b>Read-only</b> property: a getter but no setter (e.g. an account number set once in the constructor).</li>
<li><b>Write-only</b>: a setter but no getter (e.g. a password: you can set it, not read it back).</li>
</ul>

<h3>Benefits</h3>
<ul>
<li><b>Validation</b> — invalid data is rejected in one place.</li>
<li><b>Flexibility</b> — you can change how data is stored (e.g. store paise instead of rupees) without breaking code that uses the class.</li>
<li><b>Data hiding / security</b> — internal details stay private.</li>
<li><b>Easier debugging</b> — every change goes through known methods.</li>
</ul>

<h3>Watch out: leaking mutable objects</h3>
<p>If a getter returns a private <b>array</b> or other mutable object, the caller can modify its contents. Return a copy: <code>return marks.clone();</code></p>
`,

  samples: [
    {
      title: "Validated setters",
      code: J`class Student {
    private String name;
    private int age;
    private double cgpa;

    public String getName() { return name; }
    public int getAge() { return age; }
    public double getCgpa() { return cgpa; }

    public void setName(String name) {
        if (name == null || name.trim().isEmpty()) {
            System.out.println("Name cannot be empty");
            return;
        }
        this.name = name.trim();
    }

    public void setAge(int age) {
        if (age < 16 || age > 60) {
            System.out.println("Invalid age: " + age);
            return;
        }
        this.age = age;
    }

    public void setCgpa(double cgpa) {
        if (cgpa < 0 || cgpa > 10) {
            System.out.println("Invalid CGPA: " + cgpa);
            return;
        }
        this.cgpa = cgpa;
    }
}

public class Main {
    public static void main(String[] args) {
        Student s = new Student();
        s.setName("  Divya ");
        s.setAge(150);
        s.setAge(20);
        s.setCgpa(11.5);
        s.setCgpa(8.9);
        System.out.println(s.getName() + ", " + s.getAge() + ", " + s.getCgpa());
    }
}`,
      output: "Invalid age: 150\nInvalid CGPA: 11.5\nDivya, 20, 8.9",
    },
    {
      title: "Defensive copy of an array",
      code: J`import java.util.Arrays;

class Marks {
    private int[] scores = {70, 80, 90};

    public int[] leakyGet() { return scores; }
    public int[] safeGet() { return scores.clone(); }
    public String show() { return Arrays.toString(scores); }
}

public class Main {
    public static void main(String[] args) {
        Marks m = new Marks();
        m.safeGet()[0] = 0;
        System.out.println(m.show());
        m.leakyGet()[0] = 0;
        System.out.println(m.show());
    }
}`,
      output: "[70, 80, 90]\n[0, 80, 90]",
    },
  ],

  practice: [
    {
      id: "c8t1p1", title: "Encapsulated bank account",
      task: "<p>Write class <code>BankAccount</code> with <b>private</b> fields <code>accountNo</code> (read-only, set in the constructor), <code>holder</code>, <code>balance</code>. Methods: <code>deposit</code> (amount must be &gt; 0), <code>withdraw</code> (not more than balance; keep a minimum of ₹500), getters. Run the scenario in the starter.</p>",
      starter: J`class BankAccount {
    // private fields, constructor, getters, deposit, withdraw
}

public class Main {
    public static void main(String[] args) {
        BankAccount acc = new BankAccount("SB1024", "Farhan", 1000);
        acc.deposit(-200);
        acc.deposit(3000);
        acc.withdraw(3600);
        acc.withdraw(2000);
        System.out.println(acc.getAccountNo() + " " + acc.getHolder() + " " + acc.getBalance());
    }
}`,
      expected: "Deposit must be positive\nDeposited 3000.0\nCannot withdraw 3600.0: minimum balance is 500\nWithdrew 2000.0\nSB1024 Farhan 2000.0",
      mustUse: ["private double balance", "private String accountNo", "public double getBalance()"],
      hints: ["withdraw: <code>if (balance - amount < 500) { message; return; }</code>", "No setter for accountNo — it is read-only."],
      solution: J`class BankAccount {
    private String accountNo;
    private String holder;
    private double balance;

    public BankAccount(String accountNo, String holder, double opening) {
        this.accountNo = accountNo;
        this.holder = holder;
        this.balance = opening;
    }

    public String getAccountNo() { return accountNo; }
    public String getHolder() { return holder; }
    public double getBalance() { return balance; }

    public void deposit(double amount) {
        if (amount <= 0) {
            System.out.println("Deposit must be positive");
            return;
        }
        balance += amount;
        System.out.println("Deposited " + amount);
    }

    public void withdraw(double amount) {
        if (balance - amount < 500) {
            System.out.println("Cannot withdraw " + amount + ": minimum balance is 500");
            return;
        }
        balance -= amount;
        System.out.println("Withdrew " + amount);
    }
}

public class Main {
    public static void main(String[] args) {
        BankAccount acc = new BankAccount("SB1024", "Farhan", 1000);
        acc.deposit(-200);
        acc.deposit(3000);
        acc.withdraw(3600);
        acc.withdraw(2000);
        System.out.println(acc.getAccountNo() + " " + acc.getHolder() + " " + acc.getBalance());
    }
}`,
    },
    {
      id: "c8t1p2", title: "Temperature with hidden storage",
      task: "<p>Class <code>Temperature</code> stores the value <b>privately in Kelvin</b>. Provide <code>setCelsius</code>, <code>getCelsius</code>, <code>getFahrenheit</code>. Reject temperatures below absolute zero (−273.15 °C). Set 25 °C, try −300 °C, then print.</p>",
      expected: "Below absolute zero!\n25.0 C = 77.0 F",
      mustUse: ["private double kelvin"],
      hints: ["kelvin = c + 273.15; celsius = kelvin − 273.15; F = C × 9 / 5 + 32.", "Round with Math.round(x * 100) / 100.0 to avoid floating-point noise."],
      solution: J`class Temperature {
    private double kelvin;

    public void setCelsius(double c) {
        if (c < -273.15) {
            System.out.println("Below absolute zero!");
            return;
        }
        kelvin = c + 273.15;
    }

    public double getCelsius() {
        return Math.round((kelvin - 273.15) * 100) / 100.0;
    }

    public double getFahrenheit() {
        return Math.round((getCelsius() * 9 / 5 + 32) * 100) / 100.0;
    }
}

public class Main {
    public static void main(String[] args) {
        Temperature t = new Temperature();
        t.setCelsius(25);
        t.setCelsius(-300);
        System.out.println(t.getCelsius() + " C = " + t.getFahrenheit() + " F");
    }
}`,
      explain: "Users of the class never know it stores Kelvin. You could change the storage to Fahrenheit tomorrow without changing Main at all — that's the flexibility encapsulation gives.",
    },
    {
      id: "c8t1p3", title: "Password: write-only",
      task: "<p>Class <code>User</code> has private <code>username</code> and <code>password</code>. There's a setter for the password (at least 8 characters, must contain a digit) but <b>no getter</b>. Instead provide <code>boolean login(String attempt)</code>.</p>",
      expected: "Password too weak\nPassword set\nLogin with wrong: false\nLogin with right: true",
      mustUse: ["private String password", "boolean login(String attempt)"],
      hints: ["Check for a digit with a loop and Character.isDigit, or <code>pwd.matches(\".*\\\\d.*\")</code>."],
      solution: J`class User {
    private String username;
    private String password;

    public User(String username) {
        this.username = username;
    }

    public void setPassword(String pwd) {
        boolean hasDigit = false;
        for (char c : pwd.toCharArray()) if (Character.isDigit(c)) hasDigit = true;
        if (pwd.length() < 8 || !hasDigit) {
            System.out.println("Password too weak");
            return;
        }
        password = pwd;
        System.out.println("Password set");
    }

    public boolean login(String attempt) {
        return password != null && password.equals(attempt);
    }
}

public class Main {
    public static void main(String[] args) {
        User u = new User("tanvi");
        u.setPassword("hello");
        u.setPassword("hello2026");
        System.out.println("Login with wrong: " + u.login("hello"));
        System.out.println("Login with right: " + u.login("hello2026"));
    }
}`,
    },
  ],

  fill: [
    { id: "c8t1f1", prompt: "Hide the field and expose a getter.", template: "___ int stock;\npublic int ___() { return stock; }", answers: [["private"], ["getStock"]], explain: "private field + public getter named getX." },
    { id: "c8t1f2", prompt: "Getter name for a boolean field 'available'.", template: "public boolean ___()", answers: [["isAvailable"]], explain: "Boolean getters usually start with is." },
  ],

  quiz: [
    { type: "mcq", q: "Encapsulation is mainly achieved by…", options: ["static methods", "private fields with public methods", "inheritance", "interfaces"], answer: 1, explain: "Hide data, expose controlled access." },
    { type: "mcq", q: "Accessing a private field from another class gives…", options: ["a warning", "a compile error", "null", "a runtime exception"], answer: 1, explain: "\"has private access\"." },
    { type: "mcq", q: "A field with a getter but no setter is…", options: ["write-only", "read-only", "static", "invalid"], answer: 1, explain: "Read-only from outside." },
    { type: "mcq", q: "Why return <code>arr.clone()</code> from a getter?", options: ["faster", "so callers can't modify the private array", "required by Java", "to sort it"], answer: 1, explain: "Defensive copy." },
  ],
};
