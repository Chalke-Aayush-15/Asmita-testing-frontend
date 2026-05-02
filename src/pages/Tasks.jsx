import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { tasks as taskApi, projects as projectApi } from '../services/api';
import Layout from '../components/Layout';

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showTaskDetails, setShowTaskDetails] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedProject, setSelectedProject] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    projectId: '',
    assignedTo: '',
    dueDate: ''
  });
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchTasks();
    fetchProjects();
    if (user.role === 'admin') {
      fetchUsers();
    }
  }, [selectedProject, filterStatus]);

  const fetchTasks = async () => {
    try {
      const params = selectedProject ? { projectId: selectedProject } : {};
      const response = await taskApi.getAll(params);
      let filteredTasks = response.data;
      
      // Apply status filter
      if (filterStatus !== 'all') {
        filteredTasks = filteredTasks.filter(task => task.status === filterStatus);
      }
      
      setTasks(filteredTasks);
    } catch (error) {
      toast.error('Failed to load tasks');
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await projectApi.getAll();
      setProjects(response.data);
    } catch (error) {
      toast.error('Failed to load projects');
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await projectApi.getAvailableUsers();
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to load users');
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await taskApi.create(formData);
      toast.success('Task created successfully');
      setShowModal(false);
      setFormData({ title: '', description: '', projectId: '', assignedTo: '', dueDate: '' });
      fetchTasks();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create task');
    }
  };

  const handleStatusUpdate = async (taskId, currentStatus) => {
    const statusFlow = {
      'pending': 'in-progress',
      'in-progress': 'completed',
      'completed': 'completed'
    };
    const newStatus = statusFlow[currentStatus];
    if (newStatus === currentStatus) return;
    
    try {
      await taskApi.updateStatus(taskId, newStatus);
      toast.success('Task status updated');
      fetchTasks();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'pending': { bg: '#FEF3C7', text: '#D97706', dot: '#F59E0B', icon: '⏳' },
      'in-progress': { bg: '#DBEAFE', text: '#2563EB', dot: '#3B82F6', icon: '🔄' },
      'completed': { bg: '#D1FAE5', text: '#059669', dot: '#10B981', icon: '✅' }
    };
    return colors[status] || { bg: '#F3F4F6', text: '#6B7280', dot: '#9CA3AF', icon: '📋' };
  };

  const getPriorityColor = (dueDate) => {
    if (!dueDate) return { color: '#9CA3AF', label: 'No deadline' };
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { color: '#EF4444', label: 'Overdue', icon: '⚠️' };
    if (diffDays <= 2) return { color: '#F59E0B', label: 'Urgent', icon: '🔴' };
    if (diffDays <= 5) return { color: '#3B82F6', label: 'Soon', icon: '🟡' };
    return { color: '#10B981', label: 'Normal', icon: '🟢' };
  };

  const stats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
  };

  return (
    <Layout>
      <div style={styles.container}>
        {/* Header Section */}
        <div style={styles.header}>
          <div style={styles.headerLeft}>
            <h1 style={styles.title}>Tasks</h1>
            <p style={styles.subtitle}>Manage and track your tasks</p>
          </div>
          {user.role === 'admin' && (
            <button onClick={() => setShowModal(true)} style={styles.createButton}>
              <span style={styles.buttonIcon}>+</span>
              <span style={styles.buttonText}>New Task</span>
            </button>
          )}
        </div>

        {/* Stats Cards */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>📊</div>
            <div style={styles.statInfo}>
              <span style={styles.statValue}>{stats.total}</span>
              <span style={styles.statLabel}>Total Tasks</span>
            </div>
          </div>
          <div style={{...styles.statCard, background: 'linear-gradient(135deg, #FEF3C7, #FFFBEB)'}}>
            <div style={styles.statIcon}>⏳</div>
            <div style={styles.statInfo}>
              <span style={styles.statValue}>{stats.pending}</span>
              <span style={styles.statLabel}>Pending</span>
            </div>
          </div>
          <div style={{...styles.statCard, background: 'linear-gradient(135deg, #DBEAFE, #EFF6FF)'}}>
            <div style={styles.statIcon}>🔄</div>
            <div style={styles.statInfo}>
              <span style={styles.statValue}>{stats.inProgress}</span>
              <span style={styles.statLabel}>In Progress</span>
            </div>
          </div>
          <div style={{...styles.statCard, background: 'linear-gradient(135deg, #D1FAE5, #ECFDF5)'}}>
            <div style={styles.statIcon}>✅</div>
            <div style={styles.statInfo}>
              <span style={styles.statValue}>{stats.completed}</span>
              <span style={styles.statLabel}>Completed</span>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div style={styles.filtersSection}>
          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>Project:</label>
            <select 
              value={selectedProject} 
              onChange={(e) => setSelectedProject(e.target.value)}
              style={styles.filterSelect}
            >
              <option value="">All Projects</option>
              {projects.map(project => (
                <option key={project.id} value={project.id}>{project.name}</option>
              ))}
            </select>
          </div>

          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>Status:</label>
            <div style={styles.statusFilters}>
              <button 
                onClick={() => setFilterStatus('all')}
                style={{...styles.statusFilterBtn, ...(filterStatus === 'all' && styles.activeFilter)}}
              >
                All
              </button>
              <button 
                onClick={() => setFilterStatus('pending')}
                style={{...styles.statusFilterBtn, ...(filterStatus === 'pending' && styles.activeFilter)}}
              >
                Pending
              </button>
              <button 
                onClick={() => setFilterStatus('in-progress')}
                style={{...styles.statusFilterBtn, ...(filterStatus === 'in-progress' && styles.activeFilter)}}
              >
                In Progress
              </button>
              <button 
                onClick={() => setFilterStatus('completed')}
                style={{...styles.statusFilterBtn, ...(filterStatus === 'completed' && styles.activeFilter)}}
              >
                Completed
              </button>
            </div>
          </div>
        </div>

        {/* Tasks List */}
        <div style={styles.taskList}>
          {tasks.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>📭</div>
              <h3 style={styles.emptyTitle}>No Tasks Found</h3>
              <p style={styles.emptyText}>Create a new task to get started</p>
              {user.role === 'admin' && (
                <button onClick={() => setShowModal(true)} style={styles.emptyButton}>
                  Create Task
                </button>
              )}
            </div>
          ) : (
            tasks.map((task) => {
              const statusStyle = getStatusColor(task.status);
              const priority = getPriorityColor(task.dueDate);
              const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status !== 'completed';
              
              return (
                <div 
                  key={task.id} 
                  style={styles.taskCard}
                  onClick={() => {
                    setSelectedTask(task);
                    setShowTaskDetails(true);
                  }}
                >
                  <div style={styles.taskHeader}>
                    <div style={styles.taskTitleSection}>
                      <span style={styles.taskIcon}>{statusStyle.icon}</span>
                      <h3 style={styles.taskTitle}>{task.title}</h3>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStatusUpdate(task.id, task.status);
                      }}
                      style={{...styles.statusButton, backgroundColor: statusStyle.bg, color: statusStyle.text}}
                    >
                      <span style={{...styles.statusDot, backgroundColor: statusStyle.dot}}></span>
                      {task.status}
                    </button>
                  </div>
                  
                  <p style={styles.taskDescription}>
                    {task.description?.length > 100 
                      ? `${task.description.substring(0, 100)}...` 
                      : task.description || 'No description'}
                  </p>
                  
                  <div style={styles.taskMeta}>
                    <div style={styles.metaItem}>
                      <span style={styles.metaIcon}>📁</span>
                      <span style={styles.metaText}>{task.project_name}</span>
                    </div>
                    <div style={styles.metaItem}>
                      <span style={styles.metaIcon}>👤</span>
                      <span style={styles.metaText}>{task.assigned_to_name || 'Unassigned'}</span>
                    </div>
                    <div style={{...styles.metaItem, color: priority.color}}>
                      <span style={styles.metaIcon}>{priority.icon}</span>
                      <span style={styles.metaText}>
                        {isOverdue ? 'Overdue' : (task.due_date ? `Due: ${new Date(task.due_date).toLocaleDateString()}` : 'No deadline')}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Create Task Modal */}
        {showModal && (
          <div style={styles.modal} onClick={() => setShowModal(false)}>
            <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <div style={styles.modalHeader}>
                <h2 style={styles.modalTitle}>Create New Task</h2>
                <button onClick={() => setShowModal(false)} style={styles.closeButton}>✕</button>
              </div>
              <form onSubmit={handleCreateTask} style={styles.form}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Task Title *</label>
                  <input
                    type="text"
                    placeholder="Enter task title"
                    style={styles.input}
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                
                <div style={styles.formGroup}>
                  <label style={styles.label}>Description</label>
                  <textarea
                    placeholder="Enter task description"
                    style={styles.textarea}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows="3"
                  />
                </div>
                
                <div style={styles.formGroup}>
                  <label style={styles.label}>Project *</label>
                  <select
                    style={styles.select}
                    value={formData.projectId}
                    onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                    required
                  >
                    <option value="">Select Project</option>
                    {projects.map(project => (
                      <option key={project.id} value={project.id}>{project.name}</option>
                    ))}
                  </select>
                </div>
                
                <div style={styles.formRow}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Assign To</label>
                    <select
                      style={styles.select}
                      value={formData.assignedTo}
                      onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                    >
                      <option value="">Select Member</option>
                      {users.map(user => (
                        <option key={user.id} value={user.id}>{user.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Due Date</label>
                    <input
                      type="date"
                      style={styles.input}
                      value={formData.dueDate}
                      onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    />
                  </div>
                </div>
                
                <div style={styles.buttonGroup}>
                  <button type="submit" style={styles.submitButton}>Create Task</button>
                  <button type="button" onClick={() => setShowModal(false)} style={styles.cancelButton}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Task Details Modal */}
        {showTaskDetails && selectedTask && (
          <div style={styles.modal} onClick={() => setShowTaskDetails(false)}>
            <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <div style={styles.modalHeader}>
                <h2 style={styles.modalTitle}>Task Details</h2>
                <button onClick={() => setShowTaskDetails(false)} style={styles.closeButton}>✕</button>
              </div>
              <div style={styles.detailsContent}>
                <h3 style={styles.detailsTitle}>{selectedTask.title}</h3>
                <p style={styles.detailsDescription}>{selectedTask.description || 'No description provided'}</p>
                <div style={styles.detailsInfo}>
                  <div style={styles.detailItem}>
                    <strong>Project:</strong> {selectedTask.project_name}
                  </div>
                  <div style={styles.detailItem}>
                    <strong>Assigned to:</strong> {selectedTask.assigned_to_name || 'Unassigned'}
                  </div>
                  <div style={styles.detailItem}>
                    <strong>Due date:</strong> {selectedTask.due_date || 'No due date'}
                  </div>
                  <div style={styles.detailItem}>
                    <strong>Status:</strong> {selectedTask.status}
                  </div>
                  <div style={styles.detailItem}>
                    <strong>Created:</strong> {new Date(selectedTask.created_at).toLocaleDateString()}
                  </div>
                </div>
                {user.role === 'admin' && selectedTask.status !== 'completed' && (
                  <button
                    onClick={() => {
                      handleStatusUpdate(selectedTask.id, selectedTask.status);
                      setShowTaskDetails(false);
                    }}
                    style={styles.updateButton}
                  >
                    Update Status
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

const styles = {
  container: {
    padding: 'clamp(1rem, 5vw, 2rem)',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 'clamp(1.5rem, 4vw, 2rem)',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  
  headerLeft: {
    flex: 1,
  },
  
  title: {
    fontSize: 'clamp(1.5rem, 5vw, 2rem)',
    fontWeight: 'bold',
    color: 'white',
    marginBottom: '0.5rem',
  },
  
  subtitle: {
    fontSize: 'clamp(0.875rem, 3vw, 1rem)',
    color: 'rgba(255,255,255,0.9)',
  },
  
  createButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1.5rem',
    background: 'white',
    color: '#667eea',
    border: 'none',
    borderRadius: '12px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  },
  
  buttonIcon: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
  },
  
  buttonText: {
    display: 'inline',
  },
  
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
    marginBottom: '2rem',
  },
  
  statCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1rem',
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  
  statIcon: {
    fontSize: '2rem',
  },
  
  statInfo: {
    display: 'flex',
    flexDirection: 'column',
  },
  
  statValue: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#2d3748',
  },
  
  statLabel: {
    fontSize: '0.75rem',
    color: '#718096',
  },
  
  filtersSection: {
    background: 'white',
    padding: '1rem',
    borderRadius: '12px',
    marginBottom: '2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  
  filterGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    flexWrap: 'wrap',
  },
  
  filterLabel: {
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#4a5568',
  },
  
  filterSelect: {
    padding: '0.5rem',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '0.875rem',
  },
  
  statusFilters: {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap',
  },
  
  statusFilterBtn: {
    padding: '0.5rem 1rem',
    background: '#f3f4f6',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.875rem',
    transition: 'all 0.3s ease',
  },
  
  activeFilter: {
    background: '#667eea',
    color: 'white',
  },
  
  taskList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  
  taskCard: {
    background: 'white',
    borderRadius: '12px',
    padding: '1.5rem',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
  },
  
  taskHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
    flexWrap: 'wrap',
    gap: '0.5rem',
  },
  
  taskTitleSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    flex: 1,
  },
  
  taskIcon: {
    fontSize: '1.2rem',
  },
  
  taskTitle: {
    fontSize: 'clamp(1rem, 4vw, 1.1rem)',
    fontWeight: '600',
    color: '#2d3748',
    margin: 0,
  },
  
  statusButton: {
    padding: '0.25rem 0.75rem',
    border: 'none',
    borderRadius: '20px',
    fontSize: '0.75rem',
    fontWeight: '500',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
  },
  
  statusDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
  },
  
  taskDescription: {
    fontSize: '0.875rem',
    color: '#718096',
    marginBottom: '1rem',
    lineHeight: '1.5',
  },
  
  taskMeta: {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap',
    fontSize: '0.75rem',
  },
  
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
    color: '#a0aec0',
  },
  
  metaIcon: {
    fontSize: '0.75rem',
  },
  
  metaText: {
    fontSize: '0.75rem',
  },
  
  emptyState: {
    textAlign: 'center',
    padding: '3rem',
    background: 'white',
    borderRadius: '12px',
  },
  
  emptyIcon: {
    fontSize: '3rem',
    marginBottom: '1rem',
  },
  
  emptyTitle: {
    fontSize: '1.25rem',
    color: '#2d3748',
    marginBottom: '0.5rem',
  },
  
  emptyText: {
    fontSize: '0.875rem',
    color: '#718096',
    marginBottom: '1rem',
  },
  
  emptyButton: {
    padding: '0.5rem 1rem',
    background: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  
  modal: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '1rem',
  },
  
  modalContent: {
    background: 'white',
    borderRadius: '20px',
    width: '100%',
    maxWidth: '600px',
    maxHeight: '90vh',
    overflow: 'auto',
    animation: 'slideUp 0.3s ease',
  },
  
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.5rem',
    borderBottom: '1px solid #e2e8f0',
  },
  
  modalTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#2d3748',
  },
  
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '1.5rem',
    cursor: 'pointer',
    color: '#a0aec0',
  },
  
  form: {
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    flex: 1,
  },
  
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
  },
  
  label: {
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#4a5568',
  },
  
  input: {
    padding: '0.75rem',
    border: '2px solid #e2e8f0',
    borderRadius: '10px',
    fontSize: '0.875rem',
    transition: 'all 0.3s ease',
    outline: 'none',
  },
  
  textarea: {
    padding: '0.75rem',
    border: '2px solid #e2e8f0',
    borderRadius: '10px',
    fontSize: '0.875rem',
    fontFamily: 'inherit',
    resize: 'vertical',
  },
  
  select: {
    padding: '0.75rem',
    border: '2px solid #e2e8f0',
    borderRadius: '10px',
    fontSize: '0.875rem',
    background: 'white',
  },
  
  buttonGroup: {
    display: 'flex',
    gap: '1rem',
    marginTop: '1rem',
  },
  
  submitButton: {
    flex: 1,
    padding: '0.75rem',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '0.875rem',
    fontWeight: '600',
    cursor: 'pointer',
  },
  
  cancelButton: {
    flex: 1,
    padding: '0.75rem',
    background: '#f7fafc',
    color: '#4a5568',
    border: '1px solid #e2e8f0',
    borderRadius: '10px',
    fontSize: '0.875rem',
    fontWeight: '600',
    cursor: 'pointer',
  },
  
  detailsContent: {
    padding: '1.5rem',
  },
  
  detailsTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#2d3748',
    marginBottom: '1rem',
  },
  
  detailsDescription: {
    fontSize: '0.875rem',
    color: '#718096',
    marginBottom: '1.5rem',
    lineHeight: '1.6',
  },
  
  detailsInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    marginBottom: '1.5rem',
  },
  
  detailItem: {
    fontSize: '0.875rem',
    color: '#4a5568',
  },
  
  updateButton: {
    width: '100%',
    padding: '0.75rem',
    background: '#10B981',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '0.875rem',
    fontWeight: '600',
    cursor: 'pointer',
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
  
  .task-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0,0,0,0.15);
  }
  
  .status-filter-btn:hover {
    background: #e2e8f0;
    transform: translateY(-1px);
  }
  
  input:focus, textarea:focus, select:focus {
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
  
  @media (max-width: 768px) {
    .filters-section {
      flex-direction: column;
      align-items: stretch;
    }
    
    .filter-group {
      justify-content: space-between;
    }
    
    .create-button .button-text {
      display: none;
    }
    
    .create-button {
      padding: 0.75rem;
      border-radius: 50%;
    }
    
    .form-row {
      grid-template-columns: 1fr;
    }
    
    .stats-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  
  @media (max-width: 480px) {
    .stats-grid {
      grid-template-columns: 1fr;
    }
    
    .task-header {
      flex-direction: column;
      align-items: flex-start;
    }
    
    .task-meta {
      flex-direction: column;
      gap: 0.5rem;
    }
    
    .button-group {
      flex-direction: column;
    }
  }
`;
document.head.appendChild(styleSheet);

export default Tasks;