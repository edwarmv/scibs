import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Material } from '../materiales/material.entity';

@Entity('unidades_manejo')
export class UnidadManejo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  nombre: string;

  @OneToMany(() => Material, (material) => material.unidadManejo)
  materiales: Material[];
}
