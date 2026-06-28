import { useState, useEffect } from 'react';
import './Admin.css';

const API_ROOT = 'https://church-generator-api-production.up.railway.app/api';

export default function Admin() {
  const [token, setToken] = useState(localStorage.getItem('admin_token') || '');
  const [logueado, setLogueado] = useState(false);
  const [tokenInput, setTokenInput] = useState('');
  const [errorLogin, setErrorLogin] = useState('');

  const [tab, setTab] = useState('misioneros');
  const [misioneros, setMisioneros] = useState([]);
  const [iglesias, setIglesias] = useState([]);
  const [ventas, setVentas] = useState(null);
  const [cargando, setCargando] = useState(false);

  // Form nuevo misionero
  const [mostrarFormNuevo, setMostrarFormNuevo] = useState(false);
  const [nuevoCodigo, setNuevoCodigo] = useState('');
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [nuevoWhatsapp, setNuevoWhatsapp] = useState('');
  const [nuevoEmail, setNuevoEmail] = useState('');
  const [errorForm, setErrorForm] = useState('');

  // Modal observacion
  const [iglesiaObs, setIglesiaObs] = useState(null);
  const [textoObs, setTextoObs] = useState('');

  // Auto-login si hay token guardado
  useEffect(() => {
    if (token) verificarToken(token);
  }, []);

  async function verificarToken(t) {
    try {
      const r = await fetch(`${API_ROOT}/misioneros/admin`, {
        headers: { 'x-admin-token': t },
      });
      if (r.ok) {
        setLogueado(true);
        cargarTodo(t);
      } else {
        localStorage.removeItem('admin_token');
        setToken('');
      }
    } catch (e) {
      console.error(e);
    }
  }

  function login(e) {
    e.preventDefault();
    setErrorLogin('');
    if (!tokenInput.trim()) {
      setErrorLogin('Ingresa el token');
      return;
    }
    fetch(`${API_ROOT}/misioneros/admin`, {
      headers: { 'x-admin-token': tokenInput.trim() },
    }).then((r) => {
      if (r.ok) {
        localStorage.setItem('admin_token', tokenInput.trim());
        setToken(tokenInput.trim());
        setLogueado(true);
        cargarTodo(tokenInput.trim());
      } else {
        setErrorLogin('Token incorrecto');
      }
    });
  }

  function logout() {
    localStorage.removeItem('admin_token');
    setToken('');
    setLogueado(false);
    setTokenInput('');
  }

  async function cargarTodo(t = token) {
    setCargando(true);
    try {
      const headers = { 'x-admin-token': t };
      const [rMis, rIgl, rVen] = await Promise.all([
        fetch(`${API_ROOT}/misioneros/admin`, { headers }),
        fetch(`${API_ROOT}/iglesias/admin/listar`, { headers }),
        fetch(`${API_ROOT}/misioneros/admin/ventas`, { headers }),
      ]);
      const dMis = await rMis.json();
      const dIgl = await rIgl.json();
      const dVen = await rVen.json();
      setMisioneros(dMis.misioneros || []);
      setIglesias(dIgl.iglesias || []);
      setVentas(dVen);
    } catch (e) {
      console.error(e);
    }
    setCargando(false);
  }

  async function crearMisionero(e) {
    e.preventDefault();
    setErrorForm('');
    if (!nuevoCodigo.trim() || !nuevoNombre.trim()) {
      setErrorForm('Código y nombre son obligatorios');
      return;
    }
    const r = await fetch(`${API_ROOT}/misioneros/admin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-token': token },
      body: JSON.stringify({
        codigo: nuevoCodigo.trim().toUpperCase(),
        nombre: nuevoNombre.trim(),
        whatsapp: nuevoWhatsapp.trim() || null,
        email: nuevoEmail.trim() || null,
      }),
    });
    const data = await r.json();
    if (!r.ok || !data.exito) {
      setErrorForm(data.error || 'Error al crear');
      return;
    }
    setNuevoCodigo('');
    setNuevoNombre('');
    setNuevoWhatsapp('');
    setNuevoEmail('');
    setMostrarFormNuevo(false);
    cargarTodo();
  }

  async function desactivarMisionero(id, nombre) {
    if (!confirm(`¿Desactivar a ${nombre}? El código dejará de funcionar.`)) return;
    await fetch(`${API_ROOT}/misioneros/admin/${id}`, {
      method: 'DELETE',
      headers: { 'x-admin-token': token },
    });
    cargarTodo();
  }

  async function reactivarMisionero(id) {
    await fetch(`${API_ROOT}/misioneros/admin/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'x-admin-token': token },
      body: JSON.stringify({ activo: true }),
    });
    cargarTodo();
  }

  async function guardarObservacion() {
    if (!textoObs.trim()) return;
    const r = await fetch(`${API_ROOT}/iglesias/admin/${iglesiaObs.id}/observacion`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-token': token },
      body: JSON.stringify({ texto: textoObs.trim() }),
    });
    if (r.ok) {
      setTextoObs('');
      setIglesiaObs(null);
      cargarTodo();
    } else {
      alert('Error al guardar');
    }
  }

  function formatearCLP(n) {
    return '$' + (n || 0).toLocaleString('es-CL');
  }

  function formatearFecha(f) {
    if (!f) return '—';
    return new Date(f).toLocaleDateString('es-CL', {
      day: '2-digit', month: '2-digit', year: 'numeric',
    });
  }

  // ============================================================
  // LOGIN
  // ============================================================
  async function crearAccesoPastor(iglesiaId, nombreIglesia) {
    const usuario = prompt('Usuario para ' + nombreIglesia + ':');
    if (!usuario) return;
    const password = prompt('Contraseña:');
    if (!password) return;
    try {
      const r = await fetch(API_ROOT + '/panel/crear-acceso', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-token': token },
        body: JSON.stringify({ iglesia_id: iglesiaId, usuario, password }),
      });
      const data = await r.json();
      if (r.ok) {
        alert('Acceso creado para ' + usuario + '. El pastor puede entrar en tuwebiglesia.cl/panel');
      } else {
        alert('Error: ' + (data.error || 'No se pudo crear'));
      }
    } catch { alert('Error de conexion'); }
  }

  if (!logueado) {
    return (
      <div className="admin-login-wrap">
        <form className="admin-login-box" onSubmit={login}>
          <h1>Panel Admin</h1>
          <p className="admin-login-sub">TuWebIglesia</p>
          <input
            type="password"
            placeholder="Token de acceso"
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
            autoFocus
          />
          {errorLogin && <div className="admin-err">{errorLogin}</div>}
          <button type="submit">Entrar</button>
        </form>
      </div>
    );
  }

  // ============================================================
  // PANEL
  // ============================================================
  return (
    <div className="landing"><div className="admin-wrap">
      <header className="admin-header">
        <h1>Panel TuWebIglesia</h1>
        <button className="admin-logout" onClick={logout}>Cerrar sesión</button>
      </header>

      <nav className="admin-tabs">
        <button
          className={tab === 'misioneros' ? 'active' : ''}
          onClick={() => setTab('misioneros')}
        >
          Misioneros ({misioneros.length})
        </button>
        <button
          className={tab === 'iglesias' ? 'active' : ''}
          onClick={() => setTab('iglesias')}
        >
          Iglesias ({iglesias.length})
        </button>
        <button
          className={tab === 'ventas' ? 'active' : ''}
          onClick={() => setTab('ventas')}
        >
          Ventas
        </button>
        <button className="admin-refresh" onClick={() => cargarTodo()}>
          {cargando ? '...' : '↻'}
        </button>
      </nav>

      {/* MISIONEROS */}
      {tab === 'misioneros' && (
        <section className="admin-section">
          <div className="admin-section-head">
            <h2>Misioneros</h2>
            <button
              className="admin-btn-primary"
              onClick={() => setMostrarFormNuevo(!mostrarFormNuevo)}
            >
              {mostrarFormNuevo ? 'Cancelar' : '+ Agregar misionero'}
            </button>
          </div>

          {mostrarFormNuevo && (
            <form className="admin-form-nuevo" onSubmit={crearMisionero}>
              <input
                type="text"
                placeholder="Código (ej: JUAN20)"
                value={nuevoCodigo}
                onChange={(e) => setNuevoCodigo(e.target.value.toUpperCase())}
                autoFocus
              />
              <input
                type="text"
                placeholder="Nombre completo"
                value={nuevoNombre}
                onChange={(e) => setNuevoNombre(e.target.value)}
              />
              <input
                type="text"
                placeholder="WhatsApp (opcional)"
                value={nuevoWhatsapp}
                onChange={(e) => setNuevoWhatsapp(e.target.value)}
              />
              <input
                type="email"
                placeholder="Email (opcional)"
                value={nuevoEmail}
                onChange={(e) => setNuevoEmail(e.target.value)}
              />
              {errorForm && <div className="admin-err">{errorForm}</div>}
              <button type="submit" className="admin-btn-primary">Guardar</button>
            </form>
          )}

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Nombre</th>
                  <th>WhatsApp</th>
                  <th>Email</th>
                  <th>Estado</th>
                  <th>Alta</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {misioneros.length === 0 && (
                  <tr><td colSpan="7" className="admin-empty">No hay misioneros aún</td></tr>
                )}
                {misioneros.map((m) => (
                  <tr key={m.id} className={!m.activo ? 'inactivo' : ''}>
                    <td><strong>{m.codigo}</strong></td>
                    <td>{m.nombre}</td>
                    <td>{m.whatsapp || '—'}</td>
                    <td>{m.email || '—'}</td>
                    <td>
                      <span className={`admin-badge ${m.activo ? 'on' : 'off'}`}>
                        {m.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td>{formatearFecha(m.creado_en)}</td>
                    <td>
                      {m.activo ? (
                        <button
                          className="admin-btn-mini-danger"
                          onClick={() => desactivarMisionero(m.id, m.nombre)}
                        >
                          Desactivar
                        </button>
                      ) : (
                        <button
                          className="admin-btn-mini"
                          onClick={() => reactivarMisionero(m.id)}
                        >
                          Reactivar
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* IGLESIAS */}
      {tab === 'iglesias' && (
        <section className="admin-section">
          <h2>Iglesias aprobadas</h2>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Iglesia</th>
                  <th>WhatsApp</th>
                  <th>Email</th>
                  <th>Plan</th>
                  <th>Código ref.</th>
                  <th>Fecha</th>
                  <th>Observaciones</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {iglesias.length === 0 && (
                  <tr><td colSpan="9" className="admin-empty">No hay iglesias aún</td></tr>
                )}
                {iglesias.map((i) => (
                  <tr key={i.id}>
                    <td>{i.id}</td>
                    <td><strong>{i.nombre_iglesia}</strong></td>
                    <td>{i.whatsapp_contacto || '—'}</td>
                    <td>{i.email_contacto || '—'}</td>
                    <td><span className="admin-badge plan">{i.plan_seleccionado}</span></td>
                    <td>{i.codigo_referencia || '—'}</td>
                    <td>{formatearFecha(i.fecha_creacion)}</td>
                    <td className="admin-obs-cell">
                      {i.observaciones ? (
                        <pre>{i.observaciones}</pre>
                      ) : <span className="admin-muted">Sin notas</span>}
                    </td>
                    <td>
                      <button
                        className="admin-btn-mini"
                        onClick={() => { setIglesiaObs(i); setTextoObs(''); }}
                      >
                        + Nota
                      </button>
                      <button
                        className="admin-btn-mini"
                        style={{ marginLeft: '4px' }}
                        onClick={() => crearAccesoPastor(i.id, i.nombre_iglesia)}
                      >
                        🔑 Acceso
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* VENTAS */}
      {tab === 'ventas' && (
        <section className="admin-section">
          <h2>Ventas y comisiones por misionero</h2>
          {ventas && (
            <p className="admin-muted">
              Comisión setup: {ventas.comisiones?.setup_pct}% · Comisión mensual: {ventas.comisiones?.mensual_pct}%
            </p>
          )}
          {(!ventas || !ventas.ventas || ventas.ventas.length === 0) && (
            <p className="admin-empty">Aún no hay ventas con código de referencia</p>
          )}
          {ventas?.ventas?.map((v) => (
            <div key={v.codigo} className="admin-misionero-card">
              <div className="admin-misionero-head">
                <div>
                  <strong>{v.codigo}</strong> — {v.nombre}
                  {!v.registrado && <span className="admin-badge off"> Sin registrar</span>}
                </div>
                <div className="admin-totales">
                  <span>{v.totales.cantidad_iglesias} iglesias</span>
                  <span>Setup: <strong>{formatearCLP(v.totales.comision_setup_total)}</strong></span>
                  <span>Mensual: <strong>{formatearCLP(v.totales.comision_mensual_total)}</strong></span>
                </div>
              </div>
              <table className="admin-table-mini">
                <thead>
                  <tr>
                    <th>Iglesia</th>
                    <th>Plan</th>
                    <th>Fecha</th>
                    <th>Setup</th>
                    <th>Mensual</th>
                  </tr>
                </thead>
                <tbody>
                  {v.iglesias.map((ig) => (
                    <tr key={ig.id}>
                      <td>{ig.nombre}</td>
                      <td>{ig.plan}</td>
                      <td>{formatearFecha(ig.creada_en)}</td>
                      <td>{formatearCLP(ig.comision_setup)}</td>
                      <td>{formatearCLP(ig.comision_mensual)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </section>
      )}

      {/* MODAL OBSERVACION */}
      {iglesiaObs && (
        <div className="admin-modal-bg" onClick={() => setIglesiaObs(null)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Agregar nota a {iglesiaObs.nombre_iglesia}</h3>
            <textarea
              placeholder="Ej: Pastor pidió cambiar horario del domingo a 10:30"
              value={textoObs}
              onChange={(e) => setTextoObs(e.target.value)}
              rows={5}
              autoFocus
            />
            <div className="admin-modal-actions">
              <button onClick={() => setIglesiaObs(null)}>Cancelar</button>
              <button className="admin-btn-primary" onClick={guardarObservacion}>
                Guardar nota
              </button>
            </div>
          </div>
        </div>
      )}
    </div></div>
  );
}