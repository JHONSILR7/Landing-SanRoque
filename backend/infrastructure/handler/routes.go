// backend/infrastructure/handler/routes.go
package handler

import (
	"database/sql"
	"reflect"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	authDom "sanRoque/domain/auth"
	chatbotDom "sanRoque/domain/chatbot"
	pedidoDom "sanRoque/domain/pedido"
	prodDom "sanRoque/domain/producto"
	authHand "sanRoque/infrastructure/handler/auth"
	pedidoHand "sanRoque/infrastructure/handler/pedido"
	prodHand "sanRoque/infrastructure/handler/producto"
	chatbotHand "sanRoque/infrastructure/handler/chatbot"
	"sanRoque/infrastructure/postgres"

)

func ConfigurarRutas(e *echo.Echo, db *sql.DB, cfg interface{}) {
	// CORS
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"*"},
		AllowMethods: []string{echo.GET, echo.POST, echo.PUT, echo.DELETE, echo.PATCH},
		AllowHeaders: []string{echo.HeaderOrigin, echo.HeaderContentType, echo.HeaderAccept, echo.HeaderAuthorization},
	}))

	// Usar reflection para acceder a los campos de cfg
	cfgValue := reflect.ValueOf(cfg)
	if cfgValue.Kind() == reflect.Ptr {
		cfgValue = cfgValue.Elem()
	}

	googleClientId := cfgValue.FieldByName("GoogleClientId").String()
	jwtSecret := cfgValue.FieldByName("JwtSecret").String()

	// Auth
	authRepo := postgres.NuevoAuthRepo(db)
	authUC := authDom.NuevoAuthUC(authRepo, googleClientId, jwtSecret)
	authH := authHand.NuevoAuthHandler(authUC)

	// Producto
	prodRepo := postgres.NuevoProductoRepo(db)
	prodUC := prodDom.NuevoProductoUC(prodRepo)
	prodH := prodHand.NuevoProductoHandler(prodUC)

	// Pedido
	pedidoRepo := postgres.NuevoPedidoRepo(db)
	pedidoUC := pedidoDom.NuevoPedidoUC(pedidoRepo)
	pedidoH := pedidoHand.NuevoPedidoHandler(pedidoUC)

	// ChatBot
	chatbotRepo := postgres.NuevoChatBotRepo(db)
	chatbotUC := chatbotDom.NuevoChatBotUC(chatbotRepo, cfgValue.FieldByName("GrokAPIKey").String())
	chatbotH := chatbotHand.NuevoChatBotHandler(chatbotUC)

	// Rutas
	api := e.Group("/api")
	
	auth := api.Group("/auth")
	authHand.RegistrarRutas(auth, authH)

	productos := api.Group("/productos")
	prodHand.RegistrarRutas(productos, prodH)

	pedidos := api.Group("/pedidos")
	pedidoHand.RegistrarRutas(pedidos, pedidoH)

	chatbot := api.Group("/chatbot")
	chatbotHand.RegistrarRutas(chatbot, chatbotH)
}