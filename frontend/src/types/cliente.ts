export interface Cliente {
  id: string;
  nome: string;
  email: string;
  cpf: string;
  dataCadastro: string;
}

export interface CreateClienteDTO {
  nome: string;
  email: string;
  cpf: string;
}

export interface UpdateClienteDTO {
  nome?: string;
  email?: string;
  cpf?: string;
}