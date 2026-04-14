// -Path: "PokeRotom/client/src/screen/model/Solidify.tsx"
import * as THREE from 'three';
import { useLayoutEffect, useRef } from 'react';

/**
 * @description Solidify component สำหรับสร้าง Outline แบบ Inverted Hull
 * โดยจะไปหยิบ Geometry จาก Parent Mesh มาใช้โดยอัตโนมัติ
 */
export default function Solidify({
    color = '#3a1a1a',
    thickness = 0.03,
}: {
    color?: string;
    thickness?: number;
}) {
    const meshRef = useRef<THREE.Mesh>(null);

    useLayoutEffect(() => {
        const currentMesh = meshRef.current;
        if (currentMesh && currentMesh.parent instanceof THREE.Mesh)
            currentMesh.geometry = currentMesh.parent.geometry;
    }, []);

    return (
        <mesh ref={meshRef} castShadow={false} receiveShadow={false}>
            <shaderMaterial
                transparent
                side={THREE.BackSide}
                uniforms={{
                    uColor: { value: new THREE.Color(color) },
                    uThickness: { value: thickness },
                }}
                vertexShader={`
                    uniform float uThickness;
                    void main() {
                        vec3 newPosition = position + (normal * uThickness);
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
                    }
                `}
                fragmentShader={`
                    uniform vec3 uColor;
                    void main() {
                        gl_FragColor = vec4(uColor, 1.0);
                    }
                `}
            />
        </mesh>
    );
}
