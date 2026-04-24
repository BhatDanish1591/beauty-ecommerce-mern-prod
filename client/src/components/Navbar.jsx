import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Search, Menu, LogOut, Settings, Package, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './Navbar.css';

const Navbar = () => {
  const [cartCount, setCartCount] = useState(0);
  const [userInfo, setUserInfo] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [keyword, setKeyword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const updateCart = () => {
      try {
        const items = JSON.parse(localStorage.getItem('cartItems')) || [];
        const count = items.reduce((acc, item) => acc + Number(item.qty), 0);
        setCartCount(count);
      } catch (err) {
        setCartCount(0);
      }
    };

    updateCart();
    window.addEventListener('storage', updateCart);
    const interval = setInterval(updateCart, 1000);

    let user = null;
    try {
      const storedUser = localStorage.getItem('userInfo');
      if (storedUser) {
        user = JSON.parse(storedUser);
      }
    } catch (e) {
      console.error('Error parsing userInfo');
    }
    setUserInfo(user);

    return () => {
      window.removeEventListener('storage', updateCart);
      clearInterval(interval);
    };
  }, []);

  const logoutHandler = () => {
    localStorage.removeItem('userInfo');
    setUserInfo(null);
    setShowDropdown(false);
    navigate('/login');
  };

  const handleHomeClick = (e) => {
    if (window.location.pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const searchHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/products?search=${keyword}`);
    } else {
      navigate('/products');
    }
  };

  return (
    <nav className="navbar glass">
      <div className="container nav-content">
        <Link to="/" className="logo" onClick={handleHomeClick}>
          <h1>AURORA<span>LUXE</span></h1>
        </Link>

        <div className="nav-links">
          <Link to="/" onClick={handleHomeClick}>Home</Link>
          <Link to="/products">Collections</Link>
          {userInfo?.isAdmin && <Link to="/admin">Admin</Link>}
        </div>

        <div className="nav-actions">
          <form className="search-bar" onSubmit={searchHandler}>
            <Search size={20} onClick={searchHandler} style={{ cursor: 'pointer' }} />
            <input 
              type="text" 
              placeholder="Search products..." 
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </form>
          <Link to="/cart" className="nav-icon">
            <ShoppingCart size={24} />
            {cartCount > 0 && <span className="badge">{cartCount}</span>}
          </Link>
          
          {userInfo ? (
            <div className="user-dropdown-container">
              <button 
                className="user-profile-trigger" 
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <div className="avatar-small">
                  {userInfo?.name?.charAt(0) || 'U'}
                </div>
                <span>{userInfo?.name?.split(' ')[0] || 'User'}</span>
                <ChevronDown size={14} className={showDropdown ? 'rotate' : ''} />
              </button>

              <AnimatePresence>
                {showDropdown && (
                  <motion.div 
                    className="user-dropdown-menu glass"
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  >
                    <div className="dropdown-user-info">
                      <p className="d-name">{userInfo.name}</p>
                      <div className="c-item"><Mail size={14} /> <span>hello@luminastudio.com</span></div>
                    </div>
                    <div className="dropdown-divider"></div>
                    <Link to="/products" onClick={() => setShowDropdown(false)} className="dropdown-item">
                      <User size={16} /> My Dashboard
                    </Link>
                    <Link to="/products?tab=orders" onClick={() => setShowDropdown(false)} className="dropdown-item">
                      <Package size={16} /> My Orders
                    </Link>
                    <Link to="/products?tab=settings" onClick={() => setShowDropdown(false)} className="dropdown-item">
                      <Settings size={16} /> Settings
                    </Link>
                    <div className="dropdown-divider"></div>
                    <button onClick={logoutHandler} className="dropdown-item logout">
                      <LogOut size={16} /> Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link to="/login" className="nav-icon">
              <User size={24} />
            </Link>
          )}
          
          <div className="menu-mobile">
            <Menu size={24} />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
