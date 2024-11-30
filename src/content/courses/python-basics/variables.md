# Variables and Data Types in Python

## Understanding Variables

In Python, variables are like containers that store data. Think of them as labeled boxes where you can put different types of information.

### Basic Variable Assignment

```python
# Simple variable assignment
name = "John"
age = 25
height = 1.75
is_student = True

# Print variable values
print(f"Name: {name}")
print(f"Age: {age}")
print(f"Height: {height}")
print(f"Student: {is_student}")
```

## Common Data Types

### 1. Strings (str)
Text data enclosed in quotes.

```python
# String examples
first_name = "Alice"
last_name = 'Smith'
full_name = first_name + " " + last_name  # String concatenation
message = f"Hello, {full_name}!"  # f-string formatting

# String methods
print(full_name.upper())  # ALICE SMITH
print(full_name.lower())  # alice smith
print(len(full_name))     # 11 (length of string)
```

### 2. Numbers (int, float)
Integers and decimal numbers.

```python
# Integer examples
age = 25
year = 2024
population = 7_900_000_000  # Underscores for readability

# Float examples
price = 19.99
temperature = -3.5
pi = 3.14159

# Basic operations
total = price * 2
change = 50 - total
print(f"Total: ${total:.2f}")
print(f"Change: ${change:.2f}")
```

### 3. Booleans (bool)
True or False values.

```python
# Boolean examples
is_sunny = True
is_raining = False
is_weekend = True

# Boolean operations
can_go_to_beach = is_sunny and not is_raining
print(f"Can go to beach: {can_go_to_beach}")
```

## Real-World Examples

### 1. E-commerce Shopping Cart
```python
# Shopping cart example
item_name = "Laptop"
item_price = 999.99
quantity = 2
in_stock = True

# Calculate total
subtotal = item_price * quantity
tax_rate = 0.08
tax = subtotal * tax_rate
total = subtotal + tax

print(f"""
Order Summary:
-------------
Item: {item_name}
Price: ${item_price:.2f}
Quantity: {quantity}
Subtotal: ${subtotal:.2f}
Tax: ${tax:.2f}
Total: ${total:.2f}
""")
```

### 2. Social Media Post
```python
# Social media post example
username = "tech_enthusiast"
post_content = "Just learned Python variables! 🐍"
likes = 42
is_shared = True
post_time = "2024-01-15 14:30"

post_info = f"""
{username} posted:
"{post_content}"
Likes: {likes}
Shared: {is_shared}
Time: {post_time}
"""
print(post_info)
```

### 3. Weather App
```python
# Weather app example
city = "San Francisco"
temperature_celsius = 18.5
temperature_fahrenheit = (temperature_celsius * 9/5) + 32
humidity = 75
is_raining = False

weather_report = f"""
Weather Report for {city}:
-------------------------
Temperature: {temperature_celsius}°C ({temperature_fahrenheit:.1f}°F)
Humidity: {humidity}%
Raining: {"Yes" if is_raining else "No"}
"""
print(weather_report)
```

## Type Conversion (Casting)

Sometimes you need to convert between different data types:

```python
# String to number
user_input = "25"
age = int(user_input)      # Convert to integer
height = float("1.75")     # Convert to float

# Number to string
price = 19.99
price_tag = str(price)     # Convert to string

# Examples
quantity = int(input("How many items? "))
price = float(input("Price per item: "))
total = quantity * price
print(f"Total cost: ${total:.2f}")
```

## Best Practices

1. **Use Descriptive Names**
   ```python
   # Good
   user_age = 25
   first_name = "John"

   # Not so good
   a = 25
   fn = "John"
   ```

2. **Follow Python Naming Conventions**
   ```python
   # Variables use lowercase with underscores
   user_name = "Alice"
   total_cost = 99.99

   # Constants are usually uppercase
   MAX_ATTEMPTS = 3
   PI = 3.14159
   ```

3. **Initialize Variables Before Use**
   ```python
   # Initialize with default values
   counter = 0
   message = ""
   items = []
   ```

## Practice Exercises

1. **Personal Information**
   ```python
   # Create variables for personal info
   name = input("Enter your name: ")
   age = int(input("Enter your age: "))
   height = float(input("Enter your height in meters: "))
   is_student = input("Are you a student? (yes/no): ").lower() == "yes"

   # Print formatted information
   print(f"""
   Personal Information:
   --------------------
   Name: {name}
   Age: {age}
   Height: {height}m
   Student: {is_student}
   """)
   ```

2. **Temperature Converter**
   ```python
   # Convert between Celsius and Fahrenheit
   celsius = float(input("Enter temperature in Celsius: "))
   fahrenheit = (celsius * 9/5) + 32
   print(f"{celsius}°C is equal to {fahrenheit:.1f}°F")
   ```

## Key Takeaways

1. Variables store data and can be changed
2. Python has several basic data types (str, int, float, bool)
3. Use meaningful variable names
4. Type conversion helps work with different data types
5. Real-world applications often use multiple variables and types together

## Next Steps

- Practice creating variables with different data types
- Try the practice exercises
- Think about how variables could be used in your own projects
- Explore more string formatting options
