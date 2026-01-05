// backend/infrastructure/handler/pedido/handler.go
package pedido

import (
	"net/http"

	"github.com/labstack/echo/v4"
	"sanRoque/domain/pedido"
	"sanRoque/internal/model"
)

type PedidoHandler struct {
	uc pedido.PedidoUC
}

func NuevoPedidoHandler(uc pedido.PedidoUC) *PedidoHandler {
	return &PedidoHandler{uc: uc}
}

func (h *PedidoHandler) CrearPedido(c echo.Context) error {
	var req model.CrearPedidoReq
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "Datos inválidos",
		})
	}

	// Validaciones básicas
	if req.ClienteNombre == "" || req.ClienteTelefono == "" {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "Nombre y teléfono son obligatorios",
		})
	}

	if len(req.ClienteTelefono) > 20 {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "El teléfono no puede exceder 20 caracteres",
		})
	}

	if len(req.ClienteNombre) > 150 {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "El nombre no puede exceder 150 caracteres",
		})
	}

	if len(req.Productos) == 0 {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "Debe incluir al menos un producto",
		})
	}

	if req.ComprobanteURL == "" {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "Debe subir el comprobante de pago",
		})
	}

	resp, err := h.uc.CrearPedido(c.Request().Context(), &req)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "Error al crear pedido: " + err.Error(),
		})
	}

	return c.JSON(http.StatusCreated, resp)
}

func (h *PedidoHandler) ObtenerPedidosPendientes(c echo.Context) error {
	pedidos, err := h.uc.ObtenerPedidosPendientes(c.Request().Context())
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "Error al obtener pedidos: " + err.Error(),
		})
	}

	return c.JSON(http.StatusOK, pedidos)
}

func (h *PedidoHandler) VerificarPago(c echo.Context) error {
	pedidoId := c.Param("id")
	
	var req model.VerificarPagoReq
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "Datos inválidos",
		})
	}

	// Si se aprueba, el método de pago es obligatorio
	if req.Aprobado && req.MetodoPago == "" {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "Debe especificar el método de pago",
		})
	}

	err := h.uc.VerificarPago(c.Request().Context(), pedidoId, req.Aprobado, req.MetodoPago)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "Error al verificar pago: " + err.Error(),
		})
	}

	mensaje := "Pago rechazado"
	if req.Aprobado {
		mensaje = "Pago verificado y registrado exitosamente"
	}

	return c.JSON(http.StatusOK, map[string]string{
		"message": mensaje,
	})
}