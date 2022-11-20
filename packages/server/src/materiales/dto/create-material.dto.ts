import { IsNotEmpty } from "class-validator";
import { Partida } from "src/partidas/partida.entity";
import { UnidadManejo } from "src/unidades-manejo/unidad-manejo.entity";

export class CreateMaterialDto {
  @IsNotEmpty()
  codigoIndex: number;

  @IsNotEmpty()
  nombre: string;

  @IsNotEmpty()
  stockMinimo: number;

  caracteristicas: string;

  @IsNotEmpty()
  partida: Partida;

  @IsNotEmpty()
  unidadManejo: UnidadManejo;
}
