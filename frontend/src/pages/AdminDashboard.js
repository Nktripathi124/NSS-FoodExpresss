import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRestaurants: 0,
    totalCustomers: 0,
    totalRevenue: 0
  });
  const [helpTickets, setHelpTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchStats();
    fetchHelpTickets();
  }, []);

  const fetchStats = async () => {
    try {
      // In a real app, you'd have admin-specific endpoints
      const restaurantsRes = await axios.get('/restaurants');
      setStats(prev => ({
        ...prev,
        totalRestaurants: restaurantsRes.data.length
      }));
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchHelpTickets = async () => {
    try {
      const response = await axios.get('/helpdesk/all');
      setHelpTickets(response.data);
    } catch (error) {
      console.error('Error fetching help tickets:', error);
    }
  };

  const updateTicketStatus = async (ticketId, status, response = '') => {
    try {
      await axios.put(`/helpdesk/${ticketId}`, {
        status,
        adminResponse: response
      });
      fetchHelpTickets();
      alert('Ticket updated successfully!');
    } catch (error) {
      alert('Error updating ticket');
    }
  };

  const getTicketStatusColor = (status) => {
    const colors = {
      open: 'status-pending',
      'in-progress': 'status-warning',
      resolved: 'status-confirmed',
      closed: 'status-cancelled'
    };
    return colors[status] || 'status-pending';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'priority-low',
      medium: 'priority-medium',
      high: 'priority-high',
      urgent: 'priority-urgent'
    };
    return colors[priority] || 'priority-medium';
  };

  if (loading) return <div className="loading">Loading admin dashboard...</div>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Admin Dashboard</h1>
        <p className="dashboard-subtitle">Welcome, {user?.name}! Manage your platform</p>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-number">{stats.totalOrders}</div>
          <div className="stat-label">Total Orders</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.totalRestaurants}</div>
          <div className="stat-label">Restaurants</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.totalCustomers}</div>
          <div className="stat-label">Customers</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">₹{stats.totalRevenue}</div>
          <div className="stat-label">Revenue</div>
        </div>
      </div>

      <div className="dashboard-tabs">
        <button 
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`tab-btn ${activeTab === 'helpdesk' ? 'active' : ''}`}
          onClick={() => setActiveTab('helpdesk')}
        >
          Help Desk ({helpTickets.filter(t => t.status === 'open').length})
        </button>
      </div>

      <div className="dashboard-content">
        {activeTab === 'overview' && (
          <div className="dashboard-section">
            <div className="section-header">
              <h2 className="section-title">System Overview</h2>
            </div>
            
            <div className="overview-grid">
              <div className="overview-card">
                <h3>Recent Activity</h3>
                <p>Monitor platform activity and user interactions</p>
                <div className="activity-list">
                  <div className="activity-item">
                    <span className="activity-time">2 mins ago</span>
                    <span className="activity-text">New restaurant registered</span>
                  </div>
                  <div className="activity-item">
                    <span className="activity-time">5 mins ago</span>
                    <span className="activity-text">Order completed</span>
                  </div>
                  <div className="activity-item">
                    <span className="activity-time">10 mins ago</span>
                    <span className="activity-text">New customer registered</span>
                  </div>
                </div>
              </div>
              
              <div className="overview-card">
                <h3>System Health</h3>
                <div className="health-indicators">
                  <div className="health-item">
                    <span className="health-label">Server Status</span>
                    <span className="health-status online">Online</span>
                  </div>
                  <div className="health-item">
                    <span className="health-label">Database</span>
                    <span className="health-status online">Connected</span>
                  </div>
                  <div className="health-item">
                    <span className="health-label">Payment Gateway</span>
                    <span className="health-status online">Active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'helpdesk' && (
          <div className="dashboard-section">
            <div className="section-header">
              <h2 className="section-title">Help Desk Management</h2>
            </div>
            
            {helpTickets.length > 0 ? (
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Ticket ID</th>
                      <th>Subject</th>
                      <th>Customer</th>
                      <th>Category</th>
                      <th>Priority</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {helpTickets.map(ticket => (
                      <tr key={ticket._id}>
                        <td>#{ticket._id.slice(-6)}</td>
                        <td>{ticket.subject}</td>
                        <td>{ticket.name}</td>
                        <td>{ticket.category}</td>
                        <td>
                          <span className={`priority-badge ${getPriorityColor(ticket.priority)}`}>
                            {ticket.priority}
                          </span>
                        </td>
                        <td>
                          <span className={`status-badge ${getTicketStatusColor(ticket.status)}`}>
                            {ticket.status}
                          </span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            {ticket.status === 'open' && (
                              <button 
                                onClick={() => updateTicketStatus(ticket._id, 'in-progress')}
                                className="btn btn-warning btn-sm"
                              >
                                In Progress
                              </button>
                            )}
                            {ticket.status === 'in-progress' && (
                              <button 
                                onClick={() => updateTicketStatus(ticket._id, 'resolved', 'Issue resolved by admin')}
                                className="btn btn-success btn-sm"
                              >
                                Resolve
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="no-data">No help tickets available</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;