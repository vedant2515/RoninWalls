import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

export default function Login() {
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');

    const { loginWithGoogle } = useAuth();
    const navigate = useNavigate();

    const handleGoogleLogin = async () => {
        setError('');
        try {
            setIsLoading(true);
            await loginWithGoogle();
            setSuccessMsg('Welcome to RoninWalls! 🎉');
            setTimeout(() => navigate('/'), 1500);
        } catch (err) {
            console.error('Google Sign-In Error:', err);
            if (err.code === 'auth/popup-closed-by-user') {
                setError('Sign-in cancelled. Please try again.');
            } else if (err.code === 'auth/popup-blocked') {
                setError('Popup was blocked by your browser. Please allow popups for this site.');
            } else {
                setError(err.message || 'Failed to sign in with Google.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    if (successMsg) {
        return (
            <div className="login-page container flex-center">
                <div className="login-card card" style={{ textAlign: 'center', padding: '3rem' }}>
                    <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🎉</div>
                    <h2 className="text-gradient">{successMsg}</h2>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Redirecting to home...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="login-page container flex-center">
            <div className="login-card card">
                <h2 className="text-gradient">Welcome to RoninWalls</h2>
                <p className="login-subtitle">Sign in to save wallpapers, like, and comment</p>

                {error && <div className="error-message">{error}</div>}

                {/* Google Sign-In Button */}
                <button
                    onClick={handleGoogleLogin}
                    disabled={isLoading}
                    className="google-signin-btn"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '12px',
                        width: '100%',
                        padding: '0.85rem 1.5rem',
                        marginTop: '1.5rem',
                        background: 'white',
                        color: '#1f1f1f',
                        border: 'none',
                        borderRadius: 'var(--radius-lg)',
                        fontSize: '1rem',
                        fontWeight: '600',
                        cursor: isLoading ? 'not-allowed' : 'pointer',
                        opacity: isLoading ? 0.7 : 1,
                        transition: 'transform 0.15s, box-shadow 0.15s',
                        boxShadow: '0 2px 12px rgba(0,0,0,0.3)',
                    }}
                    onMouseEnter={e => { if (!isLoading) e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.2)'; }}
                >
                    {/* Google Logo SVG */}
                    <svg width="20" height="20" viewBox="0 0 48 48">
                        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                    </svg>
                    {isLoading ? 'Signing in...' : 'Continue with Google'}
                </button>

                <div className="login-footer mt-4" style={{ textAlign: 'center', fontSize: '0.8rem' }}>
                    By signing in, you agree to our{' '}
                    <Link to="/terms" target="_blank" rel="noopener noreferrer">Terms of Service</Link>
                    {' '}and{' '}
                    <Link to="/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</Link>
                </div>
            </div>
        </div>
    );
}
