import { IsNotEmpty } from "class-validator";

export class CreateUsuarioDto {
  @IsNotEmpty()
  nombre: string;

  @IsNotEmpty()
  apellido: string;

  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  password: string;
}
