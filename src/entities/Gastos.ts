import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import type { CategoriasGastos } from "./CategoriasGastos"; // Usar import type

@Entity("gastos")
export class Gastos {
  @PrimaryGeneratedColumn()
  gasto_id!: number;

  @Column({ type: "varchar", length: 255 })
  description!: string;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  monto!: number;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  fecha_gasto!: Date;

  @ManyToOne(
    "CategoriasGastos",
    (categoria: CategoriasGastos) => categoria.gastos
  )
  @JoinColumn({ name: "categoria_gasto_id" })
  categoriaGasto!: CategoriasGastos;
}
