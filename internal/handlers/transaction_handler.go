package handlers

import (
    "net/http"
    "time"

    "github.com/dhawalhost/grocery-inventory-backend/internal/db"
    "github.com/dhawalhost/grocery-inventory-backend/internal/models"
    "github.com/gin-gonic/gin"
    "github.com/google/uuid"
)

type TransactionInput struct {
    ItemID uuid.UUID `json:"item_id" binding:"required"`
    Change int       `json:"change" binding:"required"`
    Reason string    `json:"reason"`
}

func CreateTransaction(c *gin.Context) {
    var input TransactionInput
    if err := c.ShouldBindJSON(&input); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
    userID := c.GetString("user_id")
    tr := models.Transaction{
        ItemID:    input.ItemID,
        UserID:    uuid.MustParse(userID),
        Change:    input.Change,
        Reason:    input.Reason,
        Timestamp: time.Now(),
    }
    if err := db.DB.Create(&tr).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not create transaction"})
        return
    }
    // Update item quantity
    var item models.Item
    if err := db.DB.First(&item, "id = ?", input.ItemID).Error; err == nil {
        item.Quantity += input.Change
        db.DB.Save(&item)
    }
    c.JSON(http.StatusOK, tr)
}

func GetTransactions(c *gin.Context) {
    userID := c.GetString("user_id")
    var transactions []models.Transaction
    if err := db.DB.Where("user_id = ?", userID).Order("timestamp desc").Find(&transactions).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not fetch transactions"})
        return
    }
    c.JSON(http.StatusOK, transactions)
}