import { MetadataRoute } from 'next';
import { getClubs } from '@/lib/chess/clubs-db';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://chessium.in';
  
  // Base routes
  const routes = [
    '',
    '/dashboard',
    '/play',
    '/puzzles',
    '/vision',
    '/analysis',
    '/courses',
    '/openings',
    '/endgames',
    '/master-games',
    '/statistics',
    '/clubs',
    '/guess-the-elo'
  ].map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Fetch dynamic clubs
  try {
    const clubs = await getClubs();
    const clubRoutes = clubs.map(club => ({
      url: `${baseUrl}/clubs/${club.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));
    
    return [...routes, ...clubRoutes];
  } catch (error) {
    // If DB fails, at least return static routes
    return routes;
  }
}
