import * as Sentry from '@sentry/sveltekit';

Sentry.initCloudflareSentryHandle({
  dsn: 'https://90bca2435b17c9549a67d488d46b796f@o4509991068106752.ingest.us.sentry.io/4509991069548544',

  enabled: import.meta.env.PROD,
  environment: import.meta.env.MODE,
  tracesSampleRate: 0.1,
  enableLogs: false,

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: import.meta.env.DEV,
});
