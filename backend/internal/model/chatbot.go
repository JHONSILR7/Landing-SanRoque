// internal/model/chatbot.go
package model

type ChatRequest struct {
	Mensaje string `json:"mensaje"`
}

type ChatResponse struct {
	Respuesta string `json:"respuesta"`
	Timestamp int64  `json:"timestamp"`
}

type ProductoChat struct {
	Nombre          string  `json:"nombre"`
	Descripcion     string  `json:"descripcion"`
	Precio          float64 `json:"precio"`
	Categoria       string  `json:"categoria"`
	ImagenPrincipal string  `json:"imagenPrincipal,omitempty"`
}

type CategoriaChat struct {
	Nombre string `json:"nombre"`
	Area   string `json:"area"`
}

// ============================================
// Estructuras para la API de DeepSeek (legacy)
// ============================================
type DeepSeekMessage struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

type DeepSeekRequest struct {
	Model       string            `json:"model"`
	Messages    []DeepSeekMessage `json:"messages"`
	Temperature float64           `json:"temperature,omitempty"`
	MaxTokens   int               `json:"max_tokens,omitempty"`
}

type DeepSeekChoice struct {
	Index   int             `json:"index"`
	Message DeepSeekMessage `json:"message"`
}

type DeepSeekResponse struct {
	Choices []DeepSeekChoice `json:"choices"`
	Error   *struct {
		Message string `json:"message"`
		Type    string `json:"type"`
	} `json:"error,omitempty"`
}

// ============================================
// Estructuras para la API de Gemini (Google)
// ============================================
type GeminiRequest struct {
	Contents         []GeminiContent        `json:"contents"`
	GenerationConfig GeminiGenerationConfig `json:"generationConfig"`
}

type GeminiContent struct {
	Parts []GeminiPart `json:"parts"`
	Role  string       `json:"role,omitempty"`
}

type GeminiPart struct {
	Text string `json:"text"`
}

type GeminiGenerationConfig struct {
	Temperature     float64 `json:"temperature"`
	MaxOutputTokens int     `json:"maxOutputTokens"`
}

type GeminiResponse struct {
	Candidates []GeminiCandidate `json:"candidates"`
	Error      *struct {
		Message string `json:"message"`
		Code    int    `json:"code"`
	} `json:"error,omitempty"`
}

type GeminiCandidate struct {
	Content       GeminiContent `json:"content"`
	FinishReason  string        `json:"finishReason,omitempty"`
	SafetyRatings []struct {
		Category    string `json:"category"`
		Probability string `json:"probability"`
	} `json:"safetyRatings,omitempty"`
}