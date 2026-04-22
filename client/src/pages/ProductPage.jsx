import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { Star, Minus, Plus, ShoppingBag, ShieldCheck, Truck } from 'lucide-react';
import { motion } from 'framer-motion';
import './ProductPage.css';

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      const { data } = await api.get(`/products/${id}`);
      setProduct(data);
    };
    fetchProduct();
  }, [id]);

  const addToCartHandler = () => {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const existItem = cartItems.find(x => x.product === product._id);

    if (existItem) {
      const updatedItems = cartItems.map(x => x.product === product._id ? { ...x, qty } : x);
      localStorage.setItem('cartItems', JSON.stringify(updatedItems));
    } else {
      cartItems.push({
        product: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        countInStock: product.countInStock,
        qty
      });
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }
    navigate('/cart');
  };

  if (!product) return <div className="container">Loading...</div>;

  return (
    <div className="product-page container">
      <div className="product-details-grid">
        <motion.div 
          className="product-main-image glass"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <img 
            src={product.image} 
            alt={product.name} 
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/images/hero.png';
            }}
          />
        </motion.div>

        <div className="product-info-panel">
          <p className="brand-name">{product.brand}</p>
          <h1 className="product-name">{product.name}</h1>
          
          <div className="rating-row">
            <div className="stars">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} fill={i < Math.floor(product.rating) ? "#d4af37" : "none"} color="#d4af37" />
              ))}
            </div>
            <span>({product.numReviews} Reviews)</span>
          </div>

          <h2 className="product-price">₹{product.price}</h2>

          <p className="product-desc">{product.description}</p>

          <div className="qty-selector">
            <button onClick={() => setQty(q => Math.max(1, q - 1))}><Minus size={18} /></button>
            <span>{qty}</span>
            <button onClick={() => setQty(q => Math.min(product.countInStock, q + 1))}><Plus size={18} /></button>
          </div>

          <button 
            className="btn-primary buy-btn" 
            disabled={product.countInStock === 0}
            onClick={addToCartHandler}
          >
            {product.countInStock > 0 ? 'Add to Cart' : 'Out of Stock'} <ShoppingBag size={20} />
          </button>

          <div className="product-perks">
            <div className="perk">
              <Truck size={20} />
              <div>
                <h4>Free Shipping</h4>
                <p>On orders over ₹1000</p>
              </div>
            </div>
            <div className="perk">
              <ShieldCheck size={20} />
              <div>
                <h4>Certified Quality</h4>
                <p>100% Authentic products</p>
              </div>
            </div>
          </div>

          <div className="product-tabs">
            <h3>Ingredients</h3>
            <p>{product.ingredients}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
