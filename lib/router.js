var requireAll = require('require-all');
var assert = require('assert');
var router = require('koa-router')();
var _ = require('lodash');


/**
 * Resolve all the controllers
 *
 *
 * @returns {Function}
 */
function resolve(routes) {

  return _.map(routes, function (options, name) {

      assert(name, "name is required");
      assert(_.isString(options.path), "route path is required");
      assert(_.isArray(options.methods), "methods is required");
      assert(_.isFunction(options.handler), "handler is required");

      // route
    var args = [options.path, options.methods];

      // handlers
    var middlewares = [];

    if (options.validate) {
      var validator = require('./middleware/validator-middleware');
      middlewares.push(validator(options.validate))
    }

    middlewares.push(options.handler);

      args.push(middlewares);

      // options
      args.push({name: name});

      return args;
    });
}

/**
 * Resolve controllers located in
 * options.controllerPath
 *
 * @param {Array<String>|String} parameterOptions.controllers path
 * @param {Array<String>|String} parameterOptions.middlewares path
 * @returns {*}
 */
module.exports = function (parameterOptions) {

  var options = _.defaults(parameterOptions, {
    middlewarePaths: __dirname + '/middleware'
  });

  var controllers = requireAll({
    dirname: options.controllerPaths
    , filter: /(.+\-controller)\.js$/
    , resolve: resolve
  });

  _.forIn(controllers, function (value) {
    value.forEach(function (params) {
      router.register.apply(router, params);
    })
  });

  return router.routes();
};