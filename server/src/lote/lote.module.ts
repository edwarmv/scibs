import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lote } from './lote.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Lote])],
})
export class LoteModule {}
