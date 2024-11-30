import React from 'react';
import CodeBlock from './CodeBlock';

const problems = [
  {
    id: 1,
    title: "Maximum Subarray",
    difficulty: "Medium",
    description: "Find the contiguous subarray with the largest sum.",
    solution: `# Kadane's Algorithm
# Time: O(n), Space: O(1)
def maxSubArray(nums):
    # Initialize current and maximum sum with first element
    curr_sum = max_sum = nums[0]
    
    # Iterate through array starting from second element
    for num in nums[1:]:
        # Either start new subarray or extend existing one
        curr_sum = max(num, curr_sum + num)
        # Update maximum sum if current sum is larger
        max_sum = max(max_sum, curr_sum)
    
    return max_sum`,
    explanation: "Uses Kadane's algorithm to maintain running sum and maximum sum seen so far. At each step, decides whether to start new subarray or extend existing one."
  },
  {
    id: 2,
    title: "Container With Most Water",
    difficulty: "Medium",
    description: "Find two lines that together with x-axis forms a container that would hold the most water.",
    solution: `# Two Pointer Technique
# Time: O(n), Space: O(1)
def maxArea(height):
    # Initialize pointers at both ends
    left, right = 0, len(height) - 1
    max_area = 0
    
    while left < right:
        # Calculate current area
        width = right - left
        h = min(height[left], height[right])
        area = width * h
        max_area = max(max_area, area)
        
        # Move pointer with smaller height
        if height[left] < height[right]:
            left += 1
        else:
            right -= 1
    
    return max_area`,
    explanation: "Uses two pointers to find maximum area. Always moves the pointer with smaller height inward, as moving the larger height would only decrease area."
  },
  {
    id: 3,
    title: "3Sum",
    difficulty: "Medium",
    description: "Find all unique triplets that sum to zero.",
    solution: `# Sorting + Two Pointers
# Time: O(n²), Space: O(1)
def threeSum(nums):
    # Sort array for two-pointer technique
    nums.sort()
    result = []
    
    # Fix first number and find pairs for remaining sum
    for i in range(len(nums) - 2):
        # Skip duplicates for first number
        if i > 0 and nums[i] == nums[i-1]:
            continue
            
        # Two pointers for remaining two numbers
        left, right = i + 1, len(nums) - 1
        target = -nums[i]
        
        while left < right:
            curr_sum = nums[left] + nums[right]
            if curr_sum == target:
                result.append([nums[i], nums[left], nums[right]])
                # Skip duplicates
                while left < right and nums[left] == nums[left+1]:
                    left += 1
                while left < right and nums[right] == nums[right-1]:
                    right -= 1
                left += 1
                right -= 1
            elif curr_sum < target:
                left += 1
            else:
                right -= 1
    
    return result`,
    explanation: "Sorts array first, then fixes one number and uses two pointers to find pairs that sum to its negative. Handles duplicates carefully to ensure unique triplets."
  },
  {
    id: 4,
    title: "Next Permutation",
    difficulty: "Medium",
    description: "Implement next permutation, which rearranges numbers into lexicographically next greater permutation.",
    solution: `# In-place Modification
# Time: O(n), Space: O(1)
def nextPermutation(nums):
    # Find first decreasing element from right
    i = len(nums) - 2
    while i >= 0 and nums[i] >= nums[i + 1]:
        i -= 1
    
    if i >= 0:
        # Find smallest number greater than nums[i]
        j = len(nums) - 1
        while j >= 0 and nums[j] <= nums[i]:
            j -= 1
        # Swap numbers
        nums[i], nums[j] = nums[j], nums[i]
    
    # Reverse suffix
    left = i + 1
    right = len(nums) - 1
    while left < right:
        nums[left], nums[right] = nums[right], nums[left]
        left += 1
        right -= 1`,
    explanation: "Finds first decreasing element from right, swaps it with smallest larger number to its right, then reverses the suffix to get next permutation."
  },
  {
    id: 5,
    title: "Merge Intervals",
    difficulty: "Medium",
    description: "Merge all overlapping intervals.",
    solution: `# Sort + Linear Merge
# Time: O(n log n), Space: O(n)
def merge(intervals):
    # Sort intervals by start time
    intervals.sort(key=lambda x: x[0])
    merged = []
    
    for interval in intervals:
        # If merged is empty or no overlap
        if not merged or merged[-1][1] < interval[0]:
            merged.append(interval)
        else:
            # Merge with last interval
            merged[-1][1] = max(merged[-1][1], interval[1])
    
    return merged`,
    explanation: "Sorts intervals by start time, then merges overlapping intervals in linear pass. Uses last interval in result for comparison with current interval."
  },
  {
    id: 6,
    title: "Rotate Array",
    difficulty: "Medium",
    description: "Rotate array to right by k steps.",
    solution: `# Reverse Method
# Time: O(n), Space: O(1)
def rotate(nums, k):
    def reverse(nums, start, end):
        while start < end:
            nums[start], nums[end] = nums[end], nums[start]
            start += 1
            end -= 1
    
    n = len(nums)
    k = k % n  # Handle k > n case
    
    # Reverse entire array
    reverse(nums, 0, n - 1)
    # Reverse first k elements
    reverse(nums, 0, k - 1)
    # Reverse remaining elements
    reverse(nums, k, n - 1)`,
    explanation: "Uses three reverse operations to achieve rotation. First reverses entire array, then reverses first k elements and remaining elements separately."
  },
  {
    id: 7,
    title: "Find Missing Number",
    difficulty: "Easy",
    description: "Find missing number in array containing n distinct numbers in range [0, n].",
    solution: `# XOR Method
# Time: O(n), Space: O(1)
def missingNumber(nums):
    # XOR all numbers from 0 to n
    result = len(nums)
    for i in range(len(nums)):
        # XOR with both index and number
        result ^= i ^ nums[i]
    return result

# Alternative Math Method
def missingNumber2(nums):
    n = len(nums)
    expected_sum = n * (n + 1) // 2
    actual_sum = sum(nums)
    return expected_sum - actual_sum`,
    explanation: "Uses XOR properties: a^a=0 and a^0=a. XORing all numbers and indices will leave only missing number. Alternative method uses sum formula."
  },
  {
    id: 8,
    title: "Find Duplicate Number",
    difficulty: "Medium",
    description: "Find duplicate number in array containing n+1 integers in range [1, n].",
    solution: `# Floyd's Cycle Detection
# Time: O(n), Space: O(1)
def findDuplicate(nums):
    # First phase: detect cycle
    slow = fast = nums[0]
    while True:
        slow = nums[slow]
        fast = nums[nums[fast]]
        if slow == fast:
            break
    
    # Second phase: find entrance
    slow = nums[0]
    while slow != fast:
        slow = nums[slow]
        fast = nums[fast]
    
    return slow`,
    explanation: "Treats array as implicit linked list where nums[i] points to nums[nums[i]]. Uses Floyd's cycle detection to find duplicate which forms cycle."
  },
  {
    id: 9,
    title: "Longest Consecutive Sequence",
    difficulty: "Hard",
    description: "Find length of longest consecutive elements sequence in unsorted array.",
    solution: `# Hash Set Method
# Time: O(n), Space: O(n)
def longestConsecutive(nums):
    # Create hash set for O(1) lookups
    num_set = set(nums)
    max_length = 0
    
    for num in num_set:
        # Only check sequences from their smallest element
        if num - 1 not in num_set:
            current = num
            current_length = 1
            
            # Count consecutive numbers
            while current + 1 in num_set:
                current += 1
                current_length += 1
            
            max_length = max(max_length, current_length)
    
    return max_length`,
    explanation: "Uses hash set for O(1) lookups. Only starts counting sequence if number is sequence start (no num-1 in set). Ensures O(n) time despite nested loop."
  },
  {
    id: 10,
    title: "Product of Array Except Self",
    difficulty: "Medium",
    description: "Calculate product of all elements except self without division.",
    solution: `# Two Pass Method
# Time: O(n), Space: O(1)
def productExceptSelf(nums):
    n = len(nums)
    result = [1] * n
    
    # Calculate prefix products
    prefix = 1
    for i in range(n):
        result[i] = prefix
        prefix *= nums[i]
    
    # Calculate suffix products and combine
    suffix = 1
    for i in range(n-1, -1, -1):
        result[i] *= suffix
        suffix *= nums[i]
    
    return result`,
    explanation: "Uses two passes: first calculates prefix products, second calculates suffix products and combines with prefix. Avoids division and achieves O(1) extra space."
  }
];

const ArrayProblems = () => {
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

export default ArrayProblems;