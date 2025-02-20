import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn, // Importar JoinColumn
} from "typeorm";
import type { Proveedor } from "./Proveedores";
import type { DetalleCompra } from "./DetalleCompra";

@Entity("compras")
export class Compra {
  @PrimaryGeneratedColumn()
  compra_id!: number;

  @ManyToOne("Proveedor", (proveedor: Proveedor) => proveedor.compras)
  @JoinColumn({ name: "proveedor_id" }) // Usar JoinColumn
  proveedor!: Proveedor;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  fecha_compra!: Date;

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: false })
  total_compra!: number;

  @OneToMany(
    "DetalleCompra",
    (detalleCompra: DetalleCompra) => detalleCompra.compra
  )
  detallesCompra!: DetalleCompra[];
}
