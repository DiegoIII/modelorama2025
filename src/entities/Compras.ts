import "reflect-metadata";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from "typeorm";
import { Proveedor } from "./Proveedor";
import { DetalleCompra } from "./DetalleCompra";

@Entity("compras") // Nombre de la tabla en la BD
export class Compra {
  @PrimaryGeneratedColumn()
  compra_id!: number;

  @ManyToOne(() => Proveedor, proveedor => proveedor.compras, { nullable: false })
  @JoinColumn({ name: "proveedor_id" })
  proveedor!: Proveedor;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  fecha_compra!: Date;

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: false })
  total_compra!: number;

  @OneToMany(() => DetalleCompra, detalleCompra => detalleCompra.compra)
  detallesCompra!: DetalleCompra[];
}
