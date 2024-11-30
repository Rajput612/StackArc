'use client';
import { useState } from 'react';

const DEFAULT_CODE = `# Example: Class and Function Definition
class Calculator:
    def __init__(self):
        self.result = 0
    
    def add(self, x, y):
        self.result = x + y
        return self.result
    
    def multiply(self, x, y):
        self.result = x * y
        return self.result

# Create an instance and use it
calc = Calculator()
print("Adding 5 + 3:", calc.add(5, 3))
print("Multiplying 4 * 2:", calc.multiply(4, 2))
`;

export default function PythonPlayground() {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const runCode = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8080/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });

      const result = await response.json();
      
      if (result.success) {
        setOutput(result.output || 'No output');
      } else {
        setOutput(`Error: ${result.error}`);
      }
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const examples = {
    simple: `# Simple function example
def greet(name):
    return f"Hello, {name}!"

message = greet("World")
print(message)

# Function with multiple parameters
def add_numbers(a, b):
    return a + b

result = add_numbers(5, 3)
print(f"5 + 3 = {result}")`,
    
    class: `class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age
    
    def greet(self):
        return f"Hello, my name is {self.name} and I'm {self.age} years old!"

# Create and use a Person object
person = Person("Alice", 25)
print(person.greet())`,
    
    function: `# Function that calculates factorial
def factorial(n):
    if n == 0:
        return 1
    return n * factorial(n - 1)

# Test the factorial function
for i in range(6):
    print(f"factorial({i}) = {factorial(i)}")`,
    
    advanced: `# Example of a decorator
def uppercase_decorator(func):
    def wrapper():
        result = func()
        return result.upper()
    return wrapper

@uppercase_decorator
def greet():
    return "hello, world!"

print(greet())`
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="mb-4">
        <div className="flex gap-2 mb-4">
          {Object.entries(examples).map(([name, exampleCode]) => (
            <button
              key={name}
              onClick={() => setCode(exampleCode)}
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {name.charAt(0).toUpperCase() + name.slice(1)} Example
            </button>
          ))}
        </div>
        <div className="bg-gray-800 rounded-t-lg p-4">
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full h-96 p-4 font-mono text-white bg-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            spellCheck="false"
          />
        </div>
        <div className="bg-gray-800 p-4 rounded-b-lg">
          <button
            onClick={runCode}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isLoading ? 'Running...' : 'Run Code'}
          </button>
        </div>
      </div>
      
      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2 text-white">Output:</h3>
        <div className="bg-gray-800 rounded-lg p-4">
          <pre className="text-white font-mono whitespace-pre-wrap">{output}</pre>
        </div>
      </div>
    </div>
  );
}
