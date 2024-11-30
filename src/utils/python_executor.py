import sys
import io
import contextlib
import traceback
from typing import Dict


class CodeExecutor:
    def __init__(self):
        # Initialize with built-in functions and empty namespace
        self.globals = {
            "__builtins__": __builtins__,
            "__name__": "__main__",
            "print": print,
            "range": range,
            "len": len,
            "str": str,
            "int": int,
            "float": float,
            "list": list,
            "dict": dict,
            "tuple": tuple,
            "set": set,
            "bool": bool,
            "type": type,
        }
        self.locals = {}

    def execute(self, code: str) -> Dict[str, str]:
        stdout_buffer = io.StringIO()
        stderr_buffer = io.StringIO()

        result = {"output": "", "error": "", "success": True}

        try:
            # First, compile the code to handle syntax errors
            compiled_code = compile(code, "<string>", "exec")

            # Execute in the persistent namespace
            with contextlib.redirect_stdout(stdout_buffer), contextlib.redirect_stderr(
                stderr_buffer
            ):
                exec(
                    compiled_code, self.globals, self.globals
                )  # Use globals for both namespaces

                # Capture any printed output
                output = stdout_buffer.getvalue()

                # If there's no printed output but there are defined functions or classes,
                # provide some feedback
                if not output:
                    new_items = []
                    for key, value in self.globals.items():
                        if key.startswith("__") or key in __builtins__:
                            continue
                        if callable(value):
                            if isinstance(value, type):
                                new_items.append(f"Defined class: {key}")
                            else:
                                new_items.append(f"Defined function: {key}")
                    if new_items:
                        output = "\\n".join(new_items)

                result["output"] = output

        except SyntaxError as e:
            result["success"] = False
            result["error"] = f"Syntax Error: {str(e)}\\nLine {e.lineno}: {e.text}"
        except Exception as e:
            result["success"] = False
            error_type = type(e).__name__
            error_msg = str(e)
            tb = traceback.format_exc()
            result["error"] = f"{error_type}: {error_msg}\\n{tb}"
        finally:
            stdout_buffer.close()
            stderr_buffer.close()

        return result


# Create a single instance to maintain state between executions
executor = CodeExecutor()


def execute_python_code(code: str) -> Dict[str, str]:
    return executor.execute(code)
