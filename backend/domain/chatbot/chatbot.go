// backend/domain/chatbot/chatbot.go
package chatbot

import (
	"context"
	"sanRoque/internal/model"
)

type ChatBotRepo interface {
	ObtenerProductosParaChat(ctx context.Context) ([]*model.ProductoChat, error)
	ObtenerCategoriasParaChat(ctx context.Context) ([]*model.CategoriaChat, error)
}

type ChatBotUC interface {
	ProcesarMensaje(ctx context.Context, mensaje string) (*model.ChatResponse, error)
	ObtenerContextoProductos(ctx context.Context) (string, error)
}