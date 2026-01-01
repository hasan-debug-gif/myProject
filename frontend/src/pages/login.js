import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    fetch("http://localhost:5000/login", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setError(data.error);
        } else {
          localStorage.setItem('user', JSON.stringify(data.user));
          if (data.user.role === 'admin') navigate('/admin');
          else if (data.user.role === 'organizer') navigate('/organizer');
          else navigate('/events');
        }
      })
      .catch(() => setError('Server error'));
  };

  // Inline styles for the login page
  const loginPageStyle = {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundImage: `url(${process.env.PUBLIC_URL + '/images/Home-page.jpg'})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    animation: "fadeInBg 2s ease-in"
  };

  const loginCardStyle = {
    backgroundColor: "rgba(0,0,0,0.65)",
    borderRadius: "1rem",
    padding: "2rem",
    width: "100%",
    maxWidth: "400px",
    animation: "slideUp 1s ease-out",
    boxShadow: "0 8px 20px rgba(0,0,0,0.4)"
  };

  const fadeInBg = `
    @keyframes fadeInBg {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `;

  const slideUp = `
    @keyframes slideUp {
      from { transform: translateY(50px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
  `;

  return (
    <div style={loginPageStyle}>
      {/* Inject keyframes */}
      <style>{fadeInBg}{slideUp}</style>

      <div style={loginCardStyle}>
        <h1 className="text-center mb-4 text-white">Welcome to Eventify</h1>
        <p className="text-center text-white mb-4">Book events, send messages, and more!</p>
        <form onSubmit={handleSubmit}>
          {error && <div className="alert alert-danger">{error}</div>}
          <div className="mb-3">
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="form-control"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="form-control"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>
          <button className="btn btn-primary w-100" type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}
