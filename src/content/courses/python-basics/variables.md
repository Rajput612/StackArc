---
title: "Variables & Data Types"
description: "Learn about Python variables and different data types"
level: "beginner"
order: 3
codeExamples:
  - title: "Introduction to Variables"
    description: "Basic variable creation and printing"
    code: |
      # Basic variable examples
      name = "Alice"
      age = 25
      height = 1.75
      is_student = True

      print("Name:", name)
      print("Age:", age)
      print("Height:", height, "m")
      print("Is student?", is_student)

  - title: "Numbers in Python"
    description: "Arithmetic operations and number types"
    code: |
      # Number operations
      x = 10
      y = 3

      print("Basic Operations:")
      print("Addition:", x + y)        # 13
      print("Subtraction:", x - y)     # 7
      print("Multiplication:", x * y)  # 30
      print("Division:", x / y)        # 3.3333...
      print("Integer Division:", x // y)# 3
      print("Modulus:", x % y)         # 1
      print("Power:", x ** y)          # 1000

      # Float operations
      price = 19.99
      discount = 0.15
      final_price = price * (1 - discount)

      print("\nPrice Calculation:")
      print("Original price: $", price)
      print("Discount:", discount*100, "%")
      print("Final price: $", round(final_price, 2))

  - title: "Strings"
    description: "String manipulation and formatting"
    code: |
      # String operations
      text = "Hello, World!"
      print("Original text:", text)
      print("Uppercase:", text.upper())
      print("Lowercase:", text.lower())
      print("Length:", len(text))

      # String methods
      print("\nString methods:")
      print("Replace:", text.replace("Hello", "Hi"))
      print("Split:", text.split(","))
      print("Strip:", "  spaces  ".strip())

      # String concatenation
      first = "Hello"
      last = "World"
      print("\nConcatenation:", first + " " + last)

  - title: "Lists"
    description: "List operations and methods"
    code: |
      # List examples
      fruits = ["apple", "banana", "orange"]
      numbers = [1, 2, 3, 4, 5]

      # Basic operations
      print("Fruits:", fruits)
      print("First fruit:", fruits[0])
      print("Last fruit:", fruits[-1])

      # Modifying lists
      fruits.append("grape")
      fruits.insert(1, "mango")
      print("\nAfter modifications:", fruits)

      # List methods
      numbers.sort()
      print("\nSorted numbers:", numbers)
      print("Count of 5:", numbers.count(5))
      print("Index of 3:", numbers.index(3))

  - title: "Dictionaries"
    description: "Dictionary operations and methods"
    code: |
      # Dictionary examples
      person = {
          "name": "Alice",
          "age": 25,
          "city": "New York",
          "hobbies": ["reading", "coding", "music"]
      }

      # Accessing values
      print("Name:", person["name"])
      print("Age:", person["age"])
      print("First hobby:", person["hobbies"][0])

      # Modifying dictionaries
      person["job"] = "Engineer"
      person["age"] = 26

      print("\nModified person:")
      print("New job:", person["job"])
      print("Updated age:", person["age"])

      # Dictionary methods
      print("\nDictionary Methods:")
      print("Keys:", list(person.keys()))
      print("Values:", list(person.values()))
      print("Items:", list(person.items()))

  - title: "Type Conversion"
    description: "Converting between different data types"
    code: |
      # Type conversion examples
      # String to number
      text_number = "42"
      number = int(text_number)
      print("String to number:", number)

      # Number to string
      price = 19.99
      price_text = str(price)
      print("Number to string:", price_text)

      # Type checking
      values = [42, "hello", 3.14, True]
      for value in values:
          print("Value:", value, "Type:", type(value))

---
# Variables & Data Types in Python

Variables are essential building blocks in Python programming. They allow you to store and manipulate data in your programs.

## What are Variables?

Variables in Python are like containers that store data. They can hold different types of values, such as numbers, text, or more complex data structures. Python is dynamically typed, which means you don't need to declare the type of a variable explicitly.

## Basic Data Types

Python has several built-in data types:

1. **Numbers**
   - Integers (int): Whole numbers like 5, -17, 1000
   - Floating-point (float): Decimal numbers like 3.14, -0.001, 2.0

2. **Strings (str)**
   - Text data enclosed in quotes: "Hello", 'Python'
   - Can use single or double quotes

3. **Booleans (bool)**
   - True or False values
   - Used for logical operations

4. **None**
   - Represents absence of a value
   - Similar to null in other languages

## Variable Naming Rules

When naming variables in Python:

1. Names must start with a letter or underscore
2. Can contain letters, numbers, and underscores
3. Are case-sensitive (name ≠ Name)
4. Cannot use Python keywords (like if, for, while)

## Type Conversion

Python provides built-in functions for converting between data types:
- `int()`: Convert to integer
- `float()`: Convert to floating-point
- `str()`: Convert to string
- `bool()`: Convert to boolean

## Best Practices

1. Use descriptive names that explain the purpose
2. Follow Python naming conventions:
   - Use lowercase letters
   - Separate words with underscores
3. Initialize variables before using them
4. Use meaningful constants instead of "magic numbers"
