package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/gateway-pagamentos/transacoes/internal/models"
	"github.com/gateway-pagamentos/transacoes/internal/services"
)

type TransacaoHandler struct {
	service *services.TransacaoService
}

func NewTransacaoHandler(service *services.TransacaoService) *TransacaoHandler {
	return &TransacaoHandler{service: service}
}

func (h *TransacaoHandler) Create(c *gin.Context) {
	var req models.CreateTransacaoRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	transacao, err := h.service.Create(c.Request.Context(), req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, transacao)
}

func (h *TransacaoHandler) GetByID(c *gin.Context) {
	id := c.Param("id")

	transacao, err := h.service.FindByID(c.Request.Context(), id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, transacao)
}

func (h *TransacaoHandler) GetByPedido(c *gin.Context) {
	pedidoID := c.Param("pedidoId")

	transacao, err := h.service.FindByPedido(c.Request.Context(), pedidoID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, transacao)
}

func (h *TransacaoHandler) Cancel(c *gin.Context) {
	id := c.Param("id")

	transacao, err := h.service.Cancel(c.Request.Context(), id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, transacao)
}