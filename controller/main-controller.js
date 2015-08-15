var Joi = require('joi');

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
      this.body = yield {
        "foo": this.api({uri: "/foo"}),
        "bar": this.api({uri: "/bar"})
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
};