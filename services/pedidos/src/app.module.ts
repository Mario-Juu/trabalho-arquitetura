import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';
import { PedidosModule } from './pedidos/pedidos.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/gateway_pagamentos'),
    HttpModule,
    PedidosModule,
  ],
})
export class AppModule {}