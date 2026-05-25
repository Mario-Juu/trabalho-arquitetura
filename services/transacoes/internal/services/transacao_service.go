package services

import (
	"context"
	"fmt"
	"log"
	"time"

	"github.com/gateway-pagamentos/transacoes/internal/config"
	"github.com/gateway-pagamentos/transacoes/internal/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type TransacaoService struct {
	collection *mongo.Collection
	client     *mongo.Client
}

func NewTransacaoService(client *mongo.Client) *TransacaoService {
	collection := client.Database("gateway_pagamentos").Collection("transacoes")
	return &TransacaoService{
		collection: collection,
		client:     client,
	}
}

func (s *TransacaoService) Create(ctx context.Context, req models.CreateTransacaoRequest) (*models.Transacao, error) {
	pedidoID, err := primitive.ObjectIDFromHex(req.IDPedido)
	if err != nil {
		return nil, fmt.Errorf("ID de pedido inválido: %w", err)
	}

	transacao := &models.Transacao{
		IDPedido:       pedidoID,
		FormaPagamento: req.FormaPagamento,
		Status:         models.TransacaoPendente,
		DataCriacao:    time.Now(),
	}

	// Simular processamento com gateway externo
	result, err := s.processarComGateway(ctx, transacao, req)
	if err != nil {
		transacao.Status = models.TransacaoNegada
	} else {
		transacao = result
	}

	res, err := s.collection.InsertOne(ctx, transacao)
	if err != nil {
		return nil, fmt.Errorf("erro ao salvar transação: %w", err)
	}

	transacao.ID = res.InsertedID.(primitive.ObjectID)

	log.Printf("Transação criada: ID=%s, Status=%s", transacao.ID.Hex(), transacao.Status)

	return transacao, nil
}

func (s *TransacaoService) processarComGateway(ctx context.Context, transacao *models.Transacao, req models.CreateTransacaoRequest) (*models.Transacao, error) {
	var gateway models.Gateway
	var transacaoID string

	switch req.FormaPagamento {
	case models.CartaoCredito, models.CartaoDebito:
		if config.AppConfig.MercadoPagoToken != "" {
			gateway = models.MercadoPago
		} else if config.AppConfig.PayPalClientID != "" {
			gateway = models.PayPal
		} else {
			gateway = models.MercadoPago // Simulação
		}
		transacaoID = fmt.Sprintf("TX_%d_%s", time.Now().Unix(), generateRandomID(8))
	case models.Pix:
		gateway = models.MercadoPago
		transacaoID = fmt.Sprintf("PIX_%d_%s", time.Now().Unix(), generateRandomID(8))
	case models.Boleto:
		gateway = models.MercadoPago
		transacaoID = fmt.Sprintf("BOL_%d_%s", time.Now().Unix(), generateRandomID(8))
	}

	transacao.Status = models.TransacaoAprovada
	transacao.DadosGateway = &models.DadosGateway{
		Gateway:       gateway,
		TransacaoID:   transacaoID,
		StatusGateway: "approved",
	}

	return transacao, nil
}

func (s *TransacaoService) FindByID(ctx context.Context, id string) (*models.Transacao, error) {
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, fmt.Errorf("ID inválido: %w", err)
	}

	var transacao models.Transacao
	err = s.collection.FindOne(ctx, bson.M{"_id": objectID}).Decode(&transacao)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, fmt.Errorf("transação não encontrada")
		}
		return nil, err
	}

	return &transacao, nil
}

func (s *TransacaoService) FindByPedido(ctx context.Context, pedidoID string) (*models.Transacao, error) {
	objID, err := primitive.ObjectIDFromHex(pedidoID)
	if err != nil {
		return nil, fmt.Errorf("ID de pedido inválido: %w", err)
	}

	var transacao models.Transacao
	err = s.collection.FindOne(ctx, bson.M{"idPedido": objID}).Decode(&transacao)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, fmt.Errorf("transação não encontrada para este pedido")
		}
		return nil, err
	}

	return &transacao, nil
}

func (s *TransacaoService) Cancel(ctx context.Context, id string) (*models.Transacao, error) {
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, fmt.Errorf("ID inválido: %w", err)
	}

	filter := bson.M{"_id": objectID}
	update := bson.M{"$set": bson.M{"status": models.TransacaoCancelada}}

	opts := options.FindOneAndUpdate().SetReturnDocument(options.After)
	var transacao models.Transacao
	err = s.collection.FindOneAndUpdate(ctx, filter, update, opts).Decode(&transacao)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, fmt.Errorf("transação não encontrada")
		}
		return nil, err
	}

	log.Printf("Transação cancelada: ID=%s", id)
	return &transacao, nil
}

func generateRandomID(length int) string {
	const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
	result := make([]byte, length)
	for i := range result {
		result[i] = charset[time.Now().UnixNano()%int64(len(charset))]
	}
	return string(result)
}