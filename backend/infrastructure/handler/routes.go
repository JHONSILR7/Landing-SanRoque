package handler

import (
	"database/sql"
	"reflect"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	authDom "sanRoque/domain/auth"
	chatbotDom "sanRoque/domain/chatbot"
	emailDom "sanRoque/domain/email"
	notifDom "sanRoque/domain/notificacion"
	pedidoDom "sanRoque/domain/pedido"
	prodDom "sanRoque/domain/producto"
	authHand "sanRoque/infrastructure/handler/auth"
	notifHand "sanRoque/infrastructure/handler/notificacion"
	pedidoHand "sanRoque/infrastructure/handler/pedido"
	prodHand "sanRoque/infrastructure/handler/producto"
	chatbotHand "sanRoque/infrastructure/handler/chatbot"
	wsHandler "sanRoque/infrastructure/handler/websocket"
	"sanRoque/infrastructure/postgres"
)

func ConfigurarRutas(e *echo.Echo, db *sql.DB, cfg interface{}) {
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"*"},
		AllowMethods: []string{echo.GET, echo.POST, echo.PUT, echo.DELETE, echo.PATCH},
		AllowHeaders: []string{echo.HeaderOrigin, echo.HeaderContentType, echo.HeaderAccept, echo.HeaderAuthorization},
	}))

	cfgValue := reflect.ValueOf(cfg)
	if cfgValue.Kind() == reflect.Ptr {
		cfgValue = cfgValue.Elem()
	}

	googleClientId := cfgValue.FieldByName("GoogleClientId").String()
	jwtSecret := cfgValue.FieldByName("JwtSecret").String()
	emailUser := cfgValue.FieldByName("EmailUser").String()
	emailPassword := cfgValue.FieldByName("EmailAppPassword").String()

	hub := wsHandler.NewHub()
	go hub.Run()
	wsH := wsHandler.NewHandler(hub)

	authRepo := postgres.NuevoAuthRepo(db)
	authUC := authDom.NuevoAuthUC(authRepo, googleClientId, jwtSecret)
	authH := authHand.NuevoAuthHandler(authUC)

	prodRepo := postgres.NuevoProductoRepo(db)
	prodUC := prodDom.NuevoProductoUC(prodRepo)
	prodH := prodHand.NuevoProductoHandler(prodUC)

	emailUC := emailDom.NuevoEmailUC(emailUser, emailPassword)

	notifRepo := postgres.NuevoNotificacionRepo(db)
	notifUC := notifDom.NuevoNotificacionUC(notifRepo)
	notifH := notifHand.NuevoNotificacionHandler(notifUC)

	pedidoRepo := postgres.NuevoPedidoRepo(db)
	pedidoUC := pedidoDom.NuevoPedidoUC(pedidoRepo)
	pedidoH := pedidoHand.NuevoPedidoHandler(pedidoUC, emailUC, notifUC, wsH)

	chatbotRepo := postgres.NuevoChatBotRepo(db)
	chatbotUC := chatbotDom.NuevoChatBotUC(chatbotRepo, cfgValue.FieldByName("GrokAPIKey").String())
	chatbotH := chatbotHand.NuevoChatBotHandler(chatbotUC)

	api := e.Group("/api")
	
	auth := api.Group("/auth")
	authHand.RegistrarRutas(auth, authH)

	productos := api.Group("/productos")
	prodHand.RegistrarRutas(productos, prodH)

	pedidos := api.Group("/pedidos")
	pedidoHand.RegistrarRutas(pedidos, pedidoH)

	chatbot := api.Group("/chatbot")
	chatbotHand.RegistrarRutas(chatbot, chatbotH)

	notificaciones := api.Group("/notificaciones")
	notifHand.RegistrarRutas(notificaciones, notifH)

	e.GET("/ws", wsH.ServeWS)
}