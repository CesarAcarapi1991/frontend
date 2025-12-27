// import { Link, useLocation, useNavigate } from 'react-router-dom';
// import { useContext } from 'react';
// import { AuthContext } from '../auth/AuthContext';

// const DashboardLayout = ({ children }) => {
//   const { user, logout } = useContext(AuthContext);
//   const navigate = useNavigate();
//   const location = useLocation();

//   const handleLogout = () => {
//     logout();
//     navigate('/login');
//   };

//   const formatDate = () => {
//     const now = new Date();
//     return now.toLocaleDateString('es-ES', { 
//       weekday: 'long', 
//       year: 'numeric', 
//       month: 'long', 
//       day: 'numeric' 
//     });
//   };

//   const getGreeting = () => {
//     const hour = new Date().getHours();
//     if (hour < 12) return 'Buenos días';
//     if (hour < 19) return 'Buenas tardes';
//     return 'Buenas noches';
//   };

//   const menuItems = [
//     { path: "/", label: "Dashboard", icon: "🏠" },
//     { path: "/productos", label: "Productos", icon: "📦" },
//     { path: "/ventas", label: "Ventas", icon: "🛒" },
//     { path: "/clientes", label: "Clientes", icon: "👥" },
//     { path: "/historial", label: "Historial Ventas", icon: "📊" },
//   ];

//   if (user?.rol === 'ADMIN') {
//     menuItems.push({ 
//       path: "/usuarios", 
//       label: "Usuarios", 
//       icon: "👨‍💼" 
//     });
//   }

//   const isActive = (path) => {
//     if (path === '/' && location.pathname === '/') return true;
//     if (path !== '/' && location.pathname.startsWith(path)) return true;
//     return false;
//   };

//   return (
//     <div className="dashboard-container">
//       {/* Header */}
//       <header className="dashboard-header">
//         <div className="header-left">
//           <div className="bank-logo">
//             <span className="bank-icon">🏦</span>
//             <span className="bank-name">SecureBank</span>
//           </div>
//           <div className="current-date">
//             <span>{formatDate()}</span>
//           </div>
//         </div>
        
//         <div className="header-right">
//           <div className="user-info">
//             <div className="user-avatar">
//               <span className="avatar-icon">👤</span>
//             </div>
//             <div className="user-details">
//               <span className="user-name">{user?.nombre || 'Usuario'}</span>
//               <span className="user-role">
//                 <span className="role-icon">🛡️</span>
//                 {user?.rol === 'ADMIN' ? 'Administrador' : 'Usuario'}
//               </span>
//             </div>
//           </div>
          
//           <div className="header-actions">
//             <button className="header-btn" title="Notificaciones">
//               <span className="btn-icon">🔔</span>
//               <span className="notification-badge">3</span>
//             </button>
//             <button className="header-btn" title="Configuración">
//               <span className="btn-icon">⚙️</span>
//             </button>
//             <button 
//               className="header-btn logout-btn" 
//               onClick={handleLogout}
//               title="Cerrar sesión"
//             >
//               <span className="btn-icon">🚪</span>
//             </button>
//           </div>
//         </div>
//       </header>

//       <div className="dashboard-content">
//         {/* Sidebar */}
//         <aside className="dashboard-sidebar">
//           <div className="sidebar-welcome">
//             <h2>{getGreeting()},</h2>
//             <p className="welcome-user">{user?.nombre || 'Usuario'}</p>
//             <p className="welcome-message">Gestión integral del sistema</p>
//           </div>

//           <nav className="sidebar-nav">
//             <ul>
//               {menuItems.map((item) => (
//                 <li key={item.path} className={`nav-item ${isActive(item.path) ? 'active' : ''}`}>
//                   <Link to={item.path} className="nav-link">
//                     <span className="nav-icon">{item.icon}</span>
//                     <span>{item.label}</span>
//                   </Link>
//                 </li>
//               ))}
//             </ul>
//           </nav>

//           <div className="sidebar-stats">
//             <div className="stat-card">
//               <span className="stat-icon">📈</span>
//               <div>
//                 <span className="stat-value">24</span>
//                 <span className="stat-label">Ventas Hoy</span>
//               </div>
//             </div>
//             <div className="stat-card">
//               <span className="stat-icon">👥</span>
//               <div>
//                 <span className="stat-value">156</span>
//                 <span className="stat-label">Clientes</span>
//               </div>
//             </div>
//           </div>
//         </aside>

