import os
from wsgiref.handlers import CGIHandler
from app import gunicorn_app  # Import the Flask app from app.py

def handler(environ, start_response):
    """Handle Vercel serverless function requests"""
    os.environ['FLASK_ENV'] = 'production'
    return CGIHandler().run(gunicorn_app)(environ, start_response)