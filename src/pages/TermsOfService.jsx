import { Link } from 'react-router-dom';

export default function TermsOfService() {
    return (
        <div className="container" style={{ maxWidth: '800px', padding: '4rem 2rem' }}>
            <Link to="/" className="btn btn-ghost" style={{ marginBottom: '2rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                ← Back to Home
            </Link>

            <h1 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Terms of Service</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem' }}>
                Last updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>

            <div style={{ lineHeight: '1.8', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <section>
                    <h2 style={{ color: 'var(--text-primary)', marginBottom: '0.75rem' }}>1. Acceptance of Terms</h2>
                    <p>By creating an account or using RoninWalls, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you may not use our platform.</p>
                </section>

                <section>
                    <h2 style={{ color: 'var(--text-primary)', marginBottom: '0.75rem' }}>2. Use of the Platform</h2>
                    <p>RoninWalls is a wallpaper discovery and download platform. You may browse, like, and download wallpapers for personal, non-commercial use only. Redistribution or resale of wallpapers obtained from RoninWalls is strictly prohibited.</p>
                </section>

                <section>
                    <h2 style={{ color: 'var(--text-primary)', marginBottom: '0.75rem' }}>3. User Accounts</h2>
                    <p>You are responsible for maintaining the confidentiality of your account credentials. You agree to notify us immediately of any unauthorized use of your account. RoninWalls is not liable for any loss resulting from unauthorized account access.</p>
                </section>

                <section>
                    <h2 style={{ color: 'var(--text-primary)', marginBottom: '0.75rem' }}>4. Content & Intellectual Property</h2>
                    <p>All wallpapers hosted on RoninWalls remain the intellectual property of their respective creators. The RoninWalls brand, logo, and platform design are owned by RoninWalls. You may not copy, reproduce, or use platform assets without permission.</p>
                </section>

                <section>
                    <h2 style={{ color: 'var(--text-primary)', marginBottom: '0.75rem' }}>5. Prohibited Conduct</h2>
                    <p>You agree not to: upload malicious or illegal content, attempt to reverse-engineer the platform, harass other users via comments or messages, or use automated tools to scrape or download content in bulk.</p>
                </section>

                <section>
                    <h2 style={{ color: 'var(--text-primary)', marginBottom: '0.75rem' }}>6. Termination</h2>
                    <p>We reserve the right to suspend or terminate your account at any time, without notice, if you violate these Terms of Service or engage in any conduct that we deem harmful to the platform or its users.</p>
                </section>

                <section>
                    <h2 style={{ color: 'var(--text-primary)', marginBottom: '0.75rem' }}>7. Disclaimer of Warranties</h2>
                    <p>RoninWalls is provided "as is" without any warranties, express or implied. We do not guarantee uninterrupted or error-free access to the platform at all times.</p>
                </section>

                <section>
                    <h2 style={{ color: 'var(--text-primary)', marginBottom: '0.75rem' }}>8. Contact</h2>
                    <p>For any questions regarding these Terms, contact us at <a href="https://mail.google.com/mail/?view=cm&to=roninwallss@gmail.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-primary)' }}>roninwallss@gmail.com</a>.</p>
                </section>
            </div>
        </div>
    );
}
