// - Path: "PokeRotom/client/src/components/ItemImg.tsx"
import { Item } from '../types/inventory';
import { Pokemon } from '../types/pokemon';

function Image({
    src,
    alt,
    className,
}: {
    src: string;
    alt: string;
    className?: string;
}) {
    return (
        <img
            src={src}
            alt={alt}
            loading="lazy"
            className={className}
            onError={(e) => {
                e.currentTarget.style.display = 'none';
            }}
        />
    );
}

export function ItemImg({
    item,
    className,
}: {
    item: Item;
    className?: string;
}) {
    return (
        <Image
            src={
                item.img ??
                `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${item.id}.png`
            }
            alt={item.name}
            className={className}
        />
    );
}

export function PokemonImg({
    pokemon,
    className,
}: {
    pokemon: Pokemon;
    className?: string;
}) {
    return (
        <Image
            src={
                pokemon.img ??
                `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`
            }
            alt={pokemon.name}
            className={className}
        />
    );
}
