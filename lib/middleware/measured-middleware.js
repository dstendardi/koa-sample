var metrics = require('measured');
var Immutable = require('immutable');

module.exports = function measured() {

  var collections = {};
  var accessor = function (name) {
    if (!collections[name]) {
      collections[name] = new metrics.Collection(name);
    }
    return collections[name]
  };

  return function *(next) {

    this.metrics = accessor;

    if ("/metrics" === this.request.path) {
      this.body = Immutable
        .Map(collections)
        .map(function (v) {
          return v.toJSON();
        });
    } else {
      this.metrics('http').meter('requests_per_seconds').mark();
      yield next;
    }

  };
};