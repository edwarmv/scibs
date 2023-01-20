import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Gestion } from '../gestiones/gestion.entity';
import { Entrada } from '../entradas/entrada.entity';
import { OrdenOperacion } from '../orden-operaciones/orden-operacion.entity';
import { Proveedor } from '../proveedores/proveedor.entity';
import { Usuario } from '../usuarios/usuario.entity';

@Entity('comprobantes_entradas')
export class ComprobanteEntradas {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: true })
  documento: string;

  @OneToOne(() => ComprobanteEntradas, { nullable: true })
  @JoinColumn({ name: 'comprobante_saldo_gestion_anterior' })
  comprobanteSaldoGestionAnterior: ComprobanteEntradas;

  @Column({ default: false, name: 'saldo_gestion_anterior' })
  saldoGestionAnterior: boolean;

  @Column({ name: 'fecha_entrada', type: 'datetime' })
  fechaEntrada: string;

  @ManyToOne(() => Usuario, (usuario) => usuario.comprobantesEntradas, {
    nullable: false,
  })
  @JoinColumn({ name: 'usuarios_id' })
  usuario: Usuario;

  @ManyToOne(() => Proveedor, (proveedor) => proveedor.comprobantesEntradas, {
    nullable: true,
  })
  @JoinColumn({ name: 'proveedores_id' })
  proveedor: Proveedor;

  @ManyToOne(() => Gestion, (gestion) => gestion.comprobantesEntradas, {
    nullable: false,
  })
  @JoinColumn({ name: 'gestiones_id' })
  gestion: Gestion;

  @OneToMany(() => Entrada, (ingreso) => ingreso.comprobanteEntradas, {
    cascade: true,
  })
  entradas: Entrada[];

  @ManyToOne(
    () => OrdenOperacion,
    (ordenOperacion) => ordenOperacion.comprobantesEntradas,
    {
      nullable: false,
      cascade: true,
    }
  )
  @JoinColumn({ name: 'orden_operaciones_id' })
  ordenOperacion: OrdenOperacion;
}
