package pedido

import (
	"log"
	"net/http"

	"github.com/labstack/echo/v4"
	"sanRoque/domain/email"
	"sanRoque/domain/notificacion"
	"sanRoque/domain/pedido"
	"sanRoque/infrastructure/handler/websocket"
	"sanRoque/internal/model"
)

type PedidoHandler struct {
	uc        pedido.PedidoUC
	emailUC   email.EmailUC
	notifUC   notificacion.NotificacionUC
	wsHandler *websocket.Handler
}

func NuevoPedidoHandler(
	uc pedido.PedidoUC,
	emailUC email.EmailUC,
	notifUC notificacion.NotificacionUC,
	wsHandler *websocket.Handler,
) *PedidoHandler {
	return &PedidoHandler{
		uc:        uc,
		emailUC:   emailUC,
		notifUC:   notifUC,
		wsHandler: wsHandler,
	}
}

func (h *PedidoHandler) CrearPedido(c echo.Context) error {
	var req model.CrearPedidoReq
	if err := c.Bind(&req); err != nil {
		log.Printf("Error binding request: %v", err)
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "Datos inválidos",
		})
	}

	// Validaciones
	if req.ClienteNombre == "" || req.ClienteTelefono == "" || req.ClienteEmail == "" {
		log.Printf("Validación fallida: faltan datos obligatorios")
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "Nombre, teléfono y email son obligatorios",
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
		log.Printf("Validación fallida: no hay productos")
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "Debe incluir al menos un producto",
		})
	}

	if req.ComprobanteURL == "" {
		log.Printf("Validación fallida: falta comprobante")
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "Debe subir el comprobante de pago",
		})
	}

	log.Printf("Creando pedido para: %s (%s) - %d productos", 
		req.ClienteNombre, req.ClienteEmail, len(req.Productos))

	// Crear pedido en BD
	resp, err := h.uc.CrearPedido(c.Request().Context(), &req)
	if err != nil {
		log.Printf("Error al crear pedido en BD: %v", err)
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "Error al crear pedido: " + err.Error(),
		})
	}

	log.Printf("Pedido creado exitosamente: #%s (ID: %s)", resp.Orden, resp.IdPedido)

	// Obtener detalle completo del pedido
	log.Printf("Obteniendo detalles del pedido...")
	pedidos, err := h.uc.ObtenerPedidosPendientes(c.Request().Context())
	if err != nil {
		log.Printf("Error obteniendo pedidos pendientes: %v", err)
	} else {
		log.Printf("Pedidos pendientes obtenidos: %d", len(pedidos))
	}

	if err == nil && len(pedidos) > 0 {
		var pedidoDetalle *model.PedidoDetalle
		for _, p := range pedidos {
			if p.IdPedido == resp.IdPedido {
				pedidoDetalle = p
				log.Printf("Detalle del pedido encontrado: #%s", p.Orden)
				break
			}
		}

		if pedidoDetalle != nil {
			log.Printf("Iniciando envío de notificaciones...")

			// 1. Preparar datos del email
			emailData := &model.EmailPedidoData{
				Email:            req.ClienteEmail,
				ClienteNombre:    pedidoDetalle.ClienteNombre,
				ClienteTelefono:  pedidoDetalle.ClienteTelefono,
				ClienteDireccion: pedidoDetalle.ClienteDireccion,
				Orden:            pedidoDetalle.Orden,
				Total:            pedidoDetalle.Total,
				Productos:        pedidoDetalle.Productos,
			}

			// 2. Enviar email (goroutine)
			go func() {
				log.Printf("Enviando email a %s...", req.ClienteEmail)
				if err := h.emailUC.EnviarConfirmacionPedido(c.Request().Context(), emailData); err != nil {
					log.Printf("Error enviando email: %v", err)
				} else {
					log.Printf("Email enviado exitosamente a %s", req.ClienteEmail)
				}
			}()

			// 3. Crear notificación en BD (goroutine)
			go func() {
				log.Printf("Guardando notificación en BD...")
				if err := h.notifUC.NotificarNuevoPedido(c.Request().Context(), pedidoDetalle); err != nil {
					log.Printf("Error guardando notificación: %v", err)
				} else {
					log.Printf("Notificación guardada en BD")
				}
			}()

			// 4. Enviar notificación por WebSocket (goroutine)
			go func() {
				log.Printf("Enviando notificación WebSocket...")
				log.Printf("Hub actual: %+v", h.wsHandler.GetHub())
				
				hub := h.wsHandler.GetHub()
				if hub == nil {
					log.Printf("Hub es nil!")
					return
				}

				log.Printf("Enviando a rol 'Cajero' el pedido #%s", pedidoDetalle.Orden)
				hub.SendNotification("Cajero", pedidoDetalle)
				log.Printf("Notificación WebSocket enviada")
			}()

			log.Printf("Todas las notificaciones iniciadas para pedido #%s", pedidoDetalle.Orden)
		} else {
			log.Printf("No se encontró el detalle del pedido recién creado")
		}
	} else {
		log.Printf("No se pudieron obtener detalles del pedido")
	}

	log.Printf("Respondiendo al cliente con pedido #%s", resp.Orden)
	return c.JSON(http.StatusCreated, resp)
}

func (h *PedidoHandler) ObtenerPedidosPendientes(c echo.Context) error {
	log.Printf("Obteniendo pedidos pendientes...")
	
	pedidos, err := h.uc.ObtenerPedidosPendientes(c.Request().Context())
	if err != nil {
		log.Printf("Error obteniendo pedidos pendientes: %v", err)
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "Error al obtener pedidos: " + err.Error(),
		})
	}

	log.Printf("Pedidos pendientes obtenidos: %d", len(pedidos))
	return c.JSON(http.StatusOK, pedidos)
}

func (h *PedidoHandler) VerificarPago(c echo.Context) error {
	pedidoId := c.Param("id")
	log.Printf("Verificando pago para pedido: %s", pedidoId)

	var req model.VerificarPagoReq
	if err := c.Bind(&req); err != nil {
		log.Printf("Error binding request: %v", err)
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "Datos inválidos",
		})
	}

	if req.Aprobado && req.MetodoPago == "" {
		log.Printf("Validación fallida: método de pago requerido")
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "Debe especificar el método de pago",
		})
	}

	err := h.uc.VerificarPago(c.Request().Context(), pedidoId, req.Aprobado, req.MetodoPago)
	if err != nil {
		log.Printf("Error verificando pago: %v", err)
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "Error al verificar pago: " + err.Error(),
		})
	}

	mensaje := "Pago rechazado"
	if req.Aprobado {
		mensaje = "Pago verificado y registrado exitosamente"
		log.Printf("Pago aprobado para pedido %s con método %s", pedidoId, req.MetodoPago)
	} else {
		log.Printf("Pago rechazado para pedido %s", pedidoId)
	}

	return c.JSON(http.StatusOK, map[string]string{
		"message": mensaje,
	})
}