// -Path: "PokeRotom/client/src/screen/game/GameScene.tsx"
import Objects from './Objects';
import { useControls } from 'leva';
import Lighting from './world/Lighting';
import { OrbitControls } from '@react-three/drei';

export default function GameScene({ debug }: { debug?: boolean }) {
    const { seed } = useControls('world', {
        seed: 't1234',
    });

    return (
        <>
            <OrbitControls enabled={debug} />
            <Lighting />

            {/* Physics World — ใช้ Suspense ครอบเพื่อให้ Rapier WASM โหลดเสร็จก่อน */}
            <Objects seed={seed} debug={debug} />
        </>
    );
}