//         {/* Main Content */}
//         <main className="dashboard-main">
//           {children}
//         </main>
//       </div>

//       <style jsx>{`
//         .dashboard-container {
//           width: 100vw;
//           min-height: 100vh;
//           background: #f5f7fa;
//           font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
//         //   overflow-x: hidden;
//         }

//         /* Header */
//         .dashboard-header {
//           background: white;
//           border-bottom: 1px solid #e2e8f0;
//           padding: 0 30px;
//           height: 70px;
//           display: flex;
//           align-items: center;
//           justify-content: space-between;
//           box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
//           position: sticky;
//           top: 0;
//           z-index: 100;
//           width: 100%;
//         }

//         .header-left {
//           display: flex;
//           align-items: center;
//           gap: 40px;
//         }

//         .bank-logo {
//           display: flex;
//           align-items: center;
//           gap: 12px;
//         }

//         .bank-icon {
//           font-size: 28px;
//         }

//         .bank-name {
//           font-size: 24px;
//           font-weight: 700;
//           color: #2d3748;
//           letter-spacing: -0.5px;
//         }

//         .current-date {
//           color: #718096;
//           font-size: 14px;
//           background: #f8fafc;
//           padding: 6px 12px;
//           border-radius: 20px;
//         }

//         .header-right {
//           display: flex;
//           align-items: center;
//           gap: 30px;
//         }

//         .user-info {
//           display: flex;
//           align-items: center;
//           gap: 12px;
//         }

//         .user-avatar {
//           width: 40px;
//           height: 40px;
//           background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
//           border-radius: 50%;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           color: white;
//           font-size: 20px;
//         }

//         .user-details {
//           display: flex;
//           flex-direction: column;
//         }

//         .user-name {
//           font-weight: 600;
//           color: #2d3748;
//           font-size: 14px;
//         }

//         .user-role {
//           display: flex;
//           align-items: center;
//           gap: 4px;
//           font-size: 12px;
//           color: #718096;
//           margin-top: 2px;
//         }

//         .role-icon {
//           font-size: 10px;
//         }

//         .header-actions {
//           display: flex;
//           align-items: center;
//           gap: 15px;
//         }

//         .header-btn {
//           width: 40px;
//           height: 40px;
//           border-radius: 10px;
//           border: 1px solid #e2e8f0;
//           background: white;
//           color: #4a5568;
//           cursor: pointer;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           transition: all 0.2s;
//           position: relative;
//           font-size: 18px;
//         }

//         .header-btn:hover {
//           background: #f7fafc;
//           border-color: #cbd5e0;
//           transform: translateY(-1px);
//         }

//         .logout-btn:hover {
//           background: #fed7d7;
//           border-color: #fc8181;
//           color: #c53030;
//         }

//         .notification-badge {
//           position: absolute;
//           top: -5px;
//           right: -5px;
//           background: #f56565;
//           color: white;
//           font-size: 10px;
//           width: 18px;
//           height: 18px;
//           border-radius: 50%;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//         }

//         .btn-icon {
//           font-size: 18px;
//         }

//         /* Main Layout */
//         .dashboard-content {
//           display: flex;
//           min-height: calc(100vh - 70px);
//           width: 100%;
//         }

//         /* Sidebar */
//         .dashboard-sidebar {
//           width: 280px;
//           background: white;
//           border-right: 1px solid #e2e8f0;
//           padding: 30px 0;
//           display: flex;
//           flex-direction: column;
//           flex-shrink: 0;
//         }

//         .sidebar-welcome {
//           padding: 0 25px 25px;
//           border-bottom: 1px solid #e2e8f0;
//           margin-bottom: 25px;
//         }

//         .sidebar-welcome h2 {
//           font-size: 18px;
//           color: #718096;
//           margin-bottom: 5px;
//           font-weight: 500;
//         }

//         .welcome-user {
//           font-size: 22px;
//           font-weight: 700;
//           color: #2d3748;
//           margin-bottom: 8px;
//         }

//         .welcome-message {
//           color: #a0aec0;
//           font-size: 14px;
//         }

//         .sidebar-nav ul {
//           list-style: none;
//           padding: 0;
//           margin: 0;
//         }

