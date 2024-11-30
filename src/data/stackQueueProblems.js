import { DIFFICULTY } from '../utils/constants';

export const stackQueueProblems = [
  {
    id: 1,
    title: "Next Greater Element",
    difficulty: DIFFICULTY.MEDIUM,
    description: "Given an array, find the next greater element for each element in the array.",
    solution: `def nextGreaterElement(nums):
    n = len(nums)
    result = [-1] * n
    stack = []  # Stack to store indices
    
    # Process all elements from right to left
    for i in range(n-1, -1, -1):
        # Remove elements smaller than current
        while stack and nums[stack[-1]] <= nums[i]:
            stack.pop()
            
        # Update result if we found a greater element
        if stack:
            result[i] = nums[stack[-1]]
            
        # Add current element's index to stack
        stack.append(i)
    
    return result`,
    explanation: "Uses a monotonic stack to efficiently find the next greater element. Processes elements from right to left, maintaining a decreasing stack."
  },
  {
    id: 2,
    title: "Valid Parentheses",
    difficulty: DIFFICULTY.EASY,
    description: "Given a string containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
    solution: `def isValid(s: str) -> bool:
    stack = []
    pairs = {')': '(', '}': '{', ']': '['}
    
    for char in s:
        if char in '({[':
            stack.append(char)
        else:
            if not stack or stack.pop() != pairs[char]:
                return False
    
    return len(stack) == 0`,
    explanation: "Uses a stack to track opening brackets. When encountering a closing bracket, checks if it matches the most recent opening bracket."
  }
];