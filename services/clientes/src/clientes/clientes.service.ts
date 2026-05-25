import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cliente, ClienteDocument } from './schemas/cliente.schema';
import { CreateClienteDto, UpdateClienteDto } from './dto/cliente.dto';

@Injectable()
export class ClientesService {
  constructor(
    @InjectModel(Cliente.name) private clienteModel: Model<ClienteDocument>,
  ) {}

  async create(createClienteDto: CreateClienteDto): Promise<Cliente> {
    try {
      const cliente = new this.clienteModel(createClienteDto);
      return await cliente.save();
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('Email ou CPF já cadastrado');
      }
      throw error;
    }
  }

  async findAll(): Promise<Cliente[]> {
    return this.clienteModel.find().exec();
  }

  async findOne(id: string): Promise<Cliente> {
    const cliente = await this.clienteModel.findById(id).exec();
    if (!cliente) {
      throw new NotFoundException(`Cliente com ID ${id} não encontrado`);
    }
    return cliente;
  }

  async findByEmail(email: string): Promise<Cliente | null> {
    return this.clienteModel.findOne({ email }).exec();
  }

  async update(id: string, updateClienteDto: UpdateClienteDto): Promise<Cliente> {
    try {
      const cliente = await this.clienteModel
        .findByIdAndUpdate(id, updateClienteDto, { new: true })
        .exec();
      if (!cliente) {
        throw new NotFoundException(`Cliente com ID ${id} não encontrado`);
      }
      return cliente;
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('Email ou CPF já cadastrado');
      }
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    const result = await this.clienteModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Cliente com ID ${id} não encontrado`);
    }
  }
}