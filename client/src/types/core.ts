// -Path: "PokeRotom/client/src/types/core.ts"
import type { TileData, TileSize } from './map';
import type { Vector3 } from '@react-three/fiber';
import type { EntityType, GameEntity } from './entity';

// แต่ละ Layer ในแผนที่
export interface MapLayer {
    id: string;
    name: string;
    visible: boolean;
    zIndex: number;
    tiles?: TileData[];
    entities?: GameEntity[];
    opacity?: number;
}

// Navigation Mesh (สำหรับ pathfinding)
export interface NavMeshNode {
    id: string;
    position: Vector3;
    connections: string[]; // ids ของ nodes ที่เชื่อมต่อ
    cost: number;
    isBlocked: boolean;
}

// Map Data ที่สมบูรณ์
export interface GameMap {
    id: string;
    name: string;
    size: {
        width: number; // จำนวน tiles ในแนวนอน
        height: number; // จำนวน tiles ในแนวตั้ง
    };
    tileSize: TileSize;

    // พื้นฐาน terrain data
    terrain: Map<string, TileData>; // key: `${x},${y}`

    // Entities แยกตาม type เพื่อ performance
    entities: {
        byId: Map<string, GameEntity>;
        byType: Map<EntityType, string[]>; // ids ของ entity แต่ละ type
        byPosition: Map<string, string[]>; // key: `${x},${y},${z}`
    };

    // Layers (สำหรับ parallax, effects ฯลฯ)
    layers: MapLayer[];

    // Navigation
    navMesh: NavMeshNode[];

    // Environment settings
    environment: {
        ambientLight: string; // hex color
        fogColor?: string;
        fogDensity?: number;
        backgroundColor: string;
        musicId?: string;
    };

    // Warps/Transitions ไป map อื่น
    warps: WarpPoint[];

    // Metadata สำหรับ editor
    metadata: {
        version: string;
        author: string;
        createdAt: number;
        lastModified: number;
        tags: string[];
    };
}

// จุดเชื่อมต่อไปยัง map อื่น
export interface WarpPoint {
    id: string;
    fromPosition: Vector3;
    toMapId: string;
    toPosition: Vector3;
    requiredCondition?: (player: any) => boolean;
    animation?: 'fade' | 'door' | 'stairs';
}
