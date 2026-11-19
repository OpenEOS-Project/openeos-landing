export type ArticleTocEntry = { id: string; text: string };

export function escapeHtml(value: string): string;
export function renderArticle(
  source: string,
  labels: { table: string; newTab: string },
): { html: string; toc: ArticleTocEntry[] };
