import Cookies from "js-cookie";

export interface ClienteUsu {
  idClienteUsuario: string;
  clienteId: string;
  email: string;
  googleId: string;
  nombre: string;
  foto: string;
  creadoEn: number;
}

export const guardarSesion = (token: string, usuario: ClienteUsu) => {
  Cookies.set("token", token, { expires: 7 });
  Cookies.set("usuario", JSON.stringify(usuario), { expires: 7 });
};

export const obtenerToken = (): string | undefined => {
  return Cookies.get("token");
};

export const obtenerUsuario = (): ClienteUsu | null => {
  const usu = Cookies.get("usuario");
  return usu ? JSON.parse(usu) : null;
};

export const cerrarSesion = () => {
  Cookies.remove("token");
  Cookies.remove("usuario");
  window.location.href = "/login";
};

export const estaAutenticado = (): boolean => {
  return !!obtenerToken();
};