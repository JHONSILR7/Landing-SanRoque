package main

import (
    "database/sql"
    "fmt"
    "log"

    _ "github.com/lib/pq"
)

func IniciarDB(cfg *Config) (*sql.DB, error) {
    dsn := fmt.Sprintf(
        "host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
        cfg.DbHost,
        cfg.DbPort,
        cfg.DbUser,
        cfg.DbPass,
        cfg.DbName,
    )

    db, err := sql.Open("postgres", dsn)
    if err != nil {
        return nil, fmt.Errorf("error abriendo BD: %w", err)
    }

    if err := db.Ping(); err != nil {
        return nil, fmt.Errorf("error conectando a BD: %w", err)
    }

    db.SetMaxOpenConns(25)
    db.SetMaxIdleConns(5)

    log.Println("Conexión a BD establecida")
    return db, nil
}