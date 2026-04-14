// -Path: "PokeRotom/client/src/main.tsx"
import './index.css';
import App from './App';
import { createRoot } from 'react-dom/client';
import Providers from './components/layout/Providers';

document.addEventListener(
    'touchstart',
    (event) => {
        if (event.touches.length > 1) event.preventDefault();
    },
    { passive: false },
);

let lastTouchEnd = 0;
document.addEventListener(
    'touchend',
    (event) => {
        const now = new Date().getTime();
        if (now - lastTouchEnd <= 300) event.preventDefault();
        lastTouchEnd = now;
    },
    { passive: false },
);

createRoot(document.getElementById('root')!).render(
    <Providers>
        <App />
    </Providers>,
);
