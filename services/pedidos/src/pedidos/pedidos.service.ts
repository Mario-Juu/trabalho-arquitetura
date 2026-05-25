import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Pedido, PedidoDocument } from './schemas/pedido.schema';
import { CreatePedidoDto, UpdatePedidoDto, UpdateStatusDto } from './dto/pedido.dto';

@Injectable()
export class PedidosService {
  constructor(
    @InjectModel(Pedido.name) private pedidoModel: Model<PedidoDocument>,
  ) {}

  private calcularTotal(itens: { preco: number; quantidade: number }[]): number {
    return itens.reduce((acc, item) => acc + item.preco * item.quantidade, 0);
  }

  async create(createPedidoDto: CreatePedidoDto): Promise<Pedido> {
    const total = this.calcularTotal(createPedidoDto.itens);

    if (total <= 0) {
      throw new BadRequestException('Total do pedido deve ser maior que zero');
    }

    const pedido = new this.pedidoModel({
      idCliente: createPedidoDto.idCliente,
      itens: createPedidoDto.itens,
      total,
      status: 'pendente',
    });

    return pedido.save();
  }

  async findAll(): Promise<Pedido[]> {
    return this.pedidoModel.find().exec();
  }

  async findOne(id: string): Promise<Pedido> {
    const pedido = await this.pedidoModel.findById(id).exec();
    if (!pedido) {
      throw new NotFoundException(`Pedido com ID ${id} não encontrado`);
    }
    return pedido;
  }

  async findByCliente(clienteId: string): Promise<Pedido[]> {
    return this.pedidoModel.find({ idCliente: clienteId }).exec();
  }

  async update(id: string, updatePedidoDto: UpdatePedidoDto): Promise<Pedido> {
    const updateData: any = { ...updatePedidoDto };

    if (updatePedidoDto.itens) {
      updateData.total = this.calcularTotal(updatePedidoDto.itens);
    }

    const pedido = await this.pedidoModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();

    if (!pedido) {
      throw new NotFoundException(`Pedido com ID ${id} não encontrado`);
    }
    return pedido;
  }

  async updateStatus(id: string, updateStatusDto: UpdateStatusDto): Promise<Pedido> {
    const pedido = await this.pedidoModel
      .findByIdAndUpdate(id, { status: updateStatusDto.status }, { new: true })
      .exec();

    if (!pedido) {
      throw new NotFoundException(`Pedido com ID ${id} não encontrado`);
    }
    return pedido;
  }

  async remove(id: string): Promise<void> {
    const result = await this.pedidoModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Pedido com ID ${id} não encontrado`);
    }
  }
}