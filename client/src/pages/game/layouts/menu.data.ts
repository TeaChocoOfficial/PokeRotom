// -Path: "PokeRotom/client/src/pages/game/layouts/menu.data.ts"
import {
    Swords,
    Monitor,
    BookOpen,
    TreePine,
    Backpack,
    ShoppingBag,
    ArrowLeftRight,
} from 'lucide-react';

export const freeMenuItems = [
    {
        path: '/game/pokemon',
        icon: Swords,
        label: 'Pokémon',
        desc: 'จัดการโปเกมอนในทีม (สูงสุด 6 ตัว)',
        color: 'from-yellow-500 to-orange-500',
    },
    {
        path: '/game/pc',
        icon: Monitor,
        label: 'PC',
        desc: 'ดูโปเกมอนที่จับมาได้ทั้งหมด',
        color: 'from-cyan-500 to-blue-500',
    },
    {
        path: '/game/pokedex',
        icon: BookOpen,
        label: 'Pokédex',
        desc: 'ค้นหาข้อมูลโปเกมอนทั้งหมด',
        color: 'from-red-500 to-orange-500',
    },
    {
        path: '/game/shop',
        icon: ShoppingBag,
        label: 'Shop',
        desc: 'ซื้อไอเทมและอุปกรณ์ต่างๆ',
        color: 'from-blue-500 to-cyan-500',
    },
    {
        path: '/game/bag',
        icon: Backpack,
        label: 'Bag',
        desc: 'จัดการไอเทมในกระเป๋า',
        color: 'from-purple-500 to-pink-500',
    },
];

export const roomMenuItems = [
    {
        path: '/game/wild',
        icon: TreePine,
        label: 'Wild',
        desc: 'สำรวจและจับโปเกมอนป่า',
        color: 'from-green-500 to-emerald-500',
    },
    {
        path: '/game/trade',
        icon: ArrowLeftRight,
        label: 'Trade',
        desc: 'แลกเปลี่ยนโปเกมอนกับเทรนเนอร์คนอื่น',
        color: 'from-purple-500 to-violet-500',
    },
    {
        path: '/game/battle',
        icon: Swords,
        label: 'Battle',
        desc: 'ท้าสู้กับเทรนเนอร์คนอื่น',
        color: 'from-red-500 to-rose-500',
    },
];
