"use client";

import { useEffect, useState } from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import axiosInst from "@/lib/axios";
import { guardarSesion, estaAutenticado } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    if (estaAutenticado()) {
      router.push("/");
    }
  }, [router]);

  const manejarExito = async (credResp: any) => {
    setCargando(true);
    setError("");

    try {
      const resp = await axiosInst.post("/api/auth/google", {
        token: credResp.credential,
      });

      guardarSesion(resp.data.token, resp.data.clienteUsuario);
      router.push("/");
    } catch (err: any) {
      setError(err.response?.data?.error || "Error al iniciar sesión");
      setCargando(false);
    }
  };

  const manejarError = () => {
    setError("Error al iniciar sesión con Google");
    setCargando(false);
  };

  if (!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) {
    return (
      <div className="container-fluid vh-100 d-flex align-items-center justify-content-center">
        <div className="alert alert-danger">Error: Google Client ID no configurado</div>
      </div>
    );
  }

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
      <div className="container-fluid vh-100">
        <div className="row h-100">
          {/* Lado izquierdo - Imagen */}
          <div className="col-lg-6 d-none d-lg-block p-0">
            <div
              className="h-100 d-flex align-items-center justify-content-center"
              style={{
                backgroundImage: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              }}
            >
              <div className="text-center text-white p-5">
                <h1 className="display-1 fw-bold mb-4">SAN ROQUE</h1>
                <p className="lead fs-4">Bienvenido a nuestro restaurante</p>
                <i className="bi bi-shop fs-1 mt-4"></i>
              </div>
            </div>
          </div>

          {/* Lado derecho - Login */}
          <div className="col-lg-6 d-flex align-items-center justify-content-center p-4">
            <div className="w-100" style={{ maxWidth: "400px" }}>
              <div className="text-center mb-5">
                <h2 className="fw-bold mb-3">Iniciar Sesión</h2>
                <p className="text-muted">Ingresa con tu cuenta de Google</p>
              </div>

              {error && (
                <div className="alert alert-danger d-flex align-items-center" role="alert">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  <div>{error}</div>
                </div>
              )}

              <div className="d-flex justify-content-center">
                {cargando ? (
                  <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Cargando...</span>
                    </div>
                    <p className="mt-3 text-muted">Iniciando sesión...</p>
                  </div>
                ) : (
                  <GoogleLogin
                    onSuccess={manejarExito}
                    onError={manejarError}
                    useOneTap
                    locale="es"
                  />
                )}
              </div>

              <div className="mt-5 text-center">
                <p className="text-muted small">
                  Al iniciar sesión, aceptas nuestros términos y condiciones
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}