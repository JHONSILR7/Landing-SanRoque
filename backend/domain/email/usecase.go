package email

import (
	"bytes"
	"context"
	"fmt"
	"html/template"
	"net/smtp"
	"sanRoque/internal/model"
)

type emailUC struct {
	emailUser     string
	emailPassword string
}

func NuevoEmailUC(emailUser, emailPassword string) EmailUC {
	return &emailUC{
		emailUser:     emailUser,
		emailPassword: emailPassword,
	}
}

func (uc *emailUC) EnviarConfirmacionPedido(ctx context.Context, pedido *model.EmailPedidoData) error {

	tmpl := `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.4;
            color: #333;
            font-size: 13px;
        }
        .container {
            max-width: 560px;
            margin: 0 auto;
            padding: 10px;
        }
        .header {
            background: linear-gradient(135deg, #8B1A1A 0%, #C42828 100%);
            color: white;
            padding: 18px;
            text-align: center;
            border-radius: 8px 8px 0 0;
        }
        .header h1 {
            margin: 0;
            font-size: 20px;
        }
        .content {
            background: #f9f9f9;
            padding: 18px;
            border-radius: 0 0 8px 8px;
        }
        .order-info {
            background: white;
            padding: 15px;
            border-radius: 6px;
            margin: 15px 0;
        }
        .order-info h3 {
            margin: 0 0 8px;
            font-size: 15px;
        }
        .order-info h4 {
            margin-top: 15px;
            font-size: 14px;
        }
        .product-item {
            border-bottom: 1px solid #eee;
            padding: 6px 0;
            font-size: 13px;
        }
        .product-item:last-child {
            border-bottom: none;
        }
        .total {
            font-size: 15px;
            font-weight: bold;
            color: #8B1A1A;
            margin-top: 12px;
        }
        .footer {
            text-align: center;
            margin-top: 15px;
            color: #666;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Pedido Confirmado</h1>
            <p>San Roque - Panadería y Pastelería</p>
        </div>
        <div class="content">
            <p>Estimado/a <strong>{{.ClienteNombre}}</strong>,</p>
            <p>Hemos recibido tu pedido correctamente:</p>

            <div class="order-info">
                <h3>Información del Pedido</h3>
                <p><strong>Orden:</strong> #{{.Orden}}</p>
                <p><strong>Estado:</strong> Pendiente de verificación</p>
                <p><strong>Teléfono:</strong> {{.ClienteTelefono}}</p>
                {{if .ClienteDireccion}}
                <p><strong>Dirección:</strong> {{.ClienteDireccion}}</p>
                {{end}}

                <h4>Productos</h4>
                {{range .Productos}}
                <div class="product-item">
                    <strong>{{.ProductoNombre}}</strong><br>
                    {{.Cantidad}} x S/ {{printf "%.2f" .PrecioUnitario}}
                    = S/ {{printf "%.2f" .Subtotal}}
                </div>
                {{end}}

                <div class="total">
                    Total: S/ {{printf "%.2f" .Total}}
                </div>
            </div>

            <p>Verificaremos tu pago y te confirmaremos pronto.</p>

            <div class="footer">
                <p>Gracias por tu preferencia</p>
                <p><strong>San Roque</strong></p>
            </div>
        </div>
    </div>
</body>
</html>
`

	t, err := template.New("email").Parse(tmpl)
	if err != nil {
		return fmt.Errorf("error al parsear template: %w", err)
	}

	var body bytes.Buffer
	if err := t.Execute(&body, pedido); err != nil {
		return fmt.Errorf("error al ejecutar template: %w", err)
	}

	msg := ""
	msg += "MIME-Version: 1.0\r\n"
	msg += "Content-Type: text/html; charset=\"UTF-8\"\r\n"
	msg += fmt.Sprintf("From: San Roque <%s>\r\n", uc.emailUser)
	msg += fmt.Sprintf("To: %s\r\n", pedido.Email)
	msg += fmt.Sprintf("Subject: Confirmación de Pedido #%s - San Roque\r\n", pedido.Orden)
	msg += "\r\n" + body.String()

	auth := smtp.PlainAuth("", uc.emailUser, uc.emailPassword, "smtp.gmail.com")

	err = smtp.SendMail(
		"smtp.gmail.com:587",
		auth,
		uc.emailUser,
		[]string{pedido.Email},
		[]byte(msg),
	)

	if err != nil {
		return fmt.Errorf("error al enviar email: %w", err)
	}

	return nil
}
