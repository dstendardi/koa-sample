var request = require('request-promise');
var Immutable = require('immutable');

module.exports = function (options) {


  return function *(next) {

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
        transform: function (body) {
          return Immutable.fromJS(body);
        }
      }).apply(request, arguments);

      r.on('response', function () {
        metrics.meter('responses').mark();
      });

      r.on('error', function () {
        metrics.meter('errors').mark();
      });

      return r;
    };

    yield next;
  }
};