var assert = require('assert');
var moment = require('moment');
var colors = require('colors/safe');
var format = require('string-template');
var uuid = require('node-uuid');
var _  = require('lodash');
var os = require('os');

var renderers = module.exports.renderers = {

  /**
   * Parameters for renderer
   *
   * @typedef {Object} RendererParam
   * @property {String|Function} preview a string-template chain
   * @property {String} correlationId
   * @property  {String} type
   * @property  {Number} timestamp
   * @property  {Object} fields
   */

  /**
   * In development, can be used to display only a one-liner log
   * with fancy colors
   *
   * @param {RendererParam} params
   * @returns String output
   * @constructor
   */
  preview: function (params) {

    var preview = params.preview || function (data) {
        return JSON.stringify(data);
      };

    var previewOutput = preview instanceof Function ?
      preview(params.fields) : format(preview, params.fields);

    return [
      colors.blue(params.correlationId.substring(0, 8)),
      colors.cyan(params.timestamp),
      colors.magenta(params.type)
    ].concat(previewOutput).join(" ");
  },

  /**
   * In production display the full log in raw json
   *
   * @param params
   * @returns {*[]}
   * @constructor
   */
  full: function (params) {
    return JSON.stringify({
      'correlationId': params.correlationId,
      'timestamp': params.timestamp,
      'type': params.type,
      'fields': params.fields
    });
  }
};

/**
 * Configure the logger and the middleware
 *
 * @param {Object} options - options
 * @param {Function} options.renderer - customize the logging format
 *
 * @returns {Function}
 */
module.exports = function factory(app, options) {

  options = _.defaults(options || {}, {
    renderer: renderers.preview
  });

  /**
   * Logger Function
   *
   * @param {String} params.type type of log
   * @param {String} params.field fields
   */
  function logger(params) {

    assert(params.type, "type is required");

    params.id = uuid.v4();

    if (!params.correlationId) {
      params.correlationId = this.id || uuid.v4();
    }

    if (!params.timestamp) {
      params.timestamp = moment().format();
    }

    if (!params.hostname) {
      params.hostname = os.hostname()
    }

    var output = options.renderer.call(this, params);

    app.emit("log", output);
  }

  app.on('log', function (output) {
    process.stdout.write(output + "\n");
  });

  return function * loggerMiddleware(next) {

    this.logger = logger.bind(this);

    yield next;
  };
};