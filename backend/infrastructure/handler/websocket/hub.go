package websocket

import (
	"encoding/json"
	"log"
	"sync"
)

type Hub struct {
	clients    map[string]map[*Client]bool
	register   chan *Client
	unregister chan *Client
	mu         sync.RWMutex
}

type Message struct {
	Type    string      `json:"type"`
	Payload interface{} `json:"payload"`
}

func NewHub() *Hub {
	return &Hub{
		clients:    make(map[string]map[*Client]bool),
		register:   make(chan *Client),
		unregister: make(chan *Client),
	}
}

func (h *Hub) Run() {
	for {
		select {
		case client := <-h.register:
			h.mu.Lock()
			if h.clients[client.rol] == nil {
				h.clients[client.rol] = make(map[*Client]bool)
			}
			h.clients[client.rol][client] = true
			h.mu.Unlock()
			log.Printf("Hub: Cliente registrado - usuarioId: %s, rol: %s, total: %d",
				client.usuarioId, client.rol, len(h.clients[client.rol]))

		case client := <-h.unregister:
			h.mu.Lock()
			if clients, ok := h.clients[client.rol]; ok {
				if _, ok := clients[client]; ok {
					delete(clients, client)
					close(client.send)
					log.Printf("Hub: Cliente desregistrado - usuarioId: %s, rol: %s, restantes: %d",
						client.usuarioId, client.rol, len(h.clients[client.rol]))
				}
			}
			h.mu.Unlock()
		}
	}
}

// SendNotification envía una notificación a todos los clientes de un rol
func (h *Hub) SendNotification(rol string, payload interface{}) {
	h.mu.RLock()
	clients := h.clients[rol]
	h.mu.RUnlock()

	if len(clients) == 0 {
		log.Printf("Hub: No hay clientes conectados con rol '%s'", rol)
		return
	}

	// CORRECCIÓN: Cambiar a "NEW_ORDER" para coincidir con el frontend
	message := Message{
		Type:    "NEW_ORDER",
		Payload: payload,
	}

	data, err := json.Marshal(message)
	if err != nil {
		log.Printf("Hub: Error marshalling message: %v", err)
		return
	}

	log.Printf("Hub: Enviando notificación NEW_ORDER a %d clientes con rol '%s'", len(clients), rol)

	sent := 0
	for client := range clients {
		select {
		case client.send <- data:
			log.Printf("Hub: Mensaje enviado a %s", client.usuarioId)
			sent++
		default:
			log.Printf("Hub: Canal lleno para %s, cerrando conexión", client.usuarioId)
			close(client.send)
			delete(h.clients[client.rol], client)
		}
	}

	log.Printf("Hub: Notificación enviada a %d/%d clientes", sent, len(clients))
}