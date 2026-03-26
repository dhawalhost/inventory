package handlers

import (
	"net/http"

	"github.com/dhawalhost/grocery-inventory-backend/internal/db"
	"github.com/gin-gonic/gin"
)

func MonthlyUsage(c *gin.Context) {
	userID := c.GetString("user_id")
	// Custom SQL for grouping by month and item
	var result []struct {
		Name  string
		Month string
		Used  int
	}
	err := db.DB.Raw(`
        SELECT i.name, to_char(t.timestamp, 'YYYY-MM') as month, SUM(ABS(change)) as used
        FROM transactions t
        JOIN items i ON i.id = t.item_id
        WHERE t.user_id = ?
        GROUP BY i.name, month
        ORDER BY month DESC
        LIMIT 20
    `, userID).Scan(&result).Error
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, result)
}
