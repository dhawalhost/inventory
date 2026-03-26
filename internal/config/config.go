package config

import (
    "os"

    "github.com/joho/godotenv"
)

type Config struct {
    DBType     string
    DBUser     string
    DBPassword string
    DBName     string
    DBHost     string
    DBPort     string
}

func getEnv(key, fallback string) string {
    if value, ok := os.LookupEnv(key); ok {
        return value
    }
    return fallback
}

func LoadConfig() *Config {
    _ = godotenv.Load()

    return &Config{
        DBType:     getEnv("DB_TYPE", "sqlite"),
        DBUser:     os.Getenv("DB_USER"),
        DBPassword: os.Getenv("DB_PASSWORD"),
        DBName:     getEnv("DB_NAME", "inventory.db"),
        DBHost:     os.Getenv("DB_HOST"),
        DBPort:     os.Getenv("DB_PORT"),
    }
}