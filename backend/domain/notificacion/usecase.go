package notificacion

import (
	"context"
	"fmt"
	"time"

	"github.com/google/uuid"
	"sanRoque/internal/model"
)

type notificacionUC struct {
	repo NotificacionRepo
}

func NuevoNotificacionUC(repo NotificacionRepo) NotificacionUC {
	return &notificacionUC{repo: repo}
}

func (uc *notificacionUC) Crear(ctx context.Context, notif *model.Notificacion) error {
	notif.IdNotificacion = uuid.New().String()
	notif.Leido = false
	notif.CreadoEn = time.Now().Unix()
	return uc.repo.Crear(ctx, notif)
}

func (uc *notificacionUC) ObtenerPorUsuario(ctx context.Context, usuarioId string) ([]*model.Notificacion, error) {
	return uc.repo.ObtenerPorUsuario(ctx, usuarioId)
}

func (uc *notificacionUC) MarcarComoLeida(ctx context.Context, notifId string) error {
	return uc.repo.MarcarComoLeida(ctx, notifId)
}

func (uc *notificacionUC) NotificarNuevoPedido(ctx context.Context, pedido *model.PedidoDetalle) error {
	mensaje := fmt.Sprintf(
		"Nuevo pedido #%s de %s por S/ %.2f - %d producto(s)",
		pedido.Orden,
		pedido.ClienteNombre,
		pedido.Total,
		len(pedido.Productos),
	)

	notif := &model.Notificacion{
		UsuarioId: "",
		Mensaje:   mensaje,
		Tipo:      "NUEVO_PEDIDO",
		Data: map[string]interface{}{
			"pedidoId": pedido.IdPedido,
			"orden":    pedido.Orden,
			"total":    pedido.Total,
		},
	}

	return uc.Crear(ctx, notif)
}