import { IsNotEmpty } from 'class-validator';

export class UpdatePartidaDto {
  @IsNotEmpty()
  numero: number;

  @IsNotEmpty()
  nombre: string;
}
