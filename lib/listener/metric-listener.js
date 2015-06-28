module.exports = {

  /**
   * mark api errors
   *
   * @param {Object} ctx
   * @param {Object} err
   */
  'api.error': function (ctx, err) {
    ctx.metrics('api').meter('error').mark();
  },

  /**
   * mark api responses
   *
   * @param {Object} ctx
   * @param {Object} response
   */
  'api.response': function (ctx, response) {
    ctx.metrics('api').meter('response').mark();
  },

  /**
   * Mark server request
   *
   * @param {Object} ctx
   * @param {Object} request
   */
  'server.http-request': function (ctx, request) {
    ctx.metrics('server').meter('http-request').mark();
  },

  /**
   * Mark server request
   *
   * @param {Object} ctx
   * @param {Object} response
   */
  'server.http-response': function (ctx, response) {
    ctx.metrics('server').meter('http-response').mark();
  }
};