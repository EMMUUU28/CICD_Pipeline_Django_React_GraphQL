#!/bin/bash

python manage.py collectstatic --noinput


python manage.py makemigrations
python manage.py migrate

# Start server
echo "Starting server..."
python manage.py runserver 0.0.0.0:8000