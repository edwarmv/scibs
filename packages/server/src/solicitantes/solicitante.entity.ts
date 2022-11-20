import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ComprobanteSalidas } from "../comprobantes-salidas/comprobante-salidas.entity";

@Entity("solicitantes")
export class Solicitante {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  apellido: string;

  @Column({ unique: true })
  ci: string;

  @OneToMany(
    () => ComprobanteSalidas,
    (comprobanteSalidas) => comprobanteSalidas.solicitante
  )
  comprobantesSalidas: ComprobanteSalidas[];
}

