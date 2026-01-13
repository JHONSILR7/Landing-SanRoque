package notificacion

import (
	"context"
	"sanRoque/internal/model"
)

type NotificacionRepo interface {
	Crear(ctx context.Context, notif *model.Notificacion) error
	ObtenerPorUsuario(ctx context.Context, usuarioId string) ([]*model.Notificacion, error)
	MarcarComoLeida(ctx context.Context, notifId string) error
}

type NotificacionUC interface {
	Crear(ctx context.Context, notif *model.Notificacion) error
	ObtenerPorUsuario(ctx context.Context, usuarioId string) ([]*model.Notificacion, error)
	MarcarComoLeida(ctx context.Context, notifId string) error
	NotificarNuevoPedido(ctx context.Context, pedido *model.PedidoDetalle) error
}