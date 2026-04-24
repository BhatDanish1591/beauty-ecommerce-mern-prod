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
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('products');
  const [activeFilter, setActiveFilter] = useState('All');
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalUsers: 154,
    totalOrders: 42,
    revenue: 125400
  });

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    image: '',
    brand: '',
    category: 'Makeup',
    countInStock: 0,
    description: ''
  });

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      window.location.href = '/login';
    }

    const fetchData = async () => {
      try {
        const { data } = await api.get('/products');
        if (Array.isArray(data)) {
          setProducts(data);
          setStats(prev => ({ ...prev, totalProducts: data.length }));
        }
      } catch (error) {
        console.error('Error fetching data');
      }
    };
    fetchData();
  }, []);

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const config = {
          headers: { Authorization: `Bearer ${userInfo.token}` }
        };
        await api.delete(`/products/${id}`, config);
        setProducts(products.filter(p => p._id !== id));
      } catch (error) {
        alert('Error deleting product');
      }
    }
  };

  const openModal = (product = null) => {
    if (product) {
      setEditMode(true);
      setCurrentId(product._id);
      setFormData({
        name: product.name,
        price: product.price,
        image: product.image,
        brand: product.brand,
        category: product.category,
        countInStock: product.countInStock,
        description: product.description
      });
    } else {
      setEditMode(false);
      setFormData({
        name: '',
        price: 0,
        image: '/images/product-01.jpg',
        brand: 'Rare Beauty',
        category: 'Makeup',
        countInStock: 10,
        description: ''
      });
    }
    setShowModal(true);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const config = {
      headers: { Authorization: `Bearer ${userInfo.token}` }
    };

    try {
      if (editMode) {
        const { data } = await api.put(`/products/${currentId}`, formData, config);
        setProducts(products.map(p => p._id === currentId ? data : p));
      } else {
        const { data } = await api.post('/products', formData, config);
        setProducts([data, ...products]);
      }
      setShowModal(false);
    } catch (error) {
      alert('Error saving product');
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilter === 'All' || p.category === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <aside className="admin-sidebar glass">
        <div className="sidebar-brand">
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

      {/* Main Content */}
      <main className="admin-main">
        <header className="admin-header">
          <div className="header-info">
            <h1 style={{ textTransform: 'capitalize' }}>{activeTab} Management</h1>
          </div>
          <div className="header-actions">
            <div className="admin-search glass">
              <Search size={18} />
              <input type="text" placeholder={`Search ${activeTab}...`} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            {activeTab === 'products' && (
              <button className="btn-primary add-product-btn" onClick={() => openModal()}>
                <Plus size={18} /> New Product
              </button>
            )}
          </div>
        </header>

        {activeTab === 'products' && (
          <section className="fade-in">
            <div className="admin-content-card glass">
              <div className="card-header">
                <h2>Product Inventory</h2>
                <div className="table-filters">
                  {['All', 'Makeup', 'Skincare', 'Fragrance', 'Tools'].map(f => (
                    <button key={f} className={activeFilter === f ? 'filter-pill active' : 'filter-pill'} onClick={() => setActiveFilter(f)}>{f}</button>
                  ))}
                </div>
              </div>

              <div className="admin-table-wrapper">
                <table className="pro-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence>
                      {filteredProducts.map((product) => (
                        <motion.tr key={product._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} layout>
                          <td>
                            <div className="table-product-info">
                              <img src={product.image} alt={product.name} />
                              <span>{product.name}</span>
                            </div>
                          </td>
                          <td><span className="cat-badge">{product.category}</span></td>
                          <td className="bold-text">₹{product.price}</td>
                          <td>
                            <div className="stock-status">
                              <div className="stock-bar"><div className="stock-fill" style={{ width: `${(product.countInStock/50)*100}%` }}></div></div>
                              <span>{product.countInStock} units</span>
                            </div>
                          </td>
                          <td>
                            <div className="pro-actions">
                              <button className="p-edit-btn" onClick={() => openModal(product)}><Edit size={16} /></button>
                              <button className="p-delete-btn" onClick={() => deleteHandler(product._id)}><Trash2 size={16} /></button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* Other tabs placeholders */}
        {activeTab !== 'products' && (
           <section className="fade-in">
             <div className="admin-content-card glass" style={{ padding: '60px', textAlign: 'center' }}>
                <TrendingUp size={48} color="var(--accent)" style={{ marginBottom: '20px' }} />
                <h2>{activeTab} Analytics</h2>
                <p>Detailed management for {activeTab} will be available soon.</p>
             </div>
           </section>
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
                <div className="form-group">
                  <label>Product Name</label>
                  <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Price (₹)</label>
                  <input type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Category</label>
                  <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                    {['Makeup', 'Skincare', 'Fragrance', 'Tools'].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Stock Count</label>
                  <input type="number" value={formData.countInStock} onChange={(e) => setFormData({...formData, countInStock: e.target.value})} required />
                </div>
              </div>
              <div className="form-group">
                <label>Image URL (e.g. /images/product-01.jpg)</label>
                <input type="text" value={formData.image} onChange={(e) => setFormData({...formData, image: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Brand</label>
                <input type="text" value={formData.brand} onChange={(e) => setFormData({...formData, brand: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea rows="3" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} required></textarea>
              </div>
              <button type="submit" className="btn-primary modal-submit">
                {editMode ? 'Update Product' : 'Create Product'}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
