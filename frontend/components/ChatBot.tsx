"use client";

import { useState, useRef, useEffect } from "react";
import axiosInst from "@/lib/axios";

interface Mensaje {
  id: string;
  texto: string;
  esUsuario: boolean;
  timestamp: number;
}

export default function ChatBot() {
  const [abierto, setAbierto] = useState(false);
  const [mensajes, setMensajes] = useState<Mensaje[]>([
    {
      id: "bienvenida",
      texto: "¡Hola! 👋 Soy el asistente virtual de San Roque. ¿En qué puedo ayudarte hoy? Puedo brindarte información sobre nuestros productos, precios y recomendaciones.",
      esUsuario: false,
      timestamp: Date.now(),
    },
  ]);
  const [inputMensaje, setInputMensaje] = useState("");
  const [cargando, setCargando] = useState(false);
  const mensajesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    mensajesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [mensajes]);

  useEffect(() => {
    if (abierto && inputRef.current) {
      inputRef.current.focus();
    }
  }, [abierto]);

  const enviarMensaje = async () => {
    if (!inputMensaje.trim() || cargando) return;

    const nuevoMensajeUsuario: Mensaje = {
      id: `user-${Date.now()}`,
      texto: inputMensaje,
      esUsuario: true,
      timestamp: Date.now(),
    };

    setMensajes((prev) => [...prev, nuevoMensajeUsuario]);
    setInputMensaje("");
    setCargando(true);

    try {
      const resp = await axiosInst.post("/api/chatbot/mensaje", {
        mensaje: inputMensaje,
      });

      const mensajeBot: Mensaje = {
        id: `bot-${Date.now()}`,
        texto: resp.data.respuesta,
        esUsuario: false,
        timestamp: resp.data.timestamp * 1000,
      };

      setMensajes((prev) => [...prev, mensajeBot]);
    } catch (error) {
      console.error("Error al enviar mensaje:", error);
      
      const mensajeError: Mensaje = {
        id: `error-${Date.now()}`,
        texto: "Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta de nuevo.",
        esUsuario: false,
        timestamp: Date.now(),
      };

      setMensajes((prev) => [...prev, mensajeError]);
    } finally {
      setCargando(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      enviarMensaje();
    }
  };

  const limpiarChat = () => {
    setMensajes([
      {
        id: "bienvenida-reset",
        texto: "Chat reiniciado. ¿En qué más puedo ayudarte?",
        esUsuario: false,
        timestamp: Date.now(),
      },
    ]);
  };

  const sugerencias = [
    "¿Qué productos tienen?",
    "Recomiéndame algo dulce",
    "¿Cuánto cuesta el café?",
    "¿Tienen promociones?",
  ];

  const usarSugerencia = (sugerencia: string) => {
    setInputMensaje(sugerencia);
    inputRef.current?.focus();
  };

  return (
    <>
      {/* Botón flotante con animación */}
      <div className="position-fixed" style={{ bottom: "20px", right: "20px", zIndex: 1000 }}>
        <button
          onClick={() => setAbierto(!abierto)}
          className="btn rounded-circle shadow-lg position-relative"
          style={{
            width: "65px",
            height: "65px",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            border: "none",
            transition: "all 0.3s ease",
            transform: abierto ? "rotate(90deg)" : "rotate(0deg)",
          }}
          aria-label="Abrir chat"
        >
          <span style={{ fontSize: "1.8rem", color: "white" }}>
            {abierto ? "✕" : "💬"}
          </span>
          
          {/* Badge de notificación */}
          {!abierto && (
            <span
              className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
              style={{ fontSize: "0.65rem" }}
            >
              ¡Hola!
            </span>
          )}
        </button>
      </div>

      {/* Ventana de chat mejorada */}
      {abierto && (
        <div
          className="position-fixed bg-white rounded-4 shadow-lg"
          style={{
            bottom: "100px",
            right: "20px",
            width: "min(400px, calc(100vw - 40px))",
            height: "min(600px, calc(100vh - 140px))",
            zIndex: 999,
            display: "flex",
            flexDirection: "column",
            border: "1px solid #e0e0e0",
            animation: "slideUp 0.3s ease",
          }}
        >
          {/* Header con gradiente */}
          <div
            className="p-3 text-white rounded-top-4"
            style={{ 
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              boxShadow: "0 2px 10px rgba(102, 126, 234, 0.3)",
            }}
          >
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center gap-2">
                <div 
                  className="rounded-circle bg-white d-flex align-items-center justify-content-center"
                  style={{ width: "40px", height: "40px" }}
                >
                  <span style={{ fontSize: "1.3rem" }}>🤖</span>
                </div>
                <div>
                  <h6 className="mb-0 fw-bold">Asistente San Roque</h6>
                  <div className="d-flex align-items-center gap-1">
                    <div 
                      className="rounded-circle bg-success"
                      style={{ width: "8px", height: "8px" }}
                    ></div>
                    <small style={{ fontSize: "0.7rem", opacity: 0.9 }}>
                      En línea
                    </small>
                  </div>
                </div>
              </div>
              <button
                onClick={limpiarChat}
                className="btn btn-sm btn-light rounded-circle"
                style={{ width: "35px", height: "35px", padding: "0" }}
                title="Limpiar chat"
              >
                🔄
              </button>
            </div>
          </div>

          {/* Mensajes */}
          <div
            className="flex-grow-1 p-3 overflow-auto"
            style={{ 
              backgroundColor: "#f8f9fa",
              backgroundImage: "linear-gradient(to bottom, rgba(255,255,255,0.9), rgba(248,249,250,1))",
            }}
          >
            {mensajes.map((msg, index) => (
              <div
                key={msg.id}
                className={`mb-3 d-flex ${
                  msg.esUsuario ? "justify-content-end" : "justify-content-start"
                }`}
                style={{
                  animation: `fadeIn 0.3s ease ${index * 0.1}s both`,
                }}
              >
                {!msg.esUsuario && (
                  <div 
                    className="rounded-circle bg-gradient me-2 d-flex align-items-center justify-content-center"
                    style={{ 
                      width: "32px", 
                      height: "32px", 
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      flexShrink: 0,
                    }}
                  >
                    <span style={{ fontSize: "1rem" }}>🤖</span>
                  </div>
                )}
                
                <div
                  className={`rounded-3 p-3 ${
                    msg.esUsuario
                      ? "text-white"
                      : "bg-white border"
                  }`}
                  style={{
                    maxWidth: "75%",
                    fontSize: "0.9rem",
                    background: msg.esUsuario 
                      ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" 
                      : "white",
                    boxShadow: msg.esUsuario 
                      ? "0 2px 8px rgba(102, 126, 234, 0.3)" 
                      : "0 1px 3px rgba(0,0,0,0.1)",
                  }}
                >
                  {msg.texto}
                  <div
                    className={`text-end mt-1 ${
                      msg.esUsuario ? "text-white-50" : "text-muted"
                    }`}
                    style={{ fontSize: "0.65rem" }}
                  >
                    {new Date(msg.timestamp).toLocaleTimeString("es-PE", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>

                {msg.esUsuario && (
                  <div 
                    className="rounded-circle bg-secondary ms-2 d-flex align-items-center justify-content-center"
                    style={{ 
                      width: "32px", 
                      height: "32px",
                      flexShrink: 0,
                    }}
                  >
                    <span style={{ fontSize: "1rem" }}>👤</span>
                  </div>
                )}
              </div>
            ))}

            {cargando && (
              <div className="mb-3 d-flex justify-content-start">
                <div 
                  className="rounded-circle bg-gradient me-2 d-flex align-items-center justify-content-center"
                  style={{ 
                    width: "32px", 
                    height: "32px", 
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  }}
                >
                  <span style={{ fontSize: "1rem" }}>🤖</span>
                </div>
                <div
                  className="bg-white border rounded-3 p-3"
                  style={{ maxWidth: "75%", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}
                >
                  <div className="d-flex gap-1">
                    <div
                      className="rounded-circle bg-secondary"
                      style={{ 
                        width: "8px", 
                        height: "8px",
                        animation: "bounce 1s infinite",
                      }}
                    ></div>
                    <div
                      className="rounded-circle bg-secondary"
                      style={{ 
                        width: "8px", 
                        height: "8px",
                        animation: "bounce 1s infinite 0.2s",
                      }}
                    ></div>
                    <div
                      className="rounded-circle bg-secondary"
                      style={{ 
                        width: "8px", 
                        height: "8px",
                        animation: "bounce 1s infinite 0.4s",
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            {/* Sugerencias rápidas - solo mostrar al inicio */}
            {mensajes.length === 1 && !cargando && (
              <div className="mt-3">
                <p className="text-muted small mb-2" style={{ fontSize: "0.75rem" }}>
                  Sugerencias rápidas:
                </p>
                <div className="d-flex flex-wrap gap-2">
                  {sugerencias.map((sug, idx) => (
                    <button
                      key={idx}
                      onClick={() => usarSugerencia(sug)}
                      className="btn btn-sm btn-outline-primary rounded-pill"
                      style={{ fontSize: "0.75rem" }}
                    >
                      {sug}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div ref={mensajesEndRef} />
          </div>

          {/* Input mejorado */}
          <div className="p-3 border-top bg-white rounded-bottom-4">
            <div className="input-group">
              <input
                ref={inputRef}
                type="text"
                className="form-control border-0 shadow-sm"
                placeholder="Escribe tu mensaje..."
                value={inputMensaje}
                onChange={(e) => setInputMensaje(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={cargando}
                style={{ 
                  fontSize: "0.9rem",
                  backgroundColor: "#f8f9fa",
                }}
              />
              <button
                className="btn shadow-sm"
                onClick={enviarMensaje}
                disabled={cargando || !inputMensaje.trim()}
                style={{
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  border: "none",
                  color: "white",
                }}
              >
                {cargando ? (
                  <span
                    className="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                  ></span>
                ) : (
                  <i className="bi bi-send-fill"></i>
                )}
              </button>
            </div>
            <div className="d-flex justify-content-between align-items-center mt-2">
              <small className="text-muted" style={{ fontSize: "0.7rem" }}>
                Presiona Enter para enviar
              </small>
              <small className="text-muted" style={{ fontSize: "0.65rem" }}>
                Powered by <strong>DeepSeek</strong>
              </small>
            </div>
          </div>
        </div>
      )}

      {/* Estilos de animación */}
      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }
      `}</style>
    </>
  );
}