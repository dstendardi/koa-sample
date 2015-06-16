var requireAll = require('require-all');
var assert = require('assert');
var Immutable = require('immutable');
var router = require('koa-router')();

module.exports = function (path) {
  requireAll({
    dirname: path
    , filter: /(.+\-controller)\.js$/
    , resolve: function (routes) {

      Immutable.Map(routes)
        .forEach(function (options, name) {

          assert(name, "name is required");
          assert(options.path, "path is required");
          assert(options.methods, "methods is required");
          assert(options.handler, "handler is required");

          // route
          var args = [options.path, options.methods];

          // handlers
          args.push(options.handler);

          // options
          args.push({name: name});

          router.register.apply(router, args);
        });
    }
  });

  return router.routes();
};