const J = String.raw;

export default {
  title: "2D & jagged arrays",
  summary: "Tables, matrices and grids: arrays of arrays, including rows of different lengths.",

  concept: J`
<h2>Concept</h2>
<p>A <b>2D array</b> is an array whose elements are themselves arrays. Think of it as a table with rows and columns.</p>
<pre class="java">int[][] m = new int[3][4];          // 3 rows, 4 columns, all 0
int[][] grid = {
    {1, 2, 3},
    {4, 5, 6}
};                                  // 2 rows, 3 columns
grid[1][2] = 60;                    // row 1, column 2</pre>
<ul>
<li><code>grid.length</code> → number of rows (2).</li>
<li><code>grid[r].length</code> → number of columns in row r (3).</li>
<li><code>grid[r]</code> is a whole row — a 1D array.</li>
</ul>

<h3>Traversing</h3>
<pre class="java">for (int r = 0; r &lt; grid.length; r++) {
    for (int c = 0; c &lt; grid[r].length; c++) {
        System.out.print(grid[r][c] + " ");
    }
    System.out.println();
}</pre>
<p>With for-each: <code>for (int[] row : grid) for (int v : row) …</code></p>

<h3>Jagged arrays</h3>
<p>Since each row is a separate array, rows can have <b>different lengths</b>:</p>
<pre class="java">int[][] tri = new int[3][];     // only the number of rows is fixed
tri[0] = new int[1];
tri[1] = new int[2];
tri[2] = new int[3];</pre>
<p>Until a row is created, <code>tri[1]</code> is <code>null</code>. Always loop with <code>grid[r].length</code>, never a fixed column count.</p>

<h3>Printing</h3>
<p><code>Arrays.toString(grid)</code> prints row references. Use <code>Arrays.deepToString(grid)</code> → <code>[[1, 2, 3], [4, 5, 6]]</code>.</p>

<h3>Copying is shallow</h3>
<p><code>grid.clone()</code> copies only the outer array; both copies share the same row arrays. Changing <code>copy[0][0]</code> also changes <code>grid[0][0]</code>. To copy deeply, clone each row.</p>
`,

  samples: [
    {
      title: "Marks table",
      code: J`public class MarksTable {
    public static void main(String[] args) {
        int[][] marks = {
            {78, 85, 90},
            {66, 72, 58},
            {92, 88, 95}
        };
        for (int s = 0; s < marks.length; s++) {
            int total = 0;
            for (int sub = 0; sub < marks[s].length; sub++) {
                total += marks[s][sub];
            }
            System.out.println("Student " + (s + 1) + " total: " + total);
        }
    }
}`,
      output: "Student 1 total: 253\nStudent 2 total: 196\nStudent 3 total: 275",
    },
    {
      title: "Jagged array and deepToString",
      code: J`import java.util.Arrays;

public class Jagged {
    public static void main(String[] args) {
        int[][] t = new int[4][];
        for (int r = 0; r < t.length; r++) {
            t[r] = new int[r + 1];
            for (int c = 0; c <= r; c++) {
                t[r][c] = (c == 0 || c == r) ? 1 : t[r - 1][c - 1] + t[r - 1][c];
            }
        }
        System.out.println(Arrays.deepToString(t));
        System.out.println(t.length + " rows, last row has " + t[3].length);
    }
}`,
      output: "[[1], [1, 1], [1, 2, 1], [1, 3, 3, 1]]\n4 rows, last row has 4",
      explain: "This builds Pascal's triangle: each inner value is the sum of the two values above it.",
    },
    {
      title: "Shallow copy trap",
      code: J`public class Shallow {
    public static void main(String[] args) {
        int[][] a = {{1, 2}, {3, 4}};
        int[][] b = a.clone();
        b[0][0] = 100;
        b[1] = new int[] {7, 8};
        System.out.println(a[0][0] + " " + a[1][0]);
    }
}`,
      output: "100 3",
      explain: "b[0] and a[0] are the same row, so the change shows in a. Replacing b[1] with a new row doesn't affect a.",
    },
  ],

  practice: [
    {
      id: "c4t2p1", title: "Matrix addition",
      task: "<p>Add two 2×3 matrices and print the result row by row.</p><pre>A = {{1, 2, 3}, {4, 5, 6}}\nB = {{9, 8, 7}, {6, 5, 4}}</pre>",
      expected: "10 10 10\n10 10 10",
      hints: ["C[r][c] = A[r][c] + B[r][c].", "Print with a space between values."],
      solution: J`public class Main {
    public static void main(String[] args) {
        int[][] a = {{1, 2, 3}, {4, 5, 6}};
        int[][] b = {{9, 8, 7}, {6, 5, 4}};
        for (int r = 0; r < a.length; r++) {
            for (int c = 0; c < a[r].length; c++) {
                System.out.print(a[r][c] + b[r][c]);
                if (c < a[r].length - 1) System.out.print(" ");
            }
            System.out.println();
        }
    }
}`,
    },
    {
      id: "c4t2p2", title: "Transpose",
      task: "<p>Print the transpose (rows become columns) of <code>{{1, 2, 3}, {4, 5, 6}}</code>.</p>",
      expected: "1 4\n2 5\n3 6",
      hints: ["The transpose has 3 rows and 2 columns: t[c][r] = m[r][c].", "Or print directly: outer loop over columns, inner loop over rows."],
      solution: J`public class Main {
    public static void main(String[] args) {
        int[][] m = {{1, 2, 3}, {4, 5, 6}};
        for (int c = 0; c < m[0].length; c++) {
            for (int r = 0; r < m.length; r++) {
                System.out.print(m[r][c]);
                if (r < m.length - 1) System.out.print(" ");
            }
            System.out.println();
        }
    }
}`,
    },
    {
      id: "c4t2p3", title: "Diagonal sums",
      task: "<p>For the 4×4 matrix below, print the sum of the main diagonal and the other diagonal.</p><pre>{{2, 4, 6, 8}, {1, 3, 5, 7}, {9, 8, 7, 6}, {5, 4, 3, 2}}</pre>",
      expected: "Main diagonal: 14\nOther diagonal: 26",
      hints: ["Main: m[i][i]. Other: m[i][n − 1 − i]."],
      solution: J`public class Main {
    public static void main(String[] args) {
        int[][] m = {{2, 4, 6, 8}, {1, 3, 5, 7}, {9, 8, 7, 6}, {5, 4, 3, 2}};
        int n = m.length, main = 0, other = 0;
        for (int i = 0; i < n; i++) {
            main += m[i][i];
            other += m[i][n - 1 - i];
        }
        System.out.println("Main diagonal: " + main);
        System.out.println("Other diagonal: " + other);
    }
}`,
    },
    {
      id: "c4t2p4", title: "Matrix multiplication",
      task: "<p>Multiply A (2×3) by B (3×2).</p><pre>A = {{1, 2, 3}, {4, 5, 6}}\nB = {{7, 8}, {9, 10}, {11, 12}}</pre>",
      expected: "58 64\n139 154",
      hints: ["Result is 2×2. C[i][j] = sum over k of A[i][k] × B[k][j].", "Three nested loops: i (rows of A), j (columns of B), k (shared dimension)."],
      solution: J`public class Main {
    public static void main(String[] args) {
        int[][] a = {{1, 2, 3}, {4, 5, 6}};
        int[][] b = {{7, 8}, {9, 10}, {11, 12}};
        int[][] c = new int[a.length][b[0].length];
        for (int i = 0; i < a.length; i++)
            for (int j = 0; j < b[0].length; j++)
                for (int k = 0; k < b.length; k++)
                    c[i][j] += a[i][k] * b[k][j];
        for (int[] row : c) System.out.println(row[0] + " " + row[1]);
    }
}`,
    },
    {
      id: "c4t2p5", title: "Jagged attendance",
      task: "<p>Three batches had 4, 2 and 3 lab sessions. Store the attendance in a jagged array <code>{{28, 30, 27, 29}, {25, 26}, {31, 30, 32}}</code> and print each batch's sessions count and average (as a double).</p>",
      expected: "Batch 1: 4 sessions, avg 28.5\nBatch 2: 2 sessions, avg 25.5\nBatch 3: 3 sessions, avg 31.0",
      mustUse: [".length"],
      hints: ["Use att[b].length for the number of sessions of batch b."],
      solution: J`public class Main {
    public static void main(String[] args) {
        int[][] att = {{28, 30, 27, 29}, {25, 26}, {31, 30, 32}};
        for (int b = 0; b < att.length; b++) {
            int sum = 0;
            for (int v : att[b]) sum += v;
            System.out.println("Batch " + (b + 1) + ": " + att[b].length + " sessions, avg " + (double) sum / att[b].length);
        }
    }
}`,
    },
  ],

  fill: [
    { id: "c4t2f1", prompt: "Create a 3-row, 5-column int table.", template: "int[][] t = new int[___][___];", answers: [["3"], ["5"]], explain: "First size is rows, second is columns." },
    { id: "c4t2f2", prompt: "Loop over columns of row r.", template: "for (int c = 0; c < t[___].length; c++)", answers: [["r"]], explain: "Each row may have its own length." },
  ],

  quiz: [
    { type: "output", q: "Predict the output.", code: J`public class Q {
    public static void main(String[] args) {
        int[][] g = {{1, 2}, {3, 4, 5}, {6}};
        System.out.println(g.length + " " + g[1].length + " " + g[2][0]);
    }
}`, answer: "3 3 6", explain: "3 rows; row 1 has 3 elements; g[2][0] is 6." },
    { type: "mcq", q: "<code>int[][] a = new int[2][];</code> What is <code>a[0]</code>?", options: ["0", "an empty array", "null", "compile error"], answer: 2, explain: "Rows are not created yet." },
    { type: "mcq", q: "How do you print a 2D array's contents in one call?", options: ["Arrays.toString(a)", "Arrays.deepToString(a)", "System.out.println(a)", "a.toString()"], answer: 1, explain: "deepToString goes into nested arrays." },
    { type: "output", q: "Predict the output.", code: J`public class Q {
    public static void main(String[] args) {
        int[][] m = new int[3][3];
        for (int i = 0; i < 3; i++) m[i][i] = i + 1;
        int s = 0;
        for (int[] row : m) for (int v : row) s += v;
        System.out.println(s);
    }
}`, answer: "6", explain: "Only the diagonal has 1, 2, 3." },
  ],
};
