export const arrayContent = {
  children: {
    prefix_sum: {
      title: "🌟 Fun with Adding Numbers!",
      description: "Let's learn how to add numbers quickly and make it super fun!",
      code: `# Let's learn about adding numbers! 🎈

numbers = [2, 4, 1, 5, 3]  # Our magical list of numbers
print("Our special numbers:", numbers)

# Let's add them up one by one like a counting game!
total = 0
print("\\nTime to add! Watch the numbers grow:")
for num in numbers:
    total = total + num  # Add the new number to our total
    print(f"Adding {num} to our total... Now we have {total}! ✨")

print("\\nWow! The final total is:", total)
print("Great job! You're amazing at adding numbers! 🌟")`,
      examples: {
        simple: "Add small numbers",
        fun: "Add bigger numbers",
        game: "Number adding game"
      }
    },
    binary_search: {
      title: "🎯 Find the Hidden Number!",
      description: "Learn how to find numbers quickly with a fun guessing game!",
      code: `# Let's play a number finding game! 🎮

# Here are our sorted numbers
numbers = [1, 3, 5, 7, 9, 11, 13, 15]
print("Our numbers:", numbers)

# Let's find a number!
number_to_find = 7
print(f"\\nLet's find the number {number_to_find}! 🎯")

# Start our search
left = 0
right = len(numbers) - 1

while left <= right:
    middle = (left + right) // 2
    guess = numbers[middle]
    
    print(f"\\nIs it {guess}? 🤔")
    
    if guess == number_to_find:
        print(f"Yes! We found {number_to_find}! 🎉")
        break
    elif guess > number_to_find:
        print("Too big! Let's look in the smaller numbers 👇")
        right = middle - 1
    else:
        print("Too small! Let's look in the bigger numbers 👆")
        left = middle + 1`
    }
  },
  intermediate: {
    prefix_sum: {
      title: "Prefix Sum Technique",
      description: "Learn how to efficiently calculate range sums using prefix arrays",
      code: `# Prefix Sum Implementation
def build_prefix_sum(arr):
    """Build prefix sum array for efficient range sum queries."""
    prefix = [0] * (len(arr) + 1)
    print("Building prefix sum array:")
    for i in range(len(arr)):
        prefix[i + 1] = prefix[i] + arr[i]
        print(f"Step {i + 1}: Adding {arr[i]}, Prefix sum: {prefix[i + 1]}")
    return prefix

def range_sum(prefix, left, right):
    """Calculate sum between two indices in O(1) time."""
    return prefix[right + 1] - prefix[left]

# Example usage
numbers = [4, 2, 7, 1, 5]
print(f"Original array: {numbers}\\n")

# Build prefix sum array
prefix = build_prefix_sum(numbers)
print(f"\\nComplete prefix sum array: {prefix}")

# Calculate some range sums
print("\\nTesting range sums:")
test_ranges = [(0, 2), (1, 3), (2, 4)]
for left, right in test_ranges:
    sum_val = range_sum(prefix, left, right)
    print(f"Sum from index {left} to {right}: {sum_val}")`,
      examples: {
        basic: "Basic prefix sum",
        range_queries: "Range queries",
        applications: "Real applications"
      }
    },
    binary_search: {
      title: "Binary Search Algorithm",
      description: "Master the efficient searching technique for sorted arrays",
      code: `# Binary Search Implementation
def binary_search(arr, target):
    """
    Perform binary search to find target in sorted array.
    Returns index if found, -1 if not found.
    """
    left, right = 0, len(arr) - 1
    
    while left <= right:
        mid = (left + right) // 2
        print(f"Searching between indices {left} and {right}")
        print(f"Checking middle element at index {mid}: {arr[mid]}")
        
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            print(f"{arr[mid]} is too small, searching right half\\n")
            left = mid + 1
        else:
            print(f"{arr[mid]} is too large, searching left half\\n")
            right = mid - 1
    
    return -1

# Test the implementation
numbers = [1, 3, 5, 7, 9, 11, 13, 15, 17]
target = 11

print(f"Array: {numbers}")
print(f"Searching for: {target}\\n")

result = binary_search(numbers, target)
if result != -1:
    print(f"\\nFound {target} at index {result}")
else:
    print(f"\\n{target} not found in array")`
    }
  },
  professional: {
    prefix_sum: {
      title: "Advanced Prefix Sum Applications",
      description: "Explore professional implementations and optimizations of prefix sum techniques",
      code: `# Advanced Prefix Sum Implementation with Multiple Applications
class PrefixSumProcessor:
    def __init__(self, arr):
        self.arr = arr
        self.prefix = self._build_prefix_sum()
        self.prefix_squares = self._build_prefix_squares()
    
    def _build_prefix_sum(self):
        """Build standard prefix sum array."""
        n = len(self.arr)
        prefix = [0] * (n + 1)
        for i in range(n):
            prefix[i + 1] = prefix[i] + self.arr[i]
        return prefix
    
    def _build_prefix_squares(self):
        """Build prefix sum of squares for variance calculations."""
        n = len(self.arr)
        prefix = [0] * (n + 1)
        for i in range(n):
            prefix[i + 1] = prefix[i] + self.arr[i] * self.arr[i]
        return prefix
    
    def range_sum(self, left: int, right: int) -> int:
        """Get sum of range in O(1) time."""
        return self.prefix[right + 1] - self.prefix[left]
    
    def range_mean(self, left: int, right: int) -> float:
        """Calculate mean of range in O(1) time."""
        range_sum = self.range_sum(left, right)
        range_length = right - left + 1
        return range_sum / range_length
    
    def range_variance(self, left: int, right: int) -> float:
        """Calculate variance of range in O(1) time."""
        n = right - left + 1
        sum_sq = self.prefix_squares[right + 1] - self.prefix_squares[left]
        sum_x = self.range_sum(left, right)
        mean = sum_x / n
        return (sum_sq / n) - (mean * mean)
    
    def find_subarray_with_sum(self, target: int) -> tuple:
        """Find a subarray that sums to target using hash map."""
        sum_map = {0: -1}
        for i in range(len(self.arr)):
            curr_sum = self.prefix[i + 1]
            if curr_sum - target in sum_map:
                return (sum_map[curr_sum - target] + 1, i)
            sum_map[curr_sum] = i
        return None

# Example usage
arr = [4, 2, -1, 3, 7, -2, 1]
processor = PrefixSumProcessor(arr)

print("Array Analysis:")
print(f"Input array: {arr}")
print(f"Prefix sums: {processor.prefix[1:]}\\n")

# Demonstrate range queries
ranges = [(0, 2), (1, 4), (3, 6)]
print("Range Analysis:")
for left, right in ranges:
    print(f"\\nRange [{left}, {right}]:")
    print(f"Sum: {processor.range_sum(left, right)}")
    print(f"Mean: {processor.range_mean(left, right):.2f}")
    print(f"Variance: {processor.range_variance(left, right):.2f}")

# Find subarray with sum
target = 8
result = processor.find_subarray_with_sum(target)
if result:
    start, end = result
    print(f"\\nSubarray with sum {target}: {arr[start:end+1]}")
    print(f"Indices: [{start}, {end}]")`,
      examples: {
        optimization: "Performance optimization",
        advanced: "Advanced techniques",
        enterprise: "Enterprise patterns"
      }
    },
    binary_search: {
      title: "Binary Search Variants & Applications",
      description: "Advanced binary search patterns and optimizations for professional applications",
      code: `# Advanced Binary Search Implementations
from typing import List, Tuple, Optional
from enum import Enum
import bisect

class SearchType(Enum):
    FIRST_OCCURRENCE = 1
    LAST_OCCURRENCE = 2
    CLOSEST_ELEMENT = 3

class BinarySearchProcessor:
    def __init__(self, arr: List[int]):
        self.arr = arr
        self._validate_array()
    
    def _validate_array(self):
        """Ensure array is sorted."""
        if not all(self.arr[i] <= self.arr[i + 1] for i in range(len(self.arr) - 1)):
            raise ValueError("Array must be sorted")
    
    def search(self, target: int, search_type: SearchType = SearchType.FIRST_OCCURRENCE) -> int:
        """Unified binary search with different variants."""
        if not self.arr:
            return -1
            
        left, right = 0, len(self.arr) - 1
        result = -1
        
        while left <= right:
            mid = left + (right - left) // 2  # Avoid potential overflow
            
            if search_type == SearchType.CLOSEST_ELEMENT:
                if mid == len(self.arr) - 1 or (
                    self.arr[mid] <= target < self.arr[mid + 1]
                ):
                    return mid
            
            if self.arr[mid] == target:
                result = mid
                if search_type == SearchType.FIRST_OCCURRENCE:
                    right = mid - 1
                elif search_type == SearchType.LAST_OCCURRENCE:
                    left = mid + 1
                else:
                    return mid
            elif self.arr[mid] < target:
                left = mid + 1
            else:
                right = mid - 1
        
        return result
    
    def find_range(self, target: int) -> Tuple[int, int]:
        """Find the range of target element occurrences."""
        first = self.search(target, SearchType.FIRST_OCCURRENCE)
        if first == -1:
            return (-1, -1)
        last = self.search(target, SearchType.LAST_OCCURRENCE)
        return (first, last)
    
    def search_insert_position(self, target: int) -> int:
        """Find index where target should be inserted to maintain order."""
        return bisect.bisect_left(self.arr, target)
    
    def find_closest_elements(self, target: int, k: int) -> List[int]:
        """Find k closest elements to target."""
        if k <= 0:
            return []
            
        pos = self.search(target, SearchType.CLOSEST_ELEMENT)
        left = pos
        right = pos + 1
        result = []
        
        while len(result) < k and (left >= 0 or right < len(self.arr)):
            if left >= 0 and right < len(self.arr):
                if abs(self.arr[left] - target) <= abs(self.arr[right] - target):
                    result.append(self.arr[left])
                    left -= 1
                else:
                    result.append(self.arr[right])
                    right += 1
            elif left >= 0:
                result.append(self.arr[left])
                left -= 1
            else:
                result.append(self.arr[right])
                right += 1
        
        return sorted(result)

# Example usage
numbers = [1, 2, 2, 2, 3, 4, 4, 5, 6, 6, 6, 7]
processor = BinarySearchProcessor(numbers)

print("Array:", numbers)

# Test different search types
target = 6
print(f"\\nSearching for {target}:")
print(f"First occurrence: {processor.search(target, SearchType.FIRST_OCCURRENCE)}")
print(f"Last occurrence: {processor.search(target, SearchType.LAST_OCCURRENCE)}")
print(f"Range of occurrences: {processor.find_range(target)}")

# Test insert position
target = 3.5
pos = processor.search_insert_position(target)
print(f"\\nInsert position for {target}: {pos}")

# Test closest elements
target = 4
k = 3
closest = processor.find_closest_elements(target, k)
print(f"\\n{k} closest elements to {target}: {closest}")`
    }
  }
};
