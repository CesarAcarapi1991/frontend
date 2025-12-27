// import { useEffect, useState } from 'react';
// import api from '../api/api';

// const Historial = () => {
//   const [ventas, setVentas] = useState([]);
//   const [filtros, setFiltros] = useState({
//     fechaInicio: '',
//     fechaFin: '',
//     cliente: '',
//     usuario: ''
//   });

//   const cargarVentas = async () => {
//     const params = new URLSearchParams(filtros).toString();
//     const res = await api.get(`/ventas/historial?${params}`);
//     setVentas(res.data);
//   };

//   useEffect(() => {
//     cargarVentas();
//   }, []);

//   const handleChange = (e) => setFiltros({ ...filtros, [e.target.name]: e.target.value });
//   const aplicarFiltros = () => cargarVentas();

//   const exportarCSV = () => {
//     const headers = 'ID,Cliente,Usuario,Total,Fecha\n';
//     const rows = ventas.map(v => `${v.id},${v.cliente},${v.usuario},${v.total},${new Date(v.fecha).toLocaleString()}`).join('\n');
//     const blob = new Blob([headers + rows], { type: 'text/csv' });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = 'historial_ventas.csv';
//     a.click();
//     URL.revokeObjectURL(url);
//   };

//   return (
//     <div style={{ padding: '20px' }}>
//       <h2>Historial de Ventas</h2>
//       <div style={{ display: 'flex', gap: '10px', marginBottom: '10px', flexWrap: 'wrap' }}>
//         <input type="date" name="fechaInicio" value={filtros.fechaInicio} onChange={handleChange} />
//         <input type="date" name="fechaFin" value={filtros.fechaFin} onChange={handleChange} />
//         <input placeholder="Cliente" name="cliente" value={filtros.cliente} onChange={handleChange} />
//         <input placeholder="Usuario" name="usuario" value={filtros.usuario} onChange={handleChange} />
//         <button onClick={aplicarFiltros}>Aplicar filtros</button>
//         <button onClick={exportarCSV}>Exportar CSV</button>
//       </div>

//       <table border="1" cellPadding="5" style={{ width: '100%', borderCollapse: 'collapse' }}>
//         <thead style={{ backgroundColor: '#f0f0f0' }}>
//           <tr>
//             <th>ID</th>
//             <th>Cliente</th>
//             <th>Usuario</th>
//             <th>Total (Bs)</th>
//             <th>Fecha</th>
//           </tr>
//         </thead>
//         <tbody>
//           {ventas.map(v => (
//             <tr key={v.id}>
//               <td>{v.id}</td>
//               <td>{v.cliente}</td>
//               <td>{v.usuario}</td>
//               <td>{v.total}</td>
//               <td>{new Date(v.fecha).toLocaleString()}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default Historial;

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import '../css/Historial.css';

