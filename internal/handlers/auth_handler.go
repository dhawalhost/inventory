package handlers

import (
    "net/http"
    "os"
    "time"

    "github.com/dhawalhost/grocery-inventory-backend/internal/db"
    "github.com/dhawalhost/grocery-inventory-backend/internal/models"
    "github.com/gin-gonic/gin"
    "github.com/golang-jwt/jwt/v4"
    "golang.org/x/crypto/bcrypt"
)

type LoginInput struct {
    Email    string `json:"email" binding:"required,email"`
    Password string `json:"password" binding:"required"`
}

func Login(c *gin.Context) {
    var input LoginInput
    if err := c.ShouldBindJSON(&input); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    var user models.User
    if err := db.DB.Where("email = ?", input.Email).First(&user).Error; err != nil {
        c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or password"})
        return
    }

    if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(input.Password)); err != nil {
        c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or password"})
        return
    }

    // Generate JWT
    token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
        "user_id": user.ID.String(),
        "exp":     time.Now().Add(time.Hour * 72).Unix(),
    })
    secret := os.Getenv("JWT_SECRET")
    tokenString, err := token.SignedString([]byte(secret))
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not generate token"})
        return
    }

    c.JSON(http.StatusOK, gin.H{"token": tokenString})
}