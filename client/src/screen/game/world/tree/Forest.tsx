import { useMemo } from 'react';
import { Instance, Instances } from '@react-three/drei';
import { RigidBody, CylinderCollider } from '@react-three/rapier';
import { Vector3 } from '@react-three/fiber';

interface TreeProps {
    position: [number, number, number];
    scale?: number;
}

const Tree = ({ position, scale = 1 }: TreeProps) => {
    const trunkHeight = 4 * scale;
    const trunkRadius = 0.5 * scale;

    return (
        <RigidBody
            type="fixed" // ต้นไม้ไม่ขยับ
            position={position}
            colliders={false} // ปิด auto collider
        >
            {/* Collider รูปทรงกระบอกที่ลำต้น */}
            <CylinderCollider
                args={[trunkHeight / 2, trunkRadius]} // [halfHeight, radius]
                position={[0, trunkHeight / 2, 0]} // เลื่อนให้ฐาน collider อยู่ที่พื้น
            />

            {/* ตัว Mesh ของต้นไม้ */}
            <group>
                {/* ลำต้น */}
                <mesh
                    position={[0, trunkHeight / 2, 0]}
                    castShadow
                    receiveShadow
                >
                    <cylinderGeometry
                        args={[trunkRadius, trunkRadius * 1.1, trunkHeight, 8]}
                    />
                    <meshStandardMaterial color="#8B4513" />
                </mesh>

                {/* ใบไม้ (ทรงกลม) */}
                <mesh
                    position={[0, trunkHeight + 0.5 * scale, 0]}
                    castShadow
                    receiveShadow
                >
                    <sphereGeometry args={[1.2 * scale, 8, 8]} />
                    <meshStandardMaterial color="#2E8B57" />
                </mesh>
                <mesh
                    position={[
                        0.8 * scale,
                        trunkHeight - 0.3 * scale,
                        0.5 * scale,
                    ]}
                    castShadow
                    receiveShadow
                >
                    <sphereGeometry args={[1 * scale, 8, 8]} />
                    <meshStandardMaterial color="#3CB371" />
                </mesh>
                <mesh
                    position={[
                        -0.7 * scale,
                        trunkHeight - 0.2 * scale,
                        -0.6 * scale,
                    ]}
                    castShadow
                    receiveShadow
                >
                    <sphereGeometry args={[0.9 * scale, 8, 8]} />
                    <meshStandardMaterial color="#228B22" />
                </mesh>
            </group>
        </RigidBody>
    );
};

// การใช้งาน: สร้างต้นไม้หลายต้น
export const Forest = () => {
    const treePositions = useMemo(() => {
        const positions: [number, number, number][] = [];
        for (let i = 0; i < 200; i++) {
            positions.push([
                (Math.random() - 0.5) * 100,
                0,
                (Math.random() - 0.5) * 100,
            ]);
        }
        return positions;
    }, []);

    return (
        <>
            {treePositions.map((pos, i) => (
                <Tree
                    key={i}
                    position={pos}
                    scale={0.8 + Math.random() * 0.6}
                />
            ))}
        </>
    );
};
