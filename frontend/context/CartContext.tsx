"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface Producto {
  idProducto: string;
  nombre: string;
  descripcion: string;
  precio: number;
  cateProductoId: string;
  categoriaNombre: string;
  imagenes: string[];
}

interface ItemCarrito extends Producto {
  cantidad: number;
}

interface CartContextType {
  items: ItemCarrito[];
  agregarAlCarrito: (producto: Producto) => void;
  eliminarDelCarrito: (idProducto: string) => void;
  actualizarCantidad: (idProducto: string, cantidad: number) => void;
  vaciarCarrito: () => void;
  obtenerTotal: () => number;
  obtenerCantidadTotal: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ItemCarrito[]>([]);

  const agregarAlCarrito = (producto: Producto) => {
    setItems((prevItems) => {
      const itemExistente = prevItems.find(
        (item) => item.idProducto === producto.idProducto
      );

      if (itemExistente) {
        // Si ya existe, incrementar cantidad
        return prevItems.map((item) =>
          item.idProducto === producto.idProducto
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      } else {
        // Si no existe, agregar nuevo item
        return [...prevItems, { ...producto, cantidad: 1 }];
      }
    });
  };

  const eliminarDelCarrito = (idProducto: string) => {
    setItems((prevItems) =>
      prevItems.filter((item) => item.idProducto !== idProducto)
    );
  };

  const actualizarCantidad = (idProducto: string, cantidad: number) => {
    if (cantidad <= 0) {
      eliminarDelCarrito(idProducto);
      return;
    }

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.idProducto === idProducto ? { ...item, cantidad } : item
      )
    );
  };

  const vaciarCarrito = () => {
    setItems([]);
  };

  const obtenerTotal = () => {
    return items.reduce((total, item) => total + item.precio * item.cantidad, 0);
  };

  const obtenerCantidadTotal = () => {
    return items.reduce((total, item) => total + item.cantidad, 0);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        agregarAlCarrito,
        eliminarDelCarrito,
        actualizarCantidad,
        vaciarCarrito,
        obtenerTotal,
        obtenerCantidadTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart debe ser usado dentro de un CartProvider");
  }
  return context;
}