// import { useEffect, useState } from 'react';
// import api from '../api/api';
// // import { toast } from 'react-toastify';

// const Usuarios = () => {
//   const [usuarios, setUsuarios] = useState([]);
//   const [roles, setRoles] = useState([]);

//   const [form, setForm] = useState({
//     nombre: '',
//     email: '',
//     password: '',
//     rol_id: ''
//   });

//   // =============================
//   // Cargar usuarios
//   // =============================
//   const cargarUsuarios = async () => {
//     try {
//       const res = await api.get('/usuarios');
//       setUsuarios(res.data);
//     } catch (error) {
//       console.error(error);
//     //   toast.error('Error cargando usuarios');
//     }
//   };

//   // =============================
//   // Cargar roles
//   // =============================
//   const cargarRoles = async () => {
//     try {
//       const res = await api.get('/roles');
//       setRoles(res.data);
//     } catch (error) {
//       console.error(error);
//     //   toast.error('Error cargando roles');
//     }
//   };

//   useEffect(() => {
//     cargarUsuarios();
//     cargarRoles();
//   }, []);

//   // =============================
//   // Crear usuario
//   // =============================
//   const crearUsuario = async () => {
//     if (!form.nombre || !form.email || !form.password || !form.rol_id) {
//     //   toast.error('Complete todos los campos');
//       return;
//     }

//     try {
//       await api.post('/usuarios', form);
//     //   toast.success('Usuario creado');

//       setForm({
//         nombre: '',
//         email: '',
//         password: '',
//         rol_id: ''
//       });

//       cargarUsuarios();
//     } catch (error) {
//       console.error(error);
//     //   toast.error(error.response?.data?.error || 'Error al crear usuario');
//     }
//   };

//   // =============================
//   // Render
//   // =============================
//   return (
//     <div style={{ padding: '20px' }}>
//       <h2>Gestión de Usuarios</h2>

//       {/* FORMULARIO */}
//       <div style={{ marginBottom: '20px' }}>
//         <input
//           placeholder="Nombre"
//           value={form.nombre}
//           onChange={e => setForm({ ...form, nombre: e.target.value })}
//         />

//         <input
//           placeholder="Email"
//           value={form.email}
//           onChange={e => setForm({ ...form, email: e.target.value })}
//         />

//         <input
//           type="password"
//           placeholder="Password"
//           value={form.password}
//           onChange={e => setForm({ ...form, password: e.target.value })}
//         />

//         <select
//           value={form.rol_id}
//           onChange={e => setForm({ ...form, rol_id: e.target.value })}
//         >
//           <option value="">Seleccione rol</option>
//           {roles.map(r => (
//             <option key={r.id} value={r.id}>
//               {r.nombre}
//             </option>
//           ))}
//         </select>

//         <button onClick={crearUsuario}>Crear Usuario</button>
//       </div>

//       {/* TABLA */}
//       <table border="1" cellPadding="8" width="100%">
//         <thead>
//           <tr>
//             <th>Nombre</th>
//             <th>Email</th>
//             <th>Rol</th>
//             <th>Estado</th>
//           </tr>
//         </thead>
//         <tbody>
//           {usuarios.map(u => (
//             <tr key={u.id}>
//               <td>{u.nombre}</td>
//               <td>{u.email}</td>
//               <td>{u.rol}</td>
//               <td>{u.estado ? 'Activo' : 'Inactivo'}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default Usuarios;


