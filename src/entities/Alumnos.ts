import "reflect-metadata"; // IMPORTA ESTO PRIMERO
import { Entity, PrimaryGeneratedColumn, Column, Unique } from "typeorm";

@Entity("alumnos") // Nombre de la tabla en la BD
@Unique(["email"]) // Evita duplicados en el email
export class Alumno {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 100, nullable: false })
  name!: string;

  @Column({ type: "varchar", length: 255, nullable: false })
  email!: string;
}
