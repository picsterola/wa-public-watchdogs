import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { bodySnippet } from '../lib/format';

const SITE_URL = 'https://wacountability.org';

export async function GET() {
  const cases = await getCollection('cases');
  const items = cases
    .filter((c) => c.data.review_status !== 'retracted')
    .sort((a, b) => b.data.date_surfaced.getTime() - a.data.date_surfaced.getTime())
    .slice(0, 50)
    .map((c) => ({
      title: c.data.title,
      pubDate: c.data.date_surfaced,
      description: bodySnippet(c.body, 320),
      link: `/cases/${c.slug}.html`,
      categories: c.data.severity_type,
    }));

  return rss({
    title: 'Washington Accountability Registry',
    description:
      'Documenting fraud, conflicts of interest, and structural oversight failures across Washington State, King County, Seattle, and the regional bodies in between.',
    site: SITE_URL,
    items,
    customData: '<language>en-us</language>',
    stylesheet: '/rss.xsl',
  });
}
