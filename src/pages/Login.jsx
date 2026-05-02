import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { auth } from '../services/api';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    // Check for saved credentials
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      setFormData(prev => ({ ...prev, email: savedEmail }));
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await auth.login(formData);
      
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', formData.email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      toast.success('Welcome back! Redirecting...', {
        duration: 2000,
        icon: '🎉',
      });
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed. Please check your credentials.', {
        duration: 4000,
        icon: '❌',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setFormData({
      email: 'demo@example.com',
      password: 'demo123'
    });
    toast.success('Demo credentials loaded!', {
      icon: '✨',
    });
  };

  return (
    <div style={styles.container}>
      {/* Animated Background */}
      <div style={styles.background}>
        <div style={styles.bgCircle1}></div>
        <div style={styles.bgCircle2}></div>
        <div style={styles.bgCircle3}></div>
        <div style={styles.bgCircle4}></div>
      </div>

      {/* Main Card */}
      <div style={styles.card}>
        {/* Back Button for Mobile */}
        <button onClick={() => navigate('/')} style={styles.backButton}>
          ← Back
        </button>

        {/* Logo/Brand Section */}
        <div style={styles.brandSection}>
          <div style={styles.logoWrapper}>
            <span style={styles.logoIcon}>📋</span>
          </div>
          <h2 style={styles.title}>TaskFlow</h2>
          <p style={styles.tagline}>Manage your team efficiently</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>
              <span style={styles.labelIcon}>📧</span>
              Email Address
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              style={styles.input}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              autoComplete="email"
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>
              <span style={styles.labelIcon}>🔒</span>
              Password
            </label>
            <div style={styles.passwordWrapper}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                style={styles.passwordInput}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                style={styles.passwordToggle}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '👁️' : '🔒'}
              </button>
            </div>
          </div>

          <div style={styles.options}>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={styles.checkbox}
              />
              <span style={styles.checkboxText}>Remember me</span>
            </label>
            <Link to="/forgot-password" style={styles.forgotLink}>
              Forgot Password?
            </Link>
          </div>

          <button 
            type="submit" 
            style={{...styles.button, ...(isLoading && styles.buttonLoading)}}
            disabled={isLoading}
          >
            {isLoading ? (
              <span style={styles.loader}></span>
            ) : (
              'Sign In'
            )}
          </button>

          <div style={styles.divider}>
            <span style={styles.dividerLine}></span>
            <span style={styles.dividerText}>or</span>
            <span style={styles.dividerLine}></span>
          </div>

          <button 
            type="button" 
            style={styles.demoButton}
            onClick={handleDemoLogin}
          >
            <span style={styles.demoIcon}>🚀</span>
            Try Demo Account
          </button>
        </form>

        {/* Signup Link */}
        <div style={styles.signupSection}>
          <p style={styles.signupText}>
            New to TaskFlow?{' '}
            <Link to="/signup" style={styles.signupLink}>
              Create an account
            </Link>
          </p>
        </div>

        {/* Features Section */}
        <div style={styles.features}>
          <div style={styles.featureItem}>
            <span style={styles.featureIcon}>✓</span>
            <span style={styles.featureText}>Team Collaboration</span>
          </div>
          <div style={styles.featureItem}>
            <span style={styles.featureIcon}>✓</span>
            <span style={styles.featureText}>Task Management</span>
          </div>
          <div style={styles.featureItem}>
            <span style={styles.featureIcon}>✓</span>
            <span style={styles.featureText}>Real-time Updates</span>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'auto',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    padding: 'clamp(1rem, 5vw, 2rem)',
  },
  
  background: {
    position: 'fixed',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    overflow: 'hidden',
    top: 0,
    left: 0,
    zIndex: -1,
  },
  
  bgCircle1: {
    position: 'absolute',
    width: 'clamp(300px, 50vw, 500px)',
    height: 'clamp(300px, 50vw, 500px)',
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.1)',
    top: '-250px',
    right: '-250px',
    animation: 'float 20s infinite',
  },
  
  bgCircle2: {
    position: 'absolute',
    width: 'clamp(200px, 30vw, 300px)',
    height: 'clamp(200px, 30vw, 300px)',
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.05)',
    bottom: '-150px',
    left: '-150px',
    animation: 'float 15s infinite reverse',
  },
  
  bgCircle3: {
    position: 'absolute',
    width: 'clamp(150px, 20vw, 200px)',
    height: 'clamp(150px, 20vw, 200px)',
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.08)',
    bottom: '100px',
    right: '100px',
    animation: 'float 12s infinite',
  },
  
  bgCircle4: {
    position: 'absolute',
    width: 'clamp(100px, 15vw, 150px)',
    height: 'clamp(100px, 15vw, 150px)',
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.06)',
    top: '20%',
    left: '10%',
    animation: 'float 18s infinite',
  },
  
  card: {
    position: 'relative',
    width: '100%',
    maxWidth: '450px',
    margin: '0 auto',
    padding: 'clamp(1.5rem, 5vw, 2.5rem)',
    background: 'rgba(255,255,255,0.98)',
    backdropFilter: 'blur(10px)',
    borderRadius: '24px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
    animation: 'slideUp 0.6s ease',
  },
  
  backButton: {
    position: 'absolute',
    top: 'clamp(1rem, 3vw, 1.5rem)',
    left: 'clamp(1rem, 3vw, 1.5rem)',
    background: 'none',
    border: 'none',
    fontSize: 'clamp(0.75rem, 3vw, 0.875rem)',
    color: '#667eea',
    cursor: 'pointer',
    padding: '0.5rem',
    transition: 'all 0.3s ease',
    display: 'none', // Hidden by default, shown on mobile
  },
  
  brandSection: {
    textAlign: 'center',
    marginBottom: 'clamp(1.5rem, 4vw, 2rem)',
  },
  
  logoWrapper: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 'clamp(60px, 15vw, 70px)',
    height: 'clamp(60px, 15vw, 70px)',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '20px',
    marginBottom: '1rem',
    animation: 'rotateIn 0.5s ease',
  },
  
  logoIcon: {
    fontSize: 'clamp(2rem, 8vw, 2.5rem)',
  },
  
  title: {
    fontSize: 'clamp(1.5rem, 6vw, 1.875rem)',
    fontWeight: 'bold',
    margin: '0 0 8px 0',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  
  tagline: {
    fontSize: 'clamp(0.75rem, 3vw, 0.875rem)',
    color: '#718096',
    margin: 0,
  },
  
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  
  label: {
    fontSize: 'clamp(0.75rem, 3vw, 0.875rem)',
    fontWeight: '600',
    color: '#2d3748',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  
  labelIcon: {
    fontSize: '1rem',
  },
  
  input: {
    padding: 'clamp(0.625rem, 2vw, 0.75rem) clamp(0.75rem, 3vw, 1rem)',
    border: '2px solid #e2e8f0',
    borderRadius: '12px',
    fontSize: 'clamp(0.75rem, 3vw, 0.875rem)',
    transition: 'all 0.3s ease',
    outline: 'none',
    fontFamily: 'inherit',
    width: '100%',
    boxSizing: 'border-box',
  },
  
  passwordWrapper: {
    position: 'relative',
    width: '100%',
  },
  
  passwordInput: {
    width: '100%',
    padding: 'clamp(0.625rem, 2vw, 0.75rem) clamp(2.5rem, 8vw, 3rem) clamp(0.625rem, 2vw, 0.75rem) clamp(0.75rem, 3vw, 1rem)',
    border: '2px solid #e2e8f0',
    borderRadius: '12px',
    fontSize: 'clamp(0.75rem, 3vw, 0.875rem)',
    transition: 'all 0.3s ease',
    outline: 'none',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
  },
  
  passwordToggle: {
    position: 'absolute',
    right: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: 'clamp(1rem, 4vw, 1.125rem)',
    padding: '0.25rem',
  },
  
  options: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: 'clamp(0.75rem, 3vw, 0.875rem)',
    flexWrap: 'wrap',
    gap: '0.5rem',
  },
  
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    cursor: 'pointer',
  },
  
  checkbox: {
    width: 'clamp(14px, 4vw, 16px)',
    height: 'clamp(14px, 4vw, 16px)',
    cursor: 'pointer',
  },
  
  checkboxText: {
    color: '#4a5568',
  },
  
  forgotLink: {
    color: '#667eea',
    textDecoration: 'none',
    fontSize: 'clamp(0.75rem, 3vw, 0.875rem)',
    fontWeight: '500',
    transition: 'color 0.3s ease',
  },
  
  button: {
    padding: 'clamp(0.75rem, 3vw, 0.875rem)',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: 'clamp(0.875rem, 3vw, 1rem)',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    marginTop: '0.5rem',
  },
  
  buttonLoading: {
    opacity: 0.7,
    cursor: 'not-allowed',
  },
  
  loader: {
    display: 'inline-block',
    width: '20px',
    height: '20px',
    border: '2px solid rgba(255,255,255,0.3)',
    borderTop: '2px solid white',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  
  divider: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    margin: '0.5rem 0',
  },
  
  dividerLine: {
    flex: 1,
    height: '1px',
    background: '#e2e8f0',
  },
  
  dividerText: {
    fontSize: 'clamp(0.7rem, 2.5vw, 0.75rem)',
    color: '#a0aec0',
  },
  
  demoButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    padding: 'clamp(0.625rem, 2vw, 0.75rem)',
    background: 'white',
    color: '#667eea',
    border: '2px solid #667eea',
    borderRadius: '12px',
    fontSize: 'clamp(0.75rem, 3vw, 0.875rem)',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  
  demoIcon: {
    fontSize: '1rem',
  },
  
  signupSection: {
    textAlign: 'center',
    marginTop: '1.5rem',
    paddingTop: '1.5rem',
    borderTop: '1px solid #e2e8f0',
  },
  
  signupText: {
    fontSize: 'clamp(0.75rem, 3vw, 0.875rem)',
    color: '#718096',
  },
  
  signupLink: {
    color: '#667eea',
    textDecoration: 'none',
    fontWeight: '600',
    marginLeft: '0.25rem',
  },
  
  features: {
    display: 'flex',
    justifyContent: 'space-around',
    marginTop: '1.5rem',
    paddingTop: '1.25rem',
    borderTop: '1px solid #e2e8f0',
    flexWrap: 'wrap',
    gap: '0.75rem',
  },
  
  featureItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  
  featureIcon: {
    color: '#48bb78',
    fontWeight: 'bold',
    fontSize: 'clamp(0.75rem, 3vw, 0.875rem)',
  },
  
  featureText: {
    fontSize: 'clamp(0.7rem, 2.5vw, 0.75rem)',
    color: '#718096',
  },
};

