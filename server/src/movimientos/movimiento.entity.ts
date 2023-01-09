import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Entrada } from "../entradas/entrada.entity";
import { Salida } from "../salidas/salida.entity";

@Entity("movimientos")
export class Movimiento {
  @PrimaryColumn({ name: "entradas_id" })
  entradaId: number;

  @PrimaryColumn({ name: "salidas_id" })
  salidaId: number;

  @ManyToOne(() => Entrada, (entrada) => entrada.movimientos, {
    nullable: false,
  })
  @JoinColumn({ name: "entradas_id" })
  entrada: Entrada;

  @ManyToOne(() => Salida, (salida) => salida.movimientos, {
    nullable: false,
  })
  @JoinColumn({ name: "salidas_id" })
  salida: Salida;

  @Column({ type: "real" })
  cantidad: number;

  @Column({ unique: true })
  orden: number;
}

