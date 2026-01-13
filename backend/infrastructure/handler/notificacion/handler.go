package notificacion

import (
	"net/http"

	"github.com/labstack/echo/v4"
	"sanRoque/domain/notificacion"
)

type NotificacionHandler struct {
	uc notificacion.NotificacionUC
}

func NuevoNotificacionHandler(uc notificacion.NotificacionUC) *NotificacionHandler {
	return &NotificacionHandler{uc: uc}
}

func (h *NotificacionHandler) ObtenerPorUsuario(c echo.Context) error {
	usuarioId := c.Param("usuarioId")

	notificaciones, err := h.uc.ObtenerPorUsuario(c.Request().Context(), usuarioId)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "Error al obtener notificaciones: " + err.Error(),
		})
	}

	return c.JSON(http.StatusOK, notificaciones)
}

func (h *NotificacionHandler) MarcarComoLeida(c echo.Context) error {
	notifId := c.Param("id")

	err := h.uc.MarcarComoLeida(c.Request().Context(), notifId)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "Error al marcar notificación: " + err.Error(),
		})
	}

	return c.JSON(http.StatusOK, map[string]string{
		"message": "Notificación marcada como leída",
	})
}