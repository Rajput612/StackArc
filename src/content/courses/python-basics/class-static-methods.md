# Class & Static Methods in Python

In Python, there are three types of methods that can be defined within a class: instance methods, class methods, and static methods. Each type serves a different purpose and has its own use cases.

## Instance Methods

Instance methods are the most common type of methods in Python classes. They automatically receive the instance (`self`) as their first parameter.

```python
class Student:
    def __init__(self, name, grade):
        self.name = name
        self.grade = grade
    
    def get_grade(self):  # Instance method
        return f"{self.name}'s grade is {self.grade}"

# Usage
student = Student("Alice", "A")
print(student.get_grade())  # Output: Alice's grade is A
```

## Class Methods

Class methods are methods that work with the class itself. They receive the class (`cls`) as their first parameter and are decorated with `@classmethod`.

```python
from datetime import date

class Date:
    def __init__(self, year, month, day):
        self.year = year
        self.month = month
        self.day = day
    
    @classmethod
    def from_string(cls, date_string):  # Class method
        year, month, day = map(int, date_string.split('-'))
        return cls(year, month, day)
    
    @classmethod
    def today(cls):  # Another class method
        today = date.today()
        return cls(today.year, today.month, today.day)

# Usage
date1 = Date.from_string('2024-02-14')
date2 = Date.today()
```

## Static Methods

Static methods don't receive any implicit first argument. They are decorated with `@staticmethod` and behave like regular functions that just happen to live in the class namespace.

```python
class MathOperations:
    @staticmethod
    def add(x, y):  # Static method
        return x + y
    
    @staticmethod
    def is_positive(x):  # Another static method
        return x > 0

# Usage
print(MathOperations.add(5, 3))      # Output: 8
print(MathOperations.is_positive(5))  # Output: True
```

## Factory Method Pattern

A common use case for class methods is implementing the factory pattern, which provides different ways to create objects:

```python
class Pizza:
    def __init__(self, ingredients):
        self.ingredients = ingredients
    
    def __str__(self):
        return f"Pizza with {', '.join(self.ingredients)}"
    
    @classmethod
    def margherita(cls):  # Factory method
        return cls(['mozzarella', 'tomatoes'])
    
    @classmethod
    def prosciutto(cls):  # Another factory method
        return cls(['mozzarella', 'tomatoes', 'ham'])

# Usage
pizza1 = Pizza.margherita()
pizza2 = Pizza.prosciutto()
print(pizza1)  # Output: Pizza with mozzarella, tomatoes
print(pizza2)  # Output: Pizza with mozzarella, tomatoes, ham
```

## When to Use Each Type

1. **Instance Methods**
   - Use when you need to access or modify instance-specific data
   - When the method needs to work with instance attributes
   - Most common type of method you'll use

2. **Class Methods**
   - Use when you need alternative constructors
   - When the method needs to work with the class itself
   - For implementing factory patterns
   - When the method needs to be inherited and work with the inheriting class

3. **Static Methods**
   - Use when you need a utility function that doesn't depend on instance or class state
   - When the method works with parameters independent of the class
   - For namespace organization of related functions

## Practice Exercise

Try implementing a `BankAccount` class that uses all three types of methods:

```python
class BankAccount:
    interest_rate = 0.02  # Class variable for interest rate
    
    def __init__(self, owner, balance=0):
        self.owner = owner
        self.balance = balance
    
    def deposit(self, amount):  # Instance method
        self.balance += amount
        return f"Deposited ${amount}. New balance: ${self.balance}"
    
    @classmethod
    def set_interest_rate(cls, rate):  # Class method
        cls.interest_rate = rate
        return f"Interest rate updated to {rate*100}%"
    
    @staticmethod
    def validate_amount(amount):  # Static method
        return amount > 0

# Usage
account = BankAccount("John Doe", 1000)
print(account.deposit(500))  # Instance method
print(BankAccount.set_interest_rate(0.03))  # Class method
print(BankAccount.validate_amount(100))  # Static method
```

This example demonstrates how all three method types can work together in a real-world scenario.
