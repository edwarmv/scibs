import { ComprobanteEntradas } from 'src/comprobantes-entradas/comprobante-entradas.entity';
import { Entrada } from 'src/entradas/entrada.entity';
import { Material } from 'src/materiales/material.entity';
import { Movimiento } from 'src/movimientos/movimiento.entity';
import { OrdenOperacion } from 'src/orden-operaciones/orden-operacion.entity';
import { DataSource, ViewColumn, ViewEntity } from 'typeorm';

@ViewEntity({
  name: 'stock_materiales',
  expression: (dataSource: DataSource) =>
    dataSource
      .createQueryBuilder()
      .select('entrada.id', 'idEntrada')
      .addSelect('comprobanteEntradas.id', 'idComprobanteEntradas')
      .addSelect('ordenOperacion.orden', 'orden')
      .addSelect('comprobanteEntradas.fechaEntrada', 'fechaEntrada')
      .addSelect('entrada.cantidad - IFNULL(movimiento.cantidad, 0)', 'stock')
      .addSelect('material.id', 'idMaterial')
      .from(Entrada, 'entrada')
      .leftJoin(Material, 'material', 'material.id = entrada.materiales_id')
      .leftJoin(
        ComprobanteEntradas,
        'comprobanteEntradas',
        'comprobanteEntradas.id = entrada.comprobantes_entradas_id'
      )
      .leftJoin(
        OrdenOperacion,
        'ordenOperacion',
        'ordenOperacion.id = comprobanteEntradas.orden_operaciones_id'
      )
      .leftJoin(Movimiento, 'movimiento', 'entrada.id = movimiento.entradas_id')
      .orderBy('comprobanteEntradas.fechaEntrada', 'ASC')
      .addOrderBy('ordenOperacion.orden', 'ASC')
      .where('stock > 0'),
})
export class StockMaterial {
  @ViewColumn()
  idEntrada: number;

  @ViewColumn()
  idComprobanteEntradas: number;

  @ViewColumn()
  orden: number;

  @ViewColumn()
  fechaEntrada: string;

  @ViewColumn()
  stock: number;

  @ViewColumn()
  idMaterial: number;
}
