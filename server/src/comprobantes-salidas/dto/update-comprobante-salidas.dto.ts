import { IsDateString, IsNotEmpty } from 'class-validator';
import { Gestion } from 'src/gestiones/gestion.entity';
import { Salida } from 'src/salidas/salida.entity';
import { Solicitante } from 'src/solicitantes/solicitante.entity';

export class UpdateComprobanteSalidasDto {
  @IsNotEmpty()
  documento: string;

  @IsDateString()
  fechaSalida: string;

  @IsNotEmpty()
  solicitante: Solicitante;

  @IsNotEmpty()
  gestion: Gestion;

  @IsNotEmpty()
  salidas: Salida[];
}
