// src/components/Panel.jsx
import { useState, useEffect, useCallback } from 'react';

const API = 'https://church-generator-api-production.up.railway.app';

// Configuración de secciones editables
const SECCIONES_CONFIG = {
  hero: {
    nombre: 'Portada',
    icono: '🏠',
    campos: [
      { clave: 'nombre_iglesia', label: 'Nombre de la iglesia', tipo: 'text' },
      { clave: 'lema', label: 'Lema o versículo', tipo: 'text' },
    ]
  },
  horarios: {
    nombre: 'Horarios',
    icono: '🕐',
    campos: [
      { clave: 'horario_1_dia', label: 'Día del culto principal', tipo: 'text', placeholder: 'Ej: Domingos' },
      { clave: 'horario_1_hora', label: 'Hora', tipo: 'text', placeholder: 'Ej: 10:00 - 12:00' },
      { clave: 'horario_1_nombre', label: 'Nombre del servicio', tipo: 'text', placeholder: 'Ej: Culto dominical' },
      { clave: 'horario_2_dia', label: 'Segundo servicio (día)', tipo: 'text', placeholder: 'Opcional' },
      { clave: 'horario_2_hora', label: 'Hora', tipo: 'text', placeholder: 'Opcional' },
      { clave: 'horario_2_nombre', label: 'Nombre', tipo: 'text', placeholder: 'Opcional' },
      { clave: 'horario_3_dia', label: 'Tercer servicio (día)', tipo: 'text', placeholder: 'Opcional' },
      { clave: 'horario_3_hora', label: 'Hora', tipo: 'text', placeholder: 'Opcional' },
      { clave: 'horario_3_nombre', label: 'Nombre', tipo: 'text', placeholder: 'Opcional' },
    ]
  },
  nosotros: {
    nombre: 'Quiénes somos',
    icono: '📖',
    campos: [
      { clave: 'historia', label: 'Historia de la iglesia', tipo: 'textarea' },
      { clave: 'vision', label: 'Visión', tipo: 'textarea' },
      { clave: 'mision', label: 'Misión', tipo: 'textarea' },
    ]
  },
  predicaciones: {
    nombre: 'Predicaciones',
    icono: '🎤',
    campos: [
      { clave: 'pred_1_titulo', label: 'Predicación 1 — Título', tipo: 'text' },
      { clave: 'pred_1_predicador', label: 'Predicador', tipo: 'text' },
      { clave: 'pred_2_titulo', label: 'Predicación 2 — Título', tipo: 'text' },
      { clave: 'pred_2_predicador', label: 'Predicador', tipo: 'text' },
      { clave: 'pred_3_titulo', label: 'Predicación 3 — Título', tipo: 'text' },
      { clave: 'pred_3_predicador', label: 'Predicador', tipo: 'text' },
    ]
  },
  eventos: {
    nombre: 'Eventos',
    icono: '📅',
    campos: [
      { clave: 'evento_1_titulo', label: 'Evento 1 — Título', tipo: 'text' },
      { clave: 'evento_1_fecha', label: 'Fecha', tipo: 'text', placeholder: 'Ej: 27 de junio, 2026' },
      { clave: 'evento_1_hora', label: 'Hora', tipo: 'text' },
      { clave: 'evento_1_lugar', label: 'Lugar', tipo: 'text' },
      { clave: 'evento_1_descripcion', label: 'Descripción', tipo: 'textarea' },
      { clave: 'evento_2_titulo', label: 'Evento 2 — Título', tipo: 'text' },
      { clave: 'evento_2_fecha', label: 'Fecha', tipo: 'text' },
      { clave: 'evento_2_hora', label: 'Hora', tipo: 'text' },
      { clave: 'evento_2_descripcion', label: 'Descripción', tipo: 'textarea' },
    ]
  },
  ministerios: {
    nombre: 'Ministerios',
    icono: '🤝',
    campos: [
      { clave: 'min_1_nombre', label: 'Ministerio 1', tipo: 'text' },
      { clave: 'min_1_desc', label: 'Descripción', tipo: 'text' },
      { clave: 'min_2_nombre', label: 'Ministerio 2', tipo: 'text' },
      { clave: 'min_2_desc', label: 'Descripción', tipo: 'text' },
      { clave: 'min_3_nombre', label: 'Ministerio 3', tipo: 'text' },
      { clave: 'min_3_desc', label: 'Descripción', tipo: 'text' },
      { clave: 'min_4_nombre', label: 'Ministerio 4', tipo: 'text' },
      { clave: 'min_4_desc', label: 'Descripción', tipo: 'text' },
      { clave: 'min_5_nombre', label: 'Ministerio 5', tipo: 'text' },
      { clave: 'min_5_desc', label: 'Descripción', tipo: 'text' },
      { clave: 'min_6_nombre', label: 'Ministerio 6', tipo: 'text' },
      { clave: 'min_6_desc', label: 'Descripción', tipo: 'text' },
      { clave: 'min_7_nombre', label: 'Ministerio 7', tipo: 'text' },
      { clave: 'min_7_desc', label: 'Descripción', tipo: 'text' },
      { clave: 'min_8_nombre', label: 'Ministerio 8', tipo: 'text' },
      { clave: 'min_8_desc', label: 'Descripción', tipo: 'text' },
    ]
  },
  contacto: {
    nombre: 'Contacto y redes',
    icono: '📱',
    campos: [
      { clave: 'telefono', label: 'Teléfono / WhatsApp', tipo: 'text' },
      { clave: 'email', label: 'Email', tipo: 'text' },
      { clave: 'direccion', label: 'Dirección', tipo: 'text' },
      { clave: 'youtube', label: 'Canal de YouTube (URL)', tipo: 'text', placeholder: 'https://youtube.com/@...' },
      { clave: 'instagram', label: 'Instagram (URL)', tipo: 'text', placeholder: 'https://instagram.com/...' },
      { clave: 'facebook', label: 'Facebook (URL)', tipo: 'text', placeholder: 'https://facebook.com/...' },
    ]
  },
  transmision: {
    nombre: 'Transmisión',
    icono: '📺',
    campos: [
      { clave: 'youtube_canal', label: 'URL del canal de YouTube', tipo: 'text' },
      { clave: 'video_destacado', label: 'URL del video destacado', tipo: 'text', placeholder: 'https://youtube.com/watch?v=...' },
    ]
  },
  ubicacion: {
    nombre: 'Ubicación',
    icono: '📍',
    campos: [
      { clave: 'direccion', label: 'Dirección', tipo: 'text', placeholder: 'Ej: Av. Principal 123, Santiago' },
    ]
  },
  donaciones: {
    nombre: 'Donaciones',
    icono: '💰',
    campos: [
      { clave: 'banco', label: 'Banco', tipo: 'text' },
      { clave: 'numero_cuenta', label: 'Número de cuenta', tipo: 'text' },
      { clave: 'tipo_cuenta', label: 'Tipo de cuenta', tipo: 'text', placeholder: 'Ej: Cuenta Corriente, Cuenta de Ahorro' },
      { clave: 'titular', label: 'Titular de la cuenta', tipo: 'text' },
      { clave: 'rut', label: 'RUT', tipo: 'text' },
      { clave: 'email_donaciones', label: 'Email para donaciones', tipo: 'text' },
    ]
  },
};

