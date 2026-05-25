export type FormaPagamento = 'cartao_credito' | 'cartao_debito' | 'pix' | 'boleto';
export type StatusTransacao = 'pendente' | 'aprovada' | 'negada' | 'cancelada';
export type Gateway = 'mercadopago' | 'paypal';

export interface DadosGateway {
  gateway: Gateway;
  transacaoId: string;
  statusGateway: string;
}

export interface Transacao {
  id: string;
  idPedido: string;
  formaPagamento: FormaPagamento;
  status: StatusTransacao;
  dadosGateway?: DadosGateway;
  dataCriacao: Date;
}

export interface CreateTransacaoDTO {
  idPedido: string;
  formaPagamento: FormaPagamento;
  dadosPagamento: {
    numeroCartao?: string;
    nomeTitular?: string;
    validade?: string;
    cvv?: string;
    email?: string;
  };
}