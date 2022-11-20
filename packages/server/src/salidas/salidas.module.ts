import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovimientosModule } from 'src/movimientos/movimientos.module';
import { StockMaterialesModule } from 'src/stock-materiales/stock-materiales.module';
import { Salida } from './salida.entity';
import { SalidasService } from './salidas.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Salida]),
    StockMaterialesModule,
    MovimientosModule,
  ],
  providers: [SalidasService],
  exports: [SalidasService],
})
export class SalidasModule {}
