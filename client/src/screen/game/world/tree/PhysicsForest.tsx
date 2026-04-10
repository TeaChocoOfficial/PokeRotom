//-Path: "PokeRotom/client/src/screen/game/world/tree/PhysicsForest.tsx"
import {
    RigidBody,
    CylinderCollider,
    InstancedRigidBodyProps,
} from '@react-three/rapier';
import { InstancedMesh } from 'three';
import { useMemo, useRef } from 'react';
import { Instance, Instances } from '@react-three/drei';

export function PhysicsForest() {
    const count = 500;
    const leafColor = '#43a047';
    const trunkColor = '#5d4037';
    const instancedMeshRef = useRef<InstancedMesh>(null);

    const instances = useMemo(() => {
        const items: InstancedRigidBodyProps[] = [];
        for (let index = 0; index < count; index++) {
            items.push({
                key: index,
                position: [
                    (Math.random() - 0.5) * 80,
                    1,
                    (Math.random() - 0.5) * 80,
                ],
                rotation: [0, Math.random() * Math.PI * 2, 0],
            });
        }
        return items;
    }, []);

    return (
        <>
            {instances.map((instance) => (
                <RigidBody
                    key={instance.key}
                    type="fixed" // ต้นไม้ไม่ขยับ
                    position={instance.position}
                    rotation={instance.rotation}
                >
                    <CylinderCollider
                        args={[4 / 2, 0.5]} // [halfHeight, radius]
                        position={[0, 4 / 2, 0]} // เลื่อนให้ฐาน collider อยู่ที่พื้น
                    />
                </RigidBody>
            ))}
            <Instances limit={count}>
                <cylinderGeometry args={[0.5, 0.8, 1.5]} />
                <meshToonMaterial color="saddlebrown" />
                {instances.map((instance) => (
                    <Instance
                        key={instance.key}
                        position={instance.position}
                        rotation={instance.rotation}
                    />
                ))}
            </Instances>
        </>
    );
}
