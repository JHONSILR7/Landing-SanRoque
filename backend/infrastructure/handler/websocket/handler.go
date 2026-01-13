// backend/infrastructure/handler/websocket/handler.go
package websocket

import (
	"log"
	"net/http"

	"github.com/gorilla/websocket"
	"github.com/labstack/echo/v4"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		// IMPORTANTE: Permitir todas las origins en desarrollo
		// En producción, debes validar el origin específico
		return true
	},
}

type Handler struct {
	hub *Hub
}

func NewHandler(hub *Hub) *Handler {
	return &Handler{hub: hub}
}

func (h *Handler) GetHub() *Hub {
	return h.hub
}

func (h *Handler) ServeWS(c echo.Context) error {
	// Obtener parámetros de la query
	usuarioId := c.QueryParam("usuarioId")
	rol := c.QueryParam("rol")

	// Validar parámetros
	if usuarioId == "" || rol == "" {
		log.Printf("WebSocket: Parámetros faltantes - usuarioId: %s, rol: %s", usuarioId, rol)
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "usuarioId y rol son requeridos",
		})
	}

	log.Printf("WebSocket: Nueva conexión - usuarioId: %s, rol: %s", usuarioId, rol)

	// Upgrade a WebSocket
	ws, err := upgrader.Upgrade(c.Response(), c.Request(), nil)
	if err != nil {
		log.Printf("WebSocket: Error en upgrade: %v", err)
		return err
	}

	// Crear cliente
	client := &Client{
		hub:       h.hub,
		conn:      ws,
		send:      make(chan []byte, 256),
		usuarioId: usuarioId,
		rol:       rol,
	}

	// Registrar cliente en el hub
	client.hub.register <- client

	log.Printf("WebSocket: Cliente registrado - usuarioId: %s, rol: %s", usuarioId, rol)

	// Ejecutar goroutines para lectura y escritura
	go client.writePump()
	go client.readPump()

	return nil
}