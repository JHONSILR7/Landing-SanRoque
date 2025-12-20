// backend/domain/producto/usecase.go
package producto

import (
	"context"
	"sanRoque/internal/model"
)

type productoUC struct {
	repo ProductoRepo
}

func NuevoProductoUC(repo ProductoRepo) ProductoUC {
	return &productoUC{repo: repo}
}

func (uc *productoUC) ObtenerProductosConCategorias(ctx context.Context) (*model.ProductosResp, error) {
	categorias, err := uc.repo.ObtenerCategorias(ctx)
	if err != nil {
		return nil, err
	}

	productos, err := uc.repo.ObtenerProductosActivos(ctx)
	if err != nil {
		return nil, err
	}

	return &model.ProductosResp{
		Categorias: categorias,
		Productos:  productos,
	}, nil
}