import { IsDateString, IsNotEmpty } from 'class-validator';

export class UpdateGestionDto {
  @IsNotEmpty()
  @IsDateString()
  fechaApertura: string;

  @IsDateString()
  fechaCierre: string;
}
