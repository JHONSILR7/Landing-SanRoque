"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import CheckoutModal from "./CheckoutModal";

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const {
    items,
    eliminarDelCarrito,
    actualizarCantidad,
    vaciarCarrito,
    obtenerTotal,
  } = useCart();

  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [lastOrderNumber, setLastOrderNumber] = useState("");

  const IMAGEN_POR_DEFECTO = "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=100&h=100&fit=crop";

  const obtenerImagen = (imagenes: string[]) => {
    return imagenes && imagenes.length > 0 ? imagenes[0] : IMAGEN_POR_DEFECTO;
  };

  const handleFinalizarCompra = () => {
    setCheckoutOpen(true); // Solo abrir checkout, no cerrar sidebar
  };

  const handleCheckoutClose = () => {
    setCheckoutOpen(false);
    // Si hay un pedido exitoso, mostrar modal de éxito
    if (showSuccessModal) {
      // El modal de éxito ya se mostrará por CheckoutModal
    }
  };

  const handleSuccess = (orderNumber: string) => {
    setLastOrderNumber(orderNumber);
    setShowSuccessModal(true);
    // Cerrar el sidebar después de completar el pedido
    onClose();
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    setCheckoutOpen(false);
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`position-fixed top-0 start-0 w-100 h-100 bg-dark ${
          isOpen ? "d-block" : "d-none"
        }`}
        style={{
          opacity: isOpen ? 0.5 : 0,
          transition: "opacity 0.3s",
          zIndex: 1040,
        }}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className={`position-fixed top-0 end-0 h-100 bg-white shadow-lg ${
          isOpen ? "translate-x-0" : ""
        }`}
        style={{
          width: "100%",
          maxWidth: "400px",
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.3s ease-in-out",
          zIndex: 1050,
          overflowY: "auto",
        }}
      >
        {/* Header */}
        <div className="p-3 border-bottom d-flex justify-content-between align-items-center bg-light">
          <h5 className="mb-0 fw-bold">
            <i className="bi bi-cart3 me-2"></i>
            Mi Carrito ({items.length})
          </h5>
          <button
            onClick={onClose}
            className="btn btn-sm btn-outline-secondary rounded-circle"
            style={{ width: "32px", height: "32px", padding: 0 }}
          >
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        {/* Body */}
        <div className="p-3">
          {items.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-cart-x fs-1 text-muted"></i>
              <p className="mt-3 text-muted">Tu carrito está vacío</p>
              <button onClick={onClose} className="btn btn-primary mt-2">
                Explorar Productos
              </button>
            </div>
          ) : (
            <>
              {/* Items */}
              <div className="mb-3">
                {items.map((item) => (
                  <div
                    key={item.idProducto}
                    className="card mb-2 border-0 shadow-sm"
                  >
                    <div className="card-body p-2">
                      <div className="d-flex gap-2">
                        {/* Imagen */}
                        <img
                          src={obtenerImagen(item.imagenes)}
                          alt={item.nombre}
                          className="rounded"
                          style={{
                            width: "60px",
                            height: "60px",
                            objectFit: "cover",
                          }}
                        />

                        {/* Info */}
                        <div className="flex-grow-1">
                          <h6 className="mb-1 fw-bold" style={{ fontSize: "0.9rem" }}>
                            {item.nombre}
                          </h6>
                          <p
                            className="mb-1 text-muted"
                            style={{ fontSize: "0.75rem" }}
                          >
                            {item.categoriaNombre}
                          </p>
                          <p
                            className="mb-0 fw-bold"
                            style={{ color: "#d97706", fontSize: "0.9rem" }}
                          >
                            S/ {item.precio.toFixed(2)}
                          </p>
                        </div>

                        {/* Cantidad y eliminar */}
                        <div className="d-flex flex-column justify-content-between align-items-end">
                          <button
                            onClick={() => eliminarDelCarrito(item.idProducto)}
                            className="btn btn-sm btn-outline-danger p-1"
                            style={{ width: "24px", height: "24px", fontSize: "0.7rem" }}
                          >
                            <i className="bi bi-trash"></i>
                          </button>

                          <div className="d-flex align-items-center gap-1 mt-1">
                            <button
                              onClick={() =>
                                actualizarCantidad(
                                  item.idProducto,
                                  item.cantidad - 1
                                )
                              }
                              className="btn btn-sm btn-outline-secondary p-0"
                              style={{ width: "24px", height: "24px", fontSize: "0.8rem" }}
                            >
                              -
                            </button>
                            <span
                              className="px-2 fw-bold"
                              style={{ fontSize: "0.85rem" }}
                            >
                              {item.cantidad}
                            </span>
                            <button
                              onClick={() =>
                                actualizarCantidad(
                                  item.idProducto,
                                  item.cantidad + 1
                                )
                              }
                              className="btn btn-sm btn-outline-secondary p-0"
                              style={{ width: "24px", height: "24px", fontSize: "0.8rem" }}
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Vaciar carrito */}
              <button
                onClick={vaciarCarrito}
                className="btn btn-sm btn-outline-danger w-100 mb-3"
              >
                <i className="bi bi-trash me-2"></i>
                Vaciar Carrito
              </button>

              {/* Total */}
              <div className="card bg-light border-0 mb-3">
                <div className="card-body p-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="fw-bold">Total:</span>
                    <span className="fw-bold fs-4" style={{ color: "#d97706" }}>
                      S/ {obtenerTotal().toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Botón finalizar compra */}
              <button 
                onClick={handleFinalizarCompra}
                className="btn btn-primary w-100 btn-lg fw-bold"
              >
                <i className="bi bi-check-circle me-2"></i>
                Finalizar Compra
              </button>
            </>
          )}
        </div>
      </div>

      {/* Modal de Checkout - PASA UNA PROP PARA MANEJAR EL ÉXITO */}
      <CheckoutModal 
        isOpen={checkoutOpen} 
        onClose={handleCheckoutClose}
        onSuccess={(orderNumber) => {
          handleSuccess(orderNumber);
          handleCheckoutClose();
        }}
      />

      {/* Modal de Éxito Separado (opcional) */}
      {showSuccessModal && (
        <div 
          className="modal show d-block fade" 
          style={{ 
            backgroundColor: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(3px)",
            zIndex: 1060
          }}
        >
          <div className="modal-dialog modal-dialog-centered modal-sm">
            <div className="modal-content border-0 shadow" style={{ borderRadius: "16px" }}>
              <div className="modal-body p-4 text-center">
                {/* Ícono */}
                <div className="mb-3">
                  <div className="d-inline-flex align-items-center justify-content-center rounded-circle bg-success bg-opacity-15 p-3">
                    <i className="bi bi-check2-circle text-success" style={{ fontSize: "2.5rem" }}></i>
                  </div>
                </div>

                {/* Título */}
                <h5 className="fw-bold mb-2 text-success">
                  ¡Pedido Confirmado!
                </h5>

                {/* Mensaje */}
                <p className="text-muted small mb-3">
                  Tu pedido ha sido procesado exitosamente
                </p>

                {/* Número de orden */}
                <div className="bg-light rounded-2 p-3 mb-3">
                  <p className="text-muted mb-1 small">Número de Orden</p>
                  <h6 className="fw-bold text-dark mb-0">
                    {lastOrderNumber}
                  </h6>
                </div>

                {/* Botón de acción */}
                <button
                  className="btn btn-success w-100"
                  onClick={handleSuccessModalClose}
                >
                  <i className="bi bi-check-lg me-2"></i>
                  Aceptar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}