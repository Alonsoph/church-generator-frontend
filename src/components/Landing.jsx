import { useEffect } from 'react';
import './Landing.css';

function Landing({ onComenzar }) {
  const WHATSAPP = '+56967236881';
  const whatsappLink = `https://wa.me/${WHATSAPP.replace(/[^0-9]/g, '')}`;

  useEffect(() => {
    const flecha = document.querySelector('.landing-flecha-abajo');
    if (!flecha) return;
    const interval = setInterval(() => {
      flecha.classList.toggle('rebote');
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="landing">
      {/* HERO */}
      <header className="landing-hero">
        <nav className="landing-nav">
          <div className="landing-logo">TuWebIglesia</div>
          <div className="landing-nav-links">
            <a href="#como-funciona">Cómo funciona</a>
            <a href="#planes">Planes</a>
            <a href="#nosotros">Nosotros</a>
            <a href="#contacto">Contacto</a>
          </div>
        </nav>

        <div className="landing-hero-content">
          <h1>Tu iglesia merece estar en línea</h1>
          <p className="landing-subtitle">
            Creamos webs profesionales para iglesias evangélicas en menos de 24 horas.
            Sin complicaciones técnicas, sin contratos largos.
          </p>
          <button className="landing-btn-primary" onClick={onComenzar}>
            Crear mi web ahora
          </button>
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
            <h3>Mira tu web al instante</h3>
            <p>Nuestra IA genera una vista previa profesional en segundos. Pídenos cambios si quieres.</p>
          </div>
          <div className="landing-paso">
            <div className="landing-paso-numero">3</div>
            <h3>Aprueba y publica</h3>
            <p>Elige tu plan, recibe tu dominio .cl y comienza a ministrar en línea.</p>
          </div>
        </div>
      </section>

      {/* PLANES */}
      <section id="planes" className="landing-section landing-section-claro">
        <h2>Planes pensados para iglesias</h2>
        <p className="landing-section-sub">Elige el que mejor se ajusta a tu comunidad</p>

        <div className="landing-planes">
          <div className="landing-plan">
            <h3>Fe</h3>
            <div className="landing-precio">$50.000</div>
            <div className="landing-precio-mes">+ $12.000/mes</div>
            <ul>
              <li>Hasta 5 secciones</li>
              <li>Dominio .cl incluido</li>
              <li>Hosting incluido</li>
              <li>Soporte por email</li>
              <li>Actualizaciones mensuales</li>
            </ul>
            <button className="landing-btn-secondary" onClick={onComenzar}>Elegir Fe</button>
          </div>

          <div className="landing-plan landing-plan-destacado">
            <div className="landing-badge">Más popular</div>
            <h3>Misión</h3>
            <div className="landing-precio">$80.000</div>
            <div className="landing-precio-mes">+ $19.000/mes</div>
            <ul>
              <li>Hasta 8 secciones</li>
              <li>Dominio .cl incluido</li>
              <li>Hosting incluido</li>
              <li>Soporte por WhatsApp</li>
              <li>Actualizaciones mensuales</li>
            </ul>
            <button className="landing-btn-primary" onClick={onComenzar}>Elegir Misión</button>
          </div>

          <div className="landing-plan">
            <h3>Impacto</h3>
            <div className="landing-precio">$100.000</div>
            <div className="landing-precio-mes">+ $29.000/mes</div>
            <ul>
              <li>Las 11 secciones</li>
              <li>Dominio .cl incluido</li>
              <li>Hosting incluido</li>
              <li>WhatsApp prioritario</li>
              <li>Blog actualizable</li>
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

      {/* CTA FINAL */}
      <section className="landing-section landing-cta-final">
        <h2>¿Listo para llevar tu iglesia en línea?</h2>
        <p>Empieza gratis y mira cómo se vería tu web en segundos.</p>
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
    </div>
  );
}

export default Landing;