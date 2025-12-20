package auth

import (
    "github.com/labstack/echo/v4"
)

func RegistrarRutas(g *echo.Group, h *AuthHandler) {
    g.POST("/google", h.LoginGoogle)
}