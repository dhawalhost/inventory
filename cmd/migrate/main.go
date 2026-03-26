package main

import (
    "log"
    "github.com/dhawalhost/grocery-inventory-backend/internal/config"
    "github.com/dhawalhost/grocery-inventory-backend/internal/db"
)

func main() {
    log.Println("Starting Database Migration...")
    cfg := config.LoadConfig()
    db.ConnectDatabase(cfg)
    log.Println("Database migration completed successfully!")
}