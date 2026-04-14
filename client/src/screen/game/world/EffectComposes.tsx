// -Path: "PokeRotom/client/src/screen/game/world/EffectComposes.tsx"
import { useMemo } from 'react';
import { useControls } from 'leva';
import {
    SMAA,
    Bloom,
    Noise,
    Vignette,
    EffectComposer,
} from '@react-three/postprocessing';
import { Quality, BaseQuality, useSettingStore } from '$/stores/settingStore';
import Activity from '$/components/Activity';

/**
 * @description คอมโพเนนต์จัดการระบบ Post-processing
 * ปรับจูนคุณภาพอัตโนมัติตาม SettingStore และสามารถ Debug ผ่าน Leva ได้
 */
export default function EffectComposes() {
    const { quality, bloomQuality } = useSettingStore();

    /** @description ควบคุม Post-processing ผ่าน Leva สำหรับ Debug */
    const { enableVignette } = useControls('effects', {
        enableVignette: { value: true },
    });
    const enableSMAA = quality !== BaseQuality.LOW;
    const enableBloom = bloomQuality !== Quality.NONE;
    const enableNoise = quality === BaseQuality.HIGH;

    const { bloomThreshold, bloomIntensity } = useMemo(() => {
        switch (bloomQuality) {
            case Quality.NONE:
                return { bloomThreshold: 0, bloomIntensity: 0 };
            case Quality.LOW:
                return { bloomThreshold: 0.2, bloomIntensity: 0.2 };
            case Quality.MEDIUM:
                return { bloomThreshold: 0.7, bloomIntensity: 0.5 };
            case Quality.HIGH:
                return { bloomThreshold: 0.9, bloomIntensity: 1 };
        }
    }, [bloomQuality]);

    /** @description ตั้งค่าความลับระดับสูงตามคุณภาพของเครื่อง */
    const config = useMemo(() => {
        return {
            bloom: {
                intensity:
                    quality === BaseQuality.HIGH
                        ? bloomIntensity
                        : bloomIntensity * 0.7,
                threshold: bloomThreshold,
                mipmapBlur:
                    quality === BaseQuality.HIGH ||
                    quality === BaseQuality.MEDIUM,
            },
            noise: {
                opacity: quality === BaseQuality.HIGH ? 0.02 : 0,
            },
            smaa:
                quality === BaseQuality.HIGH || quality === BaseQuality.MEDIUM,
        };
    }, [quality, bloomIntensity, bloomThreshold]);

    return (
        <EffectComposer multisampling={0}>
            {/* Anti-aliasing สำหรับ High/Medium */}
            <Activity visible={enableSMAA && config.smaa}>
                <SMAA />
            </Activity>

            {/* แสงฟุ้งเรืองรอง */}
            <Activity visible={enableBloom}>
                <Bloom
                    intensity={config.bloom.intensity}
                    luminanceThreshold={config.bloom.threshold}
                    mipmapBlur={config.bloom.mipmapBlur}
                />
            </Activity>

            {/* ขอบมืดเสริมอารมณ์หนัง */}
            <Activity visible={enableVignette}>
                <Vignette eskil={false} offset={0.1} darkness={0.9} />
            </Activity>

            {/* Noise เพื่อความดิบของภาพ */}
            <Activity visible={enableNoise && config.noise.opacity > 0}>
                <Noise opacity={config.noise.opacity} />
            </Activity>
        </EffectComposer>
    );
}
