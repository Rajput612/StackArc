interface Concept {
  id: string;
  title: string;
  description: string;
  content: string;
  duration: string;
  difficulty: string;
  exercises: Array<{
    title: string;
    description: string;
    code?: string;
    solution?: string;
  }>;
}

interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  level: string;
  rating: string;
  enrolled: string;
  concepts: Concept[];
}

export const courseContent: Record<string, Course> = {
  'python-basics': {
    id: 'python-basics',
    title: 'Python Basic',
    description: 'Master Python basics including syntax, data types, control structures, and functions',
    duration: '4 weeks',
    level: 'Beginner',
    rating: '4.8',
    enrolled: '1,234',
    concepts: [
      {
        id: 'getting-started',
        title: 'Getting Started with Python',
        description: 'Learn Python syntax, installation, and write your first program',
        content: `
# Getting Started with Python

Python is a popular programming language created by Guido van Rossum in 1991.

## What is Python?

Python is used for:
- Web development (server-side)
- Software development
- Mathematics and data science
- System scripting

## Why Python?

- Works on different platforms (Windows, Mac, Linux)
- Simple syntax similar to English
- Can be written with fewer lines than other languages
- Runs with an interpreter system

## Python Installation

1. Download Python from python.org:
   - Select your OS (Windows, Mac, Linux)
   - Download latest version (e.g., Python 3.12)

2. Install Python:
   - Check "Add Python to PATH" on Windows
   - Verify installation in terminal:
   \`\`\`bash
   python --version
   \`\`\`

## Your First Python Program

Create a file named \`hello.py\`:

\`\`\`python
print("Hello, World!")
\`\`\`

## Python Indentation

Indentation refers to the spaces at the beginning of a code line:

\`\`\`python
if 5 > 2:
    print("Five is greater than two!")  # Indented with 4 spaces
\`\`\`

Indentation is crucial in Python - it indicates a block of code.
`,
        duration: '30 minutes',
        difficulty: 'Beginner',
        exercises: [
          {
            title: 'Hello World',
            description: 'Write a program that prints "Hello, World!"',
            code: '# Write your first Python program\n',
            solution: 'print("Hello, World!")'
          },
          {
            title: 'Basic Print',
            description: 'Print your name and age on separate lines',
            code: '# Print your name and age\n',
            solution: 'print("John Doe")\nprint(25)'
          }
        ]
      },
      {
        id: 'syntax',
        title: 'Python Syntax',
        description: 'Learn Python syntax including variables, comments, and data types',
        content: `
# Python Syntax

Learn the basic syntax rules of Python programming.

## Python Variables

Variables are containers for storing data values:

\`\`\`python
x = 5          # Integer
name = "John"  # String
is_true = True # Boolean
\`\`\`

Variables are created when you first assign a value.

## Comments

Comments start with a #:

\`\`\`python
# This is a comment
print("Hello")  # This is also a comment

# Multi-line comment using multiple #
# Line 1
# Line 2
\`\`\`

## Data Types

Python has these basic data types:

\`\`\`python
# Text Type
text = "Hello World"     # str

# Numeric Types
x = 20                   # int
y = 20.5                 # float
z = 1j                   # complex

# Sequence Types
my_list = ["apple", "banana"]    # list
my_tuple = ("apple", "banana")   # tuple
my_range = range(6)              # range

# Mapping Type
my_dict = {"name": "John", "age": 36}  # dict

# Set Types
my_set = {"apple", "banana"}     # set

# Boolean Type
is_true = True                   # bool

# None Type
x = None                         # NoneType
\`\`\`

## Type Conversion

Convert between types:

\`\`\`python
x = str(3)     # '3'
y = int(3)     # 3
z = float(3)   # 3.0
\`\`\`
`,
        duration: '45 minutes',
        difficulty: 'Beginner',
        exercises: [
          {
            title: 'Variable Assignment',
            description: 'Create variables of different types and print them',
            code: '# Create and print different variables\n# 1. Create an integer x with value 10\n# 2. Create a string name with your name\n# 3. Create a boolean is_student\n',
            solution: `x = 10
name = "John"
is_student = True
print(x)
print(name)
print(is_student)`
          },
          {
            title: 'Type Conversion',
            description: 'Convert between different data types',
            code: '# 1. Convert "100" to integer\n# 2. Convert 3.14 to integer\n# 3. Convert 42 to string\n',
            solution: `# String to integer
num1 = int("100")
print(num1)

# Float to integer
num2 = int(3.14)
print(num2)

# Integer to string
text = str(42)
print(text)`
          }
        ]
      },
      {
        id: 'numbers',
        title: 'Python Numbers',
        description: 'Work with numeric data types and mathematical operations',
        content: `
# Python Numbers

Python has three numeric types: int, float, and complex.

## Number Types

\`\`\`python
x = 1    # int
y = 2.8  # float
z = 1j   # complex

# Type verification
print(type(x))  # <class 'int'>
print(type(y))  # <class 'float'>
print(type(z))  # <class 'complex'>
\`\`\`

## Integer Numbers

Integers (whole numbers) can be of any length:

\`\`\`python
x = 1
y = 35656222554887711
z = -3255522

print(type(x))  # All are type 'int'
\`\`\`

## Float Numbers

Float numbers can be scientific numbers with an "e" to indicate power of 10:

\`\`\`python
x = 35e3    # 35000.0
y = 12E4    # 120000.0
z = -87.7e100

print(type(x))  # All are type 'float'
\`\`\`

## Mathematical Operations

Basic operations:

\`\`\`python
x = 5
y = 2

print(x + y)   # Addition
print(x - y)   # Subtraction
print(x * y)   # Multiplication
print(x / y)   # Division
print(x % y)   # Modulus
print(x ** y)  # Exponentiation
print(x // y)  # Floor division
\`\`\`

## Built-in Math Functions

Common math functions:

\`\`\`python
x = -7.25

print(abs(x))      # Absolute value: 7.25
print(pow(2, 3))   # Power: 8
print(round(3.7))  # Round: 4
\`\`\`
`,
        duration: '45 minutes',
        difficulty: 'Beginner',
        exercises: [
          {
            title: 'Basic Calculations',
            description: 'Perform basic mathematical operations',
            code: '# 1. Add 15 and 7\n# 2. Multiply 3.14 by 2\n# 3. Divide 20 by 3 and round the result\n',
            solution: `# Addition
result1 = 15 + 7
print(result1)

# Multiplication
result2 = 3.14 * 2
print(result2)

# Division and rounding
result3 = round(20 / 3)
print(result3)`
          },
          {
            title: 'Temperature Conversion',
            description: 'Convert Celsius to Fahrenheit using the formula: F = C * 9/5 + 32',
            code: '# Convert 25°C to Fahrenheit\ncelsius = 25\n',
            solution: `celsius = 25
fahrenheit = celsius * 9/5 + 32
print(f"{celsius}°C is {fahrenheit}°F")`
          }
        ]
      }
    ]
  },
  'python-advanced': {
    id: 'python-advanced',
    title: 'Python Advanced',
    description: 'Deep dive into advanced Python concepts including decorators, generators, and metaclasses',
    duration: '6 weeks',
    level: 'Advanced',
    rating: '4.9',
    enrolled: '856',
    concepts: []
  },
  'data-structures': {
    id: 'data-structures',
    title: 'Data Structures',
    description: 'Learn essential data structures implementation in Python',
    duration: '8 weeks',
    level: 'Intermediate',
    rating: '4.7',
    enrolled: '978',
    concepts: []
  },
  'django': {
    id: 'django',
    title: 'Django',
    description: 'Build web applications with Django framework including MVT, ORM, and REST APIs',
    duration: '10 weeks',
    level: 'Intermediate',
    rating: '4.8',
    enrolled: '1,567',
    concepts: []
  },
  'docker': {
    id: 'docker',
    title: 'Docker',
    description: 'Master containerization with Docker, compose, and container orchestration',
    duration: '6 weeks',
    level: 'Intermediate',
    rating: '4.7',
    enrolled: '892',
    concepts: []
  },
  'gunicorn': {
    id: 'gunicorn',
    title: 'Gunicorn',
    description: 'Deploy Python web applications with Gunicorn WSGI HTTP Server',
    duration: '3 weeks',
    level: 'Intermediate',
    rating: '4.6',
    enrolled: '456',
    concepts: []
  },
  'nginx': {
    id: 'nginx',
    title: 'Nginx',
    description: 'Configure and optimize Nginx as a web server, reverse proxy, and load balancer',
    duration: '4 weeks',
    level: 'Advanced',
    rating: '4.7',
    enrolled: '678',
    concepts: []
  },
  'sql-mastery': {
    id: 'sql-mastery',
    title: 'SQL Mastery',
    description: 'Master SQL database design, queries, optimization, and best practices',
    duration: '8 weeks',
    level: 'Intermediate',
    rating: '4.9',
    enrolled: '1,234',
    concepts: []
  },
  'git-github': {
    id: 'git-github',
    title: 'Git & GitHub',
    description: 'Learn version control, collaboration, and project management with Git and GitHub',
    duration: '4 weeks',
    level: 'Beginner',
    rating: '4.8',
    enrolled: '2,345',
    concepts: []
  }
}
