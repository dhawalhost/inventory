package handlers

import (
    "net/http"
    "time"

    "github.com/dhawalhost/grocery-inventory-backend/internal/db"
    "github.com/dhawalhost/grocery-inventory-backend/internal/models"
    "github.com/gin-gonic/gin"
    "github.com/google/uuid"
)

type ItemInput struct {
    Name       string     `json:"name" binding:"required"`
    CategoryID *uuid.UUID `json:"category_id"`
    Quantity   int        `json:"quantity" binding:"required"`
    Unit       string     `json:"unit" binding:"required"`
    ExpiryDate *string    `json:"expiry_date"` // ISO date string
    Notes      string     `json:"notes"`
}

func CreateItem(c *gin.Context) {
    var input ItemInput
    if err := c.ShouldBindJSON(&input); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
    userID := c.GetString("user_id")
    var expiry *time.Time
    if input.ExpiryDate != nil {
        t, err := time.Parse("2006-01-02", *input.ExpiryDate)
        if err != nil {
            c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid expiry date"})
            return
        }
        expiry = &t
    }
    item := models.Item{
        Name:       input.Name,
        UserID:     uuid.MustParse(userID),
        CategoryID: input.CategoryID,
        Quantity:   input.Quantity,
        Unit:       input.Unit,
        ExpiryDate: expiry,
        Notes:      input.Notes,
    }
    if err := db.DB.Create(&item).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not create item"})
        return
    }
    c.JSON(http.StatusOK, item)
}

func GetItems(c *gin.Context) {
    userID := c.GetString("user_id")
    var items []models.Item
    if err := db.DB.Where("user_id = ?", userID).Find(&items).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not fetch items"})
        return
    }
    c.JSON(http.StatusOK, items)
}

func UpdateItem(c *gin.Context) {
    id := c.Param("id")
    var input ItemInput
    if err := c.ShouldBindJSON(&input); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
    var item models.Item
    if err := db.DB.First(&item, "id = ?", id).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Item not found"})
        return
    }
    item.Name = input.Name
    item.CategoryID = input.CategoryID
    item.Quantity = input.Quantity
    item.Unit = input.Unit
    item.Notes = input.Notes
    if input.ExpiryDate != nil {
        t, err := time.Parse("2006-01-02", *input.ExpiryDate)
        if err != nil {
            c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid expiry date"})
            return
        }
        item.ExpiryDate = &t
    }
    db.DB.Save(&item)
    c.JSON(http.StatusOK, item)
}

func DeleteItem(c *gin.Context) {
    id := c.Param("id")
    if err := db.DB.Delete(&models.Item{}, "id = ?", id).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not delete item"})
        return
    }
    c.JSON(http.StatusOK, gin.H{"message": "Item deleted"})
}