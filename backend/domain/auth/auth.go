package auth

import (
    "context"
    "sanRoque/internal/model"
)

type AuthRepo interface {
    BuscarClientePorEmail(ctx context.Context, email string) (*model.ClienteUsu, error)
    CrearClienteGoogle(ctx context.Context, gUsu *model.GoogleUsu) (*model.ClienteUsu, error)
}

type AuthUC interface {
    ValidarTokenGoogle(ctx context.Context, token string) (*model.GoogleUsu, error)
    LoginGoogle(ctx context.Context, token string) (*model.LoginResp, error)
}