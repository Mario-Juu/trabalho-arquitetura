import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { clienteService } from '../services/clienteService';
import { pedidoService } from '../services/pedidoService';
import { transacaoService } from '../services/transacaoService';
import { CreateClienteDTO } from '../types/cliente';
import { CreatePedidoDTO, ItemPedido } from '../types/pedido';
import { FormaPagamento, CreateTransacaoDTO } from '../types/transacao';

const clienteSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('Email inválido'),
  cpf: z.string().length(11, 'CPF deve ter 11 dígitos'),
});

const CheckoutPage: React.FC = () => {
  const [etapa, setEtapa] = useState<'cliente' | 'itens' | 'pagamento' | 'confirmacao'>('cliente');
  const [cliente, setCliente] = useState<CreateClienteDTO | null>(null);
  const [itens, setItens] = useState<ItemPedido[]>([]);
  const [novoItem, setNovoItem] = useState<ItemPedido>({ produtoId: '', nome: '', quantidade: 1, preco: 0 });
  const [formaPagamento, setFormaPagamento] = useState<FormaPagamento | null>(null);
  const [pedidoId, setPedidoId] = useState<string | null>(null);
  const [transacaoResult, setTransacaoResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const clienteForm = useForm<CreateClienteDTO>({
    resolver: zodResolver(clienteSchema),
  });

  const adicionarItem = () => {
    if (novoItem.nome && novoItem.preco > 0) {
      setItens([...itens, { ...novoItem, produtoId: Date.now().toString() }]);
      setNovoItem({ produtoId: '', nome: '', quantidade: 1, preco: 0 });
    }
  };

  const removerItem = (index: number) => {
    setItens(itens.filter((_, i) => i !== index));
  };

  const calcularTotal = () => {
    return itens.reduce((acc, item) => acc + item.preco * item.quantidade, 0);
  };

  const handleCadastrarCliente = async (dados: CreateClienteDTO) => {
    setLoading(true);
    setError(null);
    try {
      await clienteService.criar(dados);
      setCliente(dados);
      setEtapa('itens');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao cadastrar cliente');
    } finally {
      setLoading(false);
    }
  };

  const handleFinalizarPedido = async () => {
    if (!cliente || itens.length === 0) return;
    setLoading(true);
    setError(null);
    try {
      // Primeiro busca o cliente
      const clientes = await clienteService.listarTodos();
      const clienteExistente = clientes.find(c => c.email === cliente.email);

      if (!clienteExistente) {
        setError('Cliente não encontrado. Por favor, cadastre-se primeiro.');
        setLoading(false);
        return;
      }

      const pedidoDTO: CreatePedidoDTO = {
        idCliente: clienteExistente.id,
        itens,
      };

      const pedido = await pedidoService.criar(pedidoDTO);
      setPedidoId(pedido.id);
      setEtapa('pagamento');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao criar pedido');
    } finally {
      setLoading(false);
    }
  };

  const handleProcessarPagamento = async () => {
    if (!pedidoId || !formaPagamento) return;
    setLoading(true);
    setError(null);
    try {
      const transacaoDTO: CreateTransacaoDTO = {
        idPedido: pedidoId,
        formaPagamento,
        dadosPagamento: {},
      };

      const result = await transacaoService.processar(transacaoDTO);
      setTransacaoResult(result);
      setEtapa('confirmacao');
      setSuccess('Pagamento processado com sucesso!');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao processar pagamento');
    } finally {
      setLoading(false);
    }
  };

  const renderCliente = () => (
    <div className="card">
      <h2 className="card-title">Cadastro do Cliente</h2>
      <form onSubmit={clienteForm.handleSubmit(handleCadastrarCliente)}>
        <div className="form-group">
          <label className="form-label">Nome Completo</label>
          <input {...clienteForm.register('nome')} className="form-input" placeholder="João Silva" />
          {clienteForm.formState.errors.nome && (
            <span style={{ color: 'red', fontSize: '0.875rem' }}>
              {clienteForm.formState.errors.nome.message}
            </span>
          )}
        </div>
        <div className="form-group">
          <label className="form-label">Email</label>
          <input {...clienteForm.register('email')} className="form-input" placeholder="joao@email.com" />
          {clienteForm.formState.errors.email && (
            <span style={{ color: 'red', fontSize: '0.875rem' }}>
              {clienteForm.formState.errors.email.message}
            </span>
          )}
        </div>
        <div className="form-group">
          <label className="form-label">CPF</label>
          <input {...clienteForm.register('cpf')} className="form-input" placeholder="12345678900" maxLength={11} />
          {clienteForm.formState.errors.cpf && (
            <span style={{ color: 'red', fontSize: '0.875rem' }}>
              {clienteForm.formState.errors.cpf.message}
            </span>
          )}
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Processando...' : 'Cadastrar e Continuar'}
        </button>
      </form>
    </div>
  );

  const renderItens = () => (
    <div className="card">
      <h2 className="card-title">Itens do Pedido</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr auto', gap: '10px', marginBottom: '20px' }}>
        <input
          className="form-input"
          placeholder="Nome do produto"
          value={novoItem.nome}
          onChange={(e) => setNovoItem({ ...novoItem, nome: e.target.value })}
        />
        <input
          className="form-input"
          type="number"
          placeholder="Qtd"
          value={novoItem.quantidade}
          onChange={(e) => setNovoItem({ ...novoItem, quantidade: parseInt(e.target.value) || 0 })}
        />
        <input
          className="form-input"
          type="number"
          placeholder="Preço"
          value={novoItem.preco}
          onChange={(e) => setNovoItem({ ...novoItem, preco: parseFloat(e.target.value) || 0 })}
        />
        <button onClick={adicionarItem} className="btn btn-primary">Adicionar</button>
      </div>

      {itens.length > 0 && (
        <table className="table">
          <thead>
            <tr>
              <th>Produto</th>
              <th>Qtd</th>
              <th>Preço Unit.</th>
              <th>Subtotal</th>
              <th>Ação</th>
            </tr>
          </thead>
          <tbody>
            {itens.map((item, index) => (
              <tr key={index}>
                <td>{item.nome}</td>
                <td>{item.quantidade}</td>
                <td>R$ {item.preco.toFixed(2)}</td>
                <td>R$ {(item.preco * item.quantidade).toFixed(2)}</td>
                <td>
                  <button onClick={() => removerItem(index)} className="btn btn-danger">
                    Remover
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={3} style={{ textAlign: 'right', fontWeight: 'bold' }}>Total:</td>
              <td style={{ fontWeight: 'bold' }}>R$ {calcularTotal().toFixed(2)}</td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      )}

      <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
        <button onClick={() => setEtapa('cliente')} className="btn btn-secondary">Voltar</button>
        <button
          onClick={handleFinalizarPedido}
          className="btn btn-primary"
          disabled={itens.length === 0 || loading}
        >
          {loading ? 'Processando...' : 'Finalizar Pedido'}
        </button>
      </div>
    </div>
  );

  const renderPagamento = () => (
    <div className="card">
      <h2 className="card-title">Forma de Pagamento</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
        <div
          onClick={() => setFormaPagamento('cartao_credito')}
          style={{
            padding: '20px',
            border: formaPagamento === 'cartao_credito' ? '2px solid #3182ce' : '1px solid #e2e8f0',
            borderRadius: '8px',
            cursor: 'pointer',
            backgroundColor: formaPagamento === 'cartao_credito' ? '#ebf8ff' : 'white',
          }}
        >
          <h3>Cartão de Crédito</h3>
          <p>Pague em até 12x</p>
        </div>
        <div
          onClick={() => setFormaPagamento('pix')}
          style={{
            padding: '20px',
            border: formaPagamento === 'pix' ? '2px solid #3182ce' : '1px solid #e2e8f0',
            borderRadius: '8px',
            cursor: 'pointer',
            backgroundColor: formaPagamento === 'pix' ? '#ebf8ff' : 'white',
          }}
        >
          <h3>PIX</h3>
          <p>Pagamento instantâneo</p>
        </div>
        <div
          onClick={() => setFormaPagamento('cartao_debito')}
          style={{
            padding: '20px',
            border: formaPagamento === 'cartao_debito' ? '2px solid #3182ce' : '1px solid #e2e8f0',
            borderRadius: '8px',
            cursor: 'pointer',
            backgroundColor: formaPagamento === 'cartao_debito' ? '#ebf8ff' : 'white',
          }}
        >
          <h3>Cartão de Débito</h3>
          <p>Pagamento à vista</p>
        </div>
        <div
          onClick={() => setFormaPagamento('boleto')}
          style={{
            padding: '20px',
            border: formaPagamento === 'boleto' ? '2px solid #3182ce' : '1px solid #e2e8f0',
            borderRadius: '8px',
            cursor: 'pointer',
            backgroundColor: formaPagamento === 'boleto' ? '#ebf8ff' : 'white',
          }}
        >
          <h3>Boleto Bancário</h3>
          <p>Vencimento em 3 dias úteis</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginTop: '30px' }}>
        <button onClick={() => setEtapa('itens')} className="btn btn-secondary">Voltar</button>
        <button
          onClick={handleProcessarPagamento}
          className="btn btn-primary"
          disabled={!formaPagamento || loading}
        >
          {loading ? 'Processando...' : `Pagar R$ ${calcularTotal().toFixed(2)}`}
        </button>
      </div>
    </div>
  );

  const renderConfirmacao = () => (
    <div className="card" style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '64px', marginBottom: '20px' }}>✅</div>
      <h2 style={{ color: '#22543d', marginBottom: '10px' }}>Pagamento Aprovado!</h2>
      <p style={{ marginBottom: '20px' }}>
        Sua compra foi processada com sucesso. Em breve você receberá um email com os detalhes.
      </p>
      <div style={{ backgroundColor: '#f7fafc', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <p><strong>ID do Pedido:</strong> {pedidoId}</p>
        <p><strong>Total:</strong> R$ {calcularTotal().toFixed(2)}</p>
        <p><strong>Forma de Pagamento:</strong> {formaPagamento?.replace('_', ' ')}</p>
      </div>
      <button onClick={() => window.location.reload()} className="btn btn-primary">
        Fazer Nova Compra
      </button>
    </div>
  );

  return (
    <div className="container">
      <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
        {['cliente', 'itens', 'pagamento', 'confirmacao'].map((step, index) => (
          <div
            key={step}
            style={{
              flex: 1,
              padding: '10px',
              textAlign: 'center',
              backgroundColor: etapa === step ? '#3182ce' : '#e2e8f0',
              color: etapa === step ? 'white' : '#4a5568',
              borderRadius: '6px',
              fontWeight: etapa === step ? 'bold' : 'normal',
            }}
          >
            {index + 1}. {step.charAt(0).toUpperCase() + step.slice(1)}
          </div>
        ))}
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {etapa === 'cliente' && renderCliente()}
      {etapa === 'itens' && renderItens()}
      {etapa === 'pagamento' && renderPagamento()}
      {etapa === 'confirmacao' && renderConfirmacao()}
    </div>
  );
};

export default CheckoutPage;