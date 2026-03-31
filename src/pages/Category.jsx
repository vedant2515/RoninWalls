import { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useWallpapers } from '../hooks/useWallpapers';
import WallpaperCard from '../components/WallpaperCard';
import './Category.css';

export default function Category() {
    const { id } = useParams();
    const categoryName = id ? id.charAt(0).toUpperCase() + id.slice(1) : '';
    const [deviceFilter, setDeviceFilter] = useState('All');

    const { wallpapers: allWallpapers, loading, error } = useWallpapers();

    const filteredByCategory = useMemo(() => {
        if (!id) return [];
        return allWallpapers.filter(w => w.category.toLowerCase() === id.toLowerCase());
    }, [allWallpapers, id]);

    const filteredWallpapers = useMemo(() => {
        if (deviceFilter === 'All') return filteredByCategory;
        return filteredByCategory.filter(w => w.type === deviceFilter);
    }, [filteredByCategory, deviceFilter]);

    return (
        <div className="category-page container">

            <div className="category-layout">
                {/* LEFT SIDEBAR FILTERS */}
                <aside className="category-sidebar card">
                    <div className="filter-block">
                        <h4 className="filter-title">DEVICE TYPE</h4>
                        <div className="filter-buttons">
                            <button
                                className={`sidebar-filter-btn ${deviceFilter === 'All' ? 'active' : ''}`}
                                onClick={() => setDeviceFilter('All')}
                            >
                                All
                            </button>
                            <button
                                className={`sidebar-filter-btn ${deviceFilter === 'Desktop' ? 'active' : ''}`}
                                onClick={() => setDeviceFilter('Desktop')}
                            >
                                Desktop
                            </button>
                            <button
                                className={`sidebar-filter-btn ${deviceFilter === 'Mobile' ? 'active' : ''}`}
                                onClick={() => setDeviceFilter('Mobile')}
                            >
                                Mobile
                            </button>
                        </div>
                    </div>

                    <div className="filter-block">
                        <h4 className="filter-title">RESOLUTION</h4>
                        <select className="filter-select">
                            <option>All Resolutions</option>
                            <option>4K Ultra HD</option>
                            <option>1080p Full HD</option>
                        </select>
                    </div>



                    {/* PRICE filter — commented out, subscriptions coming soon
                    <div className="filter-block">
                        <h4 className="filter-title">PRICE</h4>
                        <div className="filter-buttons">
                            <button className="sidebar-filter-btn outline">Free</button>
                            <button className="sidebar-filter-btn outline">Premium</button>
                        </div>
                    </div>
                    */}
                </aside>

                {/* RIGHT CONTENT GRID */}
                <main className="category-content">
                    <div className="category-header-minimal">
                        <h1 className="text-gradient">{categoryName} Wallpapers</h1>
                    </div>

                    {loading ? (
                        <div className="wallpaper-grid category-wallpaper-grid">
                            {[1, 2, 3, 4, 5, 6].map(n => <div key={n} className="skeleton" style={{ height: '350px', borderRadius: 'var(--radius-2xl)' }}></div>)}
                        </div>
                    ) : error ? (
                        <div className="text-center text-secondary" style={{ padding: '4rem 0' }}>{error}</div>
                    ) : filteredWallpapers.length === 0 ? (
                        <div className="text-center text-secondary" style={{ padding: '4rem 0' }}>
                            No wallpapers found for {categoryName} in S3 yet!
                        </div>
                    ) : (
                        <div className="wallpaper-grid category-wallpaper-grid">
                            {filteredWallpapers.map(wp => (
                                <WallpaperCard
                                    key={wp.id}
                                    id={encodeURIComponent(wp.id)}
                                    title={wp.title}
                                    imageUrl={wp.imageUrl}
                                    type={wp.type}
                                />
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
