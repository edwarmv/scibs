import { IsNotEmpty, ValidateIf } from 'class-validator';
import { Gestion } from 'src/gestiones/gestion.entity';
import { Salida } from 'src/salidas/salida.entity';
import { Solicitante } from 'src/solicitantes/solicitante.entity';

export class CreateComprobanteSalidasDto {
  @ValidateIf((o) => o.vencido === false)
  @IsNotEmpty()
  documento: string;

  @IsNotEmpty()
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
