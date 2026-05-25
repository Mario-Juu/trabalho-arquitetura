import { pedidosApi } from './api';
import { Pedido, CreatePedidoDTO, UpdatePedidoDTO } from '../types/pedido';
import { normalizePedido } from '../utils/api';

export const pedidoService = {
  async listarTodos(): Promise<Pedido[]> {
    const response = await pedidosApi.get<Record<string, unknown>[]>('/pedidos');
    return response.data.map(normalizePedido);
  },

  async buscarPorId(id: string): Promise<Pedido> {
    const response = await pedidosApi.get<Record<string, unknown>>(`/pedidos/${id}`);
    return normalizePedido(response.data);
  },

  async criar(dados: CreatePedidoDTO): Promise<Pedido> {
    const response = await pedidosApi.post<Record<string, unknown>>('/pedidos', dados);
    return normalizePedido(response.data);
  },

  async atualizar(id: string, dados: UpdatePedidoDTO): Promise<Pedido> {
    const response = await pedidosApi.put<Record<string, unknown>>(`/pedidos/${id}`, dados);
    return normalizePedido(response.data);
  },

  async atualizarStatus(id: string, status: string): Promise<Pedido> {
    const response = await pedidosApi.put<Record<string, unknown>>(`/pedidos/${id}/status`, { status });
    return normalizePedido(response.data);
  },

  async listarPorCliente(clienteId: string): Promise<Pedido[]> {
    const response = await pedidosApi.get<Record<string, unknown>[]>(`/pedidos/cliente/${clienteId}`);
    return response.data.map(normalizePedido);
  },
};
