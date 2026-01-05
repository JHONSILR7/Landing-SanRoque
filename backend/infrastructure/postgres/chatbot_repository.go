// backend/infrastructure/postgres/chatbot_repository.go
package postgres

import (
	"context"
	"database/sql"
	"sanRoque/domain/chatbot"
	"sanRoque/internal/model"
)

type chatBotRepo struct {
	db *sql.DB
}

func NuevoChatBotRepo(db *sql.DB) chatbot.ChatBotRepo {
	return &chatBotRepo{db: db}
}

func (r *chatBotRepo) ObtenerCategoriasParaChat(ctx context.Context) ([]*model.CategoriaChat, error) {
	q := `
		SELECT nombre, area
		FROM "cateProducto"
		ORDER BY nombre ASC
	`

	rows, err := r.db.QueryContext(ctx, q)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	categorias := []*model.CategoriaChat{}
	for rows.Next() {
		var c model.CategoriaChat
		if err := rows.Scan(&c.Nombre, &c.Area); err != nil {
			return nil, err
		}
		categorias = append(categorias, &c)
	}

	return categorias, nil
}

func (r *chatBotRepo) ObtenerProductosParaChat(ctx context.Context) ([]*model.ProductoChat, error) {
	q := `
		SELECT 
			p.nombre, 
			COALESCE(p.descripcion, '') as descripcion,
			p.precio,
			COALESCE(c.nombre, 'Sin categoría') as categoria,
			(
				SELECT img.url
				FROM "imgProducto" img
				WHERE img."productoId" = p."idProducto"
				ORDER BY img."creadoEn" ASC
				LIMIT 1
			) as imagen_principal
		FROM producto p
		LEFT JOIN "cateProducto" c ON p."cateProductoId" = c."idCateProducto"
		WHERE p.estado = true
		ORDER BY c.nombre ASC, p.nombre ASC
	`

	rows, err := r.db.QueryContext(ctx, q)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	productos := []*model.ProductoChat{}
	for rows.Next() {
		var p model.ProductoChat
		var imagenPrincipal sql.NullString
		
		if err := rows.Scan(
			&p.Nombre,
			&p.Descripcion,
			&p.Precio,
			&p.Categoria,
			&imagenPrincipal,
		); err != nil {
			return nil, err
		}

		if imagenPrincipal.Valid {
			p.ImagenPrincipal = imagenPrincipal.String
		}

		productos = append(productos, &p)
	}

	return productos, nil
}