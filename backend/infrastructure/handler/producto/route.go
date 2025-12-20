// backend/infrastructure/handler/producto/route.go
package producto

import (
	"github.com/labstack/echo/v4"
)

func RegistrarRutas(g *echo.Group, h *ProductoHandler) {
	g.GET("", h.ObtenerProductos)
}