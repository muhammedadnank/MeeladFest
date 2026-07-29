import type { MetadataRoute } from 'next';
import connectDB from '@/lib/db';
import Fest from '@/models/Fest';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://meeladfest.com';

  let festUrls: MetadataRoute.Sitemap = [];
  try {
    await connectDB();
    const fests = await Fest.find({ isPublished: { $ne: false } })
      .select('slug updatedAt')
      .lean();

    festUrls = fests.map((fest: any) => ({
      url: `${baseUrl}/fests/${fest.slug}`,
      lastModified: fest.updatedAt || new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    }));
  } catch (error) {
    console.error('Failed to generate fest sitemap URLs:', error);
  }

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/register`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ];

  return [...staticRoutes, ...festUrls];
}
