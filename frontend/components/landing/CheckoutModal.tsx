"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { subirImagenCloudinary } from "@/lib/cloudinary";
import axiosInst from "@/lib/axios";
import { estaAutenticado, obtenerUsuario } from "@/lib/auth";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (orderNumber: string) => void;
}

export default function CheckoutModal({ isOpen, onClose, onSuccess }: CheckoutModalProps) {
  const { items, obtenerTotal, vaciarCarrito } = useCart();
  
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");
  const [email, setEmail] = useState("");
  const [metodoPago, setMetodoPago] = useState("YAPE");
  const [comprobante, setComprobante] = useState<File | null>(null);
  const [previewComprobante, setPreviewComprobante] = useState<string>("");
  
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [autenticado, setAutenticado] = useState(false);
  
  useEffect(() => {
    if (isOpen) {
      const usuario = obtenerUsuario();
      const esAutenticado = estaAutenticado();
      setAutenticado(esAutenticado);
      
      if (esAutenticado && usuario && !nombre) {
        setNombre(usuario.nombre || "");
        setEmail(usuario.email || "");
      }
    }
  }, [isOpen]);

  const handleArchivoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setComprobante(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewComprobante(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setCargando(true);

    try {
      if (!nombre || !telefono || !email) {
        throw new Error("Nombre, teléfono y email son obligatorios");
      }

      if (!comprobante) {
        throw new Error("Debe subir el comprobante de pago");
      }

      const comprobanteUrl = await subirImagenCloudinary(comprobante);

      const pedidoData = {
        clienteNombre: nombre,
        clienteTelefono: telefono,
        clienteDireccion: direccion,
        clienteEmail: email,
        productos: items.map((item) => ({
          productoId: item.idProducto,
          cantidad: item.cantidad,
          precio: item.precio,
        })),
        comprobanteUrl: comprobanteUrl,
        metodoPago: metodoPago,
      };

      const response = await axiosInst.post("/api/pedidos", pedidoData);

      const orderNumber = response.data.orden;
      vaciarCarrito();
      
      if (onSuccess) {
        onSuccess(orderNumber);
      }
      
      setNombre("");
      setTelefono("");
      setDireccion("");
      setEmail("");
      setComprobante(null);
      setPreviewComprobante("");

    } catch (err: any) {
      setError(err.message || "Error al procesar el pedido");
    } finally {
      setCargando(false);
    }
  };

  if (!isOpen) return null;

  if (!autenticado) {
    return (
      <div 
        className="modal show d-block fade" 
        style={{ 
          backgroundColor: "rgba(0,0,0,0.4)",
          backdropFilter: "blur(2px)",
          zIndex: 1055
        }}
      >
        <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: "400px" }}>
          <div className="modal-content border-0 shadow-lg" style={{ borderRadius: "14px", overflow: "hidden" }}>
            
            <div className="modal-header border-0 pb-0" style={{ background: "linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)" }}>
              <div className="w-100 text-center position-relative">
                <button
                  type="button"
                  className="btn-close btn-close-white position-absolute top-0 end-0 m-3"
                  onClick={onClose}
                  style={{ opacity: 0.8 }}
                ></button>
                
                <div className="py-4">
                  <div className="d-inline-flex align-items-center justify-content-center rounded-circle bg-white bg-opacity-20 p-3 mb-2">
                    <i className="bi bi-lock text-white" style={{ fontSize: "2rem" }}></i>
                  </div>
                  <h5 className="modal-title fw-bold text-white mb-2">
                    Autenticación Requerida
                  </h5>
                  <p className="text-white-50 small mb-0">
                    Debes iniciar sesión para finalizar tu compra
                  </p>
                </div>
              </div>
            </div>

            <div className="modal-body p-4 text-center">
              <div className="alert alert-info small mb-3" role="alert">
                <i className="bi bi-info-circle me-2"></i>
                Por tu seguridad, necesitamos verificar tu identidad antes de procesar tu pedido.
              </div>
              
              <p className="text-muted small mb-4">
                Accede con tu cuenta para continuar con tu compra de forma segura.
              </p>
            </div>

            <div className="modal-footer border-top">
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                onClick={onClose}
              >
                <i className="bi bi-x-lg me-1"></i>
                Cancelar
              </button>
              
              <a
                href="/login"
                className="btn btn-primary btn-sm"
              >
                <i className="bi bi-box-arrow-in-right me-1"></i>
                Ir al Login
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="modal show d-block fade" 
      style={{ 
        backgroundColor: "rgba(0,0,0,0.4)",
        backdropFilter: "blur(2px)",
        zIndex: 1055
      }}
    >
      <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable" style={{ maxWidth: "500px" }}>
        <div className="modal-content border-0 shadow-lg" style={{ borderRadius: "14px", overflow: "hidden" }}>
          
          <div className="modal-header border-0 pb-0" style={{ background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)" }}>
            <div className="w-100 text-center position-relative">
              <button
                type="button"
                className="btn-close btn-close-white position-absolute top-0 end-0 m-3"
                onClick={onClose}
                disabled={cargando}
                style={{ opacity: 0.8 }}
              ></button>
              
              <div className="py-3">
                <div className="d-inline-flex align-items-center justify-content-center rounded-circle bg-white bg-opacity-20 p-2 mb-2">
                  <i className="bi bi-cart-check text-white" style={{ fontSize: "1.5rem" }}></i>
                </div>
                <h5 className="modal-title fw-bold text-white mb-1">
                  Finalizar Compra
                </h5>
                <p className="text-white-50 small mb-0">
                  Total: <span className="fw-semibold">S/ {obtenerTotal().toFixed(2)}</span>
                </p>
              </div>
            </div>
          </div>

          <div className="modal-body p-4">
            <form onSubmit={handleSubmit}>
              <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom">
                <span className="text-muted small">
                  <i className="bi bi-box-seam me-1"></i>
                  {items.length} producto(s)
                </span>
                <span className="badge bg-primary rounded-pill">
                  {items.reduce((total, item) => total + item.cantidad, 0)} unidades
                </span>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold text-uppercase text-muted mb-2">
                  <i className="bi bi-person me-1"></i>
                  Información Personal
                </label>
                <div className="row g-2">
                  <div className="col-12">
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="Nombre completo *"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      required
                      disabled={cargando}
                    />
                  </div>
                  <div className="col-12">
                    <input
                      type="email"
                      className="form-control form-control-sm"
                      placeholder="Email *"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={cargando}
                    />
                  </div>
                  <div className="col-12">
                    <input
                      type="tel"
                      className="form-control form-control-sm"
                      placeholder="Teléfono *"
                      value={telefono}
                      onChange={(e) => setTelefono(e.target.value)}
                      required
                      disabled={cargando}
                    />
                  </div>
                  <div className="col-12">
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="Dirección"
                      value={direccion}
                      onChange={(e) => setDireccion(e.target.value)}
                      disabled={cargando}
                    />
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold text-uppercase text-muted mb-2">
                  <i className="bi bi-credit-card me-1"></i>
                  Método de Pago
                </label>
                <div className="d-flex gap-2 mb-3">
                  {["YAPE", "PLIN", "TRANSFERENCIA"].map((metodo) => (
                    <button
                      key={metodo}
                      type="button"
                      className={`btn btn-sm flex-fill ${metodoPago === metodo ? 'btn-primary' : 'btn-outline-primary'}`}
                      onClick={() => setMetodoPago(metodo)}
                      disabled={cargando}
                    >
                      {metodo}
                    </button>
                  ))}
                </div>

                <div className="alert alert-light border small p-3 mb-3">
                  <p className="mb-2 fw-semibold small">
                    <i className="bi bi-info-circle me-1"></i>
                    Datos para transferencia:
                  </p>
                  <div className="small">
                    <div className="d-flex justify-content-between">
                      <span className="text-muted">Yape/Plin:</span>
                      <span className="fw-medium">987 654 321</span>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span className="text-muted">BCP:</span>
                      <span className="fw-medium">191-12345678-0-00</span>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span className="text-muted">Titular:</span>
                      <span className="fw-medium">San Roque S.A.C.</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label small fw-semibold text-uppercase text-muted mb-2">
                  <i className="bi bi-cloud-arrow-up me-1"></i>
                  Comprobante de Pago *
                </label>
                
                <div className="border rounded-2 p-3 text-center bg-light">
                  {previewComprobante ? (
                    <div className="text-center">
                      <img
                        src={previewComprobante}
                        alt="Preview"
                        className="img-fluid rounded mb-2"
                        style={{ maxHeight: "120px" }}
                      />
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => {
                          setComprobante(null);
                          setPreviewComprobante("");
                        }}
                        disabled={cargando}
                      >
                        <i className="bi bi-x-circle me-1"></i>
                        Cambiar imagen
                      </button>
                    </div>
                  ) : (
                    <div className="py-3">
                      <i className="bi bi-cloud-arrow-up text-muted mb-2" style={{ fontSize: "2rem" }}></i>
                      <p className="small text-muted mb-2">
                        Sube una captura del comprobante
                      </p>
                      <label className="btn btn-sm btn-outline-primary mb-0">
                        <i className="bi bi-upload me-1"></i>
                        Seleccionar archivo
                        <input
                          type="file"
                          className="d-none"
                          accept="image/*"
                          onChange={handleArchivoChange}
                          required
                          disabled={cargando}
                        />
                      </label>
                    </div>
                  )}
                </div>
              </div>

              {error && (
                <div className="alert alert-danger small py-2 mb-3" role="alert">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  {error}
                </div>
              )}

              <div className="d-flex gap-2 pt-3 border-top">
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm flex-fill"
                  onClick={onClose}
                  disabled={cargando}
                >
                  <i className="bi bi-x-lg me-1"></i>
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-primary btn-sm flex-fill"
                  disabled={cargando || !comprobante}
                >
                  {cargando ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Procesando...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-check2-circle me-1"></i>
                      Confirmar Pedido
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          <div className="modal-footer border-0 pt-0">
            <p className="small text-center text-muted w-100 mb-0">
              <i className="bi bi-shield-check me-1"></i>
              Tu información está protegida
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}