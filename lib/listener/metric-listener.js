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
    context.metrics('api').meter('response').mark();
  },

  /**
   * Mark server request
   *
   * @param {Object} context
   * @param {Object} request
   */
  'server.http-request': function (context, request) {
    context.metrics('server').meter('http-request').mark();
  },

  /**
   * Mark server request
   *
   * @param {Object} context
   * @param {Object} response
   */
  'server.http-response': function (context, response) {
    context.metrics('server').meter('http-response').mark();
  }
};