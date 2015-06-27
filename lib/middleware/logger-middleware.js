var assert = require('assert');
var moment = require('moment');
var colors = require('colors/safe');
var format = require('string-template');
var Immutable = require('immutable');
var PrettyError = require('pretty-error');

var renderers = {

  /**
   * In development, can be used to display only
   * a onliner log
   *
   * @param params.preview {String|Function} a string-template chain
   * @param params.data
   * @returns {Array.<String>}
   * @constructor
   */
  PREVIEW: function (params) {


    var preview = params.preview || function (data) {
        return JSON.stringify(data);
      };

    var p = preview instanceof Function ?
      preview(params.data) : format(preview, params.data);

    return [
      colors.blue(this.id.substring(0, 8)),
      colors.cyan(params.date || moment().format()),
      colors.magenta(params.action)
    ].concat(p);

  },

  /**
   * In production display the full log in raw json
   *
   * @param params
   * @returns {*[]}
   * @constructor
   */
  FULL: function (params) {
    return [params];
  }
};

/**
 * Provide the middleware instance
 *
 * @param logger
 * @returns {Function}
 */
var middleware = function (logger) {

  return function *(next) {

    this.logger = logger.bind(this);

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

  }
};

/**
 * Configure the logger and the middleware
 *
 * @param {Object} options
 *   - renderer {Function} customise the logging output
 *
 * @returns {Function}
 */
module.exports = function (app, options) {

  app.on('error', function (err, ctx) {

    logger.call(ctx, {
      action: "server.error",
      preview: function (data) {

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

        return [data.path, data.status, "\n\n", pe.render(data.error)];
      },
      data: {
        error: err,
        status: ctx.response.status,
        path: ctx.request.path
      }
    });
  });

  var defaults = {
    renderer: renderers.PREVIEW
  };

  options = Immutable.Map(defaults).merge(options).toJS();

  var logger = function (params) {

    assert(this.id && this.id.length, "request id should be present in context");
    assert(params.action, "action is required");
    params.id = this.id;

    console.log.apply(console, options.renderer.call(this, params));
  };

  return middleware(logger);
};


module.exports.renderers = renderers;