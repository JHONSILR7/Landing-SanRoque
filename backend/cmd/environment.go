package main

import (
    "log"
    "os"
    "github.com/joho/godotenv"
)

type Config struct {
    DbHost string
    DbPort string
    DbUser string
    DbPass string
    DbName string
    Port   string
    GoogleClientId     string
    GoogleClientSecret string
    GmailRefreshToken string
    EmailUser         string
    EmailAppPass      string
    JwtSecret       string
    FrontendUrl     string
    GrokAPIKey    string
}

func CargarConfig() *Config {
    if err := godotenv.Load(); err != nil {
        log.Println("No se encontró archivo .env")
    } else {
        log.Println("Archivo .env cargado correctamente")
    }
    
    // DEBUG: Ver qué hay en la variable ANTES de crear el config
    grokKey := os.Getenv("GROK_API_KEY")
    log.Printf("=== DEBUG GROK_API_KEY ===")
    log.Printf("Valor raw: '%s'", grokKey)
    log.Printf("Longitud: %d caracteres", len(grokKey))
    if len(grokKey) > 0 {
        if len(grokKey) >= 10 {
            log.Printf("Primeros 10 chars: %s", grokKey[:10])
            log.Printf("Últimos 4 chars: %s", grokKey[len(grokKey)-4:])
        } else {
            log.Printf("Key completa (muy corta): %s", grokKey)
        }
    } else {
        log.Println("❌ GROK_API_KEY está VACÍA")
    }
    
    config := &Config{
        DbHost: obtenerEnv("DB_HOST", "localhost"),
        DbPort: obtenerEnv("DB_PORT", "5432"),
        DbUser: obtenerEnv("DB_USER", "postgres"),
        DbPass: obtenerEnv("DB_PASSWORD", ""),
        DbName: obtenerEnv("DB_NAME", "san_roque"),
        Port:   obtenerEnv("PORT", "8080"),
        GoogleClientId:     obtenerEnv("GOOGLE_CLIENT_ID", ""),
        GoogleClientSecret: obtenerEnv("GOOGLE_CLIENT_SECRET", ""),
        GmailRefreshToken:  obtenerEnv("GMAIL_REFRESH_TOKEN", ""),
        EmailUser:          obtenerEnv("EMAIL_USER", ""),
        EmailAppPass:       obtenerEnv("EMAIL_APP_PASSWORD", ""),
        JwtSecret:          obtenerEnv("JWT_SECRET", ""),
        FrontendUrl:        obtenerEnv("FRONTEND_URL", "http://localhost:3000"),
        GrokAPIKey:         obtenerEnv("GROK_API_KEY", ""),
    }
    
    log.Printf("=== CONFIG FINAL ===")
    log.Printf("GrokAPIKey en config: longitud %d", len(config.GrokAPIKey))
    if len(config.GrokAPIKey) > 0 && len(config.GrokAPIKey) >= 14 {
        log.Printf("Key en config: %s...%s", 
            config.GrokAPIKey[:10], 
            config.GrokAPIKey[len(config.GrokAPIKey)-4:])
    }
    
    return config
}

func obtenerEnv(key, defecto string) string {
    if val := os.Getenv(key); val != "" {
        return val
    }
    return defecto
}
