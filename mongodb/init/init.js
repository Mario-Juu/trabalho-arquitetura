// Initialize Gateway Pagamentos Database

// Create collections
db.createCollection("clientes");
db.createCollection("pedidos");
db.createCollection("transacoes");

// Create indexes for clientes
db.clientes.createIndex({ "email": 1 }, { unique: true });
db.clientes.createIndex({ "cpf": 1 }, { unique: true });
db.clientes.createIndex({ "createdAt": 1 });

// Create indexes for pedidos
db.pedidos.createIndex({ "idCliente": 1 });
db.pedidos.createIndex({ "status": 1 });
db.pedidos.createIndex({ "createdAt": 1 });

// Create indexes for transacoes
db.transacoes.createIndex({ "idPedido": 1 }, { unique: true });
db.transacoes.createIndex({ "status": 1 });
db.transacoes.createIndex({ "formaPagamento": 1 });
db.transacoes.createIndex({ "createdAt": 1 });

print("Collections and indexes created successfully!");