// backend/domain/pedido/pedido.go
package pedido

import (
	"context"
	"sanRoque/internal/model"
)

type PedidoRepo interface {
	CrearPedido(ctx context.Context, req *model.CrearPedidoReq) (*model.PedidoResp, error)
	VerificarPago(ctx context.Context, pedidoId string, aprobado bool, metodoPago string) error
	ObtenerPedidosPendientes(ctx context.Context) ([]*model.PedidoDetalle, error)
}

type PedidoUC interface {
	CrearPedido(ctx context.Context, req *model.CrearPedidoReq) (*model.PedidoResp, error)
	VerificarPago(ctx context.Context, pedidoId string, aprobado bool, metodoPago string) error
	ObtenerPedidosPendientes(ctx context.Context) ([]*model.PedidoDetalle, error)
}