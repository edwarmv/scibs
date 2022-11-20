import { ComprobanteSalidas } from './comprobante-salidas.model';

export class Solicitante {
  id: number;
  nombre: string;
  apellido: string;
  ci: string;
  comprobantesSalidas: ComprobanteSalidas[];
}
