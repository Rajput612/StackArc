# Setting Up Your Python Development Environment

## Choosing an IDE (Integrated Development Environment)

A good IDE makes Python development more efficient and enjoyable. Here are the top options:

### 1. Visual Studio Code (Recommended)

**Pros:**
- Free and open-source
- Lightweight yet powerful
- Extensive plugin ecosystem
- Great Python support
- Built-in terminal
- Git integration

**Installation:**
1. Download from [code.visualstudio.com](https://code.visualstudio.com)
2. Install Python extension:
   - Open VS Code
   - Press `Ctrl+Shift+X` (Windows/Linux) or `Cmd+Shift+X` (macOS)
   - Search for "Python"
   - Install Microsoft's Python extension

**Essential Extensions:**
```plaintext
1. Python (Microsoft)
2. Pylance
3. Python Indent
4. Python Test Explorer
5. Python Docstring Generator
```

### 2. PyCharm

**Pros:**
- Purpose-built for Python
- Advanced debugging
- Integrated testing
- Database tools
- Web development features

**Versions:**
- Community Edition (Free)
- Professional Edition (Paid)

**Installation:**
1. Download from [jetbrains.com/pycharm](https://www.jetbrains.com/pycharm/)
2. Run installer
3. Choose to create desktop shortcut
4. Associate .py files

### 3. Jupyter Notebook

**Pros:**
- Great for data science
- Interactive coding
- Rich output display
- Markdown support

**Installation:**
```bash
# Install Jupyter
pip install notebook

# Launch Jupyter
jupyter notebook
```

## Configuring Your IDE

### Visual Studio Code Setup

1. **Python Interpreter Selection**
```json
// settings.json
{
    "python.defaultInterpreterPath": "/path/to/python",
    "python.formatting.provider": "black",
    "python.linting.enabled": true,
    "python.linting.pylintEnabled": true
}
```

2. **Key Shortcuts**
```plaintext
F5             - Start Debugging
Ctrl+F5        - Run Without Debugging
Shift+Enter    - Run Current Line
Ctrl+Space     - IntelliSense
F12            - Go to Definition
```

3. **Launch Configuration**
```json
// launch.json
{
    "version": "0.2.0",
    "configurations": [
        {
            "name": "Python: Current File",
            "type": "python",
            "request": "launch",
            "program": "${file}",
            "console": "integratedTerminal"
        }
    ]
}
```

### PyCharm Setup

1. **Project Interpreter**
   - File → Settings → Project → Python Interpreter
   - Add/Remove packages
   - Configure virtual environment

2. **Code Style**
   - File → Settings → Editor → Code Style
   - Set PEP 8 standards
   - Configure auto-formatting

3. **Version Control**
   - Enable Git integration
   - Configure GitHub account

## Essential IDE Features

### 1. Debugging Tools

```python
# Example debugging session
def calculate_sum(numbers):
    total = 0
    for num in numbers:  # Set breakpoint here
        total += num
    return total

numbers = [1, 2, 3, 4, 5]
result = calculate_sum(numbers)
```

### 2. Code Completion

```python
# IntelliSense example
import pandas as pd

df = pd.DataFrame()
df.  # IDE shows available methods
```

### 3. Code Navigation

```python
class Person:
    def __init__(self, name):
        self.name = name
    
    def greet(self):  # F12 to jump to definition
        return f"Hello, {self.name}!"

person = Person("Alice")
person.greet()  # Ctrl+click to navigate
```

## Best Practices

1. **Project Structure**
```plaintext
my_project/
│
├── venv/
├── src/
│   ├── __init__.py
│   ├── main.py
│   └── utils/
│       ├── __init__.py
│       └── helpers.py
│
├── tests/
│   ├── __init__.py
│   └── test_main.py
│
├── README.md
└── requirements.txt
```

2. **Code Formatting**
```python
# Install formatters
pip install black autopep8

# Format code
black your_file.py
```

3. **Linting**
```python
# Install linters
pip install pylint flake8

# Run linting
pylint your_file.py
```

## Productivity Tips

1. **Custom Snippets**
```json
{
    "Main function": {
        "prefix": "main",
        "body": [
            "def main():",
            "    $0",
            "",
            "if __name__ == '__main__':",
            "    main()"
        ]
    }
}
```

2. **Git Integration**
```bash
# Initialize repository
git init

# Stage changes
git add .

# Commit
git commit -m "Initial commit"
```

3. **Terminal Integration**
```bash
# Run Python file
python main.py

# Install package
pip install requests

# Run tests
pytest
```

## Troubleshooting Common Issues

1. **Interpreter Not Found**
   - Check PATH variables
   - Verify virtual environment activation
   - Reinstall Python extension

2. **Linting Errors**
   - Install required packages
   - Configure .pylintrc
   - Update settings.json

3. **Debugging Issues**
   - Check launch.json configuration
   - Verify debugger installation
   - Update IDE/extensions

## Next Steps

1. Install and configure your chosen IDE
2. Set up a virtual environment
3. Install essential extensions
4. Create a sample project
5. Practice debugging
6. Learn keyboard shortcuts

Remember: A well-configured IDE will significantly improve your coding efficiency and learning experience!
