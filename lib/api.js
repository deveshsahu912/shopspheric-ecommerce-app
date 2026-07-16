import Parser from 'rss-parser';

const parser = new Parser();

export const TOPICS = [
  { name: '🌐 World', value: 'WORLD' },
  { name: '🇺🇸 Nation/Local', value: 'NATION' },
  { name: '💼 Business', value: 'BUSINESS' },
  { name: '💻 Technology', value: 'TECHNOLOGY' },
  { name: '🎭 Entertainment', value: 'ENTERTAINMENT' },
  { name: '⚽ Sports', value: 'SPORTS' },
  { name: '🔬 Science', value: 'SCIENCE' },
  { name: '🏥 Health', value: 'HEALTH' }
];

/**
 * Splits the Google News title (e.g. "Headline of the article - Publisher")
 * into a separate title and publisher.
 */
export function parseArticleTitle(fullTitle) {
  if (!fullTitle) return { title: 'No Title', publisher: 'Unknown Source' };
  
  // Google News RSS titles usually end with " - Publisher Name"
  const parts = fullTitle.split(' - ');
  if (parts.length > 1) {
    const publisher = parts.pop().trim();
    const title = parts.join(' - ').trim();
    return { title, publisher };
  }
  
  return { title: fullTitle.trim(), publisher: 'Unknown Source' };
}

/**
 * Calculates a human-readable relative time string.
 */
export function getRelativeTime(dateString) {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    
    if (isNaN(date.getTime())) return dateString;
    if (diffMs < 0) return 'Just now';
    
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    
    // Fallback to local date format
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  } catch (error) {
    return dateString;
  }
}

/**
 * Normalizes rss feed items into a uniform format.
 */
function normalizeItems(items) {
  return items.map((item, index) => {
    const { title, publisher } = parseArticleTitle(item.title);
    return {
      id: index,
      title,
      publisher,
      link: item.link,
      pubDate: item.pubDate,
      relativeTime: getRelativeTime(item.pubDate),
      contentSnippet: item.contentSnippet || ''
    };
  });
}

/**
 * Fetches the Google News RSS Feed.
 * @param {string} endpointUrl - The full constructed RSS feed URL
 */
async function fetchFeed(endpointUrl) {
  try {
    const feed = await parser.parseURL(endpointUrl);
    return {
      title: feed.title || 'Google News',
      description: feed.description || '',
      items: normalizeItems(feed.items || [])
    };
  } catch (error) {
    throw new Error(`Failed to fetch Google News feed: ${error.message}`);
  }
}

/**
 * Fetches top stories based on configuration.
 */
export async function fetchTopStories(config) {
  const { region, language, ceid } = config;
  const url = `https://news.google.com/rss?hl=${language}&gl=${region}&ceid=${ceid}`;
  return fetchFeed(url);
}

/**
 * Fetches news by search query.
 */
export async function fetchSearchStories(query, config) {
  const { region, language, ceid } = config;
  const url = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=${language}&gl=${region}&ceid=${ceid}`;
  return fetchFeed(url);
}

/**
 * Fetches news by topic.
 */
export async function fetchTopicStories(topicCode, config) {
  const { region, language, ceid } = config;
  const url = `https://news.google.com/rss/headlines/section/topic/${topicCode}?hl=${language}&gl=${region}&ceid=${ceid}`;
  return fetchFeed(url);
}
