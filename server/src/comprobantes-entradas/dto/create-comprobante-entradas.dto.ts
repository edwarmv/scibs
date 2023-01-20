import {
  ArrayNotEmpty,
  IsDateString,
  IsNotEmpty,
} from 'class-validator';
import { Entrada } from 'src/entradas/entrada.entity';
import { Gestion } from 'src/gestiones/gestion.entity';
import { Proveedor } from 'src/proveedores/proveedor.entity';

export class CreateComprobanteEntradasDto {
  @IsNotEmpty()
  documento: string;

  @IsDateString()
  fechaEntrada: string;

  @IsNotEmpty()
  proveedor: Proveedor;

  @IsNotEmpty()
  gestion: Gestion;

  @ArrayNotEmpty()
  entradas: Entrada[];
}
