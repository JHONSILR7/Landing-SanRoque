// backend/infrastructure/handler/chatbot/handler.go
package chatbot

import (
	"log"
	"net/http"
	"sanRoque/domain/chatbot"
	"sanRoque/internal/model"

	"github.com/labstack/echo/v4"
)

type ChatBotHandler struct {
	uc chatbot.ChatBotUC
}

func NuevoChatBotHandler(uc chatbot.ChatBotUC) *ChatBotHandler {
	return &ChatBotHandler{uc: uc}
}

func (h *ChatBotHandler) ProcesarMensaje(c echo.Context) error {
	var req model.ChatRequest
	if err := c.Bind(&req); err != nil {
		log.Printf("Error al hacer Bind del request: %v", err)
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "Formato de mensaje inválido",
		})
	}

	if req.Mensaje == "" {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "El mensaje no puede estar vacío",
		})
	}

	resp, err := h.uc.ProcesarMensaje(c.Request().Context(), req.Mensaje)
	if err != nil {
		log.Printf("Error al procesar mensaje: %v", err)
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "Error al procesar mensaje: " + err.Error(),
		})
	}

	return c.JSON(http.StatusOK, resp)
}

func (h *ChatBotHandler) ObtenerContexto(c echo.Context) error {
	contexto, err := h.uc.ObtenerContextoProductos(c.Request().Context())
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "Error al obtener contexto",
		})
	}

	return c.JSON(http.StatusOK, map[string]string{
		"contexto": contexto,
	})
}