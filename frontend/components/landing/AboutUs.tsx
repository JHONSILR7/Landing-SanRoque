"use client";

export default function AboutUs() {
  const valores = [
    {
      icon: "bi-basket3",
      title: "Productos Frescos",
      description: "Ingredientes seleccionados diariamente",
    },
    {
      icon: "bi-cup-hot",
      title: "Café de Altura",
      description: "Los mejores granos de café peruano",
    },
    {
      icon: "bi-cake2",
      title: "Repostería Artesanal",
      description: "Recetas tradicionales hechas con amor",
    },
    {
      icon: "bi-people",
      title: "Atención Personalizada",
      description: "Servicio cálido y familiar",
    },
  ];

  return (
    <section id="nosotros" className="py-4" style={{ 
      background: 'linear-gradient(to bottom, white, #fef3e2)' 
    }}>
      <div className="container">
        <div className="row align-items-center g-4">
          {/* Lado izquierdo - Imágenes */}
          <div className="col-lg-6">
            <div className="position-relative">
              <div className="row g-3">
                {/* Imagen principal */}
                <div className="col-12">
                  <div className="about-image">
                    <img
                      src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&h=500&fit=crop"
                      alt="Cafetería San Roque"
                      className="img-fluid rounded-3 shadow"
                      style={{ 
                        height: '280px', 
                        width: '100%', 
                        objectFit: 'cover',
                        transition: 'transform 0.3s ease'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                      onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    />
                  </div>
                </div>
                {/* Dos imágenes secundarias */}
                <div className="col-6">
                  <div className="about-image">
                    <img
                      src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop"
                      alt="Barista"
                      className="img-fluid rounded-3 shadow"
                      style={{ 
                        height: '170px', 
                        width: '100%', 
                        objectFit: 'cover',
                        transition: 'transform 0.3s ease'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                      onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    />
                  </div>
                </div>
                <div className="col-6">
                  <div className="about-image">
                    <img
                      src="https://images.unsplash.com/photo-1517433670267-08bbd4be890f?w=400&h=300&fit=crop"
                      alt="Pasteles"
                      className="img-fluid rounded-3 shadow"
                      style={{ 
                        height: '170px', 
                        width: '100%', 
                        objectFit: 'cover',
                        transition: 'transform 0.3s ease'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                      onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    />
                  </div>
                </div>
              </div>

              {/* Badge decorativo */}
              <div 
                className="position-absolute text-center bg-white rounded-3 shadow-lg p-3"
                style={{ 
                  bottom: '-1rem', 
                  right: '-1rem',
                  border: '3px solid #ff6b35',
                  zIndex: 10
                }}
              >
                <h2 className="fw-bold mb-0" style={{
                  background: 'linear-gradient(135deg, #dc3545 0%, #ff6b35 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  fontSize: '2rem'
                }}>20+</h2>
                <p className="mb-0" style={{ fontSize: '0.75rem', fontWeight: '600' }}>Años de Tradición</p>
              </div>
            </div>
          </div>

          {/* Lado derecho - Contenido */}
          <div className="col-lg-6">
            <span className="section-badge" style={{ fontSize: '0.7rem', padding: '0.35rem 0.7rem' }}>Nuestra Historia</span>
            <h2 className="section-title" style={{ fontSize: '1.5rem', marginTop: '0.6rem', marginBottom: '0.6rem' }}>Endulzando Vidas Desde 2003</h2>

            <p className="text-muted mb-3" style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
              San Roque nació como una pequeña cafetería familiar con la misión
              de endulzar la vida de nuestros clientes.
            </p>

            <p className="text-muted mb-4" style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
              Con más de <strong style={{ 
                color: '#dc3545',
                fontWeight: '700'
              }}>20 años de experiencia</strong>, 
              nos hemos convertido en la cafetería y pastelería favorita de 
              Andahuaylas. Cada producto es elaborado con amor, usando recetas 
              tradicionales y los mejores ingredientes.
            </p>

            {/* Grid de valores */}
            <div className="row g-3 mb-4">
              {valores.map((valor, index) => (
                <div key={index} className="col-6">
                  <div 
                    className="d-flex gap-2 p-3 rounded-3 h-100" 
                    style={{ 
                      background: 'linear-gradient(135deg, #fef3e2 0%, #fff5f0 100%)',
                      border: '1px solid #ffe4d6',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = 'translateY(-3px)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(220, 53, 69, 0.15)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <div 
                      className="flex-shrink-0"
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '10px',
                        background: 'linear-gradient(135deg, #dc3545 0%, #ff6b35 100%)',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <i className={`bi ${valor.icon}`} style={{ fontSize: '1.1rem' }}></i>
                    </div>
                    <div>
                      <h6 className="fw-bold mb-1" style={{ fontSize: '0.85rem' }}>{valor.title}</h6>
                      <p className="text-muted mb-0" style={{ fontSize: '0.75rem' }}>{valor.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <button 
              onClick={() => {
                const element = document.getElementById("contacto");
                if (element) element.scrollIntoView({ behavior: "smooth" });
              }}
              className="btn"
              style={{
                background: 'linear-gradient(135deg, #dc3545 0%, #ff6b35 100%)',
                color: 'white',
                border: 'none',
                fontSize: '0.9rem',
                padding: '0.6rem 1.5rem',
                borderRadius: '50px',
                fontWeight: 'bold',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 8px 30px rgba(220, 53, 69, 0.4)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              Conoce Más
              <i className="bi bi-arrow-right ms-2"></i>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}