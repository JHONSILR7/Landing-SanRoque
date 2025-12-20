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

    JwtSecret   string
    FrontendUrl string
}

func CargarConfig() *Config {
    if err := godotenv.Load(); err != nil {
        log.Println("No se encontró archivo .env")
    }

    return &Config{
        DbHost: obtenerEnv("DB_HOST", "localhost"),
        DbPort: obtenerEnv("DB_PORT", "5432"),
        DbUser: obtenerEnv("DB_USER", "postgres"),
        DbPass: obtenerEnv("DB_PASSWORD", ""),
        DbName: obtenerEnv("DB_NAME", "san_roque"),
        Port:   obtenerEnv("PORT", "8080"),

        GoogleClientId:     obtenerEnv("GOOGLE_CLIENT_ID", ""),
        GoogleClientSecret: obtenerEnv("GOOGLE_CLIENT_SECRET", ""),

        GmailRefreshToken: obtenerEnv("GMAIL_REFRESH_TOKEN", ""),
        EmailUser:         obtenerEnv("EMAIL_USER", ""),
        EmailAppPass:      obtenerEnv("EMAIL_APP_PASSWORD", ""),

        JwtSecret:   obtenerEnv("JWT_SECRET", ""),
        FrontendUrl: obtenerEnv("FRONTEND_URL", "http://localhost:3000"),
    }
}

func obtenerEnv(key, defecto string) string {
    if val := os.Getenv(key); val != "" {
        return val
    }
    return defecto
}