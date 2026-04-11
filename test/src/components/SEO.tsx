//-Path: "PokeRotom/client/src/components/SEO.tsx"
import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SeoProps {
  title?: string;
  image?: string;
  description?: string;
}

/**
 * SEO component for managing meta tags.
 */
function SEO(props: SeoProps) {
  const { 
    title = 'Premium Vite SSR', 
    image = '/vite.svg', 
    description = 'High-performance React SSR with SEO' 
  } = props;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
}

export default SEO;
