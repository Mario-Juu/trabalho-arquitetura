package config

import (
	"log"
	"os"

	"github.com/spf13/viper"
)

type Config struct {
	Port                 string
	MongoURI             string
	PedidosServiceURL    string
	MercadoPagoToken     string
	PayPalClientID       string
	PayPalClientSecret  string
}

var AppConfig *Config

func LoadConfig() {
	viper.AutomaticEnv()

	viper.SetDefault("PORT", "8080")
	viper.SetDefault("MONGODB_URI", "mongodb://localhost:27017/gateway_pagamentos")
	viper.SetDefault("PEDIDOS_SERVICE_URL", "http://localhost:3002")

	AppConfig = &Config{
		Port:                 viper.GetString("PORT"),
		MongoURI:             viper.GetString("MONGODB_URI"),
		PedidosServiceURL:    viper.GetString("PEDIDOS_SERVICE_URL"),
		MercadoPagoToken:     os.Getenv("MERCADO_PAGO_ACCESS_TOKEN"),
		PayPalClientID:       os.Getenv("PAYPAL_CLIENT_ID"),
		PayPalClientSecret:   os.Getenv("PAYPAL_CLIENT_SECRET"),
	}

	log.Printf("Config loaded: Port=%s, MongoURI=%s", AppConfig.Port, AppConfig.MongoURI)
}