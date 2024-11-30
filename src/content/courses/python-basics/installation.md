# Installing Python

## System Requirements

Before installing Python, make sure your system meets these basic requirements:
- At least 100MB of free disk space
- 512MB RAM (minimum)
- Any modern operating system (Windows 7+, macOS 10.11+, or Linux)

## Installation by Operating System

### Windows

1. **Download Python**
   - Visit [python.org](https://www.python.org/downloads/)
   - Click "Download Python" (latest version)
   - Choose the appropriate installer (64-bit recommended)

```bash
# Verify installation in Command Prompt
python --version
```

2. **Important Installation Options**
   - ✅ Add Python to PATH
   - ✅ Install pip
   - ✅ Install for all users

### macOS

1. **Using Homebrew (Recommended)**
```bash
# Install Homebrew if not installed
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Python
brew install python

# Verify installation
python3 --version
```

2. **Direct Download**
   - Visit [python.org](https://www.python.org/downloads/)
   - Download macOS installer
   - Run the installer package

### Linux (Ubuntu/Debian)

```bash
# Update package list
sudo apt update

# Install Python
sudo apt install python3 python3-pip

# Verify installation
python3 --version
```

## Verifying Your Installation

Open a terminal (Command Prompt on Windows) and run:

```bash
# Check Python version
python --version  # or python3 --version

# Check pip installation
pip --version    # or pip3 --version

# Try running Python
python           # or python3
>>> print("Hello, World!")
>>> exit()
```

## Setting Up Virtual Environments

Virtual environments help manage project dependencies:

```bash
# Install virtualenv
pip install virtualenv

# Create a new virtual environment
python -m venv myproject_env

# Activate the environment
# On Windows:
myproject_env\Scripts\activate

# On macOS/Linux:
source myproject_env/bin/activate

# Install packages in the virtual environment
pip install requests pandas numpy

# Deactivate when done
deactivate
```

## Common Installation Issues

### 1. Python Not Found in PATH
```bash
# Add to PATH manually on Windows
setx PATH "%PATH%;C:\Python39"

# Verify PATH
echo %PATH%
```

### 2. Permission Issues
```bash
# Linux/macOS permission fix
sudo chown -R $USER /usr/local/lib/python*
```

### 3. Multiple Python Versions
```bash
# Check all Python installations
which -a python python3

# Create aliases in ~/.bashrc or ~/.zshrc
alias python=python3
alias pip=pip3
```

## Best Practices

1. **Always Use Virtual Environments**
   ```bash
   # Create a requirements.txt
   pip freeze > requirements.txt

   # Install from requirements.txt
   pip install -r requirements.txt
   ```

2. **Keep Python Updated**
   ```bash
   # Windows
   python -m pip install --upgrade pip

   # macOS/Linux
   pip3 install --upgrade pip
   ```

3. **Install Development Tools**
   ```bash
   # Essential development packages
   pip install pylint pytest black
   ```

## Next Steps

1. Verify your installation works
2. Set up a virtual environment
3. Install a code editor (covered in next lesson)
4. Try running your first Python script:

```python
# hello.py
print("Hello, Python!")
```

## Troubleshooting

If you encounter issues:

1. Check system PATH
2. Verify permissions
3. Consult Python documentation
4. Search Stack Overflow
5. Ask in Python community forums

Remember: The installation process is just the beginning. In the next lesson, we'll set up your development environment with a proper code editor!
