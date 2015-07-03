# Koa sample

Demonstrate how a koa application can be assemble.

## Controller

Controller is responsible for processing http requests and returning http responses.
A basic implementation looks like this :

```js

/**
 * Note : validator is a middleware factory
 * injected automatically by name.
 * You are free to inject your own factories this way
 */
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
      /**
       * like middleware factory, you can inject
       * any context-attached instance directly
       * in your handler
       */
      handler: function *(api) {
        this.body = yield {
          "foo": api({uri: "/foo"}),
          "bar": api({uri: "/bar"})
        };
      }
    }
  }
};
```


### About Injection

#### Avoid scoping boiler plate in your handler

Middleware are automatically injected into handler function. This allow to avoid
boiler plates related to function scoping and enhance testability

```js

// middleware
function * db(next) {
  this.db = function () {}
}

// route
{
  // db is injected using context.db
  handler: function *(db) {
    var obj = db.load(this.request.params.id)
  }
}

```

#### Use a specific middleware for a given route

You can use a specific middleware in your routes without the need to hardcode
require calls in your controller

```js

// app.js
router({
  controllerPaths: __dirname + '/controller'
  middlewarePaths: __dirname + '/lib/middleware' // this option will register all middleware factories in this folder
});

// in controller/main-controller.js
odule.exports = function(validator, geolocator) {

  return {
    'main': {
      path: '/',
      methods: ['get'],
      before: [
        geolocator() // returns a middleware responsible for ip lookup,
        validator(function *() {
          this.checkQuery('foo').notEmpty();
        })
      ],
      handler: function *(api, geolocation) {
        // geolocation now contains latitude and longitude 
      }
    }
  }
};
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



