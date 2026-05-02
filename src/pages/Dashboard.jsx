import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { tasks } from '../services/api';
import Layout from '../components/Layout';

function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ stats: {}, recentTasks: [] });
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await tasks.getDashboardStats();
      setStats(response.data);
    } catch (error) {
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'pending': { bg: '#FEF3C7', text: '#D97706', dot: '#F59E0B' },
      'in-progress': { bg: '#DBEAFE', text: '#2563EB', dot: '#3B82F6' },
      'completed': { bg: '#D1FAE5', text: '#059669', dot: '#10B981' }
    };
    return colors[status] || { bg: '#F3F4F6', text: '#6B7280', dot: '#9CA3AF' };
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const StatCard = ({ title, value, icon, color, trend }) => (
    <div style={{...styles.statCard, background: color.gradient }}>
      <div style={styles.statIcon}>{icon}</div>
      <div style={styles.statContent}>
        <h3 style={styles.statTitle}>{title}</h3>
        <p style={styles.statValue}>{value}</p>
        {trend && <span style={styles.statTrend}>{trend}</span>}
      </div>
    </div>
  );

  const TaskCard = ({ task }) => {
    const statusStyle = getStatusColor(task.status);
    const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status !== 'completed';
    
    return (
      <div style={styles.taskCard}>
        <div style={styles.taskHeader}>
          <div style={styles.taskTitleSection}>
            <h4 style={styles.taskTitle}>{task.title}</h4>
            <span style={{...styles.taskStatus, backgroundColor: statusStyle.bg, color: statusStyle.text}}>
              <span style={{...styles.statusDot, backgroundColor: statusStyle.dot}}></span>
              {task.status}
            </span>
          </div>
        </div>
        <p style={styles.taskDescription}>{task.description || 'No description'}</p>
        <div style={styles.taskFooter}>
          <div style={styles.taskMeta}>
            <span style={styles.taskProject}>📁 {task.project_name}</span>
            <span style={styles.taskDate}>
              {isOverdue ? '⚠️ Overdue' : '📅 Due: '}
              {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No due date'}
            </span>
          </div>
          {task.assigned_to_name && (
            <span style={styles.taskAssignee}>👤 {task.assigned_to_name}</span>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <Layout>
        <div style={styles.loadingContainer}>
          <div style={styles.loader}></div>
          <p style={styles.loadingText}>Loading your dashboard...</p>
        </div>
      </Layout>
    );
  }

  const completionRate = stats.stats.total > 0 
    ? Math.round((stats.stats.completed / stats.stats.total) * 100) 
    : 0;

  return (
    <Layout>
      <div style={styles.container}>
        {/* Welcome Section */}
        <div style={styles.welcomeSection}>
          <div style={styles.welcomeContent}>
            <h1 style={styles.greeting}>{getGreeting()}, {user.name}! 👋</h1>
            <p style={styles.welcomeText}>Here's what's happening with your tasks today</p>
          </div>
          <div style={styles.dateCard}>
            <span style={styles.dateIcon}>📅</span>
            <span style={styles.dateText}>
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div style={styles.statsGrid}>
          <StatCard 
            title="Total Tasks"
            value={stats.stats.total || 0}
            icon="📊"
            color={{ gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
          />
          <StatCard 
            title="Completed"
            value={stats.stats.completed || 0}
            icon="✅"
            color={{ gradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' }}
          />
          <StatCard 
            title="In Progress"
            value={stats.stats.inProgress || 0}
            icon="🔄"
            color={{ gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}
          />
          <StatCard 
            title="Pending"
            value={stats.stats.pending || 0}
            icon="⏳"
            color={{ gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' }}
          />
          <StatCard 
            title="Overdue"
            value={stats.stats.overdue || 0}
            icon="⚠️"
            color={{ gradient: 'linear-gradient(135deg, #f83600 0%, #f9d423 100%)' }}
            trend="Needs attention"
          />
        </div>

        {/* Progress Section */}
        <div style={styles.progressSection}>
          <div style={styles.progressHeader}>
            <h3 style={styles.sectionTitle}>Overall Progress</h3>
            <span style={styles.progressPercentage}>{completionRate}% Complete</span>
          </div>
          <div style={styles.progressBarContainer}>
            <div style={{...styles.progressBar, width: `${completionRate}%`}}>
              <div style={styles.progressGlow}></div>
            </div>
          </div>
          <div style={styles.progressStats}>
            <span>✅ {stats.stats.completed || 0} Completed</span>
            <span>🔄 {stats.stats.inProgress || 0} In Progress</span>
            <span>⏳ {stats.stats.pending || 0} Pending</span>
          </div>
        </div>

        {/* Recent Tasks Section */}
        <div style={styles.recentSection}>
          <div style={styles.sectionHeader}>
            <div>
              <h3 style={styles.sectionTitle}>Recent Tasks</h3>
              <p style={styles.sectionSubtitle}>Your latest activities and pending items</p>
            </div>
            <button onClick={() => navigate('/tasks')} style={styles.viewAllButton}>
              View All Tasks →
            </button>
          </div>
          
          <div style={styles.taskList}>
            {stats.recentTasks.length === 0 ? (
              <div style={styles.emptyState}>
                <span style={styles.emptyIcon}>📭</span>
                <p style={styles.emptyText}>No tasks yet</p>
                <p style={styles.emptySubtext}>Create your first task to get started</p>
              </div>
            ) : (
              stats.recentTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div style={styles.quickActions}>
          <h3 style={styles.sectionTitle}>Quick Actions</h3>
          <div style={styles.actionButtons}>
            <button onClick={() => navigate('/tasks')} style={styles.actionButton}>
              <span style={styles.actionIcon}>➕</span>
              <span style={styles.actionText}>Create Task</span>
            </button>
            <button onClick={() => navigate('/projects')} style={styles.actionButton}>
              <span style={styles.actionIcon}>📁</span>
              <span style={styles.actionText}>New Project</span>
            </button>
            <button onClick={() => navigate('/tasks')} style={styles.actionButton}>
              <span style={styles.actionIcon}>📋</span>
              <span style={styles.actionText}>View All Tasks</span>
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

const styles = {
  container: {
    padding: 'clamp(1rem, 5vw, 2rem)',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    minHeight: '100vh',
  },
  
  welcomeSection: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 'clamp(1.5rem, 4vw, 2rem)',
    padding: 'clamp(1rem, 4vw, 1.5rem)',
    background: 'white',
    borderRadius: 'clamp(12px, 4vw, 15px)',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  
  welcomeContent: {
    flex: 1,
    minWidth: '200px',
  },
  
  greeting: {
    fontSize: 'clamp(1.2rem, 5vw, 1.8rem)',
    color: '#2d3748',
    marginBottom: '0.5rem',
  },
  
  welcomeText: {
    color: '#718096',
    fontSize: 'clamp(0.875rem, 3vw, 1rem)',
  },
  
  dateCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '0.75rem 1.5rem',
    background: '#f7fafc',
    borderRadius: '10px',
  },
  
  dateIcon: {
    fontSize: 'clamp(1rem, 4vw, 1.2rem)',
  },
  
  dateText: {
    color: '#4a5568',
    fontWeight: '500',
    fontSize: 'clamp(0.75rem, 3vw, 0.875rem)',
  },
  
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: 'clamp(1rem, 3vw, 1.5rem)',
    marginBottom: 'clamp(1.5rem, 4vw, 2rem)',
  },
  
  statCard: {
    padding: 'clamp(1rem, 4vw, 1.5rem)',
    borderRadius: '15px',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    cursor: 'pointer',
    animation: 'fadeInUp 0.5s ease',
  },
  
  statIcon: {
    fontSize: 'clamp(1.5rem, 6vw, 2.5rem)',
  },
  
  statContent: {
    flex: 1,
  },
  
  statTitle: {
    fontSize: 'clamp(0.75rem, 3vw, 0.9rem)',
    opacity: 0.9,
    marginBottom: '0.5rem',
    fontWeight: '500',
  },
  
  statValue: {
    fontSize: 'clamp(1.2rem, 5vw, 2rem)',
    fontWeight: 'bold',
    marginBottom: '0.25rem',
  },
  
  statTrend: {
    fontSize: 'clamp(0.7rem, 2.5vw, 0.75rem)',
    opacity: 0.8,
  },
  
  progressSection: {
    background: 'white',
    padding: 'clamp(1rem, 4vw, 1.5rem)',
    borderRadius: '15px',
    marginBottom: 'clamp(1.5rem, 4vw, 2rem)',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  
  progressHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
    flexWrap: 'wrap',
    gap: '0.5rem',
  },
  
  progressPercentage: {
    fontSize: 'clamp(1rem, 4vw, 1.2rem)',
    fontWeight: 'bold',
    color: '#667eea',
  },
  
  progressBarContainer: {
    background: '#e2e8f0',
    borderRadius: '10px',
    overflow: 'hidden',
    height: '8px',
    marginBottom: '1rem',
  },
  
  progressBar: {
    background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
    height: '100%',
    borderRadius: '10px',
    position: 'relative',
    transition: 'width 1s ease',
  },
  
  progressGlow: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '20px',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3))',
    animation: 'shimmer 2s infinite',
  },
  
  progressStats: {
    display: 'flex',
    justifyContent: 'space-around',
    gap: '1rem',
    marginTop: '1rem',
    flexWrap: 'wrap',
  },
  
  recentSection: {
    background: 'white',
    padding: 'clamp(1rem, 4vw, 1.5rem)',
    borderRadius: '15px',
    marginBottom: 'clamp(1.5rem, 4vw, 2rem)',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  
  sectionTitle: {
    fontSize: 'clamp(1.1rem, 4vw, 1.3rem)',
    color: '#2d3748',
    marginBottom: '0.25rem',
  },
  
  sectionSubtitle: {
    fontSize: 'clamp(0.75rem, 3vw, 0.9rem)',
    color: '#718096',
  },
  
  viewAllButton: {
    padding: '0.5rem 1rem',
    background: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontSize: 'clamp(0.75rem, 3vw, 0.875rem)',
    whiteSpace: 'nowrap',
  },
  
  taskList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  
  taskCard: {
    padding: 'clamp(0.75rem, 3vw, 1rem)',
    border: '1px solid #e2e8f0',
    borderRadius: '10px',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
  },
  
  taskHeader: {
    marginBottom: '0.75rem',
  },
  
  taskTitleSection: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '0.5rem',
  },
  
  taskTitle: {
    fontSize: 'clamp(0.875rem, 3.5vw, 1rem)',
    fontWeight: '600',
    color: '#2d3748',
    margin: 0,
  },
  
  taskStatus: {
    padding: '0.25rem 0.75rem',
    borderRadius: '20px',
    fontSize: 'clamp(0.7rem, 2.5vw, 0.75rem)',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
    whiteSpace: 'nowrap',
  },
  
  statusDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
  },
  
  taskDescription: {
    fontSize: 'clamp(0.75rem, 3vw, 0.9rem)',
    color: '#718096',
    marginBottom: '0.75rem',
    lineHeight: '1.5',
  },
  
  taskFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: 'clamp(0.7rem, 2.5vw, 0.75rem)',
    flexWrap: 'wrap',
    gap: '0.5rem',
  },
  
  taskMeta: {
    display: 'flex',
    gap: '1rem',
    color: '#a0aec0',
    flexWrap: 'wrap',
  },
  
  taskProject: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
  },
  
  taskDate: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
  },
  
  taskAssignee: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
    color: '#a0aec0',
  },
  
  emptyState: {
    textAlign: 'center',
    padding: 'clamp(2rem, 8vw, 3rem)',
  },
  
  emptyIcon: {
    fontSize: 'clamp(2rem, 8vw, 3rem)',
    marginBottom: '1rem',
  },
  
  emptyText: {
    fontSize: 'clamp(0.9rem, 4vw, 1.1rem)',
    color: '#4a5568',
    marginBottom: '0.5rem',
  },
  
  emptySubtext: {
    fontSize: 'clamp(0.75rem, 3vw, 0.9rem)',
    color: '#a0aec0',
  },
  
  quickActions: {
    background: 'white',
    padding: 'clamp(1rem, 4vw, 1.5rem)',
    borderRadius: '15px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  
  actionButtons: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: '1rem',
    marginTop: '1rem',
  },
  
  actionButton: {
    padding: 'clamp(0.625rem, 2.5vw, 0.75rem)',
    background: '#f7fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '10px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    transition: 'all 0.3s ease',
    fontWeight: '500',
    fontSize: 'clamp(0.75rem, 3vw, 0.875rem)',
  },
  
  actionIcon: {
    fontSize: 'clamp(0.9rem, 3.5vw, 1.1rem)',
  },
  
  actionText: {
    display: 'inline',
  },
  
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '400px',
    padding: '2rem',
  },
  
  loader: {
    border: '3px solid #f3f3f3',
    borderTop: '3px solid #667eea',
    borderRadius: '50%',
    width: '50px',
    height: '50px',
    animation: 'spin 1s linear infinite',
  },
  
  loadingText: {
    marginTop: '1rem',
    color: '#718096',
    fontSize: 'clamp(0.875rem, 3vw, 1rem)',
  },
};

// Add CSS animations and responsive styles
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes shimmer {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(200%);
    }
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  button:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  }
  
  .stat-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 15px rgba(0,0,0,0.2);
  }
  
  .task-card:hover {
    transform: translateX(5px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    border-color: #667eea;
  }
  
  /* Tablet Responsive */
  @media (max-width: 768px) {
    .stats-grid {
      grid-template-columns: repeat(2, 1fr);
    }
    
    .progress-stats {
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
    }
    
    .action-buttons {
      grid-template-columns: 1fr;
    }
    
    .task-meta {
      flex-direction: column;
      gap: 0.5rem;
    }
  }
  
  /* Mobile Responsive */
  @media (max-width: 480px) {
    .stats-grid {
      grid-template-columns: 1fr;
    }
    
    .welcome-section {
      flex-direction: column;
      align-items: flex-start;
    }
    
    .date-card {
      width: 100%;
      justify-content: center;
    }
    
    .section-header {
      flex-direction: column;
      align-items: flex-start;
    }
    
    .view-all-button {
      width: 100%;
      text-align: center;
    }
    
    .task-title-section {
      flex-direction: column;
      align-items: flex-start;
    }
    
    .task-footer {
      flex-direction: column;
      align-items: flex-start;
    }
    
    .task-meta {
      flex-direction: column;
      gap: 0.5rem;
    }
    
    button {
      min-height: 44px; /* Touch-friendly */
    }
    
    .action-button {
      justify-content: center;
    }
  }
  
  /* Small Mobile */
  @media (max-width: 380px) {
    .container {
      padding: 0.75rem;
    }
    
    .stat-card {
      padding: 1rem;
    }
    
    .stat-icon {
      font-size: 1.5rem;
    }
    
    .stat-value {
      font-size: 1.2rem;
    }
  }
  
  /* Landscape Mode */
  @media (max-height: 600px) and (orientation: landscape) {
    .stats-grid {
      grid-template-columns: repeat(3, 1fr);
    }
    
    .welcome-section {
      padding: 1rem;
    }
    
    .greeting {
      font-size: 1.2rem;
    }
  }
`;
document.head.appendChild(styleSheet);

export default Dashboard;