import { useMemo } from 'react';
import { RigidBody, CylinderCollider } from '@react-three/rapier';
import { Instances, Instance } from '@react-three/drei';

// --- ข้อมูลต้นไม้แต่ละต้น ---
interface TreeData {
    id: number;
    position: [number, number, number];
    scale: number;
}

// --- Component หลัก ---
const ForestWithInstances = () => {
    // สร้างข้อมูลต้นไม้ทั้งหมด
    const trees = useMemo<TreeData[]>(() => {
        const count = 200;
        return Array.from({ length: count }, (_, i) => ({
            id: i,
            position: [
                (Math.random() - 0.5) * 100, // x
                0, // y (พื้น)
                (Math.random() - 0.5) * 100, // z
            ],
            scale: 0.6 + Math.random() * 0.8,
        }));
    }, []);

    return (
        <>
            {/* ========== ส่วนที่ 1: แสดงผลด้วย Instances ========== */}
            <Instances limit={trees.length}>
                {/* ต้นแบบลำต้น */}
                <cylinderGeometry args={[0.5, 0.55, 4, 8]} />
                <meshStandardMaterial color="#8B4513" roughness={0.7} />

                {/* สร้าง Instance สำหรับลำต้นทุกต้น */}
                {trees.map((tree) => (
                    <Instance
                        key={tree.id}
                        position={tree.position}
                        scale={tree.scale}
                    />
                ))}
            </Instances>

            {/* ต้นแบบใบไม้ (แยก Instances เพราะใช้ Geometry คนละแบบ) */}
            <Instances limit={trees.length * 3}>
                <sphereGeometry args={[1, 6, 6]} />
                <meshStandardMaterial color="#2E8B57" roughness={0.4} />

                {trees.map((tree) => {
                    const [x, y, z] = tree.position;
                    const trunkHeight = 4 * tree.scale;
                    const leafScale = tree.scale * 0.8;

                    return (
                        <group key={tree.id}>
                            {/* ใบไม้ก้อนที่ 1 (บนสุด) */}
                            <Instance
                                position={[
                                    x,
                                    y + trunkHeight + 0.5 * tree.scale,
                                    z,
                                ]}
                                scale={[
                                    leafScale * 1.2,
                                    leafScale,
                                    leafScale * 1.2,
                                ]}
                            />
                            {/* ใบไม้ก้อนที่ 2 (ขวา) */}
                            <Instance
                                position={[
                                    x + 0.8 * tree.scale,
                                    y + trunkHeight - 0.3 * tree.scale,
                                    z + 0.5 * tree.scale,
                                ]}
                                scale={leafScale}
                            />
                            {/* ใบไม้ก้อนที่ 3 (ซ้าย) */}
                            <Instance
                                position={[
                                    x - 0.7 * tree.scale,
                                    y + trunkHeight - 0.2 * tree.scale,
                                    z - 0.6 * tree.scale,
                                ]}
                                scale={[
                                    leafScale * 0.9,
                                    leafScale * 0.9,
                                    leafScale * 0.9,
                                ]}
                            />
                        </group>
                    );
                })}
            </Instances>

            {/* ========== ส่วนที่ 2: สร้าง Collider แยกแต่ละต้น ========== */}
            {trees.map((tree) => {
                const [x, y, z] = tree.position;
                const trunkHeight = 4 * tree.scale;
                const trunkRadius = 0.5 * tree.scale;

                return (
                    <RigidBody
                        key={`collider-${tree.id}`}
                        type="fixed"
                        position={[x, y, z]}
                        colliders={false}
                    >
                        <CylinderCollider
                            args={[trunkHeight / 2, trunkRadius]}
                            position={[0, trunkHeight / 2, 0]}
                        />
                    </RigidBody>
                );
            })}
        </>
    );
};

export default ForestWithInstances;
