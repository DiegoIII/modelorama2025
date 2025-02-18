import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { CategoriasGastos } from "./CategoriasGastos"; // Asegúrate de importar la entidad CategoriasGastos

@Entity("gastos")
export class Gastos {
  @PrimaryGeneratedColumn()
  gasto_id!: number;

  @Column({ type: "varchar", length: 255, nullable: false })
  description!: string;

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: false })
  monto!: number;

  @Column({ type: "timestamp", nullable: false })
  fecha_gasto!: Date;

  @ManyToOne(() => CategoriasGastos, (categoria) => categoria.gastos)
  @JoinColumn({ name: "categoria_gasto_id" })
  categoria!: CategoriasGastos;
}
