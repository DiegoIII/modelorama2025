import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn, // Importar JoinColumn
} from "typeorm";
import type { Ventas } from "./Ventas";
import type { Productos } from "./Productos";

@Entity("detalle_ventas")
export class DetalleVenta {
  @PrimaryGeneratedColumn()
  detalle_venta_id!: number;

  @ManyToOne("Ventas", (venta: Ventas) => venta.detalles)
  @JoinColumn({ name: "venta_id" }) // Usar JoinColumn
  venta!: Ventas;

  @ManyToOne("Productos", (producto: Productos) => producto.detalles)
  @JoinColumn({ name: "producto_id" }) // Usar JoinColumn
  producto!: Productos;

  @Column({ type: "integer" })
  cantidad!: number;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  precio_unitario!: number;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  subtotal!: number;
}
