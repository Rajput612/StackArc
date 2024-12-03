import asyncio
import websockets
import json
import sys
from io import StringIO
import traceback
from contextlib import redirect_stdout

class PythonDebugger:
    def __init__(self):
        self.current_line = None
        self.output_buffer = StringIO()
        self.variables = {}
        self.code_lines = []
        
    async def handle_debug_message(self, message):
        try:
            command = message.get('command')
            
            if command == 'start':
                self.code_lines = message.get('code', '').splitlines()
                self.current_line = 0
                self.variables = {}
                self.output_buffer = StringIO()
                return {
                    'status': 'started',
                    'line': self.current_line,
                    'variables': self.variables,
                    'output': ''
                }
                
            elif command == 'step':
                if self.current_line >= len(self.code_lines):
                    return {
                        'status': 'finished',
                        'output': self.output_buffer.getvalue()
                    }
                
                # Execute the current line
                line = self.code_lines[self.current_line]
                
                # Capture output
                with redirect_stdout(self.output_buffer):
                    try:
                        # Execute the line and capture variables
                        local_vars = {}
                        exec(line, {}, local_vars)
                        
                        # Update variables with type information
                        for name, value in local_vars.items():
                            self.variables[name] = {
                                'value': repr(value),
                                'type': type(value).__name__,
                                'id': id(value)
                            }
                            
                    except Exception as e:
                        print(f"Error: {str(e)}")
                
                self.current_line += 1
                
                return {
                    'status': 'running',
                    'line': self.current_line - 1,
                    'variables': self.variables,
                    'output': self.output_buffer.getvalue()
                }
                
            elif command == 'continue':
                while self.current_line < len(self.code_lines):
                    line = self.code_lines[self.current_line]
                    with redirect_stdout(self.output_buffer):
                        try:
                            local_vars = {}
                            exec(line, {}, local_vars)
                            self.variables.update({
                                name: {
                                    'value': repr(value),
                                    'type': type(value).__name__,
                                    'id': id(value)
                                }
                                for name, value in local_vars.items()
                            })
                        except Exception as e:
                            print(f"Error: {str(e)}")
                    self.current_line += 1
                
                return {
                    'status': 'finished',
                    'variables': self.variables,
                    'output': self.output_buffer.getvalue()
                }
                
        except Exception as e:
            return {
                'status': 'error',
                'error': str(e),
                'traceback': traceback.format_exc()
            }

debugger = PythonDebugger()

async def websocket_handler(websocket):
    try:
        async for message in websocket:
            data = json.loads(message)
            response = await debugger.handle_debug_message(data)
            await websocket.send(json.dumps(response))
    except websockets.exceptions.ConnectionClosed:
        pass
    except Exception as e:
        print(f"Error in websocket handler: {str(e)}")
        traceback.print_exc()

async def start_server():
    async with websockets.serve(websocket_handler, 'localhost', 8765):
        await asyncio.Future()  # run forever

if __name__ == '__main__':
    asyncio.run(start_server())
