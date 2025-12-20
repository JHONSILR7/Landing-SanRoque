package auth

import (
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
        return c.JSON(http.StatusBadRequest, map[string]string{"error": "Petición inválida"})
    }

    resp, err := h.uc.LoginGoogle(c.Request().Context(), req.Token)
    if err != nil {
        return c.JSON(http.StatusUnauthorized, map[string]string{"error": err.Error()})
    }

    return c.JSON(http.StatusOK, resp)
}