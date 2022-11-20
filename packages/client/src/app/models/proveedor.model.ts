import { ComprobanteEntradas } from "./comprobante-entradas.model";

export class Proveedor {
  id: number;
  nombre: string;
  nitCi: string;
  comprobantesEntradas: ComprobanteEntradas[]
}
