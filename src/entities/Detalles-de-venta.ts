import "reflect-metadata"; // IMPORTA ESTO PRIMERO
import { Entity, PrimaryGeneratedColumn, Column, Unique } from "typeorm";

@Entity("detalle_ventas")
export class DetalleVenta {
  @PrimaryGeneratedColumn()
  detalle_venta_id!: number;

  @ManyToOne(() => Venta)
  venta!: Venta;

  @ManyToOne(() => Producto)
  producto!: Producto;

  @Column({ type: "integer" })
  cantidad!: number;

  @Column({ type: "decimal" })
  precio_unitario!: number;

  @Column({ type: "decimal" })
  subtotal!: number;
}
