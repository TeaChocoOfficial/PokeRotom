// types/entity.types.ts

import type { Vector3 } from '@react-three/fiber';
import type { DialogueTree } from './dialogue';

// Base Entity (ทุกอย่างในเกมสืบทอดจากนี้)
export interface BaseEntity {
    id: string;
    scale?: Vector3;
    position: Vector3;
    rotation?: Vector3;
}

// ประเภทของ Entity
export enum EntityType {
    // Environment
    TREE = 'tree',
    ROCK = 'rock',
    FLOWER = 'flower',
    BUSH = 'bush',

    // Buildings
    HOUSE = 'house',
    POKEMON_CENTER = 'pokemon_center',
    POKEMART = 'pokemart',
    GYM = 'gym',
    LAB = 'lab',

    // NPCs
    NPC = 'npc',
    TRAINER = 'trainer',
    SHOP_KEEPER = 'shop_keeper',

    // Interactive
    DOOR = 'door',
    CHEST = 'chest',
    SIGN = 'sign',
}

// Environment Entity
export interface EnvironmentEntity extends BaseEntity {
    type:
        | EntityType.TREE
        | EntityType.ROCK
        | EntityType.FLOWER
        | EntityType.BUSH;
    variant: string; // เช่น 'oak', 'pine', 'palm'
    size: 'small' | 'medium' | 'large';
}

// Building Entity
export interface BuildingEntity extends BaseEntity {
    type:
        | EntityType.HOUSE
        | EntityType.POKEMON_CENTER
        | EntityType.POKEMART
        | EntityType.GYM
        | EntityType.LAB;
    name: string;
    entrance: Vector3; // ตำแหน่งทางเข้า
    interiorMapId?: string; // link ไปยัง interior map
    isEnterable: boolean;
    openingHours?: { open: number; close: number };
}

// NPC Entity
export interface NPCData {
    id: string;
    name: string;
    spriteId: string;
    dialogue: string[] | DialogueTree;
    movementPattern: 'stationary' | 'patrol' | 'random' | 'follow';
    patrolPoints?: Vector3[];
    interactionRadius: number;
}

export interface NPCEntity extends BaseEntity {
    type: EntityType.NPC;
    npcData: NPCData;
    isInteractable: boolean;
}

// Interactive Entity
export interface InteractiveEntity extends BaseEntity {
    type: EntityType.DOOR | EntityType.CHEST | EntityType.SIGN;
    interactionType: 'trigger' | 'click' | 'auto';
    action: (player: any) => void; // หรือใช้ event system
    isLocked?: boolean;
    requiredItem?: string;
}

// Union type ของ Entity ทั้งหมด
export type GameEntity =
    | EnvironmentEntity
    | BuildingEntity
    | NPCEntity
    | InteractiveEntity;
