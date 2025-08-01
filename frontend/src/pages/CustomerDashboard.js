import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const CustomerDashboard = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('/orders/my');
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'status-pending',
      confirmed: 'status-confirmed',
      preparing: 'status-preparing',
      ready: 'status-ready',
      picked: 'status-warning',
      delivered: 'status-confirmed',
      cancelled: 'status-cancelled'
    };
    return colors[status] || 'status-pending';
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Welcome, {user?.name}!</h1>
        <p className="dashboard-subtitle">Track your orders and discover new restaurants</p>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-number">{orders.length}</div>
          <div className="stat-label">Total Orders</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">
            {orders.filter(order => order.status === 'delivered').length}
          </div>
          <div className="stat-label">Delivered</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">
            {orders.filter(order => ['pending', 'confirmed', 'preparing', 'ready', 'picked'].includes(order.status)).length}
          </div>
          <div className="stat-label">Active Orders</div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-section">
          <div className="section-header">
            <h2 className="section-title">Recent Orders</h2>
            <Link to="/" className="btn btn-primary">Order Food</Link>
          </div>
          
          {loading ? (
            <div className="loading">Loading orders...</div>
          ) : orders.length > 0 ? (
            <div className="orders-list">
              {orders.slice(0, 5).map(order => (
                <div key={order._id} className="order-card">
                  <div className="order-header">
                    <h3>{order.restaurant?.name}</h3>
                    <span className={`status-badge ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="order-details">
                    <p>Items: {order.items.length}</p>
                    <p>Total: ₹{order.totalAmount}</p>
                    <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="order-actions">
                    <Link 
                      to={`/order-tracking/${order._id}`} 
                      className="btn btn-primary"
                    >
                      Track Order
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-orders">
              <p>No orders yet. <Link to="/">Start ordering!</Link></p>
            </div>
          )}
        </div>

        <div className="dashboard-section">
          <div className="section-header">
            <h2 className="section-title">Quick Actions</h2>
          </div>
          
          <div className="quick-actions">
            <Link to="/" className="action-card">
              <div className="action-icon">🍽️</div>
              <h3>Order Food</h3>
              <p>Browse restaurants and place new orders</p>
            </Link>
            
            <Link to="/helpdesk" className="action-card">
              <div className="action-icon">💬</div>
              <h3>Help & Support</h3>
              <p>Get help with your orders or account</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;