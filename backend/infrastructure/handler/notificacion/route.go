package notificacion

import (
	"github.com/labstack/echo/v4"
)

func RegistrarRutas(g *echo.Group, h *NotificacionHandler) {
	g.GET("/usuario/:usuarioId", h.ObtenerPorUsuario)
	g.PUT("/:id/leida", h.MarcarComoLeida)
}