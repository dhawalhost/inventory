package handlers

import (
    "net/http"

    "github.com/dhawalhost/grocery-inventory-backend/internal/db"
    "github.com/dhawalhost/grocery-inventory-backend/internal/models"
    "github.com/gin-gonic/gin"
    "github.com/google/uuid"
)

type CategoryInput struct {
    Name string `json:"name" binding:"required"`
}

func CreateCategory(c *gin.Context) {
    var input CategoryInput
    if err := c.ShouldBindJSON(&input); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
    userID := c.GetString("user_id")
    cat := models.Category{
        Name:   input.Name,
        UserID: uuid.MustParse(userID),
    }
    if err := db.DB.Create(&cat).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not create category"})
        return
    }
    c.JSON(http.StatusOK, cat)
}

func GetCategories(c *gin.Context) {
    userID := c.GetString("user_id")
    var categories []models.Category
    if err := db.DB.Where("user_id = ?", userID).Find(&categories).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not fetch categories"})
        return
    }
    c.JSON(http.StatusOK, categories)
}

func UpdateCategory(c *gin.Context) {
    id := c.Param("id")
    var input CategoryInput
    if err := c.ShouldBindJSON(&input); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
    var cat models.Category
    if err := db.DB.First(&cat, "id = ?", id).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Category not found"})
        return
    }
    cat.Name = input.Name
    db.DB.Save(&cat)
    c.JSON(http.StatusOK, cat)
}

func DeleteCategory(c *gin.Context) {
    id := c.Param("id")
    if err := db.DB.Delete(&models.Category{}, "id = ?", id).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not delete category"})
        return
    }
    c.JSON(http.StatusOK, gin.H{"message": "Category deleted"})
}