import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ComprobanteEntradas } from '../comprobantes-entradas/comprobante-entradas.entity';
import { ComprobanteSalidas } from '../comprobantes-salidas/comprobante-salidas.entity';

@Entity('gestiones')
export class Gestion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'fecha_apertura', type: 'datetime' })
  fechaApertura: string;

  @Column({
    name: 'fecha_cierre',
    nullable: true,
    type: 'datetime',
    default: null,
  })
  fechaCierre: string;

  @OneToMany(
    () => ComprobanteSalidas,
    (comprobanteSalidas) => comprobanteSalidas.gestion
  )
  comprobantesSalidas: ComprobanteSalidas[];

  @OneToMany(
    () => ComprobanteEntradas,
    (comprobanteEntradas) => comprobanteEntradas.gestion
  )
  comprobantesEntradas: ComprobanteEntradas[];
}
