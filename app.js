var koa = require('koa')
  , bodyParser = require('koa-bodyparser')
  , json = require('koa-json')
  , router = require('./lib/router')
  , request = require('./lib/middleware/api-middleware')
  , validator = require('koa-validator')
  , oneerror = require('koa-onerror');


var app = module.exports = koa();

// error handling
oneerror(app);

// generic middleware
app.use(json());
app.use(bodyParser());
app.use(validator());

// app middleware
app.use(request({
  baseUrl: "http://localhost:4000"
}));

// routes
var routes = router( __dirname + '/controller');

app.use(routes);

if (!module.parent) app.listen(3000);