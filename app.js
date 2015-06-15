var koa = require('koa')
  , request = require('request-promise').defaults({json:true})
  , router = require('koa-router')()
  , bodyParser = require('koa-bodyparser')
  , json = require('koa-json');


var app = module.exports = koa();

router.get('/', function *() {

  this.body = yield {
    "foo": request.get("http://localhost:4000/foo"),
    "bar": request.get("http://localhost:4000/bar")
  };
  
});

app.use(json());
app.use(bodyParser());
app.use(router.routes());


app.listen(3000);
if (!module.parent) app.listen(3000);