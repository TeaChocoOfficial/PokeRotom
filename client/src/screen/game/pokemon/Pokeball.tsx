// -Path: "PokeRotom/client/src/screen/game/pokemon/Pokeball.tsx"
import { forwardRef } from 'react';
import { Euler, Vector3 } from '@react-three/fiber';

const Pokeball = forwardRef(
    (
        {
            open = 0,
            color = '#e63946',
            scale,
            rotation,
            position,
        }: {
            open?: number;
            color?: string;
            scale?: Vector3;
            rotation?: Euler;
            position?: Vector3;
        },
        ref,
    ) => {
        return (
            <group
                ref={ref}
                scale={scale}
                rotation={rotation}
                position={position}
            >
                {/* ครึ่งบน — ใช้ pivot ที่ขอบหลังเป็นบานพับ */}
                <group
                    name="top-pivot"
                    position={[0, 0, -1]}
                    rotation={[-(open / 100) * Math.PI * 0.75, 0, 0]}
                >
                    <group position={[0, 0, 1]}>
                        <mesh>
                            <sphereGeometry
                                args={[
                                    1,
                                    32,
                                    32,
                                    0,
                                    Math.PI * 2,
                                    0,
                                    Math.PI / 2,
                                ]}
                            />
                            <meshToonMaterial color={color} />
                        </mesh>
                        {/* แถบกลาง */}
                        <mesh>
                            <cylinderGeometry args={[1.02, 1.02, 0.125, 32]} />
                            <meshToonMaterial color="#1d1d1d" />
                        </mesh>
                        {/* ปุ่มกลาง */}
                        <mesh
                            position={[0, 0, 0.95]}
                            rotation={[Math.PI / 2, 0, 0]}
                        >
                            <cylinderGeometry args={[0.25, 0.25, 0.1, 32]} />
                            <meshToonMaterial color="#1d1d1d" />
                        </mesh>
                        <mesh
                            position={[0, 0, 0.975]}
                            rotation={[Math.PI / 2, 0, 0]}
                        >
                            <cylinderGeometry args={[0.18, 0.18, 0.1, 32]} />
                            <meshToonMaterial color="#f1f1f1" />
                        </mesh>
                        <mesh
                            position={[0, 0, 1.0]}
                            rotation={[Math.PI / 2, 0, 0]}
                        >
                            <cylinderGeometry args={[0.15, 0.15, 0.1, 32]} />
                            <meshToonMaterial color="#f1f1f1" />
                        </mesh>
                    </group>
                </group>
                {/* ครึ่งล่าง - ขาว */}
                <group name="bottom">
                    <mesh>
                        <sphereGeometry
                            args={[
                                1,
                                16,
                                16,
                                0,
                                Math.PI * 2,
                                Math.PI / 2,
                                Math.PI / 2,
                            ]}
                        />
                        <meshToonMaterial color="#f1f1f1" />
                    </mesh>
                    {/* แถบกลาง */}
                    <mesh position={[0, 0, 0]}>
                        <cylinderGeometry args={[1.02, 1.02, 0.125, 32]} />
                        <meshToonMaterial color="#1d1d1d" />
                    </mesh>
                </group>
            </group>
        );
    },
);

export default Pokeball;
