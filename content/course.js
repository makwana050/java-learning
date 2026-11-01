// Course outline. To add a topic: create its file in the chapter folder and add { id, title, file }.
// A line written as { title: "...", soon: true } shows as "Coming soon".
export const COURSE = [
  {
    id: "ch1", title: "Chapter 1 · Java Basics, Variables & Data Types",
    blurb: "How Java works, your first program, variables, data types, casting and input.",
    topics: [
      { id: "c1t1", title: "What is Java?", file: "ch1/t1-what-is-java.js" },
      { id: "c1t2", title: "JDK, JRE and JVM", file: "ch1/t2-jdk-jre-jvm.js" },
      { id: "c1t3", title: "Your first program, line by line", file: "ch1/t3-first-program.js" },
      { id: "c1t4", title: "Comments, identifiers & keywords", file: "ch1/t4-identifiers-keywords.js" },
      { id: "c1t5", title: "Variables & primitive data types", file: "ch1/t5-variables-datatypes.js" },
      { id: "c1t6", title: "Literals, wrapper classes & default values", file: "ch1/t6-literals-wrappers.js" },
      { id: "c1t7", title: "Type casting: widening & narrowing", file: "ch1/t7-type-casting.js" },
      { id: "c1t8", title: "Input: Scanner & command-line arguments", file: "ch1/t8-input.js" },
    ],
  },
  {
    id: "ch2", title: "Chapter 2 · Operators",
    blurb: "Every operator, how expressions are evaluated, and the classic traps.",
    topics: [
      { id: "c2t1", title: "Arithmetic & assignment operators", file: "ch2/t1-arithmetic.js" },
      { id: "c2t2", title: "Increment & decrement", file: "ch2/t2-increment.js" },
      { id: "c2t3", title: "Relational & logical operators", file: "ch2/t3-relational-logical.js" },
      { id: "c2t4", title: "Bitwise & shift operators", file: "ch2/t4-bitwise.js" },
      { id: "c2t5", title: "Ternary operator & precedence", file: "ch2/t5-ternary-precedence.js" },
    ],
  },
  {
    id: "ch3", title: "Chapter 3 · Conditions & Loops",
    blurb: "if-else, switch, for/while/do-while, break & continue, and pattern programs.",
    topics: [
      { id: "c3t1", title: "if, else-if and nested if", file: "ch3/t1-if-else.js" },
      { id: "c3t2", title: "switch statement", file: "ch3/t2-switch.js" },
      { id: "c3t3", title: "Loops: for, while, do-while", file: "ch3/t3-loops.js" },
      { id: "c3t4", title: "break, continue & labels", file: "ch3/t4-break-continue.js" },
      { id: "c3t5", title: "Pattern programs", file: "ch3/t5-patterns.js" },
    ],
  },
  {
    id: "ch4", title: "Chapter 4 · Arrays",
    blurb: "One- and two-dimensional arrays, jagged arrays and common array programs.",
    topics: [
      { id: "c4t1", title: "One-dimensional arrays", file: "ch4/t1-arrays.js" },
      { id: "c4t2", title: "2D & jagged arrays", file: "ch4/t2-2d-arrays.js" },
      { id: "c4t3", title: "Array programs & the Arrays class", file: "ch4/t3-array-programs.js" },
    ],
  },
  {
    id: "ch5", title: "Chapter 5 · Strings",
    blurb: "String objects, the String Pool, immutability, methods and StringBuilder.",
    topics: [
      { id: "c5t1", title: "Strings & the String Pool", file: "ch5/t1-string-pool.js" },
      { id: "c5t2", title: "Immutability, == vs equals()", file: "ch5/t2-immutability.js" },
      { id: "c5t3", title: "Important String methods", file: "ch5/t3-string-methods.js" },
      { id: "c5t4", title: "StringBuilder & StringBuffer", file: "ch5/t4-stringbuilder.js" },
      { id: "c5t5", title: "Classic String programs", file: "ch5/t5-string-programs.js" },
    ],
  },
  {
    id: "ch6", title: "Chapter 6 · Methods",
    blurb: "Writing and calling methods, parameters, return values, overloading, varargs, recursion.",
    topics: [
      { id: "c6t1", title: "Methods: define, call, return", file: "ch6/t1-methods.js" },
      { id: "c6t2", title: "Pass-by-value, overloading & varargs", file: "ch6/t2-overloading.js" },
      { id: "c6t3", title: "Recursion", file: "ch6/t3-recursion.js" },
    ],
  },
  {
    id: "ch7", title: "Chapter 7 · Classes & Objects",
    blurb: "Classes, objects, constructors, this, constructor chaining, static, variable types and blocks.",
    topics: [
      { id: "c7t1", title: "Classes, objects & references", file: "ch7/t1-classes-objects.js" },
      { id: "c7t2", title: "Constructors", file: "ch7/t2-constructors.js" },
      { id: "c7t3", title: "this keyword & constructor chaining", file: "ch7/t3-this-chaining.js" },
      { id: "c7t4", title: "static vs instance members", file: "ch7/t4-static.js" },
      { id: "c7t5", title: "Variable types & scope", file: "ch7/t5-variable-types.js" },
      { id: "c7t6", title: "Blocks & order of initialization", file: "ch7/t6-blocks.js" },
      { id: "c7t7", title: "toString(), equals() & hashCode()", file: "ch7/t7-object-methods.js" },
    ],
  },
  {
    id: "ch8", title: "Chapter 8 · Encapsulation, Packages & Access",
    blurb: "Data hiding, getters/setters, packages, the four access levels and final.",
    topics: [
      { id: "c8t1", title: "Encapsulation", file: "ch8/t1-encapsulation.js" },
      { id: "c8t2", title: "Packages & import", file: "ch8/t2-packages.js" },
      { id: "c8t3", title: "Access modifiers", file: "ch8/t3-access-modifiers.js" },
      { id: "c8t4", title: "The final keyword", file: "ch8/t4-final.js" },
    ],
  },
  {
    id: "ch9", title: "Chapter 9 · Inheritance & Polymorphism",
    blurb: "extends, super, overriding, upcasting, hiding, and abstract classes.",
    topics: [
      { id: "c9t1", title: "Inheritance basics", file: "ch9/t1-inheritance.js" },
      { id: "c9t2", title: "super & constructor chaining in inheritance", file: "ch9/t2-super.js" },
      { id: "c9t3", title: "Method overriding", file: "ch9/t3-overriding.js" },
      { id: "c9t4", title: "Runtime polymorphism, casting & instanceof", file: "ch9/t4-polymorphism.js" },
      { id: "c9t5", title: "Method hiding & variable hiding", file: "ch9/t5-hiding.js" },
      { id: "c9t6", title: "Abstract classes", file: "ch9/t6-abstract.js" },
    ],
  },
  {
    id: "ch10", title: "Chapter 10 · Interfaces & Nested Classes",
    blurb: "Interfaces, default and static methods, the diamond problem, inner classes and lambdas.",
    topics: [
      { id: "c10t1", title: "Interfaces", file: "ch10/t1-interfaces.js" },
      { id: "c10t2", title: "Default & static methods, multiple interfaces", file: "ch10/t2-default-methods.js" },
      { id: "c10t3", title: "Abstract class vs interface", file: "ch10/t3-abstract-vs-interface.js" },
      { id: "c10t4", title: "Inner, static nested & anonymous classes", file: "ch10/t4-inner-classes.js" },
      { id: "c10t5", title: "Functional interfaces & lambdas", file: "ch10/t5-lambdas.js" },
    ],
  },
  {
    id: "ch11", title: "Chapter 11 · Exception Handling",
    blurb: "try-catch-finally, checked vs unchecked, throw/throws and custom exceptions.",
    topics: [
      { id: "c11t1", title: "What is an exception?", file: "ch11/t1-exceptions.js" },
      { id: "c11t2", title: "try & catch", file: "ch11/t2-try-catch.js" },
      { id: "c11t3", title: "finally & try-with-resources", file: "ch11/t3-finally.js" },
      { id: "c11t4", title: "throw, throws, checked & unchecked", file: "ch11/t4-throw-throws.js" },
      { id: "c11t5", title: "Custom exceptions", file: "ch11/t5-custom.js" },
    ],
  },
  {
    id: "ch12", title: "Chapter 12 · Collections",
    blurb: "Wrapper classes, generics, List, Set, Map, iterators and sorting.",
    topics: [
      { id: "c12t1", title: "Autoboxing & generics", file: "ch12/t1-generics.js" },
      { id: "c12t2", title: "ArrayList", file: "ch12/t2-arraylist.js" },
      { id: "c12t3", title: "LinkedList & build your own", file: "ch12/t3-linkedlist.js" },
      { id: "c12t4", title: "Set: HashSet, LinkedHashSet, TreeSet", file: "ch12/t4-set.js" },
      { id: "c12t5", title: "Map: HashMap, LinkedHashMap, TreeMap", file: "ch12/t5-map.js" },
      { id: "c12t6", title: "Iterator, Comparable & Comparator", file: "ch12/t6-sorting.js" },
    ],
  },
  {
    id: "ch13", title: "Chapter 13 · Multithreading",
    blurb: "Creating threads, join and sleep, race conditions, synchronized, locks and wait/notify.",
    topics: [
      { id: "c13t1", title: "Threads & the thread life cycle", file: "ch13/t1-threads.js" },
      { id: "c13t2", title: "Creating threads", file: "ch13/t2-creating.js" },
      { id: "c13t3", title: "sleep, join, names & priority", file: "ch13/t3-join-sleep.js" },
      { id: "c13t4", title: "Race conditions & synchronized", file: "ch13/t4-synchronized.js" },
      { id: "c13t5", title: "Locks: ReentrantLock", file: "ch13/t5-locks.js" },
      { id: "c13t6", title: "wait/notify & ExecutorService", file: "ch13/t6-wait-notify.js" },
    ],
  },
];

export const allTopics = () => COURSE.flatMap(c => c.topics.filter(t => !t.soon).map(t => ({ ...t, chapter: c })));
