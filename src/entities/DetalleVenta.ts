import "reflect-metadata";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Ventas } from "./Ventas";
import { Productos } from "./Productos";

@Entity("detalle_ventas")
export class DetalleVenta {
  @PrimaryGeneratedColumn()
  detalle_venta_id!: number;

  @ManyToOne(() => Ventas, (venta) => venta.detalles)
  @JoinColumn({ name: "venta_id" })
  venta!: Ventas;

  @ManyToOne(() => Productos, (producto) => producto.detalles)
  @JoinColumn({ name: "producto_id" })
  producto!: Productos;

  @Column({ type: "integer" })
  cantidad!: number;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  precio_unitario!: number;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  subtotal!: number;
}
