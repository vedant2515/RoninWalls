import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Download } from 'lucide-react';
import { useLikes } from '../hooks/useLikes';
import { useAuth } from '../context/AuthContext';
import './WallpaperCard.css';

export default function WallpaperCard({ id, imageUrl, title, type }) {
    const { likeCount, isLiked, toggleLike } = useLikes(id);
    const [downloading, setDownloading] = useState(false);
    const { user, updateUser } = useAuth();

    const handleDownload = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (downloading) return;

        try {
            setDownloading(true);
            const decodedId = decodeURIComponent(id);
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/download-url?key=${encodeURIComponent(decodedId)}`);
            if (!res.ok) throw new Error("Backend download route failed");
            const data = await res.json();

            if (!data.success) throw new Error("Failed to sign download link");

            const link = document.createElement('a');
            link.href = data.downloadUrl;
            link.setAttribute('download', '');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            if (user) {
                const history = [...(user.history || []), { id: decodedId, date: new Date().toISOString() }];
                await updateUser({ history });
            }
        } catch (error) {
            console.error('Download failed:', error);
            alert('Failed to trigger download from AWS S3.');
        } finally {
            setDownloading(false);
        }
    };
    // type is 'Desktop' or 'Mobile'
    return (
        <div className="card wallpaper-card" data-type={type}>
            <Link to={`/wallpaper/${id}`} className="wallpaper-link">
                <div className="wallpaper-image-wrapper">
                    <img src={imageUrl} alt={title} loading="lazy" className="wallpaper-image" />
                    <div className="wallpaper-type-badge">{type}</div>
                </div>
            </Link>

            <div className="wallpaper-info flex-between">
                <div className="wallpaper-meta">
                    <h4 className="truncate">{title}</h4>
                </div>
                <div className="wallpaper-actions">
                    <button 
                        className={`icon-btn tooltip-container ${isLiked ? 'liked' : ''}`} 
                        aria-label="Like"
                        onClick={toggleLike}
                        style={isLiked ? { color: '#ec4899', background: 'rgba(236, 72, 153, 0.15)' } : {}}
                    >
                        <Heart size={18} fill={isLiked ? "#ec4899" : "none"} />
                        {likeCount > 0 && <span style={{ marginLeft: '6px', fontSize: '0.85rem', fontWeight: 'bold' }}>{likeCount}</span>}
                    </button>
                    <button 
                        className="icon-btn tooltip-container" 
                        aria-label="Download"
                        onClick={handleDownload}
                        disabled={downloading}
                        style={{ opacity: downloading ? 0.7 : 1 }}
                    >
                        <Download size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}
