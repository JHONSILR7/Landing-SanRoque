package model

type Cliente struct {
    Id       string `json:"idCliente"`
    Nombre   string `json:"nombre"`
    Telefono string `json:"telefono"`
    CreadoEn int64  `json:"creadoEn"`
}

type ClienteUsu struct {
    Id        string `json:"idClienteUsuario"`
    ClienteId string `json:"clienteId"`
    Email     string `json:"email"`
    GoogleId  string `json:"googleId"`
    Nombre    string `json:"nombre"`
    Foto      string `json:"foto"`
    CreadoEn  int64  `json:"creadoEn"`
}

type GoogleUsu struct {
    Email    string `json:"email"`
    Nombre   string `json:"name"`
    Foto     string `json:"picture"`
    Verified bool   `json:"verified_email"`
    Sub      string `json:"sub"`
}

type LoginResp struct {
    Token      string     `json:"token"`
    ClienteUsu ClienteUsu `json:"clienteUsuario"`
}