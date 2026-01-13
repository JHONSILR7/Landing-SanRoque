package postgres

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"time"

	"github.com/google/uuid"
	"sanRoque/domain/notificacion"
	"sanRoque/internal/model"
)

type notificacionRepo struct {
	db *sql.DB
}

func NuevoNotificacionRepo(db *sql.DB) notificacion.NotificacionRepo {
	return &notificacionRepo{db: db}
}

func (r *notificacionRepo) Crear(ctx context.Context, notif *model.Notificacion) error {
	// CORRECCIÓN: Crear nuevo contexto con timeout para evitar "context canceled"
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	log.Printf("Buscando cajeros con sesión abierta...")

	qCajeros := `
		SELECT DISTINCT u."idUsuario"
		FROM usuario u
		JOIN empleado e ON u."empleadoId" = e."idEmpleado"
		JOIN rol r ON u."rolId" = r."idRol"
		JOIN "sesionCaja" sc ON sc."usuarioId" = u."idUsuario"
		WHERE LOWER(r.nombre) = 'cajero' 
		AND sc.estado = 'ABIERTA'
	`

	rows, err := r.db.QueryContext(ctx, qCajeros)
	if err != nil {
		log.Printf("Error consultando cajeros: %v", err)
		return fmt.Errorf("error al obtener cajeros: %w", err)
	}
	defer rows.Close()

	var cajeros []string
	for rows.Next() {
		var cajeroId string
		if err := rows.Scan(&cajeroId); err != nil {
			log.Printf("Error leyendo cajero: %v", err)
			return err
		}
		cajeros = append(cajeros, cajeroId)
	}

	log.Printf("Cajeros encontrados con sesión abierta: %d", len(cajeros))

	if len(cajeros) == 0 {
		log.Printf("No hay cajeros con sesión abierta")
		return nil
	}

	// Log de los cajeros encontrados
	for i, cajeroId := range cajeros {
		log.Printf("  %d. Cajero ID: %s", i+1, cajeroId)
	}

	dataJSON, err := json.Marshal(notif.Data)
	if err != nil {
		log.Printf("Error marshaling data: %v", err)
		return err
	}

	qInsert := `
		INSERT INTO notificacion ("idNotificacion", "usuarioId", mensaje, tipo, data, leido, "creadoEn")
		VALUES ($1, $2, $3, $4, $5, $6, $7)
	`

	for _, cajeroId := range cajeros {
		notifId := uuid.New().String()
		_, err = r.db.ExecContext(ctx, qInsert,
			notifId,
			cajeroId,
			notif.Mensaje,
			notif.Tipo,
			dataJSON,
			false,
			notif.CreadoEn,
		)
		if err != nil {
			log.Printf("Error creando notificación para cajero %s: %v", cajeroId, err)
			return fmt.Errorf("error al crear notificación: %w", err)
		}
		log.Printf("Notificación creada para cajero: %s (ID: %s)", cajeroId, notifId)
	}

	log.Printf("Total de notificaciones creadas: %d", len(cajeros))
	return nil
}

func (r *notificacionRepo) ObtenerPorUsuario(ctx context.Context, usuarioId string) ([]*model.Notificacion, error) {
	log.Printf("Cargando notificaciones para usuario: %s", usuarioId)

	q := `
		SELECT "idNotificacion", "usuarioId", mensaje, tipo, COALESCE(data, '{}'::jsonb), leido, "creadoEn"
		FROM notificacion
		WHERE "usuarioId" = $1
		ORDER BY "creadoEn" DESC
		LIMIT 50
	`

	rows, err := r.db.QueryContext(ctx, q, usuarioId)
	if err != nil {
		log.Printf("Error consultando notificaciones: %v", err)
		return nil, err
	}
	defer rows.Close()

	var notificaciones []*model.Notificacion
	for rows.Next() {
		var n model.Notificacion
		var dataJSON []byte

		err := rows.Scan(
			&n.IdNotificacion,
			&n.UsuarioId,
			&n.Mensaje,
			&n.Tipo,
			&dataJSON,
			&n.Leido,
			&n.CreadoEn,
		)
		if err != nil {
			log.Printf("Error leyendo notificación: %v", err)
			return nil, err
		}

		if len(dataJSON) > 0 {
			json.Unmarshal(dataJSON, &n.Data)
		}

		notificaciones = append(notificaciones, &n)
	}

	log.Printf("Notificaciones cargadas: %d", len(notificaciones))
	return notificaciones, nil
}

func (r *notificacionRepo) MarcarComoLeida(ctx context.Context, notifId string) error {
	log.Printf("Marcando notificación como leída: %s", notifId)

	q := `UPDATE notificacion SET leido = true WHERE "idNotificacion" = $1`
	_, err := r.db.ExecContext(ctx, q, notifId)
	
	if err != nil {
		log.Printf("Error marcando como leída: %v", err)
	} else {
		log.Printf("Notificación marcada como leída")
	}
	
	return err
}