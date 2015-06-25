var request = require('request-promise');
var Immutable = require('immutable');

module.exports = function (options) {

  return function *(next) {

    var id = this.id;
    var logger = this.logger;
    var metrics = this.metrics('api');

    /**
     * Returns an instrumented (metrics)
     * Request object
     *
     * @returns {*}
     */
    this.api = function () {
      var r = request.defaults({
        json: true,
        baseUrl: options.baseUrl,
        headers: {
          'Request-id': id
        },
        transform: function (body) {
          return Immutable.fromJS(body);
        }
      }).apply(request, arguments);

      r.on('request', function (request) {
        metrics.meter('requests').mark();
        request.time = new Date().getTime();
      });

      r.on('response', function (response) {
        metrics.meter('responses').mark();
        logger({
          action: "api.call",
          preview: "{path} - {statusCode} (+ {duration}ms)",
          data: {
            duration: (new Date().getTime() - response.request.req.time),
            path: response.request.path,
            statusCode: response.statusCode
          }
        });
      });

      r.on('error', function () {
        metrics.meter('errors').mark();
      });

      return r;
    };

    yield next;
  }
};