//         .nav-item {
//           margin-bottom: 5px;
//         }

//         .nav-link {
//           display: flex;
//           align-items: center;
//           gap: 15px;
//           padding: 15px 25px;
//           color: #4a5568;
//           text-decoration: none;
//           transition: all 0.2s;
//           border-left: 3px solid transparent;
//           font-size: 15px;
//         }

//         .nav-link:hover {
//           background: #f7fafc;
//           color: #2d3748;
//           border-left-color: #4299e1;
//         }

//         .nav-item.active .nav-link {
//           background: #ebf8ff;
//           color: #2b6cb0;
//           border-left-color: #2b6cb0;
//           font-weight: 600;
//         }

//         .nav-icon {
//           font-size: 20px;
//           width: 24px;
//           text-align: center;
//         }

//         .sidebar-stats {
//           padding: 25px;
//           margin-top: auto;
//         }

//         .stat-card {
//           background: #f8fafc;
//           border-radius: 12px;
//           padding: 15px;
//           display: flex;
//           align-items: center;
//           gap: 12px;
//           margin-bottom: 15px;
//         }

//         .stat-card:last-child {
//           margin-bottom: 0;
//         }

//         .stat-icon {
//           font-size: 24px;
//         }

//         .stat-value {
//           display: block;
//           font-size: 20px;
//           font-weight: 700;
//           color: #2d3748;
//         }

//         .stat-label {
//           font-size: 12px;
//           color: #718096;
//         }

//         /* Main Content */
//         .dashboard-main {
//           flex: 1;
//           padding: 30px;
//           overflow-y: auto;
//           width: 100%;
//         }

//         /* Responsive */
//         @media (max-width: 992px) {
//           .dashboard-content {
//             flex-direction: column;
//           }
          
//           .dashboard-sidebar {
//             width: 100%;
//             border-right: none;
//             border-bottom: 1px solid #e2e8f0;
//             padding: 20px;
//           }
          
//           .sidebar-stats {
//             display: flex;
//             gap: 20px;
//             padding: 20px 0 0;
//           }
          
//           .stat-card {
//             flex: 1;
//             margin-bottom: 0;
//           }
//         }

//         @media (max-width: 768px) {
//           .dashboard-header {
//             padding: 0 20px;
//             flex-direction: column;
//             height: auto;
//             padding: 15px 20px;
//             gap: 15px;
//           }
          
//           .header-left, .header-right {
//             width: 100%;
//             justify-content: space-between;
//           }
          
//           .dashboard-main {
//             padding: 20px;
//           }
//         }

//         @media (max-width: 576px) {
//           .sidebar-stats {
//             flex-direction: column;
//           }
          
//           .header-right {
//             gap: 15px;
//           }
          
//           .user-details {
//             display: none;
//           }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default DashboardLayout;


import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import { AuthContext } from '../auth/AuthContext';

const DashboardLayout = ({ children }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  // Reset de estilos solo para páginas del dashboard
  useEffect(() => {
    // Solo aplicar si estamos en una página del dashboard
    if (location.pathname !== '/login') {
      const root = document.getElementById('root');
      if (root) {
        root.style.maxWidth = 'none';
        root.style.margin = '0';
        root.style.padding = '0';
        root.style.width = '100vw';
        root.style.minHeight = '100vh';
      }
      
      document.body.style.margin = '0';
      document.body.style.padding = '0';
      document.body.style.width = '100vw';
      document.body.style.overflowX = 'hidden';
      
      document.documentElement.style.width = '100vw';
      document.documentElement.style.overflowX = 'hidden';
    }
    
    return () => {
      // Limpiar estilos al desmontar
      const root = document.getElementById('root');
      if (root) {
        root.style.maxWidth = '';
        root.style.margin = '';
        root.style.padding = '';
        root.style.width = '';
        root.style.minHeight = '';
      }
      
      document.body.style.margin = '';
      document.body.style.padding = '';
      document.body.style.width = '';
      document.body.style.overflowX = '';
      
      document.documentElement.style.width = '';
      document.documentElement.style.overflowX = '';
    };
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const formatDate = () => {
    const now = new Date();
    return now.toLocaleDateString('es-ES', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 19) return 'Buenas tardes';
    return 'Buenas noches';
  };

  const menuItems = [
    { path: "/", label: "Dashboard", icon: "🏠" },
    { path: "/productos", label: "Productos", icon: "📦" },
    { path: "/ventas", label: "Ventas", icon: "🛒" },
    { path: "/clientes", label: "Clientes", icon: "👥" },
    { path: "/historial", label: "Historial Ventas", icon: "📊" },
  ];

  if (user?.rol === 'ADMIN') {
    menuItems.push({ 
      path: "/usuarios", 
      label: "Usuarios", 
      icon: "👨‍💼" 
    });
  }

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-left">
          <div className="bank-logo">
            <span className="bank-icon">🏦</span>
            <span className="bank-name">SecureBank</span>
          </div>
          <div className="current-date">
            <span>{formatDate()}</span>
          </div>
        </div>
        
        <div className="header-right">
          <div className="user-info">
            <div className="user-avatar">
              <span className="avatar-icon">👤</span>
            </div>
            <div className="user-details">
              <span className="user-name">{user?.nombre || 'Usuario'}</span>
              <span className="user-role">
                <span className="role-icon">🛡️</span>
                {user?.rol === 'ADMIN' ? 'Administrador' : 'Usuario'}
              </span>
            </div>
          </div>
          
          <div className="header-actions">
            <button className="header-btn" title="Notificaciones">
              <span className="btn-icon">🔔</span>
              <span className="notification-badge">3</span>
            </button>
            <button className="header-btn" title="Configuración">
              <span className="btn-icon">⚙️</span>
            </button>
            <button 
              className="header-btn logout-btn" 
              onClick={handleLogout}
              title="Cerrar sesión"
            >
              <span className="btn-icon">🚪</span>
            </button>
          </div>
        </div>
      </header>

      <div className="dashboard-content">
        {/* Sidebar */}
        <aside className="dashboard-sidebar">
          <div className="sidebar-welcome">
            <h2>{getGreeting()},</h2>
            <p className="welcome-user">{user?.nombre || 'Usuario'}</p>
            <p className="welcome-message">Gestión integral del sistema</p>
          </div>

          <nav className="sidebar-nav">
            <ul>
              {menuItems.map((item) => (
                <li key={item.path} className={`nav-item ${isActive(item.path) ? 'active' : ''}`}>
                  <Link to={item.path} className="nav-link">
                    <span className="nav-icon">{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="sidebar-stats">
            <div className="stat-card">
              <span className="stat-icon">📈</span>
              <div>
                <span className="stat-value">24</span>
                <span className="stat-label">Ventas Hoy</span>
              </div>
            </div>
            <div className="stat-card">
              <span className="stat-icon">👥</span>
              <div>
                <span className="stat-value">156</span>
                <span className="stat-label">Clientes</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="dashboard-main">
          {children}
        </main>
      </div>

      <style jsx>{`
        .dashboard-container {
          width: 100vw;
          max-width: 100vw;
          min-height: 100vh;
          background: #f5f7fa;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          overflow-x: hidden;
          margin: 0;
          padding: 0;
          position: relative;
        }

        /* Header - fijar al ancho completo */
        .dashboard-header {
          background: white;
          border-bottom: 1px solid #e2e8f0;
          padding: 0 30px;
          height: 70px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
          position: sticky;
          top: 0;
          z-index: 100;
          width: 100vw;
          max-width: 100vw;
          margin: 0;
          left: 0;
          right: 0;
          box-sizing: border-box;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 40px;
        }

        .bank-logo {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .bank-icon {
          font-size: 28px;
        }

        .bank-name {
          font-size: 24px;
          font-weight: 700;
          color: #2d3748;
          letter-spacing: -0.5px;
        }

        .current-date {
          color: #718096;
          font-size: 14px;
          background: #f8fafc;
          padding: 6px 12px;
          border-radius: 20px;
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 30px;
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .user-avatar {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 20px;
        }

        .user-details {
          display: flex;
          flex-direction: column;
        }

        .user-name {
          font-weight: 600;
          color: #2d3748;
          font-size: 14px;
        }

        .user-role {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          color: #718096;
          margin-top: 2px;
        }

        .role-icon {
          font-size: 10px;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .header-btn {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          border: 1px solid #e2e8f0;
          background: white;
          color: #4a5568;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          position: relative;
          font-size: 18px;
        }

        .header-btn:hover {
          background: #f7fafc;
          border-color: #cbd5e0;
          transform: translateY(-1px);
        }

        .logout-btn:hover {
          background: #fed7d7;
          border-color: #fc8181;
          color: #c53030;
        }

        .notification-badge {
          position: absolute;
          top: -5px;
          right: -5px;
          background: #f56565;
          color: white;
          font-size: 10px;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .btn-icon {
          font-size: 18px;
        }

        /* Main Layout - ancho completo */
        .dashboard-content {
          display: flex;
          min-height: calc(100vh - 70px);
          width: 100vw;
          max-width: 100vw;
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        /* Sidebar */
        .dashboard-sidebar {
          width: 280px;
          background: white;
          border-right: 1px solid #e2e8f0;
          padding: 30px 0;
          display: flex;
          flex-direction: column;
          flex-shrink: 0;
          box-sizing: border-box;
        }

        .sidebar-welcome {
          padding: 0 25px 25px;
          border-bottom: 1px solid #e2e8f0;
          margin-bottom: 25px;
          box-sizing: border-box;
        }

        .sidebar-welcome h2 {
          font-size: 18px;
          color: #718096;
          margin-bottom: 5px;
          font-weight: 500;
        }

        .welcome-user {
          font-size: 22px;
          font-weight: 700;
          color: #2d3748;
          margin-bottom: 8px;
        }

        .welcome-message {
          color: #a0aec0;
          font-size: 14px;
        }

        .sidebar-nav ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .nav-item {
          margin-bottom: 5px;
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 15px 25px;
          color: #4a5568;
          text-decoration: none;
          transition: all 0.2s;
          border-left: 3px solid transparent;
          font-size: 15px;
          box-sizing: border-box;
        }

        .nav-link:hover {
          background: #f7fafc;
          color: #2d3748;
          border-left-color: #4299e1;
        }

        .nav-item.active .nav-link {
          background: #ebf8ff;
          color: #2b6cb0;
          border-left-color: #2b6cb0;
          font-weight: 600;
        }

        .nav-icon {
          font-size: 20px;
          width: 24px;
          text-align: center;
        }

        .sidebar-stats {
          padding: 25px;
          margin-top: auto;
          box-sizing: border-box;
        }

        .stat-card {
          background: #f8fafc;
          border-radius: 12px;
          padding: 15px;
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 15px;
          box-sizing: border-box;
        }

        .stat-card:last-child {
          margin-bottom: 0;
        }

        .stat-icon {
          font-size: 24px;
        }

        .stat-value {
          display: block;
          font-size: 20px;
          font-weight: 700;
          color: #2d3748;
        }

        .stat-label {
          font-size: 12px;
          color: #718096;
        }

        /* Main Content - debe ocupar el espacio restante */
        .dashboard-main {
          flex: 1;
          padding: 30px;
          overflow-y: auto;
          width: calc(100vw - 280px);
          max-width: calc(100vw - 280px);
          box-sizing: border-box;
          background: #f5f7fa;
        }

        /* Responsive */
        @media (max-width: 992px) {
          .dashboard-content {
            flex-direction: column;
            width: 100vw;
          }
          
          .dashboard-sidebar {
            width: 100vw;
            max-width: 100vw;
            border-right: none;
            border-bottom: 1px solid #e2e8f0;
            padding: 20px;
          }
          
          .dashboard-main {
            width: 100vw;
            max-width: 100vw;
          }
          
          .sidebar-stats {
            display: flex;
            gap: 20px;
            padding: 20px 0 0;
          }
          
          .stat-card {
            flex: 1;
            margin-bottom: 0;
          }
        }

        @media (max-width: 768px) {
          .dashboard-header {
            padding: 0 20px;
            flex-direction: column;
            height: auto;
            padding: 15px 20px;
            gap: 15px;
          }
          
          .header-left, .header-right {
            width: 100%;
            justify-content: space-between;
          }
          
          .dashboard-main {
            padding: 20px;
          }
        }

        @media (max-width: 576px) {
          .sidebar-stats {
            flex-direction: column;
          }
          
          .header-right {
            gap: 15px;
          }
          
          .user-details {
            display: none;
          }
          
          .dashboard-main {
            padding: 15px;
          }
        }
      `}</style>
    </div>
  );
};

export default DashboardLayout;