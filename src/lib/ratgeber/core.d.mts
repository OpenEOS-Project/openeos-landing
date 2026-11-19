export type Article = {
  slug: string;
  title: string;
  description: string;
  /** JJJJ-MM-TT */
  date: string;
  author: string;
  tags: string[];
  readingMinutes: number;
  /** Markdown ohne Kopf. */
  body: string;
};

export const RATGEBER_CONTENT_DIR: string;
export const SLUG_RE: RegExp;
export const WORDS_PER_MINUTE: number;
export function parseFrontmatter(
  raw: string,
  file?: string,
): { data: Record<string, unknown>; body: string };
export function markdownWords(md: string): number;
export function readingMinutes(md: string): number;
export function parseArticle(slug: string, raw: string): Article;
export function listArticles(): Article[];
export function getArticle(slug: string): Article | null;
