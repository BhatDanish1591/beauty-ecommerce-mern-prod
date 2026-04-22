import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Minus, Plus, ShoppingBag, ArrowLeft } from 'lucide-react';
import './CartPage.css';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem('cartItems')) || [];
    setCartItems(items);
  }, []);

  const removeFromCartHandler = (id) => {
    const newItems = cartItems.filter(x => x.product !== id);
    setCartItems(newItems);
    localStorage.setItem('cartItems', JSON.stringify(newItems));
  };

  const updateQtyHandler = (id, qty) => {
    const newItems = cartItems.map(x => x.product === id ? { ...x, qty } : x);
    setCartItems(newItems);
    localStorage.setItem('cartItems', JSON.stringify(newItems));
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2);
  const tax = (subtotal * 0.08).toFixed(2);
  const total = (parseFloat(subtotal) + parseFloat(tax)).toFixed(2);

  return (
    <div className="cart-page container">
      <h1 className="cart-title">Your Shopping Bag</h1>
      
      {cartItems.length === 0 ? (
        <div className="empty-cart glass">
          <ShoppingBag size={60} />
          <h2>Your bag is empty</h2>
          <p>Browse our collection and find something you love!</p>
          <Link to="/" className="btn-primary">Go Shopping</Link>
        </div>
      ) : (
        <div className="cart-grid">
          <div className="cart-items-list">
            {cartItems.map(item => (
              <div key={item.product} className="cart-item glass">
                <img src={item.image} alt={item.name} />
                <div className="item-details">
                  <Link to={`/product/${item.product}`}><h3>{item.name}</h3></Link>
                  <p className="item-price">₹{item.price}</p>
                </div>
                <div className="item-qty">
                  <button onClick={() => updateQtyHandler(item.product, Math.max(1, item.qty - 1))}><Minus size={14} /></button>
                  <span>{item.qty}</span>
                  <button onClick={() => updateQtyHandler(item.product, item.qty + 1)}><Plus size={14} /></button>
                </div>
                <button className="remove-btn" onClick={() => removeFromCartHandler(item.product)}><Trash2 size={18} /></button>
              </div>
            ))}
            <Link to="/" className="back-link"><ArrowLeft size={16} /> Continue Shopping</Link>
          </div>

          <div className="cart-summary glass">
            <h2>Order Summary</h2>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>
            <div className="summary-row">
              <span>Estimated Tax (8%)</span>
              <span>₹{tax}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span className="free">FREE</span>
            </div>
            <div className="summary-total">
              <span>Total</span>
              <span>₹{total}</span>
            </div>
            <button className="btn-primary checkout-btn" onClick={() => navigate('/checkout')}>
              Proceed to Checkout
            </button>
            <p className="secure-text">Secure Checkout Guaranteed</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
