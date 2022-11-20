import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movimiento } from './movimiento.entity';
import { MovimientosService } from './movimientos.service';

@Module({
  imports: [TypeOrmModule.forFeature([Movimiento])],
  providers: [MovimientosService],
  exports: [MovimientosService],
})
export class MovimientosModule {}
