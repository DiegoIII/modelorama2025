import "reflect-metadata";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  Unique,
} from "typeorm";

@Entity("productos")
export class Producto {
  @PrimaryGeneratedColumn()
  producto_id!: number;

  @Column({ type: "varchar", length: 255 })
  nombre!: string;

  @Column({ type: "text" })
  descripcion!: string;

  @Column({ type: "decimal" })
  precio_compra!: number;

  @Column({ type: "decimal" })
  precio_venta!: number;

  @ManyToOne(() => Categoria, (categoria) => categoria.productos)
  categoria!: Categoria;

  @ManyToOne(() => Proveedor, (proveedor) => proveedor.productos)
  proveedor!: Proveedor;

  @Column({ type: "integer" })
  stock_minimo!: number;

  @Column({ type: "integer" })
  stock_maximo!: number;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at!: Date;
}
