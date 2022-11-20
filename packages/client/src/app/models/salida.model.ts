import { ComprobanteSalidas } from './comprobante-salidas.model';
import { Material } from './material.model';
import { Movimiento } from './movimiento.model';

export class Salida {
  id: number;
  cantidad: number;
  comprobanteSalidas: ComprobanteSalidas;
  material: Material;
  movimientos: Movimiento[];
}
