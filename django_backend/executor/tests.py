from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status

class CodeExecutionTests(APITestCase):
    def setUp(self):
        self.url = reverse('execute-code')

    def test_valid_code(self):
        """Test that valid Python code executes correctly"""
        data = {
            'code': 'print("Hello, World!")\nx = 5\nprint(f"x = {x}")'
        }
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
        self.assertIn('Hello, World!', response.data['output'])
        self.assertIn('x = 5', response.data['output'])

    def test_syntax_error(self):
        """Test that code with syntax errors is handled properly"""
        data = {
            'code': 'print("Unclosed string'
        }
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(response.data['success'])
        self.assertIn('Security violation', response.data['error'])
        self.assertIn('Syntax error', response.data['error'])

    def test_import_blocked(self):
        """Test that import statements are blocked"""
        data = {
            'code': 'import os\nprint(os.getcwd())'
        }
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(response.data['success'])
        self.assertIn('Security violation', response.data['error'])
        self.assertIn('Import statements are not allowed', response.data['error'])

    def test_file_operations_blocked(self):
        """Test that file operations are blocked"""
        data = {
            'code': 'with open("test.txt", "w") as f:\n    f.write("test")'
        }
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(response.data['success'])
        self.assertIn('Security violation', response.data['error'])
        self.assertIn("Function 'open' is not allowed", response.data['error'])

    def test_system_commands_blocked(self):
        """Test that system commands are blocked"""
        data = {
            'code': '__import__("os").system("ls")'
        }
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(response.data['success'])
        self.assertIn('Security violation', response.data['error'])

    def test_eval_exec_blocked(self):
        """Test that eval and exec are blocked"""
        data = {
            'code': 'eval("print(\'test\')")'
        }
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(response.data['success'])
        self.assertIn('Security violation', response.data['error'])
        self.assertIn("Function 'eval' is not allowed", response.data['error'])

    def test_attribute_access_blocked(self):
        """Test that dangerous attribute access is blocked"""
        data = {
            'code': 'class Test:\n    def __init__(self):\n        self.x = 1\n\nt = Test()\ndelattr(Test, "x")'
        }
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(response.data['success'])

    def test_safe_operations_allowed(self):
        """Test that safe operations are allowed"""
        safe_code_samples = [
            # Basic arithmetic
            '''
x = 5
y = 10
print(x + y)
print(x * y)
print(max(x, y))
''',
            # String operations
            '''
text = "Hello, World!"
print(text.upper())
print(len(text))
print(text.split(","))
''',
            # List operations
            '''
numbers = [1, 2, 3, 4, 5]
print(sorted(numbers, reverse=True))
print(sum(numbers))
print(list(map(lambda x: x*2, numbers)))
'''
        ]
        
        for code in safe_code_samples:
            data = {'code': code}
            response = self.client.post(self.url, data, format='json')
            self.assertEqual(response.status_code, status.HTTP_200_OK)
            self.assertTrue(response.data['success'])
