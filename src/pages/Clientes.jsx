// import { useEffect, useState } from 'react';
// import api from '../api/api';

// const Clientes = () => {
//   const [clientes, setClientes] = useState([]);
//   const [form, setForm] = useState({ nombre: '', ci_nit: '', telefono: '' });

//   const cargar = async () => {
//     const res = await api.get('/clientes');
//     setClientes(res.data);
//   };

//   useEffect(() => {
//     cargar();
//   }, []);

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const guardar = async () => {
//     if (!form.nombre) return alert('Ingrese el nombre');

//     await api.post('/clientes', form); // tu backend lo maneja igual

//     setForm({ nombre: '', ci_nit: '', telefono: '' });
//     cargar(); // refresca lista
//   };

//   return (
//     <div>
//       <h2>Clientes</h2>

//       <input
//         placeholder="Nombre"
//         name="nombre"
//         value={form.nombre}
//         onChange={handleChange}
//       />
//       <input
//         placeholder="NIT/CI"
//         name="ci_nit"
//         value={form.ci_nit}
//         onChange={handleChange}
//       />
//       <input
//         placeholder="Teléfono"
//         name="telefono"
//         value={form.telefono}
//         onChange={handleChange}
//       />
//       <button onClick={guardar}>Guardar</button>

//       <h3>Lista de Clientes</h3>
//       <ul>
//         {clientes.map(c => (
//           <li key={c.id}>
//             {c.nombre} - {c.ci_nit} - {c.telefono}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default Clientes;

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import '../css/Clientes.css';

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [form, setForm] = useState({ 
    nombre: '', 
    ci_nit: '', 
    telefono: '',
    email: '',
    direccion: '',
    tipo: 'NATURAL' // NATURAL o JURIDICA
  });
  const [editingId, setEditingId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' o 'edit'
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const navigate = useNavigate();

  const cargarClientes = async () => {
    try {
      setLoading(true);
      const res = await api.get('/clientes');
      setClientes(res.data);
    } catch (error) {
      mostrarNotificacion('Error al cargar clientes', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarClientes();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const openCreateModal = () => {
    setForm({ 
      nombre: '', 
      ci_nit: '', 
      telefono: '',
      email: '',
      direccion: '',
      tipo: 'NATURAL'
    });
    setModalMode('create');
    setModalOpen(true);
  };

  const openEditModal = (cliente) => {
    setForm({
      nombre: cliente.nombre,
      ci_nit: cliente.ci_nit || '',
      telefono: cliente.telefono || '',
      email: cliente.email || '',
      direccion: cliente.direccion || '',
      tipo: cliente.tipo || 'NATURAL'
    });
    setEditingId(cliente.id);
    setModalMode('edit');
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingId(null);
  };

  const guardarCliente = async (e) => {
    e.preventDefault();
    
    if (!form.nombre.trim()) {
      mostrarNotificacion('El nombre es obligatorio', 'warning');
      return;
    }

    try {
      if (modalMode === 'create') {
        await api.post('/clientes', form);
        mostrarNotificacion('Cliente creado exitosamente', 'success');
      } else {
        await api.put(`/clientes/${editingId}`, form);
        mostrarNotificacion('Cliente actualizado exitosamente', 'success');
      }
      
      cargarClientes();
      closeModal();
    } catch (error) {
      mostrarNotificacion('Error al guardar cliente', 'error');
    }
  };

  const eliminarCliente = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este cliente?')) {
      try {
        await api.delete(`/clientes/${id}`);
        mostrarNotificacion('Cliente eliminado exitosamente', 'success');
        cargarClientes();
      } catch (error) {
        mostrarNotificacion('Error al eliminar cliente', 'error');
      }
    }
  };

  const mostrarNotificacion = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  // Filtrar clientes por búsqueda
  const clientesFiltrados = clientes.filter(cliente =>
    cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (cliente.ci_nit && cliente.ci_nit.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (cliente.telefono && cliente.telefono.includes(searchTerm))
  );

  // Estadísticas
  const totalClientes = clientes.length;
  const clientesNaturales = clientes.filter(c => c.tipo === 'NATURAL').length;
  const clientesJuridicos = clientes.filter(c => c.tipo === 'JURIDICA').length;
  const clientesConEmail = clientes.filter(c => c.email).length;

  return (
    <div className="clientes-container">
      {/* Notificación */}
      {notification.show && (
        <div className={`notification notification-${notification.type}`}>
          {notification.message}
        </div>
      )}

      {/* Header */}
      <div className="clientes-header">
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
            <h1 className="page-title">Gestión de Clientes</h1>
            <p className="page-subtitle">Administre el registro de sus clientes</p>
          </div>
        </div>
        <div className="header-right">
          <button className="btn-primary" onClick={openCreateModal}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Nuevo Cliente
          </button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon total">👥</div>
          <div className="stat-content">
            <div className="stat-value">{totalClientes}</div>
            <div className="stat-label">Total Clientes</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon natural">👤</div>
          <div className="stat-content">
            <div className="stat-value">{clientesNaturales}</div>
            <div className="stat-label">Personas Naturales</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon juridico">🏢</div>
          <div className="stat-content">
            <div className="stat-value">{clientesJuridicos}</div>
            <div className="stat-label">Personas Jurídicas</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon email">✉️</div>
          <div className="stat-content">
            <div className="stat-value">{clientesConEmail}</div>
            <div className="stat-label">Con Email Registrado</div>
          </div>
        </div>
      </div>

      {/* Barra de búsqueda y filtros */}
      <div className="search-filter-bar">
        <div className="search-container">
          <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Buscar cliente por nombre, NIT o teléfono..."
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
        
        <div className="filter-actions">
          <select 
            className="filter-select"
            value={searchTerm ? 'all' : 'active'}
            onChange={(e) => {/* Lógica de filtro adicional */}}
          >
            <option value="all">Todos los clientes</option>
            <option value="natural">Personas naturales</option>
            <option value="juridica">Personas jurídicas</option>
            <option value="with-email">Con email</option>
          </select>
        </div>
      </div>

      {/* Tabla de clientes */}
      <div className="table-card">
        <div className="card-header">
          <h3 className="card-title">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Lista de Clientes
            <span className="table-count">{clientesFiltrados.length} registros</span>
          </h3>
          <div className="card-actions">
            <button 
              className="btn-refresh"
              onClick={cargarClientes}
              title="Actualizar"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
            <button 
              className="btn-export"
              onClick={() => {/* Exportar clientes */}}
              title="Exportar"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Cargando clientes...</p>
          </div>
        ) : clientesFiltrados.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">👥</div>
            <h3>No se encontraron clientes</h3>
            <p className="empty-subtitle">
              {searchTerm ? 'Intenta con otros términos de búsqueda' : 'No hay clientes registrados'}
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
              + Crear primer cliente
            </button>
          </div>
        ) : (
          <div className="table-container">
            <table className="clientes-table">
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Identificación</th>
                  <th>Contacto</th>
                  <th>Tipo</th>
                  <th>Registro</th>
                  <th className="text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {clientesFiltrados.map(cliente => (
                  <tr key={cliente.id}>
                    <td>
                      <div className="cliente-info">
                        <div className="cliente-avatar">
                          {cliente.nombre.charAt(0).toUpperCase()}
                        </div>
                        <div className="cliente-details">
                          <div className="cliente-nombre">{cliente.nombre}</div>
                          {cliente.direccion && (
                            <div className="cliente-direccion">{cliente.direccion}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="identificacion">
                        <div className="identificacion-tipo">
                          {cliente.tipo === 'JURIDICA' ? 'NIT' : 'CI'}
                        </div>
                        <div className="identificacion-numero">{cliente.ci_nit || 'No especificado'}</div>
                      </div>
                    </td>
                    <td>
                      <div className="contacto-info">
                        {cliente.telefono && (
                          <div className="contacto-telefono">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            {cliente.telefono}
                          </div>
                        )}
                        {cliente.email && (
                          <div className="contacto-email">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            {cliente.email}
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className={`tipo-badge ${cliente.tipo === 'JURIDICA' ? 'badge-juridica' : 'badge-natural'}`}>
                        {cliente.tipo === 'JURIDICA' ? 'Jurídica' : 'Natural'}
                      </span>
                    </td>
                    <td>
                      <div className="registro-info">
                        <div className="registro-fecha">
                          {new Date(cliente.created_at).toLocaleDateString()}
                        </div>
                        <div className="registro-ventas">
                          {/* Aquí podrías mostrar el número de ventas del cliente */}
                          {/* Ej: {cliente.total_ventas || 0} ventas */}
                        </div>
                      </div>
                    </td>
                    <td className="text-center">
                      <div className="action-buttons">
                        <button 
                          className="btn-action btn-edit"
                          onClick={() => openEditModal(cliente)}
                          title="Editar"
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button 
                          className="btn-action btn-delete"
                          onClick={() => eliminarCliente(cliente.id)}
                          title="Eliminar"
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                        <button 
                          className="btn-action btn-view"
                          onClick={() => navigate(`/clientes/${cliente.id}/ventas`)}
                          title="Ver ventas"
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
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

      {/* Modal para crear/editar cliente */}
      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h3 className="modal-title">
                {modalMode === 'create' ? 'Nuevo Cliente' : 'Editar Cliente'}
              </h3>
              <button className="modal-close" onClick={closeModal}>
                ×
              </button>
            </div>

            <form onSubmit={guardarCliente} className="modal-form">
              <div className="form-group">
                <label className="form-label">Nombre Completo *</label>
                <input
                  name="nombre"
                  placeholder="Ej: Juan Pérez o Empresa S.A."
                  value={form.nombre}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Tipo de Cliente *</label>
                  <select
                    name="tipo"
                    value={form.tipo}
                    onChange={handleChange}
                    required
                    className="form-select"
                  >
                    <option value="NATURAL">Persona Natural</option>
                    <option value="JURIDICA">Persona Jurídica</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    {form.tipo === 'JURIDICA' ? 'NIT' : 'CI'} *
                  </label>
                  <input
                    name="ci_nit"
                    placeholder={form.tipo === 'JURIDICA' ? '123456789' : '1234567'}
                    value={form.ci_nit}
                    onChange={handleChange}
                    required
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Teléfono</label>
                  <input
                    name="telefono"
                    placeholder="Ej: 77712345"
                    value={form.telefono}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    name="email"
                    type="email"
                    placeholder="Ej: cliente@email.com"
                    value={form.email}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Dirección</label>
                <textarea
                  name="direccion"
                  placeholder="Dirección completa"
                  value={form.direccion}
                  onChange={handleChange}
                  className="form-textarea"
                  rows="3"
                />
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
                  {modalMode === 'create' ? 'Crear Cliente' : 'Guardar Cambios'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Clientes;