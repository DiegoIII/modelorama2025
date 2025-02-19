import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Productos } from "./Productos";
import { Compra } from "./Compra";

@Entity("proveedores")
export class Proveedor {
  @PrimaryGeneratedColumn()
  proveedor_id!: number;

  @Column({ type: "varchar", length: 100 })
  nombre_proveedor!: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  contacto!: string;

  @Column({ type: "varchar", length: 20, nullable: true })
  telefono!: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  email!: string;

  @OneToMany(() => Productos, (producto) => producto.proveedor)
  productos!: Productos[];

  @OneToMany(() => Compra, (compra) => compra.proveedor)
  compras!: Compra[];
}
