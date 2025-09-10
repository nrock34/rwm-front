import * as Sentry from '@sentry/sveltekit';

Sentry.init({
  dsn: 'https://90bca2435b17c9549a67d488d46b796f@o4509991068106752.ingest.us.sentry.io/4509991069548544',

  tracesSampleRate: 1.0,

  // Enable logs to be sent to Sentry
  enableLogs: true,

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: import.meta.env.DEV,
});