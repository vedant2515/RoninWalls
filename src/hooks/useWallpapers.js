import { useState, useEffect } from 'react';

export function useWallpapers() {
    const [wallpapers, setWallpapers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const apiUrl = import.meta.env.VITE_API_URL;
        console.log("🛠️ Debug: VITE_API_URL is", apiUrl);

        if (!apiUrl || apiUrl === 'undefined') {
            setError("Backend URL (VITE_API_URL) is not set in Vercel environment variables.");
            setLoading(false);
            return;
        }

        fetch(`${apiUrl}/api/wallpapers`)
            .then(res => {
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                const contentType = res.headers.get("content-type");
                if (!contentType || !contentType.includes("application/json")) {
                    throw new TypeError("Oops, we haven't got JSON!");
                }
                return res.json();
            })
            .then(data => {
                if (data.success && data.wallpapers) {
                    setWallpapers(data.wallpapers);
                } else {
                    setError("Failed to fetch wallpapers from backend.");
                }
            })
            .catch(err => {
                console.error("Fetch API error:", err);
                setError(`Connection Error: ${err.message}`);
            })
            .finally(() => setLoading(false));
    }, []);

    return { wallpapers, loading, error };
}
