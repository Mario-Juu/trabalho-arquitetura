package services

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/gateway-pagamentos/transacoes/internal/config"
)

func atualizarStatusPedido(ctx context.Context, pedidoID, status string) error {
	baseURL := config.AppConfig.PedidosServiceURL
	if baseURL == "" {
		return fmt.Errorf("PEDIDOS_SERVICE_URL não configurada")
	}

	body, err := json.Marshal(map[string]string{"status": status})
	if err != nil {
		return err
	}

	url := fmt.Sprintf("%s/api/pedidos/%s/status", baseURL, pedidoID)
	req, err := http.NewRequestWithContext(ctx, http.MethodPut, url, bytes.NewReader(body))
	if err != nil {
		return err
	}
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{Timeout: 10 * time.Second}
	res, err := client.Do(req)
	if err != nil {
		return err
	}
	defer res.Body.Close()

	if res.StatusCode < 200 || res.StatusCode >= 300 {
		return fmt.Errorf("pedidos-service retornou status %d", res.StatusCode)
	}

	return nil
}
