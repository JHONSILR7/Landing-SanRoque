// backend/infrastructure/handler/producto/handler.go
package producto

import (
	"net/http"

	"github.com/labstack/echo/v4"
	"sanRoque/domain/producto"
)

type ProductoHandler struct {
	uc producto.ProductoUC
}

func NuevoProductoHandler(uc producto.ProductoUC) *ProductoHandler {
	return &ProductoHandler{uc: uc}
}

func (h *ProductoHandler) ObtenerProductos(c echo.Context) error {
	resp, err := h.uc.ObtenerProductosConCategorias(c.Request().Context())
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "Error al obtener productos",
		})
	}

	return c.JSON(http.StatusOK, resp)
}