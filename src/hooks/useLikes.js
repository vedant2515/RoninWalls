import { useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc, updateDoc, arrayUnion, arrayRemove, increment, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';

export function useLikes(wallpaperId) {
    const [likeCount, setLikeCount] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        if (!wallpaperId) return;

        // Ensure we enforce URL encoding so the path doesn't contain forward slashes, forcing a flat Document ID
        const safeId = encodeURIComponent(decodeURIComponent(wallpaperId));
        const docRef = doc(db, 'wallpapers', safeId);
        
        const unsubscribe = onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                setLikeCount(data.likeCount || 0);
                
                if (user) {
                    setIsLiked(data.likedBy?.includes(user.id) || false);
                } else {
                    setIsLiked(false);
                }
            } else {
                setLikeCount(0);
                setIsLiked(false);
            }
            setLoading(false);
        }, (error) => {
            console.error("Error fetching likes:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [wallpaperId, user]);

    const toggleLike = async (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        
        if (!user) {
            alert('Please login to like wallpapers!');
            return;
        }

        const safeId = encodeURIComponent(decodeURIComponent(wallpaperId));
        const docRef = doc(db, 'wallpapers', safeId);
        
        try {
            // Check if document exists first
            const docSnap = await getDoc(docRef);
            
            if (!docSnap.exists()) {
                // Initialize document if it doesn't exist
                await setDoc(docRef, {
                    likeCount: 1,
                    likedBy: [user.id]
                });
            } else {
                // Toggle like
                if (isLiked) {
                    await updateDoc(docRef, {
                        likeCount: increment(-1),
                        likedBy: arrayRemove(user.id)
                    });
                } else {
                    await updateDoc(docRef, {
                        likeCount: increment(1),
                        likedBy: arrayUnion(user.id)
                    });
                }
            }
        } catch (error) {
            console.error("Error toggling like:", error);
        }
    };

    return { likeCount, isLiked, toggleLike, loading };
}
