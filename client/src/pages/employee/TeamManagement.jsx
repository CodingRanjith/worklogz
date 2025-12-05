import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { API_ENDPOINTS } from '../../utils/api';
import { jwtDecode } from 'jwt-decode';
import '../../styles/systemAppTheme.css';
import {
  FiUsers,
  FiUser,
  FiMail,
  FiPhone,
  FiBriefcase,
  FiCalendar,
  FiClock,
  FiSearch,
  FiChevronRight,
  FiAward
} from 'react-icons/fi';

function TeamManagement({ embedded = false, onBack }) {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState(null);
  const [myTeams, setMyTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTeam, setSelectedTeam] = useState(null);

  useEffect(() => {
    checkUserRole();
  }, []);

  const checkUserRole = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        if (!embedded) {
          navigate('/login');
        }
        return;
      }
      const decoded = jwtDecode(token);
      setUserRole(decoded.role);
      setUserId(decoded.userId);
      fetchMyTeams(decoded.userId);
    } catch (error) {
      console.error('Error checking user role:', error);
      if (!embedded) {
        navigate('/login');
      }
    }
  };

  const fetchMyTeams = async (userId) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(API_ENDPOINTS.getMyTeams, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Handle both array and object response formats
      const teamsData = Array.isArray(response.data) 
        ? response.data 
        : (response.data?.teams || response.data?.data || []);
      setMyTeams(teamsData);
    } catch (error) {
      console.error('Error fetching teams:', error);
      if (error.response?.status === 404) {
        // API endpoint might not exist yet, set empty array
        setMyTeams([]);
      } else {
        Swal.fire('Error', error.response?.data?.message || 'Failed to load teams', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredTeams = myTeams.filter(team =>
    team.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    team.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="team-management-container" style={{ 
        padding: '2rem', 
        textAlign: 'center',
        minHeight: '400px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ color: '#64748b' }}>Loading teams...</div>
      </div>
    );
  }

  return (
    <div className="team-management-container" style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#1c1f33' }}>
          My Teams
        </h1>
        <p style={{ color: '#64748b', fontSize: '1rem' }}>
          View and manage the teams you're part of
        </p>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <div style={{ position: 'relative' }}>
          <FiSearch
            style={{
              position: 'absolute',
              left: '1rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#94a3b8',
              fontSize: '1.25rem'
            }}
          />
          <input
            type="text"
            placeholder="Search teams..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem 1rem 0.75rem 3rem',
              border: '1px solid #e2e8f0',
              borderRadius: '0.5rem',
              fontSize: '1rem',
              outline: 'none',
              transition: 'all 0.2s'
            }}
            onFocus={(e) => (e.target.style.borderColor = '#3b82f6')}
            onBlur={(e) => (e.target.style.borderColor = '#e2e8f0')}
          />
        </div>
      </div>

      {filteredTeams.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '4rem 2rem',
            background: '#f8fafc',
            borderRadius: '0.75rem',
            border: '2px dashed #cbd5e1'
          }}
        >
          <FiUsers style={{ fontSize: '4rem', color: '#cbd5e1', marginBottom: '1rem' }} />
          <h3 style={{ color: '#475569', marginBottom: '0.5rem' }}>No Teams Found</h3>
          <p style={{ color: '#94a3b8' }}>
            {searchQuery
              ? 'Try adjusting your search query'
              : "You're not part of any teams yet"}
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {filteredTeams.map((team) => (
            <div
              key={team._id}
              style={{
                background: 'white',
                borderRadius: '0.75rem',
                padding: '1.5rem',
                border: '1px solid #e2e8f0',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                transition: 'all 0.2s',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
              onClick={() => setSelectedTeam(selectedTeam?._id === team._id ? null : team)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                    <FiUsers style={{ fontSize: '1.5rem', color: '#3b82f6' }} />
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1c1f33', margin: 0 }}>
                      {team.name}
                    </h2>
                  </div>
                  {team.description && (
                    <p style={{ color: '#64748b', marginBottom: '0.75rem', fontSize: '0.95rem' }}>
                      {team.description}
                    </p>
                  )}
                </div>
                <FiChevronRight
                  style={{
                    fontSize: '1.5rem',
                    color: '#94a3b8',
                    transform: selectedTeam?._id === team._id ? 'rotate(90deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginTop: '1rem' }}>
                {team.teamLead && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FiAward style={{ color: '#f59e0b', fontSize: '1rem' }} />
                    <span style={{ fontSize: '0.875rem', color: '#64748b' }}>
                      Lead: {team.teamLead.name || `${team.teamLead.firstName || ''} ${team.teamLead.lastName || ''}`.trim()}
                    </span>
                  </div>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FiUsers style={{ color: '#64748b', fontSize: '1rem' }} />
                  <span style={{ fontSize: '0.875rem', color: '#64748b' }}>
                    {team.members?.length || 0} Members
                  </span>
                </div>
              </div>

              {selectedTeam?._id === team._id && (
                <div
                  style={{
                    marginTop: '1.5rem',
                    paddingTop: '1.5rem',
                    borderTop: '1px solid #e2e8f0',
                    animation: 'fadeIn 0.3s ease-in'
                  }}
                >
                  <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem', color: '#1c1f33' }}>
                    Team Members
                  </h3>
                  <div style={{ display: 'grid', gap: '1rem' }}>
                    {team.members?.map((member) => (
                      <div
                        key={member._id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '1rem',
                          padding: '0.75rem',
                          background: '#f8fafc',
                          borderRadius: '0.5rem'
                        }}
                      >
                        <div
                          style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            background: '#3b82f6',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 'bold',
                            fontSize: '1rem'
                          }}
                        >
                          {(member.name || member.firstName || 'U')?.[0]?.toUpperCase()}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: '600', color: '#1c1f33', marginBottom: '0.25rem' }}>
                            {member.name || `${member.firstName || ''} ${member.lastName || ''}`.trim()}
                            {member._id === team.teamLead?._id && (
                              <span
                                style={{
                                  marginLeft: '0.5rem',
                                  padding: '0.25rem 0.5rem',
                                  background: '#fef3c7',
                                  color: '#d97706',
                                  borderRadius: '0.25rem',
                                  fontSize: '0.75rem',
                                  fontWeight: '600'
                                }}
                              >
                                Lead
                              </span>
                            )}
                          </div>
                          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                            {member.email && (
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#64748b' }}>
                                <FiMail style={{ fontSize: '0.875rem' }} />
                                <span>{member.email}</span>
                              </div>
                            )}
                            {member.phone && (
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#64748b' }}>
                                <FiPhone style={{ fontSize: '0.875rem' }} />
                                <span>{member.phone}</span>
                              </div>
                            )}
                            {member.department && (
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#64748b' }}>
                                <FiBriefcase style={{ fontSize: '0.875rem' }} />
                                <span>{member.department}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

export default TeamManagement;

