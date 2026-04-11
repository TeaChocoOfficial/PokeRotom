//-Path: "PokeRotom/client/src/entry-client.tsx"
import React from 'react';
import App from './App';
import { hydrateRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';

const container = document.getElementById('root') as HTMLElement;

hydrateRoot(
  container,
    <HelmetProvider>
      <App />
    </HelmetProvider>
);
