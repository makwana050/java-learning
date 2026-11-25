# Java Lab — complete guide

A free Core Java learning and testing website for your class.

- **Students** sign in with their **@rru.ac.in** Google account. They read each concept, run examples, write practice programs themselves (with hints and solutions), do fill-in-the-syntax exercises and quizzes, and take your tests.
- **You** get a full **Faculty dashboard** to create and run tests, watch them live, grade, adjust marks, publish results, track every student, and control access.

**Content:** 13 chapters, 68 topics, 257 practice problems, 170 runnable examples, 151 fill-in-the-syntax exercises and 305 quiz questions. Every program and expected output has been compiled and run to check it.

| # | Chapter | Topics |
|---|---|---|
| 1 | Java Basics, Variables & Data Types | What is Java, JDK/JRE/JVM, first program, comments/identifiers/keywords, variables & primitives, literals/wrappers/defaults, type casting, Scanner & command-line args |
| 2 | Operators | arithmetic & assignment, ++/--, relational & logical (short-circuit), bitwise & shift, ternary & precedence |
| 3 | Conditions & Loops | if/else, switch, for/while/do-while, break/continue/labels, pattern programs |
| 4 | Arrays | 1D, 2D & jagged, sorting/searching & the Arrays class |
| 5 | Strings | String Pool, immutability & equals, String methods, StringBuilder/StringBuffer, classic programs |
| 6 | Methods | define/call/return, pass-by-value, overloading, varargs, recursion |
| 7 | Classes & Objects | classes & references, constructors, this & constructor chaining, static vs instance, variable types & scope, blocks & initialization order, toString/equals/hashCode |
| 8 | Encapsulation, Packages & Access | encapsulation, packages & import, access modifiers, final |
| 9 | Inheritance & Polymorphism | inheritance, super & constructor chaining, overriding, runtime polymorphism & casting, method hiding & variable hiding, abstract classes |
| 10 | Interfaces & Nested Classes | interfaces, default/static methods & the diamond problem, abstract class vs interface, inner/static nested/anonymous classes, lambdas |
| 11 | Exception Handling | exceptions & hierarchy, try/catch, finally & try-with-resources, throw/throws, custom exceptions |
| 12 | Collections | autoboxing & generics, ArrayList, LinkedList (and building your own), Set, Map, Iterator/Comparable/Comparator |
| 13 | Multithreading | threads & life cycle, creating threads, sleep/join/priority/interrupt, race conditions & synchronized, ReentrantLock, wait/notify & ExecutorService |

---

## Part A — Publish the website (one time, about 20 minutes)

You have already created the Firebase project, turned on Google sign-in, created the Firestore database and the `java-learning` GitHub repository.

**A1. Database security rules.** Firebase console → your project → **Build → Firestore Database → Rules**. Delete everything, paste the whole of **`firestore.rules`**, and click **Publish**.

> Every time you receive a new version of this website, paste `firestore.rules` again and Publish. It protects answer keys, marks and access.

**A2. Upload the website.** On github.com/makwana050/java-learning → **Add file → Upload files**. Drag in everything **inside** the `java-learning` folder (`index.html`, `tools.jar`, `README.md`, `firestore.rules`, `.nojekyll`, and the `css`, `js` and `content` folders), then **Commit changes**.

> ⚠️ **Never upload the `faculty-only` folder.** It contains test answers and the repository is public.

**A3. Turn on GitHub Pages.** Repository **Settings → Pages → Deploy from a branch → main / (root) → Save**. After 1–2 minutes your site is live at **https://makwana050.github.io/java-learning/**.

**A4. Allow sign-in from your site.** Firebase → **Authentication → Settings → Authorized domains → Add domain** → `makwana050.github.io`.

**A5. Check it works.**
1. Open the site and sign in with **mak005500@gmail.com**. You should see the **Faculty** tab.
2. Open *Chapter 1 → What is Java?* and press **Run** on Example 1. The **first run takes 20–40 seconds** while Java downloads into the browser; after that, runs take a few seconds.
3. Sign in with a non-college Gmail account. You should see "Access denied".
4. Sign in with an @rru.ac.in account. It should work, without a Faculty tab.

**A6. Load your ready-made tests.** Faculty → **Tests → Upload a test file** and upload each file from `faculty-only` (they stay saved in the database):
- `simple-quiz.json`: **Java Quiz**, a pool of 30 simple questions (theory, guess-the-output, correct-the-syntax). Each student gets a random 20, one question at a time, 60 s each.
- `final-quiz.json`: final quiz, 25 questions, 45 minutes
- `lab-exam.json`: lab practical, 4 programs to write and run, 120 minutes
- `ch1-quick-test.json`: short Chapter 1 test

---


---

## Part C — Editing course content

All lessons are in the **`content`** folder, one file per topic (e.g. `content/ch1/t3-first-program.js`). To fix a typo, open the file on GitHub, click ✏️, edit, and **Commit changes**. The site updates within a minute or two (press Ctrl+F5).

| Part | What it is |
|---|---|
| `title`, `summary` | heading and one-line description |
| `concept` | the lesson in simple HTML (`<h3>`, `<p>`, `<table>`, `<pre class="java">` for code) |
| `syntax` | optional word-by-word breakdown of one line of code |
| `samples` | runnable examples with `code` and `output` |
| `practice` | problems: `task`, `expected` output, `hints`, `solution`, optional `mustUse` and `starter` |
| `fill` | fill-in-the-syntax: `template` with `___` blanks and `answers` |
| `quiz` | `mcq` (`options` + `answer`, 0 = first option) and `output` (`code` + `answer`) |

Ids like `c1t3p2` must be unique and must **never change** once students have used them, because progress is stored by id. To add a topic, create its file and list it in `content/course.js`.

---

## Good to know

- **Java version of the Run button:** the in-browser compiler is Java 8, and every practice problem works with it. Newer syntax (`var`, records, switch expressions, `String.repeat`, `List.of`, the Java 25 `void main()` form) is explained in lessons; students try those on JDK 25 in the lab.
- **Keyboard input:** the Scanner lessons read from a String, e.g. `new Scanner("21 Asha")`. That works exactly like typing. In the lab, students swap it for `System.in`.
- **Packages:** the Run button compiles one file, so creating packages is practised in the lab.
- **Threads:** thread examples use `join()` so their output is predictable. One example deliberately shows a race condition, and its number changes from run to run.
- **CheerpJ licence:** the in-browser Java engine is free for individuals and non-commercial projects with the "Built with CheerpJ" credit (it's in the footer). Since this is for a college course, a short email to CheerpJ (https://cheerpj.com/licensing/) to confirm is worthwhile.
- **Free-plan limits:** Firebase's free plan gives 50,000 reads and 20,000 writes per day. That is plenty for 70 students, including the live monitor during a test.
- **Another faculty account:** add the email in `js/config.js` **and** in `firestore.rules` (then Publish the rules).
- **Another college domain:** change `ALLOWED_DOMAIN` in `js/config.js` **and** the `rru[.]ac[.]in` line in `firestore.rules`.
