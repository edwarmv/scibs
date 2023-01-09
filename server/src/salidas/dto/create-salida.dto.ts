import { IsNotEmpty } from "class-validator";
import { ComprobanteSalidas } from "src/comprobantes-salidas/comprobante-salidas.entity";
import { Material } from "src/materiales/material.entity";

export class CreateSalidaDto {
  @IsNotEmpty()
  cantidad: number;

  @IsNotEmpty()
  comprobanteSalidas: ComprobanteSalidas;

  @IsNotEmpty()
  material: Material;
}