// Add CSS animations and responsive styles
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes rotateIn {
    from {
      opacity: 0;
      transform: rotate(-180deg) scale(0);
    }
    to {
      opacity: 1;
      transform: rotate(0) scale(1);
    }
  }
  
  @keyframes float {
    0%, 100% {
      transform: translate(0, 0) rotate(0deg);
    }
    33% {
      transform: translate(30px, -30px) rotate(120deg);
    }
    66% {
      transform: translate(-20px, 20px) rotate(240deg);
    }
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  input:focus, .password-input:focus {
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
  
  button:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
  }
  
  .demo-button:hover {
    background: #667eea;
    color: white;
  }
  
  .forgot-link:hover {
    color: #764ba2;
  }
  
  .signup-link:hover {
    text-decoration: underline;
  }
  
  /* Tablet Responsive */
  @media (max-width: 768px) {
    .features {
      flex-direction: column;
      align-items: center;
      gap: 0.75rem;
    }
    
    .options {
      flex-direction: column;
      align-items: flex-start;
    }
    
    .card {
      margin: 1rem;
      padding: 1.5rem;
    }
  }
  
  /* Mobile Responsive */
  @media (max-width: 480px) {
    .back-button {
      display: block;
    }
    
    .brand-section {
      margin-top: 1rem;
    }
    
    .features {
      gap: 0.5rem;
    }
    
    .feature-item {
      width: 100%;
      justify-content: center;
    }
    
    .divider {
      margin: 0.25rem 0;
    }
    
    button {
      min-height: 44px; /* Touch-friendly */
    }
    
    input, select, .password-input {
      min-height: 44px; /* Touch-friendly */
      font-size: 16px; /* Prevents zoom on iOS */
    }
    
    .checkbox-label, .forgot-link {
      min-height: 44px;
      display: inline-flex;
      align-items: center;
    }
  }
  
  /* Small Mobile */
  @media (max-width: 380px) {
    .card {
      padding: 1rem;
    }
    
    .title {
      font-size: 1.5rem;
    }
    
    .logo-wrapper {
      width: 50px;
      height: 50px;
    }
    
    .logo-icon {
      font-size: 1.75rem;
    }
  }
  
  /* Landscape Mode */
  @media (max-height: 600px) and (orientation: landscape) {
    .container {
      padding: 1rem;
    }
    
    .card {
      padding: 1rem;
    }
    
    .brand-section {
      margin-bottom: 1rem;
    }
    
    .logo-wrapper {
      width: 50px;
      height: 50px;
      margin-bottom: 0.5rem;
    }
  }
`;
document.head.appendChild(styleSheet);

export default Login;