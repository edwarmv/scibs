import { Module } from '@nestjs/common';
import { ComprobantesEntradasService } from './comprobantes-entradas.service';
import { ComprobantesEntradasController } from './comprobantes-entradas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComprobanteEntradas } from './comprobante-entradas.entity';
import { OrdenOperacionesModule } from 'src/orden-operaciones/orden-operaciones.module';
import { GestionesModule } from 'src/gestiones/gestiones.module';
import { StockMaterialesModule } from 'src/stock-materiales/stock-materiales.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ComprobanteEntradas]),
    OrdenOperacionesModule,
    GestionesModule,
    StockMaterialesModule,
  ],
  providers: [ComprobantesEntradasService],
  controllers: [ComprobantesEntradasController],
})
export class ComprobantesEntradasModule {}
