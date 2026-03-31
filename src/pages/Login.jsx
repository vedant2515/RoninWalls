import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

export default function Login() {
    const [isLogin, setIsLogin] = useState(true);
    const [step, setStep] = useState(1); // 1: Email/Password, 2: OTP Entry, 3: Forgot Password
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [agreeToTerms, setAgreeToTerms] = useState(false);

    const { login, signup, resetPassword } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (step === 3) {
            // Forgot Password Flow
            if (!email) {
                setError('Please enter your email address');
                return;
            }
            try {
                setIsLoading(true);
                await resetPassword(email);
                alert('Password reset link sent to your email! Please check your inbox.');
                setStep(1);
            } catch (err) {
                console.error('Reset Error:', err);
                if (err.code === 'auth/user-not-found') {
                    setError('No user found with this email address.');
                } else {
                    setError(err.message || 'Failed to send reset email.');
                }
            } finally {
                setIsLoading(false);
            }
            return;
        }

        if (!email || !password) {
            setError('Please enter both email and password');
            return;
        }

        try {
            setIsLoading(true);
            if (isLogin) {
                // Standard Login
                await login(email, password);
                setSuccessMsg('Login Successful!');
                setTimeout(() => navigate('/'), 1500);
            } else {
                // Sign Up Step 1: Validate terms then Request OTP
                if (!agreeToTerms) {
                    setError('Please agree to the Terms of Service and Privacy Policy to continue.');
                    setIsLoading(false);
                    return;
                }
                if (password.length < 6) {
                    setError('Password must be at least 6 characters.');
                    setIsLoading(false);
                    return;
                }

                // Send OTP request to backend
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/send-otp`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email })
                });

                const data = await response.json();

                if (response.ok) {
                    setStep(2); // Move to OTP step
                } else {
                    setError(data.error || 'Failed to send OTP.');
                }
            }
        } catch (err) {
            console.error('Authentication Error:', err);
            if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
                setError('Invalid email or password.');
            } else if (err.code === 'auth/email-already-in-use') {
                setError('An account with this email already exists.');
            } else {
                setError(err.message || 'Failed to authenticate.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setError('');

        if (!otp || otp.length < 6) {
            setError('Please enter the 6-digit OTP.');
            return;
        }

        try {
            setIsLoading(true);

            // Verify OTP with backend
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/verify-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp })
            });

            const data = await response.json();

            if (response.ok) {
                // OTP is valid! Proceed with Firebase Registration
                await signup(email, password);
                setSuccessMsg('Sign Up Successful!');
                setTimeout(() => navigate('/'), 1500);
            } else {
                setError(data.error || 'Invalid or expired OTP.');
            }
        } catch (err) {
            console.error('Verification Error:', err);
            setError(err.message || 'Failed to complete registration.');
        } finally {
            setIsLoading(false);
        }
    };

    if (successMsg) {
        return (
            <div className="login-page container flex-center">
                <div className="login-card card" style={{ textAlign: 'center', padding: '3rem' }}>
                    <div style={{ fontSize: '3.5rem', marginBottom: '1rem', animation: 'scaleUp 0.5s ease' }}>🎉</div>
                    <h2 className="text-gradient">{successMsg}</h2>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Redirecting to home...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="login-page container flex-center">
            <div className="login-card card">
                <h2 className="text-gradient">
                    {step === 3 ? 'Reset Password' : step === 2 ? 'Verify Email' : isLogin ? 'Welcome back' : 'Create an account'}
                </h2>
                <p className="login-subtitle">
                    {step === 3
                        ? 'Enter your email to receive a password reset link'
                        : step === 2
                        ? `We sent a 6-digit code to ${email}`
                        : isLogin ? 'Sign in to save wallpapers and comment' : 'Join us to save wallpapers and comment'}
                </p>

                {error && <div className="error-message">{error}</div>}

                {step === 1 && (
                    <form onSubmit={handleSubmit} className="login-form">
                        <div className="form-group">
                            <label>Email Address</label>
                            <input
                                type="email"
                                className="input-base"
                                placeholder="developer@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={isLoading}
                            />
                        </div>

                        <div className="form-group mt-3">
                            <label>Password</label>
                            <input
                                type="password"
                                className="input-base"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={isLoading}
                            />
                        </div>

                        {!isLogin && (
                            <div className="terms-checkbox-row">
                                <input
                                    type="checkbox"
                                    id="agreeTerms"
                                    checked={agreeToTerms}
                                    onChange={(e) => setAgreeToTerms(e.target.checked)}
                                    disabled={isLoading}
                                />
                                <label htmlFor="agreeTerms" className="terms-label">
                                    I agree to the{' '}
                                    <Link to="/terms" target="_blank" rel="noopener noreferrer">Terms of Service</Link>
                                    {' '}and{' '}
                                    <Link to="/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</Link>
                                </label>
                            </div>
                        )}

                        <button type="submit" className="btn btn-primary w-100 mt-4" disabled={isLoading}>
                            {isLoading ? 'Processing...' : isLogin ? 'Login' : 'Continue'}
                        </button>

                        <div className="text-center mt-3" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center' }}>
                            <button
                                type="button"
                                className="btn btn-ghost"
                                onClick={() => setIsLogin(!isLogin)}
                                disabled={isLoading}
                            >
                                {isLogin ? 'Need an account? Sign Up' : 'Already have an account? Login'}
                            </button>
                            {isLogin && (
                                <button
                                    type="button"
                                    className="btn btn-ghost"
                                    onClick={() => { setStep(3); setError(''); }}
                                    disabled={isLoading}
                                    style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}
                                >
                                    Forgot your password?
                                </button>
                            )}
                        </div>
                    </form>
                )}

                {step === 2 && (
                    <form onSubmit={handleVerifyOtp} className="login-form">
                        <div className="form-group">
                            <label>6-Digit Verification Code</label>
                            <input
                                type="text"
                                className="input-base"
                                placeholder="123456"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                                maxLength={6}
                                disabled={isLoading}
                                style={{ letterSpacing: '8px', fontSize: '1.2rem', textAlign: 'center' }}
                            />
                        </div>

                        <button type="submit" className="btn btn-primary w-100 mt-4" disabled={isLoading}>
                            {isLoading ? 'Verifying...' : 'Complete Sign Up'}
                        </button>

                        <div className="text-center mt-3">
                            <button
                                type="button"
                                className="btn btn-ghost"
                                onClick={() => { setStep(1); setError(''); setOtp(''); }}
                                disabled={isLoading}
                            >
                                Back to Email Entry
                            </button>
                        </div>
                    </form>
                )}

                {step === 3 && (
                    <form onSubmit={handleSubmit} className="login-form">
                        <div className="form-group">
                            <label>Email Address</label>
                            <input
                                type="email"
                                className="input-base"
                                placeholder="developer@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={isLoading}
                            />
                        </div>

                        <button type="submit" className="btn btn-primary w-100 mt-4" disabled={isLoading}>
                            {isLoading ? 'Sending...' : 'Send Reset Link'}
                        </button>

                        <div className="text-center mt-3">
                            <button
                                type="button"
                                className="btn btn-ghost"
                                onClick={() => { setStep(1); setError(''); setIsLogin(true); }}
                                disabled={isLoading}
                            >
                                Back to Login
                            </button>
                        </div>
                    </form>
                )}

                <div className="login-footer mt-4">
                    By continuing, you agree to our{' '}
                    <Link to="/terms" target="_blank" rel="noopener noreferrer">Terms of Service</Link>
                    {' '}and{' '}
                    <Link to="/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</Link>.
                </div>
            </div>
        </div>
    );
}
