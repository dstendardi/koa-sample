var koa = require('koa')
  , router = require('koa-router')()
  , request = require('request-promise').defaults({json:true})
  , bodyParser = require('koa-bodyparser')
  , json = require('koa-json')
  , assert = require('assert')
  , oneerror = require('koa-onerror')
  , Immutable = require('immutable');


var app = module.exports = koa();
require('require-all')({
  dirname: __dirname + '/controller'
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


oneerror(app);
app.use(function *(next) {
  this.api = request;
  yield next;
});

app.use(json());
app.use(bodyParser());
app.use(router.routes());



app.listen(3000);
if (!module.parent) app.listen(3000);