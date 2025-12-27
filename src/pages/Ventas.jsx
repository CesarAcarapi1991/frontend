// import { useEffect, useState } from 'react';
// import api from '../api/api';

// const Ventas = () => {
//   const [productos, setProductos] = useState([]);
//   const [carrito, setCarrito] = useState([]);
//   const [clientes, setClientes] = useState([]);
//   const [clienteId, setClienteId] = useState('');
//   const [busqueda, setBusqueda] = useState('');

//   useEffect(() => {
//     api.get('/productos').then(res => setProductos(res.data));
//     api.get('/clientes').then(res => setClientes(res.data)); // carga inicial
//   }, []);

//   const filtrarClientes = clientes.filter(c =>
//     c.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
//     c.ci_nit.toLowerCase().includes(busqueda.toLowerCase())
//   );

//   const agregar = (producto) => {
//     const existe = carrito.find(p => p.id === producto.id);
//     if (existe) {
//       setCarrito(
//         carrito.map(p =>
//           p.id === producto.id
//             ? { ...p, cantidad: p.cantidad + 1 }
//             : p
//         )
//       );
//     } else {
//       setCarrito([...carrito, { ...producto, cantidad: 1 }]);
//     }
//   };

// const cambiarCantidad = (id, cantidad) => {
//   setCarrito(carrito.map(p => {
//     if (p.id === id) {
//       const nuevaCantidad = Math.min(Number(cantidad), p.stock); // no superar stock
//       return { ...p, cantidad: nuevaCantidad };
//     }
//     return p;
//   }));
// };


//   const total = carrito.reduce((sum, p) => sum + p.precio * p.cantidad, 0);

//   const confirmarVenta = async () => {
//     if (!clienteId) return alert('Seleccione un cliente');
//     if (!carrito.length) return alert('Agregue productos al carrito');

//     await api.post('/ventas', {
//       cliente_id: clienteId,
//       items: carrito.map(p => ({
//         producto_id: p.id,
//         cantidad: p.cantidad
//       }))
//     });

//     setCarrito([]);
//     setClienteId('');
//     alert('Venta registrada');
//   };

//   return (
//     <div>
//       <h2>Ventas</h2>

//       <input
//         placeholder="Buscar cliente por nombre o NIT"
//         value={busqueda}
//         onChange={e => setBusqueda(e.target.value)}
//       />

//       <select value={clienteId} onChange={e => setClienteId(e.target.value)}>
//         <option value="">Seleccione cliente</option>
//         {filtrarClientes.map(c => (
//           <option key={c.id} value={c.id}>
//             {c.nombre} - {c.ci_nit}
//           </option>
//         ))}
//       </select>

//       <h3>Productos</h3>
//       {productos.map(p => (
//         <div key={p.id}>
//           {p.nombre} - Bs {p.precio} (Stock {p.stock})
//           <button onClick={() => agregar(p)}>Agregar</button>
//         </div>
//       ))}

//       <h3>Carrito</h3>
//       {carrito.map(p => (
//         <div key={p.id}>
//           {p.nombre} - Bs {p.precio}
//           <input
//             type="number"
//             value={p.cantidad}
//             min="1"
//             onChange={e => cambiarCantidad(p.id, e.target.value)}
//           />
//         </div>
//       ))}

//       <h3>Total: Bs {total}</h3>

//       <button onClick={confirmarVenta} disabled={!carrito.length || !clienteId}>
//         Confirmar venta
//       </button>
//     </div>
//   );
// };

// export default Ventas;


import { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/api';
import '../css/Ventas.css';

const Ventas = () => {
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [clienteId, setClienteId] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [busquedaProducto, setBusquedaProducto] = useState('');
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [activeTab, setActiveTab] = useState('productos'); // 'productos' o 'clientes'
  const navigate = useNavigate();
  const carritoRef = useRef(null);

  // Cargar datos iniciales
  useEffect(() => {
    cargarDatos();
  }, []);

  // Scroll al carrito cuando se agregan productos
  useEffect(() => {
    if (carrito.length > 0 && carritoRef.current) {
      carritoRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [carrito.length]);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [productosRes, clientesRes] = await Promise.all([
        api.get('/productos'),
        api.get('/clientes')
      ]);
      setProductos(productosRes.data);
      setClientes(clientesRes.data);
    } catch (error) {
      mostrarNotificacion('Error al cargar datos', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Filtrar clientes
  const filtrarClientes = clientes.filter(c =>
    c.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    (c.ci_nit && c.ci_nit.toLowerCase().includes(busqueda.toLowerCase()))
  );

  // Filtrar productos
  const filtrarProductos = productos.filter(p =>
    p.nombre.toLowerCase().includes(busquedaProducto.toLowerCase()) ||
    (p.codigo && p.codigo.toLowerCase().includes(busquedaProducto.toLowerCase()))
  );

  // Agregar producto al carrito
  const agregarAlCarrito = (producto) => {
    if (producto.stock <= 0) {
      mostrarNotificacion('Producto sin stock disponible', 'warning');
      return;
    }

    const existe = carrito.find(p => p.id === producto.id);
    if (existe) {
      if (existe.cantidad >= producto.stock) {
        mostrarNotificacion('Stock insuficiente', 'warning');
        return;
      }
      setCarrito(carrito.map(p =>
        p.id === producto.id ? { ...p, cantidad: p.cantidad + 1 } : p
      ));
    } else {
      setCarrito([...carrito, { 
        ...producto, 
        cantidad: 1,
        subtotal: producto.precio 
      }]);
    }
    
    mostrarNotificacion(`${producto.nombre} agregado al carrito`, 'success');
    setActiveTab('carrito'); // Cambiar a pestaña de carrito
  };

  // Agregar rápido desde búsqueda
  const agregarRapido = (producto) => {
    agregarAlCarrito(producto);
    setBusquedaProducto(''); // Limpiar búsqueda
  };

  // Cambiar cantidad en carrito
  const cambiarCantidad = (id, cantidad) => {
    const producto = carrito.find(p => p.id === id);
    if (!producto) return;

    const nuevaCantidad = Math.max(1, Math.min(Number(cantidad), producto.stock));
    setCarrito(carrito.map(p =>
      p.id === id ? { 
        ...p, 
        cantidad: nuevaCantidad,
        subtotal: nuevaCantidad * p.precio 
      } : p
    ));
  };

  // Eliminar producto del carrito
  const eliminarDelCarrito = (id) => {
    setCarrito(carrito.filter(p => p.id !== id));
    mostrarNotificacion('Producto eliminado del carrito', 'info');
  };

  // Limpiar carrito
  const limpiarCarrito = () => {
    setCarrito([]);
    mostrarNotificacion('Carrito vaciado', 'info');
  };

  // Calcular totales
  const subtotal = carrito.reduce((sum, p) => sum + (p.precio * p.cantidad), 0);
  const iva = subtotal * 0.13; // 13% IVA
  const total = subtotal + iva;

  // Confirmar venta
  const confirmarVenta = async () => {
    if (!clienteId) {
      mostrarNotificacion('Seleccione un cliente', 'warning');
      setActiveTab('clientes');
      return;
    }
    
    if (!carrito.length) {
      mostrarNotificacion('Agregue productos al carrito', 'warning');
      setActiveTab('productos');
      return;
    }

    try {
      setProcessing(true);
      await api.post('/ventas', {
        cliente_id: clienteId,
        items: carrito.map(p => ({
          producto_id: p.id,
          cantidad: p.cantidad,
          precio_unitario: p.precio
        }))
      });

      // Actualizar stock localmente
      const nuevosProductos = productos.map(producto => {
        const itemCarrito = carrito.find(p => p.id === producto.id);
        if (itemCarrito) {
          return { 
            ...producto, 
            stock: producto.stock - itemCarrito.cantidad 
          };
        }
        return producto;
      });

      setProductos(nuevosProductos);
      setCarrito([]);
      setClienteId('');
      setBusqueda('');
      
      mostrarNotificacion('¡Venta registrada exitosamente!', 'success');
      setTimeout(() => {
        navigate('/historial');
      }, 2000);
    } catch (error) {
      mostrarNotificacion('Error al registrar la venta', 'error');
    } finally {
      setProcessing(false);
    }
  };

  // Mostrar notificación
  const mostrarNotificacion = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  // Cliente seleccionado
  const clienteSeleccionado = clientes.find(c => c.id == clienteId);

  return (
    <div className="ventas-container">
      {/* Notificación */}
      {notification.show && (
        <div className={`notification notification-${notification.type}`}>
          {notification.message}
        </div>
      )}

      {/* Header Fijo */}
      <div className="ventas-header">
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
            <h1 className="page-title">Nueva Venta</h1>
            <p className="page-subtitle">Procesar transacción de venta</p>
          </div>
        </div>
        
        {/* Barra de pestañas */}
        <div className="tabs-container">
          <div className="tabs">
            <button 
              className={`tab ${activeTab === 'productos' ? 'active' : ''}`}
              onClick={() => setActiveTab('productos')}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              Productos
            </button>
            <button 
              className={`tab ${activeTab === 'clientes' ? 'active' : ''}`}
              onClick={() => setActiveTab('clientes')}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Clientes
            </button>
            <button 
              className={`tab ${activeTab === 'carrito' ? 'active' : ''}`}
              onClick={() => setActiveTab('carrito')}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Carrito
              {carrito.length > 0 && <span className="tab-badge">{carrito.length}</span>}
            </button>
          </div>
        </div>
      </div>

      {/* Layout de contenido mejorado */}
      <div className="ventas-layout">
        {/* Panel izquierdo - Contenido dinámico */}
        <div className="main-panel">
          {/* Barra de búsqueda flotante */}
          <div className="search-bar">
            {activeTab === 'productos' ? (
              <div className="search-group">
                <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Buscar producto por nombre o código..."
                  value={busquedaProducto}
                  onChange={e => setBusquedaProducto(e.target.value)}
                  className="search-input"
                />
                {busquedaProducto && (
                  <button 
                    className="btn-clear-search"
                    onClick={() => setBusquedaProducto('')}
                  >
                    ✕
                  </button>
                )}
              </div>
            ) : activeTab === 'clientes' ? (
              <div className="search-group">
                <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Buscar cliente por nombre o NIT..."
                  value={busqueda}
                  onChange={e => setBusqueda(e.target.value)}
                  className="search-input"
                />
                {busqueda && (
                  <button 
                    className="btn-clear-search"
                    onClick={() => setBusqueda('')}
                  >
                    ✕
                  </button>
                )}
              </div>
            ) : (
              <div className="search-group">
                <span className="cart-title">Carrito de Compras</span>
              </div>
            )}
          </div>

          {/* Contenido de la pestaña activa */}
          <div className="tab-content">
            {activeTab === 'productos' && (
              <div className="productos-content">
                {loading ? (
                  <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Cargando productos...</p>
                  </div>
                ) : filtrarProductos.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">📦</div>
                    <p>No se encontraron productos</p>
                    <p className="empty-subtitle">Intenta con otros términos de búsqueda</p>
                  </div>
                ) : (
                  <div className="productos-grid">
                    {filtrarProductos.map(producto => (
                      <div 
                        key={producto.id} 
                        className={`producto-card ${producto.stock <= 0 ? 'out-of-stock' : ''}`}
                      >
                        <div className="producto-header">
                          <div className="producto-codigo">{producto.codigo || 'SIN-COD'}</div>
                          <div className={`stock-indicator ${producto.stock <= 0 ? 'danger' : producto.stock < 5 ? 'warning' : 'success'}`}>
                            {producto.stock} unidades
                          </div>
                        </div>
                        <div className="producto-body">
                          <h4 className="producto-nombre">{producto.nombre}</h4>
                          <div className="producto-categoria">{producto.categoria || 'Sin categoría'}</div>
                          <div className="producto-descripcion">
                            {producto.descripcion || 'Sin descripción disponible'}
                          </div>
                        </div>
                        <div className="producto-footer">
                          <div className="producto-precio">
                            <span className="precio-label">Precio:</span>
                            <span className="precio-valor">Bs {producto.precio.toLocaleString()}</span>
                          </div>
                          <button 
                            className={`btn-add-producto ${producto.stock <= 0 ? 'disabled' : ''}`}
                            onClick={() => agregarRapido(producto)}
                            disabled={producto.stock <= 0 || processing}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                            </svg>
                            Agregar
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'clientes' && (
              <div className="clientes-content">
                {clienteSeleccionado ? (
                  <div className="cliente-seleccionado">
                    <div className="cliente-header">
                      <div className="cliente-avatar">
                        {clienteSeleccionado.nombre.charAt(0).toUpperCase()}
                      </div>
                      <div className="cliente-info">
                        <h3 className="cliente-nombre">{clienteSeleccionado.nombre}</h3>
                        <div className="cliente-datos">
                          <span className="cliente-nit">NIT: {clienteSeleccionado.ci_nit || 'No especificado'}</span>
                          <span className="cliente-telefono">📞 {clienteSeleccionado.telefono || 'Sin teléfono'}</span>
                          <span className="cliente-email">✉️ {clienteSeleccionado.email || 'Sin email'}</span>
                        </div>
                      </div>
                    </div>
                    <div className="cliente-actions">
                      <button 
                        className="btn-change-cliente"
                        onClick={() => setClienteId('')}
                      >
                        Cambiar Cliente
                      </button>
                      <button 
                        className="btn-continuar"
                        onClick={() => setActiveTab('productos')}
                      >
                        Continuar a Productos →
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="clientes-list">
                    {filtrarClientes.length === 0 ? (
                      <div className="empty-state">
                        <div className="empty-icon">👥</div>
                        <p>No se encontraron clientes</p>
                        <p className="empty-subtitle">Intenta con otros términos de búsqueda</p>
                        <button className="btn-new-cliente">
                          + Nuevo Cliente
                        </button>
                      </div>
                    ) : (
                      filtrarClientes.map(cliente => (
                        <div 
                          key={cliente.id}
                          className="cliente-card"
                          onClick={() => setClienteId(cliente.id)}
                        >
                          <div className="cliente-card-avatar">
                            {cliente.nombre.charAt(0).toUpperCase()}
                          </div>
                          <div className="cliente-card-info">
                            <div className="cliente-card-nombre">{cliente.nombre}</div>
                            <div className="cliente-card-detalles">
                              <span>NIT: {cliente.ci_nit || 'No especificado'}</span>
                              <span>📞 {cliente.telefono || 'Sin teléfono'}</span>
                            </div>
                          </div>
                          <div className="cliente-card-select">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'carrito' && (
              <div ref={carritoRef} className="carrito-content">
                {carrito.length === 0 ? (
                  <div className="empty-cart">
                    <div className="empty-cart-icon">🛒</div>
                    <h3>Carrito Vacío</h3>
                    <p className="empty-subtitle">Agrega productos para comenzar una venta</p>
                    <button 
                      className="btn-browse-products"
                      onClick={() => setActiveTab('productos')}
                    >
                      Explorar Productos
                    </button>
                  </div>
                ) : (
                  <div className="carrito-items">
                    {carrito.map(item => (
                      <div key={item.id} className="carrito-item">
                        <div className="carrito-item-info">
                          <div className="carrito-item-header">
                            <h4 className="carrito-item-nombre">{item.nombre}</h4>
                            <button 
                              className="btn-remove-item"
                              onClick={() => eliminarDelCarrito(item.id)}
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                          <div className="carrito-item-details">
                            <span className="item-codigo">{item.codigo || 'SIN-COD'}</span>
                            <span className="item-categoria">{item.categoria || 'Sin categoría'}</span>
                          </div>
                          <div className="carrito-item-pricing">
                            <div className="item-precio-unit">Bs {item.precio.toLocaleString()} c/u</div>
                            <div className="item-subtotal">Bs {(item.precio * item.cantidad).toLocaleString()}</div>
                          </div>
                        </div>
                        <div className="carrito-item-controls">
                          <div className="quantity-selector">
                            <button 
                              className="qty-btn minus"
                              onClick={() => cambiarCantidad(item.id, item.cantidad - 1)}
                              disabled={item.cantidad <= 1}
                            >
                              −
                            </button>
                            <input
                              type="number"
                              min="1"
                              max={item.stock}
                              value={item.cantidad}
                              onChange={e => cambiarCantidad(item.id, e.target.value)}
                              className="qty-input"
                            />
                            <button 
                              className="qty-btn plus"
                              onClick={() => cambiarCantidad(item.id, item.cantidad + 1)}
                              disabled={item.cantidad >= item.stock}
                            >
                              +
                            </button>
                          </div>
                          <div className="stock-disponible">
                            Disponible: {item.stock}
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="carrito-actions">
                      <button 
                        className="btn-clear-all"
                        onClick={limpiarCarrito}
                        disabled={processing}
                      >
                        Vaciar Carrito
                      </button>
                      <button 
                        className="btn-add-more"
                        onClick={() => setActiveTab('productos')}
                      >
                        + Agregar Más Productos
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Panel derecho - Resumen fijo */}
        <div className="sidebar-resumen">
          <div className="resumen-card">
            <div className="resumen-header">
              <h3 className="resumen-title">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Resumen de Venta
              </h3>
            </div>

            <div className="resumen-body">
              {/* Info Cliente */}
              <div className="resumen-section">
                <div className="section-label">Cliente</div>
                {clienteSeleccionado ? (
                  <div className="cliente-resumen">
                    <div className="cliente-resumen-nombre">{clienteSeleccionado.nombre}</div>
                    <div className="cliente-resumen-nit">NIT: {clienteSeleccionado.ci_nit || 'No especificado'}</div>
                  </div>
                ) : (
                  <div className="cliente-no-seleccionado">
                    <span className="warning-text">⚠️ No seleccionado</span>
                    <button 
                      className="btn-select-cliente"
                      onClick={() => setActiveTab('clientes')}
                    >
                      Seleccionar
                    </button>
                  </div>
                )}
              </div>

              {/* Info Productos */}
              <div className="resumen-section">
                <div className="section-label">Productos</div>
                <div className="productos-resumen">
                  {carrito.length === 0 ? (
                    <div className="no-productos">Sin productos</div>
                  ) : (
                    <div className="productos-lista">
                      {carrito.slice(0, 3).map(item => (
                        <div key={item.id} className="producto-resumen">
                          <div className="producto-resumen-nombre">{item.nombre}</div>
                          <div className="producto-resumen-cantidad">
                            {item.cantidad} × Bs {item.precio.toLocaleString()}
                          </div>
                        </div>
                      ))}
                      {carrito.length > 3 && (
                        <div className="more-products">
                          +{carrito.length - 3} más productos
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Totales */}
              <div className="resumen-section totales">
                <div className="total-row">
                  <span>Subtotal</span>
                  <span className="total-value">Bs {subtotal.toLocaleString()}</span>
                </div>
                <div className="total-row">
                  <span>IVA 13%</span>
                  <span className="total-value">Bs {iva.toLocaleString()}</span>
                </div>
                <div className="total-row total-final">
                  <span>TOTAL</span>
                  <span className="total-final-value">Bs {total.toLocaleString()}</span>
                </div>
              </div>

              {/* Estado de la venta */}
              <div className="venta-status">
                <div className="status-item">
                  <div className={`status-indicator ${clienteId ? 'completed' : 'pending'}`}></div>
                  <span>Cliente seleccionado</span>
                </div>
                <div className="status-item">
                  <div className={`status-indicator ${carrito.length > 0 ? 'completed' : 'pending'}`}></div>
                  <span>Productos agregados ({carrito.length})</span>
                </div>
                <div className="status-item">
                  <div className={`status-indicator ${clienteId && carrito.length > 0 ? 'completed' : 'pending'}`}></div>
                  <span>Listo para procesar</span>
                </div>
              </div>
            </div>

            <div className="resumen-actions">
              <button 
                className={`btn-confirm-venta ${!clienteId || carrito.length === 0 ? 'disabled' : ''}`}
                onClick={confirmarVenta}
                disabled={!clienteId || carrito.length === 0 || processing}
              >
                {processing ? (
                  <>
                    <div className="spinner-small"></div>
                    Procesando...
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Confirmar Venta
                  </>
                )}
              </button>
              
              <div className="action-buttons">
                <button 
                  className="btn-print"
                  onClick={() => window.print()}
                  disabled={carrito.length === 0}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  Vista Previa
                </button>
                <button 
                  className="btn-save"
                  onClick={() => {/* Guardar borrador */}}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                  </svg>
                  Guardar
                </button>
              </div>
            </div>
          </div>

          {/* Atajos rápidos */}
          <div className="quick-actions">
            <div className="quick-action" onClick={() => setActiveTab('productos')}>
              <div className="quick-action-icon">📦</div>
              <div className="quick-action-text">Agregar Productos</div>
            </div>
            <div className="quick-action" onClick={() => setActiveTab('clientes')}>
              <div className="quick-action-icon">👥</div>
              <div className="quick-action-text">Cambiar Cliente</div>
            </div>
            <div className="quick-action" onClick={limpiarCarrito}>
              <div className="quick-action-icon">🗑️</div>
              <div className="quick-action-text">Limpiar Carrito</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ventas;