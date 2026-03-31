import { useState, useMemo, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { useWallpapers } from '../hooks/useWallpapers';
import { LogOut, Settings, Image as ImageIcon, History, Heart } from 'lucide-react';
import WallpaperCard from '../components/WallpaperCard';
import './Profile.css';

export default function Profile() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('liked');
    const [likedWallpaperIds, setLikedWallpaperIds] = useState([]);

    // We need allWallpapers to hydrate history items and filter liked wallpapers
    const { wallpapers: allWallpapers } = useWallpapers();

    useEffect(() => {
        if (!user) return;
        const q = query(collection(db, 'wallpapers'), where('likedBy', 'array-contains', user.id));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const ids = snapshot.docs.map(doc => doc.id);
            setLikedWallpaperIds(ids);
        });
        return () => unsubscribe();
    }, [user]);

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const likedWallpapers = useMemo(() => {
        if (!allWallpapers || allWallpapers.length === 0) return [];
        return allWallpapers.filter(wp => {
            const encodedId = encodeURIComponent(wp.id);
            return likedWallpaperIds.includes(encodedId);
        });
    }, [allWallpapers, likedWallpaperIds]);

    const historyWallpapers = useMemo(() => {
        if (!user || !user.history) return [];
        // Map history IDs to full wallpaper objects
        return user.history.map(item => {
            const fullWp = allWallpapers.find(w => w.id === item.id);
            if (fullWp) return { ...fullWp, downloadDate: item.date };
            return null;
        }).filter(Boolean).reverse(); // Show most recent first
    }, [user?.history, allWallpapers]);

    const displayWallpapers = activeTab === 'liked' ? likedWallpapers : historyWallpapers;

    return (
        <div className="profile-page container">
            <div className="profile-header card">
                <div className="profile-info flex-center">
                    <div className="profile-avatar">{user.username.charAt(0).toUpperCase()}</div>
                    <div className="profile-details">
                        <h2>{user.username}</h2>
                        <p className="text-secondary">{user.email}</p>
                    </div>
                </div>
                <div className="profile-actions">
                    <button className="btn btn-outline" onClick={handleLogout}>
                        <LogOut size={18} /> Logout
                    </button>
                </div>
            </div>

            <div className="profile-content">
                <div className="profile-tabs">
                    <button
                        className={`tab-btn ${activeTab === 'liked' ? 'active' : ''}`}
                        onClick={() => setActiveTab('liked')}
                    >
                        <Heart size={18} /> Liked ({likedWallpapers.length})
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
                        onClick={() => setActiveTab('history')}
                    >
                        <History size={18} /> History ({historyWallpapers.length})
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
                        onClick={() => setActiveTab('settings')}
                    >
                        <Settings size={18} /> Settings
                    </button>
                </div>

                <div className="tab-content">
                    {(activeTab === 'liked' || activeTab === 'history') && (
                        <div>
                            {displayWallpapers.length === 0 ? (
                                <div className="text-center text-muted" style={{ padding: '3rem 0' }}>
                                    <p>No wallpapers found in {activeTab}.</p>
                                </div>
                            ) : (
                                <div className="wallpapers-grid">
                                    {displayWallpapers.map((wp, index) => (
                                        <div key={`${wp.id}-${index}`} data-type={wp.type}>
                                            <WallpaperCard
                                                id={wp.id}
                                                title={wp.title}
                                                imageUrl={wp.imageUrl}
                                                type={wp.type}
                                            />
                                            {activeTab === 'history' && (
                                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem', textAlign: 'center' }}>
                                                    Downloaded on {new Date(wp.downloadDate).toLocaleDateString()}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'settings' && (
                        <div className="settings-panel card">
                            <h3>Account Settings</h3>
                            <p className="text-secondary">Username: {user.username}</p>
                            <p className="text-secondary">Email: {user.email}</p>
                            <p className="text-secondary">Member since: {new Date(user.createdAt).toLocaleDateString()}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
