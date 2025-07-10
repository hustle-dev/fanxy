import fs from 'fs';
import path from 'path';

import { getAllPostsFrontmatter } from './src/app/libs/post';
import normalizeSlug from './src/app/utils/normalizeSlug';

const BASE_URL = 'https://fanxy.dev';

const generateSitemap = async () => {
  const posts = await getAllPostsFrontmatter();
  const staticPages = [
    {
      url: BASE_URL,
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily',
      priority: '1.0',
    },
  ];
  const postPages = posts.map((post) => ({
    url: `${BASE_URL}/posts/${normalizeSlug(post.slug)}`,
    lastModified: new Date(post.date).toISOString(),
    changeFrequency: 'daily',
    priority: '0.7',
  }));
  const allPages = [...staticPages, ...postPages];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
  .map(
    (page) => `  <url>
    <loc>${page.url}</loc>
    <lastmod>${page.lastModified}</lastmod>
    <changefreq>${page.changeFrequency}</changefreq>
    <priority>${page.priority}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>`;
  const publicDir = path.join(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap);
  console.log('✅ Sitemap generated successfully at public/sitemap.xml');
};

generateSitemap().catch((error: unknown) => {
  console.error('❌ Error generating sitemap:', error);
  process.exit(1);
});
