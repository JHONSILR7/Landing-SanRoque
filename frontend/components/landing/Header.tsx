"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { estaAutenticado, obtenerUsuario, cerrarSesion } from "@/lib/auth";
import type { ClienteUsu } from "@/lib/auth";

export default function Header() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [usuario, setUsuario] = useState<ClienteUsu | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("inicio");
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    if (estaAutenticado()) {
      setUsuario(obtenerUsuario());
    }

    const handleScroll = () => {
      // Header scroll effect
      setScrolled(window.scrollY > 50);

      // Calculate scroll progress
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (window.scrollY / windowHeight) * 100;
      setScrollProgress(scrolled);

      // Detect active section
      const sections = ["inicio", "menu", "nosotros", "contacto"];
      let currentSection = "inicio";

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            currentSection = section;
            break;
          }
        }
      }

      setActiveSection(currentSection);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial call
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setMenuAbierto(false);
    }
  };

  return (
    <>
      <header 
        className={`position-fixed top-0 w-100 transition-all`}
        style={{
          zIndex: 1000,
          backdropFilter: scrolled ? 'blur(10px)' : 'none',
          background: scrolled 
            ? 'rgba(255, 255, 255, 0.95)' 
            : 'transparent',
          boxShadow: scrolled 
            ? '0 2px 20px rgba(0, 0, 0, 0.1)' 
            : 'none',
          transition: 'all 0.3s ease'
        }}
      >
        {/* Progress bar */}
        <div 
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            height: '3px',
            width: `${scrollProgress}%`,
            background: 'linear-gradient(90deg, #dc3545 0%, #ff6b35 50%, #ffa500 100%)',
            transition: 'width 0.1s ease',
            zIndex: 1001
          }}
        />

        <nav className="navbar navbar-expand-lg navbar-light py-3">
          <div className="container">
            {/* Logo */}
            <Link 
              href="/" 
              className="navbar-brand d-flex align-items-center"
              style={{
                fontWeight: '800',
                fontSize: '1.4rem',
                color: scrolled ? '#1f2937' : '#1f2937',
                transition: 'all 0.3s ease'
              }}
            >
              <i 
                className="bi bi-cup-hot-fill me-2" 
                style={{
                  fontSize: '1.8rem',
                  background: 'linear-gradient(135deg, #dc3545 0%, #ff6b35 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              ></i>
              <span>SAN ROQUE</span>
            </Link>

            {/* Botón toggler para móvil */}
            <button
              className="navbar-toggler border-0 shadow-none"
              type="button"
              onClick={() => setMenuAbierto(!menuAbierto)}
              aria-controls="navbarNav"
              aria-expanded={menuAbierto}
              aria-label="Toggle navigation"
              style={{
                padding: '0.5rem',
                fontSize: '1.5rem'
              }}
            >
              <i className={`bi ${menuAbierto ? 'bi-x' : 'bi-list'} fs-3`}></i>
            </button>

            {/* Menú */}
            <div 
              className={`collapse navbar-collapse ${menuAbierto ? 'show' : ''}`} 
              id="navbarNav"
            >
              <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-lg-center gap-lg-1">
                {[
                  { id: "inicio", label: "Inicio" },
                  { id: "menu", label: "Menú" },
                  { id: "nosotros", label: "Nosotros" },
                  { id: "contacto", label: "Contacto" }
                ].map((item) => (
                  <li className="nav-item" key={item.id}>
                    <button 
                      onClick={() => scrollToSection(item.id)} 
                      className="nav-link btn btn-link text-decoration-none position-relative px-3 py-2"
                      style={{
                        color: activeSection === item.id 
                          ? '#dc3545' 
                          : scrolled ? '#374151' : '#1f2937',
                        fontWeight: activeSection === item.id ? '600' : '500',
                        fontSize: '0.95rem',
                        transition: 'all 0.3s ease',
                        background: 'transparent',
                        border: 'none'
                      }}
                      onMouseOver={(e) => {
                        if (activeSection !== item.id) {
                          e.currentTarget.style.color = '#ff6b35';
                        }
                      }}
                      onMouseOut={(e) => {
                        if (activeSection !== item.id) {
                          e.currentTarget.style.color = scrolled ? '#374151' : '#1f2937';
                        }
                      }}
                    >
                      {item.label}
                      {activeSection === item.id && (
                        <span 
                          style={{
                            position: 'absolute',
                            bottom: '0',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: '70%',
                            height: '3px',
                            background: 'linear-gradient(90deg, #dc3545 0%, #ff6b35 100%)',
                            borderRadius: '2px'
                          }}
                        />
                      )}
                    </button>
                  </li>
                ))}

                {usuario ? (
                  <li className="nav-item dropdown ms-lg-2 mt-3 mt-lg-0">
                    <button
                      className="btn btn-light dropdown-toggle d-flex align-items-center w-100 w-lg-auto justify-content-center shadow-sm"
                      type="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                      style={{
                        borderRadius: '50px',
                        padding: '0.4rem 1rem',
                        fontSize: '0.9rem',
                        fontWeight: '500',
                        border: '1px solid #e5e7eb'
                      }}
                    >
                      {usuario.foto && (
                        <img
                          src={usuario.foto}
                          alt={usuario.nombre}
                          className="rounded-circle me-2"
                          width="28"
                          height="28"
                        />
                      )}
                      <span>{usuario.nombre}</span>
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end shadow-lg border-0 mt-2" style={{ borderRadius: '12px' }}>
                      <li>
                        <Link href="/perfil" className="dropdown-item py-2" style={{ fontSize: '0.9rem' }}>
                          <i className="bi bi-person me-2"></i>
                          Mi Perfil
                        </Link>
                      </li>
                      <li>
                        <Link href="/pedidos" className="dropdown-item py-2" style={{ fontSize: '0.9rem' }}>
                          <i className="bi bi-bag-check me-2"></i>
                          Mis Pedidos
                        </Link>
                      </li>
                      <li><hr className="dropdown-divider" /></li>
                      <li>
                        <button 
                          onClick={() => {
                            cerrarSesion();
                            setMenuAbierto(false);
                          }} 
                          className="dropdown-item text-danger py-2"
                          style={{ fontSize: '0.9rem' }}
                        >
                          <i className="bi bi-box-arrow-right me-2"></i>
                          Cerrar Sesión
                        </button>
                      </li>
                    </ul>
                  </li>
                ) : (
                  <li className="nav-item ms-lg-2 mt-3 mt-lg-0">
                    <Link 
                      href="/login" 
                      className="btn w-100 w-lg-auto shadow-sm"
                      onClick={() => setMenuAbierto(false)}
                      style={{
                        background: 'linear-gradient(135deg, #dc3545 0%, #ff6b35 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50px',
                        padding: '0.5rem 1.5rem',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.transform = 'scale(1.05)';
                        e.currentTarget.style.boxShadow = '0 8px 20px rgba(220, 53, 69, 0.3)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
                      }}
                    >
                      Iniciar Sesión
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </nav>
      </header>

      {/* Spacer to prevent content from hiding behind fixed header */}
      <div style={{ height: '80px' }} />
    </>
  );
}