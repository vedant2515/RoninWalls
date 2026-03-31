import { useState, useMemo, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Download, Heart, Share2, MessageSquare, Info, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWallpapers } from '../hooks/useWallpapers';
import { useLikes } from '../hooks/useLikes';
import WallpaperCard from '../components/WallpaperCard';
import CommentsSection from '../components/CommentsSection';
import './WallpaperDetail.css';

export default function WallpaperDetail() {
    const { id } = useParams(); // URL params are auto-decoded
    const { user, updateUser } = useAuth();
    const navigate = useNavigate();

    const { wallpapers: allWallpapers, loading, error } = useWallpapers();
    const { likeCount, isLiked, toggleLike } = useLikes(id);

    const wallpaper = useMemo(() => {
        return allWallpapers.find(w => w.id === id);
    }, [allWallpapers, id]);

    const similarWallpapers = useMemo(() => {
        if (!wallpaper) return [];
        return allWallpapers
            .filter(w => w.category === wallpaper.category && w.id !== wallpaper.id)
            .slice(0, 4);
    }, [allWallpapers, wallpaper]);

    const [downloading, setDownloading] = useState(false);

    const handleAuthRequiredAction = (actionName) => {
        if (!user) {
            alert(`Please log in to ${actionName} this wallpaper.`);
            navigate('/login');
            return false;
        }
        return true;
    };

    const handleDownload = async () => {
        if (!wallpaper || downloading) return;
        try {
            setDownloading(true);
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/download-url?key=${encodeURIComponent(wallpaper.id)}`);
            if (!res.ok) throw new Error("Backend download route failed");
            const data = await res.json();

            if (!data.success) throw new Error("Failed to sign download link");

            const link = document.createElement('a');
            link.href = data.downloadUrl;
            link.setAttribute('download', '');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Optionally record download in user history
            if (user) {
                const history = [...(user.history || []), { id: wallpaper.id, date: new Date().toISOString() }];
                await updateUser({ history });
            }
        } catch (error) {
            console.error('Download failed:', error);
            alert('Failed to trigger download from AWS S3.');
        } finally {
            setDownloading(false);
        }
    };

    if (loading) {
        return (
            <div className="container" style={{ paddingTop: '4rem' }}>
                <div className="skeleton" style={{ height: '70vh', borderRadius: 'var(--radius-2xl)' }}></div>
            </div>
        );
    }

    if (error || !wallpaper) {
        return (
            <div className="container" style={{ paddingTop: '8rem', textAlign: 'center', height: '60vh' }}>
                <AlertTriangle size={48} className="text-secondary mb-4" />
                <h2 className="text-secondary">Wallpaper not found or failed to load.</h2>
                <p className="text-muted">Ensure the AWS Backend is running.</p>
                <Link to="/" className="btn btn-primary mt-4">Go Home</Link>
            </div>
        );
    }

    return (
        <div className="wallpaper-detail-page container">
            <div className="detail-grid">
                <div className="main-preview">
                    <div className="image-container">
                        <img src={wallpaper.imageUrl} alt={wallpaper.title} className="full-preview-img" />
                    </div>
                </div>

                <div className="sidebar-info">
                    <h1 className="wallpaper-title">{wallpaper.title}</h1>
                    <div className="uploader-info">
                        <div className="avatar">A</div>
                        <span>AWS S3 User</span>
                    </div>

                    <div className="action-buttons" style={{ flexDirection: 'column', gap: '1rem' }}>
                        <button className="btn btn-primary" onClick={handleDownload} disabled={downloading}>
                            <Download size={20} /> {downloading ? 'Processing...' : 'Download Full Resolution'}
                        </button>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button
                                className={`btn flex-1 ${isLiked ? 'btn-primary' : 'btn-outline'}`}
                                onClick={toggleLike}
                                style={isLiked ? { backgroundColor: 'var(--accent)', color: 'white', borderColor: 'var(--accent)' } : undefined}
                            >
                                <Heart size={18} fill={isLiked ? "currentColor" : "none"} /> 
                                {isLiked ? 'Liked' : 'Like'} {likeCount > 0 && `(${likeCount})`}
                            </button>
                            <button className="btn btn-outline flex-1"><Share2 size={18} /> Share</button>
                        </div>
                    </div>

                    <div className="info-card">
                        <h3 className="card-heading"><Info size={18} /> Details</h3>
                        <ul className="info-list">
                            <li><span>Category:</span> <strong>{wallpaper.category}</strong></li>
                            <li><span>Type:</span> <strong>{wallpaper.type}</strong></li>
                            <li><span>Date:</span> <strong>{new Date(wallpaper.lastModified).toLocaleDateString()}</strong></li>
                        </ul>
                    </div>

                    <CommentsSection wallpaperId={id} />
                </div>
            </div>

            {similarWallpapers.length > 0 && (
                <div className="similar-section">
                    <h2>Similar Wallpapers</h2>
                    <div className="similar-grid flex-between">
                        {similarWallpapers.map(wp => (
                            <div key={wp.id} style={{ width: '100%' }} data-type={wp.type}>
                                <WallpaperCard id={encodeURIComponent(wp.id)} title={wp.title} imageUrl={wp.imageUrl} type={wp.type} />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
