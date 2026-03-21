/**
 * @typedef {"invalid_creds" | "disabled_acct" | "invalid_payload" | "invalid_response" | "missing_env" | "upstream_error" | "missing_refresh_token" | "invalid_token" | "token_expired" | "network_error"} AuthErrorCode
 */

/**
 * @typedef {{
 *   code: AuthErrorCode;
 *   status: number;
 *   message: string;
 *   details?: unknown;
 * }} AuthDomainError
 */

/**
 * @typedef {{
 *   email: string;
 *   password: string;
 * }} AuthLoginPayload
 */

/**
 * @typedef {{
 *   detail?: string;
 *   [key: string]: unknown;
 * }} AuthLogoutResponse
 */

/**
 * @typedef {{
 *   first_name: string;
 *   last_name: string;
 *   username: string;
 *   email: string;
 *   password: string;
 * }} AuthSignupPayload
 */

/**
 * @typedef {{
 *   acs_tkn: string;
 *   rfh_tkn?: string;
 *   rfh_age?: number;
 * }} AuthLoginResponse
 */

/**
 * @typedef {{
 *   acs_tkn: string;
 *   [key: string]: unknown;
 * }} AuthRefreshResponse
 */

/**
 * @typedef {{
 *   raw: string;
 *   value: string;
 * }} SignedCookieValue
 */

/**
 * @typedef {{
 *   key: "rfh_tkn";
 *   value: string;
 *   options: import("cookie").CookieSerializeOptions;
 * }} RefreshCookie
 */

/**
 * @typedef {{
 *   accessToken: string | null;
 *   hasRefreshToken: boolean;
 * }} SessionState
 */

/**
 * @typedef {{
 *   fetch: typeof fetch;
 * }} AuthFetchDeps
 */

/**
 * @typedef {AuthFetchDeps & {
 *   cookies: import("@sveltejs/kit").Cookies;
 * }} AuthRefreshDeps
 */

/**
 * @typedef {AuthFetchDeps & {
 *   cookies: import("@sveltejs/kit").Cookies;
 *   accessToken?: string | null;
 * }} AuthLogoutDeps
 */

/**
 * @typedef {{
 *   ok: true;
 *   data: AuthLoginResponse;
 *   status: number;
 *   headers: Headers;
 * }} AuthLoginSuccess
 */

/**
 * @typedef {{
 *   ok: false;
 *   error: AuthDomainError;
 * }} AuthFailure
 */

/**
 * @typedef {AuthLoginSuccess | AuthFailure} AuthLoginResult
 */

/**
 * @typedef {{
 *   ok: true;
 *   data: AuthLogoutResponse;
 *   status: number;
 *   headers: Headers;
 * }} AuthLogoutSuccess
 */

/**
 * @typedef {AuthLogoutSuccess | AuthFailure} AuthLogoutResult
 */

/**
 * @typedef {{
 *   ok: true;
 *   data: AuthLoginResponse;
 *   status: number;
 *   headers: Headers;
 * }} AuthSignupSuccess
 */

/**
 * @typedef {AuthSignupSuccess | AuthFailure} AuthSignupResult
 */

/**
 * @typedef {{
 *   ok: true;
 *   data: AuthRefreshResponse;
 *   status: number;
 *   headers: Headers;
 * }} AuthRefreshSuccess
 */

/**
 * @typedef {AuthRefreshSuccess | AuthFailure} AuthRefreshResult
 */

/**
 * @typedef {{
 *   ok: true;
 * }} TokenValidationSuccess
 */

/**
 * @typedef {{
 *   ok: false;
 *   error: AuthDomainError;
 * }} TokenValidationFailure
 */

/**
 * @typedef {TokenValidationSuccess | TokenValidationFailure} TokenValidationResult
 */

/**
 * @typedef {{
 *   isAuthenticated: boolean;
 *   isOnboarded: boolean;
 *   roles: string[];
 *   claims: Record<string, unknown> | null;
 * }} AuthViewerState
 */

export {};
