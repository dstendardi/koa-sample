# Koa sample

Demonstrate how a koa application can be assemble.

## Controller

Controller is responsible for processing http requests and returning http responses.
A basic implementation looks like this :

```js

module.exports['main'] = {
  path: '/',
  methods: ['get'],
  validate: function *() {
    this.checkQuery('foo').notEmpty();
  },
  handler: function *(api) {
    this.body = yield {
      "foo": api({uri: "/foo"}),
      "bar": api({uri: "/bar"})
    };
  }
};
```

### API

| attribute | type     | description                                         |
|-----------|----------|-----------------------------------------------------|
| handler   | Function | A generator responsible for the transaction         |
| validate  | Function | A generator function responsible for validation     |
| methods   | Array    | A list of http methods accepted for this route      |
| path      | String   | The http request path that match the route          |


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

### API

| attribute | type   | description                                         |
|-----------|--------|-----------------------------------------------------|
| type      | string | A simple name describing which action is performed  |
| preview   | string | How to render extra data in development environment |
| fields    | object | A map with specific data to add to the log entry    |


### Request correlation

Because the logger middleware depends on [koa-request-id](https://github.com/segmentio/koa-request-id), the request id is automatically
added to all log entries in the `id` property.



