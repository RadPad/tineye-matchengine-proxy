'use strict'

/**
 * New Relic agent configuration.
 *
 * See lib/config.defaults.js in the agent distribution for a more complete
 * description of configuration variables and their potential values.
 */
exports.config = {
  agent_enabled: process.env.NEWRELIC_ENABLED || false,
  app_name: process.env.NEWRELIC_APP_NAME || 'dev-radpad-tineye',
  license_key: process.env.NEWRELIC_LICENSE_KEY || 'license key here',
  logging: {
    /**
     * Level at which to log. 'trace' is most useful to New Relic when diagnosing
     * issues with the agent, 'info' and higher will impose the least overhead on
     * production applications.
     */
    level: 'info'
  }
}
