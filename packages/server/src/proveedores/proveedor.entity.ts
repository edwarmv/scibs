import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ComprobanteEntradas } from '../comprobantes-entradas/comprobante-entradas.entity';

@Entity('proveedores')
export class Proveedor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  nombre: string;

  @Column({ unique: true, name: 'nit_ci' })
  nitCi: string;

  @OneToMany(
    () => ComprobanteEntradas,
    (comprobanteEntradas) => comprobanteEntradas.proveedor
  )
  comprobantesEntradas: ComprobanteEntradas[];
}
