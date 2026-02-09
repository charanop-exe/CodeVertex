// src/components/sampleProblems.js

export const sampledpData = {
    title: "Climbing Stairs",
    description:
        "You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
    difficulty: "EASY",
    tags: ["Dynamic Programming", "Math"],
    constraints: "1 <= n <= 45",
    hints:
        "To reach step n, you can come from step n-1 or n-2. This forms a Fibonacci pattern.",
    editorial:
        "This is a classic DP problem. Let dp[n] be the number of ways to reach step n. dp[n] = dp[n-1] + dp[n-2].",
    testcases: [
        { input: "2", output: "2" },
        { input: "3", output: "3" },
        { input: "4", output: "5" },
    ],
    examples: {
        JAVASCRIPT: {
            input: "n = 2",
            output: "2",
            explanation:
                "You can climb 1+1 or 2 directly, so total ways = 2.",
        },
        PYTHON: {
            input: "n = 3",
            output: "3",
            explanation:
                "Possible ways: (1+1+1), (1+2), (2+1).",
        },
        JAVA: {
            input: "n = 4",
            output: "5",
            explanation:
                "This follows Fibonacci: 1, 2, 3, 5.",
        },
    },
    codeSnippets: {
        JAVASCRIPT: `function climbStairs(n) {
  // write your code here
}

const fs = require("fs");
const n = parseInt(fs.readFileSync(0, "utf8").trim());
console.log(climbStairs(n));`,
        PYTHON: `class Solution:
    def climbStairs(self, n: int) -> int:
        # write your code here
        pass

import sys
n = int(sys.stdin.readline())
print(Solution().climbStairs(n))`,
        JAVA: `import java.util.*;

class Main {
    public static int climbStairs(int n) {
        // write your code here
        return 0;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        System.out.println(climbStairs(n));
    }
}`,
    },
    referenceSolutions: {
        JAVASCRIPT: `function climbStairs(n) {
  if (n <= 2) return n;
  let a = 1, b = 2;
  for (let i = 3; i <= n; i++) {
    [a, b] = [b, a + b];
  }
  return b;
}

const fs = require("fs");
const n = parseInt(fs.readFileSync(0, "utf8").trim());
console.log(climbStairs(n));`,
        PYTHON: `class Solution:
    def climbStairs(self, n: int) -> int:
        if n <= 2:
            return n
        a, b = 1, 2
        for _ in range(3, n + 1):
            a, b = b, a + b
        return b

import sys
n = int(sys.stdin.readline())
print(Solution().climbStairs(n))`,
        JAVA: `import java.util.*;

class Main {
    public static int climbStairs(int n) {
        if (n <= 2) return n;
        int a = 1, b = 2;
        for (int i = 3; i <= n; i++) {
            int c = a + b;
            a = b;
            b = c;
        }
        return b;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        System.out.println(climbStairs(n));
    }
}`,
    },
};

export const sampleStringProblem = {
    title: "Valid Palindrome",
    description:
        "Given a string s, determine if it is a palindrome after converting to lowercase and removing non-alphanumeric characters.",
    difficulty: "EASY",
    tags: ["String", "Two Pointers"],
    constraints: "1 <= s.length <= 2 * 10^5",
    hints: "Use two pointers from both ends.",
    editorial:
        "Clean the string, then compare characters from both ends using two pointers.",
    testcases: [
        { input: "A man, a plan, a canal: Panama", output: "true" },
        { input: "race a car", output: "false" },
    ],
    examples: {
        JAVASCRIPT: {
            input: `"A man, a plan, a canal: Panama"`,
            output: "true",
            explanation: "After cleaning, it reads the same forward and backward.",
        },
        PYTHON: {
            input: `"race a car"`,
            output: "false",
            explanation: "Not a palindrome after cleaning.",
        },
        JAVA: {
            input: `" "`,
            output: "true",
            explanation: "Empty string is a palindrome.",
        },
    },
    codeSnippets: {
        JAVASCRIPT: `function isPalindrome(s) {
  // write your code here
}

const fs = require("fs");
const s = fs.readFileSync(0, "utf8").trim();
console.log(isPalindrome(s));`,
        PYTHON: `class Solution:
    def isPalindrome(self, s: str) -> bool:
        # write your code here
        pass

import sys
s = sys.stdin.readline().strip()
print(str(Solution().isPalindrome(s)).lower())`,
        JAVA: `import java.util.*;

class Main {
    public static boolean isPalindrome(String s) {
        // write your code here
        return false;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.nextLine();
        System.out.println(isPalindrome(s));
    }
}`,
    },
    referenceSolutions: {
        JAVASCRIPT: `function isPalindrome(s) {
  s = s.toLowerCase().replace(/[^a-z0-9]/g, "");
  let l = 0, r = s.length - 1;
  while (l < r) {
    if (s[l++] !== s[r--]) return false;
  }
  return true;
}

const fs = require("fs");
const s = fs.readFileSync(0, "utf8").trim();
console.log(isPalindrome(s));`,
        PYTHON: `class Solution:
    def isPalindrome(self, s: str) -> bool:
        s = "".join(c.lower() for c in s if c.isalnum())
        return s == s[::-1]

import sys
s = sys.stdin.readline().strip()
print(str(Solution().isPalindrome(s)).lower())`,
        JAVA: `import java.util.*;

class Main {
    public static boolean isPalindrome(String s) {
        s = s.replaceAll("[^a-zA-Z0-9]", "").toLowerCase();
        int l = 0, r = s.length() - 1;
        while (l < r) {
            if (s.charAt(l++) != s.charAt(r--)) return false;
        }
        return true;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.nextLine();
        System.out.println(isPalindrome(s));
    }
}`,
    },
};
