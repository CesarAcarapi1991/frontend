import { useState, useContext, useEffect } from 'react';
import api from '../api/api';
import { AuthContext } from '../auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../css/Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({ email: '', password: '' });
  const [touched, setTouched] = useState({ email: false, password: false });
  const [isValidating, setIsValidating] = useState(false);
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) return 'Email es requerido';
    if (!emailRegex.test(email)) return 'Email inválido';
    return '';
  };

  const validatePassword = (password) => {
    if (!password.trim()) return 'Contraseña es requerida';
    if (password.length < 6) return 'Mínimo 6 caracteres';
    return '';
  };

  const validateForm = () => {
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    
    setFieldErrors({ 
      email: emailError, 
      password: passwordError 
    });
    
    return !emailError && !passwordError;
  };

  const handleBlur = (field) => (e) => {
    setTouched({ ...touched, [field]: true });
    const value = e.target.value;
    
    if (field === 'email') {
      setFieldErrors({ ...fieldErrors, email: validateEmail(value) });
    } else if (field === 'password') {
      setFieldErrors({ ...fieldErrors, password: validatePassword(value) });
    }
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    if (touched.email) {
      setFieldErrors({ ...fieldErrors, email: validateEmail(value) });
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    if (touched.password) {
      setFieldErrors({ ...fieldErrors, password: validatePassword(value) });
    }
  };

  // Auto-focus en email al cargar
  useEffect(() => {
    const emailInput = document.querySelector('input[type="email"]');
    if (emailInput) {
      setTimeout(() => {
        emailInput.focus();
      }, 300);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Marcar todos los campos como tocados
    setTouched({ email: true, password: true });
    
    // Validar formulario
    if (!validateForm()) {
      setIsValidating(true);
      setTimeout(() => setIsValidating(false), 500);
      return;
    }

    try {
      setLoading(true);
      const res = await api.post('/auth/login', { email, password });
      login(res.data);
      navigate('/');
    } catch (error) {
      const data = error.response?.data;
      if (data) {
        setError(data.mensaje || 'Credenciales incorrectas');
      } else {
        setError(error.response?.data?.error || 'Credenciales incorrectas');
      }
      
      // En caso de error del servidor, limpiar la contraseña
      setPassword('');
    } finally {
      setLoading(false);
    }
  };

  const getFieldStatus = (field) => {
    if (!touched[field]) return '';
    if (fieldErrors[field]) return 'error';
    if (field === 'email' && email && !fieldErrors.email) return 'success';
    if (field === 'password' && password && !fieldErrors.password) return 'success';
    return '';
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Header con botón de volver al home */}
        <div className="login-header">
          {/* <button 
            className="btn-back-home"
            onClick={() => navigate('/')}
            title="Volver al inicio"
            type="button"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Inicio
          </button> */}
          
          <div className="login-title-section">
            <div className="login-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
              </svg>
            </div>
            <h1 className="login-title">Sistema Inventario</h1>
            <p className="login-subtitle">Acceso de Usuario</p>
          </div>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className={`login-form ${isValidating ? 'validating' : ''}`}>
          {error && (
            <div className="login-error">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          <div className={`form-group ${getFieldStatus('email')}`}>
            <label className="form-label">Email</label>
            <div className="input-with-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
              </svg>
              <input
                type="email"
                placeholder="usuario@empresa.com"
                value={email}
                onChange={handleEmailChange}
                onBlur={handleBlur('email')}
                className="form-input"
                disabled={loading}
                autoComplete="email"
                spellCheck="false"
                autoCapitalize="none"
              />
              {getFieldStatus('email') === 'success' && (
                <div className="field-status-icon success">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </div>
            {touched.email && fieldErrors.email && (
              <div className="field-error-text">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {fieldErrors.email}
              </div>
            )}
          </div>

          <div className={`form-group ${getFieldStatus('password')}`}>
            <label className="form-label">Contraseña</label>
            <div className="input-with-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={handlePasswordChange}
                onBlur={handleBlur('password')}
                className="form-input"
                disabled={loading}
                autoComplete="current-password"
                spellCheck="false"
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPassword ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
              {getFieldStatus('password') === 'success' && (
                <div className="field-status-icon success">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </div>
            {touched.password && fieldErrors.password && (
              <div className="field-error-text">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {fieldErrors.password}
              </div>
            )}
          </div>

          <button 
            type="submit" 
            className="btn-login"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="spinner-small"></div>
                Verificando...
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Iniciar Sesión
              </>
            )}
          </button>
        </form>

        {/* Información del sistema */}
        <div className="system-info">
          <div className="info-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Sistema seguro
          </div>
          <div className="info-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Alta disponibilidad
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;