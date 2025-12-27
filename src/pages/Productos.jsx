import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/api';
import '../css/Productos.css';

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' o 'edit'
  const [selectedProduct, setSelectedProduct] = useState(null);
  const navigate = useNavigate();
  
  const [form, setForm] = useState({
    nombre: '',
    precio: '',
    stock: '',
    categoria_id: ''
  });

  // Cargar productos
  const cargarProductos = async () => {
    try {
      setLoading(true);
      const res = await api.get('/productos');
      setProductos(res.data);
    } catch (error) {
      console.error('Error al cargar productos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Cargar categorías
  const cargarCategorias = async () => {
    try {
      const res = await api.get('/categorias');
      setCategorias(res.data);
    } catch (error) {
      console.error('Error al cargar categorías:', error);
    }
  };

  useEffect(() => {
    cargarProductos();
    cargarCategorias();
  }, []);

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Abrir modal para crear producto
  const openCreateModal = () => {
    setForm({ nombre: '', precio: '', stock: '', categoria_id: '' });
    setModalMode('create');
    setModalOpen(true);
  };

  // Abrir modal para editar producto
  const openEditModal = (producto) => {
    setSelectedProduct(producto);
    setForm({
      nombre: producto.nombre,
      precio: producto.precio,
      stock: producto.stock,
      categoria_id: producto.categoria_id
    });
    setModalMode('edit');
    setModalOpen(true);
  };

  // Cerrar modal
  const closeModal = () => {
    setModalOpen(false);
    setSelectedProduct(null);
  };

  // Guardar producto (crear o editar)
  const guardarProducto = async (e) => {
    e.preventDefault();
    
    try {
      const productoData = {
        ...form,
        precio: Number(form.precio),
        stock: Number(form.stock) || 0
      };

      if (modalMode === 'create') {
        await api.post('/productos', productoData);
      } else {
        await api.put(`/productos/${selectedProduct.id}`, productoData);
      }

      cargarProductos();
      closeModal();
    } catch (error) {
      console.error('Error al guardar producto:', error);
    }
  };

  // Eliminar producto
  const eliminarProducto = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este producto?')) {
      try {
        await api.delete(`/productos/${id}`);
        cargarProductos();
      } catch (error) {
        console.error('Error al eliminar producto:', error);
      }
    }
  };

  // Filtrar productos
  const productosFiltrados = productos.filter(producto => {
    const matchesSearch = producto.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === '' || producto.categoria_id == selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Estadísticas
  const totalProductos = productos.length;
  const totalStock = productos.reduce((acc, p) => acc + (p.stock || 0), 0);
  const valorInventario = productos.reduce((acc, p) => acc + (p.precio * (p.stock || 0)), 0);
  const productosSinStock = productos.filter(p => (p.stock || 0) <= 0).length;

  return (
    <div className="financial-container">
      {/* Header */}
      <div className="financial-header">
        <div className='header-left'>
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
            <h1 className="page-title">Gestión de Inventario</h1>
            <p className="page-subtitle">Control de productos y existencias</p>
          </div>
        </div>
        <div className="header-right">
          <button className="btn-financial-primary" onClick={openCreateModal}>
            <span className="btn-icon">+</span>
            Nuevo Producto
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="filters-bar">
        <div className="search-box">
          <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Buscar producto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="category-filter"
        >
          <option value="">Todas las categorías</option>
          {categorias.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.nombre}</option>
          ))}
        </select>

        <button 
          className="btn-financial-secondary"
          onClick={() => {
            setSearchTerm('');
            setSelectedCategory('');
          }}
          disabled={!searchTerm && !selectedCategory}
        >
          Limpiar filtros
        </button>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-content">
            <div className="stat-value">{totalProductos}</div>
            <div className="stat-label">Productos Totales</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <div className="stat-value">{totalStock}</div>
            <div className="stat-label">Unidades en Stock</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <div className="stat-value">Bs.- {valorInventario.toLocaleString()}</div>
            <div className="stat-label">Valor Inventario</div>
          </div>
        </div>

        <div className="stat-card stat-card-warning">
          <div className="stat-icon">⚠️</div>
          <div className="stat-content">
            <div className="stat-value">{productosSinStock}</div>
            <div className="stat-label">Sin Stock</div>
          </div>
        </div>
      </div>

      {/* Tabla de productos */}
      <div className="table-container">
        <div className="table-header">
          <h3 className="table-title">Productos ({productosFiltrados.length})</h3>
          <div className="table-actions">
            <button 
              className="btn-refresh"
              onClick={cargarProductos}
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
            <div className="loading-spinner"></div>
            <span>Cargando productos...</span>
          </div>
        ) : productosFiltrados.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <p>No se encontraron productos</p>
          </div>
        ) : (
          <table className="financial-table">
            <thead>
              <tr>
                <th>Producto</th>
                <th className="text-right">Precio Unit.</th>
                <th className="text-center">Stock</th>
                <th>Categoría</th>
                <th className="text-center">Estado</th>
                <th className="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productosFiltrados.map(p => (
                <tr key={p.id} className={p.stock <= 0 ? 'row-out-of-stock' : ''}>
                  <td>
                    <div className="product-info">
                      <div className="product-name">{p.nombre}</div>
                      <div className="product-id">ID: #{p.id}</div>
                    </div>
                  </td>
                  <td className="text-right">
                    <span className="price">Bs.- {p.precio.toLocaleString()}</span>
                  </td>
                  <td className="text-center">
                    <div className={`stock-badge ${p.stock <= 0 ? 'badge-danger' : p.stock < 5 ? 'badge-warning' : 'badge-success'}`}>
                      {p.stock || 0}
                    </div>
                  </td>
                  <td>
                    <span className="category-label">{p.categoria}</span>
                  </td>
                  <td className="text-center">
                    <span className={`status-dot ${p.stock <= 0 ? 'status-danger' : p.stock < 5 ? 'status-warning' : 'status-success'}`}></span>
                    <span className="status-text">
                      {p.stock <= 0 ? 'Agotado' : p.stock < 5 ? 'Bajo Stock' : 'Disponible'}
                    </span>
                  </td>
                  <td className="text-center">
                    <div className="action-buttons">
                      <button 
                        className="btn-action btn-edit"
                        onClick={() => openEditModal(p)}
                        title="Editar"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button 
                        className="btn-action btn-delete"
                        onClick={() => eliminarProducto(p.id)}
                        title="Eliminar"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div className="table-footer">
          <div className="footer-info">
            Mostrando {productosFiltrados.length} de {productos.length} productos
          </div>
        </div>
      </div>

      {/* Modal para crear/editar producto */}
      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h3 className="modal-title">
                {modalMode === 'create' ? 'Nuevo Producto' : 'Editar Producto'}
              </h3>
              <button className="modal-close" onClick={closeModal}>
                ×
              </button>
            </div>

            <form onSubmit={guardarProducto} className="modal-form">
              <div className="form-group">
                <label className="form-label">Nombre del Producto *</label>
                <input
                  name="nombre"
                  placeholder="Ingrese nombre del producto"
                  value={form.nombre}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Precio *</label>
                  <div className="input-with-prefix">
                    <span className="input-prefix">$</span>
                    <input
                      name="precio"
                      placeholder="0.00"
                      type="number"
                      step="0.01"
                      min="0"
                      value={form.precio}
                      onChange={handleChange}
                      required
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Stock</label>
                  <input
                    name="stock"
                    placeholder="0"
                    type="number"
                    min="0"
                    value={form.stock}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Categoría *</label>
                <select
                  name="categoria_id"
                  value={form.categoria_id}
                  onChange={handleChange}
                  required
                  className="form-select"
                >
                  <option value="">Seleccione categoría</option>
                  {categorias.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="modal-actions">
                <button 
                  type="button" 
                  className="btn-financial-secondary"
                  onClick={closeModal}
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="btn-financial-primary"
                >
                  {modalMode === 'create' ? 'Crear Producto' : 'Guardar Cambios'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Productos;