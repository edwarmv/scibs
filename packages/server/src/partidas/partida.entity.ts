import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Material } from "../materiales/material.entity";

@Entity("partidas")
export class Partida {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  numero: number;

  @Column({ unique: true })
  nombre: string;

  @OneToMany(() => Material, (material) => material.partida)
  materiales: Material[];
}

