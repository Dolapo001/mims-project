module.exports = {
  apps: [
    {
      name: "adwise-backend",
      script: "gunicorn",
      args: "adwise_backend.wsgi:application --bind 0.0.0.0:8000 --workers 3",
      cwd: "./backend",
      // If using the local virtual environment, PM2 will use this Python interpreter
      interpreter: "../venv_adwise/bin/python",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production",
        DJANGO_SETTINGS_MODULE: "adwise_backend.settings",
        DJANGO_DEBUG: "False"
      }
    },
    {
      name: "adwise-frontend",
      script: "npm",
      args: "run start -- -p 7000",
      cwd: "./frontend",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production",
        PORT: 7000
      }
    }
  ]
};
