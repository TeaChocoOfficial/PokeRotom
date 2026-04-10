// -Path: "PokeRotom/client/src/screen/game/Lighting.tsx"
import { useControls } from 'leva';
import { Sky } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useGameStore } from '$/stores/gameStore';

export default function Lighting() {
    const { time, addTime, setTime } = useGameStore();
    const { daytime } = useControls('world', {
        daytime: {
            value: 1500,
            min: 0,
            max: 2400,
            step: 0.1,
        },
    });

    const hour = (time / 100) % 24;
    const sunDistance = 800;
    const isNight = hour < 6 || hour > 18;
    const fogColor = isNight ? '#020205' : '#4fa8ff';
    const ambientIntensity = isNight ? 0.2 : 0.6;
    const sunIntensity = isNight ? 0.4 : 1.5;
    const sunPosition: [number, number, number] = [
        Math.sin((hour / 24) * Math.PI * 2) * sunDistance,
        Math.cos((hour / 24) * Math.PI * 2 + Math.PI) * sunDistance,
        0,
    ];
    const moonPosition: [number, number, number] = [
        -sunPosition[0],
        -sunPosition[1],
        -sunPosition[2],
    ];

    useFrame((_, delta) => {
        addTime(delta * 10);
        setTime(daytime);
    });

    return (
        <>
            <color attach="background" args={[fogColor]} />
            <fog attach="fog" args={[fogColor, 100, 1500]} />
            <Sky sunPosition={sunPosition} turbidity={0.25} />

            {/* Sun */}
            <mesh position={sunPosition} name="sun">
                <sphereGeometry args={[40, 32, 32]} />
                <meshStandardMaterial
                    fog={false}
                    color="#ffdd44"
                    emissive="#ffdd44"
                    emissiveIntensity={5}
                />
                <pointLight intensity={500} distance={2000} />
            </mesh>

            {/* Moon */}
            <mesh position={moonPosition} name="moon">
                <sphereGeometry args={[25, 32, 32]} />
                <meshStandardMaterial
                    fog={false}
                    color="#f0f0ff"
                    emissive="#f0f0ff"
                    emissiveIntensity={2}
                />
                <pointLight intensity={100} distance={2000} />
            </mesh>

            {/* Lighting */}
            <ambientLight intensity={ambientIntensity} />
            <directionalLight
                castShadow
                intensity={sunIntensity}
                position={sunPosition[1] > 0 ? sunPosition : moonPosition}
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
                shadow-camera-far={2000}
                shadow-camera-left={-100}
                shadow-camera-right={100}
                shadow-camera-top={100}
                shadow-camera-bottom={-100}
            />

            {isNight && (
                <hemisphereLight
                    color="#112244"
                    groundColor="#000000"
                    intensity={0.5}
                />
            )}
        </>
    );
}
