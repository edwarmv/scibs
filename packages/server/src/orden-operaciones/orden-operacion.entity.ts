import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ComprobanteEntradas } from "../comprobantes-entradas/comprobante-entradas.entity";
import { ComprobanteSalidas } from "../comprobantes-salidas/comprobante-salidas.entity";

@Entity("orden_operaciones")
export class OrdenOperacion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  orden: number;

  @OneToMany(
    () => ComprobanteEntradas,
    (comprobanteEntradas) => comprobanteEntradas.ordenOperacion
  )
  comprobantesEntradas: ComprobanteEntradas[];

  @OneToMany(
    () => ComprobanteSalidas,
    (comprobanteSalidas) => comprobanteSalidas.ordenOperacion
  )
  comprobantesSalidas: ComprobanteEntradas[];
}

