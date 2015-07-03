var metrics = require('measured');
var Immutable = require('immutable');

module.exports = function factory() {

  var collections = {};

  function accessor(name) {
    if (!collections[name]) {
      collections[name] = new metrics.Collection(name);
    }
    return collections[name]
  }

  return function * measuredMiddleware(next) {

    this.metrics = accessor.bind(this);

    if ("/metrics" === this.request.path) {
      this.body = Immutable
        .Map(collections)
        .map(function (v) {
          return v.toJSON();
        });
    } else {
      yield next;
    }

  };
};