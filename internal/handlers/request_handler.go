package handlers

import (
    "net/http"

    "github.com/dhawalhost/grocery-inventory-backend/internal/db"
    "github.com/dhawalhost/grocery-inventory-backend/internal/models"
    "github.com/gin-gonic/gin"
    "github.com/google/uuid"
)

type RequestInput struct {
    Name     string `json:"name" binding:"required"`
    Quantity int    `json:"quantity" binding:"required"`
    Unit     string `json:"unit" binding:"required"`
}

func CreateRequest(c *gin.Context) {
    var input RequestInput
    if err := c.ShouldBindJSON(&input); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
    userID := c.GetString("user_id")
    request := models.Request{
        Name:     input.Name,
        UserID:   uuid.MustParse(userID),
        Quantity: input.Quantity,
        Unit:     input.Unit,
    }
    if err := db.DB.Create(&request).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not create request"})
        return
    }
    c.JSON(http.StatusOK, request)
}

func GetRequests(c *gin.Context) {
    userID := c.GetString("user_id")
    var requests []models.Request
    if err := db.DB.Where("user_id = ?", userID).Find(&requests).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not fetch requests"})
        return
    }
    c.JSON(http.StatusOK, requests)
}

func MarkOrdered(c *gin.Context) {
    id := c.Param("id")
    var request models.Request
    if err := db.DB.First(&request, "id = ?", id).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Request not found"})
        return
    }
    request.IsOrdered = true
    db.DB.Save(&request)
    c.JSON(http.StatusOK, request)
}

func DeleteRequest(c *gin.Context) {
    id := c.Param("id")
    if err := db.DB.Delete(&models.Request{}, "id = ?", id).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not delete request"})
        return
    }
    c.JSON(http.StatusOK, gin.H{"message": "Request deleted"})
}