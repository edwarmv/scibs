import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { ComprobanteEntradas } from '../comprobantes-entradas/comprobante-entradas.entity';
import { Material } from '../materiales/material.entity';
import { Movimiento } from '../movimientos/movimiento.entity';

@Unique(['comprobanteEntradas', 'material'])
@Entity('entradas')
export class Entrada {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'real' })
  cantidad: number;

  @Column({ name: 'precio_unitario', type: 'real' })
  precioUnitario: number;

  @ManyToOne(
    () => ComprobanteEntradas,
    (comprobanteEntradas) => comprobanteEntradas.entradas,
    { nullable: false }
  )
  @JoinColumn({ name: 'comprobantes_entradas_id' })
  comprobanteEntradas: ComprobanteEntradas;

  @ManyToOne(() => Material, (material) => material.entradas, {
    nullable: false,
  })
  @JoinColumn({ name: 'materiales_id' })
  material: Material;

  @OneToMany(() => Movimiento, (movimiento) => movimiento.entrada)
  movimientos: Movimiento[];
}
