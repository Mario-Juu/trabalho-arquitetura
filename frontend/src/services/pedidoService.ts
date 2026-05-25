import { api } from './api';
import { Pedido, CreatePedidoDTO, UpdatePedidoDTO } from '../types/pedido';

const PEDIDOS_API = 'http://localhost:3002';

export const pedidoService = {
  async listarTodos(): Promise<Pedido[]> {
    const response = await api.get<Pedido[]>(`${PEDIDOS_API}/api/pedidos`);
    return response.data;
  },

  async buscarPorId(id: string): Promise<Pedido> {
    const response = await api.get<Pedido>(`${PEDIDOS_API}/api/pedidos/${id}`);
    return response.data;
  },

  async criar(dados: CreatePedidoDTO): Promise<Pedido> {
    const response = await api.post<Pedido>(`${PEDIDOS_API}/api/pedidos`, dados);
    return response.data;
  },

  async atualizar(id: string, dados: UpdatePedidoDTO): Promise<Pedido> {
    const response = await api.put<Pedido>(`${PEDIDOS_API}/api/pedidos/${id}`, dados);
    return response.data;
  },

  async atualizarStatus(id: string, status: string): Promise<Pedido> {
    const response = await api.put<Pedido>(`${PEDIDOS_API}/api/pedidos/${id}/status`, { status });
    return response.data;
  },

  async listarPorCliente(clienteId: string): Promise<Pedido[]> {
    const response = await api.get<Pedido[]>(`${PEDIDOS_API}/api/pedidos/cliente/${clienteId}`);
    return response.data;
  },
};