#!/bin/bash

# Activate virtual environment if it exists
if [ -d "django_backend/venv" ]; then
    source django_backend/venv/bin/activate
fi

# Install required packages if not already installed
pip install websockets

# Start the debugger server
python src/server/start_debugger.py
