import { useState, useEffect } from 'react';

export function useWallpapers() {
    const [wallpapers, setWallpapers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/api/wallpapers`)
            .then(res => res.json())
            .then(data => {
                if (data.success && data.wallpapers) {
                    setWallpapers(data.wallpapers);
                } else {
                    setError("Failed to fetch from S3");
                }
            })
            .catch(err => {
                console.error("Fetch S3 error:", err);
                setError(err.message);
            })
            .finally(() => setLoading(false));
    }, []);

    return { wallpapers, loading, error };
}
