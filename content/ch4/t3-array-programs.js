const J = String.raw;

export default {
  title: "Array programs & the Arrays class",
  summary: "Sorting, binary search, removing duplicates and merging — written by hand first, then with java.util.Arrays.",

  concept: J`
<h2>Concept</h2>
<h3>Bubble sort — the idea</h3>
<p>Compare neighbours and swap them if they are in the wrong order. After each pass the largest remaining value "bubbles" to the end.</p>
<pre class="java">for (int pass = 0; pass &lt; a.length - 1; pass++) {
    for (int i = 0; i &lt; a.length - 1 - pass; i++) {
        if (a[i] &gt; a[i + 1]) {
            int t = a[i]; a[i] = a[i + 1]; a[i + 1] = t;
        }
    }
}</pre>

<h3>Selection sort — the idea</h3>
<p>Find the smallest element in the unsorted part and swap it into the next position.</p>

<h3>Binary search</h3>
<p>On a <b>sorted</b> array, check the middle element. If the key is smaller, search the left half; if larger, the right half. Each step halves the search space — 1,000,000 elements need only about 20 comparisons (linear search may need 1,000,000).</p>
<pre class="java">int lo = 0, hi = a.length - 1;
while (lo &lt;= hi) {
    int mid = (lo + hi) / 2;
    if (a[mid] == key) return mid;
    if (a[mid] &lt; key) lo = mid + 1; else hi = mid - 1;
}
return -1;</pre>

<h3>The java.util.Arrays class</h3>
<table>
<tr><th>Method</th><th>What it does</th></tr>
<tr><td><code>Arrays.toString(a)</code></td><td>"[1, 2, 3]"</td></tr>
<tr><td><code>Arrays.sort(a)</code></td><td>sorts ascending (in place)</td></tr>
<tr><td><code>Arrays.sort(a, from, to)</code></td><td>sorts only indexes from … to−1</td></tr>
<tr><td><code>Arrays.binarySearch(a, key)</code></td><td>index of key in a <b>sorted</b> array (negative if missing)</td></tr>
<tr><td><code>Arrays.fill(a, v)</code></td><td>sets every element to v</td></tr>
<tr><td><code>Arrays.copyOf(a, n)</code></td><td>new array of length n (cut or padded with defaults)</td></tr>
<tr><td><code>Arrays.copyOfRange(a, from, to)</code></td><td>new array of a part</td></tr>
<tr><td><code>Arrays.equals(a, b)</code></td><td>same length and same elements?</td></tr>
<tr><td><code>Arrays.asList(…)</code></td><td>fixed-size List view (Collections chapter)</td></tr>
</table>
<div class="note">Learn to write sorting and searching yourself — it's asked in exams and interviews — but in real programs use <code>Arrays.sort</code>, which is faster and well tested.</div>
`,

  samples: [
    {
      title: "Bubble sort with passes shown",
      code: J`import java.util.Arrays;

public class Bubble {
    public static void main(String[] args) {
        int[] a = {29, 10, 14, 37, 13};
        for (int pass = 0; pass < a.length - 1; pass++) {
            for (int i = 0; i < a.length - 1 - pass; i++) {
                if (a[i] > a[i + 1]) {
                    int t = a[i];
                    a[i] = a[i + 1];
                    a[i + 1] = t;
                }
            }
            System.out.println("After pass " + (pass + 1) + ": " + Arrays.toString(a));
        }
    }
}`,
      output: "After pass 1: [10, 14, 29, 13, 37]\nAfter pass 2: [10, 14, 13, 29, 37]\nAfter pass 3: [10, 13, 14, 29, 37]\nAfter pass 4: [10, 13, 14, 29, 37]",
    },
    {
      title: "The Arrays class",
      code: J`import java.util.Arrays;

public class ArraysDemo {
    public static void main(String[] args) {
        int[] a = {50, 20, 40, 10, 30};
        Arrays.sort(a);
        System.out.println(Arrays.toString(a));
        System.out.println(Arrays.binarySearch(a, 40));
        int[] bigger = Arrays.copyOf(a, 7);
        System.out.println(Arrays.toString(bigger));
        System.out.println(Arrays.toString(Arrays.copyOfRange(a, 1, 4)));
        int[] f = new int[4];
        Arrays.fill(f, 9);
        System.out.println(Arrays.toString(f));
        System.out.println(Arrays.equals(f, new int[] {9, 9, 9, 9}));
    }
}`,
      output: "[10, 20, 30, 40, 50]\n3\n[10, 20, 30, 40, 50, 0, 0]\n[20, 30, 40]\n[9, 9, 9, 9]\ntrue",
    },
  ],

  practice: [
    {
      id: "c4t3p1", title: "Selection sort",
      task: "<p>Sort <code>{64, 25, 12, 22, 11}</code> using <b>selection sort</b> written by yourself (don't use Arrays.sort). Print the result with Arrays.toString.</p>",
      expected: "[11, 12, 22, 25, 64]",
      hints: ["For each position i, find the index of the smallest element from i to the end.", "Swap it with a[i]."],
      solution: J`import java.util.Arrays;

public class Main {
    public static void main(String[] args) {
        int[] a = {64, 25, 12, 22, 11};
        for (int i = 0; i < a.length - 1; i++) {
            int minIdx = i;
            for (int j = i + 1; j < a.length; j++) {
                if (a[j] < a[minIdx]) minIdx = j;
            }
            int t = a[i];
            a[i] = a[minIdx];
            a[minIdx] = t;
        }
        System.out.println(Arrays.toString(a));
    }
}`,
    },
    {
      id: "c4t3p2", title: "Binary search by hand",
      task: "<p>Search the sorted array <code>{3, 8, 15, 23, 42, 56, 71, 89}</code> for 56 with your own binary search and print every middle value you check.</p>",
      expected: "Checking 23\nChecking 56\nFound 56 at index 5",
      mustUse: ["while"],
      hints: ["mid = (lo + hi) / 2. Print a[mid] each time before comparing."],
      solution: J`public class Main {
    public static void main(String[] args) {
        int[] a = {3, 8, 15, 23, 42, 56, 71, 89};
        int key = 56, lo = 0, hi = a.length - 1, found = -1;
        while (lo <= hi) {
            int mid = (lo + hi) / 2;
            System.out.println("Checking " + a[mid]);
            if (a[mid] == key) {
                found = mid;
                break;
            } else if (a[mid] < key) {
                lo = mid + 1;
            } else {
                hi = mid - 1;
            }
        }
        System.out.println(found >= 0 ? "Found " + key + " at index " + found : key + " not found");
    }
}`,
    },
    {
      id: "c4t3p3", title: "Remove duplicates",
      task: "<p>Sort <code>{5, 3, 9, 3, 5, 1, 9, 9}</code>, then build a new array with each value only once.</p>",
      expected: "[1, 3, 5, 9]",
      mustUse: ["Arrays.sort", "Arrays.copyOf"],
      hints: ["After sorting, equal values are next to each other. Copy a value only when it differs from the previous one.", "Count the unique values as you go, then trim with Arrays.copyOf(result, count)."],
      solution: J`import java.util.Arrays;

public class Main {
    public static void main(String[] args) {
        int[] a = {5, 3, 9, 3, 5, 1, 9, 9};
        Arrays.sort(a);
        int[] result = new int[a.length];
        int count = 0;
        for (int i = 0; i < a.length; i++) {
            if (i == 0 || a[i] != a[i - 1]) {
                result[count++] = a[i];
            }
        }
        System.out.println(Arrays.toString(Arrays.copyOf(result, count)));
    }
}`,
    },
    {
      id: "c4t3p4", title: "Merge two sorted arrays",
      task: "<p>Merge <code>{2, 7, 11, 20}</code> and <code>{3, 7, 15}</code> into one sorted array without calling sort.</p>",
      expected: "[2, 3, 7, 7, 11, 15, 20]",
      hints: ["Use index i for the first array and j for the second; copy the smaller of a[i] and b[j].", "When one array runs out, copy the rest of the other."],
      solution: J`import java.util.Arrays;

public class Main {
    public static void main(String[] args) {
        int[] a = {2, 7, 11, 20};
        int[] b = {3, 7, 15};
        int[] m = new int[a.length + b.length];
        int i = 0, j = 0, k = 0;
        while (i < a.length && j < b.length) {
            if (a[i] <= b[j]) m[k++] = a[i++];
            else m[k++] = b[j++];
        }
        while (i < a.length) m[k++] = a[i++];
        while (j < b.length) m[k++] = b[j++];
        System.out.println(Arrays.toString(m));
    }
}`,
    },
    {
      id: "c4t3p5", title: "Rotate left",
      task: "<p>Rotate <code>{1, 2, 3, 4, 5, 6, 7}</code> to the left by 3 positions.</p>",
      expected: "[4, 5, 6, 7, 1, 2, 3]",
      hints: ["New position of element i is (i − k + n) % n, or: result[i] = a[(i + k) % n]."],
      solution: J`import java.util.Arrays;

public class Main {
    public static void main(String[] args) {
        int[] a = {1, 2, 3, 4, 5, 6, 7};
        int k = 3, n = a.length;
        int[] r = new int[n];
        for (int i = 0; i < n; i++) {
            r[i] = a[(i + k) % n];
        }
        System.out.println(Arrays.toString(r));
    }
}`,
    },
  ],

  fill: [
    { id: "c4t3f1", prompt: "Sort, then search.", template: "Arrays.___(a);\nint pos = Arrays.___(a, 42);", answers: [["sort"], ["binarySearch"]], explain: "binarySearch only works on a sorted array." },
    { id: "c4t3f2", prompt: "Set all elements of seats to -1.", template: "Arrays.___(seats, -1);", answers: [["fill"]], explain: "Arrays.fill." },
  ],

  quiz: [
    { type: "mcq", q: "Binary search requires the array to be…", options: ["of even length", "sorted", "without duplicates", "of type int"], answer: 1, explain: "It relies on order to discard half." },
    { type: "output", q: "Predict the output.", code: J`import java.util.Arrays;
public class Q {
    public static void main(String[] args) {
        int[] a = {4, 1, 3};
        int[] b = Arrays.copyOf(a, 2);
        Arrays.sort(a);
        System.out.println(Arrays.toString(a) + Arrays.toString(b));
    }
}`, answer: "[1, 3, 4][4, 1]", explain: "copyOf made a separate array before sorting." },
    { type: "mcq", q: "About how many comparisons does binary search need for 1,000 sorted items in the worst case?", options: ["1000", "500", "10", "100"], answer: 2, explain: "log₂(1000) ≈ 10." },
    { type: "mcq", q: "Bubble sort on n elements needs how many passes at most?", options: ["n", "n − 1", "n²", "log n"], answer: 1, explain: "After n − 1 passes all elements are in place." },
  ],
};
