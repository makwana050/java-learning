const J = String.raw;

export default {
  title: "Classic String programs",
  summary: "The string problems every Java programmer must be able to write: frequency counting, anagrams, compression, first unique character and more.",

  concept: J`
<h2>Concept</h2>
<p>Most string problems use a few tools in different combinations. Learn these patterns and you can solve almost anything.</p>
<table>
<tr><th>Tool</th><th>Use it for</th></tr>
<tr><td>Loop with <code>charAt(i)</code></td><td>visit every character</td></tr>
<tr><td><b>Counting array</b> <code>int[] freq = new int[26]</code> and <code>freq[c - 'a']++</code></td><td>count letters (a = index 0 … z = index 25)</td></tr>
<tr><td><code>int[] freq = new int[256]</code> and <code>freq[c]++</code></td><td>count any ASCII character</td></tr>
<tr><td><code>toCharArray()</code> + <code>Arrays.sort</code></td><td>compare letters regardless of order (anagrams)</td></tr>
<tr><td><code>StringBuilder</code></td><td>build the answer</td></tr>
<tr><td>Two indexes (left / right)</td><td>palindromes, reversing</td></tr>
<tr><td><code>split("\\s+")</code></td><td>work word by word</td></tr>
</table>

<h3>The counting-array trick</h3>
<pre class="java">String s = "banana";
int[] freq = new int[26];
for (char c : s.toCharArray()) {
    freq[c - 'a']++;          // 'b' - 'a' = 1, 'n' - 'a' = 13 …
}
// freq[0] = 3 (a), freq[1] = 1 (b), freq[13] = 2 (n)
for (int i = 0; i &lt; 26; i++)
    if (freq[i] &gt; 0) System.out.println((char) ('a' + i) + " = " + freq[i]);</pre>
<p>This works because a char is a number. It is fast and needs no special classes. (In the Collections chapter you'll also do it with a <code>Map</code>.)</p>

<h3>Two-pointer palindrome check</h3>
<pre class="java">int l = 0, r = s.length() - 1;
boolean pal = true;
while (l &lt; r) {
    if (s.charAt(l++) != s.charAt(r--)) { pal = false; break; }
}</pre>
`,

  samples: [
    {
      title: "Character frequency (sorted)",
      code: J`public class Freq {
    public static void main(String[] args) {
        String s = "programming";
        int[] freq = new int[26];
        for (char c : s.toCharArray()) freq[c - 'a']++;
        for (int i = 0; i < 26; i++) {
            if (freq[i] > 0) System.out.print((char) ('a' + i) + "" + freq[i] + " ");
        }
        System.out.println();
    }
}`,
      output: "a1 g2 i1 m2 n1 o1 p1 r2",
    },
    {
      title: "Anagram check",
      code: J`import java.util.Arrays;

public class Anagram {
    public static void main(String[] args) {
        String a = "Dormitory", b = "Dirty room";
        char[] x = a.replace(" ", "").toLowerCase().toCharArray();
        char[] y = b.replace(" ", "").toLowerCase().toCharArray();
        Arrays.sort(x);
        Arrays.sort(y);
        System.out.println(Arrays.equals(x, y) ? "Anagrams" : "Not anagrams");
    }
}`,
      output: "Anagrams",
    },
  ],

  practice: [
    {
      id: "c5t5p1", title: "Palindrome sentence",
      task: "<p>Check if <code>\"Was it a car or a cat I saw?\"</code> is a palindrome when you ignore case, spaces and punctuation. Use the two-pointer method.</p>",
      expected: "Palindrome: true",
      mustUse: ["Character.isLetterOrDigit"],
      hints: ["First build a cleaned lowercase string of only letters/digits.", "Then compare charAt(l) and charAt(r) moving inwards."],
      solution: J`public class Main {
    public static void main(String[] args) {
        String s = "Was it a car or a cat I saw?";
        StringBuilder clean = new StringBuilder();
        for (char c : s.toCharArray()) {
            if (Character.isLetterOrDigit(c)) clean.append(Character.toLowerCase(c));
        }
        boolean pal = true;
        int l = 0, r = clean.length() - 1;
        while (l < r) {
            if (clean.charAt(l++) != clean.charAt(r--)) {
                pal = false;
                break;
            }
        }
        System.out.println("Palindrome: " + pal);
    }
}`,
    },
    {
      id: "c5t5p2", title: "First non-repeating character",
      task: "<p>Find the first character that appears only once in <code>\"swiss watches\"</code> (ignore spaces).</p>",
      expected: "First unique: i",
      mustUse: ["new int[26]"],
      hints: ["Pass 1: count every letter. Pass 2: walk the string again in order and return the first letter with count 1."],
      solution: J`public class Main {
    public static void main(String[] args) {
        String s = "swiss watches";
        int[] freq = new int[26];
        for (char c : s.toCharArray()) if (c != ' ') freq[c - 'a']++;
        char found = '-';
        for (char c : s.toCharArray()) {
            if (c != ' ' && freq[c - 'a'] == 1) {
                found = c;
                break;
            }
        }
        System.out.println("First unique: " + found);
    }
}`,
    },
    {
      id: "c5t5p3", title: "Run-length compression",
      task: "<p>Compress <code>\"aaabccddddde\"</code> by writing each character followed by how many times it repeats in a row.</p>",
      expected: "a3b1c2d5e1",
      mustUse: ["StringBuilder"],
      hints: ["Walk the string, counting while the next char is the same; when it changes, append char + count and reset."],
      solution: J`public class Main {
    public static void main(String[] args) {
        String s = "aaabccddddde";
        StringBuilder out = new StringBuilder();
        int count = 1;
        for (int i = 1; i <= s.length(); i++) {
            if (i < s.length() && s.charAt(i) == s.charAt(i - 1)) {
                count++;
            } else {
                out.append(s.charAt(i - 1)).append(count);
                count = 1;
            }
        }
        System.out.println(out);
    }
}`,
    },
    {
      id: "c5t5p4", title: "Remove duplicate characters",
      task: "<p>Remove repeated characters from <code>\"engineering\"</code>, keeping only the first occurrence of each and the original order.</p>",
      expected: "engir",
      hints: ["Use a <code>boolean[] seen = new boolean[256];</code> — append a char only if it hasn't been seen."],
      solution: J`public class Main {
    public static void main(String[] args) {
        String s = "engineering";
        boolean[] seen = new boolean[256];
        StringBuilder out = new StringBuilder();
        for (char c : s.toCharArray()) {
            if (!seen[c]) {
                seen[c] = true;
                out.append(c);
            }
        }
        System.out.println(out);
    }
}`,
    },
    {
      id: "c5t5p5", title: "Longest word",
      task: "<p>Find the longest word in <code>\"Practice makes a programmer confident\"</code>. If two have the same length, keep the first.</p>",
      expected: "Longest: programmer (10)",
      hints: ["Split into words; keep the word with the greatest length()."],
      solution: J`public class Main {
    public static void main(String[] args) {
        String s = "Practice makes a programmer confident";
        String longest = "";
        for (String w : s.split("\\s+")) {
            if (w.length() > longest.length()) longest = w;
        }
        System.out.println("Longest: " + longest + " (" + longest.length() + ")");
    }
}`,
    },
    {
      id: "c5t5p6", title: "Toggle case and count",
      task: "<p>Toggle the case of every letter in <code>\"HeLLo JaVa 25\"</code> (upper ↔ lower; other characters unchanged) and count how many letters were changed.</p>",
      expected: "hEllO jAvA 25\nLetters changed: 9",
      hints: ["Use Character.isUpperCase / isLowerCase and toLowerCase / toUpperCase."],
      solution: J`public class Main {
    public static void main(String[] args) {
        String s = "HeLLo JaVa 25";
        StringBuilder out = new StringBuilder();
        int changed = 0;
        for (char c : s.toCharArray()) {
            if (Character.isUpperCase(c)) {
                out.append(Character.toLowerCase(c));
                changed++;
            } else if (Character.isLowerCase(c)) {
                out.append(Character.toUpperCase(c));
                changed++;
            } else {
                out.append(c);
            }
        }
        System.out.println(out);
        System.out.println("Letters changed: " + changed);
    }
}`,
    },
    {
      id: "c5t5p7", title: "Reverse word order",
      task: "<p>Reverse the order of the words in <code>\"one two three four\"</code>.</p>",
      expected: "four three two one",
      hints: ["Split, then loop from the last word to the first."],
      solution: J`public class Main {
    public static void main(String[] args) {
        String[] w = "one two three four".split(" ");
        StringBuilder sb = new StringBuilder();
        for (int i = w.length - 1; i >= 0; i--) {
            sb.append(w[i]);
            if (i > 0) sb.append(" ");
        }
        System.out.println(sb);
    }
}`,
    },
  ],

  fill: [
    { id: "c5t5f1", prompt: "Count a lowercase letter in a frequency array.", template: "freq[c - ___]++;", answers: [["'a'"]], explain: "Subtracting 'a' maps a..z to 0..25." },
    { id: "c5t5f2", prompt: "Turn index i back into its letter.", template: "char letter = (char) (___ + i);", answers: [["'a'"]], explain: "'a' + 0 = 'a', 'a' + 1 = 'b' …" },
  ],

  quiz: [
    { type: "output", q: "Predict the output.", code: J`public class Q {
    public static void main(String[] args) {
        String s = "level";
        int[] f = new int[26];
        for (char c : s.toCharArray()) f[c - 'a']++;
        System.out.println(f['e' - 'a'] + "" + f['l' - 'a'] + f['v' - 'a']);
    }
}`, answer: "221", explain: "e: 2, l: 2, v: 1." },
    { type: "mcq", q: "Which approach is best to check if two words are anagrams?", options: ["compare lengths only", "sort both char arrays and compare", "compare with ==", "check first and last letters"], answer: 1, explain: "Sorted letters are identical for anagrams (or compare frequency arrays)." },
    { type: "output", q: "Predict the output.", code: J`public class Q {
    public static void main(String[] args) {
        String s = "abc";
        String r = "";
        for (char c : s.toCharArray()) r = c + r;
        System.out.println(r);
    }
}`, answer: "cba", explain: "Each character is put in front of the result." },
  ],
};
