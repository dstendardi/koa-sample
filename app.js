var koa = require('koa')
  , request = require('request-promise').defaults({json:true})
  , bodyParser = require('koa-bodyparser')
  , json = require('koa-json')
  , router = require('./lib/router')
  , oneerror = require('koa-onerror');


var app = module.exports = koa();

// error handling
oneerror(app);

// generic middleware
app.use(json());
app.use(bodyParser());

// app middleware
app.use(function *(next) {
  this.api = request;
  yield next;
});

// routes
var routes = router( __dirname + '/controller');

app.use(routes);

if (!module.parent) app.listen(3000);