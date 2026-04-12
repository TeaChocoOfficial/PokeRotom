// -Path: "PokeRotom/client/src/screen/game/world/terrain/TerrainChunk.tsx"
import * as THREE from 'three';
import { memo, useMemo } from 'react';
import { createNoise2D } from 'simplex-noise';
import { RigidBody } from '@react-three/rapier';
import useNoise from '$/screen/game/world/hooks/noise';
import useChunk from '$/screen/game/world/hooks/chunk';

interface TerrainChunkProps {
    seed: string;
    chunkX: number;
    chunkZ: number;
    noise2D: ReturnType<typeof createNoise2D>;
}

const grassColor = new THREE.Color('#61b281');
const dirtColor = new THREE.Color('#8fb367');
const patchNoiseFreq = 0.04;

function TerrainChunkComponent({
    seed,
    chunkX,
    chunkZ,
    noise2D,
}: TerrainChunkProps) {
    const { getTerrainHeight } = useNoise();
    const { CHUNK_SIZE, CHUNK_SEGMENTS } = useChunk();

    const { originX, originZ } = useMemo(
        () => ({
            originX: chunkX * CHUNK_SIZE,
            originZ: chunkZ * CHUNK_SIZE,
        }),
        [chunkX, chunkZ, CHUNK_SIZE],
    );

    const { geometry } = useMemo(() => {
        const geo = new THREE.PlaneGeometry(
            CHUNK_SIZE,
            CHUNK_SIZE,
            CHUNK_SEGMENTS,
            CHUNK_SEGMENTS,
        );
        geo.rotateX(-Math.PI / 2);

        const positions = geo.attributes.position.array as Float32Array;
        const colors = new Float32Array(positions.length);

        for (let index = 0; index < positions.length; index += 3) {
            const localX = positions[index];
            const localZ = positions[index + 2];
            const worldX = localX + originX + CHUNK_SIZE / 2;
            const worldZ = localZ + originZ + CHUNK_SIZE / 2;

            const height = getTerrainHeight(noise2D, worldX, worldZ);
            positions[index + 1] = height;

            // คำนวณสีจาก noise อีกชั้นเพื่อให้มีลาย
            const patchNoise = noise2D(
                worldX * patchNoiseFreq,
                worldZ * patchNoiseFreq,
            );
            const mixFactor = THREE.MathUtils.clamp((patchNoise + 1) / 2, 0, 1);

            const finalColor = new THREE.Color()
                .copy(grassColor)
                .lerp(dirtColor, mixFactor);
            colors[index] = finalColor.r;
            colors[index + 1] = finalColor.g;
            colors[index + 2] = finalColor.b;
        }

        geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geo.computeVertexNormals();

        return { geometry: geo };
    }, [seed, noise2D, originX, originZ, getTerrainHeight]);

    return (
        <>
            <RigidBody
                key={`${seed}-${originX}-${originZ}-${geometry.uuid}`}
                type="fixed"
                colliders="trimesh"
                position={[
                    originX + CHUNK_SIZE / 2,
                    0,
                    originZ + CHUNK_SIZE / 2,
                ]}
            >
                <mesh castShadow receiveShadow geometry={geometry}>
                    <meshToonMaterial vertexColors />
                </mesh>
            </RigidBody>
        </>
    );
}

const TerrainChunk = memo(TerrainChunkComponent);
export default TerrainChunk;
