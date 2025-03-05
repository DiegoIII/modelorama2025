// types/detalleVenta.ts
export interface DetalleVenta {
  detalle_venta_id: number;
  venta_id: number;
  producto_id: number;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
}
