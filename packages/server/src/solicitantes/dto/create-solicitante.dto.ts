import { IsNotEmpty } from 'class-validator';

export class CreateSolicitanteDto {
  @IsNotEmpty()
  nombre: string;

  @IsNotEmpty()
  apellido: string;

  @IsNotEmpty()
  ci: string;
}
