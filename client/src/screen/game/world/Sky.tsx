// -Path: "PokeRotom/client/src/screen/game/world/Sky.tsx"
import * as THREE from 'three';
import { useMemo } from 'react';
import useChunk from './hooks/chunk';
import { useGameStore } from '$/stores/gameStore';
import { Cloud, Clouds } from '@react-three/drei';

/**
 * @description Sky Component
 * จัดการก้อนเมฆแบบกึ่ง Procedural ที่คอยวาร์ปตามผู้เล่นไปเรื่อยๆ (Infinite Clouds)
 * และมีระบบเลื่อนตำแหน่งตามเวลาเพื่อให้ดูมีชีวิตชีวา
 */
export default function Sky() {
    const { chunk } = useGameStore();
    const { CHUNK_SIZE } = useChunk();

    // แสดงผลเมฆในระยะวงกลมรอบตัวผู้เล่นเพื่อให้คลอบคลุมสายตาและประหยัดทรัพยากร
    const visibleClouds = useMemo(() => {
        const clouds = [];
        const range = 4; // เพิ่มระยะเพื่อให้เห็นเมฆได้ไกลขึ้น
        const rangeSq = range * range;

        for (let x = -range; x <= range; x++) {
            for (let z = -range; z <= range; z++) {
                if (x * x + z * z <= rangeSq) {
                    const cx = chunk.x + x;
                    const cz = chunk.z + z;
                    clouds.push({ x: cx, z: cz, key: `${cx}_${cz}` });
                }
            }
        }
        return clouds;
    }, [chunk.x, chunk.z]);

    return (
        <group>
            <Clouds
                frustumCulled={false}
                material={THREE.MeshLambertMaterial}
                limit={1000}
            >
                {visibleClouds.map((cloud) => (
                    <group
                        key={cloud.key}
                        position={[
                            cloud.x * CHUNK_SIZE,
                            64,
                            cloud.z * CHUNK_SIZE,
                        ]}
                    >
                        {/* เมฆก้อนใหญ่กระจัดกระจาย */}
                        <Cloud
                            seed={cloud.x * 123 + cloud.z * 456}
                            bounds={[CHUNK_SIZE, 5, CHUNK_SIZE]}
                            volume={CHUNK_SIZE / 2}
                            color="white"
                            segments={20}
                            opacity={0.4}
                            speed={0.1}
                            growth={4}
                            position={[0, 45, 0]}
                        />
                        {/* เมฆก้อนเล็กจางๆ เพิ่มรายละเอียด */}
                        <Cloud
                            seed={cloud.x * 789 + cloud.z * 101}
                            bounds={[CHUNK_SIZE, 2, CHUNK_SIZE]}
                            volume={CHUNK_SIZE / 3}
                            color="#f0faff"
                            segments={10}
                            opacity={0.2}
                            speed={0.05}
                            position={[CHUNK_SIZE / 4, 55, CHUNK_SIZE / 4]}
                        />
                    </group>
                ))}
            </Clouds>
        </group>
    );
}
