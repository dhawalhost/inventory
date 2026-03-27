package routes

import (
	"github.com/dhawalhost/grocery-inventory-backend/internal/handlers"
	"github.com/dhawalhost/grocery-inventory-backend/internal/middleware"
	"github.com/gin-contrib/cors"
	"github.com/gin-contrib/static"
	"github.com/gin-gonic/gin"
)

func SetupRoutes(router *gin.Engine) {
	// CORS configuration
	config := cors.DefaultConfig()
	config.AllowAllOrigins = true
	config.AllowMethods = []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"}
	config.AllowHeaders = []string{"Origin", "Content-Type", "Accept", "Authorization"}

	router.Use(cors.New(config))

	// Serve static files from the build directory
	router.Use(static.Serve("/", static.LocalFile("./build", true)))

	api := router.Group("/api")
	{
		api.GET("/health", func(c *gin.Context) {
			c.JSON(200, gin.H{"status": "ok"})
		})

		api.POST("/auth/register", handlers.RegisterUser)
		api.POST("/auth/login", handlers.Login)

		auth := api.Group("/")
		auth.Use(middleware.JWTAuthMiddleware())
		{
			// Categories
			auth.POST("/categories", handlers.CreateCategory)
			auth.GET("/categories", handlers.GetCategories)
			auth.PUT("/categories/:id", handlers.UpdateCategory)
			auth.DELETE("/categories/:id", handlers.DeleteCategory)

			// Items
			auth.POST("/items", handlers.CreateItem)
			auth.GET("/items", handlers.GetItems)
			auth.PUT("/items/:id", handlers.UpdateItem)
			auth.DELETE("/items/:id", handlers.DeleteItem)

			// Transactions
			auth.POST("/transactions", handlers.CreateTransaction)
			auth.GET("/transactions", handlers.GetTransactions)

			// Requests
			auth.POST("/requests", handlers.CreateRequest)
			auth.GET("/requests", handlers.GetRequests)
			auth.PUT("/requests/:id/order", handlers.MarkOrdered)
			auth.DELETE("/requests/:id", handlers.DeleteRequest)
		}
	}

	// Fallback for React Router (SPA)
	router.NoRoute(func(c *gin.Context) {
		c.File("./build/index.html")
	})
}
