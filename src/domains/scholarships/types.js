/**
 * @typedef {{
 *   fetch: typeof fetch;
 * }} ScholarshipFetchDeps
 */

/**
 * @typedef {"missing_env" | "network_error" | "invalid_response" | "not_found" | "upstream_error"} ScholarshipErrorCode
 */

/**
 * @typedef ScholarshipDomainError
 * @property {ScholarshipErrorCode} code
 * @property {number} status
 * @property {string} message
 * @property {unknown} [details]
 */

/**
 * @template T
 * @typedef ScholarshipResult
 * @property {true} ok
 * @property {T} data
 * @property {number} status
 * @property {Headers} headers
 */

/**
 * @template T
 * @typedef ScholarshipFailure
 * @property {false} ok
 * @property {ScholarshipDomainError} error
 */

/**
 * @template T
 * @typedef {ScholarshipResult<T> | ScholarshipFailure<T>} ScholarshipServiceResult
 */

/**
 * @typedef ScholarshipCard
 * @property {number} id
 * @property {string} title
 * @property {string} provider
 * @property {string} amount
 * @property {number} amountValue
 * @property {string | null} deadline
 * @property {string} deadlineLabel
 * @property {string[]} categories
 * @property {string} category
 * @property {string} country
 * @property {string} level
 * @property {string} field
 * @property {string} location
 * @property {string} description
 * @property {string[]} eligibility
 * @property {string} status
 * @property {boolean} featured
 * @property {number} rating
 * @property {number | null} applicants
 * @property {number | null} awarded
 * @property {string} href
 */

export {};

/**
 * @typedef ScholarshipRequirementItem
 * @property {string} id
 * @property {string} req
 */

/**
 * @typedef ScholarshipTimelineItem
 * @property {string} event
 * @property {string} date
 * @property {"past" | "upcoming" | "current" | "future"} status
 */

/**
 * @typedef ScholarshipApplicationStep
 * @property {number} step
 * @property {string} title
 * @property {string} description
 * @property {string} timeframe
 */

/**
 * @typedef ScholarshipDetail
 * @property {number} id
 * @property {string} title
 * @property {string} provider
 * @property {string} amount
 * @property {number} amountValue
 * @property {string | null} deadline
 * @property {string} location
 * @property {string} description
 * @property {string} fullDescription
 * @property {string[]} benefits
 * @property {string[]} eligibility
 * @property {ScholarshipRequirementItem[]} requirements
 * @property {ScholarshipApplicationStep[]} applicationProcess
 * @property {ScholarshipTimelineItem[]} timeline
 * @property {string | null} applicationLink
 * @property {{ email: string | null, phone: string | null, website: string | null, address: string | null }} contact
 * @property {string} successRate
 * @property {number | null} applicants
 * @property {number | null} awarded
 * @property {number} rating
 * @property {boolean} featured
 * @property {string} status
 * @property {string[]} categories
 * @property {string | null} updatedAt
 * @property {string} href
 */
