//-Path: "PokeRotom/client/src/components/Providers.tsx"
import { pokeClient } from '../graphQL/pokeApi';
import { BrowserRouter } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client/react';

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ApolloProvider client={pokeClient}>
            <BrowserRouter>{children}</BrowserRouter>
        </ApolloProvider>
    );
}
