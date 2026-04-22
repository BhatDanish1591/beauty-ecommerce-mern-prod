import React, { useState, useEffect } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Phone, User, CreditCard, ArrowLeft, CheckCircle } from 'lucide-react';
import './Auth.css'; // Reusing some auth styles for consistency

const CheckoutPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    pin: '',
    mobile: ''
  });
  const [isSuccess, setIsSuccess] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem('cartItems')) || [];
    if (items.length === 0) {
      navigate('/cart');
    }
    setCartItems(items);

    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo) {
      setFormData(prev => ({ ...prev, name: userInfo.name }));
    }
  }, [navigate]);

  const subtotal = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);
  const total = (subtotal * 1.08).toFixed(2);

  const submitHandler = async (e) => {
    e.preventDefault();
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    
    if (!userInfo) {
      navigate('/login');
      return;
    }

    const orderData = {
      orderItems: cartItems,
      shippingAddress: formData,
      paymentMethod: 'COD',
      totalPrice: total
    };

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`
        }
      };
      await api.post('/orders', orderData, config);
      setIsSuccess(true);
      localStorage.removeItem('cartItems');
      setTimeout(() => {
        navigate('/');
      }, 5000);
    } catch (error) {
      alert(error.response?.data?.message || 'Error placing order');
    }
  };

  if (isSuccess) {
    return (
      <div className="container" style={{ padding: '120px 0', textAlign: 'center' }}>
        <motion.div 
          className="glass" 
          style={{ padding: '60px', borderRadius: '30px', maxWidth: '600px', margin: '0 auto' }}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <CheckCircle size={80} color="#10b981" style={{ marginBottom: '20px' }} />
          <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>Order Placed!</h1>
          <p style={{ color: '#64748b', fontSize: '1.1rem', marginBottom: '30px' }}>
            Thank you for shopping with us. Your order has been received and is being processed.
          </p>
          <div className="order-details-summary glass" style={{ padding: '20px', textAlign: 'left', marginBottom: '30px' }}>
            <p><strong>Deliver to:</strong> {formData.name}</p>
            <p><strong>Address:</strong> {formData.address}, {formData.pin}</p>
            <p><strong>Mobile:</strong> {formData.mobile}</p>
            <p><strong>Amount:</strong> ₹{total}</p>
          </div>
          <button className="btn-primary" onClick={() => navigate('/')}>Continue Shopping</button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '120px 0' }}>
      <div className="cart-grid">
        <div className="checkout-form-container">
          <motion.div 
            className="glass" 
            style={{ padding: '40px', borderRadius: '30px' }}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h2 style={{ marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <MapPin size={24} color="var(--accent)" /> Shipping Details
            </h2>
            
            <form onSubmit={submitHandler} className="modal-form">
              <div className="form-group">
                <label><User size={16} /> Full Name</label>
                <input 
                  type="text" 
                  placeholder="Enter your name" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required 
                />
              </div>

              <div className="form-group">
                <label><MapPin size={16} /> Delivery Address</label>
                <textarea 
                  rows="3" 
                  placeholder="Enter full address" 
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  required
                ></textarea>
              </div>

              <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="form-group">
                  <label>Pincode / ZIP</label>
                  <input 
                    type="text" 
                    placeholder="6-digit PIN" 
                    value={formData.pin}
                    onChange={(e) => setFormData({...formData, pin: e.target.value})}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label><Phone size={16} /> Mobile Number</label>
                  <input 
                    type="text" 
                    placeholder="10-digit mobile" 
                    value={formData.mobile}
                    onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                    required 
                  />
                </div>
              </div>

              <div className="payment-method glass" style={{ marginTop: '20px', padding: '20px', border: '2px solid var(--primary)' }}>
                <h4 style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <CreditCard size={18} /> Payment Method
                </h4>
                <p style={{ fontSize: '0.9rem', fontWeight: '600' }}>Cash on Delivery (COD)</p>
              </div>

              <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '30px', padding: '18px' }}>
                Confirm Order (₹{total})
              </button>
            </form>
          </motion.div>
        </div>

        <div className="cart-summary glass" style={{ height: 'fit-content' }}>
          <h2>In Your Bag</h2>
          {cartItems.map(item => (
            <div key={item.product} className="summary-item" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
              <span style={{ fontSize: '0.9rem', color: '#64748b' }}>{item.qty}x {item.name}</span>
              <span style={{ fontWeight: '600' }}>₹{item.qty * item.price}</span>
            </div>
          ))}
          <div className="nav-divider" style={{ margin: '20px 0' }}></div>
          <div className="summary-total">
            <span>Payable Amount</span>
            <span>₹{total}</span>
          </div>
          <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '20px', textAlign: 'center' }}>
            Prices include GST and shipping charges.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
