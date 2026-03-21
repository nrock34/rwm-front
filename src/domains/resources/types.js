/**
 * @typedef {string} ResourceCategoryKey
 */

/**
 * @typedef {"invalid_response" | "missing_env" | "not_found" | "upstream_error" | "network_error"} ResourceErrorCode
 */

/**
 * @typedef {{
 *   code: ResourceErrorCode;
 *   status: number;
 *   message: string;
 *   details?: unknown;
 * }} ResourceDomainError
 */

/**
 * @typedef {{
 *   name: string;
 *   avatar: string | null;
 *   associatedUser: number | null;
 * }} ResourceAuthor
 */

/**
 * @typedef {{
 *   id: number;
 *   title: string;
 *   description: string;
 *   category: ResourceCategoryKey;
 *   apiCategory: string;
 *   categoryLabel: string;
 *   type: string;
 *   typeLabel: string;
 *   rating: number;
 *   views: number;
 *   author: ResourceAuthor;
 *   thumbnail: string | null;
 *   tags: string[];
 *   featured: boolean;
 *   downloads: number | null;
 *   size: string | null;
 *   lastUpdated: string | null;
 *   href: string;
 *   primaryActionLabel: string;
 * }} ResourceCard
 */

/**
 * @typedef {ResourceCard & {
 *   content: string | null;
 *   pageContent: string | null;
 *   contentUrl: string | null;
 * }} ResourceDetail
 */

/**
 * @typedef {Record<string, ResourceCard[]>} ResourceCollections
 */

/**
 * @typedef {{
 *   fetch: typeof fetch;
 * }} ResourceFetchDeps
 */

/**
 * @template T
 * @typedef {{
 *   ok: true;
 *   data: T;
 *   status: number;
 *   headers: Headers;
 * }} ResourceSuccess
 */

/**
 * @typedef {{
 *   ok: false;
 *   error: ResourceDomainError;
 * }} ResourceFailure
 */

/**
 * @template T
 * @typedef {ResourceSuccess<T> | ResourceFailure} ResourceResult
 */

/**
 * @typedef {{
 *   resource: ResourceDetail;
 *   relatedResources: ResourceCard[];
 * }} ResourceDetailPageData
 */

export {};
