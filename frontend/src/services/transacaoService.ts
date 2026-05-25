import { api } from './api';
import { Transacao, CreateTransacaoDTO } from '../types/transacao';

const TRANSACOES_API = 'http://localhost:8080';

export const transacaoService = {
  async processar(dados: CreateTransacaoDTO): Promise<Transacao> {
    const response = await api.post<Transacao>(`${TRANSACOES_API}/api/transacoes`, dados);
    return response.data;
  },

  async buscarPorId(id: string): Promise<Transacao> {
    const response = await api.get<Transacao>(`${TRANSACOES_API}/api/transacoes/${id}`);
    return response.data;
  },

  async buscarPorPedido(pedidoId: string): Promise<Transacao> {
    const response = await api.get<Transacao>(`${TRANSACOES_API}/api/transacoes/pedido/${pedidoId}`);
    return response.data;
  },

  async cancelar(id: string): Promise<Transacao> {
    const response = await api.post<Transacao>(`${TRANSACOES_API}/api/transacoes/${id}/cancelar`);
    return response.data;
  },
};