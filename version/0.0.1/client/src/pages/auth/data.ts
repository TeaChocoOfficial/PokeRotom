// -Path: "PokeRotom/client/src/pages/auth/data.ts"

export const spriteBase =
    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork';

export interface StarterInfo {
    id: number;
    name: string;
    type: 'Grass' | 'Fire' | 'Water';
}

export interface GenGroup {
    gen: number;
    label: string;
    region: string;
    starters: StarterInfo[];
}

export const typeColors: Record<
    string,
    { border: string; glow: string; bg: string; accent: string }
> = {
    Grass: {
        bg: 'bg-green-500/10',
        glow: 'shadow-green-500/40',
        border: 'border-green-500',
        accent: '#22c55e',
    },
    Fire: {
        bg: 'bg-orange-500/10',
        glow: 'shadow-orange-500/40',
        border: 'border-orange-500',
        accent: '#f97316',
    },
    Water: {
        bg: 'bg-blue-500/10',
        glow: 'shadow-blue-500/40',
        border: 'border-blue-500',
        accent: '#3b82f6',
    },
};

export const generations: GenGroup[] = [
    {
        gen: 1,
        label: 'Gen I',
        region: 'Kanto',
        starters: [
            { id: 1, name: 'Bulbasaur', type: 'Grass' },
            { id: 4, name: 'Charmander', type: 'Fire' },
            { id: 7, name: 'Squirtle', type: 'Water' },
        ],
    },
    {
        gen: 2,
        label: 'Gen II',
        region: 'Johto',
        starters: [
            { id: 152, name: 'Chikorita', type: 'Grass' },
            { id: 155, name: 'Cyndaquil', type: 'Fire' },
            { id: 158, name: 'Totodile', type: 'Water' },
        ],
    },
    {
        gen: 3,
        label: 'Gen III',
        region: 'Hoenn',
        starters: [
            { id: 252, name: 'Treecko', type: 'Grass' },
            { id: 255, name: 'Torchic', type: 'Fire' },
            { id: 258, name: 'Mudkip', type: 'Water' },
        ],
    },
    {
        gen: 4,
        label: 'Gen IV',
        region: 'Sinnoh',
        starters: [
            { id: 387, name: 'Turtwig', type: 'Grass' },
            { id: 390, name: 'Chimchar', type: 'Fire' },
            { id: 393, name: 'Piplup', type: 'Water' },
        ],
    },
    {
        gen: 5,
        label: 'Gen V',
        region: 'Unova',
        starters: [
            { id: 495, name: 'Snivy', type: 'Grass' },
            { id: 498, name: 'Tepig', type: 'Fire' },
            { id: 501, name: 'Oshawott', type: 'Water' },
        ],
    },
    {
        gen: 6,
        label: 'Gen VI',
        region: 'Kalos',
        starters: [
            { id: 650, name: 'Chespin', type: 'Grass' },
            { id: 653, name: 'Fennekin', type: 'Fire' },
            { id: 656, name: 'Froakie', type: 'Water' },
        ],
    },
    {
        gen: 7,
        label: 'Gen VII',
        region: 'Alola',
        starters: [
            { id: 722, name: 'Rowlet', type: 'Grass' },
            { id: 725, name: 'Litten', type: 'Fire' },
            { id: 728, name: 'Popplio', type: 'Water' },
        ],
    },
    {
        gen: 8,
        label: 'Gen VIII',
        region: 'Galar',
        starters: [
            { id: 810, name: 'Grookey', type: 'Grass' },
            { id: 813, name: 'Scorbunny', type: 'Fire' },
            { id: 816, name: 'Sobble', type: 'Water' },
        ],
    },
    {
        gen: 9,
        label: 'Gen IX',
        region: 'Paldea',
        starters: [
            { id: 906, name: 'Sprigatito', type: 'Grass' },
            { id: 909, name: 'Fuecoco', type: 'Fire' },
            { id: 912, name: 'Quaxly', type: 'Water' },
        ],
    },
];
