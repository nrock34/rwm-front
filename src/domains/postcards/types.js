/**
 * @typedef {number | string} PostcardId
 */

/**
 * @typedef {"invalid_response" | "missing_env" | "not_found" | "upstream_error" | "network_error"} PostcardErrorCode
 */

/**
 * @typedef {{
 *   code: PostcardErrorCode;
 *   status: number;
 *   message: string;
 *   details?: unknown;
 * }} PostcardDomainError
 */

/**
 * @typedef {{
 *   name: string;
 *   avatar: string | null;
 *   associatedUser: number | null;
 *   href: string | null;
 * }} PostcardAuthor
 */

/**
 * @typedef {{ id: PostcardId | null; name: string }} PostcardTaxonomy
 */

/**
 * @typedef {{
 *   kind: "paragraph";
 *   html: string;
 * } | {
 *   kind: "heading";
 *   level: 2 | 3 | 4;
 *   text: string;
 *   id: string;
 * } | {
 *   kind: "image";
 *   src: string;
 *   alt: string;
 *   caption: string | null;
 *   credit: string | null;
 * } | {
 *   kind: "quote";
 *   text: string;
 *   attribution: string | null;
 * } | {
 *   kind: "list";
 *   ordered: boolean;
 *   items: string[];
 * } | {
 *   kind: "callout";
 *   tone: "info" | "tip" | "warning" | "success";
 *   title: string | null;
 *   text: string;
 * } | {
 *   kind: "divider";
 * } | {
 *   kind: "code";
 *   code: string;
 *   language: string | null;
 * } | {
 *   kind: "link";
 *   href: string;
 *   title: string;
 *   description: string | null;
 * } | {
 *   kind: "legacy_html";
 *   html: string;
 * }} PostcardArticleBlock
 */

/**
 * @typedef {{
 *   id: PostcardId;
 *   title: string;
 *   description: string;
 *   author: PostcardAuthor;
 *   category: PostcardTaxonomy | null;
 *   tags: PostcardTaxonomy[];
 *   image: string | null;
 *   featured: boolean;
 *   region: string | null;
 *   location: { city: string | null; country: string | null };
 *   datePublished: string | null;
 *   dateUpdated: string | null;
 *   likes: number;
 *   comments: number;
 *   views: number;
 *   href: string;
 * }} PostcardCard
 */

/**
 * @typedef {PostcardCard & {
 *   articleBlocks: PostcardArticleBlock[];
 *   contentFormat: "modular" | "legacy_html" | "empty";
 *   gallery: Array<{ src: string; alt: string }>;
 *   readingMinutes: number;
 *   seoDescription: string;
 * }} PostcardDetail
 */

/**
 * @typedef {{
 *   q: string;
 *   category: string;
 *   tag: string;
 *   sortBy: string;
 *   page: number;
 * }} PostcardDirectoryFilters
 */

/**
 * @typedef {{
 *   count: number;
 *   page: number;
 *   pageSize: number;
 *   totalPages: number;
 *   nextPage: number | null;
 *   previousPage: number | null;
 *   results: PostcardCard[];
 *   filters: PostcardDirectoryFilters;
 *   availableCategories: string[];
 *   availableTags: string[];
 * }} PostcardDirectoryPage
 */

/**
 * @typedef {{
 *   postcard: PostcardDetail;
 *   relatedPostcards: PostcardCard[];
 * }} PostcardDetailPage
 */

/**
 * @typedef {{ fetch: typeof fetch }} PostcardFetchDeps
 */

/**
 * @template T
 * @typedef {{ ok: true; data: T; status: number; headers: Headers }} PostcardSuccess
 */

/**
 * @typedef {{ ok: false; error: PostcardDomainError }} PostcardFailure
 */

/**
 * @template T
 * @typedef {PostcardSuccess<T> | PostcardFailure} PostcardResult
 */

export {};
