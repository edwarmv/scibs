import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComprobanteEntradas } from './comprobantes-entradas/comprobante-entradas.entity';
import { ComprobanteSalidas } from './comprobantes-salidas/comprobante-salidas.entity';
import { Entrada } from './entradas/entrada.entity';
import { Gestion } from './gestiones/gestion.entity';
import { Lote } from './lote/lote.entity';
import { Material } from './materiales/material.entity';
import { Movimiento } from './movimientos/movimiento.entity';
import { OrdenOperacion } from './orden-operaciones/orden-operacion.entity';
import { Partida } from './partidas/partida.entity';
import { Proveedor } from './proveedores/proveedor.entity';
import { Salida } from './salidas/salida.entity';
import { Solicitante } from './solicitantes/solicitante.entity';
import { StockMaterial } from './stock-materiales/stock-material.entity';
import { UnidadManejo } from './unidades-manejo/unidad-manejo.entity';
import { Usuario } from './usuarios/usuario.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: './database.sqlite',
      synchronize: true,
      logging: false,
      dropSchema: false,
      entities: [
        ComprobanteEntradas,
        ComprobanteSalidas,
        Entrada,
        Gestion,
        Material,
        Movimiento,
        OrdenOperacion,
        Partida,
        Proveedor,
        Salida,
        Solicitante,
        UnidadManejo,
        Usuario,
        StockMaterial,
        Lote,
      ],
    }),
  ],
})
export class DatabaseModule {}
