"use client";

import Link from "next/link";

export default function Footer() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="footer" style={{ 
      background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
      color: '#e5e7eb'
    }}>
      <div className="container">
        <div className="row g-4 py-5">
          {/* Columna 1 - Sobre nosotros */}
          <div className="col-12 col-md-6 col-lg-3">
            <div className="d-flex align-items-center gap-2 mb-3">
              <i className="bi bi-cup-hot-fill" style={{ 
                fontSize: '1.8rem',
                background: 'linear-gradient(135deg, #dc3545 0%, #ff6b35 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}></i>
              <span className="fs-5 fw-bold" style={{ color: '#f3f4f6' }}>SAN ROQUE</span>
            </div>
            <p className="mb-3" style={{ color: '#9ca3af', fontSize: '0.85rem' }}>
              La mejor cafetería y pastelería artesanal de Andahuaylas.
            </p>
            <div className="d-flex gap-2">
              <a href="#" className="social-icon" style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #dc3545 0%, #ff6b35 100%)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textDecoration: 'none',
                transition: 'transform 0.3s ease',
                fontSize: '1rem'
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <i className="bi bi-facebook"></i>
              </a>
              <a href="#" className="social-icon" style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #dc3545 0%, #ff6b35 100%)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textDecoration: 'none',
                transition: 'transform 0.3s ease',
                fontSize: '1rem'
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <i className="bi bi-instagram"></i>
              </a>
              <a href="#" className="social-icon" style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #dc3545 0%, #ff6b35 100%)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textDecoration: 'none',
                transition: 'transform 0.3s ease',
                fontSize: '1rem'
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <i className="bi bi-whatsapp"></i>
              </a>
              <a href="#" className="social-icon" style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #dc3545 0%, #ff6b35 100%)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textDecoration: 'none',
                transition: 'transform 0.3s ease',
                fontSize: '1rem'
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <i className="bi bi-tiktok"></i>
              </a>
            </div>
          </div>

          {/* Columna 2 - Enlaces rápidos */}
          <div className="col-12 col-md-6 col-lg-3">
            <h5 className="fw-bold mb-3" style={{ color: '#f3f4f6', fontSize: '1rem' }}>Enlaces Rápidos</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <button
                  onClick={() => scrollToSection("inicio")}
                  className="btn btn-link p-0 text-start"
                  style={{ 
                    color: '#9ca3af',
                    textDecoration: 'none',
                    fontSize: '0.85rem',
                    transition: 'color 0.3s ease'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.color = '#ff6b35'}
                  onMouseOut={(e) => e.currentTarget.style.color = '#9ca3af'}
                >
                  Inicio
                </button>
              </li>
              <li className="mb-2">
                <button
                  onClick={() => scrollToSection("menu")}
                  className="btn btn-link p-0 text-start"
                  style={{ 
                    color: '#9ca3af',
                    textDecoration: 'none',
                    fontSize: '0.85rem',
                    transition: 'color 0.3s ease'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.color = '#ff6b35'}
                  onMouseOut={(e) => e.currentTarget.style.color = '#9ca3af'}
                >
                  Menú
                </button>
              </li>
              <li className="mb-2">
                <button
                  onClick={() => scrollToSection("nosotros")}
                  className="btn btn-link p-0 text-start"
                  style={{ 
                    color: '#9ca3af',
                    textDecoration: 'none',
                    fontSize: '0.85rem',
                    transition: 'color 0.3s ease'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.color = '#ff6b35'}
                  onMouseOut={(e) => e.currentTarget.style.color = '#9ca3af'}
                >
                  Nosotros
                </button>
              </li>
              <li className="mb-2">
                <button
                  onClick={() => scrollToSection("contacto")}
                  className="btn btn-link p-0 text-start"
                  style={{ 
                    color: '#9ca3af',
                    textDecoration: 'none',
                    fontSize: '0.85rem',
                    transition: 'color 0.3s ease'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.color = '#ff6b35'}
                  onMouseOut={(e) => e.currentTarget.style.color = '#9ca3af'}
                >
                  Contacto
                </button>
              </li>
              <li className="mb-2">
                <Link 
                  href="/login" 
                  className="text-decoration-none" 
                  style={{ 
                    color: '#9ca3af',
                    fontSize: '0.85rem',
                    transition: 'color 0.3s ease'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.color = '#ff6b35'}
                  onMouseOut={(e) => e.currentTarget.style.color = '#9ca3af'}
                >
                  Iniciar Sesión
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 3 - Contacto */}
          <div className="col-12 col-md-6 col-lg-3">
            <h5 className="fw-bold mb-3" style={{ color: '#f3f4f6', fontSize: '1rem' }}>Contacto</h5>
            <ul className="list-unstyled">
              <li className="mb-3 d-flex gap-2">
                <i className="bi bi-geo-alt" style={{ 
                  color: '#ff6b35',
                  fontSize: '1rem',
                  marginTop: '2px'
                }}></i>
                <span style={{ color: '#9ca3af', fontSize: '0.85rem' }}>
                  Av. Ramos Castillo 119<br />
                  Andahuaylas, Apurímac 03701
                </span>
              </li>
              <li className="mb-3 d-flex gap-2">
                <i className="bi bi-telephone" style={{ 
                  color: '#ff6b35',
                  fontSize: '1rem',
                  marginTop: '2px'
                }}></i>
                <a 
                  href="tel:+51967252588" 
                  className="text-decoration-none" 
                  style={{ 
                    color: '#9ca3af',
                    fontSize: '0.85rem',
                    transition: 'color 0.3s ease'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.color = '#ff6b35'}
                  onMouseOut={(e) => e.currentTarget.style.color = '#9ca3af'}
                >
                  +51 967 252 588
                </a>
              </li>
              <li className="mb-3 d-flex gap-2">
                <i className="bi bi-envelope" style={{ 
                  color: '#ff6b35',
                  fontSize: '1rem',
                  marginTop: '2px'
                }}></i>
                <a 
                  href="mailto:contacto@sanroque.pe" 
                  className="text-decoration-none" 
                  style={{ 
                    color: '#9ca3af',
                    fontSize: '0.85rem',
                    transition: 'color 0.3s ease'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.color = '#ff6b35'}
                  onMouseOut={(e) => e.currentTarget.style.color = '#9ca3af'}
                >
                  contacto@sanroque.pe
                </a>
              </li>
            </ul>
          </div>

          {/* Columna 4 - Horarios y Newsletter */}
          <div className="col-12 col-md-6 col-lg-3">
            <h5 className="fw-bold mb-3" style={{ color: '#f3f4f6', fontSize: '1rem' }}>Horarios</h5>
            <ul className="list-unstyled mb-4">
              <li className="mb-2 d-flex justify-content-between" style={{ fontSize: '0.85rem' }}>
                <span style={{ color: '#9ca3af' }}>Lun - Vie:</span>
                <span style={{ color: '#ff6b35', fontWeight: '600' }}>7AM - 10PM</span>
              </li>
              <li className="mb-2 d-flex justify-content-between" style={{ fontSize: '0.85rem' }}>
                <span style={{ color: '#9ca3af' }}>Sábados:</span>
                <span style={{ color: '#ff6b35', fontWeight: '600' }}>8AM - 11PM</span>
              </li>
              <li className="mb-2 d-flex justify-content-between" style={{ fontSize: '0.85rem' }}>
                <span style={{ color: '#9ca3af' }}>Domingos:</span>
                <span style={{ color: '#ff6b35', fontWeight: '600' }}>8AM - 9PM</span>
              </li>
            </ul>

            {/* Newsletter */}
            <h6 className="fw-bold mb-2" style={{ color: '#f3f4f6', fontSize: '0.9rem' }}>Newsletter</h6>
            <p className="small mb-2" style={{ color: '#9ca3af', fontSize: '0.8rem' }}>
              Suscríbete para recibir promociones
            </p>
            <div className="input-group">
              <input
                type="email"
                className="form-control"
                placeholder="Tu email"
                style={{ 
                  backgroundColor: '#374151', 
                  border: '1px solid #4b5563', 
                  color: '#e5e7eb',
                  fontSize: '0.85rem'
                }}
              />
              <button 
                className="btn" 
                type="button"
                style={{
                  background: 'linear-gradient(135deg, #dc3545 0%, #ff6b35 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '0.5rem 1rem'
                }}
              >
                <i className="bi bi-send"></i>
              </button>
            </div>
          </div>
        </div>

        {/* Barra inferior */}
        <div className="pt-4 pb-3" style={{ borderTop: '1px solid #374151' }}>
          <div className="row align-items-center">
            <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
              <p className="mb-0" style={{ color: '#6b7280', fontSize: '0.8rem' }}>
                © 2026 San Roque Cafetería y Pastelería. Todos los derechos reservados.
              </p>
            </div>
            <div className="col-md-6 text-center text-md-end">
              <a 
                href="#" 
                className="text-decoration-none me-3" 
                style={{ 
                  color: '#6b7280',
                  fontSize: '0.8rem',
                  transition: 'color 0.3s ease'
                }}
                onMouseOver={(e) => e.currentTarget.style.color = '#ff6b35'}
                onMouseOut={(e) => e.currentTarget.style.color = '#6b7280'}
              >
                Términos y Condiciones
              </a>
              <a 
                href="#" 
                className="text-decoration-none" 
                style={{ 
                  color: '#6b7280',
                  fontSize: '0.8rem',
                  transition: 'color 0.3s ease'
                }}
                onMouseOver={(e) => e.currentTarget.style.color = '#ff6b35'}
                onMouseOut={(e) => e.currentTarget.style.color = '#6b7280'}
              >
                Política de Privacidad
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}