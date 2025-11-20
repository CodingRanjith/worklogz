import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';

import worklogzImg from "../assets/worklogz.png";
import { API_ENDPOINTS } from "../utils/api";
import "../styles/m365Theme.css";
import "../styles/auth.css";

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

  const navOptions = [
    "For individuals",
    "For business",
    "For enterprise",
    "For education",
  ];
  const tabs = [
    "How it works",
    "Featured news",
    "What’s included",
    "Plans",
    "Customer stories",
  ];

  return (
    <div className="auth-shell">
      <nav className="auth-navbar">
        <div className="auth-navbar__segments">
          {navOptions.map((label, idx) => (
            <button
              key={label}
              className={`auth-pill ${idx === 0 ? 'is-active' : ''}`}
              type="button"
            >
              {label}
            </button>
          ))}
        </div>
        <button className="auth-navbar__cta" type="button">
          See plans and pricing
        </button>
      </nav>

      <div className="auth-tabs">
        {tabs.map((tab) => (
          <button key={tab} className={` ${tab === "How it works" ? 'is-active' : ''}`} type="button">
            {tab}
          </button>
        ))}
      </div>

      <div className="auth-main">
        <section className="auth-hero">
          <div className="auth-eyebrow">How it works</div>
          <h1>Your routine just got an upgrade</h1>
          <p>
            Unlock creativity with Worklogz’s calm, modern workspace. Automate time tracking,
            streamline attendance, and stay aligned with company-wide goals from anywhere.
          </p>
          <div className="auth-hero__cta">
            <button className="primary" type="button">Start now</button>
            <button className="secondary" type="button">Watch overview</button>
          </div>
          <div className="auth-highlight-grid">
            <div className="auth-highlight-card">
              <h4>Attendance</h4>
              <strong>99.2%</strong>
              <span>Real-time accuracy</span>
            </div>
            <div className="auth-highlight-card">
              <h4>Automation</h4>
              <strong>+42%</strong>
              <span>Efficiency gain</span>
            </div>
            <div className="auth-highlight-card">
              <h4>Global</h4>
              <strong>120+</strong>
              <span>Teams onboarded</span>
            </div>
          </div>
          <div className="auth-highlight-card" style={{ marginTop: '0.5rem' }}>
            <h4>Unlock your creativity</h4>
            <p style={{ margin: 0, color: 'var(--auth-muted)' }}>
              Edit tasks like a pro, turn ideas into stunning timelines, and overcome blockers with confidence.
            </p>
          </div>
        </section>

        <section className="auth-form-card">
          <div>
            <h2>Sign in</h2>
            <p style={{ color: 'var(--auth-muted)' }}>Use your Worklogz credentials to continue</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-input-wrapper">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                className="auth-input"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="auth-input-wrapper" style={{ position: 'relative' }}>
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className="auth-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span
                onClick={() => setShowPassword((prev) => !prev)}
                style={{
                  position: 'absolute',
                  right: '1rem',
                  top: '2.65rem',
                  cursor: 'pointer',
                  color: '#7c3aed',
                  fontSize: '1.1rem',
                }}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <div className="auth-remember">
              <label className="flex items-center gap-2">
                <input type="checkbox" />
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
                className="underline text-sm font-semibold"
              >
                Forgot password?
              </button>
            </div>

            <button className="auth-submit" type="submit" disabled={isLoading}>
              {isLoading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <div className="auth-highlight-card" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <img
              src={worklogzImg}
              alt="Worklogz"
              style={{ width: 64, height: 64, borderRadius: 20, objectFit: 'cover' }}
            />
            <div>
              <strong style={{ fontSize: '1rem' }}>Generating presentation topics…</strong>
              <p style={{ margin: 0, color: 'var(--auth-muted)' }}>Smart assistance for everyday workflows</p>
            </div>
          </div>

          <div className="auth-footer">
            Don’t have an account?{' '}
            <a href="/register">Register</a>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Login;
