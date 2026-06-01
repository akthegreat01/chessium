import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://chessium.in';

  // Define static routes
  const routes = [
    '',
    '/analyze',
    '/puzzles',
    '/play',
    '/play/ai',
    '/studies',
    '/openings',
    '/endgames',
    '/about',
    '/blog',
  ];

  const sitemapRoutes: MetadataRoute.Sitemap = routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: route === '' ? 1 : 0.8,
  }));

  // You can fetch dynamic routes here (e.g., individual openings, studies, or blog posts) 
  // and append them to `sitemapRoutes`.
  // Example for static dynamic ones if they are known or fetchable:
  // const dynamicRoutes = [...]

  return sitemapRoutes;
}
