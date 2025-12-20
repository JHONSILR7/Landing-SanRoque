"use client";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!containerRef.current) return;

    let renderer: THREE.WebGLRenderer;
    let animationId: number;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      50,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 1.5, 4);

    renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true 
    });
    renderer.setSize(
      containerRef.current.clientWidth,
      containerRef.current.clientHeight
    );
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 0);
    containerRef.current.appendChild(renderer.domElement);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 1.5;
    controls.maxDistance = 8;
    controls.maxPolarAngle = Math.PI / 1.8;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 2;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 2);
    mainLight.position.set(5, 8, 5);
    scene.add(mainLight);

    const fillLight = new THREE.DirectionalLight(0xffe0e0, 1);
    fillLight.position.set(-5, 3, -3);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffd700, 0.8);
    rimLight.position.set(0, 5, -5);
    scene.add(rimLight);

    const backLight = new THREE.DirectionalLight(0xffffff, 1);
    backLight.position.set(0, -5, -5);
    scene.add(backLight);

    // Load 3D Model
    const loader = new GLTFLoader();
    loader.load(
      "/torta_de_chocolate_com_morango.glb",
      (gltf) => {
        const model = gltf.scene;
        
        model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        model.position.sub(center);

        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 3.5 / maxDim;
        model.scale.multiplyScalar(scale);

        model.position.y = 0.2;

        scene.add(model);
        setIsLoaded(true);
        console.log("Modelo cargado exitosamente", { size, maxDim, scale });
      },
      (progress) => {
        console.log("Cargando:", (progress.loaded / progress.total * 100) + '%');
      },
      (error) => {
        console.error("Error loading model:", error);
        setError("Error al cargar el modelo. Verifica que el archivo esté en /public");
      }
    );

    // Animation
    function animate() {
      animationId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    }
    animate();

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return;
      camera.aspect =
        containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(
        containerRef.current.clientWidth,
        containerRef.current.clientHeight
      );
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationId);
      renderer.dispose();
      controls.dispose();
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  const scrollToMenu = () => {
    const element = document.getElementById("menu");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="position-relative overflow-hidden" style={{
      background: 'linear-gradient(135deg, #fef3e2 0%, #fce4ec 50%, #f3e5f5 100%)',
      minHeight: 'calc(108vh - 80px)',
      paddingTop: '1.8rem'
    }}>
      {/* Animated background blobs */}
      <div className="position-absolute w-100 h-100" style={{ opacity: 0.3, pointerEvents: 'none' }}>
        <div className="position-absolute rounded-circle" style={{
          top: '5rem',
          left: '2.5rem',
          width: '18rem',
          height: '18rem',
          background: '#ffc0cb',
          filter: 'blur(60px)',
          animation: 'blob 7s infinite'
        }}></div>
        <div className="position-absolute rounded-circle" style={{
          top: '10rem',
          right: '2.5rem',
          width: '18rem',
          height: '18rem',
          background: '#ffd700',
          filter: 'blur(60px)',
          animation: 'blob 7s infinite 2s'
        }}></div>
        <div className="position-absolute rounded-circle" style={{
          bottom: '5rem',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '18rem',
          height: '18rem',
          background: '#ffb347',
          filter: 'blur(60px)',
          animation: 'blob 7s infinite 4s'
        }}></div>
      </div>

      <div className="container position-relative py-3">
        <div className="row align-items-center g-3">
          {/* Contenido izquierdo */}
          <div className="col-lg-6">
            <h1 className="display-3 fw-bold mb-3" style={{ lineHeight: 1.2 }}>
              <span style={{
                background: 'linear-gradient(135deg, #dc3545 0%, #ff6b35 50%, #ffa500 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                El Sabor Artesanal
              </span>
              <br />
              <span className="text-dark">que Enamora</span>
            </h1>

            <p className="lead fs-5 text-secondary mb-4" style={{ maxWidth: '550px' }}>
              Disfruta de nuestros pasteles recién horneados y el mejor café de altura. 
              <span className="fw-bold text-danger"> Más de 20 años endulzando tu vida.</span>
            </p>

            <div className="d-flex flex-wrap gap-3 mb-4">
              <button
                onClick={scrollToMenu}
                className="btn btn-lg px-4 py-2 fw-bold rounded-pill shadow"
                style={{
                  background: 'linear-gradient(135deg, #dc3545 0%, #ff6b35 100%)',
                  color: 'white',
                  border: 'none',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 8px 30px rgba(220, 53, 69, 0.4)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
                }}
              >
                Ver Menú
              </button>
              <button
                className="btn btn-lg btn-light px-4 py-2 fw-bold rounded-pill shadow"
                style={{
                  border: '2px solid #ffc0cb',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.borderColor = '#ff69b4';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.borderColor = '#ffc0cb';
                }}
              >
                📞 Llamar Ahora
              </button>
            </div>

            {/* Estadísticas */}
            <div className="row g-3 pt-3">
              <div className="col-4 text-center">
                <div className="display-5 fw-bold" style={{
                  background: 'linear-gradient(135deg, #dc3545 0%, #ff6b35 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  20+
                </div>
                <div className="small text-secondary mt-1">Años de Experiencia</div>
              </div>
              <div className="col-4 text-center">
                <div className="display-5 fw-bold" style={{
                  background: 'linear-gradient(135deg, #ff6b35 0%, #ffa500 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  50+
                </div>
                <div className="small text-secondary mt-1">Productos Únicos</div>
              </div>
              <div className="col-4 text-center">
                <div className="display-5 fw-bold" style={{
                  background: 'linear-gradient(135deg, #ffa500 0%, #dc3545 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  100%
                </div>
                <div className="small text-secondary mt-1">Artesanal</div>
              </div>
            </div>
          </div>

          {/* 3D Model Container */}
          <div className="col-lg-6">
            <div className="position-relative" style={{ height: '405px' }}>
              <div
                ref={containerRef}
                style={{
                  width: '100%',
                  height: '100%',
                  overflow: 'visible'
                }}
              >
                {!isLoaded && !error && (
                  <div className="position-absolute top-50 start-50 translate-middle text-center">
                    <div className="spinner-border text-danger mb-3" role="status" style={{ width: '4rem', height: '4rem' }}>
                      <span className="visually-hidden">Cargando...</span>
                    </div>
                    <p className="text-danger fw-bold">Cargando tu delicia...</p>
                  </div>
                )}
                {error && (
                  <div className="position-absolute top-50 start-50 translate-middle text-center">
                    <div className="alert alert-danger">{error}</div>
                  </div>
                )}
              </div>

              {/* Badge flotante */}
              <div className="position-absolute bg-white rounded-3 shadow p-3" style={{
                bottom: '0',
                right: '0',
                border: '2px solid #ffc0cb',
                transform: 'rotate(3deg)',
                transition: 'transform 0.3s ease',
                zIndex: 10
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'rotate(0deg)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'rotate(3deg)'}
              >
                <div className="text-center">
                  <div className="fs-4 fw-bold text-danger">4.9/5</div>
                  <div className="fs-6 text-warning">★★★★★</div>
                  <div className="small text-secondary">+500 reseñas</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Indicador de scroll */}
      <div className="position-absolute start-50 translate-middle-x" style={{ 
        bottom: '1rem',
        animation: 'bounce 2s infinite' 
      }}>
        <div className="rounded-pill d-flex align-items-start justify-content-center p-2" style={{
          width: '1.5rem',
          height: '2.5rem',
          border: '2px solid #dc3545'
        }}>
          <div className="rounded-pill" style={{
            width: '0.4rem',
            height: '0.6rem',
            background: '#dc3545',
            animation: 'pulse 1.5s infinite'
          }}></div>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0) translateX(-50%); }
          50% { transform: translateY(-20px) translateX(-50%); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </section>
  );
}