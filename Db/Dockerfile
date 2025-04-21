# Use the official PostgreSQL image from the Docker Hub
FROM postgres:13

# Add a custom SQL file to initialize the database schema
COPY init.sql /docker-entrypoint-initdb.d/
