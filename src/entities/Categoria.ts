import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Productos } from "./Productos";

@Entity("categorias")
export class Categoria {
  @PrimaryGeneratedColumn()
  categoria_id!: number; // Asegúrate de que esta propiedad se llame 'categoria_id'

  @Column({ type: "varchar", length: 100 })
  nombre_categoria!: string;

  @OneToMany(() => Productos, (producto) => producto.categoria)
  productos!: Productos[];
}
