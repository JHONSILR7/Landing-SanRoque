package auth

import (
    "context"
    "encoding/json"
    "errors"
    "fmt"
    "net/http"
    "time"

    "github.com/golang-jwt/jwt/v5"
    "sanRoque/internal/model"
)

type authUC struct {
    repo      AuthRepo
    googleId  string
    jwtSecret string
}

func NuevoAuthUC(repo AuthRepo, googleId, jwtSecret string) AuthUC {
    return &authUC{
        repo:      repo,
        googleId:  googleId,
        jwtSecret: jwtSecret,
    }
}

// ValidarTokenGoogle valida un ID token de Google
func (uc *authUC) ValidarTokenGoogle(ctx context.Context, idToken string) (*model.GoogleUsu, error) {
    url := fmt.Sprintf("https://oauth2.googleapis.com/tokeninfo?id_token=%s", idToken)

    req, err := http.NewRequestWithContext(ctx, "GET", url, nil)
    if err != nil {
        return nil, err
    }

    cli := &http.Client{Timeout: 10 * time.Second}
    resp, err := cli.Do(req)
    if err != nil {
        return nil, err
    }
    defer resp.Body.Close()

    if resp.StatusCode != http.StatusOK {
        return nil, errors.New("token de google inválido")
    }

    var payload struct {
        Email string `json:"email"`
        Name  string `json:"name"`
        Aud   string `json:"aud"`
        Sub   string `json:"sub"`
    }

    if err := json.NewDecoder(resp.Body).Decode(&payload); err != nil {
        return nil, err
    }

    if payload.Aud != uc.googleId {
        return nil, errors.New("client_id no coincide")
    }

    gUsu := &model.GoogleUsu{
        Email:  payload.Email,
        Nombre: payload.Name,
        Sub:    payload.Sub, // ahora coincide con tu struct
    }

    return gUsu, nil
}

// LoginGoogle crea o busca al usuario y genera JWT propio
func (uc *authUC) LoginGoogle(ctx context.Context, idToken string) (*model.LoginResp, error) {
    gUsu, err := uc.ValidarTokenGoogle(ctx, idToken)
    if err != nil {
        return nil, err
    }

    cliUsu, err := uc.repo.BuscarClientePorEmail(ctx, gUsu.Email)
    if err != nil {
        cliUsu, err = uc.repo.CrearClienteGoogle(ctx, gUsu)
        if err != nil {
            return nil, err
        }
    }

    jwtToken := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
        "cliente_usuario_id": cliUsu.Id,
        "cliente_id":         cliUsu.ClienteId,
        "email":              cliUsu.Email,
        "exp":                time.Now().Add(24 * time.Hour).Unix(),
    })

    tokenStr, err := jwtToken.SignedString([]byte(uc.jwtSecret))
    if err != nil {
        return nil, err
    }

    return &model.LoginResp{
        Token:      tokenStr,
        ClienteUsu: *cliUsu,
    }, nil
}
