---
title: "Class & Static Methods"
description: "Understanding and implementing class and static methods in Python"
level: "advanced"
order: 1
codeExamples:
  - title: "Instance Methods"
    description: "Basic instance method example with a Student class"
    code: |
      # Instance method example
      class Student:
          def __init__(self, name, grade):
              self.name = name
              self.grade = grade
          
          def get_grade(self):  # Instance method
              return f"{self.name}'s grade is {self.grade}"

      # Create a student and call instance method
      student = Student("Alice", "A")
      print(student.get_grade())  # Alice's grade is A

      # Instance methods can modify instance state
      student.grade = "A+"
      print(student.get_grade())  # Alice's grade is A+

  - title: "Class Methods"
    description: "Using class methods as alternative constructors"
    code: |
      # Class method example
      from datetime import date

      class Date:
          def __init__(self, year, month, day):
              self.year = year
              self.month = month
              self.day = day
          
          def __str__(self):
              return f"{self.year}-{self.month:02d}-{self.day:02d}"
          
          @classmethod
          def from_string(cls, date_string):  # Class method
              year, month, day = map(int, date_string.split('-'))
              return cls(year, month, day)
          
          @classmethod
          def today(cls):  # Another class method
              current = date.today()
              return cls(current.year, current.month, current.day)

      # Using class methods
      date1 = Date.from_string('2024-02-14')  # Create from string
      date2 = Date.today()                    # Create from today's date

      print(date1)  # 2024-02-14
      print(date2)  # Current date

  - title: "Static Methods"
    description: "Using static methods for utility functions"
    code: |
      # Static method example
      class Calculator:
          @staticmethod
          def add(x, y):  # Static method
              return x + y
          
          @staticmethod
          def is_positive(x):  # Another static method
              return x > 0
          
          @staticmethod
          def validate_number(x):  # Validation static method
              return isinstance(x, (int, float))

      # Using static methods
      result = Calculator.add(5, 3)
      print(f"5 + 3 = {result}")  # 5 + 3 = 8

      number = 42
      if Calculator.is_positive(number):
          print(f"{number} is positive")  # 42 is positive

      # Validation example
      inputs = [10, "20", 3.14]
      for x in inputs:
          if Calculator.validate_number(x):
              print(f"{x} is a valid number")
          else:
              print(f"{x} is not a valid number")

  - title: "Practical Example"
    description: "Using all three method types in a configuration manager"
    code: |
      # Complete example using all method types
      class ConfigManager:
          default_config = {
              'debug': False,
              'cache_size': 1000,
              'timeout': 30
          }
          
          def __init__(self, config_dict=None):
              self.config = config_dict if config_dict else self.default_config.copy()
          
          def get_setting(self, key):  # Instance method
              return self.config.get(key)
          
          @classmethod
          def from_file(cls, filename):  # Class method
              if not cls._is_valid_file(filename):
                  return cls()  # Return default config
              # Simulate reading from file
              config = {'debug': True, 'cache_size': 2000, 'timeout': 45}
              return cls(config)
          
          @staticmethod
          def _is_valid_file(filename):  # Static method
              return filename.endswith('.config')

      # Using the ConfigManager
      # 1. Default configuration
      config1 = ConfigManager()
      print("Default debug setting:", config1.get_setting('debug'))  # False

      # 2. From file (class method)
      config2 = ConfigManager.from_file('settings.config')
      print("Custom debug setting:", config2.get_setting('debug'))  # True

      # 3. Invalid file (uses static method internally)
      config3 = ConfigManager.from_file('invalid.txt')
      print("Invalid file debug setting:", config3.get_setting('debug'))  # False

---
# Class & Static Methods in Python

Python offers three types of methods for classes: instance methods, class methods, and static methods. Each type serves a specific purpose and has its own use cases.

## Instance Methods

Instance methods are the most common type of methods in Python classes. They:
- Automatically receive the instance (`self`) as their first parameter
- Can access and modify instance state
- Can call other instance methods
- Are used for operations specific to each instance

## Class Methods

Class methods are methods that work with the class itself. They:
- Are decorated with `@classmethod`
- Receive the class (`cls`) as their first parameter
- Can access and modify class-level attributes
- Are commonly used as alternative constructors
- Work well with inheritance

## Static Methods

Static methods are utility functions that belong to the class namespace. They:
- Are decorated with `@staticmethod`
- Don't receive any implicit first argument
- Can't access instance or class state directly
- Are used for helper functions related to the class

## Best Practices

1. **Use Instance Methods When:**
   - You need to access instance attributes
   - The method needs instance-specific data
   - You're working with instance state

2. **Use Class Methods When:**
   - Creating alternative constructors
   - Working with class-level attributes
   - The method needs to work with inheritance

3. **Use Static Methods When:**
   - You need utility functions
   - The operation is independent of state
   - You want to organize related functions

4. **General Tips:**
   - Keep methods focused and simple
   - Use descriptive names
   - Document your methods
   - Consider inheritance implications
