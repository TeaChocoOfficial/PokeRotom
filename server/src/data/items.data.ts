//-Path: "PokeRotom/server/src/inventory/items.data.ts"
import { EnvConfig } from 'src/secure/dto/secure.dto';

export interface Item {
    id: number;
    name: string;
    category: 'ball' | 'medicine' | 'key' | 'berry';
    price: number;
    icon?: string;
    img?: string;
    desc: string;
}

export function getAllItems(envConfig: EnvConfig): Item[] {
    return [
        // Poké Balls
        {
            id: 0,
            name: 'Rotom Ball',
            category: 'ball',
            price: 100,
            img: envConfig.CLIENT_URL + '/rotom ball.svg',
            desc: 'ใช้จับโปเกมอนป่า',
        },
        {
            id: 1,
            name: 'Poké Ball',
            category: 'ball',
            price: 200,
            icon: '🔴',
            desc: 'ใช้จับโปเกมอนป่า',
        },
        {
            id: 2,
            name: 'Great Ball',
            category: 'ball',
            price: 600,
            icon: '🔵',
            desc: 'มีอัตราจับสูงกว่า Poké Ball',
        },
        {
            id: 3,
            name: 'Ultra Ball',
            category: 'ball',
            price: 1200,
            icon: '🟡',
            desc: 'มีอัตราจับสูงมาก',
        },
        {
            id: 4,
            name: 'Master Ball',
            category: 'ball',
            price: 10000,
            icon: '🟣',
            desc: 'จับได้ทุกตัวอย่างแน่นอน',
        },

        // Medicine
        {
            id: 5,
            name: 'Potion',
            category: 'medicine',
            price: 300,
            icon: '💊',
            desc: 'ฟื้นฟู HP 20 แต้ม',
        },
        {
            id: 6,
            name: 'Super Potion',
            category: 'medicine',
            price: 700,
            icon: '💉',
            desc: 'ฟื้นฟู HP 50 แต้ม',
        },
        {
            id: 7,
            name: 'Hyper Potion',
            category: 'medicine',
            price: 1200,
            icon: '🧪',
            desc: 'ฟื้นฟู HP 200 แต้ม',
        },
        {
            id: 8,
            name: 'Revive',
            category: 'medicine',
            price: 1500,
            icon: '⭐',
            desc: 'ฟื้นฟูโปเกมอนที่หมดแรง',
        },

        // Key Items (Limited availability or expensive)
        {
            id: 9,
            name: 'Rare Candy',
            category: 'key',
            price: 4800,
            icon: '🍬',
            desc: 'เพิ่มเลเวลโปเกมอน 1 เลเวล',
        },
        {
            id: 10,
            name: 'Rotom Phone',
            category: 'key',
            price: 0,
            icon: '📱',
            desc: 'โทรศัพท์อเนกประสงค์',
        },
        {
            id: 11,
            name: 'Bicycle',
            category: 'key',
            price: 50000,
            icon: '🚲',
            desc: 'จักรยานสำหรับเดินทางเร็ว',
        },

        // Berries
        {
            id: 12,
            name: 'Oran Berry',
            category: 'berry',
            price: 100,
            icon: '🫐',
            desc: 'ฟื้นฟู HP 10 แต้ม',
        },
        {
            id: 13,
            name: 'Sitrus Berry',
            category: 'berry',
            price: 400,
            icon: '🍊',
            desc: 'ฟื้นฟู HP จำนวนหนึ่ง',
        },
        {
            id: 14,
            name: 'Lum Berry',
            category: 'berry',
            price: 600,
            icon: '🍇',
            desc: 'รักษาอาการผิดปกติทุกอย่าง',
        },
    ];
}
