var request = require('request-promise');

module.exports = function (options) {

  return function *(next) {
    this.api = request.defaults({
      json: true,
      baseUrl: options.baseUrl
    });
    yield next;
  }
};