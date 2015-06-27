var assert = require('assert');
var moment = require('moment');
var colors = require('colors/safe');
var format = require('string-template');
var Immutable = require('immutable');
var PrettyError = require('pretty-error');
var os = require('os');

var logError = function (err, ctx) {

  assert(ctx.logger, "this listener expect logger-middleware to be configured")

  ctx.logger({
    type: "server.error",
    preview: function (err, data) {

      /**
       * Configure pretty error
       * For development
       *
       * @type {PrettyError}
       */
      var pe = new PrettyError();
      pe.skipNodeFiles();
      pe.skipPackage('co');
      pe.appendStyle({

        // this is a simple selector to the element that says 'Error'
        'pretty-error > header > title > kind': {
          // which we can hide:
          display: 'none'
        },

        // the 'colon' after 'Error':
        'pretty-error > header > colon': {
          // we hide that too:
          display: 'none'
        },

        // our error message
        'pretty-error > header > message': {
          // let's change its color:
          color: 'bright-white',

          // we can use black, red, green, yellow, blue, magenta, cyan, white,
          // grey, bright-red, bright-green, bright-yellow, bright-blue,
          // bright-magenta, bright-cyan, and bright-white

          // we can also change the background color:
          background: 'red',

          // it understands paddings too!
          padding: '0 1' // top/bottom left/right
        }
      });

      return [data.path, data.status, "\n\n", pe.render(err)];
    }.bind(this, err),
    fields: {
      message: err.message,
      stack: err.stack,
      status: ctx.response.status,
      path: ctx.request.path
    }
  });
};


var renderers = module.exports.renderers = {

  /**
   * Parameters for renderer
   *
   * @typedef {Object} RendererParam
   * @property {String|Function} preview a string-template chain
   * @property {String} id
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
  PREVIEW: function (params) {

    var preview = params.preview || function (data) {
        return JSON.stringify(data);
      };

    var previewOutput = preview instanceof Function ?
      preview(params.fields) : format(preview, params.fields);

    return [
      colors.blue(params.id.substring(0, 8)),
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
  FULL: function (params) {
    return JSON.stringify({
      'id': params.id,
      'timestamp': params.timestamp,
      'type': params.type,
      'fields': params.fields
    });
  }
};

/**
 * Configure the logger and the middleware
 *
 * @param {Object} app - koa application
 * @param {Object} options -
 * @param {Function} options.renderer - customize the logging format
 *
 * @returns {Function}
 */
module.exports = function (app, options) {

  var defaults = {
    renderer: renderers.PREVIEW
  };

  options = Immutable.Map(defaults).merge(options).toJS();


  /**
   * Logger Function
   *
   * @param {String} params.type type of log
   * @param {String} params.field fields
   */
  var logger = function logger(params) {

    assert(params.type, "type is required");

    if (this.id && !params.id) {
      params.id = this.id;
    }

    if (!params.timestamp) {
      params.timestamp = moment().format();
    }

    if (!params.hostname) {
      params.hostname = os.hostname()
    }

    var output = options.renderer.call(this, params);

    app.emit("log", output);
  };


  app.on('log', function (output) {
    process.stdout.write(output + "\n");
  });

  app.on('error', logError);

  return function *(next) {

    this.logger = logger.bind(this);

    this.logger({
      type: "server.request",
      preview: "{path}",
      fields: {
        path: this.request.path,
        body: this.body
      }
    });

    yield next;

    this.logger({
      type: "server.response",
      preview: "{status}",
      fields: {
        status: this.response.status
      }
    });
  };
};