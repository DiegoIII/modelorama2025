import "reflect-metadata"; // IMPORTA ESTO PRIMERO
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Productos } from "./Productos";

@Entity("inventario")
export class Inventario {
  @PrimaryGeneratedColumn()
  inventario_id!: number;

  @ManyToOne(() => Productos)
  producto!: Productos;

  @Column({ type: "integer" })
  cantidad!: number;

  //Fecha
  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  fecha_actualizacion!: Date;
}
