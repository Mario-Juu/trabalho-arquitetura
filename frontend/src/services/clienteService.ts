import { clientesApi } from './api';
import { Cliente, CreateClienteDTO, UpdateClienteDTO } from '../types/cliente';
import { normalizeCliente } from '../utils/api';

export const clienteService = {
  async listarTodos(): Promise<Cliente[]> {
    const response = await clientesApi.get<Record<string, unknown>[]>('/clientes');
    return response.data.map(normalizeCliente);
  },

  async buscarPorId(id: string): Promise<Cliente> {
    const response = await clientesApi.get<Record<string, unknown>>(`/clientes/${id}`);
    return normalizeCliente(response.data);
  },

  async criar(dados: CreateClienteDTO): Promise<Cliente> {
    const response = await clientesApi.post<Record<string, unknown>>('/clientes', dados);
    return normalizeCliente(response.data);
  },

  async atualizar(id: string, dados: UpdateClienteDTO): Promise<Cliente> {
    const response = await clientesApi.put<Record<string, unknown>>(`/clientes/${id}`, dados);
    return normalizeCliente(response.data);
  },

  async deletar(id: string): Promise<void> {
    await clientesApi.delete(`/clientes/${id}`);
  },
};
