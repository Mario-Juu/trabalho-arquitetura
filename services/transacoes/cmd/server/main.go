package main

import (
	"log"
	"os"
	"os/signal"
	"syscall"

	"github.com/gin-gonic/gin"
	"github.com/gateway-pagamentos/transacoes/internal/config"
	"github.com/gateway-pagamentos/transacoes/internal/handlers"
	"github.com/gateway-pagamentos/transacoes/internal/services"
)

func main() {
	config.LoadConfig()

	client, err := services.ConnectMongoDB(config.AppConfig.MongoURI)
	if err != nil {
		log.Fatalf("Falha ao conectar ao MongoDB: %v", err)
	}
	defer func() {
		if err := client.Disconnect(nil); err != nil {
			log.Printf("Erro ao desconectar do MongoDB: %v", err)
		}
	}()

	log.Println("Conectado ao MongoDB com sucesso")

	transacaoService := services.NewTransacaoService(client)
	transacaoHandler := handlers.NewTransacaoHandler(transacaoService)

	gin.SetMode(gin.ReleaseMode)
	router := gin.Default()

	router.Use(func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", "*")
		c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Header("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	})

	router.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "healthy"})
	})

	api := router.Group("/api")
	{
		api.POST("/transacoes", transacaoHandler.Create)
		api.GET("/transacoes/:id", transacaoHandler.GetByID)
		api.GET("/transacoes/pedido/:pedidoId", transacaoHandler.GetByPedido)
		api.POST("/transacoes/:id/cancelar", transacaoHandler.Cancel)
	}

	go func() {
		port := config.AppConfig.Port
		log.Printf("Serviço de Transações iniciado na porta %s", port)
		if err := router.Run(":" + port); err != nil {
			log.Fatalf("Falha ao iniciar servidor: %v", err)
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	log.Println("Encerrando serviço...")
}