// import { Link } from 'react-router-dom';
// import { useContext } from 'react';
// import { AuthContext } from '../auth/AuthContext';

// const Dashboard = () => {
//   const { user } = useContext(AuthContext);

//   return (
//     <div>
//       <h1>Dashboard</h1>

//       <nav>
//         <ul>
//           <li><Link to="/productos">Productos</Link></li>
//           <li><Link to="/ventas">Ventas</Link></li>
//           <li><Link to="/clientes">Clientes</Link></li>
//           <li><Link to="/historial">Historial Ventas</Link></li>

//           {user?.rol === 'ADMIN' && (
//             <li>
//               <Link to="/usuarios">Usuarios</Link>
//             </li>
//           )}
//         </ul>
//       </nav>

//       <p>Bienvenido al sistema de inventario y ventas</p>
//     </div>
//   );
// };

// export default Dashboard;


import { Link, useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../auth/AuthContext';
import '../css/Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [stats, setStats] = useState({
    ventasHoy: 0,
    productosStockBajo: 0,
    clientesNuevos: 0,
    valorInventario: 0
  });
  const [recentSales, setRecentSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLogoutMenu, setShowLogoutMenu] = useState(false);
  const navigate = useNavigate();

  // Simular carga de datos del dashboard
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // En una implementación real, estos serían llamadas a la API
        setStats({
          ventasHoy: 12450,
          productosStockBajo: 7,
          clientesNuevos: 3,
          valorInventario: 158920
        });

        setRecentSales([
          { id: 1, cliente: 'Juan Pérez', monto: 2450, fecha: '2024-01-15', estado: 'Completado' },
          { id: 2, cliente: 'María García', monto: 1890, fecha: '2024-01-15', estado: 'Completado' },
          { id: 3, cliente: 'Empresa XYZ', monto: 5670, fecha: '2024-01-14', estado: 'Pendiente' },
          { id: 4, cliente: 'Carlos López', monto: 1250, fecha: '2024-01-14', estado: 'Completado' },
          { id: 5, cliente: 'Ana Rodríguez', monto: 890, fecha: '2024-01-13', estado: 'Completado' }
        ]);
      } catch (error) {
        console.error('Error cargando datos del dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 19) return 'Buenas tardes';
    return 'Buenas noches';
  };

  const formatCurrency = (amount) => {
    return `$${amount.toLocaleString()}`;
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleLogoutMenu = () => {
    setShowLogoutMenu(!showLogoutMenu);
  };

  // Cerrar el menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showLogoutMenu && !event.target.closest('.user-info')) {
        setShowLogoutMenu(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showLogoutMenu]);

  return (
    <div className="dashboard-container">
      {/* Header del Dashboard */}
      <div className="dashboard-header">
        <div className="header-left">
          <h1 className="dashboard-title">Panel de Control</h1>
          <p className="dashboard-subtitle">
            {getGreeting()}, <span className="user-name">{user?.nombre || 'Usuario'}</span>
          </p>
        </div>
        <div className="header-right">
          <div className="user-info" onClick={toggleLogoutMenu}>
            <div className="user-avatar">
              {user?.nombre?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="user-details">
              <div className="user-name-display">{user?.nombre || 'Usuario'}</div>
              <div className="user-role">{user?.rol || 'Usuario'}</div>
            </div>
            <div className="user-dropdown-arrow">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            {/* Menú de logout */}
            {showLogoutMenu && (
              <div className="logout-menu">
                <div className="logout-menu-header">
                  <div className="logout-user-info">
                    <div className="logout-avatar">
                      {user?.nombre?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div>
                      <div className="logout-user-name">{user?.nombre || 'Usuario'}</div>
                      <div className="logout-user-email">{user?.email || 'usuario@email.com'}</div>
                    </div>
                  </div>
                </div>
                
                <div className="logout-menu-items">
                  <Link to="/perfil" className="logout-menu-item" onClick={() => setShowLogoutMenu(false)}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>Mi Perfil</span>
                  </Link>
                  
                  <Link to="/configuracion" className="logout-menu-item" onClick={() => setShowLogoutMenu(false)}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>Configuración</span>
                  </Link>
                  
                  <div className="logout-menu-divider"></div>
                  
                  <button className="logout-menu-item logout-button" onClick={handleLogout}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>Cerrar Sesión</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tarjetas de estadísticas principales */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon revenue">💰</div>
          <div className="stat-content">
            <div className="stat-value">{formatCurrency(stats.ventasHoy)}</div>
            <div className="stat-label">Ventas Hoy</div>
            <div className="stat-trend positive">
              <span>+12.5%</span> vs ayer
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon inventory">📦</div>
          <div className="stat-content">
            <div className="stat-value">{formatCurrency(stats.valorInventario)}</div>
            <div className="stat-label">Valor Inventario</div>
            <div className="stat-trend">
              <span>7 productos</span> stock bajo
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon warning">⚠️</div>
          <div className="stat-content">
            <div className="stat-value">{stats.productosStockBajo}</div>
            <div className="stat-label">Productos Stock Bajo</div>
            <div className="stat-trend negative">
              <span>Requiere atención</span>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon clients">👥</div>
          <div className="stat-content">
            <div className="stat-value">{stats.clientesNuevos}</div>
            <div className="stat-label">Clientes Nuevos</div>
            <div className="stat-trend positive">
              <span>+2</span> esta semana
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        {/* Menú de navegación */}
        <div className="navigation-card">
          <div className="card-header">
            <h3 className="card-title">Navegación Rápida</h3>
            <p className="card-subtitle">Acceso directo a los módulos del sistema</p>
          </div>
          
          <div className="nav-grid">
            {user?.rol === 'ALMACEN' && (
              <>
              <Link to="/productos" className="nav-card">
                <div className="nav-icon product">📦</div>
                <div className="nav-content">
                  <h4>Productos</h4>
                  <p>Gestión de inventario</p>
                </div>
                <div className="nav-arrow">→</div>
              </Link>
              </>
            )}
            
            {user?.rol === 'VENDEDOR' && (
              <>
              <Link to="/ventas" className="nav-card">
                <div className="nav-icon sales">💰</div>
                <div className="nav-content">
                  <h4>Ventas</h4>
                  <p>Procesar transacciones</p>
                </div>
                <div className="nav-arrow">→</div>
              </Link>
              </>
            )}

            {user?.rol === 'VENDEDOR' && (
              <>
              <Link to="/clientes" className="nav-card">
                <div className="nav-icon clients">👥</div>
                <div className="nav-content">
                  <h4>Clientes</h4>
                  <p>Administrar clientes</p>
                </div>
                <div className="nav-arrow">→</div>
              </Link>
              </>
            )}
            
            {(user?.rol === 'ADMIN'  || user?.rol === 'VENDEDOR') && (
              <>
              <Link to="/historial" className="nav-card">
                <div className="nav-icon history">📊</div>
                <div className="nav-content">
                  <h4>Historial Ventas</h4>
                  <p>Reportes y análisis</p>
                </div>
                <div className="nav-arrow">→</div>
              </Link>
              </>
            )}
            

            

            {user?.rol === 'ADMIN' && (
              <>
                <Link to="/usuarios" className="nav-card">
                  <div className="nav-icon admin">👑</div>
                  <div className="nav-content">
                    <h4>Usuarios</h4>
                    <p>Administración del sistema</p>
                  </div>
                  <div className="nav-arrow">→</div>
                </Link>
                <Link to="/configuracion" className="nav-card">
                  <div className="nav-icon config">⚙️</div>
                  <div className="nav-content">
                    <h4>Configuración</h4>
                    <p>Ajustes del sistema</p>
                  </div>
                  <div className="nav-arrow">→</div>
                </Link>
                <Link to="/reportes" className="nav-card">
                  <div className="nav-icon reports">📈</div>
                  <div className="nav-content">
                    <h4>Reportes</h4>
                    <p>Análisis y métricas</p>
                  </div>
                  <div className="nav-arrow">→</div>
                </Link>
              </>
            )}

                
          </div>
        </div>

        {/* Sección de ventas recientes */}
        <div className="sales-card">
          <div className="card-header">
            <h3 className="card-title">Ventas Recientes</h3>
            <Link to="/historial" className="view-all">
              Ver todo →
            </Link>
          </div>

          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <span>Cargando ventas...</span>
            </div>
          ) : recentSales.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📊</div>
              <p>No hay ventas recientes</p>
            </div>
          ) : (
            <div className="sales-table-container">
              <table className="financial-table">
                <thead>
                  <tr>
                    <th>Cliente</th>
                    <th className="text-right">Monto</th>
                    <th>Fecha</th>
                    <th className="text-center">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {recentSales.map(sale => (
                    <tr key={sale.id}>
                      <td>
                        <div className="customer-info">
                          <div className="customer-name">{sale.cliente}</div>
                          <div className="sale-id">Venta #{sale.id}</div>
                        </div>
                      </td>
                      <td className="text-right">
                        <span className="sale-amount">{formatCurrency(sale.monto)}</span>
                      </td>
                      <td>
                        <span className="sale-date">{sale.fecha}</span>
                      </td>
                      <td className="text-center">
                        <span className={`status-badge ${sale.estado === 'Completado' ? 'status-success' : 'status-warning'}`}>
                          {sale.estado}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="quick-actions-card">
          <div className="card-header">
            <h3 className="card-title">Acciones Rápidas</h3>
          </div>
          <div className="actions-grid">
            <button className="action-btn" onClick={() => navigate('/ventas/nueva')}>
              <div className="action-icon">➕</div>
              <div className="action-content">
                <h4>Nueva Venta</h4>
                <p>Crear transacción</p>
              </div>
            </button>
            
            <button className="action-btn" onClick={() => navigate('/reportes')}>
              <div className="action-icon">📋</div>
              <div className="action-content">
                <h4>Generar Reporte</h4>
                <p>Exportar datos</p>
              </div>
            </button>
            
            <button className="action-btn" onClick={() => navigate('/productos?filter=stock-bajo')}>
              <div className="action-icon">🔔</div>
              <div className="action-content">
                <h4>Alertas Stock</h4>
                <p>Ver notificaciones</p>
              </div>
            </button>
            
            <button className="action-btn" onClick={() => navigate('/configuracion')}>
              <div className="action-icon">⚙️</div>
              <div className="action-content">
                <h4>Configuración</h4>
                <p>Ajustes del sistema</p>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Footer del Dashboard */}
      <div className="dashboard-footer">
        <div className="footer-content">
          <div className="system-info">
            <span className="info-label">Sistema de Gestión</span>
            <span className="info-value">v2.1.4</span>
          </div>
          <div className="system-info">
            <span className="info-label">Última actualización</span>
            <span className="info-value">Hoy, 10:30 AM</span>
          </div>
          <div className="system-info">
            <span className="info-label">Sesión activa</span>
            <span className="info-value status-active">
              <span className="status-dot active"></span>
              {user?.nombre || 'Usuario'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;