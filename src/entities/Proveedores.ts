import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Productos } from "./Productos";

@Entity("proveedores")
export class Proveedor {
  @PrimaryGeneratedColumn()
  proveedor_id!: number; // Asegúrate de que esta propiedad se llame 'proveedor_id'

  @Column({ type: "varchar", length: 100 })
  nombre_proveedor!: string;

  @OneToMany(() => Productos, (producto) => producto.proveedor)
  productos!: Productos[];
}
