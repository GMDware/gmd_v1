export interface NormalizedProject {
  id: string;
  title: string;
  slug: string;
  description: string;
  fullDescription?: string;
  category: string;
  categorySlug?: string;
  href: string;
  liveUrl?: string | null;
  image: string | null;
  technologies: string[];
  isConcept: boolean;
  isFeatured: boolean;
  clientName?: string | null;
  conceptBadge?: string;
  archetype?: 'browser' | 'editorial' | 'compact' | 'interactive';
  metrics?: { label: string; value: string }[];
}

/**
 * Safely normalizes raw technology representations (Prisma relation joins, objects, or strings)
 * into an array of clean string labels. Prevents React child object rendering errors.
 */
export function normalizeTechnologies(rawTechs: any): string[] {
  if (!rawTechs) return [];
  if (!Array.isArray(rawTechs)) {
    if (typeof rawTechs === 'string') return [rawTechs];
    if (typeof rawTechs === 'object') {
      const name = rawTechs.technology?.name || rawTechs.name || rawTechs.title || rawTechs.slug;
      return name ? [String(name)] : [];
    }
    return [];
  }

  return rawTechs
    .map((item: any) => {
      if (!item) return '';
      if (typeof item === 'string') return item.trim();
      if (typeof item === 'object') {
        // Handles Prisma relation: { projectId, technologyId, technology: { name: '...' } }
        const name = item.technology?.name || item.name || item.title || item.slug || '';
        return String(name).trim();
      }
      return '';
    })
    .filter((name: string) => name.length > 0);
}

/**
 * Normalizes any project (from CMS Prisma queries, seed data, or fallback concepts)
 * into a type-safe, render-safe NormalizedProject object.
 */
export function normalizeProject(raw: any, fallbackId?: string): NormalizedProject {
  if (!raw) {
    return {
      id: fallbackId || 'unknown-project',
      title: 'Untitled Project',
      slug: 'project',
      description: 'Project details unavailable.',
      category: 'Digital Product',
      href: '/work',
      liveUrl: null,
      image: null,
      technologies: [],
      isConcept: true,
      isFeatured: false,
      clientName: null,
      conceptBadge: 'Studio Concept',
      archetype: 'browser',
    };
  }

  const id = String(raw.id || fallbackId || `proj-${Math.random().toString(36).slice(2, 8)}`);
  const title = String(raw.title || raw.name || 'Untitled Project').trim();
  const slug = String(raw.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-')).trim();
  
  // Safely extract category string
  let category = 'Digital Product';
  let categorySlug = 'digital-product';
  if (typeof raw.category === 'string') {
    category = raw.category;
    categorySlug = raw.category.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  } else if (raw.category && typeof raw.category === 'object') {
    category = raw.category.name || raw.category.title || category;
    categorySlug = raw.category.slug || categorySlug;
  } else if (raw.projectType) {
    category = String(raw.projectType);
  }

  // Extract description safely
  const description = String(
    raw.shortDescription ||
    raw.summary ||
    (raw.fullDescription ? raw.fullDescription.slice(0, 160) + '...' : '') ||
    'High-craft software product engineered for real users.'
  ).trim();

  // Extract live URL and internal case study href
  let liveUrl = raw.liveUrl || raw.url || raw.websiteUrl || null;
  if (!liveUrl && Array.isArray(raw.seoKeywords)) {
    const foundUrl = raw.seoKeywords.find((k: string) => typeof k === 'string' && (k.startsWith('http://') || k.startsWith('https://')));
    if (foundUrl) liveUrl = foundUrl;
  }
  // Default recognized live studio projects
  if (!liveUrl) {
    if (slug.includes('osta') || title.toLowerCase().includes('osta')) {
      liveUrl = 'https://ostafinder.vercel.app/';
    } else if (slug.includes('trip') || title.toLowerCase().includes('trip')) {
      liveUrl = 'https://trip-stpre-4c8q5x757-abdallaelnagars-projects.vercel.app/';
    } else if (slug.includes('elnagar') || title.toLowerCase().includes('elnagar')) {
      liveUrl = 'https://abdalla3lnagar-alpha.vercel.app/';
    }
  }
  const href = liveUrl || `/work/${slug}`;

  // Extract image
  let image: string | null = null;
  if (typeof raw.image === 'string') {
    image = raw.image;
  } else if (raw.heroImage?.url) {
    image = raw.heroImage.url;
  } else if (raw.heroImageUrl) {
    image = raw.heroImageUrl;
  }

  // Safely extract technologies
  const technologies = normalizeTechnologies(raw.technologies);

  // Concept vs Real Project determination
  const isConcept = Boolean(
    raw.isConcept ??
    (!liveUrl && !raw.clientName && (!raw.createdAt || raw.conceptBadge))
  );

  return {
    id,
    title,
    slug,
    description,
    fullDescription: raw.fullDescription || undefined,
    category,
    categorySlug,
    href,
    liveUrl,
    image,
    technologies,
    isConcept,
    isFeatured: Boolean(raw.isFeatured),
    clientName: raw.clientName || null,
    conceptBadge: raw.conceptBadge || (isConcept ? 'Studio Concept' : 'Live Project'),
    archetype: raw.archetype || 'browser',
  };
}
