import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn, // Importar JoinColumn
} from "typeorm";
import type { Categoria } from "./Categoria";
import type { Proveedor } from "./Proveedores";
import type { DetalleCompra } from "./DetalleCompra";
import type { DetalleVenta } from "./DetalleVenta";

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

  @ManyToOne("Categoria", (categoria: Categoria) => categoria.productos)
  @JoinColumn({ name: "categoria_id" }) // Usar JoinColumn
  categoria!: Categoria;

  @ManyToOne("Proveedor", (proveedor: Proveedor) => proveedor.productos)
  @JoinColumn({ name: "proveedor_id" }) // Usar JoinColumn
  proveedor!: Proveedor;

  @OneToMany(
    "DetalleCompra",
    (detalleCompra: DetalleCompra) => detalleCompra.producto
  )
  detallesCompra!: DetalleCompra[];

  @OneToMany(
    "DetalleVenta",
    (detalleVenta: DetalleVenta) => detalleVenta.producto
  )
  detalles!: DetalleVenta[];

  @Column({ type: "integer" })
  stock_minimo!: number;

  @Column({ type: "integer" })
  stock_maximo!: number;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at!: Date;
}
