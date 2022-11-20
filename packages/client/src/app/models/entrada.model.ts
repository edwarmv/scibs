import { ComprobanteEntradas } from './comprobante-entradas.model';
import { Material } from './material.model';
import { Movimiento } from './movimiento.model';

export class Entrada {
  id: number;
  cantidad: number;
  precioUnitario: number;
  comprobanteEntradas: ComprobanteEntradas;
  material: Material;
  movimientos: Movimiento[];
  entradaGestionAnterior: Entrada;
}
