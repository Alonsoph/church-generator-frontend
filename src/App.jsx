import { useState } from 'react';
import './App.css';
import Landing from './components/Landing';

const FUNCIONALIDADES = [
  { key: 'horarios_ubicacion', label: 'Horarios y Ubicación' },
  { key: 'biblioteca_sermones', label: 'Biblioteca de Predicaciones' },
  { key: 'calendario_eventos', label: 'Calendario de Eventos' },
  { key: 'transmision_vivo', label: 'Transmisión en Vivo' },
  { key: 'ministerios', label: 'Ministerios' },
  { key: 'formulario_contacto', label: 'Formulario de Contacto (WhatsApp)' },
  { key: 'pagina_nuevos_visitantes', label: 'Página para Nuevos Visitantes' },
  { key: 'donaciones', label: 'Donaciones en Línea' },
  { key: 'galeria_fotos', label: 'Galería de Fotos' },
  { key: 'blog_devocionales', label: 'Blog / Devocionales' },
  { key: 'redes_sociales', label: 'Redes Sociales' },
];

const PLANES = [
  {
    id: 'fe',
    nombre: 'Fe',
    precio_unico: 50000,
    precio_mensual: 12000,
    secciones: 'Hasta 5 secciones',
    soporte: 'Soporte por email',
    color: '#5b8def',
  },
  {
    id: 'mision',
    nombre: 'Misión',
    precio_unico: 80000,
    precio_mensual: 19000,
    secciones: 'Hasta 8 secciones',
    soporte: 'Soporte por WhatsApp',
    color: '#2C5AA0',
    destacado: true,
  },
  {
    id: 'impacto',
    nombre: 'Impacto',
    precio_unico: 100000,
    precio_mensual: 29000,
    secciones: 'Las 11 secciones',
    soporte: 'WhatsApp prioritario + blog actualizable',
    color: '#1a3a6a',
  },
];

const API_BASE = 'https://church-generator-api-production.up.railway.app/api/iglesias';

function App() {
  const [paso, setPaso] = useState(0);
  const [nombre, setNombre] = useState('');
  const [lema, setLema] = useState('');
  const [direccion, setDireccion] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [logo, setLogo] = useState('');
  const [fotoPrincipal, setFotoPrincipal] = useState('');
  const [usarIA, setUsarIA] = useState(true);
  const [funcs, setFuncs] = useState(
    FUNCIONALIDADES.reduce((acc, f) => ({ ...acc, [f.key]: true }), {})
  );
  const [html, setHtml] = useState('');
  const [sugerencias, setSugerencias] = useState('');
  const [planSeleccionado, setPlanSeleccionado] = useState(null);
  const [cargando, setCargando] = useState(false);

  const toggleFunc = (key) => {
    setFuncs({ ...funcs, [key]: !funcs[key] });
  };

  const manejarImagen = (e, setter) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const maxAncho = 800;
        const escala = Math.min(1, maxAncho / img.width);
        const canvas = document.createElement('canvas');
        canvas.width = img.width * escala;
        canvas.height = img.height * escala;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const comprimida = canvas.toDataURL('image/jpeg', 0.6);
        setter(comprimida);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const generar = async () => {
    setCargando(true);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 120000);

      const res = await fetch(`${API_BASE}/generar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          iglesia: { nombre, lema },
          ubicacion: { direccion, ciudad },
          redes_sociales: { whatsapp },
          multimedia: { logo, fotoPrincipal },
          usar_ia: usarIA,
          funcionalidades_activas: funcs,
        }),
      });

      clearTimeout(timeoutId);
      const data = await res.json();
      if (data.exito) {
        setHtml(data.html);
        setPaso(2);
      } else {
        alert('Error al generar la página: ' + (data.error || ''));
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        alert('La generación tardó demasiado. Intenta de nuevo.');
      } else {
        alert('No se pudo conectar con el servidor.');
      }
    }
    setCargando(false);
  };

  const aprobar = async () => {
    if (!planSeleccionado) {
      alert('Por favor selecciona un plan');
      return;
    }
    if (!whatsapp) {
      alert('Por favor confirma tu número de WhatsApp');
      return;
    }
    setCargando(true);
    try {
      const res = await fetch(`${API_BASE}/aprobar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre_iglesia: nombre,
          email_contacto: email,
          whatsapp_contacto: whatsapp,
          html_generado: html,
          sugerencias_cliente: sugerencias,
          plan_seleccionado: planSeleccionado,
        }),
      });
      const data = await res.json();
      if (data.exito) {
        setPaso(4);
      } else {
        alert('Error al guardar: ' + (data.mensaje || ''));
      }
    } catch (err) {
      alert('No se pudo guardar la aprobación.');
    }
    setCargando(false);
  };

  const formatoPrecio = (n) => '$' + n.toLocaleString('es-CL');

