package db

import (
    "fmt"
    "log"

    "github.com/dhawalhost/grocery-inventory-backend/internal/config"
    "github.com/dhawalhost/grocery-inventory-backend/internal/models"
    "gorm.io/driver/postgres"
    "gorm.io/driver/sqlite"
    "gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDatabase(cfg *config.Config) {
    var dialector gorm.Dialector

    if cfg.DBType == "postgres" {
        dsn := fmt.Sprintf(
            "host=%s user=%s password=%s dbname=%s port=%s sslmode=disable",
            cfg.DBHost, cfg.DBUser, cfg.DBPassword, cfg.DBName, cfg.DBPort,
        )
        dialector = postgres.Open(dsn)
    } else {
        dialector = sqlite.Open(cfg.DBName)
    }

    database, err := gorm.Open(dialector, &gorm.Config{})
    if err != nil {
        log.Fatal("Failed to connect to database:", err)
    }
    log.Println("Database connected via", cfg.DBType)

    if cfg.DBType == "postgres" {
        _ = database.Exec("CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";")
    }

    // Auto-migrate models
    err = database.AutoMigrate(
        &models.User{}, 
        &models.Category{}, 
        &models.Item{}, 
        &models.Transaction{}, 
        &models.Request{}, 
        &models.Device{},
    )
    if err != nil {
        log.Fatal("Failed to auto-migrate models:", err)
    }

    DB = database
}