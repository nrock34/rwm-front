/**
 * @typedef {{
 *   id: number | string;
 *   title: string;
 *   provider?: string;
 *   description?: string;
 *   [key: string]: unknown;
 * }} Scholarship
 */

/**
 * @typedef {{
 *   id: number | string;
 *   title: string;
 *   provider?: string;
 *   location?: string;
 *   duration?: string;
 *   cost?: string | number;
 *   [key: string]: unknown;
 * }} Program
 */

/**
 * @typedef {{
 *   id: number | string;
 *   title: string;
 *   type?: string;
 *   author?: string;
 *   description?: string;
 *   [key: string]: unknown;
 * }} Resource
 */

/**
 * @typedef {{
 *   id: number | string;
 *   type?: string;
 *   category?: string;
 *   content?: string;
 *   [key: string]: unknown;
 * }} Post
 */

/**
 * @typedef {{
 *   id?: number | string;
 *   name?: string;
 *   email?: string;
 *   avatar?: string;
 *   [key: string]: unknown;
 * }} Profile
 */

/**
 * @template T
 * @typedef {{
 *   total: number;
 *   page: number;
 *   perPage: number;
 *   results: T[];
 * }} PaginatedList
 */

export {};
