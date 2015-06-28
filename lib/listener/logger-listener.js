var PrettyError = require('pretty-error');

module.exports = {

  /**
   * Log errors
   *
   * @param {Object} err
   * @param {Object} context
   */
  'error': function (err, context) {

    context.logger({
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
          'pretty-error > header > title > kind': {
            display: 'none'
          },
          'pretty-error > header > colon': {
            display: 'none'
          },
          'pretty-error > header > message': {
            color: 'bright-white',
            background: 'red',
            padding: '0 1'
          }
        });

        return [data.path, data.status, "\n\n", pe.render(err)];
      }.bind(this, err),
      fields: {
        message: err.message,
        stack: err.stack,
        status: context.response.status,
        path: context.request.path
      }
    });
  },

  /**
   * Log api responses
   *
   * @param {Object} context
   * @param {Object} response
   */
  'api.response': function (context, response) {
    context.logger({
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
   * @param {Object} context
   * @param {Object} request
   */
  'server.http-request': function (context, request) {

    context.logger({
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
   * @param {Object} context
   * @param {Object} response
   */
  'server.http-response': function (context, response) {

    context.logger({
      type: "server.response",
      preview: "{status}",
      fields: {
        status: response.status
      }
    })
  }
};