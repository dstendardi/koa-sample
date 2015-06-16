var metrics = require('measured');
var Immutable = require('immutable');

module.exports = function measured() {
  var http = new metrics.Collection('http');
  var app = new metrics.Collection('app');

  return function *(next) {
    this.metrics = {
      http: http,
      app: app
    };

    if ("/metrics" === this.request.path) {
      this.body = Immutable
        .Map()
        .merge(this.metrics.http.toJSON())
        .merge(this.metrics.app.toJSON());

    } else {
      http.meter('requests_per_seconds').mark();
      yield next;
    }

  };
};