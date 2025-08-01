import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const RestaurantDashboard = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [menu, setMenu] = useState([]);
  const [showAddItem, setShowAddItem] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: ''
  });

  useEffect(() => {
    fetchOrders();
    fetchMenu();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('/restaurants/orders/my');
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const fetchMenu = async () => {
    try {
      const response = await axios.get(`/restaurants/${user.id}`);
      setMenu(response.data.menu || []);
    } catch (error) {
      console.error('Error fetching menu:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      await axios.put(`/restaurants/orders/${orderId}/status`, { status });
      fetchOrders();
      alert('Order status updated successfully!');
    } catch (error) {
      alert('Error updating order status');
    }
  };

  const addMenuItem = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/restaurants/menu', {
        ...newItem,
        price: parseFloat(newItem.price)
      });
      setNewItem({ name: '', description: '', price: '', category: '', image: '' });
      setShowAddItem(false);
      fetchMenu();
      alert('Menu item added successfully!');
    } catch (error) {
      alert('Error adding menu item');
    }
  };

  const deleteMenuItem = async (itemId) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await axios.delete(`/restaurants/menu/${itemId}`);
        fetchMenu();
        alert('Menu item deleted successfully!');
      } catch (error) {
        alert('Error deleting menu item');
      }
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

  if (loading) return <div className="loading">Loading dashboard...</div>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Restaurant Dashboard</h1>
        <p className="dashboard-subtitle">Welcome, {user?.name}!</p>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-number">{orders.length}</div>
          <div className="stat-label">Total Orders</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">
            {orders.filter(order => order.status === 'pending').length}
          </div>
          <div className="stat-label">Pending Orders</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{menu.length}</div>
          <div className="stat-label">Menu Items</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">
            ₹{orders.reduce((total, order) => total + order.totalAmount, 0)}
          </div>
          <div className="stat-label">Total Revenue</div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-section">
          <div className="section-header">
            <h2 className="section-title">Recent Orders</h2>
          </div>
          
          {orders.length > 0 ? (
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Items</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order._id}>
                      <td>#{order._id.slice(-6)}</td>
                      <td>{order.customer?.name}</td>
                      <td>{order.items.length} items</td>
                      <td>₹{order.totalAmount}</td>
                      <td>
                        <span className={`status-badge ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td>
                        {order.status === 'pending' && (
                          <button 
                            onClick={() => updateOrderStatus(order._id, 'confirmed')}
                            className="btn btn-success btn-sm"
                          >
                            Confirm
                          </button>
                        )}
                        {order.status === 'confirmed' && (
                          <button 
                            onClick={() => updateOrderStatus(order._id, 'preparing')}
                            className="btn btn-warning btn-sm"
                          >
                            Preparing
                          </button>
                        )}
                        {order.status === 'preparing' && (
                          <button 
                            onClick={() => updateOrderStatus(order._id, 'ready')}
                            className="btn btn-primary btn-sm"
                          >
                            Ready
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="no-data">No orders yet</div>
          )}
        </div>

        <div className="dashboard-section">
          <div className="section-header">
            <h2 className="section-title">Menu Management</h2>
            <button 
              onClick={() => setShowAddItem(true)}
              className="btn btn-primary"
            >
              Add New Item
            </button>
          </div>
          
          <div className="menu-items-grid">
            {menu.map(item => (
              <div key={item._id} className="menu-item-card">
                <div className="menu-item-info">
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
                  <p className="price">₹{item.price}</p>
                  <span className="category">{item.category}</span>
                </div>
                <div className="menu-item-actions">
                  <button 
                    onClick={() => deleteMenuItem(item._id)}
                    className="btn btn-danger btn-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showAddItem && (
        <div className="form-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">Add New Menu Item</h2>
              <button 
                onClick={() => setShowAddItem(false)}
                className="close-btn"
              >
                ×
              </button>
            </div>
            
            <form onSubmit={addMenuItem} className="auth-form">
              <div className="form-group">
                <label>Item Name</label>
                <input
                  type="text"
                  value={newItem.name}
                  onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                  required
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label>Description</label>
                <textarea 
                  value={newItem.description}
                  onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                  className="form-textarea"
                  rows="3"
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Price (₹)</label>
                  <input
                    type="number"
                    value={newItem.price}
                    onChange={(e) => setNewItem({...newItem, price: e.target.value})}
                    required
                    className="form-input"
                  />
                </div>
                
                <div className="form-group">
                  <label>Category</label>
                  <input
                    type="text"
                    value={newItem.category}
                    onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                    className="form-input"
                    placeholder="e.g., Main Course"
                  />
                </div>
              </div>
              
              <button type="submit" className="submit-btn">
                Add Menu Item
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantDashboard;                