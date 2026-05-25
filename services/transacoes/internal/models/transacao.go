package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type FormaPagamento string

const (
	CartaoCredito FormaPagamento = "cartao_credito"
	CartaoDebito  FormaPagamento = "cartao_debito"
	Pix           FormaPagamento = "pix"
	Boleto        FormaPagamento = "boleto"
)

type StatusTransacao string

const (
	TransacaoPendente  StatusTransacao = "pendente"
	TransacaoAprovada  StatusTransacao = "aprovada"
	TransacaoNegada    StatusTransacao = "negada"
	TransacaoCancelada StatusTransacao = "cancelada"
)

type Gateway string

const (
	MercadoPago Gateway = "mercadopago"
	PayPal      Gateway = "paypal"
)

type DadosGateway struct {
	Gateway       Gateway `json:"gateway" bson:"gateway"`
	TransacaoID   string  `json:"transacaoId" bson:"transacaoId"`
	StatusGateway string  `json:"statusGateway" bson:"statusGateway"`
}

type Transacao struct {
	ID             primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	IDPedido       primitive.ObjectID `json:"idPedido" bson:"idPedido"`
	FormaPagamento FormaPagamento     `json:"formaPagamento" bson:"formaPagamento"`
	Status         StatusTransacao    `json:"status" bson:"status"`
	DadosGateway   *DadosGateway     `json:"dadosGateway,omitempty" bson:"dadosGateway,omitempty"`
	DataCriacao    time.Time         `json:"dataCriacao" bson:"dataCriacao"`
}

type CreateTransacaoRequest struct {
	IDPedido       string          `json:"idPedido" binding:"required"`
	FormaPagamento FormaPagamento `json:"formaPagamento" binding:"required"`
	DadosPagamento DadosPagamento `json:"dadosPagamento"`
}

type DadosPagamento struct {
	NumeroCartao string `json:"numeroCartao,omitempty"`
	NomeTitular  string `json:"nomeTitular,omitempty"`
	Validade     string `json:"validade,omitempty"`
	CVV           string `json:"cvv,omitempty"`
	Email         string `json:"email,omitempty"`
}