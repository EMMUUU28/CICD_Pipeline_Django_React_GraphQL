#!/bin/bash

# Collect static files
python manage.py collectstatic --noinput

# Migrations (if needed)
python manage.py makemigrations
python manage.py migrate

# Start server
echo "Starting server..."
python manage.py runserver 0.0.0.0:8000