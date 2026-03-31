import { Link } from 'react-router-dom';
import { Mail, Globe } from 'lucide-react';
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
                    <div className="link-group">
                        <h3>Legal</h3>
                        <Link to="/terms">Terms of Service</Link>
                        <Link to="/privacy">Privacy Policy</Link>
                    </div>
                </div>

                <div className="footer-social">
                    <h3>Contact Us</h3>
                    <a
                        href="https://mail.google.com/mail/?view=cm&to=roninwallss@gmail.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="contact-email"
                    >
                        <Mail size={18} />
                        <span>roninwallss@gmail.com</span>
                    </a>
                    
                    <h3>Follow Us</h3>
                    <div className="social-icons">
                        <a
                            href="https://www.instagram.com/ronin_wallss"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="social-icon"
                            title="Follow us on Instagram"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                                <circle cx="12" cy="12" r="4"/>
                                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
                            </svg>
                        </a>
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
