package main

import (
    "github.com/gin-gonic/gin"
    "github.com/dhawalhost/grocery-inventory-backend/internal/config"
    "github.com/dhawalhost/grocery-inventory-backend/internal/db"
    "github.com/dhawalhost/grocery-inventory-backend/internal/routes"
)

func main() {
    cfg := config.LoadConfig()
    db.ConnectDatabase(cfg)

    router := gin.Default()
    routes.SetupRoutes(router)

    router.Run(":8080")
}