import React, { useEffect, useState } from 'react';
import { pedidoService } from '../services/pedidoService';
import { Pedido } from '../types/pedido';
import { formatDate, formatShortId, getApiErrorMessage } from '../utils/api';

type StatusPedido = Pedido['status'];

const STATUS_LABELS: Record<StatusPedido, string> = {
  pendente: 'Pendente',
  em_processamento: 'Em processamento',
  pago: 'Pago',
  cancelado: 'Cancelado',
};

const PedidosPage: React.FC = () => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const buscarPedidos = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await pedidoService.listarTodos();
      setPedidos(data);
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, 'Erro ao buscar pedidos'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    buscarPedidos();
  }, []);

  const handleAtualizarStatus = async (id: string, status: StatusPedido) => {
    if (!id) return;
    setUpdatingId(id);
    setError(null);
    setSuccess(null);
    try {
      await pedidoService.atualizarStatus(id, status);
      setSuccess(`Pedido atualizado para "${STATUS_LABELS[status]}".`);
      await buscarPedidos();
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, 'Erro ao atualizar status do pedido'));
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadge = (status: StatusPedido) => {
    const badges: Record<StatusPedido, string> = {
      pendente: 'badge-warning',
      em_processamento: 'badge-info',
      pago: 'badge-success',
      cancelado: 'badge-danger',
    };
    return (
      <span className={`badge ${badges[status] || 'badge-info'}`}>
        {STATUS_LABELS[status] ?? status}
      </span>
    );
  };

  const renderAcoes = (pedido: Pedido) => {
    const busy = updatingId === pedido.id;

    if (pedido.status === 'pago' || pedido.status === 'cancelado') {
      return <span style={{ color: '#718096', fontSize: '0.875rem' }}>—</span>;
    }

    return (
      <div className="actions-cell">
        {pedido.status === 'pendente' && (
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            disabled={busy}
            onClick={() => handleAtualizarStatus(pedido.id, 'em_processamento')}
          >
            Processar
          </button>
        )}
        <button
          type="button"
          className="btn btn-success btn-sm"
          disabled={busy}
          onClick={() => handleAtualizarStatus(pedido.id, 'pago')}
        >
          Aprovar
        </button>
        <button
          type="button"
          className="btn btn-danger btn-sm"
          disabled={busy}
          onClick={() => handleAtualizarStatus(pedido.id, 'cancelado')}
        >
          Cancelar
        </button>
      </div>
    );
  };

  return (
    <div className="container">
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h2 className="card-title" style={{ margin: 0 }}>Pedidos</h2>
            <p style={{ margin: '8px 0 0', color: '#4a5568', fontSize: '0.875rem' }}>
              Pedidos pagos no checkout são aprovados automaticamente. Use as ações para alterar manualmente.
            </p>
          </div>
          <button onClick={buscarPedidos} className="btn btn-secondary" disabled={loading}>
            Atualizar
          </button>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        {loading ? (
          <p>Carregando...</p>
        ) : pedidos.length === 0 ? (
          <p>Nenhum pedido encontrado.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Itens</th>
                <th>Total</th>
                <th>Status</th>
                <th>Data</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.map((pedido) => (
                <tr key={pedido.id || `${pedido.idCliente}-${pedido.dataCriacao}`}>
                  <td>{formatShortId(pedido.id)}</td>
                  <td>{formatShortId(pedido.idCliente)}</td>
                  <td>{pedido.itens.length}</td>
                  <td>R$ {pedido.total.toFixed(2)}</td>
                  <td>{getStatusBadge(pedido.status)}</td>
                  <td>{formatDate(pedido.dataCriacao)}</td>
                  <td>{renderAcoes(pedido)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default PedidosPage;
