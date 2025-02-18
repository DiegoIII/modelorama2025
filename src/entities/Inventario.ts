import "reflect-metadata"; // IMPORTA ESTO PRIMERO
import { Entity, PrimaryGeneratedColumn, Column, Unique } from "typeorm";

@Entity("inventario")
export class Inventario {
  @PrimaryGeneratedColumn()
  inventario_id!: number;

  @ManyToOne(() => Producto)
  producto!: Producto;

  @Column({ type: "integer" })
  cantidad!: number;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  fecha_actualizacion!: Date;
}
