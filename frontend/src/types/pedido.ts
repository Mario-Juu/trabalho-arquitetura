export interface ItemPedido {
  produtoId: string;
  nome: string;
  quantidade: number;
  preco: number;
}

export interface Pedido {
  id: string;
  idCliente: string;
  itens: ItemPedido[];
  total: number;
  status: 'pendente' | 'em_processamento' | 'pago' | 'cancelado';
  dataCriacao: string;
}

export interface CreatePedidoDTO {
  idCliente: string;
  itens: ItemPedido[];
}

export interface UpdatePedidoDTO {
  itens?: ItemPedido[];
}