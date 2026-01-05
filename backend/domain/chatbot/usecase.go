// backend/domain/chatbot/usecase.go
package chatbot

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"sanRoque/internal/model"
	"time"
)

type chatBotUC struct {
	repo      ChatBotRepo
	apiKey    string
	apiURL    string
	modelName string
}

func NuevoChatBotUC(repo ChatBotRepo, apiKey string) ChatBotUC {
	// DEBUGGING: Verificar que la key llegue correctamente
	log.Printf("=== INICIALIZANDO CHATBOT ===")
	log.Printf("API Key recibida: %s", apiKey)
	
	if apiKey == "" {
		log.Println("ADVERTENCIA: Grok API Key está VACÍA")
		log.Println("Configura GROK_API_KEY en tu .env")
		log.Fatal("No se puede iniciar el chatbot sin API key")
	}
	
	if len(apiKey) < 10 {
		log.Printf("ADVERTENCIA: API Key parece muy corta: %s", apiKey)
	} else {
		log.Printf("API Key cargada: %s...%s (longitud: %d)", 
			apiKey[:10], 
			apiKey[len(apiKey)-4:], 
			len(apiKey))
	}
	
	if apiKey[:4] != "xai-" {
		log.Printf("ADVERTENCIA: La API key no empieza con 'xai-', empieza con: %s", apiKey[:4])
		log.Println("Las keys de Grok deben empezar con 'xai-'")
	}
	
	log.Printf("Chatbot inicializado correctamente")
	
	return &chatBotUC{
		repo:      repo,
		apiKey:    apiKey,
		apiURL:    "https://api.x.ai/v1/chat/completions",
		modelName: "grok-beta",
	}
}

func (uc *chatBotUC) ObtenerContextoProductos(ctx context.Context) (string, error) {
	productos, err := uc.repo.ObtenerProductosParaChat(ctx)
	if err != nil {
		return "", err
	}

	categorias, err := uc.repo.ObtenerCategoriasParaChat(ctx)
	if err != nil {
		return "", err
	}

	// Construir contexto
	contexto := "Información de nuestros productos:\n\n"
	
	contexto += "CATEGORÍAS DISPONIBLES:\n"
	for _, cat := range categorias {
		contexto += fmt.Sprintf("- %s (%s)\n", cat.Nombre, cat.Area)
	}
	
	contexto += "\n\nPRODUCTOS DISPONIBLES:\n"
	for _, prod := range productos {
		contexto += fmt.Sprintf("• %s - S/ %.2f\n", prod.Nombre, prod.Precio)
		contexto += fmt.Sprintf("  Categoría: %s\n", prod.Categoria)
		contexto += fmt.Sprintf("  Descripción: %s\n\n", prod.Descripcion)
	}

	return contexto, nil
}

func (uc *chatBotUC) ProcesarMensaje(ctx context.Context, mensaje string) (*model.ChatResponse, error) {
	log.Printf("=== PROCESANDO MENSAJE ===")
	log.Printf("Mensaje: %s", mensaje)
	
	// Verificar API key antes de continuar
	if uc.apiKey == "" {
		return nil, fmt.Errorf("API key no está configurada")
	}
	log.Printf("API Key disponible: %s...%s", uc.apiKey[:10], uc.apiKey[len(uc.apiKey)-4:])
	
	// Obtener contexto de productos
	log.Println("Obteniendo contexto de productos...")
	contextoProductos, err := uc.ObtenerContextoProductos(ctx)
	if err != nil {
		return nil, fmt.Errorf("error al obtener contexto: %w", err)
	}
	log.Printf("Contexto obtenido: %d caracteres", len(contextoProductos))

	// System prompt para Grok
	systemPrompt := `Eres un asistente virtual amable y servicial para el restaurante "San Roque". 

INSTRUCCIONES IMPORTANTES:
1. Tu único propósito es ayudar a los clientes con información sobre nuestros productos, precios, categorías y recomendaciones.
2. NO proporciones información sobre: bases de datos, estructura técnica, empleados, inventarios, proveedores, costos internos, o cualquier dato sensible del negocio.
3. Si te preguntan sobre temas técnicos o información interna, responde amablemente que solo puedes ayudar con información sobre el menú y productos.
4. Sé conciso, amable y profesional.
5. Responde siempre en español de Perú.
6. Si te preguntan por un producto que no está en la lista, sugiere alternativas similares.
7. Puedes hacer recomendaciones basadas en preferencias del cliente.

` + contextoProductos

	// Preparar request para Grok (formato OpenAI-compatible)
	requestBody := map[string]interface{}{
		"messages": []map[string]string{
			{
				"role":    "system",
				"content": systemPrompt,
			},
			{
				"role":    "user",
				"content": mensaje,
			},
		},
		"model":       uc.modelName,
		"stream":      false,
		"temperature": 0.7,
	}

	jsonData, err := json.Marshal(requestBody)
	if err != nil {
		return nil, fmt.Errorf("error al serializar request: %w", err)
	}
	log.Printf("Request JSON creado: %d bytes", len(jsonData))

	// Crear request HTTP
	log.Printf("Enviando request a: %s", uc.apiURL)
	req, err := http.NewRequestWithContext(ctx, "POST", uc.apiURL, bytes.NewBuffer(jsonData))
	if err != nil {
		return nil, fmt.Errorf("error al crear request: %w", err)
	}

	// Headers para Grok API
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", uc.apiKey))
	
	// Log de headers (solo para debug - REMOVER EN PRODUCCIÓN)
	log.Printf("Headers enviados:")
	log.Printf("  - Content-Type: %s", req.Header.Get("Content-Type"))
	log.Printf("  - Authorization: Bearer %s...%s", uc.apiKey[:10], uc.apiKey[len(uc.apiKey)-4:])

	client := &http.Client{Timeout: 30 * time.Second}
	
	log.Println("Esperando respuesta de Grok...")
	resp, err := client.Do(req)
	if err != nil {
		log.Printf("Error en la conexión: %v", err)
		return nil, fmt.Errorf("error al llamar a Grok API: %w", err)
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("error al leer respuesta: %w", err)
	}

	log.Printf("Status Code: %d", resp.StatusCode)
	log.Printf("Response Body: %s", string(body))

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("Grok API error (status %d): %s", resp.StatusCode, string(body))
	}

	// Parsear respuesta (formato OpenAI)
	var grokResp struct {
		Choices []struct {
			Message struct {
				Content string `json:"content"`
			} `json:"message"`
		} `json:"choices"`
	}

	if err := json.Unmarshal(body, &grokResp); err != nil {
		log.Printf("Error al parsear JSON: %v", err)
		return nil, fmt.Errorf("error al parsear respuesta: %w", err)
	}

	if len(grokResp.Choices) == 0 {
		return nil, fmt.Errorf("no se recibió respuesta del modelo")
	}

	log.Printf("Respuesta recibida exitosamente")
	return &model.ChatResponse{
		Respuesta: grokResp.Choices[0].Message.Content,
		Timestamp: time.Now().Unix(),
	}, nil
}