var koa = require('koa')
  , bodyParser = require('koa-bodyparser')
  , json = require('koa-json')
  , validator = require('koa-validator')
  , requestId = require('koa-request-id')
  , router = require('./lib/router')
  , api = require('./lib/middleware/api-middleware')
  , measured = require('./lib/middleware/measured-middleware')
  , logger = require('./lib/middleware/logger-middleware')
  , error = require('koa-error');

var app = module.exports = koa();

// generic middleware
app.use(error());
app.use(requestId());
app.use(logger(app));
app.use(measured());
app.use(json());
app.use(bodyParser());
app.use(validator());

// app middleware
app.use(api({
  baseUrl: "http://localhost:4000"
}));

// routes
var routes = router( __dirname + '/controller');

app.use(routes);

if (!module.parent) app.listen(3000);