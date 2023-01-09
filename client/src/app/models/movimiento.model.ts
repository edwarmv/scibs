import { Entrada } from './entrada.model';
import { Salida } from './salida.model';

export class Movimiento {
  entradaId: number;
  salidaId: number;
  entrada: Entrada;
  salida: Salida;
  cantidad: number;
  orden: number;
}
