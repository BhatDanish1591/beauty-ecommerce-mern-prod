import React, { useEffect, useState } from 'react';
import api from '../api';
import { 
  Package, 
  Users, 
  ShoppingBag, 
  DollarSign, 
  Plus, 
  Edit, 
  Trash2, 
  LayoutDashboard, 
  LogOut,
  Search,
  TrendingUp,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [activeFilter, setActiveFilter] = useState('All');
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalUsers: 0,
    totalOrders: 0,
    revenue: 0
  });

  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({
    name: '', price: 0, image: '', brand: '', category: 'Makeup', countInStock: 0, description: ''
  });
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      window.location.href = '/login';
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        const [prodRes, orderRes, userRes] = await Promise.all([
          api.get('/products'),
          api.get('/orders', config),
          api.get('/users', config)
        ]);

        if (Array.isArray(prodRes.data)) setProducts(prodRes.data);
        if (Array.isArray(orderRes.data)) setOrders(orderRes.data);
        if (Array.isArray(userRes.data)) setUsers(userRes.data);

        const totalRevenue = (orderRes.data || []).reduce((acc, order) => acc + (order.totalPrice || 0), 0);
        
        setStats({
          totalProducts: (prodRes.data || []).length,
          totalOrders: (orderRes.data || []).length,
          totalUsers: (userRes.data || []).length,
          revenue: totalRevenue
        });
      } catch (error) {
        console.error('Error fetching admin data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const openDeleteModal = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const confirmDeleteHandler = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await api.delete(`/products/${productToDelete._id}`, config);
      setProducts(products.filter(p => p._id !== productToDelete._id));
      setShowDeleteModal(false);
    } catch (error) {
      alert('Error deleting product');
    }
  };

  const openModal = (product = null) => {
    if (product) {
      setEditMode(true);
      setCurrentId(product._id);
      setFormData({ ...product });
    } else {
      setEditMode(false);
      setFormData({
        name: '', price: 0, image: '/images/product-01.jpg', brand: '', category: 'Makeup', countInStock: 10, description: ''
      });
    }
    setShowModal(true);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
    try {
      const productData = {
        ...formData,
        price: Number(formData.price),
        countInStock: Number(formData.countInStock)
      };
      if (editMode) {
        const { data } = await api.put(`/products/${currentId}`, productData, config);
        setProducts(products.map(p => p._id === currentId ? data : p));
      } else {
        const { data } = await api.post('/products', productData, config);
        setProducts([data, ...products]);
      }
      setShowModal(false);
    } catch (error) {
      alert('Error saving product: ' + (error.response?.data?.message || error.message));
    }
  };

  const filteredProducts = products.filter(p => 
    (p.name.toLowerCase().includes(searchTerm.toLowerCase())) && 
    (activeFilter === 'All' || p.category === activeFilter)
  );

  return (
    <div className="admin-container">
      <aside className="admin-sidebar glass">
        <div className="sidebar-brand" onClick={() => setActiveTab('overview')} style={{ cursor: 'pointer' }}>
          <LayoutDashboard size={24} color="var(--accent)" />
          <span>Admin<span>Panel</span></span>
        </div>
        <nav className="sidebar-nav">
          <button className={activeTab === 'overview' ? 'active' : ''} onClick={() => setActiveTab('overview')}><TrendingUp size={20} /> Overview</button>
          <button className={activeTab === 'products' ? 'active' : ''} onClick={() => setActiveTab('products')}><Package size={20} /> Products</button>
          <button className={activeTab === 'orders' ? 'active' : ''} onClick={() => setActiveTab('orders')}><ShoppingBag size={20} /> Orders</button>
          <button className={activeTab === 'customers' ? 'active' : ''} onClick={() => setActiveTab('customers')}><Users size={20} /> Customers</button>
        </nav>
        <div className="sidebar-footer">
          <button onClick={() => { localStorage.removeItem('userInfo'); window.location.href = '/'; }}><LogOut size={20} /> Logout</button>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <h1 className="serif-title" style={{ textTransform: 'capitalize' }}>{activeTab}</h1>
          <div className="header-actions">
            <div className="admin-search-top glass">
              <Search size={18} />
              <input type="text" placeholder={`Search ${activeTab}...`} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
          </div>
        </header>

        {activeTab === 'overview' && (
          <div className="overview-tab fade-in">
            <div className="stats-grid">
              <div className="stat-card glass">
                <div className="stat-icon-box" style={{ background: '#e0f2fe' }}><DollarSign size={20} color="#0ea5e9" /></div>
                <div className="stat-content">
                  <span className="stat-label">Total Revenue</span>
                  <p className="stat-value">₹{stats.revenue.toLocaleString()}</p>
                </div>
              </div>
              <div className="stat-card glass">
                <div className="stat-icon-box" style={{ background: '#fff7ed' }}><ShoppingBag size={20} color="#f97316" /></div>
                <div className="stat-content">
                  <span className="stat-label">Total Orders</span>
                  <p className="stat-value">{stats.totalOrders}</p>
                </div>
              </div>
              <div className="stat-card glass">
                <div className="stat-icon-box" style={{ background: '#f0fdf4' }}><Package size={20} color="#22c55e" /></div>
                <div className="stat-content">
                  <span className="stat-label">Total Products</span>
                  <p className="stat-value">{stats.totalProducts}</p>
                </div>
              </div>
              <div className="stat-card glass">
                <div className="stat-icon-box" style={{ background: '#f5f3ff' }}><Users size={20} color="#8b5cf6" /></div>
                <div className="stat-content">
                  <span className="stat-label">Active Users</span>
                  <p className="stat-value">{stats.totalUsers}</p>
                </div>
              </div>
            </div>

            <div className="recent-activity-row">
              <div className="activity-card glass">
                <div className="card-top">
                  <h3>Recent Orders</h3>
                  <button className="view-all-link" onClick={() => setActiveTab('orders')}>View All</button>
                </div>
                <div className="mini-table-container">
                  <table className="mini-table">
                    <thead><tr><th>ORDER ID</th><th>TOTAL</th><th>STATUS</th></tr></thead>
                    <tbody>
                      {orders.slice(0, 5).map(order => (
                        <tr key={order._id}>
                          <td>#{order._id.substring(0, 8)}</td>
                          <td>₹{order.totalPrice}</td>
                          <td><span className="status-pill-small">Paid</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {orders.length === 0 && <div className="empty-state">No orders yet</div>}
                </div>
              </div>

              <div className="activity-card glass">
                <div className="card-top">
                  <h3>Recent Customers</h3>
                  <button className="view-all-link" onClick={() => setActiveTab('customers')}>View All</button>
                </div>
                <div className="mini-table-container">
                  <table className="mini-table">
                    <thead><tr><th>NAME</th><th>ROLE</th></tr></thead>
                    <tbody>
                      {users.slice(0, 5).map(user => (
                        <tr key={user._id}>
                          <td>{user.name}</td>
                          <td><span className="role-label">{user.isAdmin ? 'Admin' : 'User'}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {users.length === 0 && <div className="empty-state">No users yet</div>}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="admin-content-card glass fade-in">
            <div className="card-header">
              <h2>Inventory</h2>
              <div className="header-right">
                <div className="table-filters">
                  {['All', 'Makeup', 'Skincare', 'Fragrance', 'Tools'].map(f => (
                    <button key={f} className={activeFilter === f ? 'filter-pill active' : 'filter-pill'} onClick={() => setActiveFilter(f)}>{f}</button>
                  ))}
                </div>
                <button className="btn-primary" onClick={() => openModal()}><Plus size={18} /> New Product</button>
              </div>
            </div>
            <div className="admin-table-wrapper">
              <table className="pro-table">
                <thead><tr><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Actions</th></tr></thead>
                <tbody>
                  {filteredProducts.map(product => (
                    <tr key={product._id}>
                      <td><div className="table-product-info"><img src={product.image} /><span>{product.name}</span></div></td>
                      <td><span className="cat-badge">{product.category}</span></td>
                      <td className="bold-text">₹{product.price}</td>
                      <td>{product.countInStock} units</td>
                      <td>
                        <div className="pro-actions">
                          <button className="p-edit-btn" onClick={() => openModal(product)}><Edit size={16} /></button>
                          <button className="p-delete-btn" onClick={() => openDeleteModal(product)}><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="admin-content-card glass fade-in">
            <h2>Recent Orders</h2>
            <div className="admin-table-wrapper">
              <table className="pro-table">
                <thead><tr><th>Order ID</th><th>Customer</th><th>Total</th><th>Date</th><th>Status</th></tr></thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order._id}>
                      <td className="bold-text">#{order._id.substring(0, 8)}</td>
                      <td>
                        <div className="order-user">
                          <strong>{order.user?.name || 'Guest'}</strong>
                          <span>{order.user?.email || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="bold-text">₹{order.totalPrice}</td>
                      <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td><span className="status-pill success">Paid</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'customers' && (
          <div className="admin-content-card glass fade-in">
            <h2>Registered Customers</h2>
            <div className="admin-table-wrapper">
              <table className="pro-table">
                <thead><tr><th>User ID</th><th>Name</th><th>Email</th><th>Role</th></tr></thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user._id}>
                      <td>{user._id}</td>
                      <td className="bold-text">{user.name}</td>
                      <td>{user.email}</td>
                      <td><span className={user.isAdmin ? 'cat-badge admin' : 'cat-badge'}>{user.isAdmin ? 'Admin' : 'Customer'}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <motion.div className="admin-modal glass" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
            <div className="modal-header">
              <h2>{editMode ? 'Edit Product' : 'Add New Product'}</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}><X size={24} /></button>
            </div>
            <form onSubmit={submitHandler} className="modal-form">
              <div className="form-row">
                <div className="form-group"><label>Product Name</label><input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required /></div>
                <div className="form-group"><label>Price (₹)</label><input type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} required /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Category</label>
                  <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                    {['Makeup', 'Skincare', 'Fragrance', 'Tools'].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group"><label>Stock Count</label><input type="number" value={formData.countInStock} onChange={e => setFormData({...formData, countInStock: e.target.value})} required /></div>
              </div>
              <div className="form-group"><label>Image URL</label><input type="text" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} required /></div>
              <div className="form-group"><label>Brand</label><input type="text" value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} required /></div>
              <div className="form-group"><label>Description</label><textarea rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required></textarea></div>
              <button type="submit" className="btn-primary modal-submit">{editMode ? 'Update Product' : 'Create Product'}</button>
            </form>
          </motion.div>
        </div>
      )}
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <motion.div className="delete-modal glass" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
            <div className="delete-icon-box"><Trash2 size={32} color="#ef4444" /></div>
            <h2>Confirm Delete</h2>
            <p>Are you sure you want to delete <strong>{productToDelete?.name}</strong>? This action cannot be undone.</p>
            <div className="delete-modal-actions">
              <button className="btn-secondary" onClick={() => setShowDeleteModal(false)}>Cancel</button>
              <button className="btn-danger" onClick={confirmDeleteHandler}>Delete Product</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
