package main

import (
	"log"

	"sanRoque/infrastructure/handler"
)

func main() {
    cfg := CargarConfig()

    db, err := IniciarDB(cfg)
    if err != nil {
        log.Fatal("Error al iniciar BD:", err)
    }
    defer db.Close()

    e := ConfigurarEcho(cfg)

    handler.ConfigurarRutas(e, db, cfg)

    log.Printf("Servidor iniciando en puerto %s", cfg.Port)
    if err := e.Start(":" + cfg.Port); err != nil {
        log.Fatal("Error al iniciar servidor:", err)
    }
}