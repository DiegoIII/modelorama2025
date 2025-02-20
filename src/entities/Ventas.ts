import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  JoinColumn, // Importar JoinColumn
} from "typeorm";
import type { DetalleVenta } from "./DetalleVenta";

@Entity("ventas")
export class Ventas {
  @PrimaryGeneratedColumn()
  venta_id!: number;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  fecha_venta!: Date;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  total_venta!: number;

  @OneToMany("DetalleVenta", (detalle: DetalleVenta) => detalle.venta)
  detalles!: DetalleVenta[];
}
