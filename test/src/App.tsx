//-Path: "PokeRotom/client/src/App.tsx"
import './index.css';
import React from 'react';
import { useState } from 'react';
import SEO from './components/SEO';

/**
 * Main application component.
 */
function App() {
    const [count, setCount] = useState(0);

    const incrementCount = () => setCount((previousCount) => previousCount + 1);

    return (
        <>
            <SEO
                title="Vite SSR Premium | Stunning SEO Performance"
                description="A high-performance React application built with Vite SSR for lightning-fast delivery and optimal SEO."
            />

            <div className="glow" style={{ top: '20%', left: '20%' }} />
            <div
                className="glow"
                style={{
                    bottom: '20%',
                    right: '20%',
                    background:
                        'radial-gradient(circle, #ec4899 0%, transparent 70%)',
                }}
            />

            <main className="premium-container">
                <div className="badge">Next Generation SSR</div>

                <h1>Premium Experience. Simplified.</h1>

                <p>
                    Experience the power of Server-Side Rendering combined with
                    modern aesthetic excellence. Built for speed, designed for
                    impact.
                </p>

                <button onClick={incrementCount}>
                    Interaction Count: {count}
                </button>

                <section style={{ marginTop: '1rem' }}>
                    <p style={{ fontSize: '0.875rem' }}>
                        Fully optimized for Vercel Edge and SSR deployment.
                    </p>
                </section>
            </main>
        </>
    );
}

export default App;
