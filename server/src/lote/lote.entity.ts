import { Entrada } from 'src/entradas/entrada.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('lotes')
export class Lote {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  lote: string;

  @Column({ name: 'fecha_vencimiento' })
  fechaVencimiento: string;

  @Column({ name: 'noficar_vencimiento', default: true })
  notificarVencimiento: boolean;

  @ManyToOne(() => Entrada, (entrada) => entrada.lotes)
  @JoinColumn({ name: 'entradas_id' })
  entrada: Entrada;
}
