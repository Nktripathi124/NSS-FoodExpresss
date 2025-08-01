import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const RestaurantDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [restaurant, setRestaurant] = useState(null);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCart, setShowCart] = useState(false);
  const [orderData, setOrderData] = useState({
    deliveryAddress: '',
    specialInstructions: ''
  });

  useEffect(() => {
    fetchRestaurant();
  }, [id]);

  const fetchRestaurant = async () => {
    try {
      const response = await axios.get(`/restaurants/${id}`);
      setRestaurant(response.data);
    } catch (error) {
      console.error('Error fetching restaurant:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (item) => {
    const existingItem = cart.find(cartItem => cartItem._id === item._id);
    if (existingItem) {
      setCart(cart.map(cartItem =>
        cartItem._id === item._id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const removeFromCart = (itemId) => {
    setCart(cart.filter(item => item._id !== itemId));
  };

  const updateQuantity = (itemId, quantity) => {
    if (quantity === 0) {
      removeFromCart(itemId);
    } else {
      setCart(cart.map(item =>
        item._id === itemId ? { ...item, quantity } : item
      ));
    }
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleOrder = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (user.role !== 'customer') {
      alert('Only customers can place orders');
      return;
    }

    try {
      const orderItems = cart.map(item => ({
        menuItem: item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity
      }));

      const response = await axios.post('/orders', {
        restaurant: restaurant._id,
        items: orderItems,
        deliveryAddress: orderData.deliveryAddress,
        specialInstructions: orderData.specialInstructions
      });

      alert('Order placed successfully!');
      navigate(`/order-tracking/${response.data.order._id}`);
    } catch (error) {
      alert('Error placing order: ' + (error.response?.data?.message || error.message));
    }
  };

  if (loading) {
    return <div className="loading">Loading restaurant details...</div>;
  }

  if (!restaurant) {
    return <div className="error">Restaurant not found</div>;
  }

  return (
    <div className="restaurant-detail-container">
      <div className="restaurant-header">
        <div className="restaurant-hero">
          <div className="restaurant-image-large">
            {restaurant.image ? (
              <img src={restaurant.image} alt={restaurant.name} />
            ) : (
              <div className="placeholder-image-large">🏪</div>
            )}
          </div>
          <div className="restaurant-info-large">
            <h1 className="restaurant-name-large">{restaurant.name}</h1>
            <p className="restaurant-cuisine-large">
              {restaurant.cuisine.join(', ')}
            </p>
            <div className="restaurant-meta">
              <span className="rating-large">⭐ {restaurant.rating.toFixed(1)}</span>
              <span className="delivery-time-large">30-45 min</span>
            </div>
            <p className="restaurant-address-large">{restaurant.address}</p>
          </div>
        </div>
      </div>

      <div className="menu-container">
        <div className="menu-section">
          <h2 className="menu-title">Our Menu</h2>
          <div className="menu-grid">
            {restaurant.menu.map(item => (
              <div key={item._id} className="menu-item-card">
                <div className="menu-item-info">
                  <h3 className="menu-item-name">{item.name}</h3>
                  <p className="menu-item-description">{item.description}</p>
                  <p className="menu-item-price">₹{item.price}</p>
                </div>
                <div className="menu-item-actions">
                  {item.isAvailable ? (
                    <button 
                      onClick={() => addToCart(item)}
                      className="btn btn-primary add-to-cart-btn"
                    >
                      Add to Cart
                    </button>
                  ) : (
                    <button className="btn btn-disabled" disabled>
                      Not Available
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {cart.length > 0 && (
          <div className="cart-sidebar">
            <div className="cart-header">
              <h3>Your Order ({cart.length} items)</h3>
              <button 
                onClick={() => setShowCart(!showCart)}
                className="cart-toggle"
              >
                {showCart ? '▼' : '▲'}
              </button>
            </div>
            
            <div className={`cart-content ${showCart ? 'expanded' : ''}`}>
              <div className="cart-items">
                {cart.map(item => (
                  <div key={item._id} className="cart-item">
                    <div className="item-details">
                      <h4>{item.name}</h4>
                      <p>₹{item.price}</p>
                    </div>
                    <div className="quantity-controls">
                      <button 
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        className="quantity-btn"
                      >
                        -
                      </button>
                      <span className="quantity">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        className="quantity-btn"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="cart-total">
                <h3>Total: ₹{calculateTotal()}</h3>
              </div>

              <div className="order-form">
                <div className="form-group">
                  <label>Delivery Address:</label>
                  <textarea 
                    value={orderData.deliveryAddress}
                    onChange={(e) => setOrderData({
                      ...orderData,
                      deliveryAddress: e.target.value
                    })}
                    placeholder="Enter your delivery address"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Special Instructions:</label>
                  <textarea 
                    value={orderData.specialInstructions}
                    onChange={(e) => setOrderData({
                      ...orderData,
                      specialInstructions: e.target.value
                    })}
                    placeholder="Any special instructions (optional)"
                  />
                </div>

                <button 
                  onClick={handleOrder}
                  className="btn btn-success place-order-btn"
                  disabled={!orderData.deliveryAddress}
                >
                  Place Order
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantDetail;