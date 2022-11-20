import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Gestion } from '../gestiones/gestion.entity';
import { OrdenOperacion } from '../orden-operaciones/orden-operacion.entity';
import { Salida } from '../salidas/salida.entity';
import { Solicitante } from '../solicitantes/solicitante.entity';
import { Usuario } from '../usuarios/usuario.entity';

@Entity('comprobantes_salidas')
export class ComprobanteSalidas {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: true })
  documento: string;

  @Column({ name: 'fecha_salida', type: 'datetime' })
  fechaSalida: string;

  @Column({ default: false })
  vencido: boolean;

  @ManyToOne(() => Usuario, (usuario) => usuario.comprobantesSalidas, {
    nullable: false,
  })
  @JoinColumn({ name: 'usuarios_id' })
  usuario: Usuario;

  @ManyToOne(
    () => Solicitante,
    (solicitante) => solicitante.comprobantesSalidas,
    { nullable: true }
  )
  @JoinColumn({ name: 'solicitantes_id' })
  solicitante: Solicitante;

  @ManyToOne(() => Gestion, (gestion) => gestion.comprobantesSalidas, {
    nullable: false,
  })
  @JoinColumn({ name: 'gestiones_id' })
  gestion: Gestion;

  @OneToMany(() => Salida, (salida) => salida.comprobanteSalidas, {
    cascade: ['insert', 'remove'],
  })
  salidas: Salida[];

  @ManyToOne(
    () => OrdenOperacion,
    (ordenOperacion) => ordenOperacion.comprobantesSalidas,
    {
      nullable: false,
      cascade: ['insert', 'remove'],
    }
  )
  @JoinColumn({ name: 'orden_operaciones_id' })
  ordenOperacion: OrdenOperacion;
}
