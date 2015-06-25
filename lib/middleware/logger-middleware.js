var assert = require('assert');
var moment = require('moment');
var colors = require('colors/safe');
var format = require('string-template');

module.exports = function () {

  return function *(next) {

    var id = this.id;
    assert(id && id.length, "request id should be present in context");

    this.logger = function (params) {

      assert(params.action, "action is required");

      var p = params.preview instanceof Function ? params.preview(params.data) : format(params.preview, params.data);

      var args = [
        colors.blue(id.substring(0, 8)),
        colors.cyan(params.date || moment().format()),
        colors.magenta(params.action)
      ].concat(p);

      console.log.apply(console, args);
    };

    this.logger({
      action: "server.request",
      preview: "{path}",
      data: {
        path: this.request.path,
        body: this.body
      }
    });

    yield next;

    this.logger({
      action: "server.response",
      preview: "{status}",
      data: {
        status: this.response.status
      }
    });
  };
};