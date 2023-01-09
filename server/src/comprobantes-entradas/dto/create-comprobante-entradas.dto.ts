import {
  ArrayNotEmpty,
  IsDateString,
  IsNotEmpty,
  ValidateIf,
} from 'class-validator';
import { Entrada } from 'src/entradas/entrada.entity';
import { Gestion } from 'src/gestiones/gestion.entity';
import { Proveedor } from 'src/proveedores/proveedor.entity';

export class CreateComprobanteEntradasDto {
  @ValidateIf((o) => o.saldoInicial === false)
  @IsNotEmpty()
  documento: string;

  @IsDateString()
  fechaEntrada: string;

  @IsNotEmpty()
  saldoInicial: boolean;

  @ValidateIf((o) => o.saldoInicial === false)
  @IsNotEmpty()
  proveedor: Proveedor;

  @IsNotEmpty()
  gestion: Gestion;

  @ArrayNotEmpty()
  entradas: Entrada[];
}
