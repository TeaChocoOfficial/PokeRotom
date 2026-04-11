//-Path: "PokeRotom/client/src/entry-server.tsx"
import React from 'react';
import App from './App';
import { HelmetProvider } from 'react-helmet-async';
import { renderToString } from 'react-dom/server';

/**
 * Renders the application to a string for SSR.
 */
export function render() {
    const helmetContext = {};

    const appHtml = renderToString(
        <HelmetProvider context={helmetContext}>
            <App />
        </HelmetProvider>,
    );

    return {
        appHtml,
        helmetContext,
    };
}
