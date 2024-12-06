// Initialize Pyodide loading
window.pyodideReadyPromise = (async function() {
  if (!window.loadPyodide) {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/pyodide/v0.22.1/full/pyodide.js';
    script.async = true;
    document.head.appendChild(script);
    
    await new Promise((resolve) => {
      script.onload = resolve;
    });
  }

  const pyodide = await loadPyodide();
  
  // Set up stdout/stderr capture
  await pyodide.runPython(`
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

  return pyodide;
})();
