import React from 'react';

export default function Test() {
    return (
        <>
            {/* <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} /> */}
            <mesh position={[0, 0.5, 0]}>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial color="orange" />
            </mesh>
            {/* <gridHelper args={[20, 20]} /> */}
        </>
    );
}
