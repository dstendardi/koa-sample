var PrettyError = require('pretty-error');

module.exports = {

  /**
   * Log errors
   *
   * @param {Object} err
   * @param {Object} ctx
   */
  'error': function (err, ctx) {

    ctx.logger({
      type: "server.error",
      preview: function (err, data) {

        /**
         * Configure pretty error
         * For development
         *
         * @type {PrettyError}
         */
        var pe = new PrettyError();
        pe.skipNodeFiles();
        pe.skipPackage('co');
        pe.appendStyle({

          // this is a simple selector to the element that says 'Error'
          'pretty-error > header > title > kind': {
            // which we can hide:
            display: 'none'
          },

          // the 'colon' after 'Error':
          'pretty-error > header > colon': {
            // we hide that too:
            display: 'none'
          },

          // our error message
          'pretty-error > header > message': {
            // let's change its color:
            color: 'bright-white',

            // we can use black, red, green, yellow, blue, magenta, cyan, white,
            // grey, bright-red, bright-green, bright-yellow, bright-blue,
            // bright-magenta, bright-cyan, and bright-white

            // we can also change the background color:
            background: 'red',

            // it understands paddings too!
            padding: '0 1' // top/bottom left/right
          }
        });

        return [data.path, data.status, "\n\n", pe.render(err)];
      }.bind(this, err),
      fields: {
        message: err.message,
        stack: err.stack,
        status: ctx.response.status,
        path: ctx.request.path
      }
    });
  },

  /**
   * Log api responses
   *
   * @param {Object} ctx
   * @param {Object} response
   */
  'api.response': function (ctx, response) {
    ctx.logger({
      type: "api.call",
      preview: "{path} - {statusCode} (+ {duration}ms)",
      fields: {
        duration: (new Date().getTime() - response.request.req.time),
        path: response.request.path,
        statusCode: response.statusCode
      }
    });
  },

  /**
   * Log http requests
   *
   * @param {Object} ctx
   * @param {Object} request
   */
  'server.http-request': function (ctx, request) {

    ctx.logger({
      type: "server.request",
      preview: "{path}",
      fields: {
        path: request.path,
        body: request.body
      }
    });
  },

  /**
   * Log http responses
   *
   * @param {Object} ctx
   * @param {Object} response
   */
  'server.http-response': function (ctx, response) {

    ctx.logger({
      type: "server.response",
      preview: "{status}",
      fields: {
        status: response.status
      }
    })
  }
};