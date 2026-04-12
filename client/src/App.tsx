// -Path: "PokeRotom/client/src/App.tsx"
import Screen from '$/screen/Screen';
import { useSocketStore } from './stores/socketStore';

export default function App() {
    const { socket } = useSocketStore();

    return (
        <div className="w-full h-full">
            <Screen />
            <div className="fixed bottom-4 right-4 text-xs text-white/50 pointer-events-none">
                {socket?.id}
            </div>
        </div>
    );
}
