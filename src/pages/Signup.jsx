import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { auth } from '../services/api';

function Signup() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'member'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (formData.name.length < 2) {
      toast.error('Name must be at least 2 characters');
      return;
    }
    
    if (!formData.email.includes('@') || !formData.email.includes('.')) {
      toast.error('Please enter a valid email address');
      return;
    }
    
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await auth.signup({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role
      });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      toast.success('Account created successfully! 🎉');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    toast.success('Google signup coming soon!');
  };

  return (
    <div style={styles.container}>
      <div style={styles.background}>
        <div style={styles.bgCircle1}></div>
        <div style={styles.bgCircle2}></div>
        <div style={styles.bgCircle3}></div>
        <div style={styles.bgCircle4}></div>
      </div>

      <div style={styles.card}>
        <button onClick={() => navigate('/login')} style={styles.backButton}>
          ← Back to Login
        </button>

        <div style={styles.brandSection}>
          <div style={styles.logoWrapper}>
            <span style={styles.logoIcon}>🚀</span>
          </div>
          <h2 style={styles.title}>Create Account</h2>
          <p style={styles.tagline}>Join TaskFlow and boost your productivity</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>
              <span style={styles.labelIcon}>👤</span>
              Full Name
            </label>
            <input
              type="text"
              placeholder="Asmita Sharad Bhadane"
              style={styles.input}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>
              <span style={styles.labelIcon}>📧</span>
              Email Address
            </label>
            <input
              type="email"
              placeholder="asmitabhadane8@gmail.com"
              style={styles.input}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
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
                placeholder="Create a password (min. 6 characters)"
                style={styles.passwordInput}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
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

          <div style={styles.inputGroup}>
            <label style={styles.label}>
              <span style={styles.labelIcon}>✓</span>
              Confirm Password
            </label>
            <div style={styles.passwordWrapper}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                style={styles.passwordInput}
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
              />
              <button
                type="button"
                style={styles.passwordToggle}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? '👁️' : '🔒'}
              </button>
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>
              <span style={styles.labelIcon}>🎭</span>
              Role
            </label>
            <div style={styles.roleContainer}>
              <label style={styles.radioLabel}>
                <input
                  type="radio"
                  value="member"
                  checked={formData.role === 'member'}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  style={styles.radio}
                />
                <div style={styles.radioContent}>
                  <span style={styles.radioIcon}>👥</span>
                  <div>
                    <div style={styles.radioTitle}>Team Member</div>
                    <div style={styles.radioDesc}>Can view and update tasks</div>
                  </div>
                </div>
              </label>
              <label style={styles.radioLabel}>
                <input
                  type="radio"
                  value="admin"
                  checked={formData.role === 'admin'}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  style={styles.radio}
                />
                <div style={styles.radioContent}>
                  <span style={styles.radioIcon}>👑</span>
                  <div>
                    <div style={styles.radioTitle}>Admin</div>
                    <div style={styles.radioDesc}>Full control over projects</div>
                  </div>
                </div>
              </label>
            </div>
          </div>

          <button 
            type="submit" 
            style={{...styles.button, ...(isLoading && styles.buttonLoading)}}
            disabled={isLoading}
          >
            {isLoading ? (
              <span style={styles.loader}></span>
            ) : (
              'Create Account'
            )}
          </button>

          <div style={styles.divider}>
            <span style={styles.dividerLine}></span>
            <span style={styles.dividerText}>or</span>
            <span style={styles.dividerLine}></span>
          </div>

          <button 
            type="button" 
            style={styles.googleButton}
            onClick={handleGoogleSignup}
          >
            <span style={styles.googleIcon}>G</span>
            Sign up with Google
          </button>
        </form>

        <div style={styles.loginSection}>
          <p style={styles.loginText}>
            Already have an account?{' '}
            <Link to="/login" style={styles.loginLink}>
              Sign in
            </Link>
          </p>
        </div>

        <div style={styles.features}>
          <div style={styles.featureItem}>
            <span style={styles.featureIcon}>✓</span>
            <span style={styles.featureText}>Free forever</span>
          </div>
          <div style={styles.featureItem}>
            <span style={styles.featureIcon}>✓</span>
            <span style={styles.featureText}>No credit card</span>
          </div>
          <div style={styles.featureItem}>
            <span style={styles.featureIcon}>✓</span>
            <span style={styles.featureText}>Cancel anytime</span>
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
    width: '500px',
    height: '500px',
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.1)',
    top: '-250px',
    right: '-250px',
    animation: 'float 20s infinite',
  },
  
  bgCircle2: {
    position: 'absolute',
    width: '300px',
    height: '300px',
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.05)',
    bottom: '-150px',
    left: '-150px',
    animation: 'float 15s infinite reverse',
  },
  
  bgCircle3: {
    position: 'absolute',
    width: '200px',
    height: '200px',
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.08)',
    bottom: '100px',
    right: '100px',
    animation: 'float 12s infinite',
  },
  
  bgCircle4: {
    position: 'absolute',
    width: '150px',
    height: '150px',
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.06)',
    top: '50%',
    left: '10%',
    animation: 'float 18s infinite',
  },
  
  card: {
    position: 'relative',
    width: '100%',
    maxWidth: '500px',
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
    fontSize: '0.875rem',
    color: '#667eea',
    cursor: 'pointer',
    padding: '0.5rem',
    transition: 'all 0.3s ease',
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
  
  roleContainer: {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap',
  },
  
  radioLabel: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.75rem',
    border: '2px solid #e2e8f0',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  
  radioContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    flex: 1,
  },
  
  radioIcon: {
    fontSize: '1.25rem',
  },
  
  radioTitle: {
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#2d3748',
  },
  
  radioDesc: {
    fontSize: '0.75rem',
    color: '#718096',
  },
  
  radio: {
    margin: 0,
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
    fontSize: '0.75rem',
    color: '#a0aec0',
  },
  
  googleButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.75rem',
    padding: 'clamp(0.625rem, 2vw, 0.75rem)',
    background: 'white',
    color: '#4a5568',
    border: '2px solid #e2e8f0',
    borderRadius: '12px',
    fontSize: 'clamp(0.75rem, 3vw, 0.875rem)',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  
  googleIcon: {
    width: '20px',
    height: '20px',
    background: '#4285f4',
    color: 'white',
    borderRadius: '50%',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.75rem',
  },
  
  loginSection: {
    textAlign: 'center',
    marginTop: '1.5rem',
    paddingTop: '1.5rem',
    borderTop: '1px solid #e2e8f0',
  },
  
  loginText: {
    fontSize: 'clamp(0.75rem, 3vw, 0.875rem)',
    color: '#718096',
  },
  
  loginLink: {
    color: '#667eea',
    textDecoration: 'none',
    fontWeight: '600',
    marginLeft: '0.25rem',
  },
  
  features: {
    display: 'flex',
    justifyContent: 'space-around',
    marginTop: '1.5rem',
    paddingTop: '1rem',
    flexWrap: 'wrap',
    gap: '0.75rem',
  },
  
  featureItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: 'clamp(0.7rem, 2.5vw, 0.75rem)',
    color: '#718096',
  },
  
  featureIcon: {
    color: '#48bb78',
    fontWeight: 'bold',
  },
  
  featureText: {
    fontSize: 'clamp(0.7rem, 2.5vw, 0.75rem)',
  },
};

// Add animations
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
  
  input:focus, .password-input:focus, select:focus {
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
  
  button:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
  }
  
  .google-button:hover {
    background: #f7fafc;
    border-color: #cbd5e0;
  }
  
  .radio-label:hover {
    background: #f7fafc;
    border-color: #667eea;
  }
  
  .login-link:hover {
    text-decoration: underline;
  }
  
  /* Responsive Design */
  @media (max-width: 768px) {
    .role-container {
      flex-direction: column;
    }
    
    .features {
      flex-direction: column;
      align-items: center;
    }
    
    .back-button {
      position: relative;
      top: 0;
      left: 0;
      margin-bottom: 1rem;
      display: inline-block;
    }
    
    .card {
      padding: 1.5rem;
    }
  }
  
  @media (max-width: 480px) {
    .radio-label {
      width: 100%;
    }
    
    .radio-content {
      flex: 1;
    }
    
    .button-group {
      flex-direction: column;
    }
    
    .features {
      gap: 0.5rem;
    }
  }
`;
document.head.appendChild(styleSheet);

export default Signup;