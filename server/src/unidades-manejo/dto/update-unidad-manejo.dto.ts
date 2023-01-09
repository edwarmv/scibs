import { IsNotEmpty } from "class-validator";

export class UpdateUnidadManejoDto {
  @IsNotEmpty()
  nombre: string
}
