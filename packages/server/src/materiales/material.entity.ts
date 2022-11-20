import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Entrada } from '../entradas/entrada.entity';
import { Partida } from '../partidas/partida.entity';
import { Salida } from '../salidas/salida.entity';
import { UnidadManejo } from '../unidades-manejo/unidad-manejo.entity';

@Unique(['codigoIndex', 'partida'])
@Entity('materiales')
export class Material {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'codigo_index' })
  codigoIndex: number;

  @Column({ unique: true })
  nombre: string;

  @Column({ name: 'stock_minimo' })
  stockMinimo: number;

  @Column({ nullable: true })
  caracteristicas: string;

  @ManyToOne(() => Partida, (partida) => partida.materiales, {
    nullable: false,
  })
  @JoinColumn({ name: 'partidas_id' })
  partida: Partida;

  @ManyToOne(() => UnidadManejo, (unidadManejo) => unidadManejo.materiales, {
    nullable: false,
  })
  @JoinColumn({ name: 'unidades_manejo_id' })
  unidadManejo: UnidadManejo;

  @OneToMany(() => Salida, (salida) => salida.material)
  salidas: Salida[];

  @OneToMany(() => Entrada, (ingreso) => ingreso.material)
  entradas: Entrada[];
}
