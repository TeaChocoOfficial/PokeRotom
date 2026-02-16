//-Path: "PokeRotom/client/src/graphQL/pokeApi.ts"
import { gql, HttpLink, ApolloClient, InMemoryCache } from '@apollo/client';

export const pokeClient = new ApolloClient({
    link: new HttpLink({ uri: 'https://beta.pokeapi.co/graphql/v1beta' }),
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
            height
            weight
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
