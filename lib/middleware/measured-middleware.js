var metrics = require('measured');
var Immutable = require('immutable');

module.exports = function measured() {

  var collections = {};
  var accessor = function(name) {
    return collections[name ] || new metrics.Collection(name);
  };

  return function *(next) {

    this.metrics = accessor;

    if ("/metrics" === this.request.path) {
      this.body = Immutable
        .Map()
        .merge(this.metrics.http.toJSON())
        .merge(this.metrics.app.toJSON());

    } else {
      this.metrics('http').meter('requests_per_seconds').mark();
      yield next;
    }

  };
};