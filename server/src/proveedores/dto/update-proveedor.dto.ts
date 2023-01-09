import { IsNotEmpty } from 'class-validator';

export class UpdateProveedorDto {
  @IsNotEmpty()
  nombre: string;

  @IsNotEmpty()
  nitCi: string;
}
