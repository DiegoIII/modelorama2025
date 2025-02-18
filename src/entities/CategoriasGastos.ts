import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Gastos } from "./Gastos"; // Asegúrate de importar la entidad Gastos

@Entity("categories_gastos")
export class CategoriasGastos {
  @PrimaryGeneratedColumn()
  categoria_gasto_id!: number;

  @Column({ type: "varchar", length: 255, nullable: false })
  nombre_categoria_gasto!: string;

  @Column({ type: "timestamp", nullable: false })
  created_at!: Date;

  @OneToMany(() => Gastos, (gasto) => gasto.categoria)
  gastos!: Gastos[];
}
