import { useState } from 'react';
import './App.css';

const FUNCIONALIDADES = [
  { key: 'horarios_ubicacion', label: 'Horarios y Ubicación' },
  { key: 'biblioteca_sermones', label: 'Biblioteca de Sermones' },
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

const API_URL = 'https://church-generator-api-production.up.railway.app/api/iglesias/generar';

function App() {
  const [nombre, setNombre] = useState('');
  const [lema, setLema] = useState('');
  const [direccion, setDireccion] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [logo, setLogo] = useState('');
  const [fotoPrincipal, setFotoPrincipal] = useState('');
  const [usarIA, setUsarIA] = useState(false);
  const [funcs, setFuncs] = useState(
    FUNCIONALIDADES.reduce((acc, f) => ({ ...acc, [f.key]: true }), {})
  );
  const [html, setHtml] = useState('');
  const [cargando, setCargando] = useState(false);

  const toggleFunc = (key) => {
    setFuncs({ ...funcs, [key]: !funcs[key] });
  };

  // Convierte, redimensiona y comprime la imagen a base64
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
        // Comprime a JPEG con calidad 0.6
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
    const timeoutId = setTimeout(() => controller.abort(), 120000); // 2 minutos

    const res = await fetch(API_URL, {
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

  return (
    <div className="app">
      <div className="panel-form">
        <h1>Crea la web de tu iglesia</h1>
        <p className="intro">Completa los datos y mira cómo queda al instante</p>

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

        <label className="check ia-toggle">
          <input type="checkbox" checked={usarIA} onChange={() => setUsarIA(!usarIA)} />
          <span><strong>Generar con IA</strong> (más personalizado, tarda unos segundos)</span>
        </label>

        <button className="btn-generar" onClick={generar} disabled={cargando}>
          {cargando ? (usarIA ? 'Generando con IA... (puede tardar 1 minuto)' : 'Generando...') : 'Generar mi página'}
        </button>
      </div>

      <div className="panel-preview">
        {html ? (
          <iframe title="preview" srcDoc={html} className="preview-frame" />
        ) : (
          <div className="preview-vacio">
            <p>Aquí verás la vista previa de tu página</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;