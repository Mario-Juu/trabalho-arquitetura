import { Controller, Get, Post, Put, Delete, Body, Param, HttpCode } from '@nestjs/common';
import { PedidosService } from './pedidos.service';
import { CreatePedidoDto, UpdatePedidoDto, UpdateStatusDto } from './dto/pedido.dto';
import { Pedido } from './schemas/pedido.schema';

@Controller('pedidos')
export class PedidosController {
  constructor(private readonly pedidosService: PedidosService) {}

  @Post()
  async create(@Body() createPedidoDto: CreatePedidoDto): Promise<Pedido> {
    return this.pedidosService.create(createPedidoDto);
  }

  @Get()
  async findAll(): Promise<Pedido[]> {
    return this.pedidosService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Pedido> {
    return this.pedidosService.findOne(id);
  }

  @Get('cliente/:clienteId')
  async findByCliente(@Param('clienteId') clienteId: string): Promise<Pedido[]> {
    return this.pedidosService.findByCliente(clienteId);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePedidoDto: UpdatePedidoDto,
  ): Promise<Pedido> {
    return this.pedidosService.update(id, updatePedidoDto);
  }

  @Put(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateStatusDto,
  ): Promise<Pedido> {
    return this.pedidosService.updateStatus(id, updateStatusDto);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: string): Promise<void> {
    return this.pedidosService.remove(id);
  }
}