import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import type { Gastos } from "./Gastos"; // Usar import type

@Entity("categorias_gastos")
export class CategoriasGastos {
  @PrimaryGeneratedColumn()
  categoria_gasto_id!: number;

  @Column({ type: "varchar", length: 100 })
  nombre_categoria_gasto!: string;

  @OneToMany("Gastos", (gasto: Gastos) => gasto.categoriaGasto)
  gastos!: Gastos[];
}
