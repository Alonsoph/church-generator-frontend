// src/components/Landing.jsx
// Landing actualizada con planes diferenciados + link al panel de pastores
import './Landing.css';

export default function Landing({ onComenzar }) {
  const whatsapp = '56967236881';

  return (
    <div className="landing">
      {/* ── HERO ── */}
      <section className="landing-hero">
        <div className="landing-hero-content">
          <span className="landing-hero-tag">Para iglesias evangélicas en Chile</span>
          <h1>Tu iglesia merece estar en línea</h1>
          <p>
            Creamos la página web profesional de tu iglesia en menos de 24 horas.
            Sin complicaciones técnicas. Con el corazón puesto en la misión.
          </p>
          <button className="landing-btn-hero" onClick={onComenzar}>
            Crear mi web ahora
          </button>
        </div>
      </section>

      {/* ── CÓMO FUNCIONA ── */}
      <section className="landing-section" id="como-funciona">
        <h2>¿Cómo funciona?</h2>
        <p className="landing-section-sub">Tres pasos simples para tener la web de tu iglesia</p>
        <div className="landing-pasos">
          <div className="landing-paso">
            <div className="landing-paso-num">1</div>
            <h3>Cuéntanos de tu iglesia</h3>
            <p>Llena un formulario con los datos de tu congregación: nombre, horarios, ministerios y más.</p>
          </div>
          <div className="landing-paso">
            <div className="landing-paso-num">2</div>
            <h3>Generamos tu web con IA</h3>
            <p>Nuestra inteligencia artificial crea una página profesional y personalizada en minutos.</p>
          </div>
          <div className="landing-paso">
            <div className="landing-paso-num">3</div>
            <h3>Tu web queda lista</h3>
            <p>Revisas la vista previa, apruebas, y en menos de 24 horas tu iglesia está en internet.</p>
          </div>
        </div>
      </section>

      {/* ── PLANES ── */}
      <section className="landing-section landing-planes-section" id="planes">
        <h2>Planes para cada iglesia</h2>
        <p className="landing-section-sub">
          Elige el plan que mejor se adapte a las necesidades de tu congregación
        </p>
        <div className="landing-planes">
          {/* Plan Fe */}
          <div className="landing-plan">
            <div className="landing-plan-header">
              <h3>Fe</h3>
              <div className="landing-plan-precio">
                <span className="landing-plan-setup">$50.000</span>
                <span className="landing-plan-sep">pago único +</span>
                <span className="landing-plan-mensual">$12.000<small>/mes</small></span>
              </div>
            </div>
            <ul className="landing-plan-features">
              <li>Hasta 5 secciones en tu web</li>
              <li>Subdominio tuwebiglesia.cl</li>
              <li>Hasta 20 fotos en galería</li>
              <li>5 ediciones mensuales desde tu panel</li>
              <li>Posicionamiento básico en Google</li>
              <li>Hosting y SSL incluidos</li>
            </ul>
            <button className="landing-btn-plan" onClick={onComenzar}>
              Comenzar
            </button>
          </div>

          {/* Plan Misión */}
          <div className="landing-plan landing-plan-popular">
            <div className="landing-plan-badge">Más popular</div>
            <div className="landing-plan-header">
              <h3>Misión</h3>
              <div className="landing-plan-precio">
                <span className="landing-plan-setup">$80.000</span>
                <span className="landing-plan-sep">pago único +</span>
                <span className="landing-plan-mensual">$19.000<small>/mes</small></span>
              </div>
            </div>
            <ul className="landing-plan-features">
              <li><strong>Hasta 8 secciones</strong> en tu web</li>
              <li><strong>Dominio .cl propio</strong> para tu iglesia</li>
              <li>Hasta 40 fotos en galería</li>
              <li>20 ediciones mensuales desde tu panel</li>
              <li>Preview profesional en WhatsApp</li>
              <li>Hosting y SSL incluidos</li>
            </ul>
            <button className="landing-btn-plan landing-btn-popular" onClick={onComenzar}>
              Comenzar
            </button>
          </div>

          {/* Plan Impacto */}
          <div className="landing-plan">
            <div className="landing-plan-header">
              <h3>Impacto</h3>
              <div className="landing-plan-precio">
                <span className="landing-plan-setup">$100.000</span>
                <span className="landing-plan-sep">pago único +</span>
                <span className="landing-plan-mensual">$29.000<small>/mes</small></span>
              </div>
            </div>
            <ul className="landing-plan-features">
              <li><strong>Las 11 secciones</strong> completas</li>
              <li><strong>Dominio .cl propio</strong> para tu iglesia</li>
              <li>Hasta 60 fotos en galería</li>
              <li><strong>Ediciones ilimitadas</strong> desde tu panel</li>
              <li>Aparece destacado en Google</li>
              <li>Hosting y SSL incluidos</li>
            </ul>
            <button className="landing-btn-plan" onClick={onComenzar}>
              Comenzar
            </button>
          </div>
        </div>
        <p className="landing-planes-nota">
          Todos los planes incluyen acceso al panel de administración donde puedes editar textos, fotos y horarios tú mismo.
        </p>
      </section>

      {/* ── QUIÉNES SOMOS ── */}
      <section className="landing-section" id="mision">
        <h2>Tu pago sostiene una misión</h2>
        <div className="landing-mision">
          <p>
            Somos un equipo de misioneros que usamos la tecnología para servir
            al cuerpo de Cristo. Cada iglesia que se une a TuWebIglesia está
            siendo parte activa de la obra misionera.
          </p>
          <p>
            Tus pagos no van a una empresa tecnológica: sostienen directamente el
            trabajo de misioneros en el campo. Estás invirtiendo en la misión de Dios.
          </p>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="landing-cta-final">
        <h2>¿Listo para dar el paso?</h2>
        <p>Tu iglesia puede tener su web profesional hoy mismo.</p>
        <button className="landing-btn-hero" onClick={onComenzar}>
          Crear mi web ahora
        </button>
      </section>

      {/* ── FOOTER ── */}
      <footer className="landing-footer">
        <div className="landing-footer-content">
          <div className="landing-footer-brand">
            <span className="landing-footer-logo">✝</span>
            <span>TuWebIglesia</span>
          </div>
          <div className="landing-footer-links">
            <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noreferrer">
              WhatsApp
            </a>
            <a href="mailto:contacto@tuwebiglesia.cl">Contacto</a>
            <a href="/panel" onClick={e => { e.preventDefault(); window.location.href = '/panel'; }}>
              Panel de pastores
            </a>
          </div>
          <p className="landing-footer-copy">
            © {new Date().getFullYear()} TuWebIglesia — Sirviendo con tecnología y fe
          </p>
        </div>
      </footer>
    </div>
  );
}
