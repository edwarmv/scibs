import { ComprobanteEntradas } from './comprobante-entradas.model';
import { ComprobanteSalidas } from './comprobante-salidas.model';

export class Gestion {
  id: number;
  fechaApertura: string;
  fechaCierre: string;
  comprobantesSalidas: ComprobanteSalidas[];
  comprobantesEntradas: ComprobanteEntradas[];
}
