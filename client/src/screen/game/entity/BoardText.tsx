// -Path: "PokeRotom/client/src/screen/game/entity/BoardText.tsx"
import { Billboard, Text } from '@react-three/drei';
import type { ReactThreeFiber, Vector3 } from '@react-three/fiber';

export default function BoardText({
    text,
    position,
    color = 0xffffff,
    outlineColor = 0x000000,
}: {
    text?: string;
    position: Vector3;
    color?: ReactThreeFiber.Color;
    outlineColor?: ReactThreeFiber.Color;
}) {
    return (
        <Billboard position={position}>
            <Text
                fontSize={0.3}
                color={color}
                anchorX="center"
                anchorY="bottom"
                outlineWidth={0.02}
                outlineColor={outlineColor}
            >
                {text}
            </Text>
        </Billboard>
    );
}
