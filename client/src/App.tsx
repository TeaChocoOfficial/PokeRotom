//-Path: "PokeRotom/client/src/App.tsx"
import viteLogo from '/vite.svg';
import { useState } from 'react';
import reactLogo from './assets/react.svg';

function App() {
    const [count, setCount] = useState(0);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white">
            <div className="flex gap-8 mb-8">
                <a href="https://vite.dev" target="_blank">
                    <img src={viteLogo} className="w-24 h-24" alt="Vite logo" />
                </a>
                <a href="https://react.dev" target="_blank">
                    <img
                        src={reactLogo}
                        className="w-24 h-24"
                        alt="React logo"
                    />
                </a>
            </div>
            <h1 className="text-5xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                Vite + React + Tailwind
            </h1>
            <div className="p-8 bg-slate-800 rounded-2xl shadow-2xl border border-slate-700">
                <button
                    className="px-8 py-4 bg-blue-600 hover:bg-blue-500 active:scale-95 transition-all rounded-xl font-bold"
                    onClick={() => setCount((prevCount) => prevCount + 1)}
                >
                    Count is {count}
                </button>
                <p className="mt-6 text-slate-400">
                    Edit{' '}
                    <code className="bg-slate-900 px-2 py-1 rounded text-blue-400">
                        src/App.tsx
                    </code>{' '}
                    to test HMR
                </p>
            </div>
            <p className="mt-10 text-slate-500 text-sm">
                Built with PokeRotom Framework
            </p>
        </div>
    );
}

export default App;
