import { IsDateString, IsNotEmpty, ValidateIf } from 'class-validator';
import { Gestion } from 'src/gestiones/gestion.entity';
import { Salida } from 'src/salidas/salida.entity';
import { Solicitante } from 'src/solicitantes/solicitante.entity';

export class UpdateComprobanteSalidasDto {
  @ValidateIf((o) => o.vencido === false)
  @IsNotEmpty()
  documento: string;

  @IsDateString()
  fechaSalida: string;

  vencido: boolean;

  @ValidateIf((o) => o.vencido === false)
  @IsNotEmpty()
  solicitante: Solicitante;

  @IsNotEmpty()
  gestion: Gestion;

  @IsNotEmpty()
  salidas: Salida[];
}
