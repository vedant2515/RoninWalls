import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { MessageSquare } from 'lucide-react';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function CommentsSection({ wallpaperId }) {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!wallpaperId) return;

        const safeId = encodeURIComponent(decodeURIComponent(wallpaperId));
        const commentsRef = collection(db, 'wallpapers', safeId, 'comments');
        const q = query(commentsRef, orderBy('createdAt', 'desc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedComments = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setComments(fetchedComments);
        });

        return () => unsubscribe();
    }, [wallpaperId]);

    const handleAuthRequiredAction = () => {
        if (!user) {
            alert('Please log in to post a comment.');
            navigate('/login');
            return false;
        }
        return true;
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!handleAuthRequiredAction()) return;
        if (!newComment.trim() || !wallpaperId) return;

        const safeId = encodeURIComponent(decodeURIComponent(wallpaperId));
        const commentText = newComment;
        setNewComment(''); // Optimistic clear

        try {
            const commentsRef = collection(db, 'wallpapers', safeId, 'comments');
            await addDoc(commentsRef, {
                user: user.username || 'User',
                text: commentText, // We store full comment text securely
                createdAt: serverTimestamp(),
                date: new Date().toLocaleDateString()
            });
        } catch (err) {
            console.error("Error adding comment: ", err);
            alert("Failed to post comment. Ensure Firestore is configured properly.");
        }
    };

    return (
        <div className="comments-section">
            <h3 className="card-heading"><MessageSquare size={18} /> Comments ({comments.length})</h3>

            <form onSubmit={handleAddComment} className="comment-form">
                <textarea
                    className="input-base"
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onClick={() => handleAuthRequiredAction()}
                    rows={3}
                ></textarea>
                <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>Post</button>
            </form>

            <div className="comments-list">
                {comments.map(comment => (
                    <div key={comment.id} className="comment">
                        <div className="comment-header flex-between">
                            <strong>{comment.user}</strong>
                            <span className="comment-date">{comment.date}</span>
                        </div>
                        <p className="comment-text">{comment.text}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
