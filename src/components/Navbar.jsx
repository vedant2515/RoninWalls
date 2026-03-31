import { Link } from 'react-router-dom';
import { User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
    const { user } = useAuth();

    return (
        <nav className="navbar">
            <div className="container flex-between navbar-inner">
                <Link to="/" className="logo">
                    <img src="/logo.png" alt="RoninWalls Logo" className="navbar-logo-img" />
                    <span className="text-gradient">RoninWalls</span>
                </Link>

                <div className="nav-actions">
                    {user ? (
                        <Link to="/profile" className="btn btn-outline profile-btn">
                            <User size={18} />
                            <span className="hidden-mobile">{user.username}</span>
                        </Link>
                    ) : (
                        <Link to="/login" className="btn btn-primary">Login</Link>
                    )}
                </div>
            </div>
        </nav>
    );
}
