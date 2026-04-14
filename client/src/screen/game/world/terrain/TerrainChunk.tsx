// -Path: "PokeRotom/client/src/screen/game/world/terrain/TerrainChunk.tsx"
import * as THREE from 'three';
import { createNoise2D } from 'simplex-noise';
import { RigidBody } from '@react-three/rapier';
import { memo, useState, useEffect, Suspense } from 'react';
import Solidify from '$/screen/model/Solidify';
import type { BiomePreset } from '../data/biome';

interface TerrainChunkProps {
    seed: string;
    chunkX: number;
    chunkZ: number;
    segments: number;
    CHUNK_SIZE: number;
    patchNoiseFreq: number;
    getTerrainHeight: (x: number, z: number) => number;
    getBiomeConfig: (x: number, z: number) => BiomePreset;
    noise2D: ReturnType<typeof createNoise2D>;
}

function TerrainChunkComponent({
    seed,
    chunkX,
    chunkZ,
    noise2D,
    getTerrainHeight,
    getBiomeConfig,
    patchNoiseFreq,
    segments,
    CHUNK_SIZE,
}: TerrainChunkProps) {
    const [geometry, setGeometry] = useState<THREE.PlaneGeometry | null>(null);

    const centerX = chunkX * CHUNK_SIZE;
    const centerZ = chunkZ * CHUNK_SIZE;

    /** Generate geometry ใน useEffect เพื่อไม่ให้ Block Main Thread ตอน Render */
    useEffect(() => {
        let isCancelled = false;

        /** @description Stagger การเจนเพื่อไม่ให้ทุก Chunk แย่ง CPU พร้อมกัน */
        const staggerDelay = Math.random() * 300;
        const timer = setTimeout(() => {
            if (isCancelled) return;

            const geo = new THREE.PlaneGeometry(
                CHUNK_SIZE,
                CHUNK_SIZE,
                segments,
                segments,
            );
            geo.rotateX(-Math.PI / 2);

            const positions = geo.attributes.position.array as Float32Array;
            const colorArray = new Float32Array(positions.length);

            const tempColor = new THREE.Color();
            const biomeColor1 = new THREE.Color();
            const biomeColor2 = new THREE.Color();

            for (let index = 0; index < positions.length; index += 3) {
                const localX = positions[index];
                const localZ = positions[index + 2];
                const worldX = localX + centerX;
                const worldZ = localZ + centerZ;

                const height = getTerrainHeight(worldX, worldZ);
                positions[index + 1] = height;

                const biome = getBiomeConfig(worldX, worldZ);
                biomeColor1.setHex(biome.terrains.colors[0] as number);
                biomeColor2.setHex(biome.terrains.colors[1] as number);

                const patchNoise = noise2D(
                    worldX * patchNoiseFreq,
                    worldZ * patchNoiseFreq,
                );
                const mixFactor = THREE.MathUtils.clamp(
                    (patchNoise + 1) / 2,
                    0,
                    1,
                );

                tempColor.copy(biomeColor1).lerp(biomeColor2, mixFactor);
                colorArray[index] = tempColor.r;
                colorArray[index + 1] = tempColor.g;
                colorArray[index + 2] = tempColor.b;
            }

            geo.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));
            geo.computeVertexNormals();

            if (!isCancelled) setGeometry(geo);
        }, staggerDelay);

        return () => {
            isCancelled = true;
            clearTimeout(timer);
            if (geometry) geometry.dispose();
        };
    }, [
        seed,
        noise2D,
        centerX,
        centerZ,
        getTerrainHeight,
        getBiomeConfig,
        segments,
        patchNoiseFreq,
    ]);

    if (!geometry) return null;

    return (
        <Suspense fallback={null}>
            <RigidBody
                key={`${seed}-${centerX}-${centerZ}-${geometry.uuid}`}
                type="fixed"
                colliders="trimesh"
                position={[centerX, 0, centerZ]}
            >
                <mesh castShadow receiveShadow geometry={geometry}>
                    <meshToonMaterial vertexColors />
                    <Solidify thickness={0.04} />
                </mesh>
            </RigidBody>
        </Suspense>
    );
}

const TerrainChunk = memo(TerrainChunkComponent);
export default TerrainChunk;
