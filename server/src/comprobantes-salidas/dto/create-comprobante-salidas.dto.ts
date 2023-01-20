import { IsNotEmpty, ValidateIf } from 'class-validator';
import { Gestion } from 'src/gestiones/gestion.entity';
import { Salida } from 'src/salidas/salida.entity';
import { Solicitante } from 'src/solicitantes/solicitante.entity';

export class CreateComprobanteSalidasDto {
  @IsNotEmpty()
  documento: string;

  @IsNotEmpty()
  fechaSalida: string;

  @IsNotEmpty()
  solicitante: Solicitante;

  @IsNotEmpty()
  gestion: Gestion;

  @IsNotEmpty()
  salidas: Salida[];
}
