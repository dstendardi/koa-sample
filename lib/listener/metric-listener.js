module.exports = {

  /**
   * mark api errors
   *
   * @param {Object} context
   * @param {Object} err
   */
  'api.error': function (context, err) {
    context.metrics('api').meter('error').mark();
  },

  /**
   * mark api responses
   *
   * @param {Object} context
   * @param {Object} response
   */
  'api.response': function (context, response) {
    context.metrics('api').meter('response.' + response.status).mark();
  },

  /**
   * Mark server request
   *
   * @param {Object} context
   * @param {Object} request
   */
  'server.http-request': function (context, request) {
    context.metrics('server').meter('http-request.' + context.method).mark();
  },

  /**
   * Mark server request
   *
   * @param {Object} context
   * @param {Object} response
   */
  'server.http-response': function (context, response) {
    context.metrics('server').meter('http-response.' + response.status).mark();
  },

  /**
   * Mark a specific validation error
   *
   * @param context
   * @param location
   * @param error
   */
  'app.error.validation': function (context, location, error) {
    context.metrics('app').meter(['error', 'validation', context.route.name, location].join('.')).mark()
  }
};