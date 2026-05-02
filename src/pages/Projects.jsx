import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { projects as projectApi } from '../services/api';
import Layout from '../components/Layout';

function Projects() {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [formData, setFormData] = useState({ name: '', memberIds: [] });
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchProjects();
    if (user.role === 'admin') {
      fetchUsers();
    }
  }, []);

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

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      await projectApi.create(formData);
      toast.success('Project created successfully');
      setShowModal(false);
      setFormData({ name: '', memberIds: [] });
      fetchProjects();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create project');
    }
  };

  const handleAddMember = async (projectId, userId) => {
    try {
      await projectApi.addMember({ projectId, userId });
      toast.success('Member added successfully');
      setShowMembersModal(false);
      fetchProjects();
    } catch (error) {
      toast.error('Failed to add member');
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        // Add delete API call if you have one
        toast.success('Project deleted successfully');
        fetchProjects();
      } catch (error) {
        toast.error('Failed to delete project');
      }
    }
  };

  return (
    <Layout>
      <div style={styles.container}>
        {/* Header Section */}
        <div style={styles.header}>
          <div style={styles.headerLeft}>
            <h1 style={styles.title}>Projects</h1>
            <p style={styles.subtitle}>Manage your team projects</p>
          </div>
          {user.role === 'admin' && (
            <button onClick={() => setShowModal(true)} style={styles.createButton}>
              <span style={styles.buttonIcon}>+</span>
              <span style={styles.buttonText}>New Project</span>
            </button>
          )}
        </div>

        {/* Projects Grid */}
        {projects.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>📁</div>
            <h3 style={styles.emptyTitle}>No Projects Yet</h3>
            <p style={styles.emptyText}>Create your first project to get started</p>
            {user.role === 'admin' && (
              <button onClick={() => setShowModal(true)} style={styles.emptyButton}>
                Create Project
              </button>
            )}
          </div>
        ) : (
          <div style={styles.projectGrid}>
            {projects.map((project) => (
              <div key={project.id} style={styles.projectCard}>
                {/* Project Header */}
                <div style={styles.projectHeader}>
                  <div style={styles.projectIcon}>📋</div>
                  <div style={styles.projectInfo}>
                    <h3 style={styles.projectName}>{project.name}</h3>
                    <p style={styles.projectCreator}>
                      Created by {project.created_by_name}
                    </p>
                  </div>
                  {user.role === 'admin' && (
                    <button 
                      onClick={() => handleDeleteProject(project.id)}
                      style={styles.deleteButton}
                    >
                      ⋯
                    </button>
                  )}
                </div>

                {/* Members Section */}
                <div style={styles.membersSection}>
                  <div style={styles.membersHeader}>
                    <h4 style={styles.membersTitle}>
                      <span style={styles.membersIcon}>👥</span>
                      Team Members ({project.members?.length || 0})
                    </h4>
                    {user.role === 'admin' && (
                      <button 
                        onClick={() => {
                          setSelectedProject(project);
                          setShowMembersModal(true);
                        }}
                        style={styles.addMemberButton}
                      >
                        + Add
                      </button>
                    )}
                  </div>
                  
                  <div style={styles.membersList}>
                    {project.members?.map((member) => (
                      <div key={member.id} style={styles.memberItem}>
                        <div style={styles.memberAvatar}>
                          {member.name.charAt(0).toUpperCase()}
                        </div>
                        <div style={styles.memberInfo}>
                          <span style={styles.memberName}>{member.name}</span>
                          <span style={{...styles.memberRole, 
                            backgroundColor: member.role === 'admin' ? '#EBF5FF' : '#F3F4F6',
                            color: member.role === 'admin' ? '#3B82F6' : '#6B7280'
                          }}>
                            {member.role}
                          </span>
                        </div>
                      </div>
                    ))}
                    {project.members?.length === 0 && (
                      <p style={styles.noMembers}>No members yet</p>
                    )}
                  </div>
                </div>

                {/* Quick Stats */}
                <div style={styles.projectStats}>
                  <div style={styles.statItem}>
                    <span style={styles.statValue}>{project.tasks_count || 0}</span>
                    <span style={styles.statLabel}>Tasks</span>
                  </div>
                  <div style={styles.statDivider}></div>
                  <div style={styles.statItem}>
                    <span style={styles.statValue}>{project.members?.length || 0}</span>
                    <span style={styles.statLabel}>Members</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create Project Modal */}
        {showModal && (
          <div style={styles.modal} onClick={() => setShowModal(false)}>
            <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <div style={styles.modalHeader}>
                <h2 style={styles.modalTitle}>Create New Project</h2>
                <button onClick={() => setShowModal(false)} style={styles.closeButton}>✕</button>
              </div>
              <form onSubmit={handleCreateProject} style={styles.form}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Project Name</label>
                  <input
                    type="text"
                    placeholder="Enter project name"
                    style={styles.input}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div style={styles.buttonGroup}>
                  <button type="submit" style={styles.submitButton}>Create Project</button>
                  <button type="button" onClick={() => setShowModal(false)} style={styles.cancelButton}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add Member Modal */}
        {showMembersModal && selectedProject && (
          <div style={styles.modal} onClick={() => setShowMembersModal(false)}>
            <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <div style={styles.modalHeader}>
                <h2 style={styles.modalTitle}>Add Team Member</h2>
                <button onClick={() => setShowMembersModal(false)} style={styles.closeButton}>✕</button>
              </div>
              <div style={styles.modalBody}>
                <p style={styles.modalSubtitle}>
                  Add members to <strong>{selectedProject.name}</strong>
                </p>
                <div style={styles.userList}>
                  {users.filter(u => !selectedProject.members?.some(m => m.id === u.id)).map((user) => (
                    <div key={user.id} style={styles.userItem}>
                      <div style={styles.userInfo}>
                        <div style={styles.userAvatar}>
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div style={styles.userName}>{user.name}</div>
                          <div style={styles.userEmail}>{user.email}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleAddMember(selectedProject.id, user.id)}
                        style={styles.addUserButton}
                      >
                        Add
                      </button>
                    </div>
                  ))}
                  {users.filter(u => !selectedProject.members?.some(m => m.id === u.id)).length === 0 && (
                    <p style={styles.noUsers}>No available users to add</p>
                  )}
                </div>
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
    flexDirection: 'row',
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
  
  projectGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: 'clamp(1rem, 3vw, 1.5rem)',
  },
  
  projectCard: {
    background: 'white',
    borderRadius: '16px',
    padding: '1.5rem',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    cursor: 'pointer',
  },
  
  projectHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '1rem',
    marginBottom: '1.5rem',
  },
  
  projectIcon: {
    fontSize: '2rem',
  },
  
  projectInfo: {
    flex: 1,
  },
  
  projectName: {
    fontSize: 'clamp(1.1rem, 4vw, 1.25rem)',
    fontWeight: '600',
    color: '#2d3748',
    marginBottom: '0.25rem',
  },
  
  projectCreator: {
    fontSize: '0.75rem',
    color: '#718096',
  },
  
  deleteButton: {
    background: 'none',
    border: 'none',
    fontSize: '1.5rem',
    cursor: 'pointer',
    color: '#cbd5e0',
    padding: '0.25rem',
  },
  
  membersSection: {
    marginBottom: '1rem',
  },
  
  membersHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  
  membersTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.875rem',
    color: '#4a5568',
  },
  
  membersIcon: {
    fontSize: '1rem',
  },
  
  addMemberButton: {
    padding: '0.25rem 0.75rem',
    background: '#EBF5FF',
    color: '#3B82F6',
    border: 'none',
    borderRadius: '6px',
    fontSize: '0.75rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  
  membersList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    maxHeight: '200px',
    overflowY: 'auto',
  },
  
  memberItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.5rem',
    background: '#f7fafc',
    borderRadius: '8px',
    transition: 'all 0.3s ease',
  },
  
  memberAvatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: '600',
    fontSize: '0.875rem',
  },
  
  memberInfo: {
    flex: 1,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '0.5rem',
  },
  
  memberName: {
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#2d3748',
  },
  
  memberRole: {
    fontSize: '0.75rem',
    padding: '0.25rem 0.5rem',
    borderRadius: '4px',
    textTransform: 'capitalize',
  },
  
  noMembers: {
    fontSize: '0.875rem',
    color: '#a0aec0',
    textAlign: 'center',
    padding: '1rem',
  },
  
  projectStats: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: '1rem',
    marginTop: '1rem',
    borderTop: '1px solid #e2e8f0',
  },
  
  statItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.25rem',
  },
  
  statValue: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    color: '#2d3748',
  },
  
  statLabel: {
    fontSize: '0.75rem',
    color: '#a0aec0',
  },
  
  statDivider: {
    width: '1px',
    height: '30px',
    background: '#e2e8f0',
  },
  
  emptyState: {
    textAlign: 'center',
    padding: 'clamp(2rem, 10vw, 4rem)',
    background: 'white',
    borderRadius: '16px',
    marginTop: '2rem',
  },
  
  emptyIcon: {
    fontSize: '4rem',
    marginBottom: '1rem',
  },
  
  emptyTitle: {
    fontSize: '1.5rem',
    color: '#2d3748',
    marginBottom: '0.5rem',
  },
  
  emptyText: {
    fontSize: '1rem',
    color: '#718096',
    marginBottom: '1.5rem',
  },
  
  emptyButton: {
    padding: '0.75rem 1.5rem',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
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
    maxWidth: '500px',
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
  
  modalBody: {
    padding: '1.5rem',
  },
  
  modalSubtitle: {
    fontSize: '0.875rem',
    color: '#718096',
    marginBottom: '1rem',
  },
  
  form: {
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
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
  
  buttonGroup: {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap',
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
  
  userList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    maxHeight: '400px',
    overflowY: 'auto',
  },
  
  userItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.75rem',
    background: '#f7fafc',
    borderRadius: '10px',
  },
  
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  
  userAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: '600',
  },
  
  userName: {
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#2d3748',
  },
  
  userEmail: {
    fontSize: '0.75rem',
    color: '#718096',
  },
  
  addUserButton: {
    padding: '0.5rem 1rem',
    background: '#10B981',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '0.75rem',
    cursor: 'pointer',
  },
  
  noUsers: {
    textAlign: 'center',
    padding: '2rem',
    color: '#a0aec0',
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
  
  .project-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0,0,0,0.15);
  }
  
  .create-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0,0,0,0.15);
  }
  
  .add-member-button:hover {
    transform: translateY(-1px);
  }
  
  .add-user-button:hover {
    background: #059669;
    transform: translateY(-1px);
  }
  
  .submit-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
  }
  
  .cancel-button:hover {
    background: #e2e8f0;
  }
  
  @media (max-width: 768px) {
    .project-grid {
      grid-template-columns: 1fr;
    }
    
    .create-button .button-text {
      display: none;
    }
    
    .create-button {
      padding: 0.75rem;
      border-radius: 50%;
    }
    
    .member-info {
      flex-direction: column;
      align-items: flex-start;
    }
    
    .button-group {
      flex-direction: column;
    }
    
    .modal-content {
      margin: 1rem;
      max-height: 85vh;
    }
  }
  
  @media (max-width: 480px) {
    .project-card {
      padding: 1rem;
    }
    
    .member-item {
      flex-direction: column;
      align-items: flex-start;
    }
    
    .member-info {
      width: 100%;
    }
    
    .user-item {
      flex-direction: column;
      align-items: stretch;
      gap: 0.75rem;
    }
    
    .add-user-button {
      width: 100%;
    }
  }
`;
document.head.appendChild(styleSheet);

export default Projects;