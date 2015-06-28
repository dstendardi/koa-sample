var request = require('request-promise');
var Immutable = require('immutable');

module.exports = function (options) {

  /**
   * Returns an instrumented (metrics)
   * Request object
   *
   * @returns {*}
   */
  var api = function () {

    var ctx = this;
    var app = this.app;

    var r = request.defaults({
      json: true,
      baseUrl: options.baseUrl,
      headers: {
        'Request-id': ctx.id
      },
      transform: function (body) {
        return Immutable.fromJS(body);
      }
    }).apply(request, arguments);

    r.on('request', function (request) {
      request.time = new Date().getTime();
    });

    r.on('request', app.emit.bind(app, 'api.request', ctx));
    r.on('response', app.emit.bind(app, 'api.response', ctx));
    r.on('error', app.emit.bind(app, 'api.error', ctx));

    return r;
  };

  return function *(next) {

    this.api = api.bind(this);

    yield next;
  }
};