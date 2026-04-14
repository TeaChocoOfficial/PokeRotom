// types/map.types.ts
import type { Vector2 } from '@react-three/fiber';

// ขนาดของ Tile (ถ้าใช้ระบบ Grid)
export interface TileSize {
    width: number;
    height: number;
    depth: number;
}

// ประเภทของ Terrain/พื้น
export enum TerrainType {
    GRASS = 'grass',
    DIRT = 'dirt',
    SAND = 'sand',
    WATER = 'water',
    ROCK = 'rock',
    SNOW = 'snow',
    LAVA = 'lava',
    ROAD = 'road',
    PAVEMENT = 'pavement',
}

// ข้อมูลพื้นดินแต่ละ Tile
export interface TileData {
    position: Vector2; // grid position
    terrainType: TerrainType;
    height: number; // ความสูงจากระดับน้ำทะเล
    isWalkable: boolean;
    color?: string; // สำหรับ debug/editor
}
