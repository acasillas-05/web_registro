import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';

function Login() {
  const [formData, setFormData] = useState({
    nombreCompleto: '',
    correo: '',
    password: ''
  });
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Obtener array de usuarios registrados
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Buscar usuario que coincida con las credenciales
    const user = users.find(u => 
      u.nombreCompleto === formData.nombreCompleto &&
      u.correo === formData.correo &&
      u.password === formData.password
    );
    
    if (user) {
      // Login exitoso - guardar usuario actual
      localStorage.setItem('currentUser', JSON.stringify(user));
      localStorage.setItem('isLoggedIn', 'true');
      navigate('/home');
    } else {
      setError('Credenciales incorrectas. Por favor, verifica tus datos.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <img src="/TM_Logo_Header.png" alt="TM Logo" className="login-logo" />
        <h2>Iniciar Sesión</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nombreCompleto">Nombre Completo</label>
            <input
              type="text"
              id="nombreCompleto"
              name="nombreCompleto"
              value={formData.nombreCompleto}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="correo">Correo Electrónico</label>
            <input
              type="email"
              id="correo"
              name="correo"
              value={formData.correo}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          
          <button type="submit" className="submit-btn">Iniciar Sesión</button>
        </form>
        <div className="register-link">
          ¿No tienes una cuenta? <Link to="/register">Regístrate</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
