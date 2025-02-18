import "reflect-metadata";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Compra } from "./Compra";
import { Producto } from "./Producto";

@Entity("detalle_compras") // Nombre de la tabla en la BD
export class DetalleCompra {
  @PrimaryGeneratedColumn()
  detalle_compra_id!: number;

  @ManyToOne(() => Compra, compra => compra.detallesCompra, { nullable: false })
  @JoinColumn({ name: "compra_id" })
  compra!: Compra;

  @ManyToOne(() => Producto, producto => producto.detallesCompra, { nullable: false })
  @JoinColumn({ name: "producto_id" })
  producto!: Producto;

  @Column({ type: "int", nullable: false })
  cantidad!: number;

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: false })
  precio_unitario!: number;

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: false })
  subtotal!: number;
}
