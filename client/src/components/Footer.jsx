import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone, Send, Sparkles, ShieldCheck, Zap, Heart } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="luxury-footer">
      {/* Top Value Bar */}
      <div className="footer-perks">
        <div className="container perks-grid">
          <div className="perk-item">
            <ShieldCheck size={20} />
            <span>Authentic Luxury</span>
          </div>
          <div className="perk-item">
            <Zap size={20} />
            <span>Express Delivery</span>
          </div>
          <div className="perk-item">
            <Sparkles size={20} />
            <span>Exclusive Rewards</span>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="footer-main">
        <div className="container main-grid">
          <div className="brand-column">
            <div className="footer-logo-premium">
              <h1>BEAUTY<span>STORE</span></h1>
            </div>
            <p className="brand-bio">
              Empowering your beauty ritual with the world's most sophisticated collections.
            </p>
            <div className="contact-mini">
              <div className="c-item"><MapPin size={14} /> <span>Mumbai, India</span></div>
              <div className="c-item"><Mail size={14} /> <span>hello@beautystore.com</span></div>
            </div>
          </div>

          <div className="links-column">
            <h4>Collections</h4>
            <Link to="/products?category=Makeup">Haute Makeup</Link>
            <Link to="/products?category=Skincare">Elite Skincare</Link>
            <Link to="/products?category=Fragrance">Perfume Atelier</Link>
          </div>

          <div className="links-column">
            <h4>Concierge</h4>
            <a href="#">Account</a>
            <a href="#">Track Order</a>
            <a href="#">Help Center</a>
          </div>

          <div className="newsletter-column">
            <h4>Newsletter</h4>
            <p>Subscribe for private event access.</p>
            <form className="p-newsletter-form">
              <input type="email" placeholder="Email" />
              <button type="submit"><Send size={16} /></button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="footer-bottom-premium">
        <div className="container bottom-flex">
          <div className="copyright">
            <p>&copy; 2026 BEAUTYSTORE GLOBAL.</p>
          </div>
          <div className="danish-badge">
            <span className="developed-by">Developed by</span>
            <span className="danish-name">Danish Bhat</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
