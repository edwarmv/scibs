import { IsNotEmpty } from 'class-validator';

export class CreateUnidadManejoDto {
  @IsNotEmpty()
  nombre: string;
}
