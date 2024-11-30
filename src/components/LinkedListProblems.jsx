import React from 'react';
import CodeBlock from './CodeBlock';

const problems = [
  {
    id: 1,
    title: "Remove Nth Node From End",
    difficulty: "Medium",
    description: "Remove the nth node from the end of the linked list and return its head.",
    solution: `def removeNthFromEnd(head, n):
    dummy = ListNode(0)
    dummy.next = head
    first = dummy
    second = dummy
    
    # Advance first pointer by n+1 steps
    for i in range(n + 1):
        first = first.next
        
    # Move both pointers until first reaches end
    while first:
        first = first.next
        second = second.next
        
    # Remove nth node
    second.next = second.next.next
    return dummy.next`,
    explanation: "Use two pointers with a gap of n nodes. When the first pointer reaches the end, the second pointer will be at the node before the one to be removed."
  },
  {
    id: 2,
    title: "Merge K Sorted Lists",
    difficulty: "Hard",
    description: "Merge k sorted linked lists into one sorted linked list.",
    solution: `from heapq import heappush, heappop

def mergeKLists(lists):
    # Custom comparison for ListNode
    ListNode.__lt__ = lambda self, other: self.val < other.val
    
    heap = []
    # Add first node from each list
    for l in lists:
        if l:
            heappush(heap, l)
    
    dummy = ListNode(0)
    curr = dummy
    
    while heap:
        node = heappop(heap)
        curr.next = node
        curr = curr.next
        if node.next:
            heappush(heap, node.next)
    
    return dummy.next`,
    explanation: "Use a min-heap to efficiently select the smallest node among the k lists. Time complexity: O(N log k) where N is total nodes."
  },
  {
    id: 3,
    title: "Sort List",
    difficulty: "Medium",
    description: "Sort a linked list using O(n log n) time and O(1) space.",
    solution: `def sortList(head):
    if not head or not head.next:
        return head
        
    # Find middle
    slow = fast = head
    prev = None
    while fast and fast.next:
        fast = fast.next.next
        prev = slow
        slow = slow.next
    prev.next = None
    
    # Recursively sort both halves
    left = sortList(head)
    right = sortList(slow)
    
    # Merge sorted halves
    return mergeLists(left, right)

def mergeLists(l1, l2):
    dummy = ListNode(0)
    curr = dummy
    
    while l1 and l2:
        if l1.val <= l2.val:
            curr.next = l1
            l1 = l1.next
        else:
            curr.next = l2
            l2 = l2.next
        curr = curr.next
    
    curr.next = l1 or l2
    return dummy.next`,
    explanation: "Implement merge sort for linked list. Split list in half recursively, then merge sorted halves."
  },
  {
    id: 4,
    title: "Copy List with Random Pointer",
    difficulty: "Medium",
    description: "Create a deep copy of a linked list where each node has a random pointer.",
    solution: `def copyRandomList(head):
    if not head:
        return None
    
    # First pass: create copies
    curr = head
    while curr:
        new_node = Node(curr.val)
        new_node.next = curr.next
        curr.next = new_node
        curr = new_node.next
    
    # Second pass: assign random pointers
    curr = head
    while curr:
        if curr.random:
            curr.next.random = curr.random.next
        curr = curr.next.next
    
    # Third pass: separate lists
    dummy = Node(0)
    curr_new = dummy
    curr = head
    while curr:
        curr_new.next = curr.next
        curr.next = curr.next.next
        curr = curr.next
        curr_new = curr_new.next
    
    return dummy.next`,
    explanation: "Use three passes: create interleaved copies, assign random pointers, then separate the lists."
  },
  {
    id: 5,
    title: "LRU Cache",
    difficulty: "Medium",
    description: "Implement a Least Recently Used (LRU) cache using a doubly linked list.",
    solution: `class Node:
    def __init__(self, key=0, value=0):
        self.key = key
        self.value = value
        self.prev = None
        self.next = None

class LRUCache:
    def __init__(self, capacity):
        self.capacity = capacity
        self.cache = {}
        self.head = Node()
        self.tail = Node()
        self.head.next = self.tail
        self.tail.prev = self.head
    
    def get(self, key):
        if key in self.cache:
            node = self.cache[key]
            self._remove(node)
            self._add(node)
            return node.value
        return -1
    
    def put(self, key, value):
        if key in self.cache:
            self._remove(self.cache[key])
        node = Node(key, value)
        self._add(node)
        self.cache[key] = node
        if len(self.cache) > self.capacity:
            lru = self.head.next
            self._remove(lru)
            del self.cache[lru.key]
    
    def _remove(self, node):
        node.prev.next = node.next
        node.next.prev = node.prev
    
    def _add(self, node):
        prev = self.tail.prev
        prev.next = node
        self.tail.prev = node
        node.prev = prev
        node.next = self.tail`,
    explanation: "Use a doubly linked list for O(1) removal and addition, with a hash map for O(1) lookups."
  },
  {
    id: 6,
    title: "Rotate List",
    difficulty: "Medium",
    description: "Rotate a linked list to the right by k places.",
    solution: `def rotateRight(head, k):
    if not head or not head.next or k == 0:
        return head
    
    # Find length and connect tail to head
    curr = head
    length = 1
    while curr.next:
        curr = curr.next
        length += 1
    curr.next = head
    
    # Find new tail position
    k = k % length
    pos = length - k
    curr = head
    for _ in range(pos - 1):
        curr = curr.next
    
    # Break the circle
    new_head = curr.next
    curr.next = None
    return new_head`,
    explanation: "Form a circle, then break it at the appropriate position. Handle edge cases carefully."
  },
  {
    id: 7,
    title: "Swap Nodes in Pairs",
    difficulty: "Medium",
    description: "Swap every two adjacent nodes in a linked list.",
    solution: `def swapPairs(head):
    dummy = ListNode(0)
    dummy.next = head
    prev = dummy
    
    while head and head.next:
        # Nodes to swap
        first = head
        second = head.next
        
        # Swapping
        prev.next = second
        first.next = second.next
        second.next = first
        
        # Move pointers
        prev = first
        head = first.next
    
    return dummy.next`,
    explanation: "Use three pointers to manage the swapping. Handle pairs iteratively."
  },
  {
    id: 8,
    title: "Add Two Numbers",
    difficulty: "Medium",
    description: "Add two numbers represented by linked lists.",
    solution: `def addTwoNumbers(l1, l2):
    dummy = ListNode(0)
    curr = dummy
    carry = 0
    
    while l1 or l2 or carry:
        val1 = l1.val if l1 else 0
        val2 = l2.val if l2 else 0
        
        # Calculate sum and carry
        total = val1 + val2 + carry
        carry = total // 10
        digit = total % 10
        
        # Create new node
        curr.next = ListNode(digit)
        curr = curr.next
        
        # Move pointers
        l1 = l1.next if l1 else None
        l2 = l2.next if l2 else None
    
    return dummy.next`,
    explanation: "Process digits one by one, maintaining a carry. Handle lists of different lengths."
  },
  {
    id: 9,
    title: "Partition List",
    difficulty: "Medium",
    description: "Partition list around a value x, keeping original order.",
    solution: `def partition(head, x):
    # Create two dummy nodes
    before = before_head = ListNode(0)
    after = after_head = ListNode(0)
    
    # Partition
    while head:
        if head.val < x:
            before.next = head
            before = before.next
        else:
            after.next = head
            after = after.next
        head = head.next
    
    # Connect parts
    after.next = None
    before.next = after_head.next
    return before_head.next`,
    explanation: "Maintain two separate lists for nodes less than x and greater or equal to x, then connect them."
  },
  {
    id: 10,
    title: "Odd Even Linked List",
    difficulty: "Medium",
    description: "Group all odd-indexed nodes together followed by even-indexed nodes.",
    solution: `def oddEvenList(head):
    if not head:
        return None
    
    odd = head
    even = head.next
    even_head = even
    
    while even and even.next:
        odd.next = even.next
        odd = odd.next
        even.next = odd.next
        even = even.next
    
    odd.next = even_head
    return head`,
    explanation: "Maintain two pointers for odd and even indices. Connect odd nodes, then even nodes, finally linking them together."
  }
];

const LinkedListProblems = () => {
  return (
    <div className="space-y-8">
      {problems.map((problem) => (
        <div key={problem.id} className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-800">{problem.title}</h3>
            <span className={`px-3 py-1 rounded-full text-sm ${
              problem.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
              problem.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {problem.difficulty}
            </span>
          </div>
          
          <p className="text-gray-600 mb-4">{problem.description}</p>
          
          <div className="mb-4">
            <h4 className="font-semibold text-gray-700 mb-2">Solution:</h4>
            <CodeBlock code={problem.solution} />
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-700 mb-2">Explanation:</h4>
            <p className="text-gray-600">{problem.explanation}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LinkedListProblems;