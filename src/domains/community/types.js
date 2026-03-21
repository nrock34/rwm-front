/**
 * @typedef {"invalid_response" | "missing_env" | "not_found" | "upstream_error" | "network_error" | "unauthorized"} CommunityErrorCode
 */

/**
 * @typedef {{
 *   code: CommunityErrorCode;
 *   status: number;
 *   message: string;
 *   details?: unknown;
 * }} CommunityDomainError
 */

/**
 * @typedef {{
 *   id: number;
 *   name: string;
 *   avatar: string | null;
 *   associatedUser: number | null;
 * }} CommunityAuthor
 */

/**
 * @typedef {{
 *   id: number;
 *   title: string;
 *   content: string;
 *   image: string | null;
 *   type: string;
 *   typeLabel: string;
 *   category: string;
 *   categoryLabel: string;
 *   author: CommunityAuthor;
 *   createdAt: string;
 *   updatedAt: string;
 *   timestampLabel: string;
 *   published: boolean;
 *   views: number;
 *   likes: number;
 *   comments: number;
 *   tags: string[];
 *   viewerLiked: boolean;
 *   href: string;
 * }} CommunityPostCard
 */

/**
 * @typedef {CommunityPostCard} CommunityPostDetail
 */

/**
 * @typedef {{
 *   id: number;
 *   author: CommunityAuthor;
 *   content: string;
 *   createdAt: string;
 *   updatedAt: string;
 *   timestampLabel: string;
 * }} CommunityComment
 */

/**
 * @typedef {{
 *   id: number;
 *   title: string;
 *   category: string;
 *   categoryLabel: string;
 *   image: string | null;
 *   urgent: boolean;
 *   summary: string;
 *   expiresAt: string | null;
 *   updatedAt: string;
 *   createdAt: string;
 *   views: number;
 *   shares: number;
 *   comments: number;
 *   likes: number;
 *   timeAgo: string;
 *   href: string;
 * }} CommunityUpdateCard
 */

/**
 * @typedef {CommunityUpdateCard & {
 *   content: string;
 * }} CommunityUpdateDetail
 */

/**
 * @typedef {{
 *   id: number;
 *   title: string;
 *   provider: string;
 *   location: string;
 *   country: string;
 *   region: string;
 *   duration: string;
 *   cost: string;
 *   rating: number;
 *   participants: number;
 *   description: string;
 *   highlights: string[];
 *   featured: boolean;
 *   deadline: string | null;
 *   href: string;
 * }} CommunityProgramCard
 */

/**
 * @typedef {{
 *   id: number;
 *   title: string;
 *   provider: string;
 *   amount: string;
 *   deadline: string | null;
 *   categories: string[];
 *   category: string;
 *   location: string;
 *   description: string;
 *   eligibilitySummary: string;
 *   qualifications: string[];
 *   status: string;
 *   featured: boolean;
 *   rating: number;
 *   href: string;
 * }} CommunityScholarshipCard
 */

/**
 * @typedef {{
 *   name: string;
 *   date: string;
 *   displayDate: string;
 *   href: string;
 *   type: "program" | "scholarship";
 * }} CommunityDeadlineItem
 */

/**
 * @template T
 * @typedef {{
 *   results: T[];
 *   nextCursor: string | null;
 *   previousCursor: string | null;
 *   nextUrl: string | null;
 *   previousUrl: string | null;
 * }} CommunityCursorPage
 */

/**
 * @typedef {{
 *   posts: CommunityPostCard[];
 *   updates: CommunityUpdateCard[];
 *   featuredPrograms: CommunityProgramCard[];
 *   featuredScholarships: CommunityScholarshipCard[];
 *   upcomingDeadlines: CommunityDeadlineItem[];
 * }} CommunitySummaryData
 */

/**
 * @typedef {{
 *   title: string;
 *   content: string;
 *   type: string;
 *   category: string;
 *   tags: string[];
 *   media?: string;
 *   published: boolean;
 * }} CreatePostPayload
 */

/**
 * @typedef {{
 *   content: string;
 * }} CreateCommentPayload
 */

/**
 * @typedef {{
 *   fetch: typeof fetch;
 *   accessToken?: string | null;
 * }} CommunityFetchDeps
 */

/**
 * @template T
 * @typedef {{
 *   ok: true;
 *   data: T;
 *   status: number;
 *   headers: Headers;
 * }} CommunitySuccess
 */

/**
 * @typedef {{
 *   ok: false;
 *   error: CommunityDomainError;
 * }} CommunityFailure
 */

/**
 * @template T
 * @typedef {CommunitySuccess<T> | CommunityFailure} CommunityResult
 */

/**
 * `checkJs` does not always narrow discriminated unions in JS files.
 *
 * @template T
 * @param {CommunityResult<T>} result
 * @returns {CommunityFailure}
 */
export function asCommunityFailure(result) {
	return /** @type {CommunityFailure} */ (result);
}

export {};
