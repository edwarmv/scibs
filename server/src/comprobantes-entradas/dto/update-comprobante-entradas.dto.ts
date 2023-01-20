import {
  ArrayNotEmpty,
  IsDateString,
  IsNotEmpty,
} from 'class-validator';
import { Entrada } from 'src/entradas/entrada.entity';
import { Gestion } from 'src/gestiones/gestion.entity';
import { Proveedor } from 'src/proveedores/proveedor.entity';

export class UpdateComprobanteEntradasDto {
  @IsNotEmpty()
  documento: string;

  @IsDateString()
  fechaEntrada: string;

  @IsNotEmpty()
  saldoGestionAnterior: boolean;

  @IsNotEmpty()
  proveedor: Proveedor;

  @IsNotEmpty()
  gestion: Gestion;

  @ArrayNotEmpty()
  entradas: Entrada[];
}
