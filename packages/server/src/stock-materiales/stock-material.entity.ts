import { ComprobanteEntradas } from 'src/comprobantes-entradas/comprobante-entradas.entity';
import { Entrada } from 'src/entradas/entrada.entity';
import { Gestion } from 'src/gestiones/gestion.entity';
import { Material } from 'src/materiales/material.entity';
import { Movimiento } from 'src/movimientos/movimiento.entity';
import { OrdenOperacion } from 'src/orden-operaciones/orden-operacion.entity';
import { Proveedor } from 'src/proveedores/proveedor.entity';
import { DataSource, ViewColumn, ViewEntity } from 'typeorm';

@ViewEntity({
  name: 'stock_materiales',
  expression: (dataSource: DataSource) =>
    dataSource
      .createQueryBuilder()
      .select('entrada.id', 'idEntrada')
      .addSelect('entrada.cantidad', 'cantidadEntrada')
      .addSelect('entrada.precioUnitario', 'precioUnitarioEntrada')
      .addSelect('comprobanteEntradas.id', 'idComprobanteEntradas')
      .addSelect('comprobanteEntradas.fechaEntrada', 'fechaEntrada')
      .addSelect('comprobanteEntradas.saldoInicial', 'saldoInicial')
      .addSelect('gestion.id', 'idGestion')
      .addSelect(
        'comprobanteEntradas.documento',
        'documentoComprobanteEntradas'
      )
      .addSelect('proveedor.nombre', 'nombreProveedor')
      .addSelect('ordenOperacion.orden', 'orden')
      .addSelect('entrada.cantidad - IFNULL(movimiento.cantidad, 0)', 'stock')
      .addSelect('material.id', 'idMaterial')
      .addSelect('material.nombre', 'nombreMaterial')
      .from(Entrada, 'entrada')
      .leftJoin(Material, 'material', 'material.id = entrada.materiales_id')
      .leftJoin(
        ComprobanteEntradas,
        'comprobanteEntradas',
        'comprobanteEntradas.id = entrada.comprobantes_entradas_id'
      )
      .leftJoin(
        Gestion,
        'gestion',
        'gestion.id = comprobanteEntradas.gestiones_id'
      )
      .leftJoin(
        Proveedor,
        'proveedor',
        'proveedor.id = comprobanteEntradas.proveedores_id'
      )
      .leftJoin(
        OrdenOperacion,
        'ordenOperacion',
        'ordenOperacion.id = comprobanteEntradas.orden_operaciones_id'
      )
      .leftJoin(
        (db) =>
          db
            .select('SUM(mo.cantidad)', 'cantidad')
            .addSelect('mo.entradaId', 'entradaId')
            .from(Movimiento, 'mo')
            .groupBy('mo.entradaId'),
        'movimiento',
        'entrada.id = movimiento.entradaId'
      )
      .orderBy('comprobanteEntradas.fechaEntrada', 'ASC')
      .addOrderBy('ordenOperacion.orden', 'ASC'),
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
  nombreProveedor: string;

  @ViewColumn()
  documentoComprobanteEntradas: string;

  @ViewColumn()
  nombreMaterial: string;

  @ViewColumn()
  cantidadEntrada: number;

  @ViewColumn()
  precioUnitarioEntrada: number;

  @ViewColumn()
  stock: number;

  @ViewColumn({
    transformer: {
      from: (value): boolean => value === 1,
      to: (value) => value,
    },
  })
  saldoInicial: boolean;

  @ViewColumn()
  idMaterial: number;

  @ViewColumn()
  idGestion: number;
}
