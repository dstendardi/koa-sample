# Koa sample

Demonstrate how a koa application can be assemble.

## Controller

Controller is responsible for processing http requests and returning http responses.
A basic implementation looks like this :

*./app.js*

```js
app.use(api({ // register a global middleware
  baseUrl: "http://localhost:4000"
}));

router({
  controllerPaths: __dirname + '/controller',
});
```

*./controller/main-controller.js*

```js
module.exports = {
  'main': {
    path: '/',
    methods: ['get'],
    validate: {
      query: {
        foo: Joi.string().required()
      }
    },
    handler: function *() {
      // this.api is available globally because of app.use()
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


## Metrics

The following metrics are available out of the box :

| Metric collection | Metric key                          |
| ------------------| ----------------------------------- |
| api               | error                               |
| api               | response.{status}                   |
| server            | http-request.{method}               |
| server            | http-response.{status}              |
| app               | error.validation.{route}.{location} |

