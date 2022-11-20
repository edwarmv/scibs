import { IsNotEmpty } from "class-validator";

export class CreatePartidaDto {
  @IsNotEmpty()
  numero: number;

  @IsNotEmpty()
  nombre: string;
}
