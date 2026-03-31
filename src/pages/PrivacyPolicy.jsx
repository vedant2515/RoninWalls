import { Link } from 'react-router-dom';

export default function PrivacyPolicy() {
    return (
        <div className="container" style={{ maxWidth: '800px', padding: '4rem 2rem' }}>
            <Link to="/" className="btn btn-ghost" style={{ marginBottom: '2rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                ← Back to Home
            </Link>

            <h1 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Privacy Policy</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem' }}>
                Last updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>

            <div style={{ lineHeight: '1.8', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <section>
                    <h2 style={{ color: 'var(--text-primary)', marginBottom: '0.75rem' }}>1. Information We Collect</h2>
                    <p>When you create an account on RoninWalls, we collect your email address and a generated username. We also track wallpapers you like, download, or save in order to personalize your experience on the platform.</p>
                </section>

                <section>
                    <h2 style={{ color: 'var(--text-primary)', marginBottom: '0.75rem' }}>2. How We Use Your Information</h2>
                    <p>Your information is used solely to operate the RoninWalls platform — to authenticate you, display your activity history, and sync your liked wallpapers. We do not sell, share, or monetize your personal data with any third parties.</p>
                </section>

                <section>
                    <h2 style={{ color: 'var(--text-primary)', marginBottom: '0.75rem' }}>3. Third-Party Services</h2>
                    <p>We use <strong>Firebase by Google</strong> for authentication and real-time database (Firestore), and <strong>Amazon Web Services (AWS S3)</strong> for storing wallpaper images. These services have their own privacy policies that govern their data handling practices.</p>
                </section>

                <section>
                    <h2 style={{ color: 'var(--text-primary)', marginBottom: '0.75rem' }}>4. Cookies & Local Storage</h2>
                    <p>RoninWalls uses Firebase's authentication tokens stored in your browser's local storage to keep you logged in across sessions. No advertising or tracking cookies are used.</p>
                </section>

                <section>
                    <h2 style={{ color: 'var(--text-primary)', marginBottom: '0.75rem' }}>5. Data Security</h2>
                    <p>We take reasonable measures to protect your data. All connections to our platform are secured via HTTPS and Firebase's industry-standard security protocols.</p>
                </section>

                <section>
                    <h2 style={{ color: 'var(--text-primary)', marginBottom: '0.75rem' }}>6. Your Rights</h2>
                    <p>You may request the deletion of your account and associated data at any time by contacting us at <a href="https://mail.google.com/mail/?view=cm&to=roninwallss@gmail.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-primary)' }}>roninwallss@gmail.com</a>.</p>
                </section>

                <section>
                    <h2 style={{ color: 'var(--text-primary)', marginBottom: '0.75rem' }}>7. Contact Us</h2>
                    <p>If you have any questions about this Privacy Policy, please reach out to us at <a href="https://mail.google.com/mail/?view=cm&to=roninwallss@gmail.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-primary)' }}>roninwallss@gmail.com</a>.</p>
                </section>
            </div>
        </div>
    );
}
