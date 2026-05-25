import { IsString, IsNotEmpty, IsArray, ValidateNested, IsNumber, Min, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

export class ItemPedidoDto {
  @IsString()
  @IsNotEmpty()
  produtoId: string;

  @IsString()
  @IsNotEmpty()
  nome: string;

  @IsNumber()
  @Min(1)
  quantidade: number;

  @IsNumber()
  @Min(0)
  preco: number;
}

export class CreatePedidoDto {
  @IsString()
  @IsNotEmpty()
  idCliente: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ItemPedidoDto)
  itens: ItemPedidoDto[];
}

export class UpdatePedidoDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ItemPedidoDto)
  itens?: ItemPedidoDto[];
}

export class UpdateStatusDto {
  @IsEnum(['pendente', 'em_processamento', 'pago', 'cancelado'])
  status: 'pendente' | 'em_processamento' | 'pago' | 'cancelado';
}