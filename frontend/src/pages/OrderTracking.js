import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const OrderTracking = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrder();
    // Set up polling for real-time updates
    const interval = setInterval(fetchOrder, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, [id]);

  const fetchOrder = async () => {
    try {
      const response = await axios.get(`/orders/${id}`);
      setOrder(response.data);
      setError('');
    } catch (error) {
      setError('Order not found or you do not have permission to view this order');
    } finally {
      setLoading(false);
    }
  };

  const getStatusSteps = () => {
    const steps = [
      { key: 'pending', label: 'Order Placed', description: 'Your order has been placed' },
      { key: 'confirmed', label: 'Confirmed', description: 'Restaurant confirmed your order' },
      { key: 'preparing', label: 'Preparing', description: 'Your food is being prepared' },
      { key: 'ready', label: 'Ready', description: 'Food is ready for pickup' },
      { key: 'picked', label: 'Out for Delivery', description: 'Delivery partner picked up your order' },
      { key: 'delivered', label: 'Delivered', description: 'Order delivered successfully' }
    ];

    const currentIndex = steps.findIndex(step => step.key === order?.status);
    
    return steps.map((step, index) => ({
      ...step,
      completed: index <= currentIndex,
      active: index === currentIndex
    }));
  };

  const getEstimatedTime = () => {
    if (!order) return '';
    
    const orderTime = new Date(order.createdAt);
    const now = new Date();
    const elapsed = Math.floor((now - orderTime) / (1000 * 60)); // minutes elapsed
    
    switch (order.status) {
      case 'pending':
        return '5-10 minutes for confirmation';
      case 'confirmed':
        return '15-20 minutes for preparation';
      case 'preparing':
        return '10-15 minutes remaining';
      case 'ready':
        return 'Waiting for pickup';
      case 'picked':
        return '15-25 minutes for delivery';
      case 'delivered':
        return 'Delivered!';
      default:
        return '';
    }
  };

  if (loading) return <div className="loading">Loading order details...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!order) return <div className="error">Order not found</div>;

  const statusSteps = getStatusSteps();

  return (
    <div className="order-tracking-container">
      <div className="tracking-header">
        <h1>Track Your Order</h1>
        <p>Order ID: #{order._id.slice(-8)}</p>
      </div>

      <div className="tracking-content">
        <div className="order-info-card">
          <div className="order-details">
            <h2>Order Details</h2>
            <div className="detail-row">
              <span>Restaurant:</span>
              <span>{order.restaurant?.name}</span>
            </div>
            <div className="detail-row">
              <span>Order Date:</span>
              <span>{new Date(order.createdAt).toLocaleString()}</span>
            </div>
            <div className="detail-row">
              <span>Total Amount:</span>
              <span>₹{order.totalAmount}</span>
            </div>
            <div className="detail-row">
              <span>Delivery Address:</span>
              <span>{order.deliveryAddress}</span>
            </div>
            {order.specialInstructions && (
              <div className="detail-row">
                <span>Special Instructions:</span>
                <span>{order.specialInstructions}</span>
              </div>
            )}
            {order.deliveryBoy && (
              <div className="delivery-info">
                <h3>Delivery Partner</h3>
                <p>Name: {order.deliveryBoy.name}</p>
                <p>Phone: {order.deliveryBoy.phone}</p>
                <p>Vehicle: {order.deliveryBoy.vehicleNumber}</p>
              </div>
            )}
          </div>

          <div className="order-items">
            <h3>Items Ordered</h3>
            <div className="items-list">
              {order.items.map((item, index) => (
                <div key={index} className="item-row">
                  <span className="item-name">{item.name}</span>
                  <span className="item-quantity">x{item.quantity}</span>
                  <span className="item-price">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="tracking-timeline">
          <div className="timeline-header">
            <h2>Order Status</h2>
            <div className="estimated-time">
              <span className="time-label">Estimated Time:</span>
              <span className="time-value">{getEstimatedTime()}</span>
            </div>
          </div>

          <div className="timeline">
            {statusSteps.map((step, index) => (
              <div 
                key={step.key} 
                className={`timeline-step ${step.completed ? 'completed' : ''} ${step.active ? 'active' : ''}`}
              >
                <div className="step-indicator">
                  <div className="step-circle">
                    {step.completed ? '✓' : index + 1}
                  </div>
                  {index < statusSteps.length - 1 && (
                    <div className={`step-line ${step.completed ? 'completed' : ''}`}></div>
                  )}
                </div>
                <div className="step-content">
                  <h3 className="step-title">{step.label}</h3>
                  <p className="step-description">{step.description}</p>
                  {step.active && (
                    <div className="current-status">
                      <span className="status-indicator">●</span>
                      <span>Current Status</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="tracking-actions">
        <button 
          onClick={fetchOrder}
          className="btn btn-primary"
        >
          Refresh Status
        </button>
        
        {order.status !== 'delivered' && order.status !== 'cancelled' && (
          <button 
            onClick={() => {
              if (window.confirm('Are you sure you want to cancel this order?')) {
                // Implement cancel order logic
                alert('Order cancellation requested. Our team will contact you shortly.');
              }
            }}
            className="btn btn-danger"
          >
            Cancel Order
          </button>
        )}
      </div>
    </div>
  );
};

export default OrderTracking;