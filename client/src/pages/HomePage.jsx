import React, { useEffect, useState, useRef } from 'react';
import api from '../api';
import { motion } from 'framer-motion';
import { ArrowRight, Star, ShoppingBag, Quote, ChevronLeft, ChevronRight, Truck, ShieldCheck, Clock, Camera } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const sliderRef = useRef(null);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo) {
      navigate('/products');
    }

    const fetchProducts = async () => {
      try {
        const { data } = await api.get('/products');
        if (Array.isArray(data)) {
          setProducts(data);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, [navigate]);

  const addToCartHandler = (product) => {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const existItem = cartItems.find(x => x.product === product._id);
    if (existItem) {
      const updatedItems = cartItems.map(x => x.product === product._id ? { ...x, qty: x.qty + 1 } : x);
      localStorage.setItem('cartItems', JSON.stringify(updatedItems));
    } else {
      cartItems.push({
        product: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        countInStock: product.countInStock,
        qty: 1
      });
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }
    window.dispatchEvent(new Event('storage'));
    navigate('/cart');
  };

  const scrollSlider = (direction) => {
    if (sliderRef.current) {
      const { scrollLeft, clientWidth } = sliderRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      sliderRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  const categories = [
    { name: 'Makeup', image: '/images/lipstick.png', count: '25+ Items' },
    { name: 'Skincare', image: '/images/serum.png', count: '12+ Items' },
    { name: 'Fragrance', image: '/images/perfume.png', count: '5+ Items' },
    { name: 'Tools', image: '/images/highlighter.png', count: '8+ Items' }
  ];

  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-overlay"></div>
        <div className="container hero-content">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="hero-title">The Best of <span>Global</span> Beauty</h1>
            <p className="hero-subtitle">Shop the most loved products from M.A.C, Estée Lauder, Forest Essentials, and more. Authentic beauty delivered to your doorstep.</p>
            <Link to="/products"><button className="btn-primary">Shop Collection <ArrowRight size={18} /></button></Link>
          </motion.div>
        </div>
      </section>



      {/* Category Section */}
      <section className="categories container">
        <div className="section-header">
          <h2 className="section-title">Shop by Category</h2>
          <p>Explore our specialized collections for every beauty routine</p>
        </div>
        <div className="category-grid">
          {categories.map((cat, i) => (
            <Link to={`/products?category=${cat.name}`} key={cat.name}>
              <motion.div 
                whileHover={{ y: -10 }}
                className="category-card-enhanced"
                style={{ backgroundImage: `url(${cat.image})` }}
              >
                <div className="category-overlay">
                  <div className="category-info">
                    <h3>{cat.name}</h3>
                    <p>{cat.count}</p>
                    <span className="explore-btn">Explore →</span>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>

      {/* Luxury Best Sellers Infinite Marquee */}
      <section className="best-sellers-marquee-section">
        <div className="section-header container">
          <h2 className="section-title">Best Sellers</h2>
          <p>The most coveted beauty essentials of the season</p>
        </div>
        
        <div className="marquee-wrapper">
          <div className="marquee-track">
            {[...products.slice(0, 8), ...products.slice(0, 8)].map((product, index) => (
              <div key={`${product._id}-${index}`} className="marquee-item">
                <div className="premium-card">
                  <div className="card-image-wrapper">
                    <div className="best-seller-ribbon">Top Seller</div>
                    <Link to={`/product/${product._id}`}>
                      <img src={product.image} alt={product.name} />
                    </Link>
                    <button className="quick-add" onClick={() => addToCartHandler(product)}>
                      <ShoppingBag size={18} />
                    </button>
                  </div>
                  <div className="card-details">
                    <span className="brand-name">{product.brand}</span>
                    <Link to={`/product/${product._id}`}>
                      <h3>{product.name}</h3>
                    </Link>
                    <div className="price-rating-row">
                      <span className="item-price">₹{product.price}</span>
                      <div className="item-rating">
                        <Star size={12} fill="var(--accent)" color="var(--accent)" />
                        <span>{product.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="features-section container">
        <div className="feature-grid">
          <div className="feature-item glass">
            <div className="feat-icon"><Truck size={32} /></div>
            <h3>Free Shipping</h3>
            <p>On all orders above ₹999</p>
          </div>
          <div className="feature-item glass">
            <div className="feat-icon"><ShieldCheck size={32} /></div>
            <h3>100% Authentic</h3>
            <p>Sourced directly from brands</p>
          </div>
          <div className="feature-item glass">
            <div className="feat-icon"><Clock size={32} /></div>
            <h3>24/7 Support</h3>
            <p>Dedicated beauty assistants</p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">What Our Clients Say</h2>
            <p>Real stories from real users</p>
          </div>
          <div className="testimonial-grid">
            <motion.div className="testimonial-card glass" whileHover={{ scale: 1.02 }}>
              <Quote size={40} color="var(--primary)" opacity={0.3} className="quote-icon" />
              <p>"The Radiance Serum is a game changer! My skin hasn't looked this good in years. It's lightweight and effective."</p>
              <div className="user-profile">
                <img src="/images/user1.png" alt="Sarah J." />
                <div>
                  <h4>Sarah J.</h4>
                  <span>Verified Buyer</span>
                </div>
              </div>
            </motion.div>
            <motion.div className="testimonial-card glass" whileHover={{ scale: 1.02 }}>
              <Quote size={40} color="var(--primary)" opacity={0.3} className="quote-icon" />
              <p>"I've tried many luxury lipsticks, but the Velvet Matte formula is unparalleled. It stays all day without drying."</p>
              <div className="user-profile">
                <img src="/images/user2.png" alt="Elena R." />
                <div>
                  <h4>Elena R.</h4>
                  <span>Beauty Influencer</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Beauty Tips Section */}
      <section className="beauty-tips container">
        <div className="section-header">
          <h2 className="section-title">Beauty Advice</h2>
          <p>Expert tips for your daily beauty ritual</p>
        </div>
        <div className="tips-grid">
          {[
            { tag: 'Skincare', title: 'How to Layer Your Serums Like a Pro', img: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=800' },
            { tag: 'Makeup', title: 'The Secret to a Flawless Base', img: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=800' },
            { tag: 'Fragrance', title: 'Finding Your Signature Scent', img: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=800' }
          ].map((tip, i) => (
            <motion.div key={i} className="tip-card glass" whileHover={{ y: -10 }}>
              <div className="tip-img-wrap"><img src={tip.img} alt={tip.title} /></div>
              <div className="tip-content">
                <span className="tip-tag">{tip.tag}</span>
                <h3>{tip.title}</h3>
                <p>Maximize the benefits of your beauty routine with expert guidance from our specialists.</p>
                <button className="read-more">Read More <ArrowRight size={14}/></button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Promotional Banner */}
      <section className="promo-banner container">
        <div className="promo-content glass">
          <h2>Get 15% Off Your First Order</h2>
          <p>Join our beauty circle and stay updated with the latest trends and exclusive offers.</p>
          <div className="promo-form">
            <input type="email" placeholder="Enter your email" />
            <button className="btn-primary">Subscribe</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
