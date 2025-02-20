import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn, // Importar JoinColumn
} from "typeorm";
import type { Compra } from "./Compra";
import type { Productos } from "./Productos";

@Entity("detalle_compras")
export class DetalleCompra {
  @PrimaryGeneratedColumn()
  detalle_compra_id!: number;

  @ManyToOne("Compra", (compra: Compra) => compra.detallesCompra)
  @JoinColumn({ name: "compra_id" }) // Usar JoinColumn
  compra!: Compra;

  @ManyToOne("Productos", (producto: Productos) => producto.detallesCompra)
  @JoinColumn({ name: "producto_id" }) // Usar JoinColumn
  producto!: Productos;

  @Column({ type: "int", nullable: false })
  cantidad!: number;

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: false })
  precio_unitario!: number;

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: false })
  subtotal!: number;
}
