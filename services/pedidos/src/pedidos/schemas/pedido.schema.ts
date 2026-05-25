import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PedidoDocument = Pedido & Document;

export class ItemPedido {
  @Prop({ required: true })
  produtoId: string;

  @Prop({ required: true })
  nome: string;

  @Prop({ required: true })
  quantidade: number;

  @Prop({ required: true })
  preco: number;
}

export const ItemPedidoSchema = SchemaFactory.createForClass(ItemPedido);

@Schema({ timestamps: true })
export class Pedido {
  @Prop({ type: Types.ObjectId, ref: 'Cliente', required: true })
  idCliente: Types.ObjectId;

  @Prop({ type: [ItemPedidoSchema], default: [] })
  itens: ItemPedido[];

  @Prop({ required: true })
  total: number;

  @Prop({
    required: true,
    enum: ['pendente', 'em_processamento', 'pago', 'cancelado'],
    default: 'pendente'
  })
  status: string;
}

export const PedidoSchema = SchemaFactory.createForClass(Pedido);