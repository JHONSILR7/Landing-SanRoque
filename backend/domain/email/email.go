package email

import (
	"context"
	"sanRoque/internal/model"
)

type EmailUC interface {
	EnviarConfirmacionPedido(ctx context.Context, pedido *model.EmailPedidoData) error
}