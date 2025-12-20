package postgres

import (
    "context"
    "database/sql"
    "errors"
    "time"

    "github.com/google/uuid"
    "sanRoque/domain/auth"
    "sanRoque/internal/model"
)

type authRepo struct {
    db *sql.DB
}

func NuevoAuthRepo(db *sql.DB) auth.AuthRepo {
    return &authRepo{db: db}
}

func (r *authRepo) BuscarClientePorEmail(ctx context.Context, email string) (*model.ClienteUsu, error) {
    q := `
        SELECT "idClienteUsuario", "clienteId", email, google_id, nombre, foto, "creadoEn"
        FROM cliente_usuario
        WHERE email = $1
    `

    var cu model.ClienteUsu
    err := r.db.QueryRowContext(ctx, q, email).Scan(
        &cu.Id,
        &cu.ClienteId,
        &cu.Email,
        &cu.GoogleId,
        &cu.Nombre,
        &cu.Foto,
        &cu.CreadoEn,
    )

    if err == sql.ErrNoRows {
        return nil, errors.New("cliente no encontrado")
    }

    if err != nil {
        return nil, err
    }

    return &cu, nil
}

func (r *authRepo) CrearClienteGoogle(ctx context.Context, gUsu *model.GoogleUsu) (*model.ClienteUsu, error) {
    tx, err := r.db.BeginTx(ctx, nil)
    if err != nil {
        return nil, err
    }
    defer tx.Rollback()

    cliId := uuid.New().String()
    qCli := `
        INSERT INTO cliente ("idCliente", nombre, "creadoEn")
        VALUES ($1, $2, $3)
    `
    ahora := time.Now().Unix()
    _, err = tx.ExecContext(ctx, qCli, cliId, gUsu.Nombre, ahora)
    if err != nil {
        return nil, err
    }

    cuId := uuid.New().String()
    qCU := `
        INSERT INTO cliente_usuario ("idClienteUsuario", "clienteId", email, google_id, nombre, foto, "creadoEn")
        VALUES ($1, $2, $3, $4, $5, $6, $7)
    `
    _, err = tx.ExecContext(ctx, qCU, cuId, cliId, gUsu.Email, gUsu.Sub, gUsu.Nombre, gUsu.Foto, ahora)
    if err != nil {
        return nil, err
    }

    if err = tx.Commit(); err != nil {
        return nil, err
    }

    return &model.ClienteUsu{
        Id:        cuId,
        ClienteId: cliId,
        Email:     gUsu.Email,
        GoogleId:  gUsu.Sub,
        Nombre:    gUsu.Nombre,
        Foto:      gUsu.Foto,
        CreadoEn:  ahora,
    }, nil
}