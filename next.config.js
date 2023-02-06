/**
 * Wrap sentry config with our app config
 */

// const { withSentryConfig } = require('@sentry/nextjs');

const appConfig = {
    reactStrictMode: true,
};

const sentryConfig = {
    silent: true, // Suppresses all logs
};

// ensure sentryConfig is last to expose source maps appropiately
// module.exports = withSentryConfig(appConfig, sentryConfig);
module.exports = appConfig;
