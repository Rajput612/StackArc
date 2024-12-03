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
        self.globals = {}
        
    async def handle_debug_message(self, message):
        try:
            command = message.get('command')
            
            if command == 'start':
                self.code_lines = message.get('code', '').splitlines()
                self.current_line = 0
                self.variables = {}
                self.output_buffer = StringIO()
                self.globals = {}
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
                line = self.code_lines[self.current_line].strip()
                if not line or line.startswith('#'):
                    self.current_line += 1
                    return {
                        'status': 'running',
                        'line': self.current_line - 1,
                        'variables': self.variables,
                        'output': self.output_buffer.getvalue()
                    }
                
                # Capture output and execute line
                with redirect_stdout(self.output_buffer):
                    try:
                        # Execute in the same globals context
                        exec(line, self.globals, self.globals)
                        
                        # Update variables with type information
                        self.variables = {
                            name: {
                                'value': repr(value),
                                'type': type(value).__name__,
                                'id': id(value)
                            }
                            for name, value in self.globals.items()
                            if not name.startswith('__')
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
                    line = self.code_lines[self.current_line].strip()
                    if line and not line.startswith('#'):
                        with redirect_stdout(self.output_buffer):
                            try:
                                exec(line, self.globals, self.globals)
                                self.variables = {
                                    name: {
                                        'value': repr(value),
                                        'type': type(value).__name__,
                                        'id': id(value)
                                    }
                                    for name, value in self.globals.items()
                                    if not name.startswith('__')
                                }
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

async def websocket_handler(websocket):
    debugger = PythonDebugger()
    try:
        async for message in websocket:
            try:
                data = json.loads(message)
                response = await debugger.handle_debug_message(data)
                await websocket.send(json.dumps(response))
            except json.JSONDecodeError:
                await websocket.send(json.dumps({
                    'status': 'error',
                    'error': 'Invalid JSON message'
                }))
    except websockets.exceptions.ConnectionClosed:
        pass
    except Exception as e:
        print(f"Error in websocket handler: {str(e)}")
        traceback.print_exc()

async def start_server(host='localhost', port=8765):
    print(f"Starting Python debugger server on ws://{host}:{port}")
    async with websockets.serve(websocket_handler, host, port):
        await asyncio.Future()  # run forever

if __name__ == '__main__':
    try:
        asyncio.run(start_server())
    except KeyboardInterrupt:
        print("\nShutting down debugger server...")
