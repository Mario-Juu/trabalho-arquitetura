import { transacoesApi } from './api';
import { Transacao, CreateTransacaoDTO } from '../types/transacao';
import { normalizeTransacao } from '../utils/api';

export const transacaoService = {
  async processar(dados: CreateTransacaoDTO): Promise<Transacao> {
    const response = await transacoesApi.post<Record<string, unknown>>('/transacoes', dados);
    return normalizeTransacao(response.data);
  },

  async buscarPorId(id: string): Promise<Transacao> {
    const response = await transacoesApi.get<Record<string, unknown>>(`/transacoes/${id}`);
    return normalizeTransacao(response.data);
  },

  async buscarPorPedido(pedidoId: string): Promise<Transacao> {
    const response = await transacoesApi.get<Record<string, unknown>>(`/transacoes/pedido/${pedidoId}`);
    return normalizeTransacao(response.data);
  },

  async cancelar(id: string): Promise<Transacao> {
    const response = await transacoesApi.post<Record<string, unknown>>(`/transacoes/${id}/cancelar`);
    return normalizeTransacao(response.data);
  },
};
