const normalizeSlug = (slug: string) =>
  slug.startsWith('/') ? slug.slice(1) : slug;

export default normalizeSlug;
