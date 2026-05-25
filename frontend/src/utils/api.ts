import type { AxiosError } from 'axios';
import type { Cliente } from '../types/cliente';
import type { Pedido } from '../types/pedido';
import type { Gateway, Transacao } from '../types/transacao';

type MongoDoc = Record<string, unknown>;

export function getEntityId(value: unknown): string {
  if (value == null) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return String(value);

  if (typeof value === 'object') {
    const obj = value as MongoDoc;
    if (typeof obj.$oid === 'string') return obj.$oid;
    if (obj._id != null) return getEntityId(obj._id);
    if (obj.id != null) return getEntityId(obj.id);
    if (typeof obj.toString === 'function') {
      const str = obj.toString();
      if (str && str !== '[object Object]') return str;
    }
  }

  return '';
}

export function formatShortId(id: string, length = 8): string {
  if (!id) return '-';
  return id.length > length ? `${id.slice(0, length)}...` : id;
}

export function formatDate(value: string | undefined): string {
  if (!value) return '-';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '-' : date.toLocaleDateString('pt-BR');
}

export function getApiErrorMessage(error: unknown, fallback: string): string {
  const axiosError = error as AxiosError<{ message?: string | string[]; error?: string }>;
  const data = axiosError.response?.data;
  const message = data?.message ?? data?.error;

  if (Array.isArray(message)) return message.join(', ');
  if (typeof message === 'string' && message.length > 0) return message;
  if (axiosError.message) return axiosError.message;

  return fallback;
}

function parseDateField(raw: MongoDoc, ...keys: string[]): string {
  for (const key of keys) {
    const value = raw[key];
    if (typeof value === 'string' && value.length > 0) return value;
  }
  return '';
}

export function normalizeCliente(raw: MongoDoc): Cliente {
  return {
    id: getEntityId(raw.id ?? raw._id),
    nome: String(raw.nome ?? ''),
    email: String(raw.email ?? ''),
    cpf: String(raw.cpf ?? ''),
    dataCadastro: parseDateField(raw, 'dataCadastro', 'createdAt'),
  };
}

export function normalizePedido(raw: MongoDoc): Pedido {
  const itensRaw = Array.isArray(raw.itens) ? raw.itens : [];

  return {
    id: getEntityId(raw.id ?? raw._id),
    idCliente: getEntityId(raw.idCliente),
    itens: itensRaw.map((item) => {
      const i = item as MongoDoc;
      return {
        produtoId: String(i.produtoId ?? ''),
        nome: String(i.nome ?? ''),
        quantidade: Number(i.quantidade ?? 0),
        preco: Number(i.preco ?? 0),
      };
    }),
    total: Number(raw.total ?? 0),
    status: (raw.status as Pedido['status']) ?? 'pendente',
    dataCriacao: parseDateField(raw, 'dataCriacao', 'createdAt'),
  };
}

export function normalizeTransacao(raw: MongoDoc): Transacao {
  const dadosGateway = raw.dadosGateway as MongoDoc | undefined;

  return {
    id: getEntityId(raw.id ?? raw._id),
    idPedido: getEntityId(raw.idPedido),
    formaPagamento: raw.formaPagamento as Transacao['formaPagamento'],
    status: raw.status as Transacao['status'],
    dadosGateway: dadosGateway
      ? {
          gateway: dadosGateway.gateway as Gateway,
          transacaoId: String(dadosGateway.transacaoId ?? ''),
          statusGateway: String(dadosGateway.statusGateway ?? ''),
        }
      : undefined,
    dataCriacao: parseDateField(raw, 'dataCriacao', 'createdAt'),
  };
}
