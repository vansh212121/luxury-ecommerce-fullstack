// src/components/common/Footer.jsx - Luxury Version
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-rich-black border-t border-gold/20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <h3 className="text-3xl font-display font-bold gold-gradient-text mb-4">
              ELYSIAN
            </h3>
            <p className="text-warm-white/70 leading-relaxed">
              Curating luxury experiences since 2024. Where timeless elegance meets contemporary design.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-medium text-warm-white mb-6 tracking-wider">
              EXPLORE
            </h4>
            <ul className="space-y-3">
              <li><Link to="/women" className="text-warm-white/70 hover:text-gold transition-colors">Women</Link></li>
              <li><Link to="/men" className="text-warm-white/70 hover:text-gold transition-colors">Men</Link></li>
              <li><Link to="/trending" className="text-warm-white/70 hover:text-gold transition-colors">Trending</Link></li>
              <li><Link to="/about" className="text-warm-white/70 hover:text-gold transition-colors">About</Link></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="text-lg font-medium text-warm-white mb-6 tracking-wider">
              SUPPORT
            </h4>
            <ul className="space-y-3">
              <li><Link to="/contact" className="text-warm-white/70 hover:text-gold transition-colors">Contact</Link></li>
              <li><Link to="/size-guide" className="text-warm-white/70 hover:text-gold transition-colors">Size Guide</Link></li>
              <li><Link to="/returns" className="text-warm-white/70 hover:text-gold transition-colors">Returns</Link></li>
              <li><Link to="/privacy" className="text-warm-white/70 hover:text-gold transition-colors">Privacy</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-medium text-warm-white mb-6 tracking-wider">
              CONNECT
            </h4>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-gold" />
                <span className="text-warm-white/70">concierge@elysian.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-gold" />
                <span className="text-warm-white/70">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-gold" />
                <span className="text-warm-white/70">New York • Paris • Milan</span>
              </div>
            </div>
            
            <div className="flex space-x-4 mt-6">
              <a href="#" className="text-warm-white/70 hover:text-gold transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-warm-white/70 hover:text-gold transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-warm-white/70 hover:text-gold transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gold/20 text-center">
          <p className="text-warm-white/50 text-sm">
            © 2024 ELYSIAN. All rights reserved. Crafted with precision and passion.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;