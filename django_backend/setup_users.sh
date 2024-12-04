#!/bin/bash

# Activate virtual environment
source venv/bin/activate

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Create initial users via Python script
python setup_users.py

# Deactivate virtual environment
deactivate
