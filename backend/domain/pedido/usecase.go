// backend/domain/pedido/usecase.go
package pedido

import (
	"context"
	"sanRoque/internal/model"
)

type pedidoUC struct {
	repo PedidoRepo
}

func NuevoPedidoUC(repo PedidoRepo) PedidoUC {
	return &pedidoUC{repo: repo}
}

func (uc *pedidoUC) CrearPedido(ctx context.Context, req *model.CrearPedidoReq) (*model.PedidoResp, error) {
	return uc.repo.CrearPedido(ctx, req)
}

func (uc *pedidoUC) VerificarPago(ctx context.Context, pedidoId string, aprobado bool, metodoPago string) error {
	return uc.repo.VerificarPago(ctx, pedidoId, aprobado, metodoPago)
}

func (uc *pedidoUC) ObtenerPedidosPendientes(ctx context.Context) ([]*model.PedidoDetalle, error) {
	return uc.repo.ObtenerPedidosPendientes(ctx)
}