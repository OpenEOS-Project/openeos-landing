export type LegalDoc = "impressum" | "datenschutz" | "agb" | "avv" | "leistungsbeschreibung";

export const LEGAL_DOCS: LegalDoc[];
export const OPTIONAL_LEGAL_DOCS: LegalDoc[];
export const LEGAL_CONTENT_DIR: string;
export const LEGAL_TIME_ZONE: string;
export type LegalVersionStatus = "current" | "upcoming" | "archived";
export function hasLegalDoc(doc: LegalDoc, now?: Date): boolean;
export function availableLegalDocs(now?: Date): LegalDoc[];
export function isLegalDoc(doc: string): doc is LegalDoc;
export function listVersions(doc: LegalDoc): string[];
export function legalToday(now?: Date): string;
export function splitVersions(
  versions: string[],
  today: string,
): { current: string | null; upcoming: string[]; archived: string[] };
export function currentVersion(doc: LegalDoc, now?: Date): string | null;
export function upcomingVersions(doc: LegalDoc, now?: Date): string[];
export function versionStatus(version: string, current: string | null, today: string): LegalVersionStatus;
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
