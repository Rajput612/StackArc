import { DIFFICULTY } from '../utils/constants';

export const stringProblems = [
  {
    id: 1,
    title: "KMP Pattern Matching",
    difficulty: DIFFICULTY.HARD,
    description: "Implement the Knuth-Morris-Pratt (KMP) pattern matching algorithm.",
    solution: `def kmp_search(text, pattern):
    if not pattern or not text:
        return -1
        
    # Build LPS array
    def build_lps():
        lps = [0] * len(pattern)
        length = 0
        i = 1
        
        while i < len(pattern):
            if pattern[i] == pattern[length]:
                length += 1
                lps[i] = length
                i += 1
            else:
                if length != 0:
                    length = lps[length - 1]
                else:
                    lps[i] = 0
                    i += 1
        return lps
    
    lps = build_lps()
    i = j = 0  # i for text, j for pattern
    
    while i < len(text):
        if pattern[j] == text[i]:
            i += 1
            j += 1
            if j == len(pattern):
                return i - j
        else:
            if j != 0:
                j = lps[j - 1]
            else:
                i += 1
    
    return -1`,
    explanation: "KMP algorithm uses a preprocessed LPS (Longest Proper Prefix which is also Suffix) array to avoid unnecessary comparisons during pattern matching."
  },
  {
    id: 2,
    title: "Implement Trie",
    difficulty: DIFFICULTY.MEDIUM,
    description: "Implement a trie (prefix tree) with insert, search, and startsWith methods.",
    solution: `class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end = False

class Trie:
    def __init__(self):
        self.root = TrieNode()
    
    def insert(self, word: str) -> None:
        node = self.root
        for char in word:
            if char not in node.children:
                node.children[char] = TrieNode()
            node = node.children[char]
        node.is_end = True
    
    def search(self, word: str) -> bool:
        node = self.root
        for char in word:
            if char not in node.children:
                return False
            node = node.children[char]
        return node.is_end
    
    def startsWith(self, prefix: str) -> bool:
        node = self.root
        for char in prefix:
            if char not in node.children:
                return False
            node = node.children[char]
        return True`,
    explanation: "Implements a trie using a tree structure where each node contains a map of children and a flag indicating if it's the end of a word."
  }
];