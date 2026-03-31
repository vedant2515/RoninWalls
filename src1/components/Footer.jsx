import { Link } from 'react-router-dom';
import { Mail, MessageCircle, Globe } from 'lucide-react';
import './Footer.css';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="container footer-content">
                <div className="footer-brand">
                    <Link to="/" className="logo text-gradient">RoninWalls</Link>
                    <p className="footer-desc">
                        Premium AI-generated and curated wallpapers for Desktop and Mobile.
                        Elevate your screens with Next-Gen aesthetics.
                    </p>
                </div>

                <div className="footer-links">
                    <div className="link-group">
                        <h3>Categories</h3>
                        <Link to="/category/anime">Anime</Link>
                        <Link to="/category/cars">Cars</Link>
                        <Link to="/category/gaming">Gaming</Link>
                        <Link to="/category/amoled">AMOLED</Link>
                    </div>
                    <div className="link-group">
                        <h3>Platform</h3>
                        <Link to="/upload">Upload</Link>
                        <Link to="/profile">Profile</Link>
                        <Link to="/">Trending</Link>
                    </div>
                </div>

                <div className="footer-social">
                    <h3>Contact Us</h3>
                    <a href="mailto:roninwallss@gmail.com" className="contact-email flex-center" style={{ justifyContent: 'flex-start', marginBottom: '1rem', color: 'var(--text-secondary)', textDecoration: 'none' }}>
                        <Mail size={18} style={{ marginRight: '8px' }} />
                        roninwallss@gmail.com
                    </a>
                    
                    <h3>Follow Us</h3>
                    <div className="social-icons">
                        <a href="#" className="social-icon"><MessageCircle size={20} /></a>
                        <a href="#" className="social-icon"><Globe size={20} /></a>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} RoninWalls. All rights reserved.</p>
            </div>
        </footer>
    );
}
