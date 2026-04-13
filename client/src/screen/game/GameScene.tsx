// -Path: "PokeRotom/client/src/screen/game/GameScene.tsx"
import Sky from './world/Sky';
import Objects from './Objects';
import { useControls } from 'leva';
import { isDev } from '$/secure/env';
import Lighting from './world/Lighting';
import EffectComposes from './world/EffectComposes';
import { OrbitControls, Stats, StatsGl } from '@react-three/drei';

export default function GameScene({ debug }: { debug?: boolean }) {
    const { seed } = useControls('world', {
        seed: 't1234',
    });

    return (
        <>
            {isDev && (
                <>
                    <Stats className="left-auto! right-0!" />
                    <StatsGl />
                    <OrbitControls enabled={debug} />
                </>
            )}

            <Lighting />
            <EffectComposes />
            <Sky />

            {/* Physics World — ใช้ Suspense ครอบเพื่อให้ Rapier WASM โหลดเสร็จก่อน */}
            <Objects seed={seed} debug={debug} />
        </>
    );
}
