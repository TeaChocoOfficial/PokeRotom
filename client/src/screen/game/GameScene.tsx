// -Path: "PokeRotom/client/src/screen/game/GameScene.tsx"
import Objects from './Objects';
import { useControls } from 'leva';
import Lighting from './world/Lighting';
import { OrbitControls } from '@react-three/drei';

export default function GameScene() {
    const { seed, debug } = useControls('world', {
        seed: '1234',
        debug: false,
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
