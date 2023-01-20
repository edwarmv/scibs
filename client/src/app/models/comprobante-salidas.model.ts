import { Gestion } from './gestion.model';
import { OrdenOperacion } from './orden-operacion.model';
import { Salida } from './salida.model';
import { Solicitante } from './solicitante.model';
import { Usuario } from './usuario.model';

export class ComprobanteSalidas {
  id: number;
  documento: string;
  fechaSalida: string;
  usuario: Usuario;
  solicitante: Solicitante;
  gestion: Gestion;
  salidas: Salida[];
  ordenOperacion: OrdenOperacion;
}
