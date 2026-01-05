// backend/infrastructure/handler/pedido/route.go
package pedido

import (
	"github.com/labstack/echo/v4"
)

func RegistrarRutas(g *echo.Group, h *PedidoHandler) {
	g.POST("", h.CrearPedido)                      // Cliente crea pedido
	g.GET("/pendientes", h.ObtenerPedidosPendientes) // Admin obtiene pendientes
	g.POST("/:id/verificar", h.VerificarPago)      // Admin verifica pago
}