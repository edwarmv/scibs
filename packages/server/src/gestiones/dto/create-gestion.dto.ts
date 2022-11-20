import { IsDateString, IsNotEmpty } from 'class-validator';

export class CreateGestionDto {
  @IsNotEmpty()
  @IsDateString()
  fechaApertura: string;
}
