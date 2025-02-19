import "reflect-metadata";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from "typeorm";
import { Productos } from "./Productos";

@Entity("categorias")
export class Categoria {
  @PrimaryGeneratedColumn({ name: "categoria_id" })
  categoriaId!: number;

  @Column({
    type: "varchar",
    length: 100,
    nullable: false,
    name: "nombre_categoria",
  })
  nombreCategoria!: string;

  @CreateDateColumn({ type: "timestamp", name: "created_at" })
  createdAt!: Date;

  @OneToMany(() => Productos, (producto) => producto.categoria)
  productos!: Productos[];
}
