export const pythonBasicsCourse = {
  id: 'python-basics',
  title: 'Python Basics',
  description: 'A comprehensive introduction to Python programming',
  concepts: [
    {
      id: 'introduction',
      title: 'Introduction to Python',
      description: 'Learn what Python is and write your first program',
      content: `
# Introduction to Python

Python is a high-level, interpreted programming language known for its simplicity and readability. It's one of the most popular programming languages in the world, used in:

- Web Development
- Data Science
- Artificial Intelligence
- Automation
- Scientific Computing

## Your First Python Program

Let's write the traditional "Hello, World!" program:

\`\`\`python
print("Hello, World!")
\`\`\`

### Understanding the Code:
1. \`print()\` is a built-in function that outputs text to the screen
2. The text inside quotes (" ") is called a string
3. Python executes code line by line, from top to bottom

## Python Features

1. **Easy to Learn**
   - Clear, readable syntax
   - Similar to writing English
   - Minimal special characters

2. **Interpreted**
   - No compilation needed
   - Run code directly
   - See results immediately

3. **Dynamic Typing**
   - No need to declare variable types
   - Python figures out types automatically

4. **Large Standard Library**
   - "Batteries included" philosophy
   - Many built-in functions and modules
   - Extensive third-party packages

Try running the code in the playground and experiment with different print statements!
`,
      duration: '30 minutes',
      difficulty: 'Beginner',
      exercises: [
        {
          title: 'Hello World',
          description: 'Write a program that prints "Hello, Python!"',
          code: '# Write your code here\n',
          solution: 'print("Hello, Python!")'
        },
        {
          title: 'Multiple Lines',
          description: 'Print three different messages on separate lines',
          code: '# Write three print statements\n',
          solution: 'print("First line")\nprint("Second line")\nprint("Third line")'
        }
      ]
    },
    {
      id: 'variables',
      title: 'Variables and Data Types',
      description: 'Learn about variables and basic data types in Python',
      content: `
# Variables and Data Types

Variables are containers for storing data values. In Python, you don't need to declare variable types explicitly.

## Variable Assignment

\`\`\`python
name = "Alice"      # String
age = 25           # Integer
height = 1.75      # Float
is_student = True  # Boolean
\`\`\`

## Basic Data Types

1. **Strings (str)**
   - Text data
   - Created using quotes
   \`\`\`python
   message = "Hello"
   name = 'Alice'
   multiline = """This is a
   multiline string"""
   \`\`\`

2. **Numbers**
   - Integers (int): Whole numbers
   - Floats (float): Decimal numbers
   \`\`\`python
   age = 25
   price = 19.99
   \`\`\`

3. **Booleans (bool)**
   - True or False values
   \`\`\`python
   is_active = True
   is_complete = False
   \`\`\`

## Type Conversion

You can convert between different types:

\`\`\`python
# String to int
age_str = "25"
age_num = int(age_str)

# Int to string
number = 100
num_str = str(number)

# String to float
price_str = "19.99"
price_num = float(price_str)
\`\`\`

## Variable Naming Rules

1. Must start with a letter or underscore
2. Can contain letters, numbers, and underscores
3. Case-sensitive (age and Age are different)
4. Cannot use Python keywords

Good names:
- user_name
- age
- total_price

Bad names:
- 1st_name (starts with number)
- my-name (contains hyphen)
- class (Python keyword)

Try experimenting with different variables in the playground!
`,
      duration: '45 minutes',
      difficulty: 'Beginner',
      exercises: [
        {
          title: 'Variable Practice',
          description: 'Create variables of different types and print them',
          code: `# Create variables here:
# 1. A string variable for a name
# 2. An integer variable for age
# 3. A float variable for height
# 4. A boolean variable for is_student
# Then print all variables

`,
          solution: `name = "John"
age = 20
height = 1.75
is_student = True

print("Name:", name)
print("Age:", age)
print("Height:", height)
print("Is Student:", is_student)`
        },
        {
          title: 'Type Conversion',
          description: 'Practice converting between different data types',
          code: `# 1. Convert "123" to an integer
# 2. Convert 123 to a string
# 3. Convert "3.14" to a float
# Print each result

`,
          solution: `# String to integer
num_str = "123"
num_int = int(num_str)
print("String to integer:", num_int)

# Integer to string
num = 123
num_str = str(num)
print("Integer to string:", num_str)

# String to float
pi_str = "3.14"
pi_float = float(pi_str)
print("String to float:", pi_float)`
        }
      ]
    },
    {
      id: 'operators',
      title: 'Operators and Expressions',
      description: 'Learn about different operators and how to use them',
      content: `
# Operators and Expressions

Operators are special symbols that perform operations on variables and values.

## Arithmetic Operators

\`\`\`python
# Basic arithmetic
a = 10
b = 3

addition = a + b        # 13
subtraction = a - b     # 7
multiplication = a * b  # 30
division = a / b        # 3.333...
floor_division = a // b # 3
modulus = a % b        # 1
exponent = a ** b      # 1000
\`\`\`

## Comparison Operators

\`\`\`python
x = 5
y = 10

equal = x == y          # False
not_equal = x != y      # True
greater = x > y         # False
less = x < y            # True
greater_equal = x >= y  # False
less_equal = x <= y     # True
\`\`\`

## Logical Operators

\`\`\`python
p = True
q = False

and_result = p and q  # False
or_result = p or q    # True
not_result = not p    # False
\`\`\`

## Assignment Operators

\`\`\`python
# Simple assignment
x = 5

# Compound assignment
x += 3   # Same as: x = x + 3
x -= 2   # Same as: x = x - 2
x *= 4   # Same as: x = x * 4
x /= 2   # Same as: x = x / 2
\`\`\`

## String Operators

\`\`\`python
# Concatenation
first = "Hello"
second = "World"
message = first + " " + second  # "Hello World"

# Repetition
repeat = "Ha" * 3  # "HaHaHa"
\`\`\`

Try these operators in the playground and see how they work!
`,
      duration: '45 minutes',
      difficulty: 'Beginner',
      exercises: [
        {
          title: 'Calculator',
          description: 'Create a simple calculator using arithmetic operators',
          code: `# Create two variables with numbers
# Perform all arithmetic operations
# Print the results

`,
          solution: `a = 15
b = 4

print("Addition:", a + b)
print("Subtraction:", a - b)
print("Multiplication:", a * b)
print("Division:", a / b)
print("Floor Division:", a // b)
print("Modulus:", a % b)
print("Exponent:", a ** b)`
        },
        {
          title: 'Comparison Chain',
          description: 'Practice using comparison and logical operators',
          code: `# Create three number variables
# Compare them using different operators
# Use logical operators to combine comparisons

`,
          solution: `x = 5
y = 10
z = 15

# Comparisons
print("x < y:", x < y)
print("y < z:", y < z)
print("x < y < z:", x < y < z)

# Logical combinations
print("x < y and y < z:", x < y and y < z)
print("x > y or y < z:", x > y or y < z)
print("not x > y:", not x > y)`
        }
      ]
    }
  ]
};
