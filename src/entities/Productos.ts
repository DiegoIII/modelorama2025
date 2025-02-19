import "reflect-metadata";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { Categoria } from "./Categoria";
import { Proveedor } from "./Proveedores";
import { DetalleVenta } from "./DetalleVenta";

@Entity("productos")
export class Productos {
  @PrimaryGeneratedColumn()
  producto_id!: number;

  @Column({ type: "varchar", length: 255 })
  nombre!: string;

  @Column({ type: "text" })
  descripcion!: string;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  precio_compra!: number;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  precio_venta!: number;

  @ManyToOne(() => Categoria, (categoria) => categoria.productos)
  @JoinColumn({ name: "categoria_id" })
  categoria!: Categoria;

  @ManyToOne(() => Proveedor, (proveedor) => proveedor.productos)
  @JoinColumn({ name: "proveedor_id" })
  proveedor!: Proveedor;

  @OneToMany(() => DetalleVenta, (detalleVenta) => detalleVenta.producto)
  detalles!: DetalleVenta[];

  @Column({ type: "integer" })
  stock_minimo!: number;

  @Column({ type: "integer" })
  stock_maximo!: number;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at!: Date;
}
