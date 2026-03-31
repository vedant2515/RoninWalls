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
                    
                    {/* NEW ACTION OVERLAY */}
                    <div className="wallpaper-actions-overlay">
                        <button 
                            className={`overlay-icon-btn ${isLiked ? 'liked' : ''}`} 
                            aria-label="Like"
                            onClick={toggleLike}
                        >
                            <Heart size={18} fill={isLiked ? "#ffffff" : "none"} color="#ffffff" />
                            {likeCount > 0 && <span className="like-count">{likeCount}</span>}
                        </button>
                        <button 
                            className="overlay-icon-btn" 
                            aria-label="Download"
                            onClick={handleDownload}
                            disabled={downloading}
                        >
                            <Download size={18} color="#ffffff" />
                        </button>
                    </div>
                </div>
            </Link>


        </div>
    );
}
