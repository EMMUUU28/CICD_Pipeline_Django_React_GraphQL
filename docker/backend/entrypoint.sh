#!/bin/bash

# Wait for DB (optional if using Postgres or MySQL)
# echo "Waiting for DB..."
# sleep 5

echo "Running migrations..."
python manage.py makemigrations
python manage.py migrate



echo "Starting server..."
python manage.py runserver 0.0.0.0:8000
