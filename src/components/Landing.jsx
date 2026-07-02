import { useEffect, useState } from 'react';
import './Landing.css';

const DEMO_URL = 'https://church-generator-api-production.up.railway.app/api/iglesias/web/46';

function Landing({ onComenzar }) {
  const WHATSAPP = '+56967236881';
  const whatsappLink = `https://wa.me/${WHATSAPP.replace(/[^0-9]/g, '')}`;
  const [mostrarDemo, setMostrarDemo] = useState(false);
  const [faqAbierta, setFaqAbierta] = useState(null);

  useEffect(() => {
    const flecha = document.querySelector('.landing-flecha-abajo');
    if (flecha === null) return;
    const interval = setInterval(() => {
      flecha.classList.toggle('rebote');
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const FAQS = [
    {
      p: '¿Necesito saber de computación para tener mi web?',
      r: 'No. Tú solo nos cuentas sobre tu iglesia en un formulario simple. Nosotros nos encargamos de todo lo técnico: dominio, hosting, diseño y publicación.'
    },
    {
      p: '¿Cuánto demora en estar lista mi web?',
      r: 'La vista previa la ves en segundos. Una vez que apruebas y pagas, tu web queda publicada en menos de 24 horas.'
    },
    {
      p: '¿Puedo actualizar el contenido después?',
      r: 'Sí. Cada plan incluye un panel de administración donde tú mismo puedes cambiar horarios, fotos, predicaciones y más, sin conocimientos técnicos.'
    },
    {
      p: '¿El dominio .cl queda a nombre de la iglesia?',
      r: 'Sí. En los planes Misión e Impacto, el dominio se registra para tu iglesia y es tuyo.'
    },
    {
      p: '¿Qué pasa si quiero cancelar?',
      r: 'Puedes cancelar cuando quieras. No hay contratos de permanencia ni multas.'
    },
    {
      p: '¿A dónde va el dinero de mi pago?',
      r: 'Somos misioneros. Los ingresos de TuWebIglesia sostienen nuestro trabajo en el campo misionero. Tu pago es inversión directa en la expansión del Reino.'
    },
  ];

  return (
    <div className="landing">
      {/* HERO */}
      <header className="landing-hero">
        <nav className="landing-nav">
          <div className="landing-logo">TuWebIglesia</div>
          <div className="landing-nav-links">
            <a href="#como-funciona">Cómo funciona</a>
            <a href="#demo">Demo</a>
            <a href="#planes">Planes</a>
            <a href="#nosotros">Nosotros</a>
            <a href="#faq">Preguntas</a>
          </div>
        </nav>

        <div className="landing-hero-content">
          <h1>Tu iglesia ya cambia vidas. Que el mundo lo sepa.</h1>
          <p className="landing-subtitle">
            Creamos webs profesionales para iglesias evangélicas en menos de 24 horas.
            Sin complicaciones técnicas, sin contratos largos.
          </p>
          <div className="landing-hero-botones">
            <button className="landing-btn-primary" onClick={onComenzar}>
              Crear mi web ahora
            </button>
            <button className="landing-btn-ghost" onClick={() => setMostrarDemo(true)}>
              Ver una demo
            </button>
          </div>
          <p className="landing-hero-nota">Empieza gratis · Mira tu vista previa en segundos</p>
        </div>

        <a href="#como-funciona" className="landing-flecha-abajo" aria-label="Ver más">
          <span className="landing-flecha-texto">Conoce más</span>
          <svg className="landing-flecha-icono" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>
      </header>

      {/* CÓMO FUNCIONA */}
      <section id="como-funciona" className="landing-section">
        <h2>Tres pasos simples</h2>
        <p className="landing-section-sub">Tu web lista hoy mismo</p>

        <div className="landing-pasos">
          <div className="landing-paso">
            <div className="landing-paso-numero">1</div>
            <h3>Cuéntanos sobre tu iglesia</h3>
            <p>Completa un formulario simple con los datos básicos de tu congregación.</p>
          </div>
          <div className="landing-paso">
            <div className="landing-paso-numero">2</div>
            <h3>La IA diseña tu web en segundos</h3>
            <p>Mira la vista previa al instante y elige entre 7 estilos visuales el que más te guste.</p>
          </div>
          <div className="landing-paso">
            <div className="landing-paso-numero">3</div>
            <h3>Aprueba y publica</h3>
            <p>Elige tu plan, recibe tu dominio .cl y comienza a ministrar en línea.</p>
          </div>
        </div>
      </section>

      {/* DEMO */}
      <section id="demo" className="landing-section landing-section-claro">
        <h2>Así se ve una web creada con nuestra plataforma</h2>
        <p className="landing-section-sub">
          Ejemplo generado con TuWebIglesia — la tuya se vería así con los datos de tu congregación
        </p>
        <div className="landing-demo-frame-wrap">
          <iframe
            src={DEMO_URL}
            title="Web de demostración creada con TuWebIglesia"
            className="landing-demo-frame"
            loading="lazy"
          />
        </div>
        <div className="landing-demo-acciones">
          <a href={DEMO_URL} target="_blank" rel="noopener noreferrer" className="landing-btn-secondary landing-btn-inline">
            Abrir en pestaña nueva
          </a>
          <button className="landing-btn-primary" onClick={onComenzar}>
            Quiero una así para mi iglesia
          </button>
        </div>
      </section>

      {/* PLANES */}
      <section id="planes" className="landing-section">
        <h2>Planes pensados para iglesias</h2>
        <p className="landing-section-sub">Elige el que mejor se ajusta a tu comunidad</p>
        <p className="landing-section-nota">Todos incluyen hosting · Cancela cuando quieras</p>

        <div className="landing-planes">
          <div className="landing-plan">
            <h3>Fe</h3>
            <div className="landing-precio">$12.000<span className="landing-precio-unidad">/mes</span></div>
            <div className="landing-precio-mes">Pago inicial único: $50.000</div>
            <ul>
              <li>Hasta 5 secciones</li>
              <li>Subdominio en tuwebiglesia.cl</li>
              <li>Hasta 20 fotos</li>
              <li>5 ediciones mensuales</li>
              <li>SEO básico</li>
              <li>Hosting incluido</li>
            </ul>
            <button className="landing-btn-secondary" onClick={onComenzar}>Elegir Fe</button>
          </div>

          <div className="landing-plan landing-plan-destacado">
            <div className="landing-badge">Más popular</div>
            <h3>Misión</h3>
            <div className="landing-precio">$19.000<span className="landing-precio-unidad">/mes</span></div>
            <div className="landing-precio-mes">Pago inicial único: $80.000</div>
            <ul>
              <li>Hasta 8 secciones</li>
              <li>Dominio .cl propio</li>
              <li>Hasta 40 fotos</li>
              <li>20 ediciones mensuales</li>
              <li>SEO optimizado</li>
              <li>Hosting incluido</li>
            </ul>
            <button className="landing-btn-primary" onClick={onComenzar}>Elegir Misión</button>
          </div>

          <div className="landing-plan">
            <h3>Impacto</h3>
            <div className="landing-precio">$29.000<span className="landing-precio-unidad">/mes</span></div>
            <div className="landing-precio-mes">Pago inicial único: $100.000</div>
            <ul>
              <li>Las 11 secciones</li>
              <li>Dominio propio</li>
              <li>Hasta 60 fotos</li>
              <li>Ediciones ilimitadas</li>
              <li>SEO premium</li>
              <li>Hosting incluido</li>
            </ul>
            <button className="landing-btn-secondary" onClick={onComenzar}>Elegir Impacto</button>
          </div>
        </div>
      </section>

      {/* NOSOTROS - MISIÓN */}
      <section id="nosotros" className="landing-section landing-section-mision">
        <div className="landing-mision-content">
          <h2>Más que un servicio: una misión</h2>
          <p className="landing-mision-texto">
            Somos un equipo de misioneros sirviendo en el campo misionero.
            Creamos TuWebIglesia con un propósito claro: que cada iglesia, sin importar su tamaño,
            pueda tener presencia profesional en línea para alcanzar más almas.
          </p>
          <p className="landing-mision-destacado">
            Los ingresos de este servicio sostienen nuestro trabajo misionero
            y nos permiten seguir expandiendo el Reino de Dios.
          </p>
          <p className="landing-mision-texto">
            Cuando contratas TuWebIglesia, no solo obtienes una web de calidad —
            <strong> estás siendo parte de La misión</strong>.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="landing-section">
        <h2>Preguntas frecuentes</h2>
        <p className="landing-section-sub">Lo que los pastores nos preguntan antes de empezar</p>
        <div className="landing-faq">
          {FAQS.map((f, i) => (
            <div
              key={i}
              className={`landing-faq-item ${faqAbierta === i ? 'abierta' : ''}`}
              onClick={() => setFaqAbierta(faqAbierta === i ? null : i)}
            >
              <div className="landing-faq-pregunta">
                <span>{f.p}</span>
                <span className="landing-faq-icono">{faqAbierta === i ? '−' : '+'}</span>
              </div>
              {faqAbierta === i && <p className="landing-faq-respuesta">{f.r}</p>}
            </div>
          ))}
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="landing-section landing-cta-final">
        <h2>¿Listo para llevar tu iglesia en línea?</h2>
        <p>Empieza gratis y mira cómo se vería tu web en segundos. Publicada en 24 horas.</p>
        <button className="landing-btn-primary" onClick={onComenzar}>
          Crear mi web ahora
        </button>
      </section>

      {/* FOOTER */}
      <footer id="contacto" className="landing-footer">
        <div className="landing-footer-content">
          <h3>TuWebIglesia</h3>
          <p>Webs profesionales para iglesias evangélicas en Chile</p>
          <a href={whatsappLink} className="landing-whatsapp">
            Escríbenos por WhatsApp
          </a>
          <p className="landing-footer-copy">
            © {new Date().getFullYear()} TuWebIglesia · Un servicio para el Reino
          </p>
        </div>
      </footer>

      {/* MODAL DEMO */}
      {mostrarDemo && (
        <div className="landing-modal-demo" onClick={() => setMostrarDemo(false)}>
          <div className="landing-modal-demo-barra">
            <span>Web de demostración — TuWebIglesia</span>
            <button onClick={() => setMostrarDemo(false)}>✕ Cerrar</button>
          </div>
          <iframe src={DEMO_URL} title="Demo TuWebIglesia" className="landing-modal-demo-iframe" />
        </div>
      )}
    </div>
  );
}

export default Landing;
