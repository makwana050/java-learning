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

## Part B — The Faculty dashboard

Sign in with mak005500@gmail.com and click **Faculty**. Only your account can open it, and the database refuses everyone else.

### 📊 Overview
- Number of students signed in, active today and this week, total practice problems solved and Run clicks.
- Every test with its status, submissions, class average, highest and lowest marks, and average number of times students left the test.
- A banner with a **live monitor** link whenever a test is running.
- **Students who may need help:** inactive for 7+ days, or no practice problem solved yet.

### 📝 Tests

**Create a new test** opens the test builder:
1. **Test settings:** title, instructions, total time, questions per student (random subset), seconds per question, penalty per leave, auto-submit limit, shuffle, full screen.
2. **Questions:** add any of four types:
   - 🔘 **Multiple choice:** up to 6 options; click the correct one.
   - 🖨 **Guess the output:** paste the program and press **▶ Run the program to fill the correct output**. Java runs it for you, so the answer key can't be wrong. You can also add alternative accepted answers.
   - ✏️ **Fill / correct the syntax:** optionally show the wrong code, then type the answer template with `___` for each blank. Give accepted answers per blank (`trim | strip` accepts either; spaces are ignored).
   - 💻 **Write code:** write your reference solution (kept private) and press **▶ Run solution** to fill the expected output. Optionally add starter code, and "must contain" rules like `printf, %.2f`.
   - 📚 **From question bank:** 456 ready-made questions from the course (all chapter quizzes and fill-in exercises), by chapter and type. Tick and add.
3. Each question has marks, an optional own time limit, an explanation shown after results, **↑ ↓** to reorder, **⧉** duplicate, **🗑** delete, and **👁 Preview as a student sees it**.
4. **💾 Save test.** The builder checks for empty options, missing answers and so on before saving. **⬇ Download as JSON** gives you a backup.

**For each test in the list:**
- **✏️ Edit:** reopens it in the builder. Question ids are kept, so earlier submissions still match. Editing is blocked while the test is live.
- **⧉ Duplicate:** quick way to make "Quiz 2" from "Quiz 1".
- **⬇ JSON:** backup of the test with answers.
- **🗑 Delete:** submissions stay in the gradebook.
- **Upload a test file:** imports a `.json` written by hand or downloaded earlier. Format in `faculty-only/TEST-FORMAT.md`.

**Running a test (e.g. live on stream):**
1. In the test's row, check the settings: total time, seconds per question (0 = all questions on one page, best for code), marks deducted per leave, auto-submit after N leaves, full screen.
2. Press **▶ Start now**. The test goes LIVE with one shared end time and the **👁 Live monitor** opens. Tell students to open **Tests**.
3. The live monitor refreshes every 10 s. It shows who is writing, which question each student is on, who is **AWAY from the test right now**, how many times each has left (rows turn red at 2+), their last event, and time left.
4. **+5 min** extends the test; **■ Stop test** closes it.

**What students experience during a test:**
- They see the rules and penalty first and must tick "I will not use any other app, tab, person or AI tool".
- Each student gets their own random question set and order, with options shuffled.
- Questions are **drawn as images**, so they can't be selected, copied or read by page-reading assistants such as Copilot's "summarise this page". A faint roll-number watermark is on every question.
- **One question at a time** (if set) with its own countdown, auto-advance and no going back. Reloading doesn't reset the timer.
- **Every leave is detected:** switching tab or app, opening a sidebar or assistant (Copilot in Edge etc.), shrinking or splitting the window, leaving full screen, Print Screen, or opening the test in a second tab. The question is immediately hidden behind a red warning screen, the penalty is shown, and the event is logged with its time.
- Copy, cut, paste, right-click, drag, print, save, view-source and developer-tools shortcuts are blocked; paste attempts are logged.
- The test submits automatically at the end time or after too many leaves.

> No website can stop a phone camera or a second laptop. Keep supervising the room or stream; the penalties, warning screen, live monitor and activity log make cheating costly and visible.

**Submissions → (after the test)**
- Summary: submitted, class average, highest, number below 40%, number who left the test.
- For each student: answers score, times left, penalty, your adjustment, **final marks** and percentage.
- **View / adjust** for one student:
  - **Adjust marks:** add or subtract marks with a note (e.g. "power cut").
  - **Waive the leave penalty.**
  - **Change marks for a single question** (partial credit for code).
  - **↺ Allow re-attempt:** deletes their submission so they can take the test again while it is live.
  - Their **activity log** (every leave, paste attempt, reload and timeout, with time), seconds per question, and their answers next to the correct ones.
- **Class analysis:**
  - score distribution;
  - **question difficulty**, hardest first: the percentage who got each question fully right and the average time. Use it to see what to re-teach.
- **📢 Publish results to students:** each student sees their marks, the penalty breakdown and every question with the correct answer and explanation. You can hide them again.
- **⬇ Download CSV**. For code tests there's also **⬇ Code (.zip for MOSS)** and **Check code similarity**.

### 📒 Gradebook
Every student × every test (final marks), plus each student's average %. **⬇ Download gradebook** gives a CSV that opens in Excel.

### 👩‍🎓 Students
Everyone who has signed in or taken a test, with a search box: practice problems solved, Run clicks, hints and solutions viewed, time spent and tests taken. Click a name for a **profile**: progress bar per chapter plus every test result.

### ⚙️ Settings & access
- **📢 Announcement:** a message at the top of every student's home page, e.g. "Java Quiz on Monday 10 AM".
- **📚 Chapters visible to students:** untick chapters you haven't taught yet. Students won't see them; you see them marked "Hidden from students".
- **🔐 Who can sign in:**
  - *Any @rru.ac.in account plus listed emails* (e.g. add an external examiner's Gmail), or
  - *Only the listed emails*: paste your class list from Excel.

  Use **Check an email** to test any address. This is enforced by the database itself.
- **💾 Download full backup:** a zip with every test (with answers) as JSON plus all submissions as CSV.

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
