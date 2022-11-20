import { randomBytes, scryptSync } from 'crypto';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ComprobanteEntradas } from '../comprobantes-entradas/comprobante-entradas.entity';
import { ComprobanteSalidas } from '../comprobantes-salidas/comprobante-salidas.entity';

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  apellido: string;

  @Column({ unique: true })
  username: string;

  @Column({ select: false })
  key: string;

  @Column({ select: false })
  salt: string;

  @Column({ default: false, name: 'password_cambiado' })
  passwordCambiado: boolean;

  @OneToMany(
    () => ComprobanteSalidas,
    (comprobanteSalidas) => comprobanteSalidas.usuario
  )
  comprobantesSalidas: ComprobanteSalidas[];

  @OneToMany(
    () => ComprobanteEntradas,
    (comprobanteEntradas) => comprobanteEntradas.usuario
  )
  comprobantesEntradas: ComprobanteEntradas[];

  setPassword(password: string): void {
    const salt = randomBytes(8).toString('hex');
    this.key = scryptSync(password, salt, 64).toString('hex');
    this.salt = salt;
  }

  checkPassword(password: string): boolean {
    const key = scryptSync(password, this.salt, 64).toString('hex');
    return this.key === key;
  }
}
