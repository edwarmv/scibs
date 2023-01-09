import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { ComprobanteSalidas } from '../comprobantes-salidas/comprobante-salidas.entity';
import { Material } from '../materiales/material.entity';
import { Movimiento } from '../movimientos/movimiento.entity';

@Unique(['comprobanteSalidas', 'material'])
@Entity('salidas')
export class Salida {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'real' })
  cantidad: number;

  @ManyToOne(
    () => ComprobanteSalidas,
    (comprobantesSalidas) => comprobantesSalidas.salidas,
    { nullable: false }
  )
  @JoinColumn({ name: 'comprobantes_salidas_id' })
  comprobanteSalidas: ComprobanteSalidas;

  @ManyToOne(() => Material, (material) => material.salidas, {
    nullable: false,
  })
  @JoinColumn({ name: 'materiales_id' })
  material: Material;

  @OneToMany(() => Movimiento, (movimiento) => movimiento.salida, {
    cascade: true,
  })
  movimientos: Movimiento[];
}
