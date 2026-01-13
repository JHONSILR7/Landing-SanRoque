package model

type Notificacion struct {
	IdNotificacion string                 `json:"idNotificacion"`
	UsuarioId      string                 `json:"usuarioId"`
	Mensaje        string                 `json:"mensaje"`
	Tipo           string                 `json:"tipo"`
	Data           map[string]interface{} `json:"data,omitempty"`
	Leido          bool                   `json:"leido"`
	CreadoEn       int64                  `json:"creadoEn"`
}