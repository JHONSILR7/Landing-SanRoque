// internal/model/producto.go
package model

type CateProducto struct {
	Id       string `json:"idCateProducto"`
	Nombre   string `json:"nombre"`
	Area     string `json:"area"`
	CreadoEn int64  `json:"creadoEn"`
}

type Producto struct {
	Id              string  `json:"idProducto"`
	Nombre          string  `json:"nombre"`
	Descripcion     string  `json:"descripcion"`
	Precio          float64 `json:"precio"`
	Estado          bool    `json:"estado"`
	CateProductoId  string  `json:"cateProductoId"`
	CreadoEn        int64   `json:"creadoEn"`
}

type ProductoConCategoria struct {
	Id              string   `json:"idProducto"`
	Nombre          string   `json:"nombre"`
	Descripcion     string   `json:"descripcion"`
	Precio          float64  `json:"precio"`
	Estado          bool     `json:"estado"`
	CateProductoId  string   `json:"cateProductoId"`
	CategoriaNombre string   `json:"categoriaNombre"`
	CreadoEn        int64    `json:"creadoEn"`
	Imagenes        []string `json:"imagenes"`
}

type ProductosResp struct {
	Categorias []*CateProducto         `json:"categorias"`
	Productos  []*ProductoConCategoria `json:"productos"`
}