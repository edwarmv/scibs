import { IsNotEmpty } from 'class-validator';
import { Gestion } from 'src/gestiones/gestion.entity';
import { Salida } from 'src/salidas/salida.entity';
import { Solicitante } from 'src/solicitantes/solicitante.entity';

export class UpdateComprobanteSalidaDto {
  @IsNotEmpty()
  documento: string;

  @IsNotEmpty()
  fechaSalida: string;

  vencido: boolean;

  @IsNotEmpty()
  solicitante: Solicitante;

  @IsNotEmpty()
  gestion: Gestion;

  @IsNotEmpty()
  salidas: Salida[];
}
