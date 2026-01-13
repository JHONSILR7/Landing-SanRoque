package main

import (
	"log"
	"os"
	"strings"

	"github.com/joho/godotenv"
)

type Config struct {
	DbHost               string
	DbPort               string
	DbUser               string
	DbPass               string
	DbName               string
	Port                 string
	GoogleClientId       string
	GoogleClientSecret   string
	GmailRefreshToken    string
	EmailUser            string
	EmailAppPass         string
	JwtSecret            string
	FrontendUrls         []string
	GrokAPIKey           string
	EmailAppPassword     string
}

func CargarConfig() *Config {
	if err := godotenv.Load(); err != nil {
		log.Println("No se encontró archivo .env")
	} else {
		log.Println("Archivo .env cargado correctamente")
	}

	frontendRaw := obtenerEnv("FRONTEND_URL", "http://localhost:3000")

	config := &Config{
		DbHost:             obtenerEnv("DB_HOST", "localhost"),
		DbPort:             obtenerEnv("DB_PORT", "5432"),
		DbUser:             obtenerEnv("DB_USER", "postgres"),
		DbPass:             obtenerEnv("DB_PASSWORD", ""),
		DbName:             obtenerEnv("DB_NAME", "san_roque"),
		Port:               obtenerEnv("PORT", "8080"),
		GoogleClientId:     obtenerEnv("GOOGLE_CLIENT_ID", ""),
		GoogleClientSecret: obtenerEnv("GOOGLE_CLIENT_SECRET", ""),
		GmailRefreshToken:  obtenerEnv("GMAIL_REFRESH_TOKEN", ""),
		EmailUser:          obtenerEnv("EMAIL_USER", ""),
		EmailAppPass:       obtenerEnv("EMAIL_APP_PASSWORD", ""),
		JwtSecret:          obtenerEnv("JWT_SECRET", ""),
		FrontendUrls:       strings.Split(frontendRaw, ","),
		GrokAPIKey:         obtenerEnv("GROK_API_KEY", ""),
		EmailAppPassword:   obtenerEnv("EMAIL_APP_PASSWORD", ""),
	}

	return config
}

func obtenerEnv(key, defecto string) string {
	if val := os.Getenv(key); val != "" {
		return val
	}
	return defecto
}
