export type Category =
  | 'productivity'
  | 'developer'
  | 'ai'
  | 'student'
  | 'utilities'
  | 'design'
  | 'media'
  | 'communication';

export interface App {
  id: string;
  name: string;
  tagline: string;
  description: string;
  url: string;
  category: Category;
  iconGradient: [string, string];
  accentColor: string;
  rating: number;
  ratingCount: number;
  size: string;
  developer: string;
  developerUrl?: string;
  isOfflineReady: boolean;
  isPWA: boolean;
  isNew: boolean;
  isTrending: boolean;
  isFeatured: boolean;
  tags: string[];
}

export interface CategoryMeta {
  id: Category;
  label: string;
  description: string;
  icon: string; // Lucide icon name
  color: string;
}

export const categoryMeta: CategoryMeta[] = [
  { id: 'ai',            label: 'AI',           description: 'Powered by intelligence',  icon: 'Sparkles',     color: '#8B5CF6' },
  { id: 'productivity',  label: 'Productivity',  description: 'Get things done',          icon: 'Briefcase',    color: '#F37338' },
  { id: 'developer',     label: 'Developer',     description: 'Tools for builders',       icon: 'Code2',        color: '#10B981' },
  { id: 'design',        label: 'Design',        description: 'Create visuals',           icon: 'Palette',      color: '#EC4899' },
  { id: 'student',       label: 'Student',       description: 'Study smarter',            icon: 'GraduationCap',color: '#3B82F6' },
  { id: 'utilities',     label: 'Utilities',     description: 'Everyday tools',           icon: 'Wrench',       color: '#F59E0B' },
  { id: 'communication', label: 'Communication', description: 'Stay connected',           icon: 'MessageCircle',color: '#6366F1' },
  { id: 'media',         label: 'Media',         description: 'Audio, video & more',      icon: 'Film',         color: '#EF4444' },
];

export const apps: App[] = [];

// ── Helpers ─────────────────────────────────────────────────────────────────

export const getApp = (id: string) => apps.find(a => a.id === id);

export const getAppsByCategory = (cat: Category) =>
  apps.filter(a => a.category === cat);

export const getFeaturedApps = () => apps.filter(a => a.isFeatured);

export const getTrendingApps = () => apps.filter(a => a.isTrending);

export const getNewApps = () => apps.filter(a => a.isNew);

export const getOfflineApps = () => apps.filter(a => a.isOfflineReady);

export const getCategoryMeta = (id: Category) =>
  categoryMeta.find(c => c.id === id);

export const searchApps = (query: string) => {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return apps.filter(
    a =>
      a.name.toLowerCase().includes(q) ||
      a.tagline.toLowerCase().includes(q) ||
      a.tags.some(t => t.includes(q)) ||
      a.category.includes(q) ||
      a.developer.toLowerCase().includes(q)
  );
};

export const formatRatingCount = (n: number): string => {
  if (n >= 1000) return `${(n / 1000).toFixed(0)}K`;
  return String(n);
};
