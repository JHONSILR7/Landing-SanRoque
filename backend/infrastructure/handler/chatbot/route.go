// backend/infrastructure/handler/chatbot/route.go
package chatbot

import (
	"github.com/labstack/echo/v4"
)

func RegistrarRutas(g *echo.Group, h *ChatBotHandler) {
	g.POST("/mensaje", h.ProcesarMensaje)
	g.GET("/contexto", h.ObtenerContexto) // Para debugging
}