// backend/domain/producto/producto.go
package producto

import (
	"context"
	"sanRoque/internal/model"
)

type ProductoRepo interface {
	ObtenerProductosActivos(ctx context.Context) ([]*model.ProductoConCategoria, error)
	ObtenerCategorias(ctx context.Context) ([]*model.CateProducto, error)
}

type ProductoUC interface {
	ObtenerProductosConCategorias(ctx context.Context) (*model.ProductosResp, error)
}