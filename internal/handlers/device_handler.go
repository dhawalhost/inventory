package handlers

import (
    "net/http"
    "github.com/gin-gonic/gin"
    "github.com/dhawalhost/grocery-inventory-backend/internal/models"
    "github.com/dhawalhost/grocery-inventory-backend/internal/db"
)

type DeviceRegisterInput struct {
    Platform string `json:"platform" binding:"required"`
    Token    string `json:"token" binding:"required"`
}

func RegisterDevice(c *gin.Context) {
    var input DeviceRegisterInput
    if err := c.ShouldBindJSON(&input); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
    userID := c.GetString("user_id")
    device := models.Device{
        UserID:  userID,
        Platform: input.Platform,
        Token:   input.Token,
    }
    db.DB.Create(&device)
    c.JSON(http.StatusOK, gin.H{"success": true})
}