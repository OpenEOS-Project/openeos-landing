export type LegalDoc = "impressum" | "datenschutz" | "agb" | "avv";

export const LEGAL_DOCS: LegalDoc[];
export const LEGAL_CONTENT_DIR: string;
export function isLegalDoc(doc: string): doc is LegalDoc;
export function listVersions(doc: LegalDoc): string[];
export function currentVersion(doc: LegalDoc): string;
export function sourcePath(doc: LegalDoc, version: string): string;
export function readRaw(doc: LegalDoc, version: string): string;
export function cleanSource(raw: string): string;
export function readSource(doc: LegalDoc, version: string): string;
export function plainText(md: string): string;
export function extractTitle(source: string): string;
export function extractStand(source: string): string;
export function slugify(text: string): string;
export function headingAliases(text: string): string[];
export function clauseNumber(raw: string): string | null;
export function clauseId(number: string): string;
export function findPlaceholders(source: string): { line: number; text: string }[];
