//-Path: "PokeRotom/client/src/components/GameLayout.tsx"
import { Outlet } from 'react-router-dom';
import GameChat from './GameChat';

export default function GameLayout() {
    return (
        <>
            <Outlet />
            <GameChat />
        </>
    );
}
