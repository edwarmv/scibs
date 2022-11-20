import { ComprobanteEntradas } from './comprobante-entradas.model';
import { ComprobanteSalidas } from './comprobante-salidas.model';

export class OrdenOperacion {
  id: number;
  orden: number;
  comprobantesEntradas: ComprobanteEntradas[];
  comprobantesSalidas: ComprobanteSalidas[];
}
