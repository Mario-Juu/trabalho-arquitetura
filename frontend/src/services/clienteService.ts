import { api } from './api';
import { Cliente, CreateClienteDTO, UpdateClienteDTO } from '../types/cliente';

export const clienteService = {
  async listarTodos(): Promise<Cliente[]> {
    const response = await api.get<Cliente[]>('/clientes');
    return response.data;
  },

  async buscarPorId(id: string): Promise<Cliente> {
    const response = await api.get<Cliente>(`/clientes/${id}`);
    return response.data;
  },

  async criar(dados: CreateClienteDTO): Promise<Cliente> {
    const response = await api.post<Cliente>('/clientes', dados);
    return response.data;
  },

  async atualizar(id: string, dados: UpdateClienteDTO): Promise<Cliente> {
    const response = await api.put<Cliente>(`/clientes/${id}`, dados);
    return response.data;
  },

  async deletar(id: string): Promise<void> {
    await api.delete(`/clientes/${id}`);
  },
};