"use client";

import { useState, useEffect } from "react";
import axiosInst from "@/lib/axios";
import { useCart } from "@/context/CartContext";

interface Categoria {
  idCateProducto: string;
  nombre: string;
  area: string;
}

interface Producto {
  idProducto: string;
  nombre: string;
  descripcion: string;
  precio: number;
  cateProductoId: string;
  categoriaNombre: string;
  imagenes: string[];
}

interface ProductosResponse {
  categorias: Categoria[];
  productos: Producto[];
}

export default function ProductMenu() {
  const [categoriaActiva, setCategoriaActiva] = useState("Todos");
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [productoAgregado, setProductoAgregado] = useState<string | null>(null);

  // Usar el contexto del carrito
  const { agregarAlCarrito } = useCart();

  // Imagen por defecto si no hay imágenes
  const IMAGEN_POR_DEFECTO = "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop";

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      setCargando(true);
      const resp = await axiosInst.get<ProductosResponse>("/api/productos");
      setCategorias(resp.data.categorias);
      setProductos(resp.data.productos);
    } catch (err) {
      setError("Error al cargar productos");
      console.error(err);
    } finally {
      setCargando(false);
    }
  };

  const productosFiltrados =
    categoriaActiva === "Todos"
      ? productos
      : productos.filter((p) => p.categoriaNombre === categoriaActiva);

  const obtenerImagenProducto = (imagenes: string[]) => {
    if (imagenes && imagenes.length > 0) {
      return imagenes[0];
    }
    return IMAGEN_POR_DEFECTO;
  };

  const handleAgregarAlCarrito = (producto: Producto) => {
    agregarAlCarrito(producto);
    
    // Mostrar feedback visual
    setProductoAgregado(producto.idProducto);
    setTimeout(() => {
      setProductoAgregado(null);
    }, 1000);
  };

  if (cargando) {
    return (
      <section id="menu" className="py-5" style={{ background: 'linear-gradient(to bottom, #f9fafb, white)' }}>
        <div className="container">
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            <p className="mt-3">Cargando productos...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="menu" className="py-5" style={{ background: 'linear-gradient(to bottom, #f9fafb, white)' }}>
        <div className="container">
          <div className="alert alert-danger">{error}</div>
        </div>
      </section>
    );
  }

  return (
    <section id="menu" className="py-4" style={{ background: 'linear-gradient(to bottom, #f9fafb, white)' }}>
      <div className="container">
        {/* Encabezado */}
        <div className="text-center mb-4">
          <span className="section-badge" style={{ fontSize: '0.75rem', padding: '0.4rem 0.8rem' }}>Nuestros Productos</span>
          <h2 className="section-title" style={{ fontSize: '1.8rem', marginTop: '0.8rem', marginBottom: '0.8rem' }}>Menú Delicioso</h2>
          <p className="section-subtitle" style={{ fontSize: '0.95rem' }}>
            Descubre nuestros productos más deliciosos, elaborados con
            ingredientes frescos y recetas tradicionales
          </p>
        </div>

        {/* Filtros de categoría */}
        <div className="d-flex flex-wrap justify-content-center gap-2 mb-4">
          <button
            onClick={() => setCategoriaActiva("Todos")}
            className={`category-filter ${categoriaActiva === "Todos" ? 'active' : ''}`}
            style={{ fontSize: '0.85rem', padding: '0.5rem 1.1rem' }}
          >
            Todos
          </button>
          {categorias.map((cat) => (
            <button
              key={cat.idCateProducto}
              onClick={() => setCategoriaActiva(cat.nombre)}
              className={`category-filter ${categoriaActiva === cat.nombre ? 'active' : ''}`}
              style={{ fontSize: '0.85rem', padding: '0.5rem 1.1rem' }}
            >
              {cat.nombre}
            </button>
          ))}
        </div>

        {/* Grid de productos */}
        <div className="row g-3 mb-4">
          {productosFiltrados.length === 0 ? (
            <div className="col-12 text-center py-4">
              <i className="bi bi-inbox fs-2 text-muted"></i>
              <p className="text-muted mt-2" style={{ fontSize: '0.9rem' }}>No hay productos disponibles</p>
            </div>
          ) : (
            productosFiltrados.map((prod) => (
              <div key={prod.idProducto} className="col-6 col-md-4 col-lg-3">
                <div className="card product-card h-100">
                  {/* Imagen */}
                  <div className="position-relative overflow-hidden">
                    <img
                      src={obtenerImagenProducto(prod.imagenes)}
                      alt={prod.nombre}
                      className="card-img-top"
                      style={{ height: '150px', objectFit: 'cover' }}
                    />
                  </div>

                  {/* Contenido */}
                  <div className="card-body" style={{ padding: '0.6rem' }}>
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="product-category" style={{ fontSize: '0.7rem' }}>
                        {prod.categoriaNombre}
                      </span>
                      <div className="text-warning" style={{ fontSize: '0.7rem' }}>
                        <i className="bi bi-star-fill"></i>
                        <i className="bi bi-star-fill"></i>
                        <i className="bi bi-star-fill"></i>
                        <i className="bi bi-star-fill"></i>
                        <i className="bi bi-star-half"></i>
                      </div>
                    </div>

                    <h5 className="card-title fw-bold" style={{ fontSize: '1rem', marginBottom: '0.4rem' }}>{prod.nombre}</h5>
                    <p className="card-text text-muted small" style={{ fontSize: '0.75rem', marginBottom: '0.6rem' }}>{prod.descripcion}</p>

                    <div className="d-flex justify-content-between align-items-center mt-2">
                      <h4 className="mb-0 fw-bold" style={{ color: '#d97706', fontSize: '1.3rem' }}>
                        S/ {prod.precio.toFixed(2)}
                      </h4>
                      <button 
                        onClick={() => handleAgregarAlCarrito(prod)}
                        className={`btn ${productoAgregado === prod.idProducto ? 'btn-success' : 'btn-primary-custom'}`}
                        style={{ fontSize: '0.75rem', padding: '0.4rem 0.8rem' }}
                      >
                        <i className={`bi ${productoAgregado === prod.idProducto ? 'bi-check-lg' : 'bi-cart-plus'} me-1`}></i>
                        {productoAgregado === prod.idProducto ? '¡Agregado!' : 'Agregar'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* CTA */}
        <div className="text-center">
          <button className="btn btn-dark btn-lg px-4 rounded-pill" style={{ fontSize: '1rem', padding: '0.7rem 2rem' }}>
            Ver Menú Completo
            <i className="bi bi-arrow-right ms-2"></i>
          </button>
        </div>
      </div>
    </section>
  );
}