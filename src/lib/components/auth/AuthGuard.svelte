<script>
    import { goto } from "$app/navigation";
    import { page } from "$app/state";
    import {
        ONBOARDED_ROLE,
        getMissingRoles,
        hasRoleAccess,
        isMissingOnlyOnboardedRole,
        normalizeRoles,
        resolveRequiredRoles
    } from "$lib/auth/rbac.js";
    import { buildLoginRedirectUrl, buildOnboardingRedirectUrl } from "$lib/auth/redirect.js";
    import AuthGuardBlockedState from "$lib/components/auth/AuthGuardBlockedState.svelte";

    let {
        children,
        fallback,
        requiresAuth = true,
        requiresOnboarded = false,
        role = null,
        roles = [],
        roleMatch = "any",
        loginRedirect = "/auth/login",
        onboardingRedirect = "/onboarding",
        unauthorizedRedirect = "",
        hideUntilAuthorized = false,
        blockedComponent = null,
        renderBlockedPage = false,
        redirectOnBlock = undefined,
        blockedTitle = "",
        blockedMessage = "",
        blockedActionLabel = ""
    } = $props();

    const viewer = $derived(
        page.data?.auth ?? { isAuthenticated: false, isOnboarded: false, roles: [], claims: null }
    );
    const viewerRoles = $derived(normalizeRoles(viewer.roles));
    const requiredRoles = $derived(
        resolveRequiredRoles({
            role,
            roles: requiresOnboarded ? [...roles, ONBOARDED_ROLE] : roles
        })
    );
    const matchMode = $derived(roleMatch === "all" ? "all" : "any");
    const isAuthenticated = $derived(Boolean(viewer.isAuthenticated));
    const hasRequiredRoles = $derived(
        hasRoleAccess(viewerRoles, requiredRoles, matchMode)
    );
    const missingRequiredRoles = $derived(getMissingRoles(viewerRoles, requiredRoles));
    const isMissingOnboardingOnly = $derived(
        Boolean(isAuthenticated) && isMissingOnlyOnboardedRole(viewerRoles, requiredRoles)
    );
    const canRender = $derived(
        (!requiresAuth || isAuthenticated) && hasRequiredRoles
    );
    const loginDestination = $derived(
        loginRedirect ? buildLoginRedirectUrl(page.url, { loginPath: loginRedirect }) : ""
    );
    const onboardingDestination = $derived(
        onboardingRedirect
            ? buildOnboardingRedirectUrl(page.url, { onboardingPath: onboardingRedirect })
            : ""
    );
    const shouldRedirectOnBlock = $derived.by(() => {
        if (typeof redirectOnBlock === "boolean") return redirectOnBlock;
        return false;
    });
    const showsInlineBlockedState = $derived(
        !hideUntilAuthorized && (
            Boolean(fallback) || Boolean(blockedComponent) || renderBlockedPage || !shouldRedirectOnBlock
        )
    );
    const BlockedComponent = $derived(blockedComponent ?? AuthGuardBlockedState);

    const blockReason = $derived.by(() => {
        if (canRender) return null;
        if (requiresAuth && !isAuthenticated) return "not_authenticated";
        if (isMissingOnboardingOnly) return "missing_onboarding";
        if (!hasRequiredRoles) return "missing_role";
        return "blocked";
    });

    const resolvedBlockedTitle = $derived.by(() => {
        if (blockedTitle) return blockedTitle;

        if (blockReason === "not_authenticated") return "Sign in required";
        if (blockReason === "missing_onboarding") return "Finish onboarding";
        if (blockReason === "missing_role") return "You do not have access";
        return "This page is unavailable";
    });

    const resolvedBlockedMessage = $derived.by(() => {
        if (blockedMessage) return blockedMessage;

        if (blockReason === "not_authenticated") {
            return "You need to sign in before you can view this page.";
        }

        if (blockReason === "missing_role") {
            return "Your account does not have the permissions required to view this page.";
        }

        if (blockReason === "missing_onboarding") {
            return "Finish onboarding to unlock this page.";
        }

        return "This page is unavailable right now.";
    });

    const resolvedBlockedActionLabel = $derived.by(() => {
        if (blockedActionLabel) return blockedActionLabel;

        if (blockReason === "not_authenticated") return "Sign in";
        if (blockReason === "missing_onboarding") return "Continue onboarding";
        if (blockReason === "missing_role") {
            return unauthorizedRedirect ? "Continue" : "Go back";
        }

        return "Go home";
    });

    async function handleBlockedAction() {
        if (typeof window === "undefined") return;

        if (blockReason === "not_authenticated" && loginDestination) {
            await goto(loginDestination);
            return;
        }

        if (blockReason === "missing_onboarding" && onboardingDestination) {
            await goto(onboardingDestination);
            return;
        }

        if (blockReason === "missing_role" && unauthorizedRedirect) {
            await goto(unauthorizedRedirect);
            return;
        }

        if (window.history.length > 1) {
            window.history.back();
            return;
        }

        await goto("/");
    }

    $effect(() => {
        if (typeof window === "undefined") return;
        if (!blockReason) return;
        if (!shouldRedirectOnBlock && blockReason !== "missing_onboarding") return;

        if (blockReason === "not_authenticated" && loginDestination) {
            goto(loginDestination);
            return;
        }

        if (blockReason === "missing_onboarding" && onboardingDestination) {
            goto(onboardingDestination);
            return;
        }

        if (blockReason === "missing_role" && unauthorizedRedirect) {
            goto(unauthorizedRedirect);
        }
    });
</script>

{#if canRender}
    {#if children}
        {@render children()}
    {/if}
{:else if fallback}
    {@render fallback({
        reason: blockReason,
        isAuthenticated,
        viewerRoles,
        requiredRoles,
        missingRequiredRoles,
        title: resolvedBlockedTitle,
        message: resolvedBlockedMessage,
        actionLabel: resolvedBlockedActionLabel,
        onClick: handleBlockedAction
    })}
{:else if showsInlineBlockedState}
    <BlockedComponent
        reason={blockReason}
        {isAuthenticated}
        {viewerRoles}
        {requiredRoles}
        {missingRequiredRoles}
        title={resolvedBlockedTitle}
        message={resolvedBlockedMessage}
        actionLabel={resolvedBlockedActionLabel}
        onClick={handleBlockedAction}
    />
{:else if !hideUntilAuthorized}
    <div class="rounded-md border border-border bg-muted/40 p-4 text-sm text-muted-foreground">
        {#if blockReason === "not_authenticated"}
            You must be logged in to view this section.
        {:else if blockReason === "missing_role"}
            Your account does not have the required role for this section.
        {:else}
            Access to this section is unavailable.
        {/if}
    </div>
{/if}
