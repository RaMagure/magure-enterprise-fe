# CORS Configuration for Django Backend

## The CORS error you're seeing means your Django backend needs to be configured to allow requests from your React frontend.

## You need to add the following to your Django settings:

```python
# settings.py

# Make sure you have django-cors-headers installed
# pip install django-cors-headers

INSTALLED_APPS = [
    # ... other apps
    'corsheaders',
    # ... rest of your apps
]

MIDDLEWARE = [
    # ... other middleware
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    # ... rest of middleware
]

# CORS Settings for Development
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",  # If you use port 3000
    "http://localhost:5173",  # Vite default port
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",
]

# Alternative: Allow all origins in development (NOT for production)
# CORS_ALLOW_ALL_ORIGINS = True

# Allow credentials to be included in CORS requests
CORS_ALLOW_CREDENTIALS = True

# Headers that can be used during the actual request
CORS_ALLOW_HEADERS = [
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
]
```

## Steps to fix:

1. Install django-cors-headers:

   ```bash
   pip install django-cors-headers
   ```

2. Add the above configuration to your Django settings.py

3. Restart your Django development server

4. Test the login again

## Alternative Quick Fix for Development:

If you want to quickly test without setting up CORS properly, you can temporarily disable CORS in your browser (NOT recommended for production):

- Close all Chrome/Edge instances
- Start Chrome with: `chrome --disable-web-security --user-data-dir="C:/chrome-dev-session"`

But the proper fix is to configure CORS in Django as shown above.
