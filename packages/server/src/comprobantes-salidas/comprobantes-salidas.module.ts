import { Module } from '@nestjs/common';
import { ComprobantesSalidasService } from './comprobantes-salidas.service';
import { ComprobantesSalidasController } from './comprobantes-salidas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComprobanteSalidas } from './comprobante-salidas.entity';
import { SalidasModule } from 'src/salidas/salidas.module';
import { OrdenOperacionesModule } from 'src/orden-operaciones/orden-operaciones.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ComprobanteSalidas]),
    SalidasModule,
    OrdenOperacionesModule,
  ],
  providers: [ComprobantesSalidasService],
  controllers: [ComprobantesSalidasController],
})
export class ComprobantesSalidasModule {}
