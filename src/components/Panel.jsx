import { useState, useEffect, useCallback, useRef } from 'react';
import './PanelStyles.css';

const API_BASE = 'https://church-generator-api-production.up.railway.app/api/panel';

const ICONOS = {
  hero: <span dangerouslySetInnerHTML={{ __html: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>' }} />,
  horarios: <span dangerouslySetInnerHTML={{ __html: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>' }} />,
  nosotros: <span dangerouslySetInnerHTML={{ __html: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>' }} />,
  predicaciones: <span dangerouslySetInnerHTML={{ __html: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>' }} />,
  eventos: <span dangerouslySetInnerHTML={{ __html: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>' }} />,
  ministerios: <span dangerouslySetInnerHTML={{ __html: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>' }} />,
  galeria: <span dangerouslySetInnerHTML={{ __html: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>' }} />,
  transmision: <span dangerouslySetInnerHTML={{ __html: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>' }} />,
  ubicacion: <span dangerouslySetInnerHTML={{ __html: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>' }} />,
  contacto: <span dangerouslySetInnerHTML={{ __html: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>' }} />,
  donaciones: <span dangerouslySetInnerHTML={{ __html: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>' }} />,
};

const NOMBRES_SECCIONES = {
  hero: 'Portada',
  horarios: 'Horarios',
  nosotros: 'Nosotros',
  predicaciones: 'Predicaciones',
  eventos: 'Eventos',
  ministerios: 'Ministerios',
  galeria: 'Galeria',
  transmision: 'Transmision',
  ubicacion: 'Ubicacion',
  contacto: 'Contacto',
  donaciones: 'Donaciones',
};

function Panel() {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState(localStorage.getItem('panel_token') || '');
  const [logueado, setLogueado] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [iglesia, setIglesia] = useState(null);
  const [plan, setPlan] = useState('fe');
  const [limites, setLimites] = useState(null);

  const [contenido, setContenido] = useState({});
  const [secciones, setSecciones] = useState([]);
  const [seccionActiva, setSeccionActiva] = useState(null);
  const [camposEditando, setCamposEditando] = useState({});

  const [galeriaFotos, setGaleriaFotos] = useState([]);
  const [nuevaFotoUrl, setNuevaFotoUrl] = useState('');
  const [nuevaFotoDesc, setNuevaFotoDesc] = useState('');

  const [previewHtml, setPreviewHtml] = useState('');
  const [mostrarPreview, setMostrarPreview] = useState(false);
  const [plantillasDisponibles, setPlantillasDisponibles] = useState([]);
  const [plantillaActual, setPlantillaActual] = useState('reverente');
  const [cambiandoPlantilla, setCambiandoPlantilla] = useState(false);

  const [stats, setStats] = useState(null);
  const [dominio, setDominio] = useState(null);

  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);
  const debounceTimers = useRef({});
  const [subiendoImg, setSubiendoImg] = useState(false);
  const [generandoImg, setGenerandoImg] = useState(false);

  const mostrarToast = useCallback((mensaje, tipo = 'info') => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ mensaje, tipo });
    toastTimer.current = setTimeout(() => setToast(null), 3000);
  }, []);

  useEffect(() => {
    if (token) cargarTodo(token);
  }, [token]);

  async function cargarTodo(t) {
    setCargando(true);
    try {
      const headers = { Authorization: `Bearer ${t}` };
      const [contenidoRes, seccionesRes, statsRes, dominioRes] = await Promise.all([
        fetch(`${API_BASE}/contenido`, { headers }),
        fetch(`${API_BASE}/secciones`, { headers }),
        fetch(`${API_BASE}/stats`, { headers }),
        fetch(`${API_BASE}/dominio`, { headers }),
      ]);

      if (contenidoRes.status === 401 || seccionesRes.status === 401) {
        cerrarSesion('Sesion expirada. Inicia sesion nuevamente.');
        return;
      }

      const datosContenido = await contenidoRes.json();
      const datosSecciones = await seccionesRes.json();
      const datosStats = await statsRes.json();
      const datosDominio = await dominioRes.json();

      setContenido(datosContenido.contenido || {});
      setLimites(datosContenido.limites || null);
      setPlan(datosContenido.plan || 'fe');

      setSecciones(datosSecciones.secciones || []);
      if (datosSecciones.secciones?.length > 0) {
        setSeccionActiva(datosSecciones.secciones[0].slug);
      }

      setStats(datosStats);
      setDominio(datosDominio);

      if (datosContenido.contenido?.galeria) {
        const fotos = Object.entries(datosContenido.contenido.galeria)
          .filter(([clave]) => clave.startsWith('foto_'))
          .map(([clave, valor]) => {
            try {
              const parsed = typeof valor === 'string' ? JSON.parse(valor) : valor;
              return { clave, ...parsed };
            } catch {
              return { clave, url: valor, descripcion: '' };
            }
          });
        setGaleriaFotos(fotos);
      }

      if (datosContenido.plan) {
        const plantillasPorPlan = {
          fe: ['reverente'],
          mision: ['reverente', 'contemporanea', 'acogedora'],
          impacto: ['reverente', 'contemporanea', 'acogedora', 'catedral', 'transmision', 'mision', 'plaza'],
        };
        setPlantillasDisponibles(plantillasPorPlan[datosContenido.plan] || ['reverente']);
      }

      mostrarToast('Datos cargados', 'success');
    } catch (err) {
      mostrarToast('Error al cargar datos del servidor', 'error');
    } finally {
      setCargando(false);
    }
  }

  async function handleLogin(e) {
    e.preventDefault();
    setErrorMsg('');
    setCargando(true);
    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario: usuario.trim(), password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || 'Error de autenticacion');
        return;
      }
      localStorage.setItem('panel_token', data.token);
      setToken(data.token);
      setIglesia(data.iglesia);
      setLogueado(true);
      mostrarToast('Bienvenido', 'success');
    } catch {
      setErrorMsg('No se pudo conectar con el servidor');
    } finally {
      setCargando(false);
    }
  }

  function cerrarSesion(mensaje) {
    localStorage.removeItem('panel_token');
    setToken('');
    setLogueado(false);
    setIglesia(null);
    setContenido({});
    setSecciones([]);
    setSeccionActiva(null);
    setStats(null);
    setDominio(null);
    setGaleriaFotos([]);
    setPreviewHtml('');
    if (mensaje) mostrarToast(mensaje, 'warning');
  }

  function guardarCampo(seccion, clave, valor) {
    if (debounceTimers.current[`${seccion}_${clave}`]) {
      clearTimeout(debounceTimers.current[`${seccion}_${clave}`]);
    }
    setContenido(prev => ({
      ...prev,
      [seccion]: { ...(prev[seccion] || {}), [clave]: valor },
    }));
    debounceTimers.current[`${seccion}_${clave}`] = setTimeout(async () => {
      try {
        const res = await fetch(`${API_BASE}/contenido`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ seccion, clave, valor }),
        });
        if (res.status === 429) {
          const data = await res.json();
          mostrarToast(data.error || 'Limite de ediciones alcanzado', 'error');
          return;
        }
        if (res.status === 401) {
          cerrarSesion('Sesion expirada');
          return;
        }
      } catch (err) {
        console.error('Error guardando campo:', err);
      }
    }, 1200);
  }

  function handleCampoChange(seccion, clave, valor) {
    setCamposEditando(prev => ({ ...prev, [`${seccion}_${clave}`]: true }));
    guardarCampo(seccion, clave, valor);
  }

  async function toggleSeccion(slug, activa) {
    if (['hero', 'contacto'].includes(slug)) {
      mostrarToast('Esta seccion no se puede desactivar', 'warning');
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/secciones/toggle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ seccion_slug: slug, activa: !activa }),
      });
      if (!res.ok) {
        const data = await res.json();
        mostrarToast(data.error || 'Error al cambiar visibilidad', 'error');
        return;
      }
      setSecciones(prev =>
        prev.map(s => (s.slug === slug ? { ...s, activa: !activa } : s))
      );
      mostrarToast(`Seccion ${!activa ? 'activada' : 'desactivada'}`, 'success');
    } catch {
      mostrarToast('Error de conexion', 'error');
    }
  }

  async function agregarFoto() {
    if (!nuevaFotoUrl.trim()) {
      mostrarToast('Ingresa una URL de foto', 'warning');
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/foto`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          url: nuevaFotoUrl.trim(),
          descripcion: nuevaFotoDesc.trim(),
        }),
      });
      if (res.status === 429) {
        const data = await res.json();
        mostrarToast(data.error || 'Limite de fotos alcanzado', 'error');
        return;
      }
      if (!res.ok) {
        mostrarToast('Error al guardar foto', 'error');
        return;
      }
      const data = await res.json();
      setGaleriaFotos(prev => [
        ...prev,
        { clave: `foto_${Date.now()}`, url: nuevaFotoUrl.trim(), descripcion: nuevaFotoDesc.trim() },
      ]);
      setNuevaFotoUrl('');
      setNuevaFotoDesc('');
      if (limites) {
        setLimites(prev => ({
          ...prev,
          fotos_usadas: data.fotos_usadas || prev.fotos_usadas + 1,
        }));
      }
      mostrarToast('Foto agregada', 'success');
    } catch {
      mostrarToast('Error de conexion', 'error');
    }
  }

  async function eliminarFoto(clave) {
    try {
      const res = await fetch(`${API_BASE}/foto`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ clave }),
      });
      if (!res.ok) {
        mostrarToast('Error al eliminar foto', 'error');
        return;
      }
      setGaleriaFotos(prev => prev.filter(f => f.clave !== clave));
      if (limites) {
        setLimites(prev => ({
          ...prev,
          fotos_usadas: prev.fotos_usadas - 1,
        }));
      }
      mostrarToast('Foto eliminada', 'success');
    } catch {
      mostrarToast('Error de conexion', 'error');
    }
  }

  async function cargarPreview() {
    setCargando(true);
    try {
      const res = await fetch(`${API_BASE}/preview`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        mostrarToast('Error al generar preview', 'error');
        return;
      }
      const html = await res.text();
      setPreviewHtml(html);
      setMostrarPreview(true);
    } catch {
      mostrarToast('Error de conexion', 'error');
    } finally {
      setCargando(false);
    }
  }

  async function cambiarPlantilla(nuevaPlantilla) {
    if (nuevaPlantilla === plantillaActual) return;
    setCambiandoPlantilla(true);
    try {
      const res = await fetch(`${API_BASE}/plantilla`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ plantilla: nuevaPlantilla }),
      });
      const data = await res.json();
      if (!res.ok) {
        mostrarToast(data.error || 'Plantilla no disponible en tu plan', 'error');
        return;
      }
      setPlantillaActual(nuevaPlantilla);
      mostrarToast('Plantilla actualizada', 'success');
      if (mostrarPreview) {
        const previewRes = await fetch(`${API_BASE}/preview`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (previewRes.ok) setPreviewHtml(await previewRes.text());
      }
    } catch {
      mostrarToast('Error al cambiar plantilla', 'error');
    } finally {
      setCambiandoPlantilla(false);
    }
  }

  async function subirArchivo(e, clave) {
    const file = e.target.files?.[0];
    if (!file) return;
    setSubiendoImg(true);
    try {
      const formData = new FormData();
      formData.append('imagen', file);
      const res = await fetch(API_BASE + '/upload', {
        method: 'POST',
        headers: { Authorization: 'Bearer ' + token },
        body: formData,
      });
      if (!res.ok) { mostrarToast('Error al subir imagen', 'error'); return; }
      const data = await res.json();
      handleCampoChange(seccionActiva, clave, data.url);
      mostrarToast('Imagen subida', 'success');
    } catch { mostrarToast('Error de conexion', 'error'); }
    finally { setSubiendoImg(false); e.target.value = ''; }
  }

  async function generarImagenIA(clave) {
    setGenerandoImg(true);
    try {
      const res = await fetch(API_BASE + '/generar-imagen', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
        body: JSON.stringify({ descripcion: 'Imagen para portada de iglesia' + (dominio?.nombre_iglesia ? ' ' + dominio.nombre_iglesia : '') }),
      });
      if (!res.ok) { mostrarToast('Error al generar imagen', 'error'); return; }
      const data = await res.json();
      handleCampoChange(seccionActiva, clave, data.url);
      mostrarToast('Imagen generada', 'success');
    } catch { mostrarToast('Error de conexion', 'error'); }
    finally { setGenerandoImg(false); }
  }

  const seccionActual = secciones.find(s => s.slug === seccionActiva);
  const camposSeccion = seccionActual?.campos || [];
  const contenidoSeccion = contenido[seccionActiva] || {};

  function renderCampo(campo) {
    const valor = contenidoSeccion[campo.clave] || '';

    if (campo.tipo === 'textarea') {
      return (
        <div className="panel-campo" key={campo.clave}>
          <label className="panel-campo-label">{campo.label}</label>
          <textarea
            value={valor}
            onChange={e => handleCampoChange(seccionActiva, campo.clave, e.target.value)}
            placeholder={campo.label}
            rows={4}
          />
        </div>
      );
    }

    if (campo.tipo === 'image_url') {
      return (
        <div className="panel-campo" key={campo.clave}>
          <label className="panel-campo-label">{campo.label}</label>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'stretch' }}>
            <input
              type="text"
              value={valor}
              onChange={e => handleCampoChange(seccionActiva, campo.clave, e.target.value)}
              placeholder="URL de imagen"
              style={{ flex: 1 }}
            />
            <button
              type="button"
              onClick={() => document.getElementById('file-input-' + campo.clave)?.click()}
              className="panel-btn-sm"
              disabled={subiendoImg}
            >
              {subiendoImg ? '...' : 'Subir'}
            </button>
            <button
              type="button"
              onClick={() => generarImagenIA(campo.clave)}
              className="panel-btn-sm panel-btn-ia"
              disabled={generandoImg}
            >
              {generandoImg ? '...' : 'IA'}
            </button>
          </div>
          <input
            id={'file-input-' + campo.clave}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={e => subirArchivo(e, campo.clave)}
          />
          {valor && (
            <img
              src={valor}
              alt={campo.label}
              className="panel-campo-preview-img"
              onError={e => { e.target.style.display = 'none'; }}
            />
          )}
        </div>
      );
    }

    if (campo.tipo === 'email') {
      return (
        <div className="panel-campo" key={campo.clave}>
          <label className="panel-campo-label">{campo.label}</label>
          <input
            type="email"
            value={valor}
            onChange={e => handleCampoChange(seccionActiva, campo.clave, e.target.value)}
            placeholder={campo.label}
          />
        </div>
      );
    }

    return (
      <div className="panel-campo" key={campo.clave}>
        <label className="panel-campo-label">{campo.label}</label>
        <input
          type="text"
          value={valor}
          onChange={e => handleCampoChange(seccionActiva, campo.clave, e.target.value)}
          placeholder={campo.label}
        />
      </div>
    );
  }

  // ================================================================
  // LOGIN
  // ================================================================
  if (!logueado && !token) {
    return (
      <div className="panel-login-container">
        <div className="panel-login-card">
          <div className="panel-login-logo">+</div>
          <h1>Panel del Pastor</h1>
          <p className="panel-login-subtitle">TuWebIglesia</p>

          <form className="panel-login-form" onSubmit={handleLogin}>
            <label>
              Usuario
              <input
                type="text"
                value={usuario}
                onChange={e => setUsuario(e.target.value)}
                placeholder="usuario"
                autoFocus
                autoComplete="username"
              />
            </label>
            <label>
              Contrasena
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="********"
                autoComplete="current-password"
              />
            </label>

            {errorMsg && (
              <div className="panel-toast panel-toast-error" style={{ position: 'static', marginBottom: '1rem' }}>
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              className="panel-btn-primary"
              disabled={cargando || !usuario || !password}
            >
              {cargando ? 'Ingresando...' : 'Entrar al panel'}
            </button>
          </form>

          <div className="panel-login-help">
            <p>No tienes acceso? <a href="https://wa.me/56967236881" target="_blank" rel="noopener noreferrer">Contactanos por WhatsApp</a></p>
          </div>
        </div>
      </div>
    );
  }

  // ================================================================
  // CARGA INICIAL
  // ================================================================
  if (cargando && !secciones.length) {
    return (
      <div className="panel-container">
        <div className="panel-loading">
          <p>Cargando tu panel...</p>
        </div>
      </div>
    );
  }

  // ================================================================
  // PANEL PRINCIPAL
  // ================================================================
  return (
    <div className="panel-container">
      {/* Header */}
      <header className="panel-header">
        <div className="panel-header-left">
          <div className="panel-header-cross">+</div>
          <div>
            <h1>{dominio?.nombre_iglesia || iglesia?.nombre || 'Panel del Pastor'}</h1>
            <span className="panel-plan-badge">
              Plan {plan?.charAt(0).toUpperCase() + plan?.slice(1) || 'Fe'}
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <button
            className="panel-btn-logout"
            onClick={cargarPreview}
            disabled={cargando}
            title="Vista previa"
          >
            [Preview]
          </button>
          <button className="panel-btn-logout" onClick={() => cerrarSesion()}>
            Salir
          </button>
        </div>
      </header>

      {/* Barra de ediciones */}
      {limites && (
        <div className="panel-ediciones-bar">
          <div className="panel-ediciones-info">
            Ediciones este mes: <strong>{limites.ediciones_usadas || 0}</strong>
            {limites.ediciones_limite !== 'ilimitadas' && (
              <> / {limites.ediciones_limite} disponibles</>
            )}
            {' | '}
            Fotos: <strong>{limites.fotos_usadas || 0}</strong> / {limites.fotos_limite}
          </div>
          {limites.ediciones_limite !== 'ilimitadas' && (
            <div className="panel-ediciones-progress">
              <div
                className="panel-ediciones-fill"
                style={{
                  width: `${Math.min(100, ((limites.ediciones_usadas || 0) / limites.ediciones_limite) * 100)}%`,
                }}
              />
            </div>
          )}
        </div>
      )}

      {/* Navegacion de secciones */}
      <nav className="panel-nav">
        {secciones.map(sec => (
          <button
            key={sec.slug}
            className={`panel-nav-item ${seccionActiva === sec.slug ? 'active' : ''} ${!sec.activa ? 'inactive' : ''}`}
            onClick={() => setSeccionActiva(sec.slug)}
          >
            <span className="panel-nav-icon">{ICONOS[sec.slug] || '[-]'}</span>
            {NOMBRES_SECCIONES[sec.slug] || sec.nombre || sec.slug}
            {!sec.activa && <span style={{ fontSize: '0.7rem', opacity: 0.7, marginLeft: '0.25rem' }}>(oculta)</span>}
          </button>
        ))}
      </nav>

      {/* Editor */}
      <main className="panel-editor">
        {!seccionActiva && (
          <div className="panel-welcome">
            <p>Selecciona una seccion del menu para editar su contenido.</p>
            <p className="panel-welcome-hint">
              Los cambios se guardan automaticamente mientras escribes.
            </p>
          </div>
        )}

        {seccionActiva && seccionActiva === 'galeria' && (
          <div>
            <h2>[G] Galeria de Fotos</h2>
            <p className="panel-fotos-counter">
              {galeriaFotos.length} fotos
              {limites && <> (maximo: {limites.fotos_limite})</>}
            </p>

            <div style={{
              background: '#f8fafc',
              padding: '1rem',
              borderRadius: '8px',
              marginBottom: '1rem',
              border: '1px solid #e2e8f0',
            }}>
              <div className="panel-campo">
                <label className="panel-campo-label">Descripcion (opcional)</label>
                <input
                  type="text"
                  value={nuevaFotoDesc}
                  onChange={e => setNuevaFotoDesc(e.target.value)}
                  placeholder="Ej: Culto de domingo"
                />
              </div>
              <label
                className="panel-btn-primary"
                style={{ maxWidth: '250px', marginTop: '0.5rem', display: 'inline-block', textAlign: 'center', cursor: 'pointer' }}
              >
                {subiendoImg ? 'Subiendo...' : '+ Subir foto'}
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  disabled={subiendoImg}
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (!file) return;
                    setSubiendoImg(true);
                    try {
                      const formData = new FormData();
                      formData.append('imagen', file);
                      const res = await fetch(API_BASE + '/upload', {
                        method: 'POST',
                        headers: { Authorization: 'Bearer ' + token },
                        body: formData,
                      });
                      if (!res.ok) { mostrarToast('Error al subir imagen', 'error'); return; }
                      const data = await res.json();
                      const fotoUrl = data.url;
                      const res2 = await fetch(API_BASE + '/foto', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
                        body: JSON.stringify({ url: fotoUrl, descripcion: nuevaFotoDesc.trim() }),
                      });
                      if (!res2.ok) { mostrarToast('Error al guardar foto', 'error'); return; }
                      const data2 = await res2.json();
                      setGaleriaFotos(prev => [...prev, { clave: 'foto_' + Date.now(), url: fotoUrl, descripcion: nuevaFotoDesc.trim() }]);
                      setNuevaFotoDesc('');
                      if (limites) setLimites(prev => ({ ...prev, fotos_usadas: data2.fotos_usadas || prev.fotos_usadas + 1 }));
                      mostrarToast('Foto agregada', 'success');
                    } catch { mostrarToast('Error de conexion', 'error'); }
                    finally { setSubiendoImg(false); e.target.value = ''; }
                  }}
                />
              </label>
            </div>

            {galeriaFotos.length === 0 ? (
              <div className="panel-empty">
                No hay fotos en tu galeria. Agrega URLs de imagenes arriba.
              </div>
            ) : (
              <div className="panel-galeria-grid">
                {galeriaFotos.map(foto => (
                  <div key={foto.clave} className="panel-galeria-item">
                    <img
                      src={foto.url}
                      alt={foto.descripcion || 'Foto'}
                      onError={e => {
                        e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill="%23e2e8f0"><rect width="100" height="100"/><text x="50" y="55" text-anchor="middle" fill="%2394a3b8" font-size="12">Error</text></svg>';
                      }}
                    />
                    <button
                      className="panel-galeria-delete"
                      onClick={() => eliminarFoto(foto.clave)}
                      title="Eliminar foto"
                    >
                      x
                    </button>
                    {foto.descripcion && (
                      <div style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        background: 'rgba(0,0,0,0.6)',
                        color: '#fff',
                        padding: '4px 8px',
                        fontSize: '0.75rem',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}>
                        {foto.descripcion}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {seccionActiva && seccionActiva !== 'galeria' && (
          <div>
            <h2>
              <span style={{ marginRight: '0.5rem' }}>{ICONOS[seccionActiva] || '[-]'}</span>
              {NOMBRES_SECCIONES[seccionActiva] || seccionActual?.nombre || seccionActiva}
            </h2>

            {seccionActual && !['hero', 'contacto'].includes(seccionActual.slug) && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                marginBottom: '1rem',
                padding: '0.6rem 1rem',
                background: '#f8fafc',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                fontSize: '0.85rem',
              }}>
                <span>Mostrar en la web:</span>
                <button
                  onClick={() => toggleSeccion(seccionActual.slug, seccionActual.activa)}
                  style={{
                    padding: '0.25rem 0.75rem',
                    borderRadius: '6px',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: '0.8rem',
                    background: seccionActual.activa ? '#059669' : '#94a3b8',
                    color: '#fff',
                    fontFamily: 'inherit',
                  }}
                >
                  {seccionActual.activa ? 'Visible' : 'Oculta'}
                </button>
              </div>
            )}

            {camposSeccion.length === 0 ? (
              <div className="panel-empty">
                Esta seccion no tiene campos editables.
              </div>
            ) : (
              <div className="panel-campos">
                {camposSeccion.map(campo => renderCampo(campo))}
              </div>
            )}

            <div className="panel-editor-actions">
              <p style={{
                fontSize: '0.8rem',
                color: '#94a3b8',
                textAlign: 'center',
              }}>
                [i] Los campos se guardan automaticamente mientras escribes
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Modal Preview */}
      {mostrarPreview && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.85)',
            zIndex: 999,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.75rem 1.5rem',
            background: '#1e293b',
            color: '#fff',
          }}>
            <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>
              [*] Vista previa de tu web
            </span>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              {plantillasDisponibles.length > 1 && (
                <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Plantilla:</span>
                  <select
                    value={plantillaActual}
                    onChange={e => cambiarPlantilla(e.target.value)}
                    disabled={cambiandoPlantilla}
                    style={{
                      padding: '0.3rem 0.6rem',
                      borderRadius: '6px',
                      border: '1px solid #475569',
                      background: '#334155',
                      color: '#fff',
                      fontSize: '0.8rem',
                      fontFamily: 'inherit',
                      cursor: 'pointer',
                    }}
                  >
                    {plantillasDisponibles.map(p => (
                      <option key={p} value={p}>
                        {p.charAt(0).toUpperCase() + p.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <button
                onClick={() => {
                  fetch(`${API_BASE}/preview`, {
                    headers: { Authorization: `Bearer ${token}` },
                  })
                    .then(r => r.text())
                    .then(html => setPreviewHtml(html))
                    .catch(() => mostrarToast('Error al recargar preview', 'error'));
                }}
                style={{
                  padding: '0.3rem 0.6rem',
                  borderRadius: '6px',
                  border: '1px solid #475569',
                  background: '#334155',
                  color: '#fff',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
                title="Recargar"
              >
                [R]
              </button>
              <button
                onClick={() => setMostrarPreview(false)}
                style={{
                  padding: '0.4rem 1rem',
                  borderRadius: '6px',
                  border: 'none',
                  background: '#ef4444',
                  color: '#fff',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                Cerrar
              </button>
            </div>
          </div>

          <iframe
            title="preview"
            srcDoc={previewHtml}
            style={{
              flex: 1,
              border: 'none',
              width: '100%',
              background: '#fff',
            }}
          />
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className={`panel-toast panel-toast-${toast.tipo}`}>
          {toast.mensaje}
        </div>
      )}
    </div>
  );
}

export default Panel;
