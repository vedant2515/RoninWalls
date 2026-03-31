import { useState } from 'react';
import { Search, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import CategoryCard from '../components/CategoryCard';
import WallpaperCard from '../components/WallpaperCard';
import { useWallpapers } from '../hooks/useWallpapers';
import './Home.css';

export default function Home() {
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const { wallpapers, loading, error } = useWallpapers();

    const trendingWallpapers = wallpapers.slice(0, 8); // Top 8 recent

    // Compute derived state for search filtering
    const searchLower = searchQuery.toLowerCase().trim();
    const isSearching = searchLower.length > 0;
    const searchMode = isSearchFocused || isSearching;
    
    const filteredWallpapers = isSearching
        ? wallpapers.filter(wp => 
            wp.title.toLowerCase().includes(searchLower) || 
            wp.category.toLowerCase().includes(searchLower)
        )
        : [];

    const hasNoResults = isSearching && filteredWallpapers.length === 0;

    // Random category images — changes on every refresh
    const categoryImages = {
        anime: [
            'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1560707303-4e980ce876ad?q=80&w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1618336753974-aae8e04506aa?q=80&w=800&auto=format&fit=crop',
        ],
        cars: [
            'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?q=80&w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?q=80&w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=800&auto=format&fit=crop',
        ],
        gaming: [
            'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1593305841991-05c297ba4575?q=80&w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?q=80&w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=800&auto=format&fit=crop',
        ],
        amoled: [
            'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1604076913837-52ab5629fde9?q=80&w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?q=80&w=800&auto=format&fit=crop',
        ],
    };

    const randomImage = (key) => {
        const pool = categoryImages[key];
        return pool[Math.floor(Math.random() * pool.length)];
    };

    return (
        <div className={`home-page ${searchMode ? 'search-mode' : ''}`}>
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-bg">
                    <div className="hero-orb orb-1"></div>
                    <div className="hero-orb orb-2"></div>
                    <div className="hero-orb orb-3"></div>
                    <div className="hero-grid"></div>
                </div>
                <div className="container hero-content">
                    <div className="hero-badge flex-center">
                        <Sparkles size={16} className="text-gradient-accent" style={{ marginRight: '8px' }} />
                        <span>Discover the future of aesthetics</span>
                    </div>

                    <h1 className="hero-title">
                        Elevate Your Screen.<br />
                        <span className="text-gradient-accent">Next-Gen Wallpapers.</span>
                    </h1>
                    <p className="hero-subtitle">
                        Premium 4K & AMOLED backgrounds for your setup.
                    </p>

                    <div className="hero-search-wrapper">
                        <div className="search-field-container">
                            <Search className="search-icon-hero" size={24} />
                            <input
                                type="text"
                                className="hero-search-input"
                                placeholder="Search anime, gaming, cars..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => setIsSearchFocused(true)}
                                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                            />
                        </div>
                        <button className="btn btn-primary search-btn" onClick={() => {}}>Search</button>
                    </div>
                </div>
            </section>

            {/* Featured Categories - Hide when searching */}
            {!searchMode && (
                <section className="categories-section container">
                    <div className="section-header flex-between">
                        <h2>Featured Categories</h2>
                    </div>
                    <div className="categories-grid">
                        <CategoryCard title="Anime" linkTo="/category/anime" imagePath={randomImage('anime')} />
                        <CategoryCard title="Cars" linkTo="/category/cars" imagePath={randomImage('cars')} />
                        <CategoryCard title="Gaming" linkTo="/category/gaming" imagePath={randomImage('gaming')} />
                        <CategoryCard title="AMOLED" linkTo="/category/amoled" imagePath={randomImage('amoled')} />
                    </div>
                </section>
            )}

            {/* Dynamic Content Section */}
            <section className="trending-section container">
                {/* Fallback Error / Loading States */}
                {loading && (
                    <>
                        <div className="section-header flex-between"><h2>Loading...</h2></div>
                        <div className="trending-grid">
                            {[1, 2, 3, 4].map(n => <div key={n} className="skeleton" style={{ height: '300px', borderRadius: '1.5rem' }}></div>)}
                        </div>
                    </>
                )}
                {error && (
                    <div className="error-state text-center text-secondary">
                        <p>Make sure your Backend server is running and your AWS variables are mapped!</p>
                    </div>
                )}
                {!loading && !error && trendingWallpapers.length === 0 && (
                    <div className="error-state text-center text-secondary">No wallpapers found in S3 bucket. Upload some!</div>
                )}

                {/* Primary Render logic for hydrated state */}
                {!loading && !error && trendingWallpapers.length > 0 && (
                    <>
                        {isSearching && !hasNoResults ? (
                            // Showing Search Results
                            <>
                                <div className="section-header flex-between">
                                    <h2>Search Results</h2>
                                    <span className="text-secondary">{filteredWallpapers.length} matches found</span>
                                </div>
                                <div className="trending-grid">
                                    {filteredWallpapers.map(wp => (
                                        <div data-type={wp.type} key={wp.id} style={{ display: 'flex' }}>
                                            <WallpaperCard
                                                id={encodeURIComponent(wp.id)}
                                                title={wp.title}
                                                imageUrl={wp.imageUrl}
                                                type={wp.type}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            // Default to Top 8 Trending (or fallback if No Results)
                            <>
                                {hasNoResults && (
                                    <div className="text-center" style={{ marginBottom: '3rem', padding: '2rem', background: 'var(--surface)', borderRadius: '1rem', border: '1px solid var(--border)' }}>
                                        <h3 style={{ marginBottom: '0.5rem' }}>No results found for "<span className="text-gradient-accent">{searchQuery}</span>"</h3>
                                        <p className="text-secondary">We couldn't find any wallpapers matching that term. Check out our trending wallpapers below!</p>
                                    </div>
                                )}
                                <div className="section-header flex-between">
                                    <h2>Trending This Week</h2>
                                    {!isSearching && (
                                        <button className="btn btn-outline flex-center view-all-btn">
                                            View All <ArrowRight size={16} style={{ marginLeft: '8px' }} />
                                        </button>
                                    )}
                                </div>
                                <div className="trending-grid">
                                    {trendingWallpapers.map(wp => (
                                        <div data-type={wp.type} key={wp.id} style={{ display: 'flex' }}>
                                            <WallpaperCard
                                                id={encodeURIComponent(wp.id)}
                                                title={wp.title}
                                                imageUrl={wp.imageUrl}
                                                type={wp.type}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </>
                )}
            </section>
        </div>
    );
}
