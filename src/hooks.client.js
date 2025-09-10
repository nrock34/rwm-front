import * as Sentry from "@sentry/sveltekit";

// If you don't want to use Session Replay, remove the `Replay` integration,
// `replaysSessionSampleRate` and `replaysOnErrorSampleRate` options.
Sentry.init({
    dsn: "https://90bca2435b17c9549a67d488d46b796f@o4509991068106752.ingest.us.sentry.io/4509991069548544",
    tracesSampleRate: 1,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1,
    integrations: [Sentry.replayIntegration()],
    enableLogs: true
})


export const init = async () => {

}
export const handleError = Sentry.handleErrorWithSentry();