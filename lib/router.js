var requireAll = require('require-all');
var assert = require('assert');
var router = require('koa-router')();
var fnArgs = require('fn-args');
var _ = require('lodash');


/**
 * Inject middleware factories (higher order functions)
 * into the controller function
 *
 * @param {Object} middlewares
 * @returns {Function}
 */
function inject(middlewares) {

  return function doInject(fn) {

    assert(_.isFunction(fn), "Controller should be a function");

    var argNames = fnArgs(fn);
    var result = fn.apply(this, argNames.map(function (arg) {
      return middlewares[arg];
    }.bind(this)));

    assert(_.isObject(result), "Controller should resturn an object");

    return result;
  }
}


/**
 * Resolve all the controllers
 *
 *
 * @returns {Function}
 */
function resolve() {

  /**
   * Inject existing middleware into a middleware
   * function.
   *
   * For example if koa context contains a property
   * "logger", then middleware having a parameter
   * named logger will have it's instance automatically
   * injected.
   *
   * @param {Function} middleware
   * @returns {Function}
   */
  function wrap(middleware) {
    var argNames = fnArgs(middleware);
    return function *() {
      return yield middleware.apply(this, argNames.map(function (arg) {
        return this[arg];
      }.bind(this)));
    }
  }

  return function doResolve(routes) {

    return _.map(routes, function (pOptions, name) {

      var options = _.defaults(pOptions, {
        before: [],
        after: []
      });

      assert(name, "name is required");
      assert(_.isString(options.path), "route path is required");
      assert(_.isArray(options.methods), "methods is required");
      assert(_.isFunction(options.handler), "handler is required");
      assert(_.isArray(options.before), "before should be an array of middlewares");

      // route
      var args = [pOptions.path, options.methods];

      // handlers
      var middlewares = _.clone(options.before);

      middlewares.push(wrap(options.handler));

      args.push(middlewares);

      // options
      args.push({name: name});

      return args;
    });
  }
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

  var middlewares = requireAll({
    dirname: options.middlewarePaths
    , filter: /(.+\-middleware)\.js$/
    , map: function (name, path) {
      var withoutSuffix = name.replace(/\-middleware$/, '');
      return _.camelCase(withoutSuffix)
    }
  });

  var controllers = requireAll({
    dirname: options.controllerPaths
    , filter: /(.+\-controller)\.js$/
    , resolve: _.flow(
      inject(middlewares),
      resolve()
    )
  });

  _.forIn(controllers, function (value) {
    value.forEach(function (params) {
      router.register.apply(router, params);
    })
  });

  return router.routes();
};