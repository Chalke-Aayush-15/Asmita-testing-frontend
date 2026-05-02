import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

function Layout({ children }) {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  return (
    <div style={styles.container}>
      <nav style={styles.navbar}>
        <div style={styles.navContent}>
          <div style={styles.logoSection}>
            <div style={styles.logoIcon}>📋</div>
            <h2 style={styles.logo}>TaskFlow</h2>
          </div>
          
          {/* Desktop Navigation */}
          <div style={styles.desktopNav}>
            <div style={styles.navLinks}>
              <button onClick={() => handleNavigation('/dashboard')} style={styles.navButton}>
                <span style={styles.navIcon}>📊</span>
                <span>Dashboard</span>
              </button>
              <button onClick={() => handleNavigation('/projects')} style={styles.navButton}>
                <span style={styles.navIcon}>📁</span>
                <span>Projects</span>
              </button>
              <button onClick={() => handleNavigation('/tasks')} style={styles.navButton}>
                <span style={styles.navIcon}>✅</span>
                <span>Tasks</span>
              </button>
            </div>
            <div style={styles.userSection}>
              <div style={styles.userAvatar}>
                {user.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <span style={styles.userName}>{user.name}</span>
              <button onClick={handleLogout} style={styles.logoutButton}>
                <span>🚪</span>
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button 
            style={styles.mobileMenuButton}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <span style={styles.menuIcon}>{isMobileMenuOpen ? '✕' : '☰'}</span>
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div style={styles.mobileNav}>
            <div style={styles.mobileNavLinks}>
              <button onClick={() => handleNavigation('/dashboard')} style={styles.mobileNavButton}>
                <span style={styles.navIcon}>📊</span>
                <span>Dashboard</span>
              </button>
              <button onClick={() => handleNavigation('/projects')} style={styles.mobileNavButton}>
                <span style={styles.navIcon}>📁</span>
                <span>Projects</span>
              </button>
              <button onClick={() => handleNavigation('/tasks')} style={styles.mobileNavButton}>
                <span style={styles.navIcon}>✅</span>
                <span>Tasks</span>
              </button>
              <div style={styles.mobileUserSection}>
                <div style={styles.mobileUserInfo}>
                  <div style={styles.userAvatarMobile}>
                    {user.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div>
                    <div style={styles.mobileUserName}>{user.name}</div>
                    <div style={styles.mobileUserEmail}>{user.email}</div>
                  </div>
                </div>
                <button onClick={handleLogout} style={styles.mobileLogoutButton}>
                  <span>🚪</span>
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>
      <main style={styles.main}>{children}</main>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f0f2f5',
  },
  
  navbar: {
    backgroundColor: '#2c3e50',
    color: 'white',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  
  navContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem clamp(1rem, 5vw, 2rem)',
    maxWidth: '1400px',
    margin: '0 auto',
  },
  
  logoSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  
  logoIcon: {
    fontSize: 'clamp(1.2rem, 5vw, 1.5rem)',
  },
  
  logo: {
    margin: 0,
    fontSize: 'clamp(1.2rem, 5vw, 1.5rem)',
    fontWeight: 'bold',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  
  desktopNav: {
    display: 'flex',
    alignItems: 'center',
    gap: '2rem',
  },
  
  navLinks: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center',
  },
  
  navButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    backgroundColor: 'transparent',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    cursor: 'pointer',
    borderRadius: '8px',
    transition: 'all 0.3s ease',
    fontSize: '0.875rem',
    fontWeight: '500',
  },
  
  navIcon: {
    fontSize: '1rem',
  },
  
  userSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    paddingLeft: '1rem',
    borderLeft: '1px solid rgba(255,255,255,0.2)',
  },
  
  userAvatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: '0.875rem',
  },
  
  userName: {
    fontSize: '0.875rem',
    fontWeight: '500',
  },
  
  logoutButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    cursor: 'pointer',
    borderRadius: '8px',
    transition: 'all 0.3s ease',
    fontSize: '0.875rem',
    fontWeight: '500',
  },
  
  mobileMenuButton: {
    display: 'none',
    backgroundColor: 'transparent',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    padding: '0.5rem',
    borderRadius: '8px',
    transition: 'all 0.3s ease',
  },
  
  menuIcon: {
    fontSize: '1.5rem',
  },
  
  mobileNav: {
    position: 'fixed',
    top: '60px',
    left: 0,
    right: 0,
    backgroundColor: '#2c3e50',
    zIndex: 999,
    animation: 'slideDown 0.3s ease',
    boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
  },
  
  mobileNavLinks: {
    display: 'flex',
    flexDirection: 'column',
    padding: '1rem',
    gap: '0.5rem',
  },
  
  mobileNavButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    backgroundColor: 'transparent',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1rem',
    cursor: 'pointer',
    borderRadius: '8px',
    transition: 'all 0.3s ease',
    fontSize: '1rem',
    fontWeight: '500',
    width: '100%',
    textAlign: 'left',
  },
  
  mobileUserSection: {
    marginTop: '1rem',
    paddingTop: '1rem',
    borderTop: '1px solid rgba(255,255,255,0.2)',
  },
  
  mobileUserInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.75rem',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: '8px',
    marginBottom: '1rem',
  },
  
  userAvatarMobile: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: '1rem',
  },
  
  mobileUserName: {
    fontSize: '0.875rem',
    fontWeight: '600',
    color: 'white',
  },
  
  mobileUserEmail: {
    fontSize: '0.75rem',
    color: 'rgba(255,255,255,0.7)',
  },
  
  mobileLogoutButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    padding: '0.75rem',
    cursor: 'pointer',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '500',
    width: '100%',
  },
  
  main: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: 'clamp(1rem, 5vw, 2rem)',
  },
};

