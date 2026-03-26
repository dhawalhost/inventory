#!/bin/bash

# Load environment variables
if [ -f .env ]; then
    export $(grep -v '^#' .env | xargs)
fi

# Create Database if it doesn't exist
echo "Checking if database $DB_NAME exists..."
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -U $DB_USER -p $DB_PORT -tc "SELECT 1 FROM pg_database WHERE datname = '$DB_NAME'" | grep -q 1 || PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -U $DB_USER -p $DB_PORT -c "CREATE DATABASE $DB_NAME"

# Run migrations (using Go's AutoMigrate)
echo "Running migrations..."
go run cmd/migrate/main.go

# (Optional) Seed the database with categories
if [ -f scripts/seed.sql ]; then
    echo "Seeding initial data..."
    PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -U $DB_USER -p $DB_PORT -d $DB_NAME -f scripts/seed.sql
fi

echo "Database setup complete!"