# `prod-dev` Feature Audit And Migration Plan

Date: 2026-02-27

## 1) Branch snapshot

- `main...prod-dev`: `0` behind / `69` ahead (`git rev-list --left-right --count main...prod-dev`)
- `origin/main...prod-dev`: `0` behind / `11` ahead (`git rev-list --left-right --count origin/main...prod-dev`)
- Actual file diff from `origin/main` is only:
  - `static/favicon.png` (modified)
  - `static/old-favicon-25.10.png` (added)
- Local `main` appears stale compared to `origin/main`, so migration should use `origin/main` as the integration base.

## 2) Unfinished or not fully set up features

## P0 blockers (fix first)

1. Broken resources detail route
   - `src/routes/resources/[id]/+page.svelte` uses `onMount` and `goto` without imports.
   - `src/routes/resources/[id]/+page.server.js` is empty.
   - Impact: route is non-functional and likely build/runtime-breaking.

2. Auth route wiring is incomplete
   - `src/hooks.server.js` redirects to `/auth/login`, but `/auth` routes are not present.
   - `src/lib/stores/jwt.svelte.js` calls `/auth/refresh`, route is not present.
   - Impact: profile-protected flow cannot work end-to-end.

3. Redirects in server hook are not thrown
   - `src/hooks.server.js:31`, `src/hooks.server.js:53`, `src/hooks.server.js:66` call `redirect(...)` instead of `throw redirect(...)`.
   - Impact: auth/legacy route redirects may silently fail.

4. Newsletter contact payload bug
   - `src/lib/server/newsletter/add-contact.js:23-24` references `data.first_name` / `data.last_name`, but `data` is undefined.
   - Impact: any call using `firstName` or `lastName` crashes.

5. Scholarship detail page always bounces away
   - `src/routes/scholarships/[id]/+page.svelte:8-10` immediately navigates back to `/scholarships`.
   - Impact: detail feature is effectively disabled.

## P1 incomplete feature wiring

1. Entire pages still mounted as Coming Soon UIs
   - `src/routes/community/+page.svelte`
   - `src/routes/scholarships/+page.svelte`
   - `src/routes/resources/+page.svelte`

2. Program map mode is placeholder-only
   - `src/lib/components/programs-page/views-types/MapView.svelte` says "Interactive map view coming soon".

3. Home page sections are coded but disabled
   - `src/routes/+page.svelte:107-110` comments out stats/activity/testimonials/HIW.

4. Profile data mapping still has mock/hardcoded pieces
   - `src/routes/profile/utils.js:26-33`, `:66-72` hardcodes ids, target text, user, submitted date.
   - `src/routes/profile/bookmarks/+page.server.js:48`, `:65` hardcodes ids.
   - `src/lib/components/profile-page/self-tabs/Dashboard.svelte:8,13` still reads from `../test`.

5. Scholarship/resources are still mock-data based
   - `src/lib/components/scholarship-single-page/ScholarshipView.svelte:28` imports `./testdata`.
   - `src/lib/components/resources/ResourcesView.svelte:6` imports `./test`.

## P2 quality risks (should clean before prod merge)

1. Assignment bug in program detail
   - `src/lib/components/programs-page/single-program-view/ProgramDetailView.svelte:122` uses `d.id = program.duration` (assignment), should be strict comparison.

2. Excess debug logging in server/client paths
   - `src/hooks.server.js`
   - `src/routes/profile/*`
   - `src/lib/server/gatherers/*`
   - `src/lib/server/newsletter/*`

3. Build/test not currently verifiable in this worktree without installing dependencies
   - `npm run build` failed with `vite: command not found`.

## 3) What needs to be implemented

1. Auth foundation
   - Add `/auth/login`, `/auth/signup`, `/auth/refresh` routes.
   - Make hooks use `throw redirect(...)`.
   - Use a real JWT verification secret/env and consistent cookie handling.

2. User-scoped data access
   - Replace static `ACS_TKN` usage in profile loaders with per-user token from cookies/locals.
   - Ensure all `/users/me/*` requests are tied to the signed-in user.

3. Complete blocked route features
   - Implement resources detail route load + UI.
   - Implement scholarship detail data loading (remove forced redirect).
   - Replace "Coming Soon" pages with real data-backed views.

4. Remove mock data and finalize API adapters
   - Replace `test.js`/`testdata.js` imports with server-loaded data props.
   - Normalize IDs and dates from backend responses.

5. Finish programs extras
   - Implement map view with a real map provider (Mapbox/Leaflet/Google Maps).
   - Fix duration label bug and confirm all tab fields match API schema.

6. Add release gates
   - Add at least smoke tests for critical routes.
   - Add lint/build/check commands to CI.

## 4) Best way to move `prod-dev` features back safely

Use phased integration from `origin/main`, not a direct merge into stale local `main`.

1. Prepare an integration branch from latest main
   - `git fetch origin`
   - `git checkout -b integrate/prod-dev origin/main`

2. Move features in slices (path-based or commit-range), one PR each
   - Slice A: stable pages already working (landing, postcards, programs core).
   - Slice B: profile + auth wiring.
   - Slice C: resources + scholarships + community.
   - Slice D: polish assets/SEO/favicon.

3. After each slice
   - Run install/build/tests.
   - Fix blockers before opening the next slice.
   - Keep PRs small so rollbacks are easy.

4. Merge order recommendation
   - A -> B -> C -> D
   - This keeps user-facing core value online while unfinished modules are completed in follow-up PRs.

