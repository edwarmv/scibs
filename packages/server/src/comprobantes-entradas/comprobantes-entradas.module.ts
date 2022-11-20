import { Module } from '@nestjs/common';
import { ComprobantesEntradasService } from './comprobantes-entradas.service';
import { ComprobantesEntradasController } from './comprobantes-entradas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComprobanteEntradas } from './comprobante-entradas.entity';
import { OrdenOperacionesModule } from 'src/orden-operaciones/orden-operaciones.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ComprobanteEntradas]),
    OrdenOperacionesModule,
  ],
  providers: [ComprobantesEntradasService],
  controllers: [ComprobantesEntradasController],
})
export class ComprobantesEntradasModule {}
