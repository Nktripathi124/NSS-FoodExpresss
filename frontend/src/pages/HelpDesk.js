import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const HelpDesk = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    subject: '',
    message: '',
    category: 'other'
  });

  useEffect(() => {
    if (user) {
      fetchMyTickets();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchMyTickets = async () => {
    try {
      const response = await axios.get('/helpdesk/my');
      setTickets(response.data);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/helpdesk', formData);
      alert('Support ticket created successfully! We will get back to you soon.');
      setFormData({
        name: user?.name || '',
        email: user?.email || '',
        phone: '',
        subject: '',
        message: '',
        category: 'other'
      });
      setShowCreateForm(false);
      if (user) fetchMyTickets();
    } catch (error) {
      alert('Error creating ticket: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      open: 'status-pending',
      'in-progress': 'status-warning',
      resolved: 'status-confirmed',
      closed: 'status-cancelled'
    };
    return colors[status] || 'status-pending';
  };

  return (
    <div className="helpdesk-container">
      <div className="helpdesk-header">
        <h1 className="page-title">Help & Support</h1>
        <p className="page-subtitle">
          Need help? We're here to assist you. Create a support ticket and our team will get back to you.
        </p>
      </div>

      <div className="helpdesk-content">
        <div className="help-sections">
          <div className="help-section">
            <h2>Frequently Asked Questions</h2>
            <div className="faq-list">
              <div className="faq-item">
                <h3>How do I track my order?</h3>
                <p>You can track your order status from your customer dashboard or use the order tracking link sent to your email.</p>
              </div>
              <div className="faq-item">
                <h3>What payment methods do you accept?</h3>
                <p>We accept all major credit cards, debit cards, UPI, and cash on delivery.</p>
              </div>
              <div className="faq-item">
                <h3>How can I cancel my order?</h3>
                <p>Orders can be cancelled within 5 minutes of placing. Contact our support team for assistance.</p>
              </div>
              <div className="faq-item">
                <h3>How do I become a delivery partner?</h3>
                <p>You can register as a delivery partner using the registration form and select "Delivery Partner" option.</p>
              </div>
            </div>
          </div>

          <div className="help-section">
            <div className="section-header">
              <h2>Contact Support</h2>
              <button 
                onClick={() => setShowCreateForm(true)}
                className="btn btn-primary"
              >
                Create New Ticket
              </button>
            </div>

            <div className="contact-info">
              <div className="contact-item">
                <h3>📞 Phone Support</h3>
                <p>+91 1800-123-4567</p>
                <p>Available 24/7</p>
              </div>
              <div className="contact-item">
                <h3>📧 Email Support</h3>
                <p>support@nssfoodexpress.com</p>
                <p>Response within 24 hours</p>
              </div>
              <div className="contact-item">
                <h3>💬 Live Chat</h3>
                <p>Available on our mobile app</p>
                <p>Mon-Sun: 9 AM - 11 PM</p>
              </div>
            </div>
          </div>
        </div>

        {user && (
          <div className="help-section">
            <h2>My Support Tickets</h2>
            {loading ? (
              <div className="loading">Loading tickets...</div>
            ) : tickets.length > 0 ? (
              <div className="tickets-list">
                {tickets.map(ticket => (
                  <div key={ticket._id} className="ticket-card">
                    <div className="ticket-header">
                      <h3>{ticket.subject}</h3>
                      <span className={`status-badge ${getStatusColor(ticket.status)}`}>
                        {ticket.status}
                      </span>
                    </div>
                    <div className="ticket-details">
                      <p><strong>Category:</strong> {ticket.category}</p>
                      <p><strong>Created:</strong> {new Date(ticket.createdAt).toLocaleDateString()}</p>
                      <p><strong>Message:</strong> {ticket.message}</p>
                      {ticket.adminResponse && (
                        <div className="admin-response">
                          <strong>Admin Response:</strong>
                          <p>{ticket.adminResponse}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-data">No support tickets created yet</div>
            )}
          </div>
        )}
      </div>

      {showCreateForm && (
        <div className="form-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">Create Support Ticket</h2>
              <button 
                onClick={() => setShowCreateForm(false)}
                className="close-btn"
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="support-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="form-input"
                  />
                </div>
                
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Phone (Optional)</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
                
                <div className="form-group">
                  <label>Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="order">Order Issue</option>
                    <option value="payment">Payment Issue</option>
                    <option value="delivery">Delivery Issue</option>
                    <option value="restaurant">Restaurant Issue</option>
                    <option value="technical">Technical Issue</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="form-input"
                  placeholder="Brief description of your issue"
                />
              </div>

              <div className="form-group">
                <label>Message</label>
                <textarea 
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="form-textarea"
                  rows="5"
                  placeholder="Please describe your issue in detail..."
                />
              </div>

              <button type="submit" className="submit-btn">
                Create Ticket
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HelpDesk;