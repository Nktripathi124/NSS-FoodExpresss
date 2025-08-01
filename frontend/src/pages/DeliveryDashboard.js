import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const DeliveryDashboard = () => {
  const { user } = useAuth();
  const [availableOrders, setAvailableOrders] = useState([]);
  const [myOrders, setMyOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('available');

  useEffect(() => {
    fetchAvailableOrders();
    fetchMyOrders();
  }, []);

  const fetchAvailableOrders = async () => {
    try {
      const response = await axios.get('/orders/delivery/available');
      setAvailableOrders(response.data);
    } catch (error) {
      console.error('Error fetching available orders:', error);
    }
  };

  const fetchMyOrders = async () => {
    try {
      const response = await axios.get('/orders/delivery/my');
      setMyOrders(response.data);
    } catch (error) {
      console.error('Error fetching my orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const acceptOrder = async (orderId) => {
    try {
      await axios.put(`/orders/${orderId}/assign`);
      fetchAvailableOrders();
      fetchMyOrders();
      alert('Order accepted successfully!');
    } catch (error) {
      alert('Error accepting order: ' + (error.response?.data?.message || error.message));
    }
  };

  const updateDeliveryStatus = async (orderId, status) => {
    try {
      await axios.put(`/orders/${orderId}/delivery-status`, { status });
      fetchMyOrders();
      alert('Status updated successfully!');
    } catch (error) {
      alert('Error updating status');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      ready: 'status-ready',
      picked: 'status-warning',
      delivered: 'status-confirmed'
    };
    return colors[status] || 'status-pending';
  };

  if (loading) return <div className="loading">Loading dashboard...</div>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Delivery Dashboard</h1>
        <p className="dashboard-subtitle">Welcome, {user?.name}!</p>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-number">{availableOrders.length}</div>
          <div className="stat-label">Available Orders</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{myOrders.length}</div>
          <div className="stat-label">My Orders</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">
            {myOrders.filter(order => order.status === 'delivered').length}
          </div>
          <div className="stat-label">Completed</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">
            {myOrders.filter(order => order.status === 'picked').length}
          </div>
          <div className="stat-label">In Transit</div>
        </div>
      </div>

      <div className="dashboard-tabs">
        <button 
          className={`tab-btn ${activeTab === 'available' ? 'active' : ''}`}
          onClick={() => setActiveTab('available')}
        >
          Available Orders ({availableOrders.length})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'myorders' ? 'active' : ''}`}
          onClick={() => setActiveTab('myorders')}
        >
          My Orders ({myOrders.length})
        </button>
      </div>

      <div className="dashboard-content">
        {activeTab === 'available' && (
          <div className="dashboard-section">
            <div className="section-header">
              <h2 className="section-title">Available Orders</h2>
            </div>
            
            {availableOrders.length > 0 ? (
              <div className="orders-grid">
                {availableOrders.map(order => (
                  <div key={order._id} className="order-card">
                    <div className="order-header">
                      <h3>Order #{order._id.slice(-6)}</h3>
                      <span className="order-amount">₹{order.totalAmount}</span>
                    </div>
                    
                    <div className="order-details">
                      <p><strong>Restaurant:</strong> {order.restaurant?.name}</p>
                      <p><strong>Customer:</strong> {order.customer?.name}</p>
                      <p><strong>Items:</strong> {order.items.length} items</p>
                      <p><strong>Address:</strong> {order.deliveryAddress}</p>
                    </div>
                    
                    <div className="order-actions">
                      <button 
                        onClick={() => acceptOrder(order._id)}
                        className="btn btn-success"
                      >
                        Accept Order
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-data">No available orders at the moment</div>
            )}
          </div>
        )}

        {activeTab === 'myorders' && (
          <div className="dashboard-section">
            <div className="section-header">
              <h2 className="section-title">My Orders</h2>
            </div>
            
            {myOrders.length > 0 ? (
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Restaurant</th>
                      <th>Customer</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myOrders.map(order => (
                      <tr key={order._id}>
                        <td>#{order._id.slice(-6)}</td>
                        <td>{order.restaurant?.name}</td>
                        <td>{order.customer?.name}</td>
                        <td>₹{order.totalAmount}</td>
                        <td>
                          <span className={`status-badge ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                        <td>
                          {order.status === 'picked' && (
                            <button 
                              onClick={() => updateDeliveryStatus(order._id, 'delivered')}
                              className="btn btn-success btn-sm"
                            >
                              Mark Delivered
                            </button>
                          )}
                          {order.status === 'delivered' && (
                            <span className="text-success">Completed</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="no-data">No orders assigned yet</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliveryDashboard;