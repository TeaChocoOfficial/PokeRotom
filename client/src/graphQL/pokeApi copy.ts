//-Path: "PokeRotom/client/src/graphQL/pokeApi.ts"
import { gql, HttpLink, ApolloClient, InMemoryCache } from '@apollo/client';

export const pokeClient = new ApolloClient({
    link: new HttpLink({ uri: 'https://beta.pokeapi.co/graphql/v1beta2' }),
    cache: new InMemoryCache(),
});

export const GET_POKEMON_LIST = gql`
    query GetPokemonList(
        $limit: Int
        $offset: Int
        $where: pokemon_v2_pokemon_bool_exp
    ) {
        pokemon_v2_pokemon(
            limit: $limit
            offset: $offset
            where: $where
            order_by: { id: asc }
        ) {
            id
            name
            pokemon_v2_pokemonsprites {
                sprites
            }
        }
    }
`;

export const GET_POKEMON_DETAIL = gql`
    query GetPokemonDetail($id: Int!) {
        pokemon_v2_pokemon_by_pk(id: $id) {
            id
            name
            height
            weight
            pokemon_v2_pokemonsprites {
                sprites
            }
            pokemon_v2_pokemonabilities {
                is_hidden
                pokemon_v2_ability {
                    name
                }
            }
            pokemon_v2_pokemontypes {
                pokemon_v2_type {
                    name
                }
            }
            pokemon_v2_pokemonstats {
                base_stat
                pokemon_v2_stat {
                    name
                }
            }
            pokemon_v2_pokemonspecy {
                generation_id
                pokemon_v2_pokemonspeciesflavortexts(
                    where: { language_id: { _eq: 9 } }
                    limit: 1
                ) {
                    flavor_text
                }
            }
        }
    }
`;

export const GET_ITEM_LIST = gql`
    query GetItemList(
        $limit: Int
        $offset: Int
        $where: pokemon_v2_item_bool_exp
        $order_by: [pokemon_v2_item_order_by!]
    ) {
        pokemon_v2_item(
            limit: $limit
            offset: $offset
            where: $where
            order_by: $order_by
        ) {
            id
            name
            cost
            pokemon_v2_itemcategory {
                name
            }
            pokemon_v2_itemflavortexts(
                where: { language_id: { _eq: 9 } }
                limit: 1
            ) {
                flavor_text
            }
            pokemon_v2_itemsprites {
                sprites
            }
        }
    }
`;

export const GET_ITEM_CATEGORIES = gql`
    query GetItemCategories {
        pokemon_v2_itemcategory(order_by: { name: asc }) {
            id
            name
        }
    }
`;

export const GET_MOVE_LIST = gql`
    query GetMoveList(
        $limit: Int
        $offset: Int
        $where: pokemon_v2_move_bool_exp
    ) {
        pokemon_v2_move(
            limit: $limit
            offset: $offset
            where: $where
            order_by: { id: asc }
        ) {
            id
            name
            accuracy
            power
            pp
            pokemon_v2_type {
                name
            }
            pokemon_v2_moveflavortexts(
                where: { language_id: { _eq: 9 } }
                limit: 1
            ) {
                flavor_text
            }
        }
    }
`;

export const GET_ABILITY_LIST = gql`
    query GetAbilityList(
        $limit: Int
        $offset: Int
        $where: pokemon_v2_ability_bool_exp
    ) {
        pokemon_v2_ability(
            limit: $limit
            offset: $offset
            where: $where
            order_by: { id: asc }
        ) {
            id
            name
            pokemon_v2_abilityflavortexts(
                where: { language_id: { _eq: 9 } }
                limit: 1
            ) {
                flavor_text
            }
        }
    }
`;

export const GET_TYPE_LIST = gql`
    query GetTypeList {
        pokemon_v2_type(where: { id: { _lt: 10000 } }) {
            id
            name
        }
    }
`;

export const GET_NATURE_LIST = gql`
    query GetNatureList {
        pokemon_v2_nature(order_by: { name: asc }) {
            id
            name
            likes_flavor_id
            hates_flavor_id
            increased_stat_id
            decreased_stat_id
        }
    }
`;

export const GET_ITEM_DETAIL = gql`
    query GetItemDetail($id: Int!) {
        pokemon_v2_item_by_pk(id: $id) {
            id
            name
            cost
            pokemon_v2_itemflavortexts(
                where: { language_id: { _eq: 9 } }
                limit: 1
            ) {
                flavor_text
            }
            pokemon_v2_itemcategory {
                name
            }
            pokemon_v2_itemeffecttexts(
                where: { language_id: { _eq: 9 } }
                limit: 1
            ) {
                short_effect
                effect
            }
            pokemon_v2_itemsprites {
                sprites
            }
        }
    }
`;

export const GET_MOVE_DETAIL = gql`
    query GetMoveDetail($id: Int!) {
        pokemon_v2_move_by_pk(id: $id) {
            id
            name
            accuracy
            power
            pp
            priority
            pokemon_v2_moveflavortexts(
                where: { language_id: { _eq: 9 } }
                limit: 1
            ) {
                flavor_text
            }
            pokemon_v2_type {
                name
            }
            pokemon_v2_movelearnmethods {
                pokemon_v2_movelearnmethod {
                    name
                }
            }
            pokemon_v2_movedamageclass {
                name
            }
        }
    }
`;

export const GET_ABILITY_DETAIL = gql`
    query GetAbilityDetail($id: Int!) {
        pokemon_v2_ability_by_pk(id: $id) {
            id
            name
            pokemon_v2_abilityflavortexts(
                where: { language_id: { _eq: 9 } }
                limit: 1
            ) {
                flavor_text
            }
            pokemon_v2_abilityeffecttexts(
                where: { language_id: { _eq: 9 } }
                limit: 1
            ) {
                short_effect
                effect
            }
        }
    }
`;
