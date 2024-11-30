from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import CodeExecutionSerializer
import sys
from io import StringIO
import contextlib
import ast
import builtins

# Create a restricted set of built-ins
SAFE_BUILTINS = {
    'abs': abs, 'all': all, 'any': any, 'ascii': ascii,
    'bin': bin, 'bool': bool, 'chr': chr, 'complex': complex,
    'divmod': divmod, 'enumerate': enumerate, 'filter': filter,
    'float': float, 'format': format, 'frozenset': frozenset,
    'hex': hex, 'int': int, 'isinstance': isinstance,
    'issubclass': issubclass, 'len': len, 'list': list,
    'map': map, 'max': max, 'min': min, 'oct': oct,
    'ord': ord, 'pow': pow, 'print': print, 'range': range,
    'repr': repr, 'reversed': reversed, 'round': round,
    'set': set, 'slice': slice, 'sorted': sorted,
    'str': str, 'sum': sum, 'tuple': tuple, 'type': type,
    'zip': zip
}

# Create your views here.

class CodeExecutionView(APIView):
    @contextlib.contextmanager
    def capture_output(self):
        new_out, new_err = StringIO(), StringIO()
        old_out, old_err = sys.stdout, sys.stderr
        try:
            sys.stdout, sys.stderr = new_out, new_err
            yield sys.stdout, sys.stderr
        finally:
            sys.stdout, sys.stderr = old_out, old_err

    def is_safe_code(self, code_str):
        """Check if the code contains any potentially dangerous operations."""
        try:
            tree = ast.parse(code_str)
            
            for node in ast.walk(tree):
                # Prevent imports
                if isinstance(node, (ast.Import, ast.ImportFrom)):
                    return False, "Import statements are not allowed"
                
                # Prevent file operations
                if isinstance(node, ast.Call):
                    if isinstance(node.func, ast.Name):
                        if node.func.id in ['open', 'eval', 'exec', '__import__']:
                            return False, f"Function '{node.func.id}' is not allowed"
                    
                    # Prevent attribute access that might be dangerous
                    elif isinstance(node.func, ast.Attribute):
                        if node.func.attr in ['read', 'write', 'delete', 'remove', 'system']:
                            return False, f"Operation '{node.func.attr}' is not allowed"
            
            return True, ""
        except SyntaxError as e:
            return False, f"Syntax error: {str(e)}"
        except Exception as e:
            return False, f"Code analysis error: {str(e)}"

    def post(self, request):
        serializer = CodeExecutionSerializer(data=request.data)
        if serializer.is_valid():
            code = serializer.validated_data['code']
            
            # Check if code is safe
            is_safe, error_message = self.is_safe_code(code)
            if not is_safe:
                return Response({
                    'success': False,
                    'error': f"Security violation: {error_message}"
                }, status=status.HTTP_400_BAD_REQUEST)
            
            try:
                with self.capture_output() as (out, err):
                    # Create a restricted globals dictionary
                    restricted_globals = {
                        '__builtins__': SAFE_BUILTINS,
                        '__name__': '__main__',
                        '__doc__': None,
                        '__package__': None,
                    }
                    
                    # Execute the code in the restricted environment
                    exec(code, restricted_globals, {})
                    output = out.getvalue()
                    error = err.getvalue()

                return Response({
                    'success': True,
                    'output': output,
                    'error': error
                })
            except Exception as e:
                return Response({
                    'success': False,
                    'error': str(e)
                }, status=status.HTTP_400_BAD_REQUEST)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
