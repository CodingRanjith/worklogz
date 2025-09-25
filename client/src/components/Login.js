import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';

import worklogzImg from '../assets/worklogz.png';
import { API_ENDPOINTS } from '../utils/api';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(API_ENDPOINTS.login, { email, password }, { validateStatus: s => s < 500 });

      if (response.status !== 200) throw new Error(response.data?.error || 'Login failed');

      const token = response.data.token;
      localStorage.setItem('token', token);
      const decoded = jwtDecode(token);

      Swal.fire({
        icon: 'success',
        title: 'Welcome!',
        text: 'Login successful. Redirecting...',
        timer: 2000,
        showConfirmButton: false,
        timerProgressBar: true,
      });

      setTimeout(() => {
        if (decoded.role === 'admin') navigate('/dashboard');
        else if (decoded.role === 'employee') navigate('/attendance');
        else navigate('/');
      }, 2000);

    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: err?.message || 'Something went wrong.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{
        background: `linear-gradient(135deg, #d3c9ed 0%, #fff 100%)`,
        position: 'relative',
        fontFamily: 'Poppins, sans-serif',
        overflow: 'hidden',
      }}
    >
      {/* Matrix lines background */}
      <svg
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
        }}
        width="100%"
        height="100%"
        viewBox="0 0 1440 900"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g opacity="0.12">
          {/* Vertical lines */}
          {[...Array(20)].map((_, i) => (
            <line
              key={`v${i}`}
              x1={i * 72}
              y1="0"
              x2={i * 72}
              y2="900"
              stroke="#8b72cc"
              strokeWidth="2"
            />
          ))}
          {/* Horizontal lines */}
          {[...Array(13)].map((_, i) => (
            <line
              key={`h${i}`}
              x1="0"
              y1={i * 72}
              x2="1440"
              y2={i * 72}
              stroke="#8b72cc"
              strokeWidth="2"
            />
          ))}
        </g>
      </svg>
      <div
        className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 bg-white/80 border rounded-3xl shadow-xl px-0 py-0 relative"
        style={{
          borderColor: '#d3c9ed',
          fontFamily: 'Poppins, sans-serif',
          zIndex: 1,
        }}
      >
        {/* Left: Login Form */}
        <div className="col-span-1 px-8 py-10 flex flex-col justify-center">
          <div className="flex justify-center items-center gap-4 mb-6">
            <h1
              className="text-4xl font-extrabold tracking-wide"
              style={{ color: '#181818', fontFamily: 'Sora, sans-serif', fontWeight: 900, letterSpacing: '1px' }}
            >
              Worklogz
            </h1>
          </div>

          <div className="text-center mb-8">
            <h2
              className="text-3xl font-extrabold mb-2"
              style={{ color: '#8b72cc', fontFamily: 'Sora, sans-serif' }}
            >
              Sign In
            </h2>
            <p className="text-sm" style={{ color: '#181818', fontFamily: 'Poppins, sans-serif' }}>
              Enter your credentials below
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold mb-1"
                style={{ color: '#181818', fontFamily: 'Poppins, sans-serif' }}
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border"
                style={{
                  borderColor: '#d3c9ed',
                  background: '#fff',
                  color: '#181818',
                  fontFamily: 'Poppins, sans-serif',
                }}
                placeholder="you@domain.com"
              />
            </div>

            <div style={{ position: 'relative' }}>
              <label
                htmlFor="password"
                className="block text-sm font-semibold mb-1"
                style={{ color: '#181818', fontFamily: 'Poppins, sans-serif' }}
              >
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border pr-10"
                style={{
                  borderColor: '#d3c9ed',
                  background: '#fff',
                  color: '#181818',
                  fontFamily: 'Poppins, sans-serif',
                }}
                placeholder="••••••••"
              />
              <span
                onClick={() => setShowPassword((prev) => !prev)}
                style={{
                  position: 'absolute',
                  right: '18px',
                  top: '44px',
                  cursor: 'pointer',
                  color: '#8b72cc',
                  fontSize: '1.2rem',
                }}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2" style={{ color: '#181818', fontFamily: 'Poppins, sans-serif' }}>
                <input type="checkbox" style={{ accentColor: '#8b72cc' }} />
                Remember me
              </label>
              <button
                type="button"
                onClick={() =>
                  Swal.fire({
                    icon: 'info',
                    title: 'Forgot Password?',
                    text: 'Contact admin for password reset.',
                  })
                }
                className="hover:underline font-medium"
                style={{ color: '#fff', fontFamily: 'Poppins, sans-serif' }}
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full font-semibold py-3 rounded-lg transition duration-150 shadow-md"
              style={{
                background: '#8b72cc',
                color: '#fff',
                fontFamily: 'Poppins, sans-serif',
              }}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="text-center text-sm mt-6" style={{ color: '#181818', fontFamily: 'Poppins, sans-serif' }}>
            Don’t have an account?{' '}
            <a href="/register" className="font-semibold hover:underline" style={{ color: '#8b72cc', fontFamily: 'Poppins, sans-serif' }}>
              Register
            </a>
          </div>
        </div>
        {/* Right: Image and color box */}
        <div className="col-span-1 flex items-stretch justify-center relative">
          <div
            style={{
              width: '100%',
              height: '100%',
              minHeight: '400px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                width: '90%',
                height: '90%',
                background: 'linear-gradient(135deg, #d3c9ed 60%, #8b72cc 100%)',
                borderRadius: '2rem',
                boxShadow: '0 8px 32px rgba(139,114,204,0.18)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                minHeight: '340px',
              }}
            >
              <img
                src={worklogzImg}
                alt="Login Visual"
                style={{
                  width: '100%',
                  maxWidth: '350px',
                  height: 'auto',
                  objectFit: 'contain',
                  borderRadius: '1.5rem',
                  boxShadow: '0 4px 16px rgba(139,114,204,0.12)',
                  display: 'block',
                  margin: '0 auto',
                }}
              />
              {/* Decorative color box */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '-32px',
                  right: '-32px',
                  width: '80px',
                  height: '80px',
                  background: '#8b72cc',
                  borderRadius: '1rem',
                  opacity: 0.7,
                  boxShadow: '0 2px 8px rgba(139,114,204,0.18)',
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
