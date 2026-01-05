// backend/infrastructure/postgres/pedido_repository.go
package postgres

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"time"

	"github.com/google/uuid"
	"sanRoque/domain/pedido"
	"sanRoque/internal/model"
)

type pedidoRepo struct {
	db *sql.DB
}

func NuevoPedidoRepo(db *sql.DB) pedido.PedidoRepo {
	return &pedidoRepo{db: db}
}

func (r *pedidoRepo) CrearPedido(ctx context.Context, req *model.CrearPedidoReq) (*model.PedidoResp, error) {
	tx, err := r.db.BeginTx(ctx, nil)
	if err != nil {
		return nil, err
	}
	defer tx.Rollback()

	// 1. Crear o buscar cliente
	var clienteId string
	qCliente := `
		INSERT INTO cliente (nombre, telefono, direccion)
		VALUES ($1, $2, $3)
		ON CONFLICT (telefono) DO UPDATE SET
			nombre = EXCLUDED.nombre,
			direccion = EXCLUDED.direccion
		RETURNING "idCliente"
	`
	err = tx.QueryRowContext(ctx, qCliente, 
		req.ClienteNombre, 
		req.ClienteTelefono, 
		req.ClienteDireccion,
	).Scan(&clienteId)
	if err != nil {
		return nil, fmt.Errorf("error al crear cliente: %w", err)
	}

	// 2. Calcular total
	var total float64
	for _, p := range req.Productos {
		total += p.Precio * float64(p.Cantidad)
	}

	// 3. Generar orden correlativa
	var ultimoNumero int
	qUltimaOrden := `
		SELECT COALESCE(MAX(CAST(orden AS INTEGER)), 0) 
		FROM pedido 
		WHERE orden ~ '^[0-9]+$'
	`
	err = tx.QueryRowContext(ctx, qUltimaOrden).Scan(&ultimoNumero)
	if err != nil {
		return nil, fmt.Errorf("error al obtener última orden: %w", err)
	}
	orden := fmt.Sprintf("%d", ultimoNumero+1)

	// 4. Crear pedido en estado PENDIENTE_VERIFICAR
	pedidoId := uuid.New().String()
	var returnedPedidoId string
	qPedido := `
		INSERT INTO pedido ("idPedido", "clienteId", orden, total, estado, "comprobanteUrl", "creadoEn")
		VALUES ($1, $2, $3, $4, 'PENDIENTE_VERIFICAR', $5, $6)
		RETURNING "idPedido"
	`
	creadoEn := time.Now().Unix()
	err = tx.QueryRowContext(ctx, qPedido, pedidoId, clienteId, orden, total, req.ComprobanteURL, creadoEn).Scan(&returnedPedidoId)
	if err != nil {
		return nil, fmt.Errorf("error al crear pedido: %w", err)
	}

	// 5. Crear detalles del pedido
	qDetalle := `
		INSERT INTO "detallePedido" ("pedidoId", "productoId", cantidad, "precioUnitario", subtotal)
		VALUES ($1, $2, $3, $4, $5)
	`
	for _, p := range req.Productos {
		subtotal := p.Precio * float64(p.Cantidad)
		_, err = tx.ExecContext(ctx, qDetalle, pedidoId, p.ProductoId, p.Cantidad, p.Precio, subtotal)
		if err != nil {
			return nil, fmt.Errorf("error al crear detalle: %w", err)
		}
	}

	// 6. Commit transacción
	if err = tx.Commit(); err != nil {
		return nil, fmt.Errorf("error al confirmar transacción: %w", err)
	}

	return &model.PedidoResp{
		IdPedido:       pedidoId,
		Orden:          orden,
		Total:          total,
		Estado:         "PENDIENTE_VERIFICAR",
		ComprobanteURL: req.ComprobanteURL,
		CreadoEn:       creadoEn,
	}, nil
}

func (r *pedidoRepo) VerificarPago(ctx context.Context, pedidoId string, aprobado bool, metodoPago string) error {
	tx, err := r.db.BeginTx(ctx, nil)
	if err != nil {
		return err
	}
	defer tx.Rollback()

	if aprobado {
		// 1. Actualizar estado del pedido a VERIFICADO
		qActualizarPedido := `
			UPDATE pedido 
			SET estado = 'VERIFICADO' 
			WHERE "idPedido" = $1
		`
		_, err = tx.ExecContext(ctx, qActualizarPedido, pedidoId)
		if err != nil {
			return fmt.Errorf("error al actualizar pedido: %w", err)
		}

		// 2. Obtener el monto del pedido
		var monto float64
		qObtenerMonto := `SELECT total FROM pedido WHERE "idPedido" = $1`
		err = tx.QueryRowContext(ctx, qObtenerMonto, pedidoId).Scan(&monto)
		if err != nil {
			return fmt.Errorf("error al obtener monto: %w", err)
		}

		// 3. Crear el pago
		qCrearPago := `
			INSERT INTO pago ("pedidoId", monto, metodo)
			VALUES ($1, $2, $3)
		`
		_, err = tx.ExecContext(ctx, qCrearPago, pedidoId, monto, metodoPago)
		if err != nil {
			return fmt.Errorf("error al crear pago: %w", err)
		}
	} else {
		// Rechazar el pedido
		qRechazar := `
			UPDATE pedido 
			SET estado = 'RECHAZADO' 
			WHERE "idPedido" = $1
		`
		_, err = tx.ExecContext(ctx, qRechazar, pedidoId)
		if err != nil {
			return fmt.Errorf("error al rechazar pedido: %w", err)
		}
	}

	return tx.Commit()
}

func (r *pedidoRepo) ObtenerPedidosPendientes(ctx context.Context) ([]*model.PedidoDetalle, error) {
	q := `
		SELECT 
			p."idPedido",
			p.orden,
			c.nombre as cliente_nombre,
			c.telefono as cliente_telefono,
			COALESCE(c.direccion, '') as cliente_direccion,
			p.total,
			p.estado,
			COALESCE(p."comprobanteUrl", '') as comprobante_url,
			p."creadoEn",
			COALESCE(
				(
					SELECT json_agg(
						json_build_object(
							'productoId', dp."productoId",
							'productoNombre', prod.nombre,
							'cantidad', dp.cantidad,
							'precioUnitario', dp."precioUnitario",
							'subtotal', dp.subtotal
						)
					)
					FROM "detallePedido" dp
					JOIN producto prod ON dp."productoId" = prod."idProducto"
					WHERE dp."pedidoId" = p."idPedido"
				),
				'[]'::json
			) as productos
		FROM pedido p
		JOIN cliente c ON p."clienteId" = c."idCliente"
		WHERE p.estado = 'PENDIENTE_VERIFICAR'
		ORDER BY p."creadoEn" DESC
	`

	rows, err := r.db.QueryContext(ctx, q)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	pedidos := []*model.PedidoDetalle{}
	for rows.Next() {
		var p model.PedidoDetalle
		var productosJSON []byte

		err := rows.Scan(
			&p.IdPedido,
			&p.Orden,
			&p.ClienteNombre,
			&p.ClienteTelefono,
			&p.ClienteDireccion,
			&p.Total,
			&p.Estado,
			&p.ComprobanteURL,
			&p.CreadoEn,
			&productosJSON,
		)
		if err != nil {
			return nil, err
		}

		// Parse productos JSON
		if len(productosJSON) > 0 {
			var productos []model.ProductoDetallePedido
			if err := json.Unmarshal(productosJSON, &productos); err == nil {
				p.Productos = productos
			}
		}

		pedidos = append(pedidos, &p)
	}

	return pedidos, nil
}