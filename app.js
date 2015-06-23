var koa = require('koa')
  , bodyParser = require('koa-bodyparser')
  , json = require('koa-json')
  , validator = require('koa-validator')
  , requestId = require('koa-request-id')
  , router = require('./lib/router')
  , request = require('./lib/middleware/api-middleware')
  , measured = require('./lib/middleware/measured-middleware')
  , oneerror = require('koa-onerror');


var app = module.exports = koa();

// error handling
oneerror(app);

// generic middleware
app.use(requestId());
app.use(measured());
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