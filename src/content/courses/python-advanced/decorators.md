# Advanced Python Decorators

## Understanding Decorators

Decorators are a powerful feature in Python that allows you to modify or enhance functions or classes without directly changing their source code. They follow the principle of open-closed: open for extension but closed for modification.

## Basic Decorator Pattern

```python
def my_decorator(func):
    def wrapper():
        print("Something is happening before the function is called.")
        func()
        print("Something is happening after the function is called.")
    return wrapper

@my_decorator
def say_hello():
    print("Hello!")

# Using the decorator
say_hello()
```

## Real-World Examples

### 1. Performance Monitoring
```python
import time
from functools import wraps

def measure_time(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        start_time = time.perf_counter()
        result = func(*args, **kwargs)
        end_time = time.perf_counter()
        execution_time = end_time - start_time
        print(f"{func.__name__} took {execution_time:.4f} seconds to execute")
        return result
    return wrapper

@measure_time
def process_data(data):
    # Simulate complex data processing
    time.sleep(1)
    return [x * 2 for x in data]

# Usage
data = list(range(1000))
result = process_data(data)
```

### 2. Authentication in Web Applications
```python
from functools import wraps
from datetime import datetime

class User:
    def __init__(self, username, role):
        self.username = username
        self.role = role

def require_role(role):
    def decorator(func):
        @wraps(func)
        def wrapper(user, *args, **kwargs):
            if not isinstance(user, User):
                raise TypeError("Expected User object")
            
            if user.role != role:
                raise PermissionError(
                    f"Required role: {role}, user has role: {user.role}"
                )
            
            return func(user, *args, **kwargs)
        return wrapper
    return decorator

class AdminPanel:
    @require_role("admin")
    def delete_user(self, user, target_username):
        print(f"Admin {user.username} deleted user {target_username}")

# Usage example
admin = User("admin", "admin")
regular_user = User("john", "user")

panel = AdminPanel()
panel.delete_user(admin, "jane")  # Works
try:
    panel.delete_user(regular_user, "jane")  # Raises PermissionError
except PermissionError as e:
    print(f"Error: {e}")
```

### 3. Caching Results
```python
from functools import wraps
from collections import OrderedDict

def lru_cache(maxsize=128):
    cache = OrderedDict()
    
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            # Create a cache key from the arguments
            key = str(args) + str(kwargs)
            
            # Check if result is in cache
            if key in cache:
                # Move to end to mark as recently used
                cache.move_to_end(key)
                return cache[key]
            
            # Calculate result
            result = func(*args, **kwargs)
            
            # Add to cache
            cache[key] = result
            if len(cache) > maxsize:
                # Remove least recently used item
                cache.popitem(last=False)
            
            return result
        return wrapper
    return decorator

# Example usage with expensive computation
@lru_cache(maxsize=2)
def fibonacci(n):
    if n < 2:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

# Usage
print(fibonacci(100))  # Fast, uses cache
```

### 4. API Rate Limiting
```python
import time
from functools import wraps
from collections import deque

def rate_limit(calls_per_second=1):
    calls = deque()
    
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            current_time = time.time()
            
            # Remove old calls
            while calls and calls[0] < current_time - 1:
                calls.popleft()
            
            # Check rate limit
            if len(calls) >= calls_per_second:
                raise Exception("Rate limit exceeded")
            
            # Add current call
            calls.append(current_time)
            
            return func(*args, **kwargs)
        return wrapper
    return decorator

# Example API client
class APIClient:
    @rate_limit(calls_per_second=2)
    def make_request(self, endpoint):
        print(f"Making request to {endpoint}")
        # Simulate API request
        time.sleep(0.1)

# Usage
client = APIClient()
try:
    for i in range(5):
        client.make_request(f"/api/endpoint/{i}")
except Exception as e:
    print(f"Error: {e}")
```

## Advanced Decorator Patterns

### 1. Class Decorators
```python
def singleton(cls):
    instances = {}
    
    @wraps(cls)
    def get_instance(*args, **kwargs):
        if cls not in instances:
            instances[cls] = cls(*args, **kwargs)
        return instances[cls]
    
    return get_instance

@singleton
class DatabaseConnection:
    def __init__(self, host, port):
        self.host = host
        self.port = port
        print(f"Connecting to database at {host}:{port}")

# Usage
db1 = DatabaseConnection("localhost", 5432)
db2 = DatabaseConnection("localhost", 5432)
print(db1 is db2)  # True - same instance
```

### 2. Decorators with Arguments
```python
def retry(max_attempts=3, delay_seconds=1):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            attempts = 0
            while attempts < max_attempts:
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    attempts += 1
                    if attempts == max_attempts:
                        raise e
                    time.sleep(delay_seconds)
            return None
        return wrapper
    return decorator

@retry(max_attempts=3, delay_seconds=1)
def unstable_network_call():
    if random.random() < 0.7:  # 70% chance of failure
        raise ConnectionError("Network error")
    return "Success!"

# Usage
try:
    result = unstable_network_call()
    print(result)
except ConnectionError as e:
    print(f"Failed after 3 attempts: {e}")
```

## Best Practices

1. **Always use functools.wraps**
   ```python
   from functools import wraps

   def my_decorator(func):
       @wraps(func)  # Preserves function metadata
       def wrapper(*args, **kwargs):
           return func(*args, **kwargs)
       return wrapper
   ```

2. **Handle Arguments Properly**
   ```python
   def decorator(func):
       @wraps(func)
       def wrapper(*args, **kwargs):
           # Handle any number of arguments
           return func(*args, **kwargs)
       return wrapper
   ```

3. **Make Decorators Configurable**
   ```python
   def retry(max_attempts=3):
       def decorator(func):
           @wraps(func)
           def wrapper(*args, **kwargs):
               for _ in range(max_attempts):
                   try:
                       return func(*args, **kwargs)
                   except Exception:
                       continue
               return None
           return wrapper
       return decorator
   ```

## Practice Exercises

1. **Create a Logging Decorator**
```python
def log_calls(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        print(f"Calling {func.__name__} with args: {args}, kwargs: {kwargs}")
        result = func(*args, **kwargs)
        print(f"{func.__name__} returned: {result}")
        return result
    return wrapper

@log_calls
def add(a, b):
    return a + b

# Test your decorator
print(add(3, 5))
```

2. **Implement a Memoization Decorator**
```python
def memoize(func):
    cache = {}
    @wraps(func)
    def wrapper(*args):
        if args not in cache:
            cache[args] = func(*args)
        return cache[args]
    return wrapper

@memoize
def expensive_operation(n):
    print(f"Computing {n}...")
    return sum(range(n))

# Test your decorator
print(expensive_operation(1000))  # Computes
print(expensive_operation(1000))  # Uses cache
```

## Key Takeaways

1. Decorators modify or enhance functions without changing their source code
2. They are widely used in web frameworks, testing, and logging
3. Always use @wraps to preserve function metadata
4. Decorators can be stacked and can take arguments
5. They're powerful for cross-cutting concerns like authentication and caching

## Next Steps

- Experiment with creating your own decorators
- Study how frameworks like Flask use decorators
- Practice combining multiple decorators
- Explore class decorators in depth
