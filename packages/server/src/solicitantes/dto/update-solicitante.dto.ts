import { IsNotEmpty } from 'class-validator';

export class UpdateSolicitanteDto {
  @IsNotEmpty()
  nombre: string;

  @IsNotEmpty()
  apellido: string;

  @IsNotEmpty()
  ci: string;
}
