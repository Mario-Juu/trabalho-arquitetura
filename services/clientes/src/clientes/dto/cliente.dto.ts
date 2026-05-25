import { IsString, IsEmail, Length, IsNotEmpty } from 'class-validator';

export class CreateClienteDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 200)
  nome: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(11, 11)
  cpf: string;
}

export class UpdateClienteDto {
  @IsString()
  @Length(3, 200)
  nome?: string;

  @IsEmail()
  email?: string;

  @IsString()
  @Length(11, 11)
  cpf?: string;
}