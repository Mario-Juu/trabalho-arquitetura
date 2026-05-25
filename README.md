# Gateway de Pagamentos para E-commerce

Sistema de processamento e validação de compras para e-commerce, desenvolvido como projeto acadêmico para a disciplina de Arquitetura de Software (UDESC - CEAVI).

## Arquitetura

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              FRONTEND                                        │
│                         React + TypeScript                                   │
│                    Interface de checkout e gestão                           │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                    ┌─────────────────┼─────────────────┐
                    ▼                 ▼                 ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│   CLIENTES   │ │   PEDIDOS    │ │ TRANSACOES   │ │   GATEWAY    │
│   SERVICE    │ │   SERVICE    │ │   SERVICE    │ │  EXTERNO     │
│              │ │              │ │              │ │              │
│ NestJS + TS  │ │ NestJS + TS  │ │  Golang      │ │ MercadoPago  │
│   :3001      │ │   :3002      │ │   :8080      │ │   PayPal     │
└──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘
        │                │                │
        └────────────────┼────────────────┘
                         ▼
              ┌──────────────────────┐
              │       MONGODB        │
              │     :27017           │
              └──────────────────────┘
```

## Tecnologias

- **Frontend**: React 18 + TypeScript + Vite
- **Serviço de Clientes**: Node.js + NestJS + TypeScript
- **Serviço de Pedidos**: Node.js + NestJS + TypeScript
- **Serviço de Transações**: Go 1.21
- **Banco de Dados**: MongoDB 7.0
- **Gateway de Pagamento**: MercadoPago, PayPal

## Estrutura do Projeto

```
gateway-pagamentos/
├── frontend/              # Interface React
├── services/
│   ├── clientes/          # NestJS - Gestão de Clientes
│   ├── pedidos/           # NestJS - Gestão de Pedidos
│   └── transacoes/         # Go - Processamento de Transações
├── mongodb/
│   └── init/              # Scripts de inicialização
├── docs/                  # Documentação técnica
└── docker-compose.yml     # Orquestração dos serviços
```

## Getting Started

### Pré-requisitos

- Docker e Docker Compose
- Node.js 18+ (para desenvolvimento local)
- Go 1.21+ (para desenvolvimento local)

### Executando com Docker

```bash
# Clonar o repositório
cd gateway-pagamentos

# Subir todos os serviços
docker-compose up -d

# Verificar logs
docker-compose logs -f
```

### Executando Localmente

1. **MongoDB**
```bash
docker-compose up -d mongodb
```

2. **Serviço de Clientes**
```bash
cd services/clientes
npm install
npm run start:dev
```

3. **Serviço de Pedidos**
```bash
cd services/pedidos
npm install
npm run start:dev
```

4. **Serviço de Transações**
```bash
cd services/transacoes
go mod download
go run cmd/server/main.go
```

5. **Frontend**
```bash
cd frontend
npm install
npm run dev
```

## API Endpoints

### Clientes Service (:3001)
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | /clientes | Criar novo cliente |
| GET | /clientes/:id | Buscar cliente por ID |
| PUT | /clientes/:id | Atualizar cliente |
| DELETE | /clientes/:id | Deletar cliente |
| GET | /clientes | Listar todos os clientes |

### Pedidos Service (:3002)
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | /pedidos | Criar novo pedido |
| GET | /pedidos/:id | Buscar pedido por ID |
| PUT | /pedidos/:id | Atualizar pedido |
| PUT | /pedidos/:id/status | Atualizar status do pedido |
| GET | /pedidos/cliente/:clienteId | Listar pedidos por cliente |

### Transações Service (:8080)
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | /transacoes | Processar transação |
| GET | /transacoes/:id | Buscar transação por ID |
| GET | /transacoes/pedido/:pedidoId | Buscar transação por pedido |
| POST | /transacoes/:id/cancelar | Cancelar transação |

## Modelos de Dados

### Cliente
```json
{
  "id": "ObjectId",
  "nome": "string",
  "email": "string",
  "cpf": "string",
  "dataCadastro": "Date"
}
```

### Pedido
```json
{
  "id": "ObjectId",
  "idCliente": "ObjectId",
  "itens": [{
    "produtoId": "string",
    "nome": "string",
    "quantidade": "number",
    "preco": "number"
  }],
  "total": "number",
  "status": "pendente | em_processamento | pago | cancelado",
  "dataCriacao": "Date"
}
```

### Transacao
```json
{
  "id": "ObjectId",
  "idPedido": "ObjectId",
  "formaPagamento": "cartao_credito | cartao_debito | pix | boleto",
  "status": "pendente | aprovada | negada | cancelada",
  "dadosGateway": {
    "gateway": "mercadopago | paypal",
    "transacaoId": "string",
    "statusGateway": "string"
  },
  "dataCriacao": "Date"
}
```

## Autores

- Felipe Rafael Beiger
- Mário Alves dos Santos Júnior

**Professor**: Me Tiago Funk

**Instituição**: UDESC - CEAVI - Departamento de Engenharia de Software