"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import CartSidebar from "./CartSidebar";

export default function FloatingCartButton() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { obtenerCantidadTotal, obtenerTotal } = useCart();

  const cantidadTotal = obtenerCantidadTotal();
  const total = obtenerTotal();

  if (cantidadTotal === 0) return null;

  return (
    <>
      {/* Botón flotante */}
      <button
        onClick={() => setIsCartOpen(true)}
        className="btn btn-primary position-fixed shadow-lg d-flex align-items-center gap-2"
        style={{
          bottom: "20px",
          right: "20px",
          zIndex: 1030,
          borderRadius: "50px",
          padding: "12px 24px",
          fontSize: "1rem",
          fontWeight: "bold",
        }}
      >
        <div className="position-relative">
          <i className="bi bi-cart3 fs-5"></i>
          <span
            className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
            style={{ fontSize: "0.7rem" }}
          >
            {cantidadTotal}
          </span>
        </div>
        <span className="d-none d-md-inline">
          S/ {total.toFixed(2)}
        </span>
      </button>

      {/* Sidebar del carrito */}
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}