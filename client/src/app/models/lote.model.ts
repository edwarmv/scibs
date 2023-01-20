import { Entrada } from "./entrada.model";

export class Lote {
  id: number;
  lote: string;
  fechaVencimiento: string;
  entrada: Entrada;
  notificarVencimiento: boolean;
}
