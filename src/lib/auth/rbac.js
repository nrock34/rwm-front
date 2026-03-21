export const ONBOARDED_ROLE = "onboarded";

/**
 * @typedef {"any" | "all"} RoleMatchMode
 */

/**
 * @param {unknown} value
 * @returns {string[]}
 */
export function normalizeRoles(value) {
    if (Array.isArray(value)) {
        return Array.from(
            new Set(
                value
                    .filter((item) => typeof item === "string")
                    .map((item) => item.trim().toLowerCase())
                    .filter(Boolean)
            )
        );
    }

    if (typeof value === "string") {
        return Array.from(
            new Set(
                value
                    .split(/[,\s]+/u)
                    .map((item) => item.trim().toLowerCase())
                    .filter(Boolean)
            )
        );
    }

    return [];
}

/**
 * @param {{ role?: string | null; roles?: string[] | null }} options
 * @returns {string[]}
 */
export function resolveRequiredRoles(options) {
    const roleList = normalizeRoles(options.roles ?? []);
    const singleRole = normalizeRoles(options.role ?? null);
    return Array.from(new Set([...roleList, ...singleRole]));
}

/**
 * @param {string[]} viewerRoles
 * @param {string[]} requiredRoles
 * @param {RoleMatchMode} [mode]
 * @returns {boolean}
 */
export function hasRoleAccess(viewerRoles, requiredRoles, mode = "any") {
    if (requiredRoles.length === 0) return true;

    const viewerRoleSet = new Set(normalizeRoles(viewerRoles));
    if (mode === "all") {
        return requiredRoles.every((role) => viewerRoleSet.has(role));
    }

    return requiredRoles.some((role) => viewerRoleSet.has(role));
}

/**
 * @param {string[]} viewerRoles
 * @param {string[]} requiredRoles
 * @returns {string[]}
 */
export function getMissingRoles(viewerRoles, requiredRoles) {
    const normalizedViewerRoles = new Set(normalizeRoles(viewerRoles));
    return normalizeRoles(requiredRoles).filter((role) => !normalizedViewerRoles.has(role));
}

/**
 * @param {string[]} viewerRoles
 * @param {string[]} requiredRoles
 * @returns {boolean}
 */
export function isMissingOnlyOnboardedRole(viewerRoles, requiredRoles) {
    const missingRoles = getMissingRoles(viewerRoles, requiredRoles);
    return missingRoles.length === 1 && missingRoles[0] === ONBOARDED_ROLE;
}
