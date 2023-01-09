import { Entrada } from './entrada.model';
import { Partida } from './partida.model';
import { Salida } from './salida.model';
import { UnidadManejo } from './unidad-manejo.model';

export class Material {
  id: number;
  codigoIndex: number;
  nombre: string;
  stockMinimo: number;
  caracteristicas: string;
  partida: Partida;
  unidadManejo: UnidadManejo;
  salidas: Salida[];
  entradas: Entrada[];
}
