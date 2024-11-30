# Python Input and Output

## Basic Input/Output Operations

Python provides several ways to interact with users and handle data input/output.

### 1. Print Function

The `print()` function is the most basic way to output data:

```python
# Basic print
print("Hello, World!")

# Multiple items
name = "Alice"
age = 25
print("Name:", name, "Age:", age)

# String formatting
print(f"Name: {name}, Age: {age}")

# Print with separator and end
print("Hello", "World", sep="-", end="!\n")
```

### 2. Input Function

The `input()` function reads user input:

```python
# Basic input
name = input("Enter your name: ")
print(f"Hello, {name}!")

# Converting input to numbers
age = int(input("Enter your age: "))
height = float(input("Enter your height in meters: "))

print(f"In 5 years, you'll be {age + 5} years old")
print(f"Your height is {height * 100} centimeters")
```

## Real-World Examples

### 1. Simple Calculator
```python
def calculator():
    num1 = float(input("Enter first number: "))
    operator = input("Enter operator (+, -, *, /): ")
    num2 = float(input("Enter second number: "))
    
    if operator == "+":
        result = num1 + num2
    elif operator == "-":
        result = num1 - num2
    elif operator == "*":
        result = num1 * num2
    elif operator == "/":
        result = num1 / num2 if num2 != 0 else "Error: Division by zero"
    else:
        result = "Invalid operator"
    
    print(f"Result: {result}")

# Run calculator
calculator()
```

### 2. User Registration
```python
def get_user_info():
    print("=== User Registration ===")
    
    # Get user details with validation
    while True:
        username = input("Enter username (3-20 characters): ")
        if 3 <= len(username) <= 20:
            break
        print("Username must be between 3 and 20 characters")
    
    while True:
        age = input("Enter age (18 or older): ")
        if age.isdigit() and int(age) >= 18:
            age = int(age)
            break
        print("You must be 18 or older")
    
    email = input("Enter email: ")
    
    # Display information
    print("\n=== Registration Summary ===")
    print(f"Username: {username}")
    print(f"Age: {age}")
    print(f"Email: {email}")

# Run registration
get_user_info()
```

### 3. Shopping List
```python
def shopping_list():
    items = []
    total = 0.0
    
    print("=== Shopping List ===")
    print("Enter items and prices (empty name to finish)")
    
    while True:
        item_name = input("\nItem name (or enter to finish): ")
        if not item_name:
            break
            
        while True:
            try:
                price = float(input("Price: $"))
                break
            except ValueError:
                print("Please enter a valid price")
        
        items.append((item_name, price))
        total += price
    
    # Print receipt
    print("\n=== Your Shopping List ===")
    for item, price in items:
        print(f"{item:.<20} ${price:>7.2f}")
    print("-" * 30)
    print(f"Total:{'':.<13} ${total:>7.2f}")

# Run shopping list
shopping_list()
```

## Advanced Input/Output

### 1. Formatting Output
```python
# String formatting methods
name = "Alice"
age = 25
height = 1.75

# f-strings (Python 3.6+)
print(f"Name: {name}, Age: {age}, Height: {height:.2f}m")

# str.format()
print("Name: {}, Age: {}, Height: {:.2f}m".format(name, age, height))

# % operator (older style)
print("Name: %s, Age: %d, Height: %.2fm" % (name, age, height))

# Alignment and padding
for i in range(1, 4):
    print(f"{i:2d} {i*i:3d} {i*i*i:4d}")
```

### 2. Error Handling
```python
def get_integer_input(prompt):
    while True:
        try:
            value = int(input(prompt))
            return value
        except ValueError:
            print("Please enter a valid integer")

def get_float_input(prompt):
    while True:
        try:
            value = float(input(prompt))
            return value
        except ValueError:
            print("Please enter a valid number")

# Example usage
age = get_integer_input("Enter your age: ")
weight = get_float_input("Enter your weight in kg: ")
```

### 3. Working with Files
```python
# Writing to a file
def write_notes():
    print("Enter your notes (empty line to finish):")
    notes = []
    while True:
        line = input()
        if not line:
            break
        notes.append(line)
    
    with open("notes.txt", "w") as file:
        for note in notes:
            file.write(note + "\n")
    print("Notes saved to notes.txt")

# Reading from a file
def read_notes():
    try:
        with open("notes.txt", "r") as file:
            print("\nYour Notes:")
            print("-" * 20)
            for line in file:
                print(line.strip())
    except FileNotFoundError:
        print("No notes found")

# Run notes program
write_notes()
read_notes()
```

## Best Practices

1. **Always Validate Input**
```python
def get_positive_number(prompt):
    while True:
        try:
            num = float(input(prompt))
            if num > 0:
                return num
            print("Please enter a positive number")
        except ValueError:
            print("Invalid input")
```

2. **Use Descriptive Prompts**
```python
# Good
age = input("Please enter your age (in years): ")

# Not so good
age = input("Age: ")
```

3. **Handle Special Cases**
```python
def divide_numbers():
    try:
        num1 = float(input("Enter first number: "))
        num2 = float(input("Enter second number: "))
        result = num1 / num2
        print(f"Result: {result:.2f}")
    except ValueError:
        print("Please enter valid numbers")
    except ZeroDivisionError:
        print("Cannot divide by zero")
```

## Practice Exercises

1. **Temperature Converter**
```python
def convert_temperature():
    temp = float(input("Enter temperature: "))
    unit = input("Enter unit (C/F): ").upper()
    
    if unit == "C":
        fahrenheit = (temp * 9/5) + 32
        print(f"{temp}°C = {fahrenheit:.1f}°F")
    elif unit == "F":
        celsius = (temp - 32) * 5/9
        print(f"{temp}°F = {celsius:.1f}°C")
    else:
        print("Invalid unit")
```

2. **Simple Quiz Game**
```python
def run_quiz():
    questions = [
        ("What is the capital of France?", "Paris"),
        ("What is 2 + 2?", "4"),
        ("Who wrote Python?", "Guido van Rossum")
    ]
    
    score = 0
    for question, answer in questions:
        user_answer = input(f"{question} ")
        if user_answer.lower() == answer.lower():
            print("Correct!")
            score += 1
        else:
            print(f"Wrong. The answer is {answer}")
    
    print(f"\nFinal score: {score}/{len(questions)}")
```

Remember:
- Always validate user input
- Provide clear instructions
- Handle errors gracefully
- Give helpful feedback
- Use appropriate formatting for output
