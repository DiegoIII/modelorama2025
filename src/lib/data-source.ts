import { Alumno } from "app/entities/Alumnos";
import { Animal } from "app/entities/Animales";
import { Categoria } from "app/entities/Categoria";
import { CategoriasGastos } from "app/entities/CategoriasGastos";
import { Compra } from "app/entities/Compra";
import { DetalleCompra } from "app/entities/DetalleCompra";
import { DetalleVenta } from "app/entities/DetalleVenta";
import { Gastos } from "app/entities/Gastos";
import { Inventario } from "app/entities/Inventario";
import { Productos } from "app/entities/Productos";
import { Proveedor } from "app/entities/Proveedores";
import { Ventas } from "app/entities/Ventas";
import "reflect-metadata";
import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 3306,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  logging: false,
  entities: [
    Alumno,
    Animal,
    Categoria,
    CategoriasGastos,
    Compra,
    DetalleCompra,
    DetalleVenta,
    Gastos,
    Inventario,
    Productos,
    Proveedor,
    Ventas,
  ],
});