export default function Panel() {
  const [token, setToken] = useState(localStorage.getItem('panel_token') || '');
  const [iglesia, setIglesia] = useState(null);
  const [contenido, setContenido] = useState({});
  const [secciones, setSecciones] = useState([]);
  const [limites, setLimites] = useState(null);
  const [plan, setPlan] = useState('fe');
  const [seccionActiva, setSeccionActiva] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState(null);
  const [formLogin, setFormLogin] = useState({ usuario: '', password: '' });
  const [editando, setEditando] = useState({});
  const [guardando, setGuardando] = useState(false);

  // ── Cargar contenido al tener token ──
  const cargarContenido = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/panel/contenido`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.status === 401) {
        setToken('');
        localStorage.removeItem('panel_token');
        return;
      }
      const data = await res.json();
      setContenido(data.contenido || {});
      setSecciones(data.secciones || []);
      setLimites(data.limites || null);
      setPlan(data.plan || 'fe');
    } catch (err) {
      console.error(err);
      mostrarMensaje('Error al cargar contenido', 'error');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) cargarContenido();
  }, [token, cargarContenido]);

  // ── Login ──
  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/panel/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formLogin)
      });
      const data = await res.json();
      if (!res.ok) {
        mostrarMensaje(data.error, 'error');
        return;
      }
      setToken(data.token);
      setIglesia(data.iglesia);
      localStorage.setItem('panel_token', data.token);
      localStorage.setItem('panel_iglesia', JSON.stringify(data.iglesia));
    } catch (err) {
      mostrarMensaje('Error de conexión', 'error');
    } finally {
      setLoading(false);
    }
  }

  // ── Guardar cambios de una sección ──
  async function guardarSeccion(seccionSlug) {
    const campos = editando[seccionSlug];
    if (!campos || Object.keys(campos).length === 0) {
      mostrarMensaje('No hay cambios por guardar', 'info');
      return;
    }

    setGuardando(true);
    let errores = 0;

    for (const [clave, valor] of Object.entries(campos)) {
      try {
        const res = await fetch(`${API}/api/panel/contenido`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ seccion: seccionSlug, clave, valor })
        });
        const data = await res.json();
        if (!res.ok) {
          if (data.upgrade) {
            mostrarMensaje(data.error, 'warning');
            setGuardando(false);
            return;
          }
          errores++;
        }
      } catch {
        errores++;
      }
    }

    if (errores === 0) {
      mostrarMensaje('Cambios guardados correctamente', 'success');
      setEditando(prev => ({ ...prev, [seccionSlug]: {} }));
      cargarContenido();
    } else {
      mostrarMensaje(`${errores} cambio(s) no se pudieron guardar`, 'error');
    }
    setGuardando(false);
  }

  // ── Subir foto ──
  function abrirCloudinary() {
    if (!window.cloudinary) {
      mostrarMensaje('El widget de fotos no se cargó. Recarga la página.', 'error');
      return;
    }
    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: 'dz9vkjmgu',
        uploadPreset: 'panel_pastores',
        folder: `iglesias/${iglesia?.id || 'temp'}`,
        maxFiles: 5,
        maxFileSize: 5000000,
        sources: ['local', 'camera'],
        language: 'es',
        text: {
          'es': {
            'or': 'o',
            'menu.files': 'Mis archivos',
            'menu.camera': 'Cámara',
          }
        }
      },
      async (error, result) => {
        if (error) {
          mostrarMensaje('Error al subir foto', 'error');
          return;
        }
        if (result.event === 'success') {
          try {
            const res = await fetch(`${API}/api/panel/foto`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
              },
              body: JSON.stringify({ url: result.info.secure_url })
            });
            const data = await res.json();
            if (data.ok) {
              mostrarMensaje(`Foto guardada (${data.fotos_usadas}/${data.fotos_limite})`, 'success');
              cargarContenido();
            } else {
              mostrarMensaje(data.error, data.upgrade ? 'warning' : 'error');
            }
          } catch {
            mostrarMensaje('Error al registrar la foto', 'error');
          }
        }
      }
    );
    widget.open();
  }

  // ── Eliminar foto ──
  async function eliminarFoto(clave) {
    if (!confirm('¿Eliminar esta foto?')) return;
    try {
      const res = await fetch(`${API}/api/panel/foto`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ clave })
      });
      if (res.ok) {
        mostrarMensaje('Foto eliminada', 'success');
        cargarContenido();
      }
    } catch {
      mostrarMensaje('Error al eliminar', 'error');
    }
  }

  // ── Helpers ──
  function mostrarMensaje(texto, tipo = 'info') {
    setMensaje({ texto, tipo });
    setTimeout(() => setMensaje(null), 4000);
  }

  function handleCampo(seccion, clave, valor) {
    setEditando(prev => ({
      ...prev,
      [seccion]: { ...(prev[seccion] || {}), [clave]: valor }
    }));
  }

  function getValor(seccion, clave) {
    if (editando[seccion]?.[clave] !== undefined) return editando[seccion][clave];
    return contenido[seccion]?.[clave] || '';
  }

  function cerrarSesion() {
    setToken('');
    setIglesia(null);
    localStorage.removeItem('panel_token');
    localStorage.removeItem('panel_iglesia');
  }

  // Restaurar nombre iglesia de localStorage si existe
  useEffect(() => {
    if (token && !iglesia) {
      const saved = localStorage.getItem('panel_iglesia');
      if (saved) setIglesia(JSON.parse(saved));
    }
  }, [token, iglesia]);

  // ══════════════════════════════════════
  //  RENDER: LOGIN
  // ══════════════════════════════════════
  if (!token) {
    return (
      <div className="panel-login-container">
        <div className="panel-login-card">
          <div className="panel-login-logo">✝</div>
          <h1>Panel de tu iglesia</h1>
          <p className="panel-login-subtitle">
            Administra el contenido de tu página web
          </p>
          <div className="panel-login-form">
            <label>
              Email o WhatsApp
              <input
                type="text"
                value={formLogin.usuario}
                onChange={e => setFormLogin(p => ({ ...p, usuario: e.target.value }))}
                placeholder="pastor@iglesia.cl"
                autoComplete="username"
              />
            </label>
            <label>
              Contraseña
              <input
                type="password"
                value={formLogin.password}
                onChange={e => setFormLogin(p => ({ ...p, password: e.target.value }))}
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </label>
            <button
              className="panel-btn-primary"
              onClick={handleLogin}
              disabled={loading || !formLogin.usuario || !formLogin.password}
            >
              {loading ? 'Ingresando...' : 'Ingresar'}
            </button>
          </div>
          <p className="panel-login-help">
            ¿No tienes acceso? Escríbenos por{' '}
            <a href="https://wa.me/56967236881" target="_blank" rel="noreferrer">WhatsApp</a>
          </p>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════
  //  RENDER: PANEL PRINCIPAL
  // ══════════════════════════════════════
  const seccionesActivas = secciones.filter(s => s.activa).map(s => s.seccion_slug);
  const nombreIglesia = iglesia?.nombre || contenido?.hero?.nombre_iglesia || 'Mi iglesia';
  const planLabel = { fe: 'Fe', mision: 'Misión', impacto: 'Impacto' }[plan] || plan;

  // Fotos de la galería
  const fotosGaleria = contenido.galeria
    ? Object.entries(contenido.galeria).map(([clave, valor]) => {
        try {
          const parsed = JSON.parse(valor);
          return { clave, url: parsed.url, descripcion: parsed.descripcion };
        } catch {
          return { clave, url: valor, descripcion: '' };
        }
      })
    : [];

  return (
    <div className="panel-container">
      {/* Mensaje flotante */}
      {mensaje && (
        <div className={`panel-toast panel-toast-${mensaje.tipo}`}>
          {mensaje.texto}
        </div>
      )}

      {/* Header */}
      <header className="panel-header">
        <div className="panel-header-left">
          <span className="panel-header-cross">✝</span>
          <div>
            <h1>{nombreIglesia}</h1>
            <span className="panel-plan-badge">Plan {planLabel}</span>
          </div>
        </div>
        <button className="panel-btn-logout" onClick={cerrarSesion}>
          Cerrar sesión
        </button>
      </header>

      {/* Info de ediciones */}
      {limites && (
        <div className="panel-ediciones-bar">
          <div className="panel-ediciones-info">
            {limites.ediciones_limite === 'ilimitadas' ? (
              <span>Ediciones ilimitadas</span>
            ) : (
              <span>
                {limites.ediciones_usadas} de {limites.ediciones_limite} ediciones usadas este mes
              </span>
            )}
          </div>
          {limites.ediciones_limite !== 'ilimitadas' && (
            <div className="panel-ediciones-progress">
              <div
                className="panel-ediciones-fill"
                style={{
                  width: `${Math.min(100, (limites.ediciones_usadas / limites.ediciones_limite) * 100)}%`
                }}
              />
            </div>
          )}
        </div>
      )}

      {loading && <div className="panel-loading">Cargando contenido...</div>}

      {/* Menú de secciones */}
      <nav className="panel-nav">
        {Object.entries(SECCIONES_CONFIG).map(([slug, config]) => {
          const activa = seccionesActivas.length === 0 || seccionesActivas.includes(slug);
          if (!activa) return null;
          return (
            <button
              key={slug}
              className={`panel-nav-item ${seccionActiva === slug ? 'active' : ''}`}
              onClick={() => setSeccionActiva(seccionActiva === slug ? null : slug)}
            >
              <span className="panel-nav-icon">{config.icono}</span>
              <span>{config.nombre}</span>
            </button>
          );
        })}
        {/* Galería siempre visible si está activa */}
        {(seccionesActivas.length === 0 || seccionesActivas.includes('galeria')) && (
          <button
            className={`panel-nav-item ${seccionActiva === 'galeria' ? 'active' : ''}`}
            onClick={() => setSeccionActiva(seccionActiva === 'galeria' ? null : 'galeria')}
          >
            <span className="panel-nav-icon">🖼</span>
            <span>Galería</span>
          </button>
        )}
      </nav>

      {/* Editor de sección */}
      {seccionActiva && seccionActiva !== 'galeria' && SECCIONES_CONFIG[seccionActiva] && (
        <div className="panel-editor">
          <h2>
            {SECCIONES_CONFIG[seccionActiva].icono}{' '}
            {SECCIONES_CONFIG[seccionActiva].nombre}
          </h2>
          <div className="panel-campos">
            {SECCIONES_CONFIG[seccionActiva].campos.map(campo => (
              <label key={campo.clave} className="panel-campo">
                <span className="panel-campo-label">{campo.label}</span>
                {campo.tipo === 'textarea' ? (
                  <textarea
                    value={getValor(seccionActiva, campo.clave)}
                    onChange={e => handleCampo(seccionActiva, campo.clave, e.target.value)}
                    placeholder={campo.placeholder || ''}
                    rows={4}
                  />
                ) : (
                  <input
                    type="text"
                    value={getValor(seccionActiva, campo.clave)}
                    onChange={e => handleCampo(seccionActiva, campo.clave, e.target.value)}
                    placeholder={campo.placeholder || ''}
                  />
                )}
              </label>
            ))}
          </div>
          <div className="panel-editor-actions">
            <button
              className="panel-btn-primary"
              onClick={() => guardarSeccion(seccionActiva)}
              disabled={guardando || !editando[seccionActiva] || Object.keys(editando[seccionActiva] || {}).length === 0}
            >
              {guardando ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </div>
        </div>
      )}

      {/* Galería de fotos */}
      {seccionActiva === 'galeria' && (
        <div className="panel-editor">
          <h2>🖼 Galería de fotos</h2>
          {limites && (
            <p className="panel-fotos-counter">
              {limites.fotos_usadas} de {limites.fotos_limite} fotos
            </p>
          )}
          <button className="panel-btn-primary" onClick={abrirCloudinary}>
            Subir fotos
          </button>
          <div className="panel-galeria-grid">
            {fotosGaleria.map(foto => (
              <div key={foto.clave} className="panel-galeria-item">
                <img src={foto.url} alt={foto.descripcion || 'Foto de la iglesia'} />
                <button
                  className="panel-galeria-delete"
                  onClick={() => eliminarFoto(foto.clave)}
                  title="Eliminar"
                >
                  ×
                </button>
              </div>
            ))}
            {fotosGaleria.length === 0 && (
              <p className="panel-empty">Aún no hay fotos. Presiona "Subir fotos" para comenzar.</p>
            )}
          </div>
        </div>
      )}

      {/* Estado vacío */}
      {!seccionActiva && !loading && (
        <div className="panel-welcome">
          <p>Selecciona una sección para editar el contenido de tu página web.</p>
          <p className="panel-welcome-hint">
            Los cambios se reflejan en tu web al instante.
          </p>
        </div>
      )}
    </div>
  );
}
