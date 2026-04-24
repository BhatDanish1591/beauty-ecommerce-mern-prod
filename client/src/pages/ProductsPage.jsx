import React, { useEffect, useState } from 'react';
import api from '../api';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Star, 
  User, 
  ShoppingBag, 
  Heart, 
  Clock, 
  CreditCard, 
  ChevronRight,
  Sparkles,
  LayoutGrid,
  CheckCircle,
  MapPin,
  Settings,
  Lock,
  Mail,
  Camera,
  X,
  Truck,
  Package
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './ProductsPage.css';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [priceRange, setPriceRange] = useState(10000);
  const [activeTab, setActiveTab] = useState('collections');
  const [wishlist, setWishlist] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [rewardPoints, setRewardPoints] = useState(500);
  const [redeemSuccess, setRedeemSuccess] = useState(false);
  
  const [profileData, setProfileData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cat = params.get('category');
    const tab = params.get('tab');
    const search = params.get('search');

    if (cat) {
      setCategoryFilter(cat);
      setActiveTab('collections');
    }
    if (tab) {
      setActiveTab(tab);
    }
    if (search) {
      setSearchTerm(search);
      setActiveTab('collections');
    }

    if (userInfo) {
      setProfileData({ name: userInfo.name, email: userInfo.email, password: '', confirmPassword: '' });
      fetchOrders();
    }

    const savedWishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    setWishlist(savedWishlist);
  }, [location.search]);

  const fetchOrders = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const { data } = await api.get('/orders/myorders', config);
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders');
    }
  };

  useEffect(() => {
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
  }, []);

  const filteredProducts = products.filter(p => {
    const matchesSearch = !searchTerm || p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
    const matchesPrice = p.price <= priceRange;
    return matchesSearch && matchesCategory && matchesPrice;
  });

  const addToCartHandler = (product) => {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const existItem = cartItems.find(x => x.product === product._id);
    if (existItem) {
      const updatedItems = cartItems.map(x => x.product === product._id ? { ...x, qty: x.qty + 1 } : x);
      localStorage.setItem('cartItems', JSON.stringify(updatedItems));
    } else {
      cartItems.push({ product: product._id, name: product.name, image: product.image, price: product.price, countInStock: product.countInStock, qty: 1 });
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }
    window.dispatchEvent(new Event('storage'));
  };

  const toggleWishlistHandler = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    let newWishlist = [...wishlist];
    const isExist = newWishlist.find(x => x._id === product._id);
    if (isExist) {
      newWishlist = newWishlist.filter(x => x._id !== product._id);
    } else {
      newWishlist.push(product);
    }
    setWishlist(newWishlist);
    localStorage.setItem('wishlist', JSON.stringify(newWishlist));
  };

  const redeemPointsHandler = () => {
    if (rewardPoints >= 100) {
      setRewardPoints(prev => prev - 100);
      setRedeemSuccess(true);
      setTimeout(() => setRedeemSuccess(false), 3000);
    } else {
      alert('Not enough points to redeem');
    }
  };

  const profileUpdateHandler = async (e) => {
    e.preventDefault();
    if (profileData.password !== profileData.confirmPassword) { alert('Passwords do not match'); return; }
    try {
      const config = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userInfo.token}` } };
      const { data } = await api.put('/users/profile', profileData, config);
      localStorage.setItem('userInfo', JSON.stringify(data));
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch (error) {
      alert(error.response?.data?.message || 'Error updating profile');
    }
  };

  return (
    <div className={`user-dashboard-container ${!userInfo ? 'no-sidebar' : ''}`}>
      {/* Sidebar Navigation */}
      {userInfo && (
        <aside className="dashboard-sidebar glass">
          <div className="user-profile-summary">
            <div className="avatar-large">{userInfo?.name?.charAt(0)}</div>
            <h3>{userInfo?.name}</h3>
            <p>{userInfo?.email}</p>
          </div>
          <nav className="dashboard-nav">
            <button className={`nav-item ${activeTab === 'collections' ? 'active' : ''}`} onClick={() => setActiveTab('collections')}><LayoutGrid size={20} /> All Collections</button>
            <button className={`nav-item ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}><ShoppingBag size={20} /> My Orders</button>
            <button className={`nav-item ${activeTab === 'wishlist' ? 'active' : ''}`} onClick={() => setActiveTab('wishlist')}><Heart size={20} /> Wishlist</button>
            <button className={`nav-item ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}><Clock size={20} /> Recently Viewed</button>
            <button className={`nav-item ${activeTab === 'payments' ? 'active' : ''}`} onClick={() => setActiveTab('payments')}><CreditCard size={20} /> Payments</button>
            <div className="nav-divider"></div>
            <button className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}><Settings size={20} /> Profile Settings</button>
          </nav>
          <div className="sidebar-promo glass">
            <Sparkles size={24} color="var(--accent)" />
            <h4>Gold Member</h4>
            <p>You have {rewardPoints} points</p>
            <button className="redeem-btn" onClick={redeemPointsHandler}>
              {redeemSuccess ? 'Applied!' : 'Redeem Now'}
            </button>
          </div>
        </aside>
      )}

      {/* Main Dashboard Content */}
      <main className="dashboard-main">


        <AnimatePresence mode="wait">
          {activeTab === 'collections' && (
            <motion.div key="collections" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="dashboard-filters glass">
                <div className="search-wrap">
                  <Search size={18} />
                  <input type="text" placeholder="Search in collections..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
                <div className="filter-pills">
                  {['All', 'Makeup', 'Skincare', 'Fragrance', 'Tools'].map(cat => (
                    <button key={cat} className={categoryFilter === cat ? 'active pill' : 'pill'} onClick={() => setCategoryFilter(cat)}>{cat}</button>
                  ))}
                </div>
                <div className="price-slider">
                  <span>₹{priceRange}</span>
                  <input type="range" min="0" max="10000" value={priceRange} onChange={(e) => setPriceRange(e.target.value)} />
                </div>
              </div>

              <section className="dashboard-grid">
                <div className="grid-header"><h3>Recommended for You <span>({filteredProducts.length} items)</span></h3></div>
                <div className="products-grid">
                  {filteredProducts.map((product) => (
                    <motion.div key={product._id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="product-card glass">
                      <Link to={`/product/${product._id}`}>
                        <div className="product-image">
                          <img src={product.image} alt={product.name} />
                          <button className={`wishlist-btn ${wishlist.some(x => x._id === product._id) ? 'active' : ''}`} onClick={(e) => toggleWishlistHandler(e, product)}>
                            <Heart size={18} fill={wishlist.some(x => x._id === product._id) ? '#ff4d4d' : 'none'} color={wishlist.some(x => x._id === product._id) ? '#ff4d4d' : '#64748b'} />
                          </button>
                        </div>
                        <div className="product-info">
                          <span className="p-brand">{product.brand}</span>
                          <h3>{product.name}</h3>
                          <div className="p-rating"><Star size={14} fill="#d4af37" color="#d4af37" /><span>{product.rating}</span></div>
                          <div className="product-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                            <p className="p-price" style={{ margin: 0 }}>₹{product.price}</p>
                            <button className="btn-primary" style={{ padding: '8px 15px', fontSize: '0.8rem' }} onClick={(e) => { e.preventDefault(); addToCartHandler(product); }}>Add to Bag</button>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </section>
            </motion.div>
          )}

          {userInfo && (
            <>
              {activeTab === 'orders' && (
                <motion.div key="orders" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="admin-content-card glass" style={{ padding: '40px' }}>
                  <div className="card-header"><h2>My Recent Orders</h2></div>
                  {orders.length === 0 ? <div style={{ textAlign: 'center', padding: '40px' }}><ShoppingBag size={48} color="#64748b" style={{ marginBottom: '20px' }} /><h3>No orders yet</h3></div> : orders.map(order => (
                    <div key={order._id} className="order-item-pro glass" onClick={() => setSelectedOrder(order)} style={{ padding: '20px', marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                      <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}><div className="order-icon-wrap" style={{ background: 'var(--primary)', padding: '15px', borderRadius: '15px' }}><Package color="white" /></div><div><h4 style={{ marginBottom: '5px' }}>Order #{order._id.substring(18).toUpperCase()}</h4><p style={{ fontSize: '0.85rem', color: '#64748b' }}>Placed on {new Date(order.createdAt).toLocaleDateString()}</p></div></div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ fontWeight: 800, fontSize: '1.1rem' }}>₹{order.totalPrice}</p>
                        <span className="status-pill-pro" style={{ 
                          background: order.isDelivered ? '#dcfce7' : order.isShipped ? '#e0f2fe' : '#fef9c3', 
                          color: order.isDelivered ? '#166534' : order.isShipped ? '#0369a1' : '#854d0e', 
                          padding: '4px 12px', 
                          borderRadius: '20px', 
                          fontSize: '0.8rem', 
                          fontWeight: 700 
                        }}>
                          {order.isDelivered ? 'Delivered' : order.isShipped ? 'Shipped' : 'Processing'}
                        </span>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
              {activeTab === 'settings' && (
                <motion.div key="settings" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="admin-content-card glass" style={{ padding: '40px' }}>
                  <div className="card-header"><h2>Profile Settings</h2></div>
                  <div className="settings-container" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '40px' }}>
                    <div className="settings-left"><div className="profile-edit-avatar glass" style={{ width: '150px', height: '150px', borderRadius: '50%', margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem', color: 'var(--accent)', position: 'relative' }}>{userInfo?.name?.charAt(0)}<button className="avatar-edit-btn glass" style={{ position: 'absolute', bottom: '0', right: '0', padding: '10px', borderRadius: '50%' }}><Camera size={20} /></button></div></div>
                    <div className="settings-right"><form onSubmit={profileUpdateHandler} className="modal-form"><div className="form-group"><label><User size={16} /> Full Name</label><input type="text" value={profileData.name} onChange={(e) => setProfileData({...profileData, name: e.target.value})} /></div><div className="form-group"><label><Mail size={16} /> Email Address</label><input type="email" value={profileData.email} onChange={(e) => setProfileData({...profileData, email: e.target.value})} /></div><div className="nav-divider"></div><div className="form-group"><label><Lock size={16} /> New Password</label><input type="password" placeholder="Leave blank to keep same" value={profileData.password} onChange={(e) => setProfileData({...profileData, password: e.target.value})} /></div><div className="form-group"><label><Lock size={16} /> Confirm Password</label><input type="password" placeholder="Confirm new password" value={profileData.confirmPassword} onChange={(e) => setProfileData({...profileData, confirmPassword: e.target.value})} /></div><button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '20px' }}>Update Profile</button>{updateSuccess && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: '#10b981', textAlign: 'center', marginTop: '10px', fontWeight: 600 }}>Profile Updated Successfully!</motion.p>}</form></div>
                  </div>
                </motion.div>
              )}
            </>
          )}
        </AnimatePresence>
      </main>

      {/* Modal - only if logged in */}
      {userInfo && selectedOrder && (
        <div className="modal-overlay"><motion.div className="admin-modal glass" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}><div className="modal-header"><h2>Order Details</h2><button className="close-btn" onClick={() => setSelectedOrder(null)}><X size={24} /></button></div><div className="order-modal-content"><div className="order-status-banner glass" style={{ display: 'flex', gap: '20px', padding: '20px', borderRadius: '20px', marginBottom: '30px', background: 'rgba(255, 209, 220, 0.2)' }}><div className="status-icon-wrap" style={{ background: 'var(--primary)', padding: '15px', borderRadius: '15px' }}><Truck color="white" /></div><div><h4 style={{ color: 'var(--dark)' }}>Order #{selectedOrder._id.toUpperCase()}</h4><p style={{ fontWeight: 600, color: 'var(--accent)' }}>Status: {selectedOrder.isDelivered ? 'Delivered' : selectedOrder.isShipped ? 'Shipped' : 'Processing'}</p></div></div><div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '30px' }}><div className="detail-box"><h4 style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}><MapPin size={16} /> Delivery Address</h4><div className="glass" style={{ padding: '15px', borderRadius: '15px', fontSize: '0.9rem' }}><p><strong>{selectedOrder.shippingAddress.name}</strong></p><p>{selectedOrder.shippingAddress.address}</p></div></div><div className="detail-box"><h4 style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}><CreditCard size={16} /> Payment Info</h4><div className="glass" style={{ padding: '15px', borderRadius: '15px', fontSize: '0.9rem' }}><p>Amount: ₹{selectedOrder.totalPrice}</p></div></div></div></div></motion.div></div>
      )}
    </div>
  );
};

export default ProductsPage;
