import { IsNotEmpty } from 'class-validator';

export class CreateProveedorDto {
  @IsNotEmpty()
  nombre: string;

  @IsNotEmpty()
  nitCi: string;
}
