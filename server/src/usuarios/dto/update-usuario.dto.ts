import { IsNotEmpty } from 'class-validator';

export class UpdateUsuarioDto {
  @IsNotEmpty()
  nombre: string;

  @IsNotEmpty()
  apellido: string;

  @IsNotEmpty()
  username: string;
}
