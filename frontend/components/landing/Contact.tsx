"use client";

import { useState } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    mensaje: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Formulario enviado:", formData);
    alert("¡Gracias por contactarnos! Te responderemos pronto.");
    setFormData({ nombre: "", email: "", telefono: "", mensaje: "" });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <section id="contacto" className="py-5" style={{ 
      background: 'linear-gradient(135deg, #fef3e2 0%, #fce4ec 50%, #f3e5f5 100%)' 
    }}>
      <div className="container">
        {/* Encabezado */}
        <div className="text-center mb-4">
          <span className="section-badge" style={{ fontSize: '0.7rem', padding: '0.35rem 0.7rem' }}>Contáctanos</span>
          <h2 className="section-title" style={{ fontSize: '1.5rem', marginTop: '0.6rem', marginBottom: '0.6rem' }}>¿Tienes alguna Pregunta?</h2>
          <p className="section-subtitle" style={{ fontSize: '0.85rem' }}>
            Estamos aquí para ayudarte. Envíanos un mensaje o visítanos.
          </p>
        </div>

        <div className="row g-4">
          {/* Información de contacto */}
          <div className="col-lg-5">
            <div className="contact-info-card h-100">
              <h4 className="fw-bold mb-3" style={{ fontSize: '1.1rem' }}>Información de Contacto</h4>

              {/* Dirección */}
              <div className="d-flex gap-3 mb-3">
                <div className="contact-icon" style={{ 
                  background: 'linear-gradient(135deg, #dc3545 0%, #ff6b35 100%)',
                  color: 'white',
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <i className="bi bi-geo-alt" style={{ fontSize: '1.1rem' }}></i>
                </div>
                <div>
                  <h6 className="fw-bold mb-1" style={{ fontSize: '0.85rem' }}>Dirección</h6>
                  <p className="text-muted mb-0" style={{ fontSize: '0.75rem' }}>
                    Av. Ramos Castillo 119<br />
                    Andahuaylas, Apurímac 03701
                  </p>
                </div>
              </div>

              {/* Teléfono */}
              <div className="d-flex gap-3 mb-3">
                <div className="contact-icon" style={{ 
                  background: 'linear-gradient(135deg, #dc3545 0%, #ff6b35 100%)',
                  color: 'white',
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <i className="bi bi-telephone" style={{ fontSize: '1.1rem' }}></i>
                </div>
                <div>
                  <h6 className="fw-bold mb-1" style={{ fontSize: '0.85rem' }}>Teléfono</h6>
                  <a href="tel:+51967252588" className="text-muted text-decoration-none" style={{ fontSize: '0.75rem' }}>
                    +51 967 252 588
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="d-flex gap-3 mb-3">
                <div className="contact-icon" style={{ 
                  background: 'linear-gradient(135deg, #dc3545 0%, #ff6b35 100%)',
                  color: 'white',
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <i className="bi bi-envelope" style={{ fontSize: '1.1rem' }}></i>
                </div>
                <div>
                  <h6 className="fw-bold mb-1" style={{ fontSize: '0.85rem' }}>Email</h6>
                  <a href="mailto:contacto@sanroque.pe" className="text-muted text-decoration-none" style={{ fontSize: '0.75rem' }}>
                    contacto@sanroque.pe
                  </a>
                </div>
              </div>

              {/* Horarios */}
              <div className="d-flex gap-3 mb-3">
                <div className="contact-icon" style={{ 
                  background: 'linear-gradient(135deg, #dc3545 0%, #ff6b35 100%)',
                  color: 'white',
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <i className="bi bi-clock" style={{ fontSize: '1.1rem' }}></i>
                </div>
                <div>
                  <h6 className="fw-bold mb-1" style={{ fontSize: '0.85rem' }}>Horarios</h6>
                  <p className="text-muted mb-1" style={{ fontSize: '0.75rem' }}>Lunes - Viernes: 7:00 AM - 10:00 PM</p>
                  <p className="text-muted mb-1" style={{ fontSize: '0.75rem' }}>Sábados: 8:00 AM - 11:00 PM</p>
                  <p className="text-muted mb-0" style={{ fontSize: '0.75rem' }}>Domingos: 8:00 AM - 9:00 PM</p>
                </div>
              </div>

              {/* Redes sociales */}
              <div className="border-top pt-3 mt-3">
                <h6 className="fw-bold mb-3" style={{ fontSize: '0.85rem' }}>Síguenos</h6>
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
            </div>
          </div>

          {/* Formulario */}
          <div className="col-lg-7">
            <div className="bg-white rounded-3 p-3 p-md-4 shadow-sm h-100">
              <h4 className="fw-bold mb-3" style={{ fontSize: '1.1rem' }}>Envíanos un Mensaje</h4>

              <div>
                <div className="mb-3">
                  <label htmlFor="nombre" className="d-block fw-semibold mb-2" style={{ fontSize: '0.8rem' }}>
                    Nombre Completo
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                    placeholder="Tu nombre"
                    style={{ fontSize: '0.8rem', padding: '0.6rem 0.9rem' }}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="email" className="d-block fw-semibold mb-2" style={{ fontSize: '0.8rem' }}>
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="tu@email.com"
                    style={{ fontSize: '0.8rem', padding: '0.6rem 0.9rem' }}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="telefono" className="d-block fw-semibold mb-2" style={{ fontSize: '0.8rem' }}>
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    className="form-control"
                    id="telefono"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    placeholder="+51 999 999 999"
                    style={{ fontSize: '0.8rem', padding: '0.6rem 0.9rem' }}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="mensaje" className="d-block fw-semibold mb-2" style={{ fontSize: '0.8rem' }}>
                    Mensaje
                  </label>
                  <textarea
                    className="form-control"
                    id="mensaje"
                    name="mensaje"
                    value={formData.mensaje}
                    onChange={handleChange}
                    required
                    rows={4}
                    placeholder="Cuéntanos cómo podemos ayudarte..."
                    style={{ fontSize: '0.8rem', padding: '0.6rem 0.9rem' }}
                  ></textarea>
                </div>

                <button 
                  type="button"
                  onClick={handleSubmit}
                  className="btn w-100" 
                  style={{
                    background: 'linear-gradient(135deg, #dc3545 0%, #ff6b35 100%)',
                    color: 'white',
                    border: 'none',
                    fontSize: '0.9rem',
                    padding: '0.6rem 1.2rem',
                    borderRadius: '50px',
                    fontWeight: 'bold',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'scale(1.02)';
                    e.currentTarget.style.boxShadow = '0 8px 30px rgba(220, 53, 69, 0.4)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  Enviar Mensaje
                  <i className="bi bi-send ms-2"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mapa - Fuera del card */}
        <div className="mt-4">
          <div className="text-center mb-3">
            <h4 className="fw-bold" style={{ fontSize: '1.1rem' }}>Encuéntranos</h4>
            <p className="text-muted" style={{ fontSize: '0.8rem' }}>Av. Ramos Castillo 119, Andahuaylas, Apurímac</p>
          </div>
          <div className="rounded-3 overflow-hidden shadow-lg" style={{ height: '300px' }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3876.8537896088445!2d-73.38726!3d-13.65682!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x916dfdbe15cf0f71%3A0x4e5a8d5c4c5c5c5c!2sAv.%20Ramos%20Castilla%20119%2C%20Andahuaylas%2003701!5e0!3m2!1ses!2spe!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
}