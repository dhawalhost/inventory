package handlers

import (
    "net/http"
    "github.com/gin-gonic/gin"
    "github.com/dhawalhost/grocery-inventory-backend/internal/models"
    "github.com/dhawalhost/grocery-inventory-backend/internal/db"
    "golang.org/x/crypto/bcrypt"
)

type RegisterInput struct {
    Email    string `json:"email" binding:"required,email"`
    Password string `json:"password" binding:"required"`
    Name     string `json:"name"`
}

func RegisterUser(c *gin.Context) {
    var input RegisterInput
    if err := c.ShouldBindJSON(&input); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    hash, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Error hashing password"})
        return
    }

    user := models.User{
        Email:        input.Email,
        PasswordHash: string(hash),
        Name:         input.Name,
    }

    result := db.DB.Create(&user)
    if result.Error != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not create user"})
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "User registered successfully"})
}