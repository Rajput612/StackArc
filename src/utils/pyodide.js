let pyodideInstance = null;
let isLoading = false;
let loadError = null;
const loadCallbacks = [];

export async function loadPyodide() {
  if (pyodideInstance) {
    return pyodideInstance;
  }

  if (isLoading) {
    return new Promise((resolve, reject) => {
      loadCallbacks.push({ resolve, reject });
    });
  }

  isLoading = true;

  try {
    // Load Pyodide script if not already loaded
    if (!window.loadPyodide) {
      await new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/pyodide/v0.22.1/full/pyodide.js';
        script.async = true;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    }

    // Initialize Pyodide
    pyodideInstance = await window.loadPyodide();
    
    // Set up stdout/stderr capture
    pyodideInstance.runPython(`
      import sys
      import io

      class CaptureOutput:
          def __init__(self):
              self.output = []
          def write(self, text):
              self.output.append(text.strip())
          def flush(self):
              pass

      capture = CaptureOutput()
      sys.stdout = capture
      sys.stderr = capture
    `);

    // Resolve all pending callbacks
    loadCallbacks.forEach(({ resolve }) => resolve(pyodideInstance));
    loadCallbacks.length = 0;

    return pyodideInstance;
  } catch (error) {
    loadError = error;
    // Reject all pending callbacks
    loadCallbacks.forEach(({ reject }) => reject(error));
    loadCallbacks.length = 0;
    throw error;
  } finally {
    isLoading = false;
  }
}

export function getPyodide() {
  return pyodideInstance;
}

// Function to execute Python code
export async function executePythonCode(code) {
  try {
    const pyodide = await loadPyodide();
    
    // Execute the code
    pyodide.runPython(code);
    
    // Get captured output
    const capturedOutput = pyodide.runPython('capture.output');
    return capturedOutput.toJs();
  } catch (error) {
    return [`Error: ${error.message}`];
  }
}
