import { IsDateString, IsNotEmpty } from 'class-validator';
import { Gestion } from 'src/gestiones/gestion.entity';

export class CargarSaldosGestionAnteriorDto {
  @IsNotEmpty()
  from: Gestion;

  @IsNotEmpty()
  to: Gestion;

  @IsDateString()
  fechaEntrada: string;
}