if (paso === 0) {
    return <Landing onComenzar={() => setPaso(1)} />;
  }

  return (
    <div className="app">
      <div className="panel-principal">
        <div className="stepper">
          <div className={`step ${paso >= 1 ? 'activo' : ''}`}>1. Tu iglesia</div>
          <div className={`step ${paso >= 2 ? 'activo' : ''}`}>2. Vista previa</div>
          <div className={`step ${paso >= 3 ? 'activo' : ''}`}>3. Plan</div>
          <div className={`step ${paso >= 4 ? 'activo' : ''}`}>4. Listo</div>
        </div>

        {paso === 1 && (
          <div className="contenido-paso">
            <h1>Cuéntanos sobre tu iglesia</h1>
            <p className="intro">Completa estos datos y la IA generará una vista previa de tu web</p>

            <label>Nombre de la iglesia</label>
            <input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Ej: Iglesia Vida Nueva" />

            <label>Lema o frase</label>
            <input value={lema} onChange={(e) => setLema(e.target.value)} placeholder="Ej: Transformados por su gracia" />

            <label>Dirección</label>
            <input value={direccion} onChange={(e) => setDireccion(e.target.value)} placeholder="Ej: Calle Principal 456" />

            <label>Ciudad</label>
            <input value={ciudad} onChange={(e) => setCiudad(e.target.value)} placeholder="Ej: Santiago" />

            <label>WhatsApp</label>
            <input value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="Ej: +56912345678" />

            <label>Email (opcional)</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="contacto@iglesia.cl" />

            <label>Logo de la iglesia</label>
            <input type="file" accept="image/*" onChange={(e) => manejarImagen(e, setLogo)} className="input-file" />
            {logo && <img src={logo} alt="logo" className="preview-img" />}

            <label>Foto principal (encabezado)</label>
            <input type="file" accept="image/*" onChange={(e) => manejarImagen(e, setFotoPrincipal)} className="input-file" />
            {fotoPrincipal && <img src={fotoPrincipal} alt="foto principal" className="preview-img" />}

            <h3>¿Qué secciones quieres incluir?</h3>
            <div className="funcs">
              {FUNCIONALIDADES.map((f) => (
                <label key={f.key} className="check">
                  <input type="checkbox" checked={funcs[f.key]} onChange={() => toggleFunc(f.key)} />
                  {f.label}
                </label>
              ))}
            </div>

            <button className="btn-generar" onClick={generar} disabled={cargando || !nombre}>
              {cargando ? 'Generando con IA... (puede tardar 1 minuto)' : 'Generar vista previa con IA'}
            </button>
            <p className="nota-paso">El siguiente paso es ver tu web generada automáticamente</p>
          </div>
        )}

        {paso === 2 && (
          <div className="contenido-paso">
            <h1>Aquí está tu web</h1>
            <p className="intro">Esta es una vista previa. Puedes solicitar cambios antes de comprar.</p>

            <iframe title="preview" srcDoc={html} className="preview-frame-grande" />

            <button className="btn-fullscreen" onClick={() => {
              const ventana = window.open();
              ventana.document.write(html);
              ventana.document.close();
            }}>
              🔍 Ver a pantalla completa en pestaña nueva
            </button>

            <div className="caja-info">
              <strong>📝 ¿Quieres cambios?</strong>
              <p>Escribe abajo qué te gustaría modificar. Por ejemplo: "cambiar colores", "agregar más fotos", "modificar el texto del encabezado", etc. Nosotros lo ajustamos sin costo adicional.</p>
            </div>

            <label>Sugerencias de cambios (opcional)</label>
            <textarea
              value={sugerencias}
              onChange={(e) => setSugerencias(e.target.value)}
              placeholder="Escribe aquí cualquier cambio que quieras..."
              rows={5}
            />

            <div className="botones-fila">
              <button className="btn-secundario" onClick={() => setPaso(1)}>← Volver a editar</button>
              <button className="btn-generar" onClick={() => setPaso(3)}>Aprobar versión →</button>
            </div>
          </div>
        )}

        {paso === 3 && (
          <div className="contenido-paso">
            <h1>Elige tu plan</h1>
            <p className="intro">Selecciona qué incluye tu servicio mensual</p>

            <div className="caja-info">
              <strong>📸 Importante:</strong>
              <p>Una vez que realices el pago y tu web esté publicada, podrás agregar más fotos, modificar textos y hacer ajustes sin ningún problema. Nosotros te ayudamos con esos cambios cada mes como parte de tu plan.</p>
            </div>

            <div className="grid-planes">
              {PLANES.map((p) => (
                <div
                  key={p.id}
                  className={`card-plan ${planSeleccionado === p.id ? 'seleccionado' : ''} ${p.destacado ? 'destacado' : ''}`}
                  onClick={() => setPlanSeleccionado(p.id)}
                  style={{ borderColor: planSeleccionado === p.id ? p.color : undefined }}
                >
                  {p.destacado && <div className="badge-popular">Más popular</div>}
                  <h2 style={{ color: p.color }}>{p.nombre}</h2>
                  <div className="precio-unico">{formatoPrecio(p.precio_unico)}</div>
                  <div className="precio-mensual">+ {formatoPrecio(p.precio_mensual)}/mes</div>
                  <ul>
                    <li>{p.secciones}</li>
                    <li>{p.soporte}</li>
                    <li>Dominio .cl incluido</li>
                    <li>Hosting incluido</li>
                    <li>Actualizaciones mensuales</li>
                  </ul>
                  <button className="btn-seleccionar" style={{ background: p.color }}>
                    {planSeleccionado === p.id ? '✓ Seleccionado' : 'Seleccionar'}
                  </button>
                </div>
              ))}
            </div>

            <div className="botones-fila">
              <button className="btn-secundario" onClick={() => setPaso(2)}>← Volver</button>
              <button className="btn-generar" onClick={aprobar} disabled={!planSeleccionado || cargando}>
                {cargando ? 'Guardando...' : 'Confirmar y recibir instrucciones por WhatsApp'}
              </button>
            </div>
          </div>
        )}

        {paso === 4 && (
          <div className="contenido-paso final">
            <h1>¡Casi listo!</h1>
            <div className="resumen-final">
              <p><strong>Iglesia:</strong> {nombre}</p>
              <p><strong>Plan elegido:</strong> {PLANES.find(p => p.id === planSeleccionado)?.nombre}</p>
              <p><strong>WhatsApp:</strong> {whatsapp}</p>
            </div>
            <div className="caja-info verde">
              <p>✅ Tu solicitud fue guardada.</p>
              <p>📱 En las próximas horas recibirás un mensaje por WhatsApp con:</p>
              <ul>
                <li>Instrucciones de pago</li>
                <li>Tu web final con tus sugerencias aplicadas</li>
                <li>Tu dominio .cl personalizado</li>
                <li>Acceso a actualizaciones mensuales</li>
              </ul>
            </div>
            <button className="btn-generar" onClick={() => window.location.reload()}>
              Generar otra web
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;