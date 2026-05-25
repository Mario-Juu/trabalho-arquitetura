import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { clienteService } from '../services/clienteService';
import { Cliente, CreateClienteDTO } from '../types/cliente';

const clienteSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('Email inválido'),
  cpf: z.string().length(11, 'CPF deve ter 11 dígitos'),
});

const ClientesPage: React.FC = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const form = useForm<CreateClienteDTO>({
    resolver: zodResolver(clienteSchema),
  });

  const buscarClientes = async () => {
    setLoading(true);
    try {
      const data = await clienteService.listarTodos();
      setClientes(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao buscar clientes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    buscarClientes();
  }, []);

  const handleSubmit = async (dados: CreateClienteDTO) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await clienteService.criar(dados);
      setSuccess('Cliente cadastrado com sucesso!');
      form.reset();
      setMostrarFormulario(false);
      buscarClientes();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao cadastrar cliente');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletar = async (id: string) => {
    if (confirm('Tem certeza que deseja deletar este cliente?')) {
      setLoading(true);
      try {
        await clienteService.deletar(id);
        setSuccess('Cliente deletado com sucesso!');
        buscarClientes();
      } catch (err: any) {
        setError(err.response?.data?.message || 'Erro ao deletar cliente');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="container">
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 className="card-title" style={{ margin: 0 }}>Clientes</h2>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={buscarClientes} className="btn btn-secondary">
              Atualizar
            </button>
            <button onClick={() => setMostrarFormulario(!mostrarFormulario)} className="btn btn-primary">
              {mostrarFormulario ? 'Cancelar' : 'Novo Cliente'}
            </button>
          </div>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        {mostrarFormulario && (
          <div style={{ marginBottom: '30px', padding: '20px', backgroundColor: '#f7fafc', borderRadius: '8px' }}>
            <h3 style={{ marginBottom: '15px' }}>Cadastrar Novo Cliente</h3>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
              <div className="form-group">
                <label className="form-label">Nome Completo</label>
                <input {...form.register('nome')} className="form-input" placeholder="João Silva" />
                {form.formState.errors.nome && (
                  <span style={{ color: 'red', fontSize: '0.875rem' }}>
                    {form.formState.errors.nome.message}
                  </span>
                )}
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input {...form.register('email')} className="form-input" placeholder="joao@email.com" />
                {form.formState.errors.email && (
                  <span style={{ color: 'red', fontSize: '0.875rem' }}>
                    {form.formState.errors.email.message}
                  </span>
                )}
              </div>
              <div className="form-group">
                <label className="form-label">CPF</label>
                <input {...form.register('cpf')} className="form-input" placeholder="12345678900" maxLength={11} />
                {form.formState.errors.cpf && (
                  <span style={{ color: 'red', fontSize: '0.875rem' }}>
                    {form.formState.errors.cpf.message}
                  </span>
                )}
              </div>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Processando...' : 'Cadastrar'}
              </button>
            </form>
          </div>
        )}

        {loading ? (
          <p>Carregando...</p>
        ) : clientes.length === 0 ? (
          <p>Nenhum cliente encontrado.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Email</th>
                <th>CPF</th>
                <th>Data Cadastro</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map((cliente) => (
                <tr key={cliente.id}>
                  <td>{cliente.id.substring(0, 8)}...</td>
                  <td>{cliente.nome}</td>
                  <td>{cliente.email}</td>
                  <td>{cliente.cpf}</td>
                  <td>{new Date(cliente.dataCadastro).toLocaleDateString('pt-BR')}</td>
                  <td>
                    <button
                      onClick={() => handleDeletar(cliente.id)}
                      className="btn btn-danger"
                      style={{ padding: '5px 10px' }}
                    >
                      Deletar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ClientesPage;