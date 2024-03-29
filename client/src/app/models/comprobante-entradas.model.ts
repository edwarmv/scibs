import { Entrada } from './entrada.model';
import { Gestion } from './gestion.model';
import { OrdenOperacion } from './orden-operacion.model';
import { Proveedor } from './proveedor.model';
import { Usuario } from './usuario.model';

export class ComprobanteEntradas {
  id: number;
  documento: string;
  comprobanteSaldoGestionAnterior: ComprobanteEntradas;
  saldoGestionAnterior: boolean;
  fechaEntrada: string;
  usuario: Usuario;
  proveedor: Proveedor;
  gestion: Gestion;
  entradas: Entrada[];
  ordenOperacion: OrdenOperacion;
}
