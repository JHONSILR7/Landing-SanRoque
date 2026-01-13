package model

type CrearPedidoReq struct {
	ClienteNombre    string              `json:"clienteNombre"`
	ClienteTelefono  string              `json:"clienteTelefono"`
	ClienteDireccion string              `json:"clienteDireccion,omitempty"`
	ClienteEmail     string              `json:"clienteEmail"` // NUEVO
	Productos        []ProductoPedidoReq `json:"productos"`
	ComprobanteURL   string              `json:"comprobanteUrl"`
	MetodoPago       string              `json:"metodoPago"`
}

type ProductoPedidoReq struct {
	ProductoId string  `json:"productoId"`
	Cantidad   int     `json:"cantidad"`
	Precio     float64 `json:"precio"`
}

type PedidoResp struct {
	IdPedido       string  `json:"idPedido"`
	Orden          string  `json:"orden"`
	Total          float64 `json:"total"`
	Estado         string  `json:"estado"`
	ComprobanteURL string  `json:"comprobanteUrl"`
	CreadoEn       int64   `json:"creadoEn"`
}

type PedidoDetalle struct {
	IdPedido         string                  `json:"idPedido"`
	Orden            string                  `json:"orden"`
	ClienteNombre    string                  `json:"clienteNombre"`
	ClienteTelefono  string                  `json:"clienteTelefono"`
	ClienteDireccion string                  `json:"clienteDireccion"`
	ClienteEmail     string                  `json:"clienteEmail"` // NUEVO
	Total            float64                 `json:"total"`
	Estado           string                  `json:"estado"`
	ComprobanteURL   string                  `json:"comprobanteUrl"`
	CreadoEn         int64                   `json:"creadoEn"`
	Productos        []ProductoDetallePedido `json:"productos"`
}

type ProductoDetallePedido struct {
	ProductoId     string  `json:"productoId"`
	ProductoNombre string  `json:"productoNombre"`
	Cantidad       int     `json:"cantidad"`
	PrecioUnitario float64 `json:"precioUnitario"`
	Subtotal       float64 `json:"subtotal"`
}

type VerificarPagoReq struct {
	Aprobado   bool   `json:"aprobado"`
	MetodoPago string `json:"metodoPago,omitempty"`
}

// NUEVO - Para envío de email
type EmailPedidoData struct {
	Email            string
	ClienteNombre    string
	ClienteTelefono  string
	ClienteDireccion string
	Orden            string
	Total            float64
	Productos        []ProductoDetallePedido
}