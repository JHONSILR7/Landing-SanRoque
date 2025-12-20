// backend/infrastructure/postgres/producto_repository.go
package postgres

import (
	"context"
	"database/sql"
	"encoding/json"
	"sanRoque/domain/producto"
	"sanRoque/internal/model"
)

type productoRepo struct {
	db *sql.DB
}

func NuevoProductoRepo(db *sql.DB) producto.ProductoRepo {
	return &productoRepo{db: db}
}

func (r *productoRepo) ObtenerCategorias(ctx context.Context) ([]*model.CateProducto, error) {
	q := `
		SELECT "idCateProducto", nombre, area, "creadoEn"
		FROM "cateProducto"
		ORDER BY nombre ASC
	`

	rows, err := r.db.QueryContext(ctx, q)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	categorias := []*model.CateProducto{}
	for rows.Next() {
		var c model.CateProducto
		if err := rows.Scan(&c.Id, &c.Nombre, &c.Area, &c.CreadoEn); err != nil {
			return nil, err
		}
		categorias = append(categorias, &c)
	}

	return categorias, nil
}

func (r *productoRepo) ObtenerProductosActivos(ctx context.Context) ([]*model.ProductoConCategoria, error) {
	q := `
		SELECT 
			p."idProducto", 
			p.nombre, 
			p.descripcion, 
			p.precio, 
			p.estado,
			p."cateProductoId",
			c.nombre as categoria_nombre,
			p."creadoEn",
			COALESCE(
				(
					SELECT json_agg(img.url ORDER BY img."creadoEn")
					FROM "imgProducto" img
					WHERE img."productoId" = p."idProducto"
				),
				'[]'::json
			) as imagenes
		FROM producto p
		LEFT JOIN "cateProducto" c ON p."cateProductoId" = c."idCateProducto"
		WHERE p.estado = true
		ORDER BY p.nombre ASC
	`

	rows, err := r.db.QueryContext(ctx, q)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	productos := []*model.ProductoConCategoria{}
	for rows.Next() {
		var p model.ProductoConCategoria
		var imagenesJSON []byte
		
		if err := rows.Scan(
			&p.Id,
			&p.Nombre,
			&p.Descripcion,
			&p.Precio,
			&p.Estado,
			&p.CateProductoId,
			&p.CategoriaNombre,
			&p.CreadoEn,
			&imagenesJSON,
		); err != nil {
			return nil, err
		}

		// Parse JSON array de imágenes
		if len(imagenesJSON) > 0 {
			var imagenes []string
			if err := json.Unmarshal(imagenesJSON, &imagenes); err == nil {
				p.Imagenes = imagenes
			}
		}

		productos = append(productos, &p)
	}

	return productos, nil
}