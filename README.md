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
 
// app.js
app.use(api({ // register a global middleware
  baseUrl: "http://localhost:4000"
}));

router({
  controllerPaths: __dirname + '/controller'
  middlewarePaths: __dirname + '/lib/middleware' // this option will register all middleware factories in this folder
});

// in controller/main-controller.js
module.exports = function(geolocator) {

  return {
    'main': {
      path: '/',
      methods: ['get'],
      before: [
        geolocator() // returns a middleware responsible for ip lookup,
      ],
      handler: function *(api, geolocation) {
        // is available globally
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



