import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const response = await axios.get('/restaurants');
      setRestaurants(response.data);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRestaurants = restaurants.filter(restaurant =>
    restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    restaurant.cuisine.some(c => c.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Delicious Food Delivered to Your Doorstep
          </h1>
          <p className="hero-subtitle">
            Order from the best restaurants in your city with NSS-FoodExpressss
          </p>
          <div className="search-container">
            <input
              type="text"
              placeholder="Search restaurants or cuisines..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <button className="search-btn">🔍</button>
          </div>
        </div>
        <div className="hero-image">
          <div className="food-illustration">🍕🍔🍜</div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2 className="section-title">Why Choose NSS-FoodExpressss?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Fast Delivery</h3>
            <p>Get your food delivered in 30 minutes or less</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🍽️</div>
            <h3>Quality Food</h3>
            <p>Partner with the best restaurants in your city</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💳</div>
            <h3>Easy Payment</h3>
            <p>Multiple payment options for your convenience</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📱</div>
            <h3>Track Orders</h3>
            <p>Real-time tracking of your food delivery</p>
          </div>
        </div>
      </section>

      {/* Restaurants Section */}
      <section className="restaurants-section">
        <h2 className="section-title">Popular Restaurants</h2>
        {loading ? (
          <div className="loading">Loading restaurants...</div>
        ) : (
          <div className="restaurants-grid">
            {filteredRestaurants.map(restaurant => (
              <Link 
                key={restaurant._id} 
                to={`/restaurant/${restaurant._id}`}
                className="restaurant-card"
              >
                <div className="restaurant-image">
                  {restaurant.image ? (
                    <img src={restaurant.image} alt={restaurant.name} />
                  ) : (
                    <div className="placeholder-image">🏪</div>
                  )}
                </div>
                <div className="restaurant-info">
                  <h3 className="restaurant-name">{restaurant.name}</h3>
                  <p className="restaurant-cuisine">
                    {restaurant.cuisine.join(', ')}
                  </p>
                  <div className="restaurant-details">
                    <span className="rating">⭐ {restaurant.rating.toFixed(1)}</span>
                    <span className="delivery-time">30-45 min</span>
                  </div>
                  <p className="restaurant-address">{restaurant.address}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
        
        {filteredRestaurants.length === 0 && !loading && (
          <div className="no-results">
            <p>No restaurants found matching your search.</p>
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Order?</h2>
          <p>Join thousands of satisfied customers and get your favorite food delivered now!</p>
          <div className="cta-buttons">
            <Link to="/register" className="cta-btn primary">Order Now</Link>
            <Link to="/register" className="cta-btn secondary">Join as Partner</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;