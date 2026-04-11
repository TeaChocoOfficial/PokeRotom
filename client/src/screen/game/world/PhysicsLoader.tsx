// -Path: "PokeRotom/client/src/screen/game/world/PhysicsLoader.tsx"
import { useRef } from 'react';
import type { Group } from 'three';
import Pokeball from '../pokemon/Pokeball';
import { useFrame } from '@react-three/fiber';

export default function PhysicsLoader() {
    const timeRef = useRef(0);
    const groupRef = useRef<Group>(null);

    useFrame(({ camera }, delta) => {
        timeRef.current += delta;
        camera.position.set(10, -3, 5);
        camera.lookAt(0, 0, 0);
        if (!groupRef.current) return;
        groupRef.current.rotation.y += delta * 1.5;
        groupRef.current.rotation.z = Math.sin(timeRef.current * 2) * 0.6;
    });

    return (
        <group position={[0, 0, 0]} ref={groupRef}>
            {/* Pokéball หมุน */}
            <Pokeball color="#f57a3d" />
        </group>
    );
}