import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import '../css/Usuarios.css';

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [form, setForm] = useState({
    nombre: '',
    email: '',
    password: '',
    rol_id: '',
    telefono: '',
    estado: 'ACTIVO'
  });
  const [editingId, setEditingId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' o 'edit'
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const navigate = useNavigate();

  // =============================
  // Cargar usuarios
  // =============================
  const cargarUsuarios = async () => {
    try {
      setLoading(true);
      const res = await api.get('/usuarios');
      setUsuarios(res.data);
    } catch (error) {
      mostrarNotificacion('Error cargando usuarios', 'error');
    } finally {
      setLoading(false);
    }
  };

  // =============================
  // Cargar roles
  // =============================
  const cargarRoles = async () => {
    try {
      const res = await api.get('/roles');
      setRoles(res.data);
    } catch (error) {
      mostrarNotificacion('Error cargando roles', 'error');
    }
  };

  useEffect(() => {
    cargarUsuarios();
    cargarRoles();
  }, []);

  // =============================
  // Manejar cambios en el formulario
  // =============================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // =============================
  // Abrir modal para crear usuario
  // =============================
  const openCreateModal = () => {
    setForm({
      nombre: '',
      email: '',
      password: '',
      rol_id: '',
      telefono: '',
      estado: 'ACTIVO'
    });
    setModalMode('create');
    setModalOpen(true);
  };

  // =============================
  // Abrir modal para editar usuario
  // =============================
  const openEditModal = (usuario) => {
    setForm({
      nombre: usuario.nombre,
      email: usuario.email,
      password: '', // Dejar vacío por seguridad
      rol_id: usuario.rol_id,
      telefono: usuario.telefono || '',
      estado: usuario.estado ? 'ACTIVO' : 'INACTIVO'
    });
    setEditingId(usuario.id);
    setModalMode('edit');
    setModalOpen(true);
  };

  // =============================
  // Cerrar modal
  // =============================
  const closeModal = () => {
    setModalOpen(false);
    setEditingId(null);
  };

  // =============================
  // Crear/Editar usuario
  // =============================
  const guardarUsuario = async (e) => {
    e.preventDefault();
    
    if (!form.nombre || !form.email || !form.rol_id) {
      mostrarNotificacion('Complete los campos obligatorios', 'warning');
      return;
    }

    if (modalMode === 'create' && !form.password) {
      mostrarNotificacion('La contraseña es obligatoria', 'warning');
      return;
    }

    try {
      const usuarioData = {
        ...form,
        estado: form.estado === 'ACTIVO'
      };

      // Remover password si está vacío en edición
      if (modalMode === 'edit' && !form.password) {
        delete usuarioData.password;
      }

      if (modalMode === 'create') {
        await api.post('/usuarios', usuarioData);
        mostrarNotificacion('Usuario creado exitosamente', 'success');
      } else {
        await api.put(`/usuarios/${editingId}`, usuarioData);
        mostrarNotificacion('Usuario actualizado exitosamente', 'success');
      }
      
      cargarUsuarios();
      closeModal();
    } 
    // catch (error) {
    //   mostrarNotificacion(error.response?.data?.error || 'Error al guardar usuario', 'error');
    //   console.log(error.mensaje);
    // }
    catch (error) {
  const data = error.response?.data;

  if (data) {
    // Mensaje principal
    mostrarNotificacion(data.mensaje, 'error');

    // Mostrar errores detallados si existen
    if (Array.isArray(data.errores)) {
      data.errores.forEach(err => {
        mostrarNotificacion(err, 'warning');
      });
    }

    // Mostrar nivel de seguridad
    if (data.nivel) {
      mostrarNotificacion(
        `Nivel de seguridad de la contraseña: ${data.nivel}`,
        data.nivel === 'Fuerte' ? 'success' : 'error'
      );
    }
  } else {
    mostrarNotificacion('Error al guardar usuario', 'error');
  }

  console.error(error);
}

  };

  // =============================
  // Cambiar estado de usuario
  // =============================
  const cambiarEstado = async (id, estadoActual) => {
    try {
      await api.put(`/usuarios/${id}`, {
        estado: !estadoActual
      });
      mostrarNotificacion('Estado actualizado', 'success');
      cargarUsuarios();
    } catch (error) {
      mostrarNotificacion('Error al cambiar estado', 'error');
    }
  };

  // =============================
  // Eliminar usuario
  // =============================
  const eliminarUsuario = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este usuario? Esta acción no se puede deshacer.')) {
      try {
        await api.put(`/usuarios/${id}/desactivar`);
        mostrarNotificacion('Usuario eliminado exitosamente', 'success');
        cargarUsuarios();
      } catch (error) {
        mostrarNotificacion('Error al eliminar usuario', 'error');
      }
    }
  };

  // =============================
  // Mostrar notificación
  // =============================
  const mostrarNotificacion = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  // =============================
  // Filtrar usuarios
  // =============================
  const usuariosFiltrados = usuarios.filter(usuario =>
    usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    usuario.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (usuario.rol && usuario.rol.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // =============================
  // Estadísticas
  // =============================
  const totalUsuarios = usuarios.length;
  const usuariosActivos = usuarios.filter(u => u.estado).length;
  const usuariosInactivos = usuarios.filter(u => !u.estado).length;
  const administradores = usuarios.filter(u => u.rol === 'ADMIN' || u.rol_id === '4f4b8c7a-2223-4dee-9bce-f13b960d30f9').length;

  // =============================
  // Formatear fecha
  // =============================
  const formatDate = (dateString) => {
    if (!dateString) return 'No disponible';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="usuarios-container">
      {/* Notificación */}
      {notification.show && (
        <div className={`notification notification-${notification.type}`}>
          {notification.message}
        </div>
      )}

      {/* Header */}
      <div className="usuarios-header">
        <div className="header-left">
          <button 
            className="btn-back"
            onClick={() => navigate('/')}
            title="Volver al Dashboard"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Dashboard
          </button>
          <div className="header-title">
            <h1 className="page-title">Gestión de Usuarios</h1>
            <p className="page-subtitle">Administre los usuarios del sistema</p>
          </div>
        </div>
        <div className="header-right">
          <button className="btn-primary" onClick={openCreateModal}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Nuevo Usuario
          </button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon total">👥</div>
          <div className="stat-content">
            <div className="stat-value">{totalUsuarios}</div>
            <div className="stat-label">Total Usuarios</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon active">✅</div>
          <div className="stat-content">
            <div className="stat-value">{usuariosActivos}</div>
            <div className="stat-label">Usuarios Activos</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon inactive">⏸️</div>
          <div className="stat-content">
            <div className="stat-value">{usuariosInactivos}</div>
            <div className="stat-label">Usuarios Inactivos</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon admin">👑</div>
          <div className="stat-content">
            <div className="stat-value">{administradores}</div>
            <div className="stat-label">Administradores</div>
          </div>
        </div>
      </div>

      {/* Barra de búsqueda */}
      <div className="search-bar">
        <div className="search-container">
          <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Buscar usuario por nombre, email o rol..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {searchTerm && (
            <button 
              className="btn-clear-search"
              onClick={() => setSearchTerm('')}
            >
              ✕
            </button>
          )}
        </div>
        
        {/* <div className="filter-actions">
          <select 
            className="filter-select"
            onChange={(e) => {
              // Filtro adicional por estado
              if (e.target.value === 'all') return;
              // Implementar lógica de filtro si es necesario
            }}
          >
            <option value="all">Todos los usuarios</option>
            <option value="active">Solo activos</option>
            <option value="inactive">Solo inactivos</option>
            <option value="admin">Solo administradores</option>
          </select>
        </div> */}
      </div>

      {/* Tabla de usuarios */}
      <div className="table-card">
        <div className="card-header">
          <h3 className="card-title">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13 0h-6m6 0V9a3 3 0 00-6 0v3.646M16 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            Lista de Usuarios
            <span className="table-count">{usuariosFiltrados.length} registros</span>
          </h3>
          <div className="card-actions">
            <button 
              className="btn-refresh"
              onClick={cargarUsuarios}
              title="Actualizar"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Cargando usuarios...</p>
          </div>
        ) : usuariosFiltrados.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">👤</div>
            <h3>No se encontraron usuarios</h3>
            <p className="empty-subtitle">
              {searchTerm ? 'Intenta con otros términos de búsqueda' : 'No hay usuarios registrados'}
            </p>
            {searchTerm && (
              <button 
                className="btn-clear-search-main"
                onClick={() => setSearchTerm('')}
              >
                Limpiar búsqueda
              </button>
            )}
            <button 
              className="btn-create-first"
              onClick={openCreateModal}
            >
              + Crear primer usuario
            </button>
          </div>
        ) : (
          <div className="table-container">
            <table className="usuarios-table">
              <thead>
                <tr>
                  <th>Usuario</th>
                  {/* <th>Información</th> */}
                  <th>Rol</th>
                  <th>Estado</th>
                  <th>Registro</th>
                  <th className="text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuariosFiltrados.map(usuario => (
                  <tr key={usuario.id}>
                    <td>
                      <div className="usuario-info">
                        <div className="usuario-avatar">
                          {usuario.nombre.charAt(0).toUpperCase()}
                        </div>
                        <div className="usuario-details">
                          <div className="usuario-nombre">{usuario.nombre}</div>
                          <div className="usuario-email">{usuario.email}</div>
                        </div>
                      </div>
                    </td>
                    {/* <td>
                      <div className="usuario-contacto">
                        {usuario.telefono && (
                          <div className="contacto-telefono">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            {usuario.telefono}
                          </div>
                        )}
                        <div className="ultimo-login">
                          Último acceso: {formatDate(usuario.ultimo_login)}
                        </div>
                      </div>
                    </td> */}
                    <td>
                      <span className={`rol-badge ${usuario.rol === 'ADMIN' ? 'badge-admin' : 'badge-user'}`}>
                        {usuario.rol || 'Usuario'}
                      </span>
                    </td>
                    <td>
                      <div className="estado-container">
                        <span className={`estado-badge ${usuario.estado ? 'estado-activo' : 'estado-inactivo'}`}>
                          {usuario.estado ? 'Activo' : 'Inactivo'}
                        </span>
                        <button 
                          className="btn-toggle-estado"
                          onClick={() => cambiarEstado(usuario.id, usuario.estado)}
                          title={usuario.estado ? 'Desactivar usuario' : 'Activar usuario'}
                        >
                          {/* {usuario.estado ? '⏸️' : '▶️'} */}
                        </button>
                      </div>
                    </td>
                    <td>
                      <div className="registro-info">
                        <div className="registro-fecha">
                          Creado: {formatDate(usuario.created_at)}
                        </div>
                        {usuario.updated_at && usuario.updated_at !== usuario.created_at && (
                          <div className="actualizacion-fecha">
                            Actualizado: {formatDate(usuario.updated_at)}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="text-center">
                      <div className="action-buttons">
                        <button 
                          className="btn-action btn-edit"
                          onClick={() => openEditModal(usuario)}
                          title="Editar"
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button 
                          className="btn-action btn-delete"
                          onClick={() => eliminarUsuario(usuario.id)}
                          title="Eliminar"
                          disabled={usuario.id === 1} // No permitir eliminar al superadmin
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                        <button 
                          className="btn-action btn-reset"
                          onClick={() => {/* Lógica para resetear contraseña */}}
                          title="Resetear contraseña"
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal para crear/editar usuario */}
      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h3 className="modal-title">
                {modalMode === 'create' ? 'Nuevo Usuario' : 'Editar Usuario'}
              </h3>
              <button className="modal-close" onClick={closeModal}>
                ×
              </button>
            </div>

            <form onSubmit={guardarUsuario} className="modal-form">
              <div className="form-group">
                <label className="form-label">Nombre Completo *</label>
                <input
                  name="nombre"
                  placeholder="Ej: Juan Pérez"
                  value={form.nombre}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Email *</label>
                  <input
                    name="email"
                    type="email"
                    placeholder="usuario@empresa.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    {modalMode === 'create' ? 'Contraseña *' : 'Nueva Contraseña'}
                  </label>
                  <input
                    name="password"
                    type="password"
                    placeholder={modalMode === 'create' ? '********' : 'Dejar vacío para no cambiar'}
                    value={form.password}
                    onChange={handleChange}
                    required={modalMode === 'create'}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-row">
                {/* <div className="form-group">
                  <label className="form-label">Teléfono</label>
                  <input
                    name="telefono"
                    placeholder="Ej: 77712345"
                    value={form.telefono}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div> */}

                <div className="form-group">
                  <label className="form-label">Rol *</label>
                  <select
                    name="rol_id"
                    value={form.rol_id}
                    onChange={handleChange}
                    required
                    className="form-select"
                  >
                    <option value="">Seleccione un rol</option>
                    {roles.map(rol => (
                      <option key={rol.id} value={rol.id}>
                        {rol.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Estado *</label>
                <select
                  name="estado"
                  value={form.estado}
                  onChange={handleChange}
                  required
                  className="form-select"
                >
                  <option value="ACTIVO">Activo</option>
                  <option value="INACTIVO">Inactivo</option>
                </select>
              </div>

              <div className="modal-actions">
                <button 
                  type="button" 
                  className="btn-secondary"
                  onClick={closeModal}
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="btn-primary"
                >
                  {modalMode === 'create' ? 'Crear Usuario' : 'Guardar Cambios'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Usuarios;