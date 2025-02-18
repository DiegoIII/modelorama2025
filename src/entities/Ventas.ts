import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { DetalleVentas } from "./DetalleVentas"; // Asegúrate de importar la entidad DetalleVentas

@Entity("ventas")
export class Ventas {
  @PrimaryGeneratedColumn()
  venta_id!: number;

  @Column({ type: "timestamp", nullable: false })
  fecha_venta!: Date;

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: false })
  total_venta!: number;

  @OneToMany(() => DetalleVentas, (detalle) => detalle.venta)
  detalles!: DetalleVentas[];
}
