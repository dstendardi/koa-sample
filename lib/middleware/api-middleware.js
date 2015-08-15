var request = require('request-promise');
var Immutable = require('immutable');

module.exports = function factory(options) {

  /**
   * Returns an instrumented (metrics)
   * Request object
   *
   * @returns {*}
   */
  function accessor() {

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

    r.on('request', app.emit.bind(app, 'api.request', this));
    r.on('response', app.emit.bind(app, 'api.response', this));
    r.on('error', app.emit.bind(app, 'api.error', this));

    return r;
  }

  return function * apiMiddleware(next) {

    this.api = accessor.bind(this);

    yield next;
  }
};