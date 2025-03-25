import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://alen.is'
  
  // Main routes
  const routes = [
    '',
    '/cool',
    '/gay',
    '/projects',
    '/experience',
    '/listening',
    '/meeting',
  ].map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  return routes
} 