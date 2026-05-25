import axios from 'axios';

const CLIENTES_API = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
const PEDIDOS_API = import.meta.env.VITE_PEDIDOS_API_URL || 'http://localhost:3002/api';
const TRANSACOES_API = import.meta.env.VITE_TRANSACOES_API_URL || 'http://localhost:8080/api';

export const clientesApi = axios.create({
  baseURL: CLIENTES_API,
  headers: { 'Content-Type': 'application/json' },
});

export const pedidosApi = axios.create({
  baseURL: PEDIDOS_API,
  headers: { 'Content-Type': 'application/json' },
});

export const transacoesApi = axios.create({
  baseURL: TRANSACOES_API,
  headers: { 'Content-Type': 'application/json' },
});

/** @deprecated Use clientesApi, pedidosApi ou transacoesApi */
export const api = clientesApi;

const attachErrorLogger = (instance: typeof clientesApi) => {
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      console.error('API Error:', error.response?.data || error.message);
      return Promise.reject(error);
    }
  );
};

attachErrorLogger(clientesApi);
attachErrorLogger(pedidosApi);
attachErrorLogger(transacoesApi);
