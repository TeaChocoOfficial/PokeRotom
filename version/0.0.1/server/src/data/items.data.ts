//-Path: "PokeRotom/server/src/inventory/items.data.ts"
import { ItemDto } from 'src/inventory/dto/item.dto';
import { EnvConfig } from 'src/secure/dto/secure.dto';

export function getAllItems(envConfig: EnvConfig): ItemDto[] {
    const clientUrl = (path: string) => envConfig.CLIENT_URL + path;
    const githubusercontentUrl = (name: string) =>
        `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${name}.png`;

    return [
        // Poké Balls
        {
            id: 0,
            name: 'Rotom Ball',
            category: 'ball',
            price: 100,
            img: clientUrl('/rotom ball.svg'),
            desc: 'ใช้จับโปเกมอนป่า',
        },
        {
            id: 1,
            name: 'Poké Ball',
            category: 'ball',
            price: 200,
            img: githubusercontentUrl('poke-ball'),
            desc: 'ใช้จับโปเกมอนป่า',
        },
        {
            id: 2,
            name: 'Great Ball',
            category: 'ball',
            price: 600,
            img: githubusercontentUrl('great-ball'),
            desc: 'มีอัตราจับสูงกว่า Poké Ball',
        },
        {
            id: 3,
            name: 'Ultra Ball',
            category: 'ball',
            price: 1200,
            img: githubusercontentUrl('ultra-ball'),
            desc: 'มีอัตราจับสูงมาก',
        },
        {
            id: 4,
            name: 'Master Ball',
            category: 'ball',
            price: 10000,
            img: githubusercontentUrl('master-ball'),
            desc: 'จับได้ทุกตัวอย่างแน่นอน',
        },

        // Medicine
        {
            id: 5,
            name: 'Potion',
            category: 'medicine',
            price: 300,
            img: githubusercontentUrl('potion'),
            desc: 'ฟื้นฟู HP 20 แต้ม',
        },
        {
            id: 6,
            name: 'Super Potion',
            category: 'medicine',
            price: 700,
            img: githubusercontentUrl('super-potion'),
            desc: 'ฟื้นฟู HP 50 แต้ม',
        },
        {
            id: 7,
            name: 'Hyper Potion',
            category: 'medicine',
            price: 1200,
            img: githubusercontentUrl('hyper-potion'),
            desc: 'ฟื้นฟู HP 200 แต้ม',
        },
        {
            id: 8,
            name: 'Revive',
            category: 'medicine',
            price: 1500,
            img: githubusercontentUrl('revive'),
            desc: 'ฟื้นฟูโปเกมอนที่หมดแรง',
        },

        // Key Items (Limited availability or expensive)
        {
            id: 9,
            name: 'Rare Candy',
            category: 'key',
            price: 4800,
            img: githubusercontentUrl('rare-candy'),
            desc: 'เพิ่มเลเวลโปเกมอน 1 เลเวล',
        },
        {
            id: 10,
            name: 'Rotom Phone',
            category: 'key',
            price: 0,
            img: clientUrl('rotom phone'),
            desc: 'โทรศัพท์อเนกประสงค์',
        },
        {
            id: 11,
            name: 'Bicycle',
            category: 'key',
            price: 50000,
            img: clientUrl('bicycle'),
            desc: 'จักรยานสำหรับเดินทางเร็ว',
        },

        // Berries
        {
            id: 12,
            name: 'Oran Berry',
            category: 'berry',
            price: 100,
            img: githubusercontentUrl('oran-berry'),
            desc: 'ฟื้นฟู HP 10 แต้ม',
        },
        {
            id: 13,
            name: 'Sitrus Berry',
            category: 'berry',
            price: 400,
            img: githubusercontentUrl('sitrus-berry'),
            desc: 'ฟื้นฟู HP จำนวนหนึ่ง',
        },
        {
            id: 14,
            name: 'Lum Berry',
            category: 'berry',
            price: 600,
            img: githubusercontentUrl('lum-berry'),
            desc: 'รักษาอาการผิดปกติทุกอย่าง',
        },
    ];
}
