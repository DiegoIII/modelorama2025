import "reflect-metadata"; // IMPORTA ESTO PRIMERO
import { Entity, PrimaryGeneratedColumn, Column, Unique } from "typeorm";

@Entity("animales") // Nombre de la tabla en la BD
@Unique(["nombre"]) // Evita duplicados en el email
export class Animal {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 100, nullable: false })
  nombre!: string;
}
