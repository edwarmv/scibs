import { IsDateString, IsNotEmpty, ValidateIf } from 'class-validator';

export class UpdateGestionDto {
  @IsNotEmpty()
  @IsDateString()
  fechaApertura: string;

  @ValidateIf((o) => o.fechaCierre !== '')
  @IsDateString()
  fechaCierre: string;
}
