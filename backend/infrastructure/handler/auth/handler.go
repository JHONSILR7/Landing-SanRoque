package auth

import (
    "log"
    "net/http"

    "github.com/labstack/echo/v4"
    "sanRoque/domain/auth"
)

type AuthHandler struct {
    uc auth.AuthUC
}

func NuevoAuthHandler(uc auth.AuthUC) *AuthHandler {
    return &AuthHandler{uc: uc}
}

type LoginGoogleReq struct {
    Token string `json:"token" validate:"required"`
}

func (h *AuthHandler) LoginGoogle(c echo.Context) error {
    var req LoginGoogleReq
    if err := c.Bind(&req); err != nil {
        log.Printf("Error al bindear request: %v", err)
        return c.JSON(http.StatusBadRequest, map[string]string{"error": "Petición inválida"})
    }

    log.Printf("Token recibido (primeros 50 chars): %.50s...", req.Token)
    
    resp, err := h.uc.LoginGoogle(c.Request().Context(), req.Token)
    if err != nil {
        log.Printf("Error en LoginGoogle: %v", err)
        return c.JSON(http.StatusUnauthorized, map[string]string{"error": err.Error()})
    }

    return c.JSON(http.StatusOK, resp)
}