/**
 * @param {{ isAuthenticated?: boolean; name?: string | null; username?: string | null }} viewer
 * @returns {string}
 */
export function getViewerDisplayName(viewer) {
    if (typeof viewer?.name === "string" && viewer.name.trim().length > 0) {
        return viewer.name.trim();
    }

    if (typeof viewer?.username === "string" && viewer.username.trim().length > 0) {
        return viewer.username.trim();
    }

    return "there!";
}

/**
 * @param {{ isAuthenticated?: boolean; name?: string | null; username?: string | null }} viewer
 * @returns {string}
 */
export function getViewerInitials(viewer) {
    const source = getViewerDisplayName(viewer);
    if (source === "there") return "R";

    const parts = source.split(/\s+/u).filter(Boolean);
    if (parts.length === 1) {
        return parts[0].slice(0, 1).toUpperCase();
    }

    return parts
        .slice(0, 2)
        .map((part) => part.slice(0, 1).toUpperCase())
        .join("");
}

/**
 * @param {boolean} isAuthenticated
 * @returns {Array<{ label: string; href?: string; action?: "logout" }>}
 */
export function getAccountMenuItems(isAuthenticated) {
    if (isAuthenticated) {
        return [
            { label: "Profile", href: "/profile/dashboard" },
            { label: "Settings", href: "/profile/settings" },
            { label: "Logout", action: "logout" }
        ];
    }

    return [
        { label: "Login", href: "/auth/login" },
        { label: "Sign Up", href: "/auth/signup" }
    ];
}
