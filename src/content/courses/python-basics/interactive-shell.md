# Python Interactive Shell

The Python interactive shell, also known as the Python REPL (Read-Eval-Print Loop), is a powerful tool for learning Python and testing code snippets. It provides immediate feedback for each command you enter.

## Starting the Interactive Shell

To start the Python interactive shell:

1. Open your terminal or command prompt
2. Type `python` or `python3` and press Enter

```python
# Terminal output
Python 3.9.7 (default, Sep 16 2021, 16:59:28) 
[GCC 11.2.0] on linux
Type "help", "copyright", "credits" or "license" for more information.
>>> 
```

The `>>>` prompt indicates that Python is ready to accept your commands.

## Basic Operations

You can use the shell as a calculator:

```python
>>> 2 + 2
4
>>> 50 - 5*6
20
>>> (50 - 5*6) / 4
5.0
>>> 8 / 5  # Division always returns a float
1.6
```

## Variables and Types

Define variables and see their values instantly:

```python
>>> x = 42
>>> x
42
>>> name = "Alice"
>>> print(f"Hello, {name}!")
Hello, Alice!
>>> type(x)
<class 'int'>
>>> type(name)
<class 'str'>
```

## Multi-line Statements

For multi-line statements, the shell uses `...` to indicate continuation:

```python
>>> def greet(name):
...     if name:
...         print(f"Hello, {name}!")
...     else:
...         print("Hello, World!")
... 
>>> greet("Bob")
Hello, Bob!
```

## Lists and Loops

Work with lists and loops interactively:

```python
>>> fruits = ["apple", "banana", "orange"]
>>> for fruit in fruits:
...     print(f"I like {fruit}s")
... 
I like apples
I like bananas
I like oranges
```

## Useful Shell Features

### 1. History

- Use the up and down arrow keys to navigate through previous commands
- Press Ctrl+P (previous) and Ctrl+N (next) for command history

### 2. Auto-completion

```python
>>> import math
>>> math.  # Press Tab to see available methods
math.acos    math.degrees  math.log      math.sin
math.acosh   math.e       math.log10    math.sinh
math.asin    math.exp     math.log2     math.sqrt
```

### 3. Help System

```python
>>> help(len)
Help on built-in function len in module builtins:

len(obj, /)
    Return the number of items in a container.
```

## Best Practices

1. **Quick Testing**
```python
>>> def is_palindrome(s):
...     return s == s[::-1]
... 
>>> is_palindrome("radar")
True
>>> is_palindrome("hello")
False
```

2. **Exploring Objects**
```python
>>> dir(str)  # List all methods of string class
['__add__', '__class__', ..., 'upper', 'zfill']
```

3. **Debugging Values**
```python
>>> x = 42
>>> print(f"x = {x}, type = {type(x)}")
x = 42, type = <class 'int'>
```

## Tips and Tricks

### 1. Clear the Screen
```python
>>> import os
>>> os.system('clear')  # or 'cls' on Windows
```

### 2. Exit the Shell
```python
>>> exit()  # or Ctrl+D (Unix) or Ctrl+Z (Windows)
```

### 3. Save Session History
```python
>>> import readline
>>> readline.write_history_file('history.txt')
```

### 4. Custom Prompt
```python
>>> import sys
>>> sys.ps1 = 'Python> '
Python> print("Custom prompt!")
Custom prompt!
```

## Common Pitfalls

1. **Indentation Errors**
```python
>>> def bad_function():
... print("This will fail")  # Missing indentation
  File "<stdin>", line 2
    print("This will fail")
    ^
IndentationError: expected an indented block
```

2. **Variable Scope**
```python
>>> x = 1
>>> def test():
...     print(x)  # Works: reading global
...     x = 2    # Error: can't modify global
... 
>>> test()
UnboundLocalError: local variable 'x' referenced before assignment
```

## Interactive Shell vs. Scripts

The interactive shell is great for:
- Learning Python
- Testing small code snippets
- Debugging
- Exploring Python objects and methods

However, for longer programs, you should:
1. Use a proper text editor or IDE
2. Save your code in .py files
3. Run the files using `python filename.py`

Remember: The interactive shell is a powerful learning tool, but it's not meant for developing full applications.
