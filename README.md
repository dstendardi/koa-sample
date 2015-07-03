# Koa sample

Demonstrate how a koa application can be assemble.

## Controller

Controller is responsible for processing http requests and returning http responses.
A basic implementation looks like this :

```js

module.exports = function(validator) {

  return {
    'main': {
      path: '/',
      methods: ['get'],
      before: [
        validator(function *() {
          this.checkQuery('foo').notEmpty();
        })
      ],
      handler: function *(api) {
        this.body = yield {
          "foo": api({uri: "/foo"}),
          "bar": api({uri: "/bar"})
        };
      }
    },
    'exception': {
      path: '/exception',
      methods: ['get'],
      handler: function *() {
        throw new Error("error message");
      }
    }
  }
};
```


### Injection

Middleware are automatically injected into handler function. This allow to avoid
boiler plates related to function scoping and enhance testability

```js

// middleware
function * db(next) {
  this.db = function () {}
}

// controller
module.exports['main'] = {
  handler: function *(db) {
    var obj = db.load(this.request.params.id)
  }
}

```


## Logging

Logging relays on console.log, following the [twelve factor principle](http://12factor.net/logs).

```js

this.logger({
  type: 'foo.bar',
  preview: '{bar}',
  fields: {
    'bar': 'foo'
  }
});
```

In production, logs are serialized as json for machine processing (logstash, loggly etc...).

In development, the preview attributes tells to the logger how to output extra parameters :

![](https://github.com/dstendardi/koa-sample/blob/master/doc/img/logging.png)


### Request correlation

Because the logger middleware depends on [koa-request-id](https://github.com/segmentio/koa-request-id), the request id is automatically
added to all log entries in the `id` property.



