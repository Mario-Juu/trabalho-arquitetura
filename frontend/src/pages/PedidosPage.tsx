import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { pedidoService } from '../services/pedidoService';
import { Pedido } from '../types/pedido';

const PedidosPage: React.FC = () => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const buscarPedidos = async () => {
    setLoading(true);
    try {
      const data = await pedidoService.listarTodos();
      setPedidos(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao buscar pedidos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    buscarPedidos();
  }, []);

  const getStatusBadge = (status: string) => {
    const badges: Record<string, string> = {
      pendente: 'badge-warning',
      em_processamento: 'badge-info',
      pago: 'badge-success',
      cancelado: 'badge-danger',
    };
    return <span className={`badge ${badges[status] || 'badge-info'}`}>{status.replace('_', ' ')}</span>;
  };

  return (
    <div className="container">
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 className="card-title" style={{ margin: 0 }}>Pedidos</h2>
          <button onClick={buscarPedidos} className="btn btn-secondary">
            Atualizar
          </button>
        </div>

        {loading ? (
          <p>Carregando...</p>
        ) : error ? (
          <div className="alert alert-error">{error}</div>
        ) : pedidos.length === 0 ? (
          <p>Nenhum pedido encontrado.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Total</th>
                <th>Status</th>
                <th>Data</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.map((pedido) => (
                <tr key={pedido.id}>
                  <td>{pedido.id.substring(0, 8)}...</td>
                  <td>{pedido.idCliente.substring(0, 8)}...</td>
                  <td>R$ {pedido.total.toFixed(2)}</td>
                  <td>{getStatusBadge(pedido.status)}</td>
                  <td>{new Date(pedido.dataCriacao).toLocaleDateString('pt-BR')}</td>
                  <td>
                    <button className="btn btn-secondary" style={{ padding: '5px 10px' }}>
                      Ver Detalhes
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

export default PedidosPage;