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

function App() {
  const [nombre, setNombre] = useState('');
  const [lema, setLema] = useState('');
  const [direccion, setDireccion] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [usarIA, setUsarIA] = useState(false);
  const [funcs, setFuncs] = useState(
    FUNCIONALIDADES.reduce((acc, f) => ({ ...acc, [f.key]: true }), {})
  );
  const [html, setHtml] = useState('');
  const [cargando, setCargando] = useState(false);

  const toggleFunc = (key) => {
    setFuncs({ ...funcs, [key]: !funcs[key] });
  };

  const generar = async () => {
    setCargando(true);
    try {
      const res = await fetch('https://church-generator-api-production.up.railway.app/api/iglesias/generar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          iglesia: { nombre, lema },
          ubicacion: { direccion, ciudad },
          redes_sociales: { whatsapp },
          usar_ia: usarIA,
          funcionalidades_activas: funcs,
        }),
      });
      const data = await res.json();
      if (data.exito) {
        setHtml(data.html);
      } else {
        alert('Error al generar la página: ' + (data.error || ''));
      }
    } catch (err) {
      alert('No se pudo conectar con el servidor. ¿Está corriendo el backend?');
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
          {cargando ? (usarIA ? 'Generando con IA...' : 'Generando...') : 'Generar mi página'}
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