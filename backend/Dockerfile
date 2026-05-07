# Base Image
FROM python:3.12-slim as builder

# Setup environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /app

# Install system dependencies needed for compiling some Python packages
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Install python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir --prefix=/install -r requirements.txt


# Final Runtime Stage
FROM python:3.12-slim

WORKDIR /app

# Install runtime database libraries (like libpq for PostgreSQL)
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy installed libraries from builder stage
COPY --from=builder /install /usr/local

# Copy application files
COPY . .

# Run static files collection (via WhiteNoise)
RUN python manage.py collectstatic --noinput

# Expose Django port
EXPOSE 8000

# Start Django with high-performance production WSGI server (Gunicorn)
CMD ["gunicorn", "adwise_backend.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "3"]