// Add CSS animations and responsive styles
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  button:hover {
    transform: translateY(-1px);
    opacity: 0.9;
  }
  
  .nav-button:hover {
    background-color: rgba(255,255,255,0.1);
  }
  
  .logout-button:hover {
    background-color: #c0392b;
    transform: translateY(-1px);
  }
  
  .mobile-nav-button:hover {
    background-color: rgba(255,255,255,0.1);
    transform: translateX(5px);
  }
  
  /* Tablet Responsive */
  @media (max-width: 768px) {
    .desktop-nav {
      display: none;
    }
    
    .mobile-menu-button {
      display: block;
    }
    
    .logo-section {
      flex: 1;
    }
    
    .user-name, .nav-button span:last-child {
      display: none;
    }
    
    .nav-button {
      padding: 0.5rem;
    }
    
    .user-section {
      gap: 0.5rem;
      padding-left: 0.5rem;
    }
  }
  
  /* Small Mobile */
  @media (max-width: 480px) {
    .nav-content {
      padding: 0.75rem 1rem;
    }
    
    .logo {
      font-size: 1.1rem;
    }
    
    .logo-icon {
      font-size: 1.2rem;
    }
    
    .user-avatar {
      width: 28px;
      height: 28px;
      font-size: 0.75rem;
    }
    
    .logout-button span:last-child {
      display: none;
    }
    
    .logout-button {
      padding: 0.5rem;
    }
    
    .mobile-nav-button {
      padding: 0.75rem;
      font-size: 0.9rem;
    }
    
    .mobile-user-info {
      padding: 0.5rem;
    }
    
    .user-avatar-mobile {
      width: 35px;
      height: 35px;
      font-size: 0.875rem;
    }
  }
  
  /* Desktop Hover Effects */
  @media (min-width: 769px) {
    .nav-button:hover {
      background-color: rgba(255,255,255,0.1);
      transform: translateY(-2px);
    }
    
    .logout-button:hover {
      background-color: #c0392b;
      transform: translateY(-2px);
    }
  }
`;
document.head.appendChild(styleSheet);

export default Layout;