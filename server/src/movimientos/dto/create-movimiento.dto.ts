import { IsNotEmpty } from "class-validator";
import { Entrada } from "src/entradas/entrada.entity";
import { Salida } from "src/salidas/salida.entity";

export class CreateMovimientoDto {
  @IsNotEmpty()
  entrada: Entrada;

  @IsNotEmpty()
  salida: Salida;

  @IsNotEmpty()
  cantidad: number;
}
