import { Categoria } from "./categoria.interface";

export interface Producto {
  id?: number;
  nombre: string;
  id_categoria: Categoria;
  descripcion?: string;
  precio?: number;
  stock?: number;
  fecha_caducidad?: string;
  imagen?: string;
  ubicacion?: string;
}