const Historial = () => {
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState({
    fechaInicio: '',
    fechaFin: '',
    cliente: '',
    usuario: ''
  });
  const [stats, setStats] = useState({
    totalVentas: 0,
    promedioVenta: 0,
    ventasHoy: 0,
    clienteFrecuente: ''
  });
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const navigate = useNavigate();

  const cargarVentas = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        ...filtros,
        page,
        limit: itemsPerPage
      }).toString();
      const res = await api.get(`/ventas/historial?${params}`);
      setVentas(res.data.ventas || res.data);
      
      // Calcular estadísticas si la API las proporciona
      if (res.data.stats) {
        setStats(res.data.stats);
      } else {
        calcularStats(res.data.ventas || res.data);
      }
    } catch (error) {
      console.error('Error cargando historial:', error);
    } finally {
      setLoading(false);
    }
  };

  const calcularStats = (ventasData) => {
    const totalVentas = ventasData.length;
    const totalMonto = ventasData.reduce((sum, v) => sum + (v.total || 0), 0);
    const promedioVenta = totalVentas > 0 ? totalMonto / totalVentas : 0;
    
    // Contar ventas de hoy
    const hoy = new Date().toISOString().split('T')[0];
    const ventasHoy = ventasData.filter(v => 
      new Date(v.fecha).toISOString().split('T')[0] === hoy
    ).length;

    // Encontrar cliente más frecuente
    const clienteCount = {};
    ventasData.forEach(v => {
      if (v.cliente) {
        clienteCount[v.cliente] = (clienteCount[v.cliente] || 0) + 1;
      }
    });
    
    const clienteFrecuente = Object.keys(clienteCount).reduce((a, b) => 
      clienteCount[a] > clienteCount[b] ? a : b, ''
    );

    setStats({
      totalVentas,
      promedioVenta,
      ventasHoy,
      clienteFrecuente
    });
  };

  useEffect(() => {
    cargarVentas();
  }, [page]);

  const handleChange = (e) => {
    setFiltros({ ...filtros, [e.target.name]: e.target.value });
  };

  const aplicarFiltros = () => {
    setPage(1);
    cargarVentas();
  };

  const limpiarFiltros = () => {
    setFiltros({
      fechaInicio: '',
      fechaFin: '',
      cliente: '',
      usuario: ''
    });
    setPage(1);
    setTimeout(() => cargarVentas(), 100);
  };

  const exportarCSV = () => {
    const headers = ['ID', 'Cliente', 'Usuario', 'Total (Bs)', 'Fecha', 'Productos', 'Estado'];
    const rows = ventas.map(v => [
      v.id,
      v.cliente || 'N/A',
      v.usuario || 'N/A',
      v.total?.toLocaleString() || '0',
      new Date(v.fecha).toLocaleString(),
      v.items?.length || 0,
      v.estado || 'Completado'
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `historial_ventas_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportarPDF = () => {
    // Implementación básica - en producción usar librería como jsPDF
    window.print();
  };

  const verDetalleVenta = (id) => {
    navigate(`/ventas/detalle/${id}`);
  };

  const formatCurrency = (amount) => {
    return `Bs ${amount?.toLocaleString() || '0'}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'completado': return 'success';
      case 'pendiente': return 'warning';
      case 'cancelado': return 'danger';
      default: return 'info';
    }
  };

  return (
    <div className="historial-container">
      {/* Header */}
      <div className="historial-header">
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
            <h1 className="page-title">Historial de Ventas</h1>
            <p className="page-subtitle">Registro detallado de todas las transacciones</p>
          </div>
        </div>
        <div className="header-actions">
          <button className="btn-export" onClick={exportarCSV}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Exportar CSV
          </button>
          <button className="btn-print" onClick={exportarPDF}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Imprimir
          </button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon total">📊</div>
          <div className="stat-content">
            <div className="stat-value">{stats.totalVentas}</div>
            <div className="stat-label">Total Ventas</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon average">💰</div>
          <div className="stat-content">
            <div className="stat-value">{formatCurrency(stats.promedioVenta)}</div>
            <div className="stat-label">Promedio por Venta</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon today">📅</div>
          <div className="stat-content">
            <div className="stat-value">{stats.ventasHoy}</div>
            <div className="stat-label">Ventas Hoy</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon client">👑</div>
          <div className="stat-content">
            <div className="stat-value">{stats.clienteFrecuente || 'N/A'}</div>
            <div className="stat-label">Cliente Frecuente</div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="filters-card">
        <div className="card-header">
          <h3 className="card-title">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filtros de Búsqueda
          </h3>
        </div>
        
        <div className="filters-grid">
          <div className="filter-group">
            <label className="filter-label">Fecha Inicio</label>
            <input
              type="date"
              name="fechaInicio"
              value={filtros.fechaInicio}
              onChange={handleChange}
              className="filter-input"
            />
          </div>
          
          <div className="filter-group">
            <label className="filter-label">Fecha Fin</label>
            <input
              type="date"
              name="fechaFin"
              value={filtros.fechaFin}
              onChange={handleChange}
              className="filter-input"
            />
          </div>
          
          <div className="filter-group">
            <label className="filter-label">Cliente</label>
            <input
              type="text"
              name="cliente"
              placeholder="Nombre del cliente"
              value={filtros.cliente}
              onChange={handleChange}
              className="filter-input"
            />
          </div>
          
          <div className="filter-group">
            <label className="filter-label">Usuario</label>
            <input
              type="text"
              name="usuario"
              placeholder="Nombre del usuario"
              value={filtros.usuario}
              onChange={handleChange}
              className="filter-input"
            />
          </div>
        </div>
        
        <div className="filter-actions">
          <button className="btn-filter-apply" onClick={aplicarFiltros}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Aplicar Filtros
          </button>
          <button className="btn-filter-clear" onClick={limpiarFiltros}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            Limpiar Filtros
          </button>
        </div>
      </div>

      {/* Tabla de Ventas */}
      <div className="sales-table-card">
        <div className="card-header">
          <h3 className="card-title">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Historial de Transacciones
            <span className="table-count">{ventas.length} registros</span>
          </h3>
          <div className="table-actions">
            <button className="btn-refresh" onClick={cargarVentas} title="Actualizar">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Cargando historial de ventas...</p>
          </div>
        ) : ventas.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h3>No se encontraron ventas</h3>
            <p className="empty-subtitle">No hay registros que coincidan con los filtros aplicados</p>
            <button className="btn-clear-filters" onClick={limpiarFiltros}>
              Limpiar Filtros
            </button>
          </div>
        ) : (
          <div className="table-container">
            <table className="sales-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Cliente</th>
                  <th>Usuario</th>
                  <th>Productos</th>
                  <th>Total</th>
                  <th>Fecha</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {ventas.map(venta => (
                  <tr key={venta.id}>
                    <td>
                      <div className="sale-id">#{venta.id}</div>
                    </td>
                    <td>
                      <div className="sale-client">
                        <div className="client-name">{venta.cliente || 'Cliente no especificado'}</div>
                        <div className="client-note">{venta.nit ? `NIT: ${venta.nit}` : ''}</div>
                      </div>
                    </td>
                    <td>
                      <div className="sale-user">
                        <div className="user-avatar">
                          {venta.usuario?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div className="user-name">{venta.usuario || 'Usuario'}</div>
                      </div>
                    </td>
                    <td>
                      <div className="sale-products">
                        <span className="products-count">{venta.items?.length || 0} productos</span>
                      </div>
                    </td>
                    <td>
                      <div className="sale-total">
                        <span className="total-amount">{formatCurrency(venta.total)}</span>
                      </div>
                    </td>
                    <td>
                      <div className="sale-date">
                        <div className="date">{formatDate(venta.fecha)}</div>
                      </div>
                    </td>
                    <td>
                      <span className={`status-badge status-${getStatusColor(venta.estado)}`}>
                        {venta.estado || 'Completado'}
                      </span>
                    </td>
                    <td>
                      <div className="sale-actions">
                        <button 
                          className="btn-view"
                          onClick={() => verDetalleVenta(venta.id)}
                          title="Ver detalle"
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <button 
                          className="btn-invoice"
                          onClick={() => window.open(`/ventas/factura/${venta.id}`, '_blank')}
                          title="Generar factura"
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
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

        {/* Paginación */}
        {ventas.length > 0 && (
          <div className="table-footer">
            <div className="pagination">
              <button 
                className="pagination-btn"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
                Anterior
              </button>
              
              <div className="pagination-info">
                Página {page} - Mostrando {ventas.length} registros
              </div>
              
              <button 
                className="pagination-btn"
                onClick={() => setPage(p => p + 1)}
              >
                Siguiente
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            
            <div className="page-size-selector">
              <label>Mostrar:</label>
              <select 
                value={itemsPerPage}
                onChange={(e) => {
                  // Aquí podrías cambiar itemsPerPage si lo haces state
                }}
                className="page-size-select"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Historial